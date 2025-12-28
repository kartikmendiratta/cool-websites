import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "CoolWebs - Discover Cool Websites",
  description:
    "A directory of useful and cool websites. Explore, upvote your favorites, and discover new tools.",
  keywords: ["websites", "directory", "tools", "resources"],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-retro-bg text-retro-dark min-h-screen">
        <Navbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
