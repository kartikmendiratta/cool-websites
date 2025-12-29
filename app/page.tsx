import { createClient } from "@/lib/supabase/server";
import { WebsiteCard } from "@/components/WebsiteCard";
import { SearchBar } from "@/components/SearchBar";
import { Suspense } from "react";

interface Website {
  id: string;
  title: string;
  url: string;
  description: string;
  category?: string;
  upvotes_count: number;
  created_at: string;
}

async function getWebsites(sortBy: string = "upvotes", category?: string, searchQuery?: string) {
  const supabase = await createClient();

  let query = supabase.from("websites").select("*");

  // Search by title or description
  if (searchQuery && searchQuery.trim()) {
    query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
  }

  // Filter by category if specified
  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  if (sortBy === "upvotes") {
    query = query.order("upvotes_count", { ascending: false });
  } else if (sortBy === "newest") {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching websites:", error);
    return [];
  }

  return data as Website[];
}

async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

function WebsitesGrid({ websites, searchQuery }: { websites: Website[]; searchQuery?: string }) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
      {websites.map((website) => (
        <WebsiteCard key={website.id} website={website} />
      ))}
    </div>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; category?: string; q?: string }>;
}) {
  // NEXT.JS 16 REQUIREMENT: Await searchParams
  const params = await searchParams;
  const sortBy = params.sort || "upvotes";
  const category = params.category || "all";
  const searchQuery = params.q || "";

  const websites = await getWebsites(sortBy, category, searchQuery);

  const categories = [
    { value: "all", label: "All", emoji: "🌐" },
    { value: "tools", label: "Tools", emoji: "🛠️" },
    { value: "education", label: "Education", emoji: "📚" },
    { value: "fun", label: "Fun", emoji: "🎮" },
    { value: "design", label: "Design", emoji: "🎨" },
    { value: "productivity", label: "Productivity", emoji: "⚡" },
  ];

  // Helper to build URL with current params
  const buildUrl = (newParams: { sort?: string; category?: string }) => {
    const url = new URLSearchParams();
    const finalSort = newParams.sort ?? sortBy;
    const finalCategory = newParams.category ?? category;
    if (finalSort !== "upvotes") url.set("sort", finalSort);
    if (finalCategory !== "all") url.set("category", finalCategory);
    if (searchQuery) url.set("q", searchQuery);
    return url.toString() ? `?${url.toString()}` : "/";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8 sm:mb-12">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-3 sm:mb-4 text-retro-dark">
          Cool<span className="text-retro-accent">Webs</span> ✨
        </h1>
        <p className="text-gray-600 text-base sm:text-lg max-w-2xl font-mono">
          Discover amazing websites, tools, and resources. Upvote your favorites
          and help the community find the best sites.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <Suspense fallback={<div className="h-12 bg-white border-2 border-retro-dark rounded-md animate-pulse" />}>
          <SearchBar />
        </Suspense>
      </div>

      {/* Sponsored Ad Banner - Hidden on small screens, simplified on medium */}
      <div className="hidden sm:block mb-8 lg:mb-10 p-4 lg:p-6 bg-retro-yellow border-2 border-retro-dark rounded-md shadow-retro relative overflow-hidden">
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 bg-retro-dark text-white text-xs font-bold rounded-md">
            SPONSORED
          </span>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 lg:gap-6">
          {/* Ad Image Placeholder */}
          <div className="hidden md:flex w-40 lg:w-48 h-28 lg:h-32 bg-white border-2 border-retro-dark rounded-md items-center justify-center">
            <span className="text-gray-400 font-mono text-sm">Your Logo</span>
          </div>
          {/* Ad Content */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl lg:text-2xl font-black text-retro-dark mb-2">
              🚀 Your Brand Could Be Here!
            </h3>
            <p className="text-retro-dark/80 font-mono text-xs lg:text-sm mb-3 lg:mb-4 hidden lg:block">
              Reach thousands of developers and tech enthusiasts. Sponsor this spot and showcase your product to our community.
            </p>
            <a
              href="mailto:sponsor@coolwebs.com"
              className="inline-block px-4 py-2 bg-retro-dark text-white font-bold text-sm border-2 border-retro-dark rounded-md shadow-retro-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-100"
            >
              Become a Sponsor →
            </a>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-4 sm:mb-6">
        <span className="text-retro-dark font-bold mb-2 sm:mb-3 block text-sm sm:text-base">Browse by category:</span>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {categories.map((cat) => (
            <a
              key={cat.value}
              href={buildUrl({ category: cat.value })}
              className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-md font-bold text-xs sm:text-sm border-2 border-retro-dark transition-all duration-100 ${
                category === cat.value
                  ? "bg-retro-mint text-retro-dark shadow-retro-sm"
                  : "bg-white text-retro-dark shadow-retro-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              }`}
            >
              <span className="hidden sm:inline">{cat.emoji} </span>{cat.label}
            </a>
          ))}
        </div>
      </div>

      {/* Sort Controls */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <span className="text-retro-dark font-bold text-sm sm:text-base">Sort by:</span>
        <div className="flex gap-2 sm:gap-3">
          <a
            href={buildUrl({ sort: "upvotes" })}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-bold text-xs sm:text-sm border-2 border-retro-dark transition-all duration-100 ${
              sortBy === "upvotes"
                ? "bg-retro-accent text-white shadow-retro-sm"
                : "bg-white text-retro-dark shadow-retro-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            }`}
          >
            🔥 Most Upvoted
          </a>
          <a
            href={buildUrl({ sort: "newest" })}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-bold text-xs sm:text-sm border-2 border-retro-dark transition-all duration-100 ${
              sortBy === "newest"
                ? "bg-retro-accent text-white shadow-retro-sm"
                : "bg-white text-retro-dark shadow-retro-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            }`}
          >
            ✨ Newest
          </a>
        </div>
      </div>

      {/* Results count */}
      {searchQuery && (
        <p className="mb-4 text-sm text-gray-500 font-mono">
          {websites.length} result{websites.length !== 1 ? "s" : ""} for "{searchQuery}"
        </p>
      )}

      {/* Websites Grid */}
      <Suspense fallback={<div className="text-center py-12 font-bold text-retro-dark">Loading websites...</div>}>
        <WebsitesGrid websites={websites} searchQuery={searchQuery} />
      </Suspense>
    </div>
  );
}
