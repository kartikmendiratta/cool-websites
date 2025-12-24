# CoolWebs - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Get Supabase Credentials
1. Go to [supabase.com](https://supabase.com) → Create new project
2. Wait for project to initialize (~2 min)
3. Go to **Settings → API** 
4. Copy:
   - `Project URL` 
   - `anon public key`

### Step 3: Create `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=paste_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_key_here
```

### Step 4: Run SQL Schema
1. In Supabase Dashboard → **SQL Editor**
2. Click **New Query**
3. Copy entire content of `SUPABASE_SCHEMA.sql`
4. Paste into SQL editor
5. Click **Run**

### Step 5: Start Dev Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

---

## 📋 What You Get

✅ Modern dark-mode UI  
✅ Live upvote system with auth  
✅ Responsive grid layout  
✅ Sorting (Most Upvoted / Newest)  
✅ Submit site via email  
✅ Full TypeScript support  
✅ Next.js 16 with Turbopack  

---

## 🔑 Key Features

### Homepage (`app/page.tsx`)
- Server-side data fetching
- Async `searchParams` (Next.js 16 requirement)
- Sorting controls
- Responsive grid

### Website Card (`components/WebsiteCard.tsx`)
- Client component with upvote button
- Auth check before upvote
- Live counter updates
- Prevents duplicate upvotes (database unique constraint)

### Authentication Flow
1. User clicks "Upvote"
2. Check if logged in (Supabase Auth)
3. If not → redirect to login (requires auth page setup)
4. If yes → toggle upvote in `votes` table
5. Auto-update `upvotes_count` via database trigger

---

## 🗄️ Database Structure

```
websites
├── id (UUID)
├── title (TEXT)
├── url (TEXT)
├── description (TEXT)
├── upvotes_count (INT, auto-synced)
└── created_at (TIMESTAMP)

votes (tracks user upvotes)
├── id (UUID)
├── user_id (UUID) → auth.users
├── website_id (UUID) → websites
└── UNIQUE(user_id, website_id)
```

---

## 🚀 Next Steps

1. **Add Auth Pages** - Create `app/auth/login` page
2. **Website Submission** - Replace `mailto:` with form in `app/submit`
3. **User Dashboard** - Show submitted websites by user
4. **Categories** - Add category filtering
5. **Search** - Implement full-text search

---

## ❓ Troubleshooting

### Upvote button doesn't work
- Check `.env.local` has correct Supabase credentials
- Verify SQL schema was run completely
- Check browser console for errors

### Build errors
```bash
npm run build  # See full error output
```

### Can't see sample websites
- Make sure you ran the entire `SUPABASE_SCHEMA.sql`
- Check that `websites` table has data in Supabase Dashboard

---

## 📚 File Map

```
app/page.tsx           ← Homepage (server component, data fetching)
app/layout.tsx         ← Root layout
components/
  ├── Navbar.tsx       ← Header with Submit button
  └── WebsiteCard.tsx  ← Card component with upvote logic (client)
lib/supabase/
  ├── server.ts        ← Server client (fetch data)
  └── client.ts        ← Browser client (auth, upvotes)
```

---

Enjoy building CoolWebs! 🎉
