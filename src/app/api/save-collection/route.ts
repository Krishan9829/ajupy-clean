export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { title, content, image, user_id } = await req.json();

    // 🔥 VALIDATION
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title & content required" },
        { status: 400 }
      );
    }

    // 🔥 INSERT
    const { data, error } = await supabaseAdmin
      .from("generations")
      .insert([
        {
          title,
          content,
          image: image || null,
          user_id: user_id || "guest",
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      collection: data,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message || "Server error",
      },
      { status: 500 }
    );
  }
}