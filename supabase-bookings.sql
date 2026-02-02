-- ============================================
-- BOOKINGS TABLE SETUP FOR CASTREACH
-- ============================================
-- This SQL creates the bookings table and related policies
-- Run this in your Supabase SQL Editor

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Host information
  host_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  host_name TEXT NOT NULL,
  
  -- Guest information
  guest_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  
  -- Episode details
  podcast_title TEXT NOT NULL,
  episode_topic TEXT NOT NULL,
  description TEXT,
  
  -- Scheduling
  preferred_date DATE NOT NULL,
  preferred_time TIME NOT NULL,
  duration INTEGER NOT NULL DEFAULT 60, -- in minutes
  
  -- Recording details
  recording_type TEXT NOT NULL CHECK (recording_type IN ('online', 'offline')),
  location TEXT,
  meeting_link TEXT,
  
  -- Additional information
  notes TEXT,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled', 'completed')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for bookings

-- 1. Users can view bookings where they are either the host or the guest
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  USING (
    auth.uid() = host_id OR 
    auth.uid() = guest_id
  );

-- 2. Hosts can create booking requests
CREATE POLICY "Hosts can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (
    auth.uid() = host_id AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'host'
    )
  );

-- 3. Users can update bookings where they are involved
-- Hosts can update their own bookings (edit details, cancel)
-- Guests can update status (accept/decline)
CREATE POLICY "Users can update their bookings"
  ON bookings FOR UPDATE
  USING (
    auth.uid() = host_id OR 
    auth.uid() = guest_id
  )
  WITH CHECK (
    auth.uid() = host_id OR 
    auth.uid() = guest_id
  );

-- 4. Only hosts can delete their own bookings
CREATE POLICY "Hosts can delete their bookings"
  ON bookings FOR DELETE
  USING (
    auth.uid() = host_id
  );

-- Create updated_at trigger for bookings
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_bookings_host_id ON bookings(host_id);
CREATE INDEX idx_bookings_guest_id ON bookings(guest_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_preferred_date ON bookings(preferred_date);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify the setup

-- Check if table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'bookings';

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'bookings';

-- Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'bookings';
