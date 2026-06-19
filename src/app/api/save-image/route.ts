import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { image, prompt, category, user_id } = await req.json();

    // 🔥 VALIDATION
    if (!image || !prompt || !user_id) {
      return NextResponse.json(
        { success: false, error: "Missing data" },
        { status: 400 }
      );
    }

    // 🔥 INSERT WITH USER
    const { data, error } = await supabase
      .from("collections")
      .insert([
        {
          image,
          prompt,
          category,
          user_id, // ✅ IMPORTANT
        },
      ])
      .select();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to save",
      },
      { status: 500 }
    );
  }
}