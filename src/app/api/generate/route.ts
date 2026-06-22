export const dynamic = "force-dynamic";

import OpenAI from "openai";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// 🔥 CONFIG
const USE_DEMO = process.env.USE_DEMO === "true";

// 🔥 RATE LIMIT
const rateMap = new Map<string, number>();

// 🔥 TIMEOUT
const withTimeout = async <T>(promise: Promise<T>, ms = 20000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), ms)
    ),
  ]);
};

export async function POST(req: Request) {
  try {
    // 🔥 IP
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const now = Date.now();
    const last = rateMap.get(ip) || 0;

    if (now - last < 1500) {
      return NextResponse.json(
        { success: false, error: "Too many requests" },
        { status: 429 }
      );
    }

    rateMap.set(ip, now);

    // 🔥 BODY
    const { prompt: rawPrompt, style: rawStyle, user_id } =
      await req.json();

    if (!rawPrompt || typeof rawPrompt !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid prompt" },
        { status: 400 }
      );
    }

    const prompt = rawPrompt.trim().slice(0, 200);

    const allowedStyles = ["bridal", "luxury", "minimal", "royal"];
    const style =
      typeof rawStyle === "string" && allowedStyles.includes(rawStyle)
        ? rawStyle
        : "luxury";

    // 🔥 DEMO
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

    // 🔥 TEXT AI
    let text = `Design for: ${prompt}`;

    if (process.env.OPENAI_API_KEY) {
      try {
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });

        const res = await withTimeout(
          openai.responses.create({
            model: "gpt-4o-mini",
            input: `Create ${style} saree design description for: ${prompt}`,
          })
        );

        text = (res as any)?.output_text || text;
      } catch {
        console.log("AI text fallback used");
      }
    }

    // 🔥 IMAGE
    const image = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      `${prompt}, indian saree design, ${style}, ultra detailed, 4k, textile pattern`
    )}`;

    // 🔥 SAVE (NO FUNCTION WRAPPER NOW)
    await supabaseAdmin.from("generations").insert([
      {
        user_id: user_id || "guest",
        prompt,
        style,
        image_url: image,
      },
    ]);

    // 🔥 RESPONSE
    return NextResponse.json({
      success: true,
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