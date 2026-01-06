# 🔐 Supabase Setup Guide for CastReach

This guide will help you set up Supabase as the backend for CastReach.

## 📋 Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js and npm installed

## 🚀 Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in the project details:
   - **Name**: CastReach
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait for the project to be provisioned (takes ~2 minutes)

## 🔑 Step 2: Get Your API Credentials

1. In your Supabase project dashboard, click on the **Settings** icon (gear icon)
2. Go to **API** section
3. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## 📝 Step 3: Configure Environment Variables

1. Open the `.env` file in your project root
2. Replace the placeholder values with your actual Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file
4. **IMPORTANT**: Never commit the `.env` file to git (it's already in `.gitignore`)

## ⚙️ Step 4: Configure Authentication Settings (IMPORTANT!)

For development, you need to disable email confirmation:

1. Go to your Supabase Dashboard
2. Click on **Authentication** in the left sidebar
3. Click on **Providers**
4. Find **Email** provider and click on it
5. **DISABLE** the following option:
   - ❌ **Confirm email** (turn this OFF)
6. Click **Save**

This allows users to login immediately after signup without email verification.

> **Note**: For production, you should enable email confirmation and set up email templates.

## 🗄️ Step 5: Set Up Database Tables

Run this SQL in your Supabase SQL Editor (Dashboard → SQL Editor → New Query):

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'guest' CHECK (role IN ('guest', 'host')),
  bio TEXT,
  title TEXT,
  location TEXT,
  expertise TEXT[] DEFAULT '{}',
  avatar TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  availability TEXT DEFAULT 'Available',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to read all profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, bio, title, location, expertise, avatar, price, rating, total_reviews, availability)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'guest'),
    COALESCE(NEW.raw_user_meta_data->>'bio', 'New to CastReach'),
    COALESCE(NEW.raw_user_meta_data->>'title', 'Podcast Guest'),
    COALESCE(NEW.raw_user_meta_data->>'location', 'Remote'),
    COALESCE((NEW.raw_user_meta_data->>'expertise')::TEXT[], ARRAY['General']),
    'https://ui-avatars.com/api/?name=' || COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)) || '&background=6366f1&color=fff',
    COALESCE((NEW.raw_user_meta_data->>'price')::DECIMAL, 0),
    0,
    0,
    'Available'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 🔄 Step 5: Restart Your Development Server

After setting up the environment variables:

```bash
# Stop the current dev server (Ctrl+C)
# Then restart it
npm run dev
```

The app will now use Supabase instead of localStorage!

## ✅ Step 6: Test the Setup

1. Open your browser to `http://localhost:5173`
2. Sign up with a new account
3. Check your Supabase dashboard → Table Editor → profiles
4. You should see your new profile created automatically!

## 🔍 Verification

To verify Supabase is working, check the browser console:
- You should see: `📝 Using Supabase: true`
- Profile updates should show: `✅ Supabase profile updated:`

## 🆘 Troubleshooting

### Issue: "Using Supabase: false" in console
**Solution**: Check that your `.env` file has the correct credentials and restart the dev server

### Issue: "Failed to create profile"
**Solution**: Make sure you ran all the SQL commands in Step 4

### Issue: "Row Level Security policy violation"
**Solution**: Check that the RLS policies were created correctly

### Issue: Environment variables not loading
**Solution**: 
1. Make sure the `.env` file is in the project root
2. Variable names must start with `VITE_`
3. Restart the dev server after changing `.env`

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## 🔒 Security Notes

- Never commit your `.env` file to version control
- The anon key is safe to use in client-side code
- Row Level Security (RLS) protects your data
- Users can only update their own profiles

---

**Need help?** Check the Supabase dashboard logs or open an issue on GitHub.
