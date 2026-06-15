export const dynamic = "force-dynamic";

import OpenAI from "openai";
import { NextResponse } from "next/server";

const USE_DEMO = process.env.USE_DEMO === "true";

const withTimeout = (promise: Promise<any>, ms = 20000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), ms)
    ),
  ]);
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { prompt, style } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "Prompt required" },
        { status: 400 }
      );
    }

    prompt = prompt.toString().trim().slice(0, 300);
    style = style || "luxury indian bridal";

    // 🔥 DEMO MODE FIRST (no OpenAI needed)
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

    // ✅ CHECK ENV SAFELY
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OpenAI API key" },
        { status: 500 }
      );
    }

    // ✅ INIT HERE (SAFE)
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const enhancedPrompt = `
You are a world-class fashion designer AI.

Create a ${style} saree design.

User idea: ${prompt}

Return:
1. Fabric
2. Colors
3. Embroidery
4. Border
5. Pallu
6. Blouse
`;

    const [textRes, imageRes] = await Promise.all([
      withTimeout(
        openai.responses.create({
          model: "gpt-4.1-mini",
          input: enhancedPrompt,
        })
      ),

      withTimeout(
        openai.images.generate({
          model: "gpt-image-1",
          prompt: `${prompt}, ${style}, indian saree, luxury fashion, 4k`,
          size: "1024x1024",
        })
      ),
    ]);

    const text = textRes?.output_text || "No design generated";

    const img = imageRes?.data?.[0];

    let image = "";

    if (img?.url) image = img.url;
    else if (img?.b64_json)
      image = `data:image/png;base64,${img.b64_json}`;

    if (!image) {
      image = "https://via.placeholder.com/512?text=No+Image";
    }

    return NextResponse.json({
      success: true,
      mode: "live",
      result: {
        text,
        image,
      },
    });

  } catch (err: any) {
    console.error("API ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}