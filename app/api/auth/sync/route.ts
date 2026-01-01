import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { createClient } from "@/lib/supabase/server";

// This endpoint syncs Auth0 user to Supabase after login
export async function GET() {
  try {
    const session = await auth0.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: session.user.sub,
          email: session.user.email,
          display_name: session.user.name || session.user.email?.split("@")[0],
          avatar_url: session.user.picture,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "id",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("Error syncing user to Supabase:", error);
      return NextResponse.json(
        { error: "Failed to sync user" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, profile: data });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
