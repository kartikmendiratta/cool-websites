# CoolWebs - Website Directory

A modern, minimalist website directory built with Next.js 16, Supabase, and Tailwind CSS.

## Features

- 🌐 Browse a curated directory of cool websites
- 👆 Upvote your favorite sites
- 🔐 Secure authentication with Supabase Auth
- 📱 Responsive design (mobile-first)
- 🌙 Dark mode by default
- ⚡ Server-side rendering with Next.js 16 App Router
- 🚀 Turbopack for ultra-fast builds

## Tech Stack

- **Framework**: Next.js 16.1 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database & Auth**: Supabase
- **Icons**: Lucide React
- **Async Params**: Full Next.js 16 compliance with awaited searchParams

## Project Structure

```
coolwebs/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage (with async searchParams)
│   └── globals.css         # Global styles
├── lib/
│   └── supabase/
│       ├── server.ts       # Server-side Supabase client
│       └── client.ts       # Browser-side Supabase client
├── components/
│   ├── Navbar.tsx          # Navigation component
│   └── WebsiteCard.tsx     # Website card with upvote logic
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── SUPABASE_SCHEMA.sql     # Database schema
```

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd coolwebs
npm install
```

### 2. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your **Project URL** and **Anon Key**
4. Paste them into `.env.local` (create this file):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run the SQL Schema

1. Go to Supabase Dashboard → SQL Editor
2. Copy the entire contents of `SUPABASE_SCHEMA.sql`
3. Paste it into a new SQL query
4. Click "Run"

This will create:
- `websites` table (with RLS policies)
- `votes` table (with RLS policies)
- Indexes for performance
- Triggers to auto-update upvote counts
- Sample data

### 4. Enable Authentication

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable "Email" (built-in)
3. (Optional) Enable other providers (Google, GitHub, etc.)

### 5. Set Up Environment Variables

Create `.env.local` in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Next.js 16 Key Features Used

✅ **Async `searchParams`** - All page components await searchParams as a Promise:

```typescript
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const params = await searchParams; // MUST AWAIT
  // ...
}
```

✅ **Turbopack** - Ultra-fast builds enabled in `next.config.ts`

✅ **App Router** - All routes use the new App Router structure

## API Routes & Server Actions

Currently, upvote operations are handled client-side using Supabase's JavaScript SDK. For future scale:

- Consider creating dedicated API routes in `app/api/`
- Implement Server Actions for sensitive operations
- Add rate limiting for upvotes

## Database Schema Overview

### `websites` table
```sql
- id: UUID (primary key)
- title: TEXT
- url: TEXT
- description: TEXT
- upvotes_count: INTEGER (auto-updated via triggers)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### `votes` table
```sql
- id: UUID (primary key)
- user_id: UUID (foreign key to auth.users)
- website_id: UUID (foreign key to websites)
- created_at: TIMESTAMP
- UNIQUE(user_id, website_id) - prevents duplicate upvotes
```

## RLS Policies

- **websites**: Public read, authenticated-only insert
- **votes**: Public read, authenticated insert/delete (own votes only)

## Future Enhancements

- [ ] Add website submission form (currently uses mailto)
- [ ] Implement categories/tags
- [ ] Add search and filters
- [ ] User profiles and submission history
- [ ] Admin dashboard for moderation
- [ ] Leaderboard (most active contributors)
- [ ] Comments/reviews on websites
- [ ] Export/share collections

## Troubleshooting

### "Supabase client error"
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
- Check that they're copied correctly (no extra spaces)

### "RLS policy error on upvote"
- Ensure you ran the SQL schema completely
- Check that auth is enabled in Supabase
- Verify the unique constraint on `votes(user_id, website_id)`

### Build fails with TypeScript errors
- Run `npm run build` to see full errors
- Check that all environment variables are set
- Ensure Node.js 18+ is installed

## License

MIT

## Support

For issues or questions, open an issue on GitHub or contact owner@example.com.
