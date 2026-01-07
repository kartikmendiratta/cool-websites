import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google profile pictures
      },
      {
        protocol: "https",
        hostname: "*.auth0.com", // Auth0 CDN
      },
      {
        protocol: "https",
        hostname: "s.gravatar.com", // Gravatar
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com", // GitHub avatars (if using GitHub OAuth)
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // unsafe-inline/eval needed for Next.js
              "style-src 'self' 'unsafe-inline'", // unsafe-inline needed for Next.js
              "img-src 'self' data: https://lh3.googleusercontent.com https://*.auth0.com https://s.gravatar.com https://avatars.githubusercontent.com",
              "font-src 'self' data:",
              "connect-src 'self' https://*.auth0.com https://*.supabase.co wss://*.supabase.co",
              "frame-src https://*.auth0.com", // Auth0 login popups
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
