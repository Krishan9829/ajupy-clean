export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const rateMap = new Map<string, number>();

export async function POST(req: Request) {
  try {
    // 🔥 RATE LIMIT
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
    const { prompt, style, user_id } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "Prompt required" },
        { status: 400 }
      );
    }

    const cleanPrompt = prompt.trim().slice(0, 200);

    const safeStyle = ["bridal", "luxury", "minimal", "royal"].includes(style)
      ? style
      : "luxury";

    // 🔥 OPTIMIZED PROMPT (LIGHT OUTPUT)
    const imagePrompt = `
${cleanPrompt},
indian saree design,
${safeStyle} style,
clean details,
fashion photography,
sharp focus
`;

    const base = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?model=sana&enhance=true`;

const seed = Date.now();

const images = {
  low: `${base}&width=768&height=768&seed=${seed}`,
  medium: `${base}&width=1024&height=1024&seed=${seed}`,
  high: `${base}&width=2048&height=2048&seed=${seed}`,
  ultra: `${base}&width=2048&height=2048&seed=${seed}`, // stable premium
};

    // 🔥 SAVE
    await supabaseAdmin.from("generations").insert({
      user_id: user_id || "guest",
      prompt: cleanPrompt,
      style: safeStyle,
      image_url: images.medium,
    });

    return NextResponse.json({
      success: true,
      result: {
        images,
      },
    });

  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}