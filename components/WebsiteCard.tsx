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

  return (
    <div className="card hover:shadow-lg hover:shadow-blue-500/10">
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2 text-white">{website.title}</h3>
        <p className="text-slate-400 text-sm line-clamp-2">
          {website.description}
        </p>
      </div>

      <div className="flex items-center justify-between mt-6">
        <a
          href={website.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
        >
          Visit
          <ExternalLink className="w-4 h-4" />
        </a>

        <button
          onClick={handleUpvote}
          disabled={isLoading}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isUpvoted
              ? "bg-blue-600/20 text-blue-400 border border-blue-600/30"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{upvotesCount}</span>
        </button>
      </div>
    </div>
  );
}
