# Project Structure Guide

Detailed explanation of the Supernova repository layout and codebase organization.

## 📁 Directory Structure

```
Supernova/
├── src/                          # Next.js Frontend
│   ├── app/                      # App Router (Next.js 13+)
│   ├── components/               # React Components
│   ├── lib/                      # Utilities & Helpers
│   └── types/                    # TypeScript Type Definitions
│
├── services/                     # Backend Services
│   └── api/                      # FastAPI Backend
│       ├── app/                  # FastAPI Application
│       └── requirements.txt       # Python Dependencies
│
├── docs/                         # Documentation
├── public/                       # Static Assets
├── supabase-schema.sql           # Database Schema
├── package.json                   # Frontend Dependencies
└── README.md                      # This File
```

## 📂 Frontend Structure (`src/`)

### App Router (`src/app/`)

Next.js 15 App Router with file-based routing.

```
src/app/
├── layout.tsx                     # Root Layout
├── page.tsx                       # Landing Page
├── globals.css                     # Global Styles
├── favicon.ico                     # Favicon
│
├── (app)/                         # Authenticated Routes
│   ├── layout.tsx                  # App Layout (with sidebar)
│   │
│   ├── dashboard/                 # Dashboard Routes
│   │   └── page.tsx               # Dashboard Page
│   │
│   ├── create/                    # Campaign Creation
│   │   └── page.tsx               # Create Campaign Page
│   │
│   ├── gallery/                   # Generated Content
│   │   └── page.tsx               # Gallery Page
│   │
│   ├── pricing/                   # Pricing Plans
│   │   └── page.tsx               # Pricing Page
│   │
│   ├── projects/                  # Project Management
│   │   └── page.tsx               # Projects Page
│   │
│   └── settings/                  # User Settings
│       └── page.tsx               # Settings Page
│
├── (auth)/                        # Authentication Routes
│   ├── layout.tsx                  # Auth Layout
│   └── auth/
│       └── page.tsx               # Login/Signup Page
│
├── api/                           # API Routes (Serverless)
│   ├── generate-script/
│   │   └── route.ts               # Script Generation
│   │
│   ├── market-intelligence/
│   │   └── route.ts               # Market Analysis
│   │
│   ├── scrape/
│   │   └── route.ts               # URL Scraping
│   │
│   ├── voiceover/
│   │   └── route.ts               # Voice Synthesis
│   │
│   ├── generate-video/
│   │   └── route.ts               # Video Generation
│   │
│   └── storage/                   # Storage Operations
│       ├── route.ts               # Storage Info
│       ├── upload/
│       │   └── route.ts           # Upload Files
│       └── campaigns/
│           ├── route.ts           # List Campaigns
│           └── [campaignId]/
│               ├── route.ts       # Get Campaign
│               └── download/
│                   └── route.ts   # Download Files
│
└── assets/                        # Local Assets
    └── page.tsx                   # Assets Page
```

**Key Files:**

- `layout.tsx`: Root application layout with providers
- `(app)/layout.tsx`: Authenticated app layout with navigation
- `(auth)/layout.tsx`: Authentication layout (no sidebar)

### Components (`src/components/`)

Reusable React components organized by feature.

