# 🚀 Vercel Deployment Guide

## ⚠️ IMPORTANT: Environment Variables Required!

Your Vercel deployment **MUST** have Supabase environment variables configured, or it will run in mock mode (localStorage only) and users won't be saved to the database!

---

## 📋 **Step-by-Step Deployment**

### **Step 1: Add Environment Variables to Vercel**

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Log in to your account
   - Click on your **castreach** project

2. **Navigate to Settings**
   - Click **"Settings"** tab at the top
   - Click **"Environment Variables"** in the left sidebar

3. **Add Supabase Variables**

   Click **"Add New"** and add these two variables:

   **Variable 1:**
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: `https://nzvxysiyllsinpscbkxw.supabase.co`
   - **Environments**: Check all three (Production, Preview, Development)
   - Click **"Save"**

   **Variable 2:**
   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56dnh5c2l5bGxzaW5wc2Nia3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1OTY4NTIsImV4cCI6MjA4MzE3Mjg1Mn0.dmxDTNYDJRWQKjxd5WxNZuUwnf5YavMCJcSF-yG13Mo`
   - **Environments**: Check all three (Production, Preview, Development)
   - Click **"Save"**

### **Step 2: Redeploy**

After adding environment variables, you MUST redeploy:

**Option A: Redeploy from Dashboard**
1. Go to **"Deployments"** tab
2. Find the latest deployment
3. Click the **"..."** menu (three dots)
4. Click **"Redeploy"**
5. Confirm the redeployment

**Option B: Push a New Commit** (Automatic)
```bash
git commit --allow-empty -m "trigger redeploy"
git push origin main
```

Vercel will automatically deploy the new commit with the environment variables.

### **Step 3: Verify Deployment**

1. **Wait for deployment** to complete (1-2 minutes)
2. **Visit your Vercel URL** (e.g., `https://castreach.vercel.app`)
3. **Open browser console** (F12 → Console)
4. **Check for**: You should NOT see "Supabase credentials not found"
5. **Try signing up** with a test account
6. **Check Supabase** → Authentication → Users
7. **User should appear!** ✅

---

## 🔍 **Troubleshooting**

### **Issue: Users Still Not Saving**

**Check:**
1. ✅ Environment variables are added in Vercel
2. ✅ All three environments are selected (Production, Preview, Development)
3. ✅ You redeployed after adding variables
4. ✅ Browser console doesn't show "Supabase credentials not found"

**Solution:**
- Clear browser cache
- Try in incognito mode
- Check Vercel deployment logs for errors

### **Issue: "Supabase credentials not found" in Console**

**This means environment variables aren't loaded!**

**Solution:**
1. Double-check variable names are EXACTLY:
   - `VITE_SUPABASE_URL` (not `SUPABASE_URL`)
   - `VITE_SUPABASE_ANON_KEY` (not `SUPABASE_ANON_KEY`)
2. Redeploy after adding variables
3. Wait for deployment to complete

### **Issue: Old Users in localStorage**

**Your friends' data from before is in localStorage (browser storage), not Supabase.**

**Solution:**
- Tell them to clear browser data
- Or use incognito mode
- Or sign up with different email

---

## 📊 **Verify Everything is Working**

### **Checklist:**

- [ ] Environment variables added to Vercel
- [ ] Redeployed after adding variables
- [ ] Visited production URL
- [ ] No "credentials not found" in console
- [ ] Signed up test user
- [ ] User appears in Supabase → Authentication
- [ ] User appears in Supabase → profiles table
- [ ] User appears in Discover page

---

## 🎯 **Current Status**

### **Before Fix:**
- ❌ Vercel deployment using mock mode (localStorage)
- ❌ Users not saved to Supabase
- ❌ Friends' data only in their browser

### **After Fix:**
- ✅ Vercel deployment using Supabase
- ✅ Users saved to database
- ✅ All users visible in Discover
- ✅ Real authentication working

---

## 🚨 **IMPORTANT NOTES**

### **1. Old User Data**
Users who signed up BEFORE you added environment variables have their data in **localStorage only**. They need to:
- Clear browser data, OR
- Sign up again with a different email

### **2. Environment Variables are Secret**
- Never commit `.env.local` to Git (it's in .gitignore)
- Only add environment variables through Vercel dashboard
- Keep your Supabase keys secure

### **3. Multiple Deployments**
If you have multiple Vercel projects (preview branches), add environment variables to ALL of them.

---

## 📝 **Quick Reference**

### **Vercel Environment Variables:**

```
VITE_SUPABASE_URL=https://nzvxysiyllsinpscbkxw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56dnh5c2l5bGxzaW5wc2Nia3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1OTY4NTIsImV4cCI6MjA4MzE3Mjg1Mn0.dmxDTNYDJRWQKjxd5WxNZuUwnf5YavMCJcSF-yG13Mo
```

### **Deployment Command:**
```bash
git push origin main
```

Vercel auto-deploys on push to main branch.

---

## ✅ **Next Steps**

1. **Add environment variables** to Vercel (Step 1 above)
2. **Redeploy** (Step 2 above)
3. **Test** with a new signup
4. **Tell your friends** to sign up again (old data was in localStorage)
5. **Verify** users appear in Supabase

---

**After completing these steps, your Vercel deployment will work exactly like your local version!** 🎉
