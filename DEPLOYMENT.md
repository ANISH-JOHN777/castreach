# Deployment Guide

This guide will help you deploy CastReach to production.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Deployment Options](#deployment-options)
  - [Vercel (Recommended)](#vercel-recommended)
  - [Netlify](#netlify)
  - [Custom Server](#custom-server)
- [Backend Setup](#backend-setup)
- [Post-Deployment](#post-deployment)

---

## Prerequisites

Before deploying, ensure you have:

- ✅ Node.js 18+ installed
- ✅ Git repository set up
- ✅ All environment variables configured
- ✅ Production build tested locally

## Environment Setup

### 1. Create Production Environment File

Copy `.env.example` to `.env.production`:

```bash
cp .env.example .env.production
```

### 2. Configure Production Variables

Update `.env.production` with your production values:

```env
VITE_APP_URL=https://your-domain.com
VITE_API_URL=https://api.your-domain.com
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_key
VITE_STRIPE_PUBLIC_KEY=your_production_stripe_key
# ... other production values
```

### 3. Test Production Build Locally

```bash
npm run build
npm run preview
```

Visit `http://localhost:4173` to test the production build.

---

## Deployment Options

### Vercel (Recommended)

Vercel offers the easiest deployment for Vite applications.

#### Steps:

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy via GitHub** (Recommended)
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - Framework Preset: **Vite**
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add environment variables from `.env.production`
   - Click "Deploy"

3. **Deploy via CLI**
   ```bash
   vercel
   ```
   Follow the prompts to configure your project.

#### Custom Domain

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

---

### Netlify

Another excellent option for static site hosting.

#### Steps:

1. **Install Netlify CLI** (optional)
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy via GitHub**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Configure:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Add environment variables
   - Click "Deploy site"

3. **Deploy via CLI**
   ```bash
   netlify deploy --prod
   ```

#### Create `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

---

### Custom Server (VPS/Cloud)

For more control, deploy to your own server.

#### Requirements:

- Ubuntu 20.04+ or similar
- Nginx or Apache
- Node.js 18+
- PM2 (for process management)

#### Steps:

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Upload to Server**
   ```bash
   scp -r dist/ user@your-server:/var/www/castreach
   ```

3. **Configure Nginx**

   Create `/etc/nginx/sites-available/castreach`:

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/castreach;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Gzip compression
       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
   }
   ```

4. **Enable Site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/castreach /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

5. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## Backend Setup

### Supabase (Recommended)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note your project URL and anon key

2. **Create Database Schema**

   ```sql
   -- Users table (extends Supabase auth.users)
   CREATE TABLE profiles (
       id UUID REFERENCES auth.users PRIMARY KEY,
       email TEXT UNIQUE NOT NULL,
       name TEXT,
       role TEXT NOT NULL,
       avatar TEXT,
       bio TEXT,
       created_at TIMESTAMP DEFAULT NOW()
   );

   -- Bookings table
   CREATE TABLE bookings (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       guest_id UUID REFERENCES profiles(id),
       host_id UUID REFERENCES profiles(id),
       status TEXT NOT NULL,
       date TIMESTAMP,
       price DECIMAL,
       created_at TIMESTAMP DEFAULT NOW()
   );

   -- Messages table
   CREATE TABLE messages (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       sender_id UUID REFERENCES profiles(id),
       receiver_id UUID REFERENCES profiles(id),
       content TEXT,
       read BOOLEAN DEFAULT FALSE,
       created_at TIMESTAMP DEFAULT NOW()
   );

   -- Reviews table
   CREATE TABLE reviews (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       reviewer_id UUID REFERENCES profiles(id),
       reviewee_id UUID REFERENCES profiles(id),
       rating INTEGER CHECK (rating >= 1 AND rating <= 5),
       comment TEXT,
       created_at TIMESTAMP DEFAULT NOW()
   );
   ```

3. **Enable Row Level Security (RLS)**

   ```sql
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
   ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
   ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

   -- Example policy: Users can read their own profile
   CREATE POLICY "Users can read own profile"
       ON profiles FOR SELECT
       USING (auth.uid() = id);
   ```

4. **Update Environment Variables**
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

---

## Post-Deployment

### 1. Verify Deployment

- [ ] Visit your production URL
- [ ] Test all major features
- [ ] Check console for errors
- [ ] Test on mobile devices
- [ ] Verify SEO meta tags
- [ ] Test performance (Lighthouse)

### 2. Setup Monitoring

- **Vercel Analytics**: Enable in project settings
- **Google Analytics**: Add tracking ID to env
- **Sentry**: For error tracking (optional)

### 3. Setup CI/CD

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run lint
      # Add deployment step based on your platform
```

### 4. Performance Optimization

- Enable CDN for static assets
- Configure caching headers
- Optimize images
- Enable compression (Gzip/Brotli)

### 5. Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] CORS configured properly
- [ ] Rate limiting enabled (backend)
- [ ] Input validation active
- [ ] XSS protection enabled

---

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Environment Variables Not Working

- Ensure variables start with `VITE_`
- Restart dev server after changes
- Check `.env.production` is loaded

### Routing Issues (404 on Refresh)

Add redirect rules for SPA:

**Vercel**: Create `vercel.json`
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Netlify**: Add to `netlify.toml`
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Support

For deployment issues:
- Check [Vite deployment docs](https://vitejs.dev/guide/static-deploy.html)
- Open an issue on GitHub
- Contact the team

---

**Happy Deploying! 🚀**