```
src/components/
│
├── AIAdStudio.tsx                 # AI Ad Creation Studio
├── Loader.tsx                     # Loading Component
├── MarketIntelligence.tsx         # Market Analysis Widget
├── ProductPreview.tsx             # Product Info Display
├── ScriptPreview.tsx             # Script Display
├── Sidebar.tsx                   # Main Navigation
├── Stepper.tsx                   # Multi-step Workflow
├── UrlInputForm.tsx              # URL Input Component
├── VideoPlayer.tsx               # Video Playback
│
├── auth/                          # Authentication Components
│   ├── ProtectedRoute.tsx         # Route Protection
│   └── index.ts                  # Exports
│
├── branding/                      # Branding Components
│   ├── SupernovaLogo.tsx          # Main Logo
│   └── index.ts                  # Exports
│
├── dashboard/                     # Dashboard Widgets
│   ├── AIAgentPanel.tsx           # AI Agent Interface
│   ├── ActionCards.tsx           # Quick Actions
│   ├── CampaignSave.tsx          # Save Campaign
│   ├── Dashboard.tsx             # Dashboard Container
│   ├── URLInputForm.tsx          # URL Input
│   ├── WorkflowProgress.tsx      # Workflow Status
│   └── index.ts                 # Exports
│
├── layout/                        # Layout Components
│   ├── Sidebar.tsx               # Sidebar Navigation
│   ├── TopBar.tsx                # Top Header Bar
│   └── TopNavigation.tsx        # Top Navigation
│
├── premium/                       # Premium UI Components
│   ├── CampaignPreview.tsx       # Campaign Preview
│   ├── GenerationProgress.tsx    # Progress Indicator
│   ├── PremiumStepper.tsx       # Premium Workflow
│   ├── PremiumWorkflowTimeline.tsx # Timeline View
│   ├── agent-status-panel.tsx    # Agent Status
│   ├── ai-command-center.tsx    # AI Controls
│   ├── hero-section.tsx         # Hero Banner
│   ├── workspace-hub.tsx        # Workspace Container
│   └── index.ts                 # Exports
│
├── ui/                            # Reusable UI Components
│   ├── button.tsx                # Button Component
│   ├── card.tsx                  # Card Component
│   ├── input.tsx                 # Input Component
│   ├── label.tsx                 # Label Component
│   ├── progress.tsx              # Progress Bar
│   ├── skeleton.tsx              # Loading Skeleton
│   ├── theme-provider.tsx        # Theme Context
│   └── ... (many more components)
│
└── vanta/                         # Visual Effects
    ├── DataVizScene.tsx          # Data Visualization
    ├── FeatureCards.tsx          # Feature Cards
    ├── GradientBackground.tsx    # Gradient Effects
    ├── HardcodedFeatureBadge.tsx # Feature Badge
    ├── KineticText.tsx          # Animated Text
    ├── ParticleScene.tsx        # Particle Effects
    ├── Root.tsx                 # Root Container
    ├── VantaLogo.tsx            # Vanta Logo
    ├── VantaShowcase.tsx        # Showcase Component
    ├── WaveformScene.tsx        # Waveform Animation
    └── animated-captions.ts      # Caption Animations
```

**Component Categories:**

- **Dashboard**: Widgets for main dashboard
- **Layout**: Navigation and layout components
- **Premium**: Advanced UI components with animations
- **UI**: Basic UI building blocks (buttons, inputs, etc.)
- **Vanta**: Visual effects and animations

### Library (`src/lib/`)

Utilities and helper functions.

```
src/lib/
├── api.ts                        # API Client
├── auth.tsx                      # Authentication
├── store.ts                      # Zustand Store
├── utils.ts                      # Utility Functions
├── productCleaner.ts            # Product Data Cleaning
├── storage.ts                   # Storage Utilities
│
├── hooks/                        # Custom React Hooks
│   └── useSupabase.ts           # Supabase Hook
│
└── supabase/                     # Supabase Integration
    ├── client.ts                # Supabase Client
    ├── database.ts              # Database Types
    ├── storage.ts               # Storage Client
    └── types.ts                  # Supabase Types
```

**Key Files:**

- `api.ts`: Centralized API client for backend communication
- `auth.tsx`: Authentication context and helpers
- `store.ts`: Zustand state management
- `utils.ts`: Common utility functions

### Types (`src/types/`)

TypeScript type definitions.

```
src/types/
└── product.ts                   # Product Type Definitions
```

## 📂 Backend Structure (`services/api/`)

### FastAPI Application

