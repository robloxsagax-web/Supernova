# Getting Started with Supernova

A comprehensive, beginner-friendly guide to setting up the Supernova AI Marketing Agent platform on your local machine.

---

## 📋 Prerequisites Checklist

Before starting, ensure you have everything ready:

### ✅ Required Software

| Software | Version | Check Command | Install |
|----------|---------|---------------|---------|
| **Node.js** | 18+ | `node --version` | [nodejs.org](https://nodejs.org) |
| **Python** | 3.10+ | `python --version` | [python.org](https://www.python.org) |
| **Git** | Any | `git --version` | [git-scm.com](https://git-scm.com) |
| **npm** | 8+ | `npm --version` | Included with Node.js |

### ✅ Required Accounts & API Keys

| Service | Purpose | Sign Up | Required For |
|---------|---------|---------|-------------|
| **Supabase** | Database & Auth | [supabase.com](https://supabase.com) | Core functionality |
| **OpenRouter** | AI Models | [openrouter.ai](https://openrouter.ai) | Script generation |
| **Groq** | Fast AI Inference | [console.groq.com](https://console.groq.com) | Market intelligence |

### 📦 Optional Services

| Service | Purpose | Sign Up | Required For |
|---------|---------|---------|-------------|
| **Backblaze B2** | Cloud Storage | [backblaze.com](https://www.backblaze.com) | Campaign storage |
| **ElevenLabs** | Voice Synthesis | [elevenlabs.io](https://elevenlabs.io) | Voice generation |
| **Jina AI** | Web Scraping | [jina.ai](https://jina.ai/reader) | URL content extraction |
| **Pexels** | Stock Images | [pexels.com](https://www.pexels.com/api) | Marketing imagery |

> **💡 Tip:** Start with Supabase, OpenRouter, and Groq. Add optional services later as needed.

---

## 🚀 Step-by-Step Installation

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/robloxsagax-web/Supernova.git

# Navigate into the project
cd Supernova
```

### Step 2: Install Frontend Dependencies

```bash
# Install all npm dependencies
npm install
```

**Expected output:**
```
added XXX packages in XXs
```

### Step 3: Install Backend Dependencies

```bash
# Navigate to backend directory
cd services/api

# Install Python dependencies
pip install -r requirements.txt

# Return to project root
cd ../..
```

> **⚠️ Note:** If you encounter permission errors, use `pip install --user` or create a virtual environment.

**For Conda Users:**
```bash
cd services/api
conda create -n supernova python=3.10
conda activate supernova
pip install -r requirements.txt
cd ../..
```

### Step 4: Configure Environment Variables

Supernova requires environment variables for configuration. You'll need two `.env` files:

#### Frontend Environment

```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Supabase - Get from https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend API URL
FASTAPI_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000

# AI APIs
GROQ_API_KEY=your_groq_api_key
```

#### Backend Environment

```bash
# Navigate to backend directory
cd services/api

# Copy the example file
cp .env.example .env

# Return to project root
cd ../..
```

Edit `services/api/.env` with your credentials:

```env
# OpenRouter - Get from https://openrouter.ai/keys
OPENROUTER_API_KEY=your_openrouter_api_key

# CORS - Allow frontend origin
CORS_ORIGINS=http://localhost:3000
```

> **🔐 Security:** Never commit `.env` files. They are already in `.gitignore`.

---

## 🗄️ Setting Up Supabase

Supabase provides database and authentication for Supernova.

### Step 1: Create a Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Enter project details:
   - **Name:** `Supernova`
   - **Database Password:** Choose a strong password (save it!)
   - **Region:** Select closest to your users
4. Click **"Create new project"**
5. Wait for project creation (2-3 minutes)

### Step 2: Get Your API Keys

1. In your Supabase project, go to **Settings** → **API**
2. Find and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 3: Configure Authentication

1. Go to **Authentication** → **Settings**
2. Update site URL: `http://localhost:3000`
3. Update redirect URLs: `http://localhost:3000/auth/callback`

### Step 4: Set Up Database Schema

1. Go to **SQL Editor** in Supabase Dashboard
2. Open the file `supabase-schema.sql` from your project
3. Click **"Run"** to execute the schema
4. Verify tables created:
   - Go to **Table Editor**
   - You should see `campaigns` table

---

## 🤖 Setting Up OpenRouter

OpenRouter provides access to multiple AI models.

### Step 1: Create Account

1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign up with email or Google
3. Verify your email if required

### Step 2: Get API Key

1. Go to [openrouter.ai/keys](https://openrouter.ai/keys)
2. Click **"Create Key"**
3. Copy the generated key

### Step 3: Add Credits (Optional)

1. Go to [openrouter.ai/credits](https://openrouter.ai/credits)
2. Add credits for AI usage (starts with free credits)

### Step 4: Configure Backend

Add to `services/api/.env`:
```env
OPENROUTER_API_KEY=sk_or_your_key_here
```

---

## ⚡ Setting Up Groq

Groq provides ultra-fast AI inference.

### Step 1: Create Account

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up with Google or email

### Step 2: Get API Key

1. Go to [console.groq.com/keys](https://console.groq.com/keys)
2. Click **"Create API Key"**
3. Copy the generated key

### Step 3: Configure Frontend

Add to `.env.local`:
```env
GROQ_API_KEY=gsk_your_key_here
```

---

## ☁️ Setting Up Backblaze B2 (Optional)

Backblaze B2 provides cost-effective cloud storage.

### Step 1: Create Account

1. Go to [backblaze.com](https://www.backblaze.com)
2. Sign up for free

### Step 2: Create a Bucket

1. In B2 dashboard, click **"Create a Bucket"**
2. Configure:
   - **Bucket Name:** `supernova-campaigns` (or your choice)
   - **Access:** Private
3. Click **"Create Bucket"**

### Step 3: Create Application Key

1. Click on your bucket
2. Go to **App Keys** → **Add a New Application Key**
3. Configure:
   - **Name:** `Supernova Backend Key`
   - **Access:** Read and Write
4. Click **"Create New Key"**
5. **Important:** Copy the `keyID` and `applicationKey` immediately

### Step 4: Configure Backend

Add to `services/api/.env`:
```env
B2_ACCESS_KEY_ID=your_key_id
B2_SECRET_KEY=your_application_key
B2_BUCKET_NAME=supernova-campaigns
B2_REGION=us-east-005
B2_ENDPOINT=https://s3.us-east-005.backblazeb2.com
```

---

## 🧪 Setting Up Jina AI (Optional)

Jina AI provides web scraping capabilities.

### Step 1: Create Account

1. Go to [jina.ai/reader](https://jina.ai/reader)
2. Sign up for free

### Step 2: Get API Key

1. Go to [jina.ai/settings](https://jina.ai/settings)
2. Copy your API key

### Step 3: Configure

Add to `.env.local`:
```env
JINA_API_KEY=your_jina_key_here
```

---

## 🖼️ Setting Up Pexels (Optional)

Pexels provides stock photography.

### Step 1: Create Account

1. Go to [pexels.com/api](https://www.pexels.com/api)
2. Sign up for free

### Step 2: Get API Key

1. After signup, go to your API dashboard
2. Copy your API key

### Step 3: Configure

Add to `.env.local`:
```env
PEXELS_API_KEY=your_pexels_key_here
```

---

## 🎙️ Setting Up ElevenLabs (Optional)

ElevenLabs provides voice synthesis.

### Step 1: Create Account

1. Go to [elevenlabs.io](https://elevenlabs.io)
2. Sign up for free

### Step 2: Get API Key

1. Go to your profile → API Key
2. Copy your API key

### Step 3: Configure

Add to `.env.local`:
```env
ELEVENLABS_API_KEY=your_elevenlabs_key_here
```

---

## 🚦 Starting the Development Servers

### Option A: Run Both Servers (Recommended)

```bash
npm run dev
```

This starts:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
npm run dev:api
# Backend running at http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
npm run dev:next
# Frontend running at http://localhost:3000
```

---

## ✅ Verifying Your Installation

Open your browser and visit:

| Service | URL | Expected Response |
|---------|-----|-------------------|
| **Frontend** | http://localhost:3000 | Supernova dashboard loads |
| **Backend** | http://localhost:8000 | JSON with service info |
| **Health Check** | http://localhost:8000/health | `{"status": "healthy", ...}` |
| **API Docs** | http://localhost:8000/docs | Swagger UI |

### Test Script Generation

```bash
curl -X POST http://localhost:8000/script \
  -H "Content-Type: application/json" \
  -d '{
    "product": {
      "title": "Wireless Earbuds",
      "description": "Premium wireless earbuds with noise cancellation",
      "price": "$79.99",
      "features": ["ANC", "30hr battery", "waterproof"]
    },
    "duration": 30,
    "generationType": "ad"
  }'
```

### Test Market Intelligence

1. Open http://localhost:3000
2. Log in or create account
3. Navigate to Dashboard
4. Click "Market Intelligence"
5. Enter a product name
6. View AI-generated analysis

---

## 🔧 Troubleshooting

### Problem: "command not found: npm"

**Solution:** Node.js is not installed or not in PATH.
```bash
# Install Node.js from https://nodejs.org
# Or use nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### Problem: "Python version not supported"

**Solution:**
```bash
# Check version
python --version

# If below 3.10, upgrade:
# macOS: brew install python@3.10
# Ubuntu: sudo apt-get install python3.10
# Windows: Download from python.org
```

### Problem: "Backend connection refused"

**Solution:**
1. Ensure backend is running: `ps aux | grep uvicorn`
2. Check port 8000: `lsof -i :8000`
3. Kill existing process: `kill -9 <PID>`
4. Restart: `cd services/api && uvicorn app.main:app --reload`

### Problem: "Authentication failed"

**Solution:**
```bash
# Verify API keys are set
cat .env.local | grep API_KEY

# Test OpenRouter
curl -H "Authorization: Bearer $OPENROUTER_API_KEY" \
     https://openrouter.ai/api/v1/models

# Test Groq
curl -H "Authorization: Bearer $GROQ_API_KEY" \
     https://api.groq.com/openai/v1/models
```

### Problem: "Supabase connection failed"

**Solution:**
1. Verify URL format: `https://xxxxx.supabase.co`
2. Check key is correct (no extra spaces)
3. Verify project is not paused in Supabase dashboard

### Problem: "Port already in use"

**Solution:**
```bash
# Find process
lsof -ti :3000  # for frontend
lsof -ti :8000  # for backend

# Kill it
kill -9 <PID>
```

### Problem: "Module not found" during pip install

**Solution:**
```bash
cd services/api
pip install --upgrade pip
pip install -r requirements.txt
```

---

## 📚 Next Steps

Once your setup is working:

1. **Explore the Dashboard**: Try all features
2. **Read the Docs**: Check `/docs` folder
   - [Deployment Guide](DEPLOYMENT.md) - Deploy to production
   - [Genblaze Guide](GENBLAZE.md) - Understand AI orchestration
   - [B2 Storage](BACKBLAZE_B2.md) - Cloud storage setup
   - [Project Structure](PROJECT_STRUCTURE.md) - Codebase overview

3. **Customize**: Modify components and styles
4. **Deploy**: Follow the [Deployment Guide](DEPLOYMENT.md)

---

## 🆘 Need Help?

- **GitHub Issues**: [github.com/robloxsagax-web/Supernova/issues](https://github.com/robloxsagax-web/Supernova/issues)
- **Documentation**: Check `/docs` folder
- **Logs**: Check terminal for error messages

---

## ✅ Setup Complete!

🎉 Congratulations! You now have a fully functional Supernova installation running locally.

**Happy coding!**
