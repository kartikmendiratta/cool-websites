# CoolWebs - Tips, Tricks & Advanced Guide

## 🎯 Common Customizations

### 1. Change the Brand Color

**Current**: Blue (blue-600, blue-700)

Edit `components/Navbar.tsx`:
```typescript
// Change this:
<Heart className="w-6 h-6 text-red-500" />

// To your color:
<Heart className="w-6 h-6 text-purple-500" />
```

Edit `app/page.tsx`:
```typescript
// Change gradient:
className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
```

### 2. Change Site Title

**3 places to update:**

1. `app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: "Your Site Name - Discover Cool Websites",
  // ...
};
```

2. `components/Navbar.tsx`:
```typescript
<span className="...">Your Site Name</span>
```

3. `app/page.tsx`:
```typescript
<h1 className="...">Your Site Name</h1>
```

### 3. Change Contact Email

In `components/Navbar.tsx`:
```typescript
window.location.href =
  "mailto:your-email@example.com?subject=Submit a Cool Website";
```

---

## 🔧 Advanced Features to Add

### Add Search Functionality

```typescript
// In app/page.tsx, modify getWebsites():

async function getWebsites(sortBy: string = "upvotes", search?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("websites")
    .select("*");

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (sortBy === "upvotes") {
    query = query.order("upvotes_count", { ascending: false });
  }

  const { data } = await query;
  return data as Website[];
}
```

Then update the page component:
```typescript
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; q?: string }>;
}) {
  const params = await searchParams;
  const search = params.q;
  const websites = await getWebsites(params.sort || "upvotes", search);
  
  return (
    <>
      <input 
        type="search" 
        placeholder="Search websites..."
        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700"
      />
      {/* ... rest of component */}
    </>
  );
}
```

### Add Categories

**1. Update database schema:**
```sql
ALTER TABLE websites ADD COLUMN category TEXT DEFAULT 'general';

CREATE INDEX idx_websites_category ON websites(category);
```

**2. Update fetching logic:**
```typescript
async function getWebsites(
  sortBy: string = "upvotes",
  category?: string
) {
  const supabase = await createClient();
  let query = supabase.from("websites").select("*");

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  return query.order("upvotes_count", { ascending: false });
}
```

### Real-time Updates (Supabase Realtime)

