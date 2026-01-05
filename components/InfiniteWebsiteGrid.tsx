"use client";

import { WebsiteCard } from "@/components/WebsiteCard";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

interface Website {
  id: string;
  title: string;
  url: string;
  description: string;
  category?: string;
  upvotes_count: number;
  created_at: string;
}

interface Props {
  initialWebsites: Website[];
  sortBy: string;
  category: string;
  searchQuery: string;
}

const ITEMS_PER_PAGE = 12;

export function InfiniteWebsiteGrid({ initialWebsites, sortBy, category, searchQuery }: Props) {
  const [websites, setWebsites] = useState<Website[]>(initialWebsites);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialWebsites.length >= ITEMS_PER_PAGE);
  const [offset, setOffset] = useState(ITEMS_PER_PAGE);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const supabase = createClient();

    let query = supabase.from("websites").select("*");

    // Apply same filters as initial load
    if (searchQuery && searchQuery.trim()) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    if (sortBy === "upvotes") {
      query = query.order("upvotes_count", { ascending: false });
    } else if (sortBy === "newest") {
      query = query.order("created_at", { ascending: false });
    }

    // Pagination
    query = query.range(offset, offset + ITEMS_PER_PAGE - 1);

    const { data, error } = await query;

    if (error) {
      console.error("Error loading more websites:", error);
      setLoading(false);
      return;
    }

    if (data && data.length > 0) {
      setWebsites((prev) => [...prev, ...data]);
      setOffset((prev) => prev + ITEMS_PER_PAGE);
      setHasMore(data.length >= ITEMS_PER_PAGE);
    } else {
      setHasMore(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, offset, sortBy, category, searchQuery]);

  // Reset when filters change
  useEffect(() => {
    setWebsites(initialWebsites);
    setOffset(ITEMS_PER_PAGE);
    setHasMore(initialWebsites.length >= ITEMS_PER_PAGE);
  }, [initialWebsites, sortBy, category, searchQuery]);

  if (websites.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="card-retro text-center max-w-md">
          {searchQuery ? (
            <>
              <p className="text-retro-dark text-lg font-bold mb-2">No results found 😅</p>
              <p className="text-gray-500 font-mono text-sm">Try a different search term or browse by category</p>
            </>
          ) : (
            <p className="text-retro-dark text-lg font-bold">No websites yet. Be the first to submit!</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {websites.map((website) => (
          <WebsiteCard key={website.id} website={website} />
        ))}
      </div>

      {/* Intersection Observer Target */}
      <div ref={observerTarget} className="h-20 flex items-center justify-center mt-8">
        {loading && (
          <div className="flex items-center gap-2 text-retro-dark font-mono text-sm">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading more...
          </div>
        )}
        {!hasMore && websites.length > 0 && (
          <p className="text-gray-400 font-mono text-sm">🎉 You've reached the end!</p>
        )}
      </div>
    </div>
  );
}
