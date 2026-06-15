import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { user_id, model_name, dataset_id, style } = await req.json();

    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from("custom_models")
      .insert([
        {
          user_id,
          model_name,
          dataset_id,
          style,
        },
      ]);

    if (error) {
      console.error("SUPABASE ERROR:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ model: data });
  } catch (err: any) {
    console.error("SERVER ERROR:", err);
    return Response.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}