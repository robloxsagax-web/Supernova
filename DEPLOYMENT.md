# Supernova Deployment Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           SUPERNOVA ARCHITECTURE                        │
└─────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────────┐                              ┌─────────────────────┐
    │                     │                              │                     │
    │   VERCEL            │                              │   RAILWAY/RENDER    │
    │   (Frontend)        │                              │   (Backend)         │
    │                     │                              │                     │
    │   Next.js 15        │     fetch()                  │   FastAPI           │
    │   React             │ ─────────────────────────► │   Genblaze          │
    │   TailwindCSS       │                              │   OpenRouter        │
    │                     │ ◄─────────────────────────   │   Qwen Turbo        │
    │                     │        JSON Response        │                     │
    │                     │                              │                     │
    └─────────────────────┘                              └─────────────────────┘
           │                                                        │
           │                                                        │
           │                                                        │
           ▼                                                        ▼
    ┌─────────────────────┐                              ┌─────────────────────┐
    │   Vercel Edge       │                              │   Railway/Render    │
    │   Runtime           │                              │   Cloud Instance    │
    │                     │                              │                     │
    │   Serverless        │                              │   Persistent        │
    │   Functions         │                              │   Service           │
    └─────────────────────┘                              └─────────────────────┘

    ┌─────────────────────────────────────────────────────────────────────────┐
    │                           DATA FLOW                                      │
    └─────────────────────────────────────────────────────────────────────────┘

    User clicks "Generate Script"
           │
           ▼
    ScriptPreview Component (React)
           │
           ▼
    fetch('/api/generate-script')
           │
           ▼
    Next.js Route Handler (route.ts)
           │
           ▼
    fetch(process.env.FASTAPI_URL + '/script')
           │
           ▼
    FastAPI Backend (Railway/Render)
           │
           ▼
    Genblaze SDK (genblaze_openai.chat)
           │
           ▼
    OpenRouter API (qwen/qwen3.6-flash with fallback)
           │
           ▼
    Response flows back through the chain
```

---

## Prerequisites

1. **GitHub Repository**: Code is hosted at `https://github.com/robloxsagax-web/Video`
2. **OpenRouter Account**: Get API key at https://openrouter.ai/keys
3. **Railway Account**: For backend deployment
4. **Vercel Account**: For frontend deployment
5. **Supabase Project**: For authentication and data

---

## Part 1: Deploy FastAPI Backend to Railway

### Step 1.1: Create Railway Project

1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select the `Video` repository
5. Choose the `services/api` directory as the root

### Step 1.2: Configure Railway Settings

1. **Build Command**: Leave empty (Railway auto-detects)
2. **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. **Root Directory**: `services/api`

### Step 1.3: Set Environment Variables

In Railway dashboard, add these variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `OPENROUTER_API_KEY` | `sk-or-v1-...` | From openrouter.ai/keys |
| `CORS_ORIGINS` | `https://your-app.vercel.app` | Your Vercel URL |
| `PORT` | `8000` | Auto-set by Railway |

### Step 1.4: Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Note your backend URL: `https://your-project.up.railway.app`

### Step 1.5: Verify Backend

```bash
curl https://your-project.up.railway.app/health
```

Expected response:
```json
{"status":"healthy","provider":"Genblaze","model":"qwen/qwen3.6-flash"}
```

---

## Part 2: Deploy Next.js Frontend to Vercel

### Step 2.1: Connect to Vercel

1. Go to https://vercel.com
2. Import the `Video` repository
3. Framework: Next.js
4. Root Directory: `/` (leave as default)

### Step 2.2: Configure Environment Variables

In Vercel dashboard, add these variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `FASTAPI_URL` | `https://your-project.up.railway.app` | Your Railway URL |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | From Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | From Supabase |
| `GROQ_API_KEY` | `gsk_...` | For Market Intelligence |
| `OPENROUTER_API_KEY` | `sk-or-v1-...` | If needed |

### Step 2.3: Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Note your frontend URL: `https://your-app.vercel.app`

