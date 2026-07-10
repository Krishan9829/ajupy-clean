import sharp from "sharp";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { imageUrl, format, quality } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL missing" },
        { status: 400 }
      );
    }

    const res = await fetch(imageUrl);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: 500 }
      );
    }

    const buffer = Buffer.from(await res.arrayBuffer());

    // 🔥 SIZE
    let width = 1024;
    if (quality === "2K") width = 2048;
    if (quality === "4K" || quality === "PREMIUM") width = 4096;

    let img = sharp(buffer).resize({ width });

    let output;

    if (format === "png") {
      output = await img.png().toBuffer();
    } else if (format === "tiff") {
  output = await img
    .tiff({
      compression: "jpeg", // 🔥 crash fix
      quality: 80,         // 🔥 memory kam
    })
    .toBuffer();
} else {
      return NextResponse.json(
        { error: "Invalid format" },
        { status: 400 }
      );
    }

    return new Response(output, {
      headers: {
        "Content-Type": format === "png" ? "image/png" : "image/tiff",
        "Content-Disposition": `attachment; filename=saree.${format}`,
      },
    });
  } catch (err: any) {
    console.error("Download API crash:", err);

    return NextResponse.json(
      {
        error: err.message || "Server error",
      },
      { status: 500 }
    );
  }
}