# Genblaze AI Integration Guide

Complete guide to understanding and configuring the Genblaze AI orchestration system used by Supernova.

## 📚 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Supported Providers](#supported-providers)
- [AI Workflows](#ai-workflows)
- [Configuration](#configuration)
- [Model Selection](#model-selection)
- [API Usage](#api-usage)
- [Troubleshooting](#troubleshooting)

## Overview

Genblaze is an AI orchestration layer that provides a unified interface for multiple AI providers. Supernova uses Genblaze to:

- **Generate Marketing Scripts**: Create compelling ad copy from product information
- **Analyze Market Intelligence**: Extract insights about competitors and positioning
- **Route Requests**: Automatically select the best model for each task
- **Handle Fallbacks**: Gracefully handle provider failures with automatic retries

### Key Features

- **Multi-Provider Support**: OpenRouter, Groq, and custom endpoints
- **Automatic Model Routing**: Select best model based on task type
- **Fallback Mechanisms**: Automatic retries if primary model fails
- **Cost Optimization**: Use free tiers and cost-effective models
- **Unified Interface**: Single API for all AI operations

## Architecture

### System Components

```
┌──────────────────────────────────────────────────────────────┐
│                      SUPERNOVA APP                           │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                  FRONTEND API ROUTES                         │
│   (Next.js Serverless Functions)                            │
│   - /api/generate-script                                     │
│   - /api/market-intelligence                                │
└──────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP POST
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                  BACKEND API ROUTES                         │
│   (FastAPI)                                                 │
│   - /script                                                  │
│   - /market-intelligence                                     │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                 GENBLAZE ORCHESTRATION                      │
│   (services/api/app/repo/)                                  │
│   - pipelines.py       # Business logic                     │
│   - provider_catalog.py # Model configuration              │
│   - genblaze-core      # SDK integration                   │
└──────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
┌──────────────────┐ ┌────────────────┐ ┌─────────────────┐
│   OPENROUTER     │ │     GROQ       │ │   DIRECT APIs   │
│                  │ │                │ │                 │
│  • Qwen 3.6      │ │  • Llama 3     │ │  • DeepSeek    │
│  • DeepSeek V3   │ │  • Mixtral     │ │  • Claude      │
│  • Gemini 2.5    │ │  • Gemma       │ │  • Gemini      │
└──────────────────┘ └────────────────┘ └─────────────────┘
```

### Request Flow

1. **Client Request**: Frontend sends request to Next.js API route
2. **Route Handler**: Next.js validates request and forwards to FastAPI
3. **Orchestration**: Genblaze selects appropriate model
4. **AI Provider**: Request sent to selected provider
5. **Response**: Generated content returned through the chain
6. **Frontend**: Response displayed to user

## Supported Providers

### OpenRouter (Primary)

OpenRouter provides access to multiple AI models through a unified API:

**Script Generation Models:**
- `qwen/qwen3.6-flash` ⭐ (default) - Fast, cost-effective
- `qwen/qwen3.7-plus` - Higher quality
- `qwen/qwen3.6-plus:free` - Free tier available

**Market Intelligence Models:**
- `deepseek/deepseek-v3.2` ⭐ (default) - Excellent for structured output
- `anthropic/claude-sonnet-4-20250514` - High quality analysis
- `google/gemini-2.5-flash` - Fast and capable
- `mistral/mistral-nemo` - Cost-effective option

**Features:**
- Single API key for multiple models
- Automatic fallback to different models
- Usage tracking and cost management
- Free tier available

### Groq (Market Intelligence)

Groq provides ultra-fast inference for market intelligence:

**Available Models:**
- `llama-3.1-70b-versatile` - Fast and capable
- `mixtral-8x7b-32768` - Good for complex analysis
- `gemma2-9b-it` - Efficient for simple tasks

**Features:**
- Extremely fast inference
- Free tier with generous limits
- Simple API

## AI Workflows

### Script Generation Pipeline

The script generation workflow transforms product information into compelling marketing copy:

```
INPUT
  │
  ├── Product Title
  ├── Product Description
  ├── Price
  ├── Features
  └── Generation Type (ad, social, email)
  │
  ▼
┌─────────────────────────────────────────┐
│           GENBLAZE ORCHESTRATION         │
│                                          │
│  1. Route to OpenRouter                  │
│  2. Select model (qwen3.6-flash)        │
│  3. Format prompt                        │
│  4. Generate with temperature=0.7       │
│  5. Validate output                      │
│  6. Return structured response          │
└─────────────────────────────────────────┘
  │
  ▼
OUTPUT
  │
  ├── Generated Script (30-60 seconds)
  ├── Word count
  ├── Call-to-action
  └── Key selling points
```

**Prompt Engineering:**
- System prompt defines marketing expertise
- User prompt includes product details and constraints
- Response format specified for consistency

### Market Intelligence Pipeline

The market intelligence workflow analyzes products and competitors:

```
INPUT
  │
  ├── Product Name
  ├── Product Category
  └── Optional: Competitor Names
  │
  ▼
┌─────────────────────────────────────────┐
│           GENBLAZE ORCHESTRATION         │
│                                          │
│  1. Route to OpenRouter (DeepSeek)      │
│  2. Format analysis prompt              │
│  3. Generate market analysis            │
│  4. Parse JSON response                  │
│  5. Validate required fields            │
│  6. Return structured data              │
└─────────────────────────────────────────┘
  │
  ▼
OUTPUT
  │
  ├── Competitor Analysis
  ├── Market Trends
  ├── Pricing Insights
  ├── Target Audience
  └── Marketing Recommendations
```

**Output Structure:**
```json
{
  "competitors": [
    {
      "name": "Competitor A",
      "pricing": "$X range",
      "positioning": "premium/value"
    }
  ],
  "trends": ["trends in market"],
  "audience": "target demographics",
  "recommendations": ["actionable insights"]
}
```

## Configuration

### Environment Variables

Configure Genblaze behavior through environment variables:

```env
# Backend (.env)
OPENROUTER_API_KEY=your_openrouter_api_key

# Optional: Override default models
OPENROUTER_MODEL=qwen/qwen3.6-flash
OPENROUTER_MARKET_INTEL_MODEL=deepseek/deepseek-v3.2
```

### Provider Catalog

The provider catalog (`services/api/app/repo/provider_catalog.py`) defines available models:

```python
# Script Generation Models (in order of preference)
SCRIPT_MODELS = [
    "qwen/qwen3.6-flash",      # Default - fast and cheap
    "qwen/qwen3.7-plus",        # Higher quality
    "qwen/qwen3.6-plus:free",  # Free tier fallback
]

# Market Intelligence Models
MARKET_INTEL_MODELS = [
    "deepseek/deepseek-v3.2",    # Default - excellent for JSON
    "anthropic/claude-sonnet-4-20250514",  # High quality
    "google/gemini-2.5-flash",   # Fast
    "qwen/qwen3.6-plus",        # Fallback
]
```

### Configuration Options

#### Temperature

Controls randomness in generation:

- **Script Generation**: `0.7` (balanced creativity and consistency)
- **Market Intelligence**: `0.3` (more deterministic, structured output)

```python
# In pipelines.py
TEMPERATURE = 0.7
```

#### Max Tokens

Controls maximum response length:

- **Scripts**: 500-1000 tokens (based on duration)
- **Market Intelligence**: 2000 tokens (detailed analysis)

```python
# In pipelines.py
MAX_TOKENS = 800
```

## Model Selection

### Automatic Selection

Genblaze automatically selects models based on:

1. **Task Type**: Script vs Market Intelligence
2. **Model Availability**: Check if model is operational
3. **Cost Efficiency**: Prefer free/cheap models
4. **Performance**: Use proven models for each task

### Manual Override

You can manually specify models via environment variables:

```env
# Use specific model for scripts
OPENROUTER_MODEL=anthropic/claude-sonnet-4-20250514

# Use specific model for market intelligence
OPENROUTER_MARKET_INTEL_MODEL=google/gemini-2.5-flash
```

### Model Comparison

| Model | Speed | Quality | Cost | Best For |
|-------|-------|---------|------|----------|
| qwen/qwen3.6-flash | ⚡⚡⚡ | ⭐⭐ | $ | Fast generation |
| qwen/qwen3.7-plus | ⚡⚡ | ⭐⭐⭐ | $$$ | High quality |
| deepseek/deepseek-v3.2 | ⚡⚡ | ⭐⭐⭐⭐ | $$ | Structured JSON |
| claude-sonnet-4 | ⚡ | ⭐⭐⭐⭐⭐ | $$$ | Complex reasoning |

## API Usage

### Backend API Endpoints

#### Generate Script

```http
POST /script
Content-Type: application/json

{
  "product": {
    "title": "Wireless Earbuds",
    "description": "High-quality audio with noise cancellation",
    "price": "$79.99",
    "features": ["ANC", "30hr battery", "waterproof"]
  },
  "duration": 30,
  "generationType": "ad"
}
```

**Response:**
```json
{
  "script": "Introducing our revolutionary wireless earbuds...",
  "generationType": "ad"
}
```

#### Market Intelligence

```http
POST /market-intelligence
Content-Type: application/json

{
  "product": {
    "name": "Wireless Earbuds",
    "category": "Electronics",
    "price_range": "$50-100"
  }
}
```

**Response:**
```json
{
  "competitors": [...],
  "trends": [...],
  "audience": {...},
  "recommendations": [...]
}
```

#### Health Check

```http
GET /script/health
```

**Response:**
```json
{
  "status": "ok",
  "provider": "Genblaze",
  "model": "qwen/qwen3.6-flash"
}
```

### Frontend Integration

Frontend API routes proxy requests to the backend:

```typescript
// In src/app/api/generate-script/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  
  // Forward to FastAPI backend
  const response = await fetch(`${FASTAPI_URL}/script`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  
  return NextResponse.json(await response.json());
}
```

## Troubleshooting

### Issue 1: API Key Not Working

**Error:**
```
Authentication failed: Invalid API key
```

**Solution:**
1. Verify OpenRouter API key:
   ```bash
   curl -H "Authorization: Bearer $OPENROUTER_API_KEY" \
        https://openrouter.ai/api/v1/models
   ```
2. Check key in `.env` file:
   ```bash
   cat services/api/.env | grep OPENROUTER_API_KEY
   ```
3. Ensure key has sufficient credits at https://openrouter.ai/credits
4. Restart backend after updating key

### Issue 2: Model Not Available

**Error:**
```
Model not found or unavailable
```

**Solution:**
1. Check if model is listed at https://openrouter.ai/models
2. Update to available model:
   ```env
   OPENROUTER_MODEL=qwen/qwen3.6-flash
   ```
3. Use fallback model (already configured)

### Issue 3: Generation Timeout

**Error:**
```
Request timeout after 120 seconds
```

**Solution:**
1. Check network connectivity to OpenRouter
2. Use faster model:
   ```env
   OPENROUTER_MODEL=qwen/qwen3.6-flash
   ```
3. Reduce request complexity
4. Increase timeout in route handler if needed

### Issue 4: Poor Quality Output

**Symptoms:**
- Incomplete scripts
- Irrelevant content
- Incorrect formatting

**Solution:**
1. Increase model quality:
   ```env
   OPENROUTER_MODEL=qwen/qwen3.7-plus
   ```
2. Adjust temperature in `pipelines.py`:
   ```python
   TEMPERATURE = 0.8  # Higher creativity
   ```
3. Improve prompt in `pipelines.py`
4. Add more product details in request

### Issue 5: High Costs

**Symptoms:**
- Unexpected API charges
- Credits depleting quickly

**Solution:**
1. Monitor usage at https://openrouter.ai/usage
2. Use free models:
   ```env
   OPENROUTER_MODEL=qwen/qwen3.6-plus:free
   ```
3. Add spending limits at OpenRouter dashboard
4. Implement request caching

### Issue 6: Rate Limiting

**Error:**
```
Rate limit exceeded
```

**Solution:**
1. Check rate limits at OpenRouter dashboard
2. Implement request throttling
3. Use multiple API keys for rotation
4. Add delays between requests

## Cost Optimization

### Free Tier Usage

OpenRouter offers free access to some models:

```python
# Prioritize free models
SCRIPT_MODELS = [
    "qwen/qwen3.6-plus:free",  # Free tier first
    "qwen/qwen3.6-flash",       # Then cheap
]
```

### Request Caching

Cache frequent requests to reduce API calls:

```python
# In pipelines.py
from functools import lru_cache

@lru_cache(maxsize=100)
def generate_script(product_hash, **kwargs):
    # Only generate if not cached
    return _generate_script(product_hash, **kwargs)
```

### Batch Processing

Process multiple requests together when possible:

```python
# Instead of individual calls
for script in batch_generate(products):
    # Generate in batch
    pass
```

## Advanced Configuration

### Custom Provider Endpoint

Add custom API endpoints:

```python
# In provider_catalog.py
CUSTOM_PROVIDER = ProviderConfig(
    name="Custom Provider",
    base_url="https://api.custom-provider.com/v1",
    model="custom-model",
    api_key=os.environ.get("CUSTOM_API_KEY")
)
```

### Multi-Provider Fallback

Configure automatic fallback chains:

```python
# Script generation tries models in order
SCRIPT_MODELS = [
    "qwen/qwen3.7-plus",    # Primary
    "qwen/qwen3.6-flash",   # Fallback 1
    "qwen/qwen3.6-plus:free",  # Fallback 2
]

def generate_script_with_fallback(product, **kwargs):
    for model in SCRIPT_MODELS:
        try:
            return _generate_with_model(product, model, **kwargs)
        except Exception as e:
            logger.warning(f"Model {model} failed: {e}")
            continue
    raise RuntimeError("All models failed")
```

## Additional Resources

- **OpenRouter Documentation**: https://openrouter.ai/docs
- **Genblaze SDK**: https://github.com/genblaze/genblaze
- **Model Pricing**: https://openrouter.ai/models
- **API Status**: https://status.openrouter.ai

---

**Next:** [Deployment Guide](DEPLOYMENT.md) to deploy to production.