```typescript
// In components/WebsiteCard.tsx:

import { useEffect } from "react";

export function WebsiteCard({ website }: { website: Website }) {
  const supabase = createClient();

  useEffect(() => {
    // Subscribe to vote changes
    const subscription = supabase
      .channel(`votes:website_id=eq.${website.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "votes",
          filter: `website_id=eq.${website.id}`,
        },
        async () => {
          // Refresh upvote count
          const { data } = await supabase
            .from("votes")
            .select("*", { count: "exact" })
            .eq("website_id", website.id);
          
          setUpvotesCount(data?.length || 0);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [website.id, supabase]);

  // ... rest of component
}
```

---

## 🎨 Styling Tips

### Add Animations

In `app/globals.css`:
```css
@layer components {
  .fade-in {
    animation: fadeIn 0.5s ease-in;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Custom Tailwind Theme

Edit `tailwind.config.ts`:
```typescript
theme: {
  extend: {
    colors: {
      brand: {
        50: "#f9fafb",
        500: "#6b7280",
        900: "#111827",
      },
    },
    keyframes: {
      shimmer: {
        "0%": { backgroundPosition: "-1000px 0" },
        "100%": { backgroundPosition: "1000px 0" },
      },
    },
  },
}
```

---

## 🔐 Security Best Practices

### 1. Validate User Input

```typescript
// Before inserting website
if (!title || title.length > 200) {
  throw new Error("Invalid title");
}

if (!isValidUrl(url)) {
  throw new Error("Invalid URL");
}
```

### 2. Rate Limiting

Prevent abuse:
```typescript
// Add to WebsiteCard upvote handler
const lastVote = localStorage.getItem(`vote_${website.id}_timestamp`);
const now = Date.now();

if (lastVote && (now - parseInt(lastVote)) < 1000) {
  throw new Error("Please wait before voting again");
}

localStorage.setItem(`vote_${website.id}_timestamp`, now.toString());
```

### 3. Content Security Policy

In `next.config.ts`:
```typescript
headers: [
  {
    source: "/(.*)",
    headers: [
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "X-Frame-Options",
        value: "DENY",
      },
    ],
  },
],
```

---

## ⚡ Performance Optimization

### 1. Image Optimization

Add website favicons:
```typescript
// In WebsiteCard.tsx
import Image from "next/image";

<Image
  src={`https://www.google.com/s2/favicons?sz=64&domain_url=${website.url}`}
  alt={website.title}
  width={32}
  height={32}
/>
```

### 2. Pagination

```typescript
// In app/page.tsx
const PAGE_SIZE = 12;

async function getWebsites(
  sortBy: string,
  page: number = 1
) {
  const start = (page - 1) * PAGE_SIZE;
  
  let query = supabase
    .from("websites")
    .select("*");
  
  if (sortBy === "upvotes") {
    query = query.order("upvotes_count", { ascending: false });
  }
  
  return query.range(start, start + PAGE_SIZE - 1);
}
```

### 3. Caching

```typescript
// In next.config.ts
experimental: {
  isrMemoryCacheSize: 50 * 1024 * 1024,
}

// In app/page.tsx - revalidate every 60 seconds
export const revalidate = 60;
```

---

## 🧪 Testing

### Unit Test Example (with Jest)

Install Jest:
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

Create `components/__tests__/WebsiteCard.test.tsx`:
```typescript
import { render, screen } from "@testing-library/react";
import { WebsiteCard } from "../WebsiteCard";

describe("WebsiteCard", () => {
  const mockWebsite = {
    id: "1",
    title: "GitHub",
    url: "https://github.com",
    description: "Code hosting",
    upvotes_count: 5,
    created_at: "2024-01-01",
  };

  it("renders website title", () => {
    render(<WebsiteCard website={mockWebsite} />);
    expect(screen.getByText("GitHub")).toBeInTheDocument();
  });

  it("displays correct upvote count", () => {
    render(<WebsiteCard website={mockWebsite} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});
```

---

## 📊 Analytics Integration

### Add Google Analytics

Install:
```bash
npm install @next/third-parties
```

In `app/layout.tsx`:
```typescript
import { GoogleAnalytics } from "@next/third-parties/google";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  );
}
```

---

## 🐛 Debugging Tips

### Enable Debug Logging

In `.env.local`:
```env
NEXT_PUBLIC_DEBUG=true
```

In `lib/supabase/server.ts`:
```typescript
if (process.env.NEXT_PUBLIC_DEBUG) {
  console.log("Fetching websites...");
}
```

### Check Supabase Logs

Supabase Dashboard → Logs → Check for errors

### Browser DevTools

```javascript
// Check if user is logged in
const supabase = supabaseClient;
const { data: { user } } = await supabase.auth.getUser();
console.log("Current user:", user);

// Check votes table
const { data } = await supabase.from("votes").select("*");
console.log("All votes:", data);
```

---

## 📦 Deployment Optimization

### Reduce Bundle Size

Remove unused dependencies:
```bash
npm ls
npm prune
```

### Analyze Bundle

Install `next-bundle-analyzer`:
```bash
npm install --save-dev @next/bundle-analyzer
```

Edit `next.config.ts`:
```typescript
import withBundleAnalyzer from "@next/bundle-analyzer";

const withBundleConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleConfig(nextConfig);
```

Run:
```bash
ANALYZE=true npm run build
```

---

## 🚀 Advanced Deployment

### Environment-Specific Configs

Create `.env.staging`:
```env
NEXT_PUBLIC_SUPABASE_URL=staging_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=staging_key
```

### CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "20"
      - run: npm install
      - run: npm run build
      - run: npm run lint
```

---

## 💡 Pro Tips

1. **Use Vercel for deployment** - Next.js + Vercel = seamless
2. **Monitor Supabase logs** - Catch issues early
3. **Version your database** - Use migration files
4. **Test upvote logic locally** - Use Supabase local dev
5. **Implement feedback** - Add toast notifications for user actions
6. **Cache frequently accessed data** - Reduce database hits
7. **Use TypeScript strict mode** - Catch bugs early
8. **Write meaningful comments** - Help future you

---

That's it! You're now a CoolWebs expert. 🎉

Happy coding!
