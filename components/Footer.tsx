import Link from "next/link";
import { Heart, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t-2 border-retro-dark bg-white mt-12 sm:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex flex-col gap-6 sm:gap-0 sm:flex-row sm:justify-between sm:items-center">
          {/* Brand */}
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Heart className="w-5 h-5 text-retro-accent fill-retro-accent" />
            <span className="font-black text-retro-dark text-lg">CoolWebs</span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm font-bold">
            <Link href="/submit" className="text-retro-dark hover:text-retro-accent transition-colors">
              Submit
            </Link>
            <Link href="/sponsor" className="text-retro-dark hover:text-retro-accent transition-colors">
              Advertise
            </Link>
          </nav>

          {/* Socials */}
          <div className="flex items-center justify-center sm:justify-end gap-3">
           
            
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-6 sm:mt-8 pt-6 border-t-2 border-retro-dark/10 text-center">
          <p className="text-xs sm:text-sm text-gray-500 font-mono">
            © {new Date().getFullYear()} CoolWebs. Made with{" "}
            <Heart className="w-3 h-3 inline text-retro-accent fill-retro-accent" /> for the internet.
          </p>
        </div>
      </div>
    </footer>
  );
}
