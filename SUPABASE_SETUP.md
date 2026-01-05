# Supabase Setup Guide

This guide will help you set up Supabase for CastReach with real authentication and real-time messaging.

## 📋 Prerequisites

- A Supabase account (free tier is fine)
- Your CastReach project running locally

---

## 🚀 Step 1: Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)**
2. Click **"Start your project"** or **"New Project"**
3. Fill in the details:
   - **Name**: CastReach
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup to complete

---

## 🔑 Step 2: Get Your Credentials

1. In your Supabase project dashboard
2. Click **"Settings"** (gear icon) in the sidebar
3. Click **"API"**
4. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

---

## 📝 Step 3: Configure Environment Variables

1. In your CastReach project, create `.env.local`:

```bash
# Create the file
touch .env.local
```

2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. **Restart your dev server**:

```bash
# Stop current server (Ctrl+C)
# Start again
npm run dev
```

---

## 🗄️ Step 4: Create Database Schema

1. In Supabase dashboard, click **"SQL Editor"** in sidebar
2. Click **"New query"**
3. Copy and paste this SQL:

\`\`\`sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT NOT NULL CHECK (role IN ('guest', 'host', 'organizer')),
    avatar TEXT,
    bio TEXT,
    title TEXT,
    location TEXT,
    expertise TEXT[],
    price DECIMAL,
    rating DECIMAL DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    availability TEXT DEFAULT 'Available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant1_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    participant2_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(participant1_id, participant2_id)
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guest_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    host_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    date TIMESTAMP WITH TIME ZONE,
    price DECIMAL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    reviewee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_conversations_participants ON conversations(participant1_id, participant2_id);
CREATE INDEX idx_bookings_guest ON bookings(guest_id);
CREATE INDEX idx_bookings_host ON bookings(host_id);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'guest')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
\`\`\`

4. Click **"Run"** (or press Ctrl+Enter)
5. You should see "Success. No rows returned"

---

## 🔒 Step 5: Set Up Row Level Security (RLS)

Copy and paste this SQL in a new query:

\`\`\`sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Conversations policies
CREATE POLICY "Users can view their own conversations"
    ON conversations FOR SELECT
    USING (auth.uid() = participant1_id OR auth.uid() = participant2_id);

CREATE POLICY "Users can create conversations"
    ON conversations FOR INSERT
    WITH CHECK (auth.uid() = participant1_id OR auth.uid() = participant2_id);

-- Messages policies
CREATE POLICY "Users can view messages in their conversations"
    ON messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM conversations
            WHERE conversations.id = messages.conversation_id
            AND (conversations.participant1_id = auth.uid() OR conversations.participant2_id = auth.uid())
        )
    );

CREATE POLICY "Users can send messages in their conversations"
    ON messages FOR INSERT
    WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM conversations
            WHERE conversations.id = conversation_id
            AND (conversations.participant1_id = auth.uid() OR conversations.participant2_id = auth.uid())
        )
    );

CREATE POLICY "Users can update their own messages"
    ON messages FOR UPDATE
    USING (auth.uid() = sender_id);

-- Bookings policies
CREATE POLICY "Users can view their own bookings"
    ON bookings FOR SELECT
    USING (auth.uid() = guest_id OR auth.uid() = host_id);

CREATE POLICY "Users can create bookings"
    ON bookings FOR INSERT
    WITH CHECK (auth.uid() = guest_id OR auth.uid() = host_id);

CREATE POLICY "Users can update their own bookings"
    ON bookings FOR UPDATE
    USING (auth.uid() = guest_id OR auth.uid() = host_id);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone"
    ON reviews FOR SELECT
    USING (true);

CREATE POLICY "Users can create reviews for their bookings"
    ON reviews FOR INSERT
    WITH CHECK (
        auth.uid() = reviewer_id AND
        EXISTS (
            SELECT 1 FROM bookings
            WHERE bookings.id = booking_id
            AND (bookings.guest_id = auth.uid() OR bookings.host_id = auth.uid())
            AND bookings.status = 'completed'
        )
    );
\`\`\`

Click **"Run"**

---

## 🔔 Step 6: Enable Realtime for Messages

1. In Supabase dashboard, click **"Database"** in sidebar
2. Click **"Replication"**
3. Find the **"messages"** table
4. Toggle **"Enable"** for Realtime
5. Click **"Save"**

---

## ✅ Step 7: Test the Setup

1. **Restart your dev server**:
   ```bash
   npm run dev
   ```

2. **Try signing up**:
   - Go to http://localhost:5173/signup
   - Create a new account
   - Check Supabase dashboard → Authentication → Users
   - You should see your new user!

3. **Check the profile**:
   - Go to Table Editor → profiles
   - You should see a profile created automatically

---

## 🎉 You're Done!

Your CastReach app now has:
- ✅ Real authentication with Supabase
- ✅ User profiles in database
- ✅ Real-time messaging ready
- ✅ Secure with Row Level Security

---

## 🐛 Troubleshooting

### "Invalid API key"
- Check your `.env.local` file
- Make sure keys are correct
- Restart dev server

### "User already exists"
- Go to Supabase → Authentication → Users
- Delete the test user
- Try again

### Messages not real-time
- Check Database → Replication
- Make sure "messages" table has Realtime enabled
- Refresh the page

### Profile not created
- Check SQL Editor for errors
- Make sure the trigger is created
- Check Authentication → Users → User Metadata

---

## 📚 Next Steps

1. Update `AuthContext.jsx` to use Supabase (I'll help with this)
2. Create messaging components with real-time updates
3. Test everything thoroughly
4. Deploy to production!

---

## 🆘 Need Help?

- **Supabase Docs**: https://supabase.com/docs
- **CastReach Issues**: https://github.com/ANISH-JOHN777/castreach/issues

**Happy Building! 🚀**
