import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function runTraining(jobId: string) {
  try {
    let progress = 0;

    while (progress < 100) {
      progress += 20;

      // 🔥 UPDATE PROGRESS
      const { error } = await supabaseAdmin
        .from("training_jobs")
        .update({ progress })
        .eq("id", jobId);

      if (error) {
        console.error("Progress Update Error:", error.message);
        break;
      }

      // ⏳ WAIT (simulate training step)
      await new Promise((res) => setTimeout(res, 1000));
    }

    // ✅ COMPLETE JOB
    const { error: completeError } = await supabaseAdmin
      .from("training_jobs")
      .update({
        status: "completed",
        progress: 100,
      })
      .eq("id", jobId);

    if (completeError) {
      console.error("Completion Error:", completeError.message);
    }

  } catch (err: any) {
    console.error("Training Crash:", err?.message);
  }
}