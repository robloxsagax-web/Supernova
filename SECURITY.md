# Security

This document describes the security practices implemented in Supernova to protect user data, API credentials, and system integrity.

---

## Environment Variables

Sensitive configuration is managed through environment variables, never hardcoded in source code.

**Frontend Environment Variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
FASTAPI_URL=http://localhost:8000
GROQ_API_KEY=your_groq_api_key
```

**Backend Environment Variables:**
```env
OPENROUTER_API_KEY=your_openrouter_api_key
B2_ACCESS_KEY_ID=your_backblaze_access_key
B2_SECRET_KEY=your_backblaze_secret_key
B2_BUCKET_NAME=your_bucket_name
```

**Security Measures:**
- `.env` files are excluded from version control via `.gitignore`
- Example templates (`.env.example`) are provided for reference
- Environment variables are configured per-deployment in Vercel and Railway dashboards

---

## Secrets Management

Secrets are never committed to the repository:

```gitignore
# env files
.env*
```

**Deployment Platform Integration:**
- **Vercel**: Environment variables configured in project settings
- **Railway**: Environment variables set via dashboard or `railway variables`
- **Supabase**: API keys managed in project dashboard

---

## Supabase Authentication

The application uses Supabase for user authentication with the following features:

- Email/password authentication with validation
- Password minimum length requirements (8+ characters)
- Email format validation using regex
- Session management via Supabase Auth

```typescript
const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }
  return { valid: true };
};
```

---

## Row Level Security (RLS)

Database tables use PostgreSQL Row Level Security policies to control data access:

```sql
-- RLS enabled on all tables
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Policies control access
CREATE POLICY "Public campaigns" ON campaigns FOR SELECT USING (true);
CREATE POLICY "Insert campaigns" ON campaigns FOR INSERT WITH CHECK (true);
```

RLS policies ensure users can only access data they're authorized to view.

---

## Input Validation

All API endpoints use Pydantic models for request validation:

```python
class ScriptRequest(BaseModel):
    product: Product
    duration: int = Field(default=30, ge=1, le=120)
    generationType: str = Field(default="ad")
    style: Optional[str] = None
```

**Validation Features:**
- Type checking on all request fields
- Range constraints (e.g., `ge=1, le=120` for duration)
- Required vs optional field enforcement
- Automatic 422 responses for invalid input

---

## API Error Handling

API routes handle errors gracefully without exposing sensitive information:

```python
except Exception as e:
    logger.error(f"Unexpected error: {e}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error"}
    )
```

**Practices:**
- Errors are logged server-side for debugging
- Generic error messages returned to clients
- Stack traces never exposed in responses
- Structured JSON error responses

---

## HTTPS

All production deployments enforce HTTPS:

- **Vercel**: HTTPS enabled by default for all deployments
- **Railway**: HTTPS supported via custom domains
- **Supabase**: HTTPS enforced for all API endpoints

---

## Presigned URLs

Backblaze B2 storage uses presigned URLs for secure asset access:

```python
PRESIGNED_URL_EXPIRY = 3600  # 1 hour

def generate_presigned_url(self, object_key: str, expiry_seconds: int = 3600):
    url = client.generate_presigned_url(
        'get_object',
        Params={'Bucket': self.bucket_name, 'Key': object_key},
        ExpiresIn=expiry_seconds
    )
```

**Benefits:**
- Time-limited access to private assets
- No credentials exposed to clients
- Direct browser-to-storage downloads
- Configurable expiration per request

---

## Secure Cloud Storage

Backblaze B2 provides enterprise-grade storage security:

- AWS S3-compatible API with TLS encryption
- Bucket-level access control via application keys
- Server-side encryption
- Regional data storage

---

## Private Buckets

B2 buckets are configured with appropriate access controls:

```python
# Storage paths are prefixed by campaign ID
CAMPAIGN_PREFIX = "campaigns/"
IMAGE_PREFIX = "images/"
VIDEO_PREFIX = "videos/"
```

Assets are organized by campaign with unique identifiers, preventing unauthorized access between campaigns.

---

## CORS Configuration

API routes configure CORS headers appropriately:

```python
cors_origins = os.environ.get("CORS_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins if cors_origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)
```

Production deployments restrict allowed origins to prevent cross-site requests.

---

## Responsible Disclosure

If you discover a security vulnerability in Supernova, please report it responsibly:

1. **Do not** create public GitHub issues for security vulnerabilities
2. Contact the maintainers privately with details
3. Include steps to reproduce the issue
4. Allow reasonable time for a response before public disclosure

We appreciate the security community's help in keeping Supernova safe.

---

*This document reflects security practices as implemented. Security is an ongoing effort, and practices may evolve over time.*
