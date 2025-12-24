-- Create the websites table
CREATE TABLE websites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT NOT NULL,
  upvotes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the votes table
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, website_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_websites_upvotes_count ON websites(upvotes_count DESC);
CREATE INDEX idx_votes_website_id ON votes(website_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Websites table policies
CREATE POLICY "Enable read access for all users"
  ON websites FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON websites FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Votes table policies
CREATE POLICY "Enable read access for all users"
  ON votes FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for vote owner"
  ON votes FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update upvotes_count when a vote is inserted
CREATE OR REPLACE FUNCTION update_website_upvotes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE websites
  SET upvotes_count = (SELECT COUNT(*) FROM votes WHERE website_id = NEW.website_id)
  WHERE id = NEW.website_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update upvotes_count when a vote is deleted
CREATE OR REPLACE FUNCTION update_website_upvotes_on_delete()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE websites
  SET upvotes_count = (SELECT COUNT(*) FROM votes WHERE website_id = OLD.website_id)
  WHERE id = OLD.website_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update upvotes_count
CREATE TRIGGER trigger_update_upvotes_on_insert
AFTER INSERT ON votes
FOR EACH ROW
EXECUTE FUNCTION update_website_upvotes();

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
