import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const user_id = body?.user_id;
    const name = body?.name;

    // validation
    if (!user_id || !name) {
      return Response.json(
        { error: "user_id and name are required" },
        { status: 400 }
      );
    }

    // ✅ safe init (fixes build + SSR issues)
    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from("datasets")
      .insert([
        {
          user_id,
          name,
        },
      ])
      .select();

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return Response.json(
      {
        success: false,
        error: err?.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}