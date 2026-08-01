# Deployment Guide

Complete production deployment guide for Supernova AI Marketing Agent Platform.

---

## 📚 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
- [Backend Deployment (Railway)](#backend-deployment-railway)
- [Backend Deployment (Render)](#backend-deployment-render)
- [Database Setup](#database-setup)
- [Environment Configuration](#environment-configuration)
- [Domain Setup](#domain-setup)
- [Monitoring & Health Checks](#monitoring--health-checks)
- [Security Checklist](#security-checklist)
- [Deployment Checklist](#deployment-checklist)
- [Rollback Procedures](#rollback-procedures)
- [Troubleshooting](#troubleshooting)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PRODUCTION ARCHITECTURE                       │
└─────────────────────────────────────────────────────────────────────┘

                            ┌─────────────────┐
                            │     INTERNET     │
                            └────────┬────────┘
                                     │
                     ┌───────────────┴───────────────┐
                     │                               │
                     ▼                               ▼
           ┌──────────────────┐         ┌──────────────────────────┐
           │     VERCEL        │         │      RAILWAY/RENDER     │
           │    (Frontend)      │         │     (Backend API)       │
           │                    │   HTTP  │                          │
           │  • Next.js 15    │────────►│  • FastAPI             │
           │  • React 19      │   API   │  • Genblaze SDK        │
           │  • TailwindCSS   │         │  • OpenRouter          │
           │  • CDN           │         │  • AI Providers        │
           └──────────────────┘         └──────────────────────────┘
                     │                               │
                     │                               │
                     ▼                               ▼
           ┌──────────────────┐         ┌──────────────────────────┐
           │    SUPABASE      │         │      BACKBLAZE B2       │
           │                    │         │                          │
           │  • Auth          │         │  • Campaign Storage      │
           │  • PostgreSQL    │         │  • Asset Storage        │
           │  • Real-time    │         │  • Presigned URLs       │
           └──────────────────┘         └──────────────────────────┘
```

---

## Pre-Deployment Checklist

Before deploying, ensure you have:

### ✅ Accounts Ready

| Service | Account | Status |
|---------|---------|--------|
| **Vercel** | https://vercel.com | ☐ Ready |
| **Railway** | https://railway.app | ☐ Ready |
| **Supabase** | https://supabase.com | ☐ Ready |
| **OpenRouter** | https://openrouter.ai | ☐ Ready |

### ✅ Environment Variables

- [ ] All API keys generated and ready
- [ ] Backend URL planned
- [ ] CORS origins configured
- [ ] Supabase project created

### ✅ Code Verified

- [ ] `npm run build` succeeds locally
- [ ] `npm run dev` works
- [ ] No TypeScript errors
- [ ] No ESLint errors

---

## Frontend Deployment (Vercel)

Vercel provides optimized hosting for Next.js applications with automatic SSL, CDN, and serverless functions.

### Prerequisites

- Vercel account: [vercel.com](https://vercel.com)
- GitHub repository connected to Vercel
- All environment variables ready

### Step 1: Connect Repository

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository:
   ```
   https://github.com/robloxsagax-web/Supernova
   ```
4. Vercel will auto-detect Next.js configuration

### Step 2: Configure Project

| Setting | Value |
|---------|-------|
| **Project Name** | `supernova` (or your choice) |
| **Root Directory** | `./` (default) |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` (default) |
| **Install Command** | `npm install` (default) |
| **Framework Preset** | Next.js |

### Step 3: Environment Variables

Add in **Settings → Environment Variables**:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend API URL
FASTAPI_URL=https://your-backend.railway.app
NEXT_PUBLIC_API_URL=https://your-backend.railway.app

# AI APIs
GROQ_API_KEY=your_groq_api_key
```

> **⚠️ Important:** Set for **Production**, **Preview**, and **Development** environments.

### Step 4: Deploy

1. Click **"Deploy"** to trigger initial deployment
2. Wait for build completion (3-5 minutes)
3. Note your preview URL: `https://supernova.vercel.app`

### Step 5: Verify Deployment

```bash
# Test health endpoint
curl https://your-app.vercel.app/api/health

# Should return 200 OK
```

### Vercel Configuration

The `vercel.json` file is pre-configured:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["iad1"]
}
```

### Serverless Functions

API routes in `/src/app/api/` deploy as serverless functions:

- **Timeout**: 120 seconds (configured in route files)
- **Memory**: 1024 MB default
- **Regions**: Configured in `vercel.json`

---

## Backend Deployment (Railway)

Railway is recommended for FastAPI backend due to excellent Python support.

### Prerequisites

- Railway account: [railway.app](https://railway.app)
- GitHub repository connected

### Step 1: Create Project

1. Log in to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Railway auto-detects Python

### Step 2: Configure Service

1. Navigate to service **Settings**
2. Set **Root Directory**: `services/api`
3. Set **Build Command**: `pip install -r requirements.txt`
4. Set **Start Command**:
   ```
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

### Step 3: Environment Variables

Add in **Service → Variables**:

```env
# OpenRouter (Required)
OPENROUTER_API_KEY=your_openrouter_api_key

# CORS (Your Vercel frontend)
CORS_ORIGINS=https://your-app.vercel.app,https://supernova.vercel.app

# Optional: AI Model Overrides
# OPENROUTER_MODEL=qwen/qwen3.6-flash
# OPENROUTER_MARKET_INTEL_MODEL=deepseek/deepseek-v3.2

# Optional: Backblaze B2
B2_ACCESS_KEY_ID=your_b2_access_key
B2_SECRET_KEY=your_b2_secret_key
B2_BUCKET_NAME=supernova-campaigns
B2_REGION=us-west-004
B2_ENDPOINT=https://s3.us-west-004.backblazeb2.com
```

### Step 4: Deploy

1. Click **"Deploy"**
2. Railway will:
   - Install dependencies from `requirements.txt`
   - Run the start command
   - Set up networking

### Step 5: Get Backend URL

1. Go to **Service → Networking**
2. Click **"Generate Domain"**
3. Copy the URL: `https://supernova.up.railway.app`

### Step 6: Update Vercel

Add to Vercel environment variables:

```env
FASTAPI_URL=https://your-railway-url.railway.app
NEXT_PUBLIC_API_URL=https://your-railway-url.railway.app
```

### Health Check

```bash
curl https://your-railway-url.railway.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "provider": "Genblaze",
  "script_model": "qwen/qwen3.6-flash",
  "market_intel_model": "deepseek/deepseek-v3.2",
  "storage": {
    "provider": "Backblaze B2",
    "available": true
  }
}
```

---

## Backend Deployment (Render)

Render is an alternative with excellent free tier.

### Step 1: Create Account

1. Sign up at [render.com](https://render.com)
2. Connect your GitHub repository

### Step 2: Create Web Service

1. Click **"New"** → **"Web Service"**
2. Select your repository
3. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `supernova-api` |
| **Region** | Closest to users |
| **Branch** | `main` |
| **Root Directory** | `services/api` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

### Step 3: Environment Variables

Add same variables as Railway deployment.

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Note URL: `https://supernova-api.onrender.com`

---

## Database Setup

### Supabase Production Configuration

#### 1. Upgrade Plan (if needed)

1. Go to **Supabase Dashboard → Settings → Billing**
2. Upgrade from free tier if approaching limits

#### 2. Configure Row Level Security (RLS)

Enable RLS for all tables:

```sql
-- Enable RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own campaigns
CREATE POLICY "Users can view own campaigns"
ON campaigns
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can only insert their own campaigns
CREATE POLICY "Users can insert own campaigns"
ON campaigns
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own campaigns
CREATE POLICY "Users can update own campaigns"
ON campaigns
FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: Users can only delete their own campaigns
CREATE POLICY "Users can delete own campaigns"
ON campaigns
FOR DELETE
USING (auth.uid() = user_id);
```

#### 3. Configure Authentication

1. Go to **Authentication → Settings**
2. Update site URL to your production domain
3. Add redirect URLs for production

---

## Environment Configuration

### Frontend (Vercel)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key

# Backend API
FASTAPI_URL=https://your-backend.railway.app
NEXT_PUBLIC_API_URL=https://your-backend.railway.app

# AI APIs
GROQ_API_KEY=your_groq_api_key
```

### Backend (Railway/Render)

```env
# OpenRouter
OPENROUTER_API_KEY=your_openrouter_api_key

# CORS
CORS_ORIGINS=https://your-app.vercel.app,https://your-custom-domain.com

# Backblaze B2
B2_ACCESS_KEY_ID=your_b2_access_key
B2_SECRET_KEY=your_b2_secret_key
B2_BUCKET_NAME=supernova-campaigns
```

---

## Domain Setup

### Vercel Custom Domain

1. Go to **Dashboard → Project → Settings → Domains**
2. Add your domain: `app.supernova.com`
3. Configure DNS records as instructed
4. Wait for SSL certificate (automatic)

### Railway Custom Domain

1. Go to **Railway → Service → Networking → Custom Domains**
2. Add your domain
3. Configure DNS to point to Railway

### HTTPS

All platforms provide automatic HTTPS:

- **Vercel**: Let's Encrypt certificates
- **Railway**: Automatic SSL
- **Render**: Automatic SSL

---

## Monitoring & Health Checks

### Backend Health Endpoint

```bash
curl https://your-backend.railway.app/health
```

### Vercel Analytics

1. Go to **Dashboard → Analytics**
2. Click **"Enable Analytics"**
3. View real-time and historical data

### Railway Metrics

View in Railway dashboard:

- CPU and Memory usage
- Request count
- Response times
- Error rates

### Application Performance Monitoring

Consider adding:

- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Datadog**: APM

---

## Security Checklist

### ✅ Environment Variables

- [ ] All API keys stored in environment variables
- [ ] No secrets in code
- [ ] Different keys for dev/prod
- [ ] `.env` files in `.gitignore`

### ✅ Authentication

- [ ] Supabase Auth enabled
- [ ] Row Level Security (RLS) enabled
- [ ] Session timeout configured
- [ ] Password requirements set

### ✅ API Security

- [ ] CORS configured for specific origins
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak info
- [ ] Rate limiting enabled (if needed)

### ✅ Storage

- [ ] B2 bucket set to private
- [ ] Application keys used (not master keys)
- [ ] Presigned URLs for downloads
- [ ] File upload validation

### ✅ Dependencies

- [ ] Regular dependency updates
- [ ] Security patches applied
- [ ] No known vulnerabilities

---

## Deployment Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Health checks passing
- [ ] SSL certificates active
- [ ] CORS configured correctly
- [ ] Error monitoring set up
- [ ] Backup strategy in place
- [ ] DNS propagation verified
- [ ] Performance tested

---

## Rollback Procedures

### Vercel Rollback

1. Go to **Dashboard → Deployments**
2. Find the last working deployment
3. Click **"..."** → **"Promote to Production"**

### Railway Rollback

1. Go to **Service → Deployments**
2. Find the last working deployment
3. Click **"Redeploy"** on that version

### Database Rollback

If using Supabase:

1. Go to **SQL Editor**
2. Run rollback migration
3. Or restore from Supabase backups

---

## Troubleshooting

### Build Failed on Vercel

**Error:** `npm ERR! missing package`

**Solution:**
1. Check `package.json` has all dependencies
2. Ensure `npm install` succeeds locally
3. Clear Vercel cache: **Settings → General → Clear Cache**

### Backend Won't Start

**Error:** `ModuleNotFoundError`

**Solution:**
1. Verify `requirements.txt` is in `services/api/`
2. Check Railway build logs
3. Test locally: `cd services/api && uvicorn app.main:app`

### CORS Errors

**Error:** `Access-Control-Allow-Origin blocked`

**Solution:**
1. Verify CORS_ORIGINS includes your Vercel URL
2. Check for trailing slashes
3. Restart backend after updating

### API Returns 500

**Solution:**
1. Check backend logs in Railway/Render
2. Verify environment variables
3. Test backend health endpoint
4. Check AI provider API keys

---

## Additional Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **Supabase Hosting**: https://supabase.com/docs/guides/hosting

---

**Next:** [Project Structure](PROJECT_STRUCTURE.md) for codebase overview.
