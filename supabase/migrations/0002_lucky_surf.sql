/*
  # Events Pro Database Schema Update

  1. Changes
    - Drop existing tables and types if they exist
    - Recreate schema with updated structure
    - Add new event_stats table
    - Update RLS policies
*/

-- Drop existing objects if they exist
DROP TABLE IF EXISTS event_stats;
DROP TABLE IF EXISTS event_applications;
DROP TABLE IF EXISTS usher_profiles;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS profiles;

-- Drop existing types if they exist
DROP TYPE IF EXISTS application_status;
DROP TYPE IF EXISTS event_status;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create event_status enum type
CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');

-- Create application_status enum type
CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected');

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role user_role NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  required_ushers INTEGER NOT NULL DEFAULT 1,
  price_per_usher DECIMAL(10,2) NOT NULL,
  status event_status NOT NULL DEFAULT 'draft',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_required_ushers CHECK (required_ushers > 0),
  CONSTRAINT valid_price CHECK (price_per_usher > 0)
);

-- Create usher profiles table
CREATE TABLE usher_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id),
  specialty TEXT NOT NULL,
  hourly_rate DECIMAL(10,2) NOT NULL,
  experience_years INTEGER DEFAULT 0,
  bio TEXT,
  available BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  rating DECIMAL(2,1) DEFAULT 5.0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_hourly_rate CHECK (hourly_rate > 0),
  CONSTRAINT valid_experience CHECK (experience_years >= 0),
  CONSTRAINT valid_rating CHECK (rating >= 0 AND rating <= 5)
);

-- Create event applications table
CREATE TABLE event_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id),
  usher_id UUID NOT NULL REFERENCES usher_profiles(id),
  status application_status NOT NULL DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, usher_id)
);

-- Create event stats table
CREATE TABLE event_stats (
  event_id UUID PRIMARY KEY REFERENCES events(id),
  views INTEGER DEFAULT 0,
  applications INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE usher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_stats ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Events policies
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Companies can create events"
  ON events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'company'
    )
  );

CREATE POLICY "Companies can update own events"
  ON events FOR UPDATE
  USING (company_id = auth.uid());

-- Usher profiles policies
CREATE POLICY "Usher profiles are viewable by everyone"
  ON usher_profiles FOR SELECT
  USING (true);

CREATE POLICY "Ushers can update own profile"
  ON usher_profiles FOR UPDATE
  USING (id = auth.uid());

-- Event applications policies
CREATE POLICY "Companies can view applications for their events"
  ON event_applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_applications.event_id
      AND events.company_id = auth.uid()
    )
  );

CREATE POLICY "Ushers can view own applications"
  ON event_applications FOR SELECT
  USING (usher_id = auth.uid());

CREATE POLICY "Ushers can create applications"
  ON event_applications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'usher'
    )
  );

-- Event stats policies
CREATE POLICY "Event stats are viewable by everyone"
  ON event_stats FOR SELECT
  USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_usher_profiles_updated_at
  BEFORE UPDATE ON usher_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_event_applications_updated_at
  BEFORE UPDATE ON event_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_event_stats_updated_at
  BEFORE UPDATE ON event_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();