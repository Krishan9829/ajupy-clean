import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_EMAIL = "bhawani9829m@gmail.com";

export default async function AdminPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll().map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
          }));
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  // 🔥 get logged in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 🔴 NOT ADMIN → redirect
  if (!user || user.email !== ADMIN_EMAIL) {
    redirect("/");
  }

  // 🔥 fetch latest generations
  const { data: generations, error } = await supabase
    .from("generations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return <p>Error loading data: {error.message}</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>🔥 Admin Dashboard</h1>

      <p>Total: {generations?.length || 0}</p>

      <div style={{ display: "grid", gap: 16, marginTop: 20 }}>
        {generations?.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ddd",
              padding: 12,
              borderRadius: 10,
            }}
          >
            <img
              src={item.image_url}
              width={200}
              style={{ borderRadius: 8 }}
            />

            <p><b>Prompt:</b> {item.prompt}</p>
            <p><b>Style:</b> {item.style}</p>
            <p style={{ fontSize: 12, opacity: 0.7 }}>
              {new Date(item.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}