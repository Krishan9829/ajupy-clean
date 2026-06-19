export const dynamic = "force-dynamic";

import OpenAI from "openai";
import { NextResponse } from "next/server";

// 🔥 CONFIG
const USE_DEMO = process.env.USE_DEMO === "true";

// 🔥 RATE LIMIT
const rateMap = new Map<string, number>();

// 🔥 TIMEOUT
const withTimeout = async <T>(
  promise: Promise<T>,
  ms = 20000
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), ms)
    ),
  ]);
};

// ✅ GET (for testing)
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "API is working. Use POST",
  });
}

export async function POST(req: Request) {
  try {
    // 🔥 IP RATE LIMIT
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const now = Date.now();
    const last = rateMap.get(ip) || 0;

    if (now - last < 1000) {
      return NextResponse.json(
        { success: false, error: "Too many requests" },
        { status: 429 }
      );
    }

    rateMap.set(ip, now);

    // 🔥 BODY
    const body = await req.json();
    let { prompt, style } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid prompt" },
        { status: 400 }
      );
    }

    prompt = prompt.trim().slice(0, 200);

    const allowedStyles = ["bridal", "luxury", "minimal", "royal"];
    style =
      typeof style === "string" && allowedStyles.includes(style)
        ? style
        : "luxury";

    // 🔥 DEMO MODE
    if (USE_DEMO) {
      return NextResponse.json({
        success: true,
        mode: "demo",
        result: {
          text: `Demo design for ${prompt}`,
          image:
            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
        },
      });
    }

    // 🔥 TEXT AI (OPTIONAL — works only if billing ok)
    let text = `Design for: ${prompt}`;

    try {
      if (process.env.OPENAI_API_KEY) {
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });

        const textRes = await withTimeout(
          openai.responses.create({
            model: "gpt-4o-mini",
            input: `Create ${style} saree design for: ${prompt}`,
          })
        );

        text =
          (textRes as any)?.output_text ||
          text;
      }
    } catch (e) {
      console.log("Text AI failed, using fallback");
    }

    // 🔥 FREE IMAGE (NO API KEY 💀🔥)
    const image = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      prompt +
        ", indian saree, " +
        style +
        ", ultra detailed, 4k, fashion design, textile pattern"
    )}`;

    return NextResponse.json({
      success: true,
      mode: "free",
      result: {
        text,
        image,
      },
    });

  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Server error",
      },
      { status: 500 }
    );
  }
}