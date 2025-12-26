import { createClient } from "@/lib/supabase/server";
import { WebsiteCard } from "@/components/WebsiteCard";
import { Suspense } from "react";

interface Website {
  id: string;
  title: string;
  url: string;
  description: string;
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
        <p className="text-slate-400 text-lg">No websites yet. Be the first to submit!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          CoolWebs
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          Discover amazing websites, tools, and resources. Upvote your favorites
          and help the community find the best sites.
        </p>
      </div>

      {/* Sort Controls */}
      <div className="mb-8 flex items-center gap-4">
        <span className="text-slate-400">Sort by:</span>
        <div className="flex gap-2">
          <a
            href="?sort=upvotes"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              sortBy === "upvotes" || !sortBy
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Most Upvoted
          </a>
          <a
            href="?sort=newest"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              sortBy === "newest"
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Newest
          </a>
        </div>
      </div>

      {/* Websites Grid */}
      <Suspense fallback={<div className="text-center py-12">Loading websites...</div>}>
        <WebsitesGrid websites={websites} />
      </Suspense>
    </div>
  );
}
