import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { createClient } from "@/lib/supabase/server";

// Simple in-memory rate limiting (for production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30; // 30 votes
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await auth0.getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to vote" },
        { status: 401 }
      );
    }

    const userId = session.user.sub;

    // Rate limiting
    if (!checkRateLimit(userId)) {
      return NextResponse.json(
        { error: "Too many votes. Please slow down." },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { websiteId } = body;

    if (!websiteId) {
      return NextResponse.json(
        { error: "Website ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify website exists and is approved
    const { data: website, error: websiteError } = await supabase
      .from("websites")
      .select("id, status")
      .eq("id", websiteId)
      .single();

    if (websiteError || !website) {
      return NextResponse.json(
        { error: "Website not found" },
        { status: 404 }
      );
    }

    if (website.status !== "approved") {
      return NextResponse.json(
        { error: "Cannot vote on pending or rejected websites" },
        { status: 403 }
      );
    }

    // Check if user has already voted
    const { data: existingVote } = await supabase
      .from("votes_auth0")
      .select("id")
      .eq("user_id", userId)
      .eq("website_id", websiteId)
      .maybeSingle();

    if (existingVote) {
      // Remove vote (unvote)
      const { error: deleteError } = await supabase
        .from("votes_auth0")
        .delete()
        .eq("user_id", userId)
        .eq("website_id", websiteId);

      if (deleteError) {
        console.error("[VOTE] Error removing vote:", deleteError.message);
        return NextResponse.json(
          { error: "Failed to remove vote" },
          { status: 500 }
        );
      }

      // Get updated count
      const { data: updatedWebsite } = await supabase
        .from("websites")
        .select("upvotes_count")
        .eq("id", websiteId)
        .single();

      return NextResponse.json({
        success: true,
        action: "removed",
        isVoted: false,
        upvotesCount: updatedWebsite?.upvotes_count || 0,
      });
    } else {
      // Add vote
      // First sync user profile (with better error handling)
      try {
        const origin = request.headers.get("origin") || request.headers.get("referer")?.split("/").slice(0, 3).join("/") || "http://localhost:3000";
        await fetch(`${origin}/api/auth/sync`, {
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        });
      } catch (syncError) {
        console.warn("User sync failed, continuing with vote:");
        // Continue anyway - user might already be synced
      }

      const { error: insertError } = await supabase
        .from("votes_auth0")
        .insert({
          user_id: userId,
          website_id: websiteId,
        });

      if (insertError) {
        console.error("[VOTE] Error adding vote:", insertError.message);
        return NextResponse.json(
          { error: "Failed to add vote" },
          { status: 500 }
        );
      }

      // Get updated count
      const { data: updatedWebsite } = await supabase
        .from("websites")
        .select("upvotes_count")
        .eq("id", websiteId)
        .single();

      return NextResponse.json({
        success: true,
        action: "added",
        isVoted: true,
        upvotesCount: updatedWebsite?.upvotes_count || 0,
      });
    }
  } catch (error) {
    // Log full error server-side only
    console.error("[VOTE] Unexpected error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