```
services/api/
├── app/                          # FastAPI Application
│   ├── main.py                   # App Entry Point
│   ├── __init__.py               # Package Init
│   │
│   ├── routes/                   # API Routes
│   │   ├── __init__.py           # Route Exports
│   │   ├── script.py             # Script Generation
│   │   ├── market_intelligence.py # Market Analysis
│   │   └── storage.py            # B2 Storage
│   │
│   └── repo/                     # Repository Layer
│       ├── __init__.py           # Package Init
│       ├── pipelines.py          # Genblaze Pipelines
│       ├── provider_catalog.py   # AI Provider Config
│       ├── b2_storage.py        # B2 Storage Logic
│       ├── market_intelligence_pipeline.py # Market Pipeline
│       └── ...                   # Other Repositories
│
├── requirements.txt              # Python Dependencies
├── .env.example                  # Environment Template
├── Procfile                      # Deployment Config
└── pyproject.toml                # Python Project Config
```

**Key Files:**

- `main.py`: FastAPI application configuration
- `routes/`: API endpoint definitions
- `repo/`: Business logic and external integrations

## 📂 Configuration Files

### Root Configuration

```
Supernova/
├── package.json                  # npm Dependencies
├── package-lock.json             # Locked Versions
├── tsconfig.json                 # TypeScript Config
├── next.config.ts                # Next.js Config
├── tailwind.config.ts            # TailwindCSS Config
├── postcss.config.mjs            # PostCSS Config
├── eslint.config.mjs             # ESLint Config
├── vercel.json                   # Vercel Config
│
├── components.json               # shadcn/ui Config
├── .env.example                  # Environment Template
├── .gitignore                    # Git Ignore Rules
├── DEPLOYMENT.md                 # Deployment Guide
└── README.md                     # Project Documentation
```

## 📂 Database Schema

### Supabase Schema

```
supernova/
├── supabase-schema.sql           # Complete Database Schema
```

**Tables:**

- `campaigns`: Marketing campaign data
- `users`: User information (managed by Supabase Auth)
- `products`: Product information
- `scripts`: Generated scripts
- `assets`: Campaign assets

## 📂 Documentation

```
docs/
├── GETTING_STARTED.md            # Setup Guide
├── DEPLOYMENT.md                 # Deployment Guide
├── GENBLAZE.md                   # AI Integration
├── BACKBLAZE_B2.md              # Storage Guide
└── PROJECT_STRUCTURE.md         # This File
```

## 📂 Static Assets

```
public/
└── (placeholder assets)
```

Static files served directly by Next.js.

## 🔍 Code Organization Patterns

### Next.js 15 App Router

Supernova uses Next.js 15's App Router for routing:

1. **Route Groups**: `(app)` and `(auth)` groups share layouts
2. **Dynamic Routes**: `[campaignId]` for parameterized routes
3. **Layouts**: Nested layouts for consistent UI
4. **Server Components**: Default for pages (better performance)
5. **Client Components**: Marked with `'use client'` for interactivity

### Component Architecture

Components follow a hierarchical structure:

```
Dashboard
├── Sidebar
├── TopBar
│
├── AIAgentPanel
│   ├── MarketIntelligence
│   └── URLInputForm
│
├── WorkflowProgress
│   ├── Stepper
│   └── ScriptPreview
│
└── CampaignSave
    └── ProductPreview
```

### State Management

Three layers of state:

1. **Server State**: React Query for API data
2. **Global State**: Zustand for app-wide state
3. **Local State**: React hooks for component state

### API Design

API routes follow RESTful conventions:

```
GET    /api/resource           # List resources
POST   /api/resource           # Create resource
GET    /api/resource/[id]      # Get single resource
PUT    /api/resource/[id]      # Update resource
DELETE /api/resource/[id]      # Delete resource
```

## 📊 File Count Summary

| Category | Count | Description |
|----------|-------|-------------|
| React Components | ~68 | UI components |
| API Routes | 11 | Serverless functions |
| Backend Routes | 4 | FastAPI endpoints |
| Python Modules | 8 | Backend modules |
| Documentation | 5 | Guide files |

## 🎯 Key Architectural Decisions

### 1. Monorepo Structure

Frontend and backend are in one repository for:

- **Simpler deployment**: Single repo connects to Vercel and Railway
- **Easy development**: Both services run locally
- **Version sync**: Changes stay in sync

### 2. API Proxy Pattern

