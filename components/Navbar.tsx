"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Heart className="w-6 h-6 text-red-500" />
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            CoolWebs
          </span>
        </Link>

        <button
          onClick={() => {
            window.location.href =
              "mailto:owner@example.com?subject=Submit a Cool Website for CoolWebs";
          }}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
        >
          Submit a Site
        </button>
      </div>
    </nav>
  );
}
