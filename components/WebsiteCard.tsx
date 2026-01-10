"use client";

import { useState, useCallback, useEffect } from "react";
import { ThumbsUp, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0";

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
  const { user } = useUser();

  // Update local state when prop changes (after router.refresh())
  useEffect(() => {
    setUpvotesCount(website.upvotes_count);
  }, [website.upvotes_count]);

  // Check if user has already upvoted on mount
  useEffect(() => {
    async function checkUpvoteStatus() {
      if (user?.sub) {
        const { data: existingVote } = await supabase
          .from("votes_auth0")
          .select("id")
          .eq("user_id", user.sub)
          .eq("website_id", website.id)
          .maybeSingle();

        setIsUpvoted(!!existingVote);
      }
    }

    checkUpvoteStatus();
  }, [website.id, supabase, user]);

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
    // Check if user is logged in
    if (!user?.sub) {
      router.push("/login");
      return;
    }

    setIsLoading(true);

    try {
      // Call secure server-side API
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          websiteId: website.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          alert("Too many votes. Please slow down.");
        }
        return;
      }

      // Update UI based on server response
      setIsUpvoted(data.isVoted);
      setUpvotesCount(data.upvotesCount);

      // Refresh to sync with database
      router.refresh();
    }
     finally {
      setIsLoading(false);
    }
  }, [website.id, router, user]);

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
      <div className="mb-3 sm:mb-4 space-y-2 sm:space-y-3">
        <div className="flex items-center gap-2">
          <span className={`tag-retro ${categoryBg} text-retro-dark text-[10px] sm:text-xs`}>
            {website.category || "uncategorized"}
          </span>
        </div>
        <h3 className="text-lg sm:text-xl font-black text-retro-dark line-clamp-1">{website.title}</h3>
        <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 font-mono">
          {website.description}
        </p>
      </div>

      <div className="flex items-center justify-between mt-4 sm:mt-6 pt-3 sm:pt-4 border-t-2 border-retro-dark/10">
        <a
          href={website.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md bg-retro-dark text-white text-xs sm:text-sm font-bold border-2 border-retro-dark shadow-retro-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-100"
        >
          Visit
          <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </a>

        <button
          onClick={handleUpvote}
          disabled={isLoading}
          className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-bold text-xs sm:text-sm border-2 border-retro-dark transition-all duration-100 ${
            isUpvoted
              ? "bg-retro-accent text-white shadow-retro-sm"
              : "bg-white text-retro-dark shadow-retro-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isUpvoted ? "fill-white" : ""}`} />
          <span>{upvotesCount}</span>
        </button>
      </div>
    </div>
  );
}
