# ✨ Supernova — The AI Marketing Agent

A premium AI-powered marketing platform that transforms any product URL into a complete marketing campaign with videos, images, copy, and strategic insights.

Built with Next.js, TypeScript, Remotion, Framer Motion, OpenAI, TailwindCSS, and Zustand.

![MIT License](https://img.shields.io/github/license/Rakshath66/adgen)

---

## 🎨 Features

- 🔗 Paste a product URL (Amazon, Shopify, or any website)
- 🤖 AI extracts images, title, features & benefits
- ✍️ AI writes catchy ad scripts
- 🎙️ Human-quality voiceover synthesis
- 🎵 Background music selection
- 🎞️ Remotion generates video ad with overlays
- 🎯 15–60 sec video output (vertical or horizontal)
- 🖥️ Premium dark mode UI with real-time status
- 📥 One-click video download
- 🎨 8 premium brand color palettes
- ✏️ 5 caption style options

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- OpenAI API key
- Google Chrome / Chromium (required for Puppeteer)

### Local Setup

```bash
# 1. Clone this repo
git clone https://github.com/Rakshath66/adgen.git
cd adgen

# 2. Install dependencies
npm install

# 3. Create env file
cp .env.example .env.local

# 4. Add your API keys to .env.local
OPENAI_API_KEY=your_openai_api_key

# 5. Run the app
npm run dev
```

---

## 🔐 Environment Variables

```env
# Script generation (Groq API - free tier available)
GROQ_API_KEY=your_groq_api_key

# Web scraping (Jina AI Reader - free tier available)
JINA_API_KEY=your_jina_api_key

# Voiceover synthesis (ElevenLabs - paid, free trial)
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Background music (Jamendo - free API)
JAMENDO_CLIENT_ID=your_jamendo_client_id
```

> ⚠️ Required API keys for full functionality

---

## 🎬 How It Works

1. **Input**: Paste a product page URL (Amazon/Shopify)
2. **Scrape**: Jina AI extracts product data
3. **Script**: AI generates ad script
4. **Voiceover**: Creates human-quality voice
5. **Music**: Provides niche-based background track
6. **Video**: Remotion renders video with dual audio
7. **Output**: Preview & download final video

---

## 🧠 Tech Stack

| Layer          | Tech                                    |
| -------------- | --------------------------------------- |
| Frontend       | Next.js 15, TypeScript, TailwindCSS     |
| State Mgmt     | Zustand, React Query                    |
| Backend        | API Routes in Next.js                   |
| UI Animations  | Framer Motion                           |
| Scraping       | Jina AI Reader API                      |
| AI Script      | Groq API (Llama 3.1)                   |
| Voiceover      | ElevenLabs Neural TTS                   |
| Background Music | Jamendo API                           |
| Video          | Remotion + MediaRecorder                |

---

## 📁 Project Structure

```
supernova/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Main Dashboard
│   │   └── api/
│   │       ├── scrape/        # Scrape logic
│   │       ├── generate-script/ # AI ad copy
│   │       ├── generate-video/  # Remotion output
│   │       └── save-video/   # Video download
│   └── components/
│       ├── dashboard/
│       │   ├── Dashboard.tsx      # Main dashboard
│       │   ├── ActionCards.tsx   # Action cards
│       │   ├── AIAgentPanel.tsx  # AI agent panel
│       │   ├── URLInputForm.tsx  # URL input
│       │   └── WorkflowProgress.tsx # Progress
│       ├── layout/
│       │   ├── Sidebar.tsx   # Navigation sidebar
│       │   └── TopBar.tsx    # Top bar
│       ├── UrlInputForm.tsx
│       ├── ProductPreview.tsx
│       ├── ScriptPreview.tsx
│       ├── VideoPlayer.tsx
│       └── AIAdStudio.tsx
├── public/
└── downloads/
```

---

## 💬 Example Use Cases

- DTC brands testing product creatives
- Shopify owners generating quick ads
- Amazon affiliates making viral content
- Influencers creating reels for product links

---

## 🛠️ Quick Tips

- Stick to Amazon or Shopify for best results
- Long descriptions = better scripts
- Vertical videos are ideal for Instagram/TikTok

---

## 🤝 Contributing

We welcome PRs and improvements!

### Steps:

1. Fork this repo
2. Create your branch:

```bash
git checkout -b feat/your-feature
```

3. Make changes & commit:

```bash
git commit -m "feat: added cool thing"
```

4. Push and open a Pull Request

---

## 🧪 Code Commit Style

Use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Readme/docs updates
- `refactor:` Cleanup/refactoring
- `chore:` Setup or tool configs

---

## 🛣️ Roadmap

### ✅ Phase 1: MVP (URL → Ad Video)

- ✔️ URL scraping
- ✔️ AI ad copy
- ✔️ Remotion video render
- ✔️ Premium UI

---

### Phase 2: Upgrades

- 🔁 Multiple script versions
- 🗣️ Text-to-speech (AI voiceover)
- 🔳 Multiple aspect ratios (9:16, 1:1)
- ✨ Advanced templates + animation

---

### Phase 3: (Future)

- User auth
- Deployments
- Payment + SaaS features

---

## 📄 License

MIT © Rakshath U Shetty

---

## ⭐ If You Like It

Star ⭐ this repo to support the project and help others find it.
Open an issue, suggest features, or contribute a video template!

Let's connect on [LinkedIn](https://www.linkedin.com/in/rakshathushetty/)
