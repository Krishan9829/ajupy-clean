import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { dataset_id, model_name } = await req.json();

    // 🔥 VALIDATION
    if (!dataset_id || !model_name) {
      return Response.json(
        { error: "dataset_id and model_name required" },
        { status: 400 }
      );
    }

    // 🔥 INSERT JOB
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
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json({ success: true, job: data });
  } catch (err: any) {
    console.error("SERVER ERROR:", err);
    return Response.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}