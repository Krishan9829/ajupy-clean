export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

const basePrompt =
  "Create a premium Indian saree catalog layout: main saree full front view + pallu + border + blouse + fabric sections, luxury bridal style, ultra detailed textile, clean background, studio lighting, 4k";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "Prompt is required" },
        { status: 400 }
      );
    }

    const seed = Date.now();
    const variants = [
      { key: "main", focus: "main saree full front view" },
      { key: "pallu", focus: "pallu detail view" },
      { key: "border", focus: "border embellishment detail" },
      { key: "blouse", focus: "blouse design detail" },
      { key: "body", focus: "body fabric texture detail" },
    ];

    const images = Object.fromEntries(
      variants.map((variant, index) => {
        const imagePrompt = `${basePrompt} User concept: ${prompt}. Focus: ${variant.focus}.`;
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?model=sana&enhance=true&width=1024&height=1024&seed=${seed + index}`;
        return [variant.key, url];
      })
    );

    return NextResponse.json({ success: true, ...images });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Server error" },
      { status: 500 }
    );
  }
}