Frontend routes proxy to FastAPI backend:

```
Browser → Vercel API → Railway Backend → OpenRouter
```

Benefits:
- Secure: API keys stay on server
- Scalable: Serverless handles load
- Simple: Same URL structure in dev and prod

### 3. Storage Abstraction

B2 storage uses centralized path constants:

```python
# Single source of truth for paths
CAMPAIGN_PREFIX = "campaigns/"
IMAGE_PREFIX = "images/"
```

This prevents path inconsistencies across the codebase.

### 4. AI Provider Flexibility

Genblaze abstracts AI providers:

```python
# Easy to switch models
SCRIPT_MODELS = [
    "qwen/qwen3.6-flash",      # Primary
    "qwen/qwen3.7-plus",        # Fallback
]
```

No hardcoded provider logic in business code.

### 5. Component Organization

Components grouped by feature, not type:

```
components/
├── dashboard/      # Dashboard-specific components
├── ui/             # Generic UI components
└── layout/         # Layout components
```

This makes finding components easier as the app grows.

## 📝 Adding New Features

### Adding a New API Route

1. Create route file:
   ```
   src/app/api/new-feature/route.ts
   ```

2. Implement handlers:
   ```typescript
   export async function GET() { /* ... */ }
   export async function POST(request: Request) { /* ... */ }
   ```

3. Add to backend if needed:
   ```
   services/api/app/routes/new_feature.py
   ```

### Adding a New Component

1. Create in appropriate folder:
   ```
   src/components/dashboard/NewComponent.tsx
   ```

2. Export from index:
   ```typescript
   // src/components/dashboard/index.ts
   export { NewComponent } from './NewComponent';
   ```

3. Import and use:
   ```typescript
   import { NewComponent } from '@/components/dashboard';
   ```

### Adding a Database Table

1. Update schema:
   ```sql
   CREATE TABLE new_table (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

2. Create TypeScript types in `src/lib/supabase/types.ts`

3. Add Supabase client queries in `src/lib/supabase/database.ts`

## 🔧 Development Workflow

### Code Organization

1. **Components**: Add to `src/components/[feature]/`
2. **Utilities**: Add to `src/lib/`
3. **Types**: Add to `src/types/` or `src/lib/supabase/`
4. **Backend**: Add to `services/api/app/repo/`

### Testing

1. **Unit Tests**: Add `*.test.ts` files next to components
2. **Integration Tests**: Add to `__tests__/` directory
3. **API Tests**: Use Postman or automated tests

### Code Style

- **ESLint**: Configured in `eslint.config.mjs`
- **Prettier**: Format on save (configure in IDE)
- **TypeScript**: Strict mode enabled

## 📚 Learning Path

To understand the codebase:

1. **Start with**: `src/app/page.tsx` (landing page)
2. **Then**: `src/components/dashboard/Dashboard.tsx` (main app)
3. **Next**: `src/lib/api.ts` (API client)
4. **Backend**: `services/api/app/main.py` (FastAPI setup)
5. **AI Logic**: `services/api/app/repo/pipelines.py` (Genblaze)

## 🗺️ Navigation Map

```
Want to change...
├── Landing page?         → src/app/page.tsx
├── Dashboard layout?    → src/components/layout/
├── New API endpoint?    → src/app/api/[feature]/route.ts
├── Backend logic?       → services/api/app/routes/
├── AI configuration?    → services/api/app/repo/provider_catalog.py
├── Storage logic?       → services/api/app/repo/b2_storage.py
├── Styling?            → src/app/globals.css, tailwind.config.ts
└── Database schema?     → supabase-schema.sql
```

## 📞 Support

For questions about the codebase:

- Review documentation in `/docs`
- Check existing components for patterns
- Look at similar features for reference
- Open an issue on GitHub

---

**Related Documentation:**
- [Getting Started](GETTING_STARTED.md)
- [Deployment](DEPLOYMENT.md)
- [Genblaze Integration](GENBLAZE.md)
- [Backblaze B2 Storage](BACKBLAZE_B2.md)
