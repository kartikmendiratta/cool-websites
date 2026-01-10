import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { createClient } from "@/lib/supabase/server";

// Simple in-memory rate limiting (for production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // 5 submissions
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

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

function sanitizeInput(input: string): string {
  // Remove HTML tags and trim
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .trim();
}

function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    // Only allow http and https protocols
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return false;
    }
    // Block localhost and private IPs
    if (
      urlObj.hostname === "localhost" ||
      urlObj.hostname.startsWith("127.") ||
      urlObj.hostname.startsWith("192.168.") ||
      urlObj.hostname.startsWith("10.") ||
      urlObj.hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await auth0.getSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to submit a website" },
        { status: 401 }
      );
    }

    const userId = session.user.sub;

    // Rate limiting
    if (!checkRateLimit(userId)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { title, url, description, category } = body;

    // Validate required fields
    if (!title || !url || !description || !category) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedTitle = sanitizeInput(title);
    const sanitizedDescription = sanitizeInput(description);
    const sanitizedUrl = url.trim();

    // Validate lengths
    if (sanitizedTitle.length < 3 || sanitizedTitle.length > 100) {
      return NextResponse.json(
        { error: "Title must be between 3 and 100 characters" },
        { status: 400 }
      );
    }

    if (sanitizedDescription.length < 10 || sanitizedDescription.length > 500) {
      return NextResponse.json(
        { error: "Description must be between 10 and 500 characters" },
        { status: 400 }
      );
    }

    // Validate URL
    if (!isValidUrl(sanitizedUrl)) {
      return NextResponse.json(
        { error: "Please provide a valid public URL" },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = ["tools", "education", "fun", "design", "productivity"];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check for duplicate URL
    const { data: existingWebsite } = await supabase
      .from("websites")
      .select("id")
      .eq("url", sanitizedUrl)
      .maybeSingle();

    if (existingWebsite) {
      return NextResponse.json(
        { error: "This website has already been submitted" },
        { status: 409 }
      );
    }

    // Sync user profile first
    await fetch(`${request.headers.get("origin")}/api/auth/sync`);

    // Insert website with pending status
    const { data, error } = await supabase
      .from("websites")
      .insert({
        title: sanitizedTitle,
        url: sanitizedUrl,
        description: sanitizedDescription,
        category,
        status: "pending",
        upvotes_count: 0,
      })
      .select()
      .single();

    if (error) {
      // Log error server-side only, don't expose to client
      console.error("[SUBMIT] Database error:", error.message);
      return NextResponse.json(
        { error: "Failed to submit website. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Website submitted successfully and is pending approval",
        website: data,
      },
      { status: 201 }
    );
  } catch (error) {
    // Log full error server-side, generic message to client
    console.error("[SUBMIT] Unexpected error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
