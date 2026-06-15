import { getSupabaseAdmin } from "../lib/supabaseAdmin";

export async function runTraining(jobId: string) {
  const supabaseAdmin = getSupabaseAdmin();

  let progress = 0;

  const interval = setInterval(async () => {
    progress += 20;

    await supabaseAdmin
      .from("training_jobs")
      .update({ progress })
      .eq("id", jobId);

    if (progress >= 100) {
      clearInterval(interval);

      await supabaseAdmin
        .from("training_jobs")
        .update({ status: "completed" })
        .eq("id", jobId);
    }
  }, 1000);
}