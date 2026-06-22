import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Sidebar from "../../components/layout/sidebar";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  let data: any[] = [];
  let error: string | null = null;

  try {
    const { data: resData, error: resError } = await supabaseAdmin
      .from("generations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (resError) {
      throw new Error(resError.message);
    }

    data = resData || [];
  } catch (err: any) {
    error = err?.message || "Failed to load history";
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <main className="flex-1 ml-[240px] p-8">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">🧠 Prompt History</h1>
          <p className="text-zinc-400 mt-2">
            View all your generated AI designs & prompts
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl mb-6">
            ⚠️ {error}
          </div>
        )}

        {/* EMPTY */}
        {!error && data.length === 0 && (
          <div className="text-zinc-500 text-center mt-20">
            🚀 No history yet. Generate your first design!
          </div>
        )}

        {/* GRID */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {data.map((item) => (
            <div
              key={item.id}
              className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-white transition-all duration-300 hover:scale-[1.02]"
            >

              {/* IMAGE */}
              <div className="overflow-hidden rounded-xl mb-4">
                <img
                  src={
                    item.image_url ||
                    "https://images.unsplash.com/photo-1520975916090-3105956dac38"
                  }
                  className="w-full h-56 object-cover group-hover:scale-105 transition"
                  alt="generated"
                />
              </div>

              {/* PROMPT */}
              <p className="text-xs text-zinc-500 mb-1">PROMPT</p>
              <p className="text-sm text-zinc-300 mb-4 line-clamp-3">
                {item.prompt || "No prompt available"}
              </p>

              {/* RESPONSE */}
              <p className="text-xs text-zinc-500 mb-1">AI RESPONSE</p>
              <p className="text-sm text-zinc-400 line-clamp-4">
                {item.response || "AI response not saved"}
              </p>

              {/* FOOTER */}
              <div className="flex justify-between items-center mt-4 text-xs text-zinc-500">

                <span>
                  {item.created_at
                    ? new Date(item.created_at).toLocaleDateString()
                    : "Unknown date"}
                </span>

                {item.image_url && (
                  <a
                    href={item.image_url}
                    download
                    className="opacity-0 group-hover:opacity-100 transition text-white hover:underline"
                  >
                    ⬇ Download
                  </a>
                )}

              </div>

            </div>
          ))}
        </div>

      </main>
    </div>
  );
}