-- Supabase Schema for Supernova AI Marketing Agent

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Campaigns table
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  product_url TEXT,
  company TEXT,
  status TEXT DEFAULT 'Researching',
  cover_image TEXT,
  campaign_type TEXT DEFAULT 'ad',
  product_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assets table
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  project_id UUID,
  type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  thumbnail TEXT,
  duration INTEGER,
  width INTEGER,
  height INTEGER,
  file_size BIGINT DEFAULT 0,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scripts table
CREATE TABLE scripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  script TEXT NOT NULL,
  style TEXT,
  duration INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics table
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE UNIQUE,
  videos_generated INTEGER DEFAULT 0,
  images_generated INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  total_assets INTEGER DEFAULT 0,
  last_generated TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activities table
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_campaigns_created_at ON campaigns(created_at DESC);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_assets_campaign_id ON assets(campaign_id);
CREATE INDEX idx_assets_created_at ON assets(created_at DESC);
CREATE INDEX idx_assets_type ON assets(type);
CREATE INDEX idx_scripts_campaign_id ON scripts(campaign_id);
CREATE INDEX idx_activities_campaign_id ON activities(campaign_id);
CREATE INDEX idx_activities_timestamp ON activities(timestamp DESC);

-- Enable Row Level Security (RLS) - disabled for now, enable after auth setup
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Public access policies (for now, restrict after auth)
CREATE POLICY "Public campaigns" ON campaigns FOR SELECT USING (true);
CREATE POLICY "Public assets" ON assets FOR SELECT USING (true);
CREATE POLICY "Public scripts" ON scripts FOR SELECT USING (true);
CREATE POLICY "Public analytics" ON analytics FOR SELECT USING (true);
CREATE POLICY "Public activities" ON activities FOR SELECT USING (true);

CREATE POLICY "Insert campaigns" ON campaigns FOR INSERT WITH CHECK (true);
CREATE POLICY "Insert assets" ON assets FOR INSERT WITH CHECK (true);
CREATE POLICY "Insert scripts" ON scripts FOR INSERT WITH CHECK (true);
CREATE POLICY "Insert analytics" ON analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Insert activities" ON activities FOR INSERT WITH CHECK (true);

CREATE POLICY "Update campaigns" ON campaigns FOR UPDATE USING (true);
CREATE POLICY "Update assets" ON assets FOR UPDATE USING (true);
CREATE POLICY "Update analytics" ON analytics FOR UPDATE USING (true);

CREATE POLICY "Delete campaigns" ON campaigns FOR DELETE USING (true);
CREATE POLICY "Delete assets" ON assets FOR DELETE USING (true);
CREATE POLICY "Delete scripts" ON scripts FOR DELETE USING (true);

-- Storage buckets (run these in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('thumbnails', 'thumbnails', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('audio', 'audio', true);
