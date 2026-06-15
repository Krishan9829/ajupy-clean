import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { dataset_id, model_name } = await req.json();

    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from("training_jobs")
      .insert([
        {
          dataset_id,
          model_name,
          status: "queued",
          progress: 0,
        },
      ])
      .select();

    if (error) {
      console.error("SUPABASE ERROR:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ job: data });
  } catch (err: any) {
    console.error("SERVER ERROR:", err);
    return Response.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}