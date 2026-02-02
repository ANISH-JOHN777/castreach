-- ============================================
-- CASTREACH DATABASE SCHEMA
-- Supabase PostgreSQL Setup Script
-- ============================================

-- ============================================
-- EXTENSIONS
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for encryption
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- CORE TABLES
-- ============================================

-- Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('host', 'guest', 'both')) DEFAULT 'guest',
  title TEXT,
  bio TEXT,
  location TEXT,
  timezone TEXT DEFAULT 'UTC',
  avatar_url TEXT,
  cover_url TEXT,
  website TEXT,
  twitter TEXT,
  linkedin TEXT,
  instagram TEXT,
  youtube TEXT,
  expertise TEXT[] DEFAULT '{}',
  price DECIMAL(10,2) DEFAULT 0,
  availability TEXT CHECK (availability IN ('Available', 'Limited', 'Unavailable')) DEFAULT 'Available',
  verified BOOLEAN DEFAULT false,
  premium BOOLEAN DEFAULT false,
  profile_views INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  avg_rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  host_name TEXT NOT NULL,
  guest_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  podcast_title TEXT NOT NULL,
  episode_topic TEXT NOT NULL,
  description TEXT,
  preferred_date DATE NOT NULL,
  preferred_time TIME NOT NULL,
  duration INTEGER NOT NULL CHECK (duration > 0), -- minutes
  recording_type TEXT CHECK (recording_type IN ('online', 'offline')) DEFAULT 'online',
  location TEXT,
  meeting_link TEXT,
  notes TEXT,
  status TEXT CHECK (status IN ('pending', 'accepted', 'declined', 'completed', 'cancelled')) DEFAULT 'pending',
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  overall_rating INTEGER NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  communication_rating INTEGER CHECK (communication_rating BETWEEN 1 AND 5),
  professionalism_rating INTEGER CHECK (professionalism_rating BETWEEN 1 AND 5),
  content_rating INTEGER CHECK (content_rating BETWEEN 1 AND 5),
  punctuality_rating INTEGER CHECK (punctuality_rating BETWEEN 1 AND 5),
  comment TEXT,
  response TEXT,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  data JSONB DEFAULT '{}',
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Availability Table
CREATE TABLE IF NOT EXISTS availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  payer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  payee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'USD',
  status TEXT CHECK (status IN ('pending', 'completed', 'refunded', 'failed')) DEFAULT 'pending',
  stripe_payment_id TEXT,
  stripe_payment_intent_id TEXT,
  refund_amount DECIMAL(10,2),
  refund_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Matches Table (AI-powered matching)
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  matched_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  score INTEGER CHECK (score BETWEEN 0 AND 100),
  reasons JSONB DEFAULT '[]',
  status TEXT CHECK (status IN ('pending', 'accepted', 'declined', 'expired')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
);

-- Profile Views Table (Analytics)
CREATE TABLE IF NOT EXISTS profile_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  referrer TEXT,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calendar Integrations Table
CREATE TABLE IF NOT EXISTS calendar_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  provider TEXT CHECK (provider IN ('google', 'outlook', 'apple')) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  calendar_id TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification Preferences Table
CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  email_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  push_enabled BOOLEAN DEFAULT true,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  preferences JSONB DEFAULT '{
    "new_booking": true,
    "booking_confirmed": true,
    "booking_declined": true,
    "new_message": true,
    "upcoming_session": true,
    "payment_received": true,
    "new_review": true,
    "new_match": true
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verifications Table
CREATE TABLE IF NOT EXISTS verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('email', 'phone', 'identity', 'social_twitter', 'social_linkedin')) NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  verification_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_availability ON profiles(availability);
CREATE INDEX IF NOT EXISTS idx_profiles_expertise ON profiles USING GIN(expertise);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);

-- Bookings indexes
CREATE INDEX IF NOT EXISTS idx_bookings_host_id ON bookings(host_id);
CREATE INDEX IF NOT EXISTS idx_bookings_guest_id ON bookings(guest_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_preferred_date ON bookings(preferred_date);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON notifications(read_at);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Profile views indexes
CREATE INDEX IF NOT EXISTS idx_profile_views_profile_id ON profile_views(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewed_at ON profile_views(viewed_at DESC);

-- Matches indexes
CREATE INDEX IF NOT EXISTS idx_matches_user_id ON matches(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_matched_user_id ON matches(matched_user_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_score ON matches(score DESC);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email
  );
  
  -- Create default notification preferences
  INSERT INTO notification_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate average rating
CREATE OR REPLACE FUNCTION calculate_avg_rating(user_id UUID)
RETURNS DECIMAL AS $$
  SELECT COALESCE(AVG(overall_rating), 0)::DECIMAL(3,2)
  FROM reviews
  WHERE reviewee_id = user_id;
$$ LANGUAGE SQL;

-- Function to update profile stats
CREATE OR REPLACE FUNCTION update_profile_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update reviewee's average rating and review count
  UPDATE profiles
  SET 
    avg_rating = calculate_avg_rating(NEW.reviewee_id),
    total_reviews = (SELECT COUNT(*) FROM reviews WHERE reviewee_id = NEW.reviewee_id)
  WHERE id = NEW.reviewee_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to increment profile views
CREATE OR REPLACE FUNCTION increment_profile_views()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET profile_views = profile_views + 1
  WHERE id = NEW.profile_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate match score
CREATE OR REPLACE FUNCTION calculate_match_score(
  user_id UUID,
  target_id UUID
)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
  user_expertise TEXT[];
  target_expertise TEXT[];
  overlap_count INTEGER;
  user_rating DECIMAL;
  target_rating DECIMAL;
BEGIN
  -- Get user data
  SELECT expertise, avg_rating INTO user_expertise, user_rating
  FROM profiles WHERE id = user_id;
  
  SELECT expertise, avg_rating INTO target_expertise, target_rating
  FROM profiles WHERE id = target_id;
  
  -- Calculate expertise overlap (40 points max)
  SELECT COUNT(*) INTO overlap_count
  FROM unnest(user_expertise) AS ue
  INNER JOIN unnest(target_expertise) AS te ON ue = te;
  
  score := score + LEAST(overlap_count * 10, 40);
  
  -- Rating score (30 points max)
  score := score + LEAST((target_rating * 6)::INTEGER, 30);
  
  -- Availability bonus (10 points)
  IF (SELECT availability FROM profiles WHERE id = target_id) = 'Available' THEN
    score := score + 10;
  END IF;
  
  -- Verification bonus (10 points)
  IF (SELECT verified FROM profiles WHERE id = target_id) = true THEN
    score := score + 10;
  END IF;
  
  -- Premium bonus (10 points)
  IF (SELECT premium FROM profiles WHERE id = target_id) = true THEN
    score := score + 10;
  END IF;
  
  RETURN LEAST(score, 100);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update profile stats on new review
CREATE TRIGGER on_review_created
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_stats();

-- Trigger to increment profile views
CREATE TRIGGER on_profile_view
  AFTER INSERT ON profile_views
  FOR EACH ROW
  EXECUTE FUNCTION increment_profile_views();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Bookings policies
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = host_id OR auth.uid() = guest_id);

CREATE POLICY "Hosts can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = host_id OR auth.uid() = guest_id);

-- Messages policies
CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update own messages"
  ON messages FOR UPDATE
  USING (auth.uid() = sender_id);

-- Reviews policies
CREATE POLICY "Everyone can view reviews"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews for completed bookings"
  ON reviews FOR INSERT
  WITH CHECK (
    auth.uid() = reviewer_id AND
    EXISTS (
      SELECT 1 FROM bookings
      WHERE id = booking_id
      AND status = 'completed'
      AND (host_id = auth.uid() OR guest_id = auth.uid())
    )
  );

CREATE POLICY "Reviewees can respond to reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = reviewee_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Availability policies
CREATE POLICY "Everyone can view availability"
  ON availability FOR SELECT
  USING (true);

CREATE POLICY "Users can manage own availability"
  ON availability FOR ALL
  USING (auth.uid() = user_id);

-- Payments policies
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = payer_id OR auth.uid() = payee_id);

-- Matches policies
CREATE POLICY "Users can view own matches"
  ON matches FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = matched_user_id);

CREATE POLICY "Users can update own matches"
  ON matches FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = matched_user_id);

-- Profile views policies
CREATE POLICY "Users can create profile views"
  ON profile_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Profile owners can view their analytics"
  ON profile_views FOR SELECT
  USING (auth.uid() = profile_id);

-- Calendar integrations policies
CREATE POLICY "Users can manage own calendar integrations"
  ON calendar_integrations FOR ALL
  USING (auth.uid() = user_id);

-- Notification preferences policies
CREATE POLICY "Users can manage own notification preferences"
  ON notification_preferences FOR ALL
  USING (auth.uid() = user_id);

-- Verifications policies
CREATE POLICY "Users can view own verifications"
  ON verifications FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('covers', 'covers', true),
  ('media', 'media', false),
  ('attachments', 'attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for covers (same as avatars)
CREATE POLICY "Cover images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'covers');

CREATE POLICY "Users can upload own cover"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'covers' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own cover"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'covers' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own cover"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'covers' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================
-- REALTIME SUBSCRIPTIONS
-- ============================================

-- Enable realtime for specific tables
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;

-- ============================================
-- INITIAL DATA (Optional)
-- ============================================

-- You can add seed data here if needed

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE 'CastReach database schema created successfully!';
  RAISE NOTICE 'Total tables created: 13';
  RAISE NOTICE 'Total functions created: 6';
  RAISE NOTICE 'Total triggers created: 7';
  RAISE NOTICE 'RLS enabled on all tables';
  RAISE NOTICE 'Storage buckets configured';
  RAISE NOTICE 'Realtime enabled for messages, notifications, and bookings';
END $$;
