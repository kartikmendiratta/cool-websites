# 🚀 CoolWebs - Next.js 16.1 Boilerplate

## Welcome! Your project is ready. 

**Everything you need to build a website directory app with Supabase Auth, Tailwind CSS, and modern React practices.**

---

## ⚡ Quick Start (3 Steps)

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Set Up Supabase
- Go to [supabase.com](https://supabase.com) → Create project
- Copy: Project URL & anon key
- Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```
- Run **entire** `SUPABASE_SCHEMA.sql` in Supabase SQL Editor

### 3️⃣ Start Development
```bash
npm run dev
```

Visit: **http://localhost:3000** 🎉

---

## 📚 Documentation Index

Read these in order:

1. **[QUICKSTART.md](QUICKSTART.md)** ← Start here! (5-minute setup)
2. **[README.md](README.md)** ← Full documentation
3. **[FILE_STRUCTURE.md](FILE_STRUCTURE.md)** ← Learn the codebase
4. **[SETUP.md](SETUP.md)** ← Detailed guide
5. **[DEPLOYMENT.md](DEPLOYMENT.md)** ← Deploy to production

---

## 📦 What's Included

### Latest Versions ✅
- **Next.js 16.1** with Turbopack (ultra-fast builds)
- **React 19.0** RC (latest)
- **TypeScript 5.7** (strict mode)
- **Tailwind CSS 4.0** (dark mode default)
- **Supabase 2.47** (database & auth)
- **Lucide React 0.470** (icons)

### Features ✅
- 🏠 Homepage with website grid
- 👆 Upvote system with authentication
- 📊 Sorting (Most Upvoted / Newest)
- 🔐 Supabase Auth integration
- 📱 Responsive design (mobile-first)
- 🌙 Dark mode by default
- ⚡ Server-side rendering (SSR)
- 🗄️ Complete database schema with RLS
- 💻 TypeScript strict mode
- 🚀 Ready for Vercel deployment

---

## 🎯 Core Functionality

### Homepage (`app/page.tsx`)
```
┌─────────────────────────────────────┐
│  CoolWebs | [Submit a Site]         │  ← Navbar
├─────────────────────────────────────┤
│                                     │
│  Sort: [Most Upvoted] [Newest]     │
│                                     │
│  ┌──────┐ ┌──────┐ ┌──────┐       │
│  │GitHub│ │Stack │ │MDN   │       │
│  │ Web  │ │Flow  │ │Docs  │       │
│  │Visit │ │Visit │ │Visit │       │
│  │[👍 5]│ │[👍 3]│ │[👍 8]│       │
│  └──────┘ └──────┘ └──────┘       │
│                                     │
└─────────────────────────────────────┘
```

### Features
- **Server-side** website fetching
- **Client-side** upvote interaction
- **Live** upvote counter
- **Auth** check before upvoting
- **Prevent** duplicate upvotes (database unique constraint)

---

## 🗄️ Database Schema

### `websites` table
```sql
id (UUID primary key)
title (TEXT)
url (TEXT)
description (TEXT)
upvotes_count (INT) ← Auto-updated by trigger
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### `votes` table
```sql
id (UUID primary key)
user_id (UUID) → Supabase auth.users
website_id (UUID) → websites table
created_at (TIMESTAMP)
UNIQUE(user_id, website_id) ← Prevents duplicates
```

**RLS Policies:**
- Public read on `websites`
- Authenticated-only upvotes
- Users can only delete their own votes

---

## 📂 Project Structure

```
coolwebs/
├── app/                    ← Pages & layouts (App Router)
│   ├── layout.tsx         (Root layout with Navbar)
│   ├── page.tsx           (Homepage - async searchParams)
│   └── globals.css        (Tailwind styles)
│
├── components/            ← React components
│   ├── Navbar.tsx         (Header)
│   └── WebsiteCard.tsx    (Website card with upvote)
│
├── lib/supabase/          ← Database utilities
│   ├── server.ts          (Server client for fetching)
│   └── client.ts          (Browser client for auth/realtime)
│
├── Configuration Files
│   ├── package.json       (Dependencies)
│   ├── tsconfig.json      (TypeScript config)
│   ├── next.config.ts     (Next.js config)
│   ├── tailwind.config.ts (Tailwind config)
│   └── .env.example       (Environment template)
│
└── Documentation
    ├── README.md          (Full docs)
    ├── QUICKSTART.md      (5-min setup)
    ├── SETUP.md           (Detailed guide)
    ├── DEPLOYMENT.md      (Production checklist)
    ├── FILE_STRUCTURE.md  (File guide)
    └── SUPABASE_SCHEMA.sql (Database schema)
```

---

## 🔑 Key Next.js 16 Patterns

### ⭐ Async `searchParams` (Required!)
```typescript
// ✅ CORRECT for Next.js 16
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const params = await searchParams;  // MUST AWAIT!
  const sortBy = params.sort || "upvotes";
  // ...
}
```

### Server vs Client Components
- **Server**: `page.tsx` (data fetching)
- **Server**: `layout.tsx` (root layout)
- **Client**: `WebsiteCard.tsx` (interactivity)
- **Client**: `Navbar.tsx` (event handlers)

---

## 🔐 Authentication Flow

```
User clicks "Upvote"
    ↓
Check if logged in (Supabase Auth)
    ↓
Is user logged in?
    ├─ NO  → Redirect to login
    └─ YES → Check if already upvoted
           ├─ YES → Remove vote from `votes` table
           └─ NO  → Add vote to `votes` table
           ↓
Database trigger updates `upvotes_count`
    ↓
Live counter updates in UI
```

---

## 🚀 Development Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Run production build
npm run lint     # Check code quality
```

---

## 📋 Setup Checklist

- [ ] `npm install` (install dependencies)
- [ ] Create Supabase project
- [ ] Copy Project URL & anon key
- [ ] Create `.env.local` with credentials
- [ ] Run SQL schema in Supabase
- [ ] `npm run dev`
- [ ] Visit http://localhost:3000
- [ ] Test upvote button
- [ ] Test sorting

**Once working:**
- [ ] Customize colors/branding
- [ ] Add auth login page (optional)
- [ ] Add website submission form (optional)
- [ ] Deploy to Vercel

---

## 🎨 Customization

### Change Colors
Edit `tailwind.config.ts` theme colors

### Change Site Name
Search & replace "CoolWebs" throughout the project

### Add Categories
Add `category` column to `websites` table, filter in homepage

### Add Search
Implement search in `app/page.tsx` using Supabase full-text search

---

## 🐛 Troubleshooting

### Dependencies won't install
```bash
rm -r node_modules
npm install
```

### Supabase credentials not working
- Check `.env.local` has correct values (no extra spaces)
- Verify they're from Supabase Dashboard → Settings → API

### Upvote button doesn't work
- Check browser DevTools → Console for errors
- Verify SQL schema was **completely** run
- Ensure RLS policies are enabled

### TypeScript errors
```bash
npm run build  # See full error output
```

---

## 📚 Learning Resources

- **Next.js 16 Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs/

---

## 🚢 Deploy to Vercel

1. Push code to GitHub
2. Import repo in Vercel
3. Add environment variables
4. Deploy! (automatic on push)

See [DEPLOYMENT.md](DEPLOYMENT.md) for full guide.

---

## 📞 Support

- Check [README.md](README.md) for FAQs
- Check [SETUP.md](SETUP.md) for detailed setup
- Look at code comments for explanations

---

## Next Steps

**Now that you have the boilerplate:**

1. ✅ Get it running locally (QUICKSTART.md)
2. ✅ Customize branding & colors
3. 🔜 Add user authentication page
4. 🔜 Build website submission form
5. 🔜 Add user dashboard
6. 🔜 Implement search & filters
7. 🔜 Deploy to Vercel

---

## 🎉 You're All Set!

Your Next.js 16 boilerplate is **production-ready**. 

Start with [QUICKSTART.md](QUICKSTART.md) → Get it running → Build your features!

Happy coding! 🚀

---

**Generated with Next.js 16.1 • Supabase • Tailwind CSS • TypeScript**
