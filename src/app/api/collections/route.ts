import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { addCollectionItem, createCollection, ensureUserProfile, listCollectionItems, listCollections } from "@/lib/database";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          },
        },
      }
    );

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureUserProfile(user.id, user.email || "");
    const collections = await listCollections(user.id);
    return NextResponse.json({ collections });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to load collections" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          },
        },
      }
    );

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { action, name, collectionId, imageUrl, prompt } = body;
    await ensureUserProfile(user.id, user.email || "");

    if (action === "create") {
      const collection = await createCollection(user.id, name);
      return NextResponse.json({ collection });
    }

    if (action === "save-item") {
      const item = await addCollectionItem(collectionId, imageUrl, prompt);
      return NextResponse.json({ item });
    }

    if (action === "list-items") {
      const items = await listCollectionItems(collectionId);
      return NextResponse.json({ items });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Collections request failed" }, { status: 500 });
  }
}
