# Performance & Optimization

This document describes the production optimizations implemented in Supernova to ensure reliable, fast, and efficient operation.

---

## Image Optimization

Next.js Image Optimization is configured for automatic image processing:

```typescript
// next.config.ts
images: {
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  formats: ['image/webp'],
  minimumCacheTTL: 60,
}
```

**Features:**
- Automatic WebP conversion
- Responsive image sizing based on viewport
- Remote image patterns configured for Amazon, Shopify, and other product image sources
- CDN-cached optimized images with 60-second TTL

---

## Multi-Model Fallback

The backend implements intelligent model fallback for resilience:

```python
# provider_catalog.py
SCRIPT_MODELS = [
    "qwen/qwen3.6-flash",
    "qwen/qwen3.7-plus", 
    "qwen/qwen3.6-plus:free",
]

MARKET_INTEL_MODELS = [
    "deepseek/deepseek-v3.2",
    "anthropic/claude-sonnet-4-20250514",
    "google/gemini-2.5-flash",
    "qwen/qwen3.6-plus",
    "mistral/mistral-nemo",
]
```

**Behavior:**
- Primary model attempts generation first
- On 404/model not found errors, automatically tries next model in list
- Non-model errors (auth, rate limits) fail immediately without fallback attempts
- Full logging of model attempts and timing metrics

---

## B2 Presigned URLs

Backblaze B2 storage uses presigned URLs for efficient asset delivery:

```python
# b2_storage.py
PRESIGNED_URL_EXPIRY = 3600  # 1 hour

def generate_presigned_url(self, object_key: str, expiry_seconds: int = 3600):
    """Generate a presigned GET URL for an object."""
    url = client.generate_presigned_url(
        'get_object',
        Params={'Bucket': self.bucket_name, 'Key': object_key},
        ExpiresIn=expiry_seconds
    )
```

**Benefits:**
- Direct browser-to-B2 downloads (reduces API server load)
- Time-limited access with configurable expiry
- No credentials exposed to client-side code
- Efficient for large file transfers

---

## Efficient Asset Organization

Campaign assets are organized with consistent path conventions:

```python
# Centralized storage path constants
CAMPAIGN_PREFIX = "campaigns/"
DATA_PREFIX = "data/"
IMAGE_PREFIX = "images/"
VIDEO_PREFIX = "videos/"
AUDIO_PREFIX = "audio/"
METADATA_FILE = "metadata.json"

# Organized structure:
# campaigns/{campaign_id}/
#   ├── metadata.json
#   ├── data/script.json
#   ├── images/product_*.webp
#   ├── videos/final.mp4
#   └── audio/narration.mp3
```

**Benefits:**
- Predictable file paths for fast lookups
- Logical separation of asset types
- Easy to list campaigns by prefix
- Efficient batch operations per campaign

---

## Async API Routes

FastAPI routes use async/await for non-blocking I/O:

```python
# storage.py
@router.post("/campaigns/{campaign_id}/upload/{asset_type}")
async def upload_campaign_asset(...):
    content_bytes = await content.read()  # Non-blocking file read
    # ...
    return JSONResponse({...})

@router.get("/campaigns/{campaign_id}/download")
async def download_campaign_zip(campaign_id: str) -> StreamingResponse:
    # Streaming response for large ZIP files
```

**Benefits:**
- Concurrent request handling
- Efficient memory usage for large uploads
- Streaming responses avoid loading entire files into memory

---

## Structured Logging

Comprehensive logging for observability and debugging:

```python
logger.info(f"genblaze_openai.chat() returned successfully with model {model}")
logger.info(f"TIMING - OpenRouter call: {model_duration:.2f}s, Total generation: {total_duration:.2f}s")
logger.info(f"Models available for fallback: {models_to_try}")
```

**Logged Metrics:**
- Model selection and fallback attempts
- API call duration
- Error types and tracebacks
- Storage operations and presigned URL generation

---

## Vercel Edge Deployment

Next.js frontend deploys to Vercel Edge Network:

```json
// vercel.json
"regions": ["iad1"],
"functions": {
  "src/app/api/scrape/route.ts": {
    "memory": 512,
    "maxDuration": 30
  }
}
```

**Optimizations:**
- Regional deployment reduces latency
- Memory and timeout limits per function
- Edge caching for static assets

---

## API Response Optimization

Efficient response handling with Pydantic models:

```python
class MarketIntelligenceResponse(BaseModel):
    url: str
    title: str
    price: Optional[str] = None
    # ... optimized field selection

@router.post("", response_model=MarketIntelligenceResponse)
async def generate_market_intelligence_endpoint(
    request: MarketIntelligenceRequest
) -> MarketIntelligenceResponse:
```

**Benefits:**
- Automatic request validation
- Response serialization optimization
- JSON response streaming for large payloads

---

## Railway Backend Hosting

FastAPI backend deployed on Railway with optimized configuration:

```procfile
# Railway deployment configuration
python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
```

**Features:**
- Auto-scaling infrastructure
- Environment-based port configuration
- Health check endpoints for load balancer integration

---

## Circuit Breaker Pattern

Fallback responses prevent complete service failures:

```python
# market_intelligence_pipeline.py
def get_minimal_valid_market_intelligence(url: str) -> dict:
    """Return a minimal valid market intelligence object as fallback."""
    return {
        "_fallback": True,
        "_reason": "Generated minimal fallback due to LLM parsing issues",
        "confidence_score": 0.1,
        # ... minimal required fields
    }
```

**Behavior:**
- Graceful degradation on AI service failures
- Always returns valid JSON structure
- Clients can detect fallback state via `_fallback` flag

---

## Temperature Tuning

Different AI models use appropriate temperature settings:

```python
PROVIDERS = {
    "openai": ProviderConfig(
        model=_get_script_model(),
        temperature=0.7  # Creative but coherent
    ),
    "market_intel": ProviderConfig(
        model=_get_market_intel_model(),
        temperature=0.3  # Consistent JSON output
    )
}
```

**Strategy:**
- Script generation: Higher temperature for creative variation
- Market intelligence: Lower temperature for structured, consistent JSON

---

*This document reflects production optimizations as implemented. For questions or suggestions, please open an issue.*
