import type { Metadata } from "next";
import { Auth0Provider } from "@auth0/nextjs-auth0";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "CoolWebs - Discover Cool Websites",
  description:
    "A directory of useful and cool websites. Explore, upvote your favorites, and discover new tools.",
  keywords: ["websites", "directory", "tools", "resources"],
  openGraph: {
    title: "CoolWebs - Discover Cool Websites",
    description: "A directory of useful and cool websites. Explore, upvote your favorites, and discover new tools.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CoolWebs - Discover Cool Websites",
    description: "A directory of useful and cool websites. Explore, upvote your favorites, and discover new tools.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Auth0Provider>
        <body className="bg-retro-bg text-retro-dark min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </Auth0Provider>
    </html>
  );
}