---

## Part 3: Update Vercel Backend URL

After deploying the frontend, you need to update the Railway CORS settings:

1. Go to Railway dashboard
2. Find your backend project
3. Update `CORS_ORIGINS` to include your Vercel URL:
   ```
   https://your-app.vercel.app,https://your-app-git-branch.vercel.app
   ```
4. Redeploy or restart the service

---

## Part 4: Local Development

### Prerequisites

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
cd services/api
pip install -r requirements.txt
```

### Development Workflow

**Option 1: Run both servers (recommended)**

```bash
npm run dev
```

This starts:
- Next.js on http://localhost:3000
- FastAPI on http://localhost:8000

**Option 2: Run only frontend (if backend is deployed)**

```bash
# Set environment variable
export FASTAPI_URL=https://your-project.up.railway.app

# Start frontend
npm run dev:next
```

### Local Environment File

Create `.env.local` in the project root:

```bash
# Copy from example
cp .env.example .env.local

# Edit with your values
```

---

## Environment Variables Reference

### Frontend (.env.local)

| Variable | Required | Description |
|----------|----------|-------------|
| `FASTAPI_URL` | Yes | Backend URL for script generation |
| `NEXT_PUBLIC_API_URL` | No | Alternative to FASTAPI_URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `GROQ_API_KEY` | Yes | For Market Intelligence |
| `OPENROUTER_API_KEY` | No | Alternative AI provider |

### Backend (Railway Environment)

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | Yes | OpenRouter API key |
| `CORS_ORIGINS` | No | Comma-separated CORS origins |
| `PORT` | Auto | Railway sets this automatically |

---

## Troubleshooting

### ECONNREFUSED Error

**Cause**: Frontend cannot reach the backend.

**Solution**:
1. Verify `FASTAPI_URL` is set correctly in Vercel
2. Verify backend is running on Railway
3. Check backend health: `curl https://your-backend.up.railway.app/health`

### CORS Error

**Cause**: Backend is blocking requests from frontend.

**Solution**:
1. Update `CORS_ORIGINS` in Railway to include your Vercel URL
2. Redeploy the backend

### 503 Service Unavailable

**Cause**: Backend URL not configured or backend is down.

**Solution**:
1. Check `FASTAPI_URL` environment variable in Vercel
2. Check Railway dashboard for backend status

### Script Generation Timeout

**Cause**: AI request taking too long.

**Solution**:
1. Check OpenRouter API status
2. Increase timeout in `src/app/api/generate-script/route.ts`

---

## API Endpoints

### Backend (Railway)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Service info |
| `/health` | GET | Health check |
| `/script` | POST | Generate script |

### Frontend (Vercel)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/generate-script` | POST | Proxy to backend |
| `/api/market-intelligence` | POST | Direct (no proxy) |
| `/api/scrape` | POST | Direct (no proxy) |
| `/api/voiceover` | POST | Direct (no proxy) |
| `/api/generate-video` | POST | Direct (no proxy) |

---

## File Structure

```
Video/
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── generate-script/
│   │       │   └── route.ts      # Proxy to FastAPI
│   │       ├── market-intelligence/
│   │       │   └── route.ts      # Direct to Groq
│   │       └── ...
│   ├── components/
│   │   └── ...
│   └── lib/
│       └── api.ts               # Centralized API client
├── services/
│   └── api/
│       ├── app/
│       │   ├── main.py          # FastAPI app
│       │   ├── routes/
│       │   │   └── script.py    # Script endpoint
│       │   └── repo/
│       │       ├── pipelines.py      # Genblaze logic
│       │       └── provider_catalog.py
│       ├── requirements.txt
│       └── Procfile
├── .env.example
├── vercel.json
└── package.json
```

---

## Security Notes

1. **Never commit `.env` files** - They contain secrets
2. **Use environment variables** - Never hardcode API keys
3. **CORS** - Restrict to your Vercel domain in production
4. **Server-side only** - Keep API keys in Next.js route handlers, not client components
