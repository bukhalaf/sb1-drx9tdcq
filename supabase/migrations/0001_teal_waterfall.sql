/*
  # Initial Schema for Events Pro

  1. New Tables
    - `profiles`
      - Stores user profile information
      - Links to Supabase auth.users
      - Includes role and profile details
    
    - `events`
      - Stores event information
      - Includes details like name, date, location
      - Links to company/manager profile
    
    - `usher_profiles`
      - Stores usher-specific information
      - Links to profiles table
      - Includes specialty and pricing
    
    - `event_applications`
      - Tracks usher applications to events
      - Links events and usher profiles
      - Includes application status

  2. Security
    - Enable RLS on all tables
    - Policies for each user role
    - Secure access patterns for all operations
*/

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('admin', 'company', 'usher');

-- Create enum for application status
CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected');

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  role user_role NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES profiles(id) NOT NULL,
  name text NOT NULL,
  description text,
  date timestamptz NOT NULL,
  location text NOT NULL,
  required_ushers integer NOT NULL DEFAULT 1,
  price_per_usher decimal(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create usher profiles table
CREATE TABLE usher_profiles (
  id uuid PRIMARY KEY REFERENCES profiles(id),
  specialty text NOT NULL,
  hourly_rate decimal(10,2) NOT NULL,
  experience_years integer DEFAULT 0,
  bio text,
  availability boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create event applications table
CREATE TABLE event_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) NOT NULL,
  usher_id uuid REFERENCES usher_profiles(id) NOT NULL,
  status application_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(event_id, usher_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE usher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_applications ENABLE ROW LEVEL SECURITY;

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
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'company'
    )
  );

CREATE POLICY "Companies can update own events"
  ON events FOR UPDATE
  USING (creator_id = auth.uid());

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
      AND events.creator_id = auth.uid()
    )
  );

CREATE POLICY "Ushers can view own applications"
  ON event_applications FOR SELECT
  USING (usher_id = auth.uid());

CREATE POLICY "Ushers can create applications"
  ON event_applications FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'usher'
    )
  );

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating timestamps
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