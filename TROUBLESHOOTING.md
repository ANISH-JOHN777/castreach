# 🔍 Supabase Signup Troubleshooting

## ✅ What I Just Fixed

1. **Updated Signup.jsx** to use `await` for async signup
2. **Added toast notifications** for better feedback
3. **Added field-level validation** with error messages
4. **Fixed navigation** to work with Supabase user object

## 🧪 How to Test Signup

### Step 1: Make Sure .env.local Exists

Check if you have `.env.local` file in your project root with:

```env
VITE_SUPABASE_URL=https://nzvxysiyllsinpscbkxw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56dnh5c2l5bGxzaW5wc2Nia3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1OTY4NTIsImV4cCI6MjA4MzE3Mjg1Mn0.dmxDTNYDJRWQKjxd5WxNZuUwnf5YavMCJcSF-yG13Mo
VITE_MOCK_API=false
```

### Step 2: Check Dev Server is Running

Your dev server should show the Supabase package loaded. Look for:
```
✨ new dependencies optimized: @supabase/supabase-js
```

### Step 3: Open Browser Console

1. Open http://localhost:5173/signup
2. Press F12 to open Developer Tools
3. Go to "Console" tab
4. Keep it open to see any errors

### Step 4: Try Signing Up

1. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
   - Role: Guest

2. Click "Create Account"

3. Watch the console for:
   - ✅ "Supabase credentials found" (good!)
   - ❌ "Supabase credentials not found" (bad - check .env.local)
   - Any error messages

### Step 5: Check Supabase Dashboard

1. Go to https://supabase.com/dashboard/project/nzvxysiyllsinpscbkxw
2. Click "Authentication" → "Users"
3. You should see your new user!

---

## 🐛 Common Issues & Solutions

### Issue 1: "Supabase credentials not found"

**Solution:**
1. Make sure `.env.local` exists in project root
2. Restart dev server (Ctrl+C, then `npm run dev`)
3. Check console shows "optimized dependencies"

### Issue 2: "User already exists"

**Solution:**
1. Go to Supabase → Authentication → Users
2. Find the user with that email
3. Click the "..." menu → Delete user
4. Try again with same or different email

### Issue 3: "Invalid API key"

**Solution:**
1. Double-check your `.env.local` has correct values
2. Make sure there are NO spaces around the `=` sign
3. Make sure the anon key is complete (very long string)
4. Restart dev server

### Issue 4: Profile not created

**Solution:**
1. Check if you ran the SQL schema (Step 4 in SUPABASE_SETUP.md)
2. Check if you ran the RLS policies (Step 5)
3. Go to SQL Editor and run:
   ```sql
   SELECT * FROM profiles;
   ```
4. If empty, the trigger might not be working

### Issue 5: "Failed to create account"

**Check console for specific error:**
- "Email rate limit exceeded" → Wait a few minutes
- "Invalid email" → Use a real email format
- "Password too short" → Use 6+ characters
- Other errors → Check console for details

---

## 📊 Debugging Checklist

Run through this checklist:

- [ ] `.env.local` file exists with correct credentials
- [ ] Dev server restarted after creating `.env.local`
- [ ] Console shows Supabase package loaded
- [ ] Ran database schema SQL in Supabase
- [ ] Ran RLS policies SQL in Supabase
- [ ] Browser console is open (F12)
- [ ] No errors in console before signup
- [ ] Tried with a fresh email address

---

## 🔍 SQL Queries to Check Setup

Run these in Supabase SQL Editor to verify:

### Check if tables exist:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

Should show: profiles, conversations, messages, bookings, reviews

### Check if trigger exists:
```sql
SELECT trigger_name 
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

Should show: on_auth_user_created

### Check RLS is enabled:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

All should have `rowsecurity = true`

---

## 💡 What Should Happen

When signup works correctly:

1. **You fill the form** → No errors
2. **Click "Create Account"** → Button shows "Creating account..."
3. **Toast appears** → "Welcome to CastReach, [Your Name]!"
4. **You're redirected** → To your dashboard
5. **In Supabase** → New user in Authentication
6. **In Supabase** → New profile in profiles table

---

## 🆘 Still Not Working?

1. **Check browser console** - Copy any error messages
2. **Check Supabase logs** - Go to Logs → Auth Logs
3. **Try a different email** - Some emails might be blocked
4. **Clear browser cache** - Ctrl+Shift+Delete
5. **Try incognito mode** - Rule out cache issues

---

**Let me know what you see in the console when you try to sign up!** 🔍
