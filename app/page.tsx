import { createClient } from "@/lib/supabase/server";
import { WebsiteCard } from "@/components/WebsiteCard";
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

async function getWebsites(sortBy: string = "upvotes") {
  const supabase = await createClient();

  let query = supabase.from("websites").select("*");

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

function WebsitesGrid({ websites }: { websites: Website[] }) {
  if (websites.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="card-retro text-center">
          <p className="text-retro-dark text-lg font-bold">No websites yet. Be the first to submit!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {websites.map((website) => (
        <WebsiteCard key={website.id} website={website} />
      ))}
    </div>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  // NEXT.JS 16 REQUIREMENT: Await searchParams
  const params = await searchParams;
  const sortBy = params.sort || "upvotes";

  const websites = await getWebsites(sortBy);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-6xl font-black mb-4 text-retro-dark">
          Cool<span className="text-retro-accent">Webs</span> ✨
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl font-mono">
          Discover amazing websites, tools, and resources. Upvote your favorites
          and help the community find the best sites.
        </p>
      </div>

      {/* Sponsored Ad Banner */}
      <div className="mb-10 p-6 bg-retro-yellow border-2 border-retro-dark rounded-md shadow-retro relative overflow-hidden">
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 bg-retro-dark text-white text-xs font-bold rounded-md">
            SPONSORED
          </span>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Ad Image Placeholder */}
          <div className="w-full md:w-48 h-32 bg-white border-2 border-retro-dark rounded-md flex items-center justify-center">
            <span className="text-gray-400 font-mono text-sm">Your Logo Here</span>
          </div>
          {/* Ad Content */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-black text-retro-dark mb-2">
              🚀 Your Brand Could Be Here!
            </h3>
            <p className="text-retro-dark/80 font-mono text-sm mb-4">
              Reach thousands of developers and tech enthusiasts. Sponsor this spot and showcase your product to our community.
            </p>
            <a
              href="mailto:sponsor@coolwebs.com"
              className="inline-block px-5 py-2 bg-retro-dark text-white font-bold border-2 border-retro-dark rounded-md shadow-retro-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-100"
            >
              Become a Sponsor →
            </a>
          </div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="mb-8 flex items-center gap-4">
        <span className="text-retro-dark font-bold">Sort by:</span>
        <div className="flex gap-3">
          <a
            href="?sort=upvotes"
            className={`px-4 py-2 rounded-md font-bold border-2 border-retro-dark transition-all duration-100 ${
              sortBy === "upvotes" || !sortBy
                ? "bg-retro-accent text-white shadow-retro-sm"
                : "bg-white text-retro-dark shadow-retro-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            }`}
          >
            🔥 Most Upvoted
          </a>
          <a
            href="?sort=newest"
            className={`px-4 py-2 rounded-md font-bold border-2 border-retro-dark transition-all duration-100 ${
              sortBy === "newest"
                ? "bg-retro-accent text-white shadow-retro-sm"
                : "bg-white text-retro-dark shadow-retro-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            }`}
          >
            ✨ Newest
          </a>
        </div>
      </div>

      {/* Websites Grid */}
      <Suspense fallback={<div className="text-center py-12 font-bold text-retro-dark">Loading websites...</div>}>
        <WebsitesGrid websites={websites} />
      </Suspense>
    </div>
  );
}
