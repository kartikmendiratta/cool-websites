# CoolWebs - Deployment Checklist

## Pre-Deployment

- [ ] All dependencies installed: `npm install`
- [ ] Environment variables set in `.env.local`
- [ ] Supabase project created and schema deployed
- [ ] Tested upvote functionality locally
- [ ] Tested sorting functionality
- [ ] Tested responsive design on mobile

## Code Quality

- [ ] Run `npm run build` - no errors
- [ ] Run `npm run lint` - no warnings
- [ ] TypeScript strict mode passes
- [ ] All imports resolved correctly

## Supabase Production Setup

- [ ] Enable RLS on all tables (already done in schema)
- [ ] Verify RLS policies are correct
- [ ] Set up Supabase backups
- [ ] Enable email verification for auth (optional)
- [ ] Test with real email authentication

## Environment Variables for Production

Create a `.env.production.local` with:
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
```

## Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy → Vercel handles the rest!

### Vercel Deployment Commands
```bash
npm run build
npm run start
```

## Post-Deployment

- [ ] Test homepage loads
- [ ] Test sorting works
- [ ] Test upvote button (try with/without login)
- [ ] Test "Submit a Site" mailto link
- [ ] Check Core Web Vitals in Vercel Analytics
- [ ] Monitor error logs in Vercel
- [ ] Set up Supabase monitoring/alerts

## Security Checklist

- [ ] No hardcoded secrets in code (use .env)
- [ ] RLS policies prevent unauthorized access
- [ ] CORS properly configured
- [ ] Supabase project has strong password
- [ ] Enable 2FA on Supabase
- [ ] Review Supabase API tokens regularly

## Performance Optimization

- [ ] Enable image optimization (configure next.config.ts)
- [ ] Set up CDN caching headers
- [ ] Monitor Vercel analytics
- [ ] Use Supabase query performance insights
- [ ] Consider adding Redis caching for popular sites

## Monitoring & Maintenance

- [ ] Set up Vercel alerts
- [ ] Monitor Supabase database performance
- [ ] Regular backups enabled
- [ ] Review user feedback/issues
- [ ] Plan feature updates

---

## Production Supabase Tips

### Database Connection Pool
For production, use Supabase connection pooling:
- Settings → Database → Pooling → Enable PgBouncer

### Realtime (Optional)
To enable live updates when someone upvotes:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE votes;
```

### Backups
Supabase provides automatic daily backups. Ensure:
- Backup frequency: Daily or more
- Retention: 7+ days
- Test restore procedures

---

## Rollback Plan

If something goes wrong:
1. Revert Vercel deployment to previous build
2. Check Supabase logs for errors
3. Verify environment variables
4. Database: Supabase keeps 7-day backup

---

## Scaling Considerations

As you grow:

**1. Database Indexes** (already added)
- `idx_websites_upvotes_count` - sorting
- `idx_votes_website_id` - finding votes
- `idx_votes_user_id` - user votes

**2. Caching Layer**
- Add Redis for frequently upvoted sites
- Cache homepage for 5-10 minutes

**3. Rate Limiting**
- Limit upvotes per user per hour
- Prevent spam submissions

**4. Pagination**
- If websites exceed 100, implement pagination
- Current grid loads all at once

---

Congrats! Your app is production-ready! 🎉
