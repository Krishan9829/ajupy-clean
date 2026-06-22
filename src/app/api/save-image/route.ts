import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { image, prompt, category, user_id } = body;

    // 🔥 VALIDATION (strict)
    if (!image || !prompt || !user_id) {
      return NextResponse.json(
        {
          success: false,
          error: "image, prompt, user_id required",
        },
        { status: 400 }
      );
    }

    // 🔥 INSERT (safe + controlled)
    const { data, error } = await supabase
      .from("generations")
      .insert([
        {
          image,
          prompt,
          category: category || "saree",
          user_id,
          created_at: new Date().toISOString(), // optional safety
        },
      ])
      .select();

    if (error) {
      console.error("SUPABASE ERROR:", error);

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (err: any) {
    console.error("SAVE API ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to save",
      },
      { status: 500 }
    );
  }
}