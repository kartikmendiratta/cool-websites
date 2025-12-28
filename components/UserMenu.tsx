"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, ChevronDown } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface UserMenuProps {
  user: SupabaseUser;
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const displayName =
    user.user_metadata?.display_name || user.email?.split("@")[0] || "User";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border-2 border-retro-dark shadow-retro-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-100"
      >
        <div className="w-8 h-8 rounded-md bg-retro-lavender border-2 border-retro-dark flex items-center justify-center text-retro-dark font-bold">
          {displayName[0].toUpperCase()}
        </div>
        <span className="text-retro-dark font-medium hidden sm:block">{displayName}</span>
        <ChevronDown
          className={`w-4 h-4 text-retro-dark transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-retro-dark rounded-md shadow-retro py-2 z-50">
          <div className="px-4 py-2 border-b-2 border-retro-dark">
            <p className="text-sm font-bold text-retro-dark">{displayName}</p>
            <p className="text-xs text-gray-500 truncate font-mono">{user.email}</p>
          </div>

          <button
            onClick={handleSignOut}
            disabled={loading}
            className="w-full px-4 py-2 text-left text-sm text-retro-dark hover:bg-retro-accent hover:text-white transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="w-4 h-4" />
            {loading ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      )}
    </div>
  );
}
