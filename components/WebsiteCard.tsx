"use client";

import { useState, useCallback, useEffect } from "react";
import { ThumbsUp, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Website {
  id: string;
  title: string;
  url: string;
  description: string;
  category?: string;
  upvotes_count: number;
  created_at: string;
}

export function WebsiteCard({ website }: { website: Website }) {
  const [upvotesCount, setUpvotesCount] = useState(website.upvotes_count);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  // Update local state when prop changes (after router.refresh())
  useEffect(() => {
    setUpvotesCount(website.upvotes_count);
  }, [website.upvotes_count]);

  // Check if user has already upvoted on mount
  useEffect(() => {
    async function checkUpvoteStatus() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: existingVote } = await supabase
          .from("votes")
          .select("id")
          .eq("user_id", user.id)
          .eq("website_id", website.id)
          .maybeSingle();

        setIsUpvoted(!!existingVote);
      }
    }

    checkUpvoteStatus();
  }, [website.id, supabase]);

  // Realtime: update upvote count when the website row changes
  useEffect(() => {
    const channel = supabase
      .channel(`websites-updates-${website.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'websites',
          filter: `id=eq.${website.id}`,
        },
        (payload) => {
          const nextCount = (payload.new as any)?.upvotes_count;
          if (typeof nextCount === 'number') {
            setUpvotesCount(nextCount);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, website.id]);

  const handleUpvote = useCallback(async () => {
    setIsLoading(true);

    try {
      // Check if user is logged in
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        // Redirect to login page
        router.push("/login");
        return;
      }

      // Check if user has already upvoted
      const { data: existingVote } = await supabase
        .from("votes")
        .select("id")
        .eq("user_id", user.id)
        .eq("website_id", website.id)
        .maybeSingle();

      if (existingVote) {
        // User already upvoted, remove the upvote
        const { error: deleteError } = await supabase
          .from("votes")
          .delete()
          .eq("user_id", user.id)
          .eq("website_id", website.id);

        if (deleteError) {
          console.error("Error deleting vote:", deleteError);
        } else {
          setIsUpvoted(false);
          // Optimistically update the UI
          setUpvotesCount((prev) => Math.max(0, prev - 1));
        }
      } else {
        // Add new upvote
        const { error: insertError } = await supabase.from("votes").insert({
          user_id: user.id,
          website_id: website.id,
        });

        if (insertError) {
          console.error("Error inserting vote:", insertError);
        } else {
          setIsUpvoted(true);
          // Optimistically update the UI
          setUpvotesCount((prev) => prev + 1);
        }
      }

      // Refresh to get the accurate count from database
      router.refresh();
    } catch (error) {
      console.error("Error updating upvote:", error);
    } finally {
      setIsLoading(false);
    }
  }, [website.id, supabase, router]);

  // Category color mapping for visual variety
  const categoryColors: Record<string, string> = {
    tools: "bg-retro-mint",
    education: "bg-retro-main",
    fun: "bg-retro-yellow",
    design: "bg-retro-lavender",
    productivity: "bg-retro-orange",
  };

  const categoryBg = categoryColors[website.category || ""] || "bg-gray-200";

  return (
    <div className="card-retro hover:translate-y-[-2px]">
      <div className="mb-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className={`tag-retro ${categoryBg} text-retro-dark`}>
            {website.category || "uncategorized"}
          </span>
        </div>
        <h3 className="text-xl font-black text-retro-dark">{website.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 font-mono">
          {website.description}
        </p>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t-2 border-retro-dark/10">
        <a
          href={website.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-retro-dark text-white text-sm font-bold border-2 border-retro-dark shadow-retro-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-100"
        >
          Visit
          <ExternalLink className="w-4 h-4" />
        </a>

        <button
          onClick={handleUpvote}
          disabled={isLoading}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-md font-bold border-2 border-retro-dark transition-all duration-100 ${
            isUpvoted
              ? "bg-retro-accent text-white shadow-retro-sm"
              : "bg-white text-retro-dark shadow-retro-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <ThumbsUp className={`w-4 h-4 ${isUpvoted ? "fill-white" : ""}`} />
          <span>{upvotesCount}</span>
        </button>
      </div>
    </div>
  );
}
