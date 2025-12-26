CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create the websites table (idempotent)
CREATE TABLE IF NOT EXISTS websites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT NOT NULL,
  upvotes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Moderation: only approved rows are publicly visible
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected'))
);

-- Create the votes table (idempotent)
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, website_id)
);

-- Create indexes for better query performance (idempotent)
CREATE INDEX IF NOT EXISTS idx_websites_upvotes_count ON websites(upvotes_count DESC);
CREATE INDEX IF NOT EXISTS idx_votes_website_id ON votes(website_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Websites table policies (idempotent)
-- Read: only approved are visible to anon/auth; service_role can read all
DROP POLICY IF EXISTS "websites select public approved" ON websites;
CREATE POLICY "websites select public approved"
  ON websites FOR SELECT
  USING (status = 'approved' OR auth.role() = 'service_role');

-- Insert: authenticated users can only create as pending
DROP POLICY IF EXISTS "websites insert authenticated pending" ON websites;
CREATE POLICY "websites insert authenticated pending"
  ON websites FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND status = 'pending');

-- Update: only service_role (admin) can update rows (e.g., approve/reject)
DROP POLICY IF EXISTS "websites update service role" ON websites;
CREATE POLICY "websites update service role"
  ON websites FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Votes table policies (idempotent)
DROP POLICY IF EXISTS "Enable read access for all users" ON votes;
CREATE POLICY "Enable read access for all users"
  ON votes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated users" ON votes;
CREATE POLICY "Enable insert for authenticated users"
  ON votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Enable delete for vote owner" ON votes;
CREATE POLICY "Enable delete for vote owner"
  ON votes FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update upvotes_count when a vote is inserted
CREATE OR REPLACE FUNCTION update_website_upvotes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE websites
  SET upvotes_count = (SELECT COUNT(*) FROM votes WHERE website_id = NEW.website_id)
  WHERE id = NEW.website_id;
  RETURN NEW;
END;
$$;

-- Function to update upvotes_count when a vote is deleted
CREATE OR REPLACE FUNCTION update_website_upvotes_on_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE websites
  SET upvotes_count = (SELECT COUNT(*) FROM votes WHERE website_id = OLD.website_id)
  WHERE id = OLD.website_id;
  RETURN OLD;
END;
$$;

-- Triggers to automatically update upvotes_count (idempotent)
DROP TRIGGER IF EXISTS trigger_update_upvotes_on_insert ON votes;
CREATE TRIGGER trigger_update_upvotes_on_insert
AFTER INSERT ON votes
FOR EACH ROW
EXECUTE FUNCTION update_website_upvotes();

DROP TRIGGER IF EXISTS trigger_update_upvotes_on_delete ON votes;
CREATE TRIGGER trigger_update_upvotes_on_delete
AFTER DELETE ON votes
FOR EACH ROW
EXECUTE FUNCTION update_website_upvotes_on_delete();

-- Insert sample data (optional)
INSERT INTO websites (title, url, description) VALUES
('GitHub', 'https://github.com', 'The world''s leading software development platform'),
('Stack Overflow', 'https://stackoverflow.com', 'Q&A platform for developers'),
('MDN Web Docs', 'https://developer.mozilla.org', 'Comprehensive web development documentation'),
('Dev.to', 'https://dev.to', 'Community for developers to share knowledge');
