"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }
    
    // Reset to first page when searching
    params.delete("sort");
    params.delete("category");
    
    startTransition(() => {
      router.push(params.toString() ? `/?${params.toString()}` : "/");
    });
  };

  const clearSearch = () => {
    setQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    startTransition(() => {
      router.push(params.toString() ? `/?${params.toString()}` : "/");
    });
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search websites..."
          className="w-full pl-12 pr-12 py-3 bg-white border-2 border-retro-dark rounded-md text-retro-dark placeholder-gray-400 font-mono focus:outline-none focus:ring-2 focus:ring-retro-accent focus:ring-offset-2 shadow-retro-sm"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-14 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-retro-accent text-white font-bold text-sm rounded border-2 border-retro-dark hover:bg-retro-accent/90 transition-colors disabled:opacity-50"
        >
          {isPending ? "..." : "Go"}
        </button>
      </div>
    </form>
  );
}
