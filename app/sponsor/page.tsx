import { Mail, Twitter, Zap, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function SponsorPage() {
  return (
    <div className="min-h-screen w-full bg-retro-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 text-retro-dark">
          Sponsor <span className="text-retro-accent">CoolWebs</span> 
        </h1>
        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto font-mono">
          Get your product in front of thousands of developers, designers, and tech enthusiasts who are actively discovering new tools.
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
        <div className="card-retro text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-retro-mint border-2 border-retro-dark rounded-md flex items-center justify-center">
            <Users className="w-6 h-6 text-retro-dark" />
          </div>
          <h3 className="font-black text-retro-dark mb-2">Targeted Audience</h3>
          <p className="text-gray-600 text-sm font-mono">Reach developers & creators actively looking for new tools</p>
        </div>

        <div className="card-retro text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-retro-yellow border-2 border-retro-dark rounded-md flex items-center justify-center">
            <Zap className="w-6 h-6 text-retro-dark" />
          </div>
          <h3 className="font-black text-retro-dark mb-2">High Visibility</h3>
          <p className="text-gray-600 text-sm font-mono">Premium placement on every page of the site</p>
        </div>

        <div className="card-retro text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-retro-lavender border-2 border-retro-dark rounded-md flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-retro-dark" />
          </div>
          <h3 className="font-black text-retro-dark mb-2">Quality Traffic</h3>
          <p className="text-gray-600 text-sm font-mono">Engaged visitors who click and convert</p>
        </div>
      </div>

      {/* What You Get */}
      <div className="card-retro mb-10 sm:mb-12">
        <h2 className="text-2xl font-black text-retro-dark mb-6">What You Get?</h2>
        <ul className="space-y-3">
          {[
            "Featured banner on homepage (seen by all visitors)",
            "Your logo and brand message prominently displayed",
            "Direct link to your website",
            "Option to include a custom CTA button",
            "Weekly performance stats (impressions & clicks)",
            "Flexible sponsorship periods (weekly/monthly)",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 flex-shrink-0 bg-retro-mint border-2 border-retro-dark rounded-md flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              <span className="text-gray-700 font-mono text-sm sm:text-base">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact Section */}
      <div className="card-retro bg-retro-yellow/30">
        <h2 className="text-2xl font-black text-retro-dark mb-2 text-center">Let's Talk! 💬</h2>
        <p className="text-gray-600 font-mono text-sm text-center mb-8">
          Interested in sponsoring? Reach out through any of these channels:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email */}
          <a
            href="mailto:testkartik770@gmail.com?subject=CoolWebs%20Sponsorship%20Inquiry"
            className="flex items-center gap-4 p-4 bg-white border-2 border-retro-dark rounded-md shadow-retro-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-100"
          >
            <div className="w-12 h-12 bg-retro-accent border-2 border-retro-dark rounded-md flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-retro-dark">Email Me</p>
              <p className="text-gray-500 text-sm font-mono">testkartik770@gmail.com</p>
            </div>
          </a>

          {/* Twitter/X */}
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 bg-white border-2 border-retro-dark rounded-md shadow-retro-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-100"
          >
            <div className="w-12 h-12 bg-retro-dark border-2 border-retro-dark rounded-md flex items-center justify-center">
              <Twitter className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-retro-dark">DM on X/Twitter</p>
              <p className="text-gray-500 text-sm font-mono">Quick response!</p>
            </div>
          </a>
        </div>

        <p className="text-center text-gray-500 text-xs font-mono mt-6">
          I typically respond within 24 hours
        </p>
      </div>

      {/* Back Link */}
      <div className="text-center mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2 bg-white text-retro-dark font-bold border-2 border-retro-dark rounded-md shadow-retro-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-100"
        >
          ← Back to Home
        </Link>
      </div>
      </div>
    </div>
  );
}
