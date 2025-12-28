import Link from "next/link";
import { Heart } from "lucide-react";
import { UserMenu } from "./UserMenu";
import { createClient } from "@/lib/supabase/server";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="border-b-2 border-retro-dark bg-retro-yellow">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-black text-2xl text-retro-dark hover:rotate-[-2deg] transition-transform">
          <Heart className="w-7 h-7 text-retro-accent fill-retro-accent" />
          <span>CoolWebs</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/submit"
                className="px-5 py-2 rounded-md bg-retro-accent text-white font-bold border-2 border-retro-dark shadow-retro-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-100"
              >
                Submit a Site
              </Link>
              <UserMenu user={user} />
            </>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2 rounded-md bg-white text-retro-dark font-bold border-2 border-retro-dark shadow-retro-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-100"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
