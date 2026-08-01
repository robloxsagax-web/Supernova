# Backblaze B2 Storage Guide

Complete guide to setting up and using Backblaze B2 for campaign asset storage in Supernova.

## 📚 Table of Contents

- [Overview](#overview)
- [Why B2?](#why-b2)
- [What is Stored](#what-is-stored)
- [Bucket Structure](#bucket-structure)
- [Creating a B2 Account](#creating-a-b2-account)
- [Setting Up B2](#setting-up-b2)
- [Configuration](#configuration)
- [Using B2 in Development](#using-b2-in-development)
- [Troubleshooting](#troubleshooting)

## Overview

Backblaze B2 is an S3-compatible cloud storage service used by Supernova to store campaign assets, including generated images, videos, scripts, and metadata. B2 provides cost-effective, reliable storage with excellent integration with AWS S3 tools.

## Why B2?

Supernova uses Backblaze B2 for several reasons:

### Advantages

- **Cost-Effective**: B2 Cloud Storage starts at $0.006/GB/month (vs S3's $0.023/GB)
- **S3-Compatible**: Works seamlessly with AWS SDKs and tools
- **Reliable**: 99.9% uptime SLA with data redundancy
- **Simple API**: Easy integration with existing S3 code
- **Free Tier**: 10GB free storage and 1GB free downloads per day

### Alternatives Considered

- **AWS S3**: More expensive, but widely familiar
- **Google Cloud Storage**: Good alternative but higher cost
- **Azure Blob**: Enterprise-focused, more complex setup

> **💡 Tip:** B2's S3 compatibility means you can use the same code with S3 if you ever need to migrate.

## What is Stored

Supernova uses B2 to store various campaign-related assets:

### Campaign Data

- **Metadata**: Campaign settings, product info, generation parameters
- **Scripts**: AI-generated marketing scripts in JSON/text format
- **Thumbnails**: Preview images for campaigns

### Generated Assets

- **Images**: Product images, backgrounds, overlays
- **Videos**: Generated video files (if applicable)
- **Audio**: Voiceovers and sound effects

### Download Bundles

- **Export Files**: Complete campaign packages for download
- **Archives**: Bundled assets in ZIP format

## Bucket Structure

Supernova organizes B2 storage with a consistent folder structure:

```
supernova-bucket/
└── campaigns/
    └── {campaign_id}/
        ├── metadata.json          # Campaign metadata
        ├── data/
        │   └── script.json        # Generated scripts
        ├── images/
        │   ├── product.jpg        # Product images
        │   └── thumbnail.png       # Preview images
        ├── videos/
        │   └── final.mp4          # Generated videos
        └── audio/
            └── voiceover.mp3      # Voiceover files
```

### Path Constants

The backend uses centralized path constants to ensure consistency:

```python
CAMPAIGN_PREFIX = "campaigns/"
DATA_PREFIX = "data/"
IMAGE_PREFIX = "images/"
VIDEO_PREFIX = "videos/"
AUDIO_PREFIX = "audio/"
METADATA_FILE = "metadata.json"
```

## Creating a B2 Account

### Step 1: Sign Up

1. Go to https://www.backblaze.com/b2/cloud-storage.html
2. Click "Sign Up Free"
3. Enter your email and create a password
4. Verify your email address

### Step 2: Create a Bucket

1. Log in to B2 dashboard
2. Click "Create a Bucket" button
3. Configure bucket settings:
   - **Bucket Name**: `supernova-campaigns` (or your choice)
   - **Region**: Choose closest to your users (e.g., `us-west-004` for US West)
   - **Access**: Private (recommended for security)
   - **Encryption**: SSE-B2 (default, included free)
4. Click "Create Bucket"

### Step 3: Create an Application Key

Application keys are more secure than master keys:

1. In your bucket, click "App Keys"
2. Click "Add a New Application Key"
3. Configure:
   - **Name**: `Supernova Backend Key`
   - **Access Type**: Read and Write
   - **Prefix**: Leave empty for full access, or specify `campaigns/` for folder access
4. Click "Create New Key"
5. **IMPORTANT**: Copy and save the `keyID` and `applicationKey`
   - You won't be able to see the applicationKey again

### Step 4: Get Your Credentials

You'll need three values:

1. **Key ID** (similar to: `0042...0000`)
2. **Application Key** (the secret you just created)
3. **Bucket Name** (e.g., `supernova-campaigns`)

## Setting Up B2

### Option 1: Environment Variables (Recommended)

Add these to your backend `.env` file (`services/api/.env`):

```env
# Backblaze B2 Configuration
B2_ACCESS_KEY_ID=your_key_id_from_b2
B2_SECRET_KEY=your_application_key_from_b2
B2_BUCKET_NAME=supernova-campaigns
B2_REGION=us-west-004
B2_ENDPOINT=https://s3.us-west-004.backblazeb2.com
```

> **⚠️ Security:** Never commit `.env` files to version control. They contain sensitive credentials.

### Option 2: Vercel Environment Variables

For production on Vercel:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable:
   - `B2_ACCESS_KEY_ID`
   - `B2_SECRET_KEY`
   - `B2_BUCKET_NAME`
   - `B2_REGION`
   - `B2_ENDPOINT`
4. Set for all environments (Production, Preview, Development)
5. Redeploy to apply changes

### Option 3: Railway Environment Variables

For production on Railway:

1. Go to your Railway project
2. Navigate to Variables tab
3. Add each variable:
   - `B2_ACCESS_KEY_ID`
   - `B2_SECRET_KEY`
   - `B2_BUCKET_NAME`
   - `B2_REGION`
   - `B2_ENDPOINT`
4. Restart the service to apply changes

## Configuration

### Endpoint URLs by Region

B2 has different endpoints for each region:

| Region | Endpoint URL |
|--------|-------------|
| us-west-004 | https://s3.us-west-004.backblazeb2.com |
| us-west-002 | https://s3.us-west-002.backblazeb2.com |
| us-east-005 | https://s3.us-east-005.backblazeb2.com |
| eu-central-001 | https://s3.eu-central-001.backblazeb2.com |

### S3-Compatible Settings

Supernova uses the AWS S3 SDK with B2 configuration:

```python
import boto3
from botocore.config import Config

# B2 S3 Client
s3_client = boto3.client(
    's3',
    endpoint_url='https://s3.us-west-004.backblazeb2.com',
    aws_access_key_id='your_key_id',
    aws_secret_access_key='your_secret_key',
    region_name='us-west-004',
    config=Config(
        signature_version='s3v4',
        s3={'addressing_style': 'path'}
    )
)
```

## Using B2 in Development

### Local Development

B2 is optional for local development:

1. **Without B2**: The application will log warnings but continue to work
2. **With B2**: Full storage functionality enabled

To enable B2 locally:

1. Copy credentials from B2 dashboard
2. Add to `services/api/.env`
3. Restart backend: `cd services/api && uvicorn app.main:app --reload`
4. Check health endpoint: `curl http://localhost:8000/health`

### Testing B2 Operations

#### Test Upload

```bash
# Create a test file
echo "test content" > test.txt

# Upload via backend API
curl -X POST http://localhost:8000/storage/upload \
  -F "file=@test.txt" \
  -F "campaign_id=test-campaign" \
  -F "file_type=data"
```

#### Test Download

```bash
# Download a file
curl -o downloaded.txt \
  "http://localhost:8000/storage/download?campaign_id=test-campaign&file_type=data&filename=test.txt"
```

#### Test List

```bash
# List campaign files
curl "http://localhost:8000/storage/list?campaign_id=test-campaign"
```

### Viewing B2 Content

You can view uploaded files in several ways:

1. **B2 Dashboard**: Browse files in the web interface
2. **B2 Browser**: Use the Backblaze B2 Browser app
3. **AWS CLI**: Use S3-compatible commands:

```bash
# Install AWS CLI
pip install awscli

# Configure with B2 credentials
aws configure
# AWS Access Key ID: your_key_id
# AWS Secret Access Key: your_application_key
# Default region name: us-west-004
# Default output format: json

# List buckets
aws s3 ls --endpoint-url=https://s3.us-west-004.backblazeb2.com

# List campaign files
aws s3 ls s3://supernova-campaigns/campaigns/ \
  --endpoint-url=https://s3.us-west-004.backblazeb2.com
```

## API Operations

The backend provides these B2 operations via API:

### Upload File

```
POST /storage/upload
Content-Type: multipart/form-data

campaign_id: string (required)
file_type: string (required) - one of: data, image, video, audio
file: binary (required)
```

### Download File

```
GET /storage/download?campaign_id=xxx&file_type=xxx&filename=xxx
```

### List Campaign Files

```
GET /storage/list?campaign_id=xxx
```

### Delete File

```
DELETE /storage/delete?campaign_id=xxx&file_type=xxx&filename=xxx
```

### Generate Presigned URL

```
POST /storage/presign
Content-Type: application/json

{"campaign_id": "xxx", "file_type": "xxx", "filename": "xxx"}
```

## Troubleshooting

### Issue 1: "B2 is not configured"

**Error:**
```
WARNING - B2 credentials not found in environment
```

**Solution:**
1. Verify credentials in `.env` file
2. Restart backend server
3. Check spelling of variable names:
   - `B2_ACCESS_KEY_ID`
   - `B2_SECRET_KEY`
   - `B2_BUCKET_NAME`

### Issue 2: "Access Denied"

**Error:**
```
ClientError: An error occurred (403 Forbidden)
```

**Solution:**
1. Verify application key is active:
   - Go to B2 Dashboard → Buckets → Your Bucket → App Keys
   - Ensure key is not expired or deleted
2. Check bucket permissions:
   - Ensure key has access to the bucket
   - If using prefix restrictions, verify file paths match
3. Validate credentials:
   - Key ID format: `00xxx...0000`
   - Application Key: 64-character string

### Issue 3: "Bucket Not Found"

**Error:**
```
ClientError: An error occurred (NoSuchBucket)
```

**Solution:**
1. Verify bucket name matches exactly:
   - Case-sensitive
   - No extra spaces
2. Check bucket region matches endpoint
3. Ensure bucket exists in B2 dashboard

### Issue 4: Upload Timeout

**Error:**
```
ClientError: Read timeout on endpoint URL
```

**Solution:**
1. Check network connectivity to B2
2. Try smaller file sizes for testing
3. Increase timeout in code if needed
4. Check B2 service status at https://status.backblaze.com

### Issue 5: File Not Found

**Error:**
```
ClientError: An error occurred (404 Not Found)
```

**Solution:**
1. Verify file exists:
   - Check in B2 dashboard
   - List campaign files via API
2. Check file path:
   - Ensure correct campaign_id
   - Ensure correct filename
3. Verify file_type matches expected location

### Issue 6: CORS Error

**Error:**
```
CORS policy: No 'Access-Control-Allow-Origin' header
```

**Solution:**
1. This shouldn't occur with backend-only access
2. If using direct browser uploads:
   - Configure CORS on B2 bucket
   - Contact B2 support if issues persist

## Security Best Practices

### Protect Your Credentials

1. **Never commit `.env` files**
   - Already in `.gitignore`
   - Double-check before pushing

2. **Use Application Keys**
   - Not master keys
   - Set minimal permissions
   - Set expiration if possible

3. **Rotate Keys Regularly**
   - Create new key periodically
   - Update in all environments

### Bucket Security

1. **Private Access**
   - Keep bucket private (default)
   - Use presigned URLs for downloads

2. **Lifecycle Rules**
   - Set up expiration for old files
   - Archive or delete unused campaigns

3. **Access Logging**
   - Enable B2 server-side logging
   - Monitor for unusual access

## Cost Optimization

### Reduce Storage Costs

1. **Delete Unused Campaigns**
   - Set retention policies
   - Auto-delete after X days

2. **Compress Files**
   - Use ZIP for bundles
   - Optimize images before upload

3. **Use Appropriate Storage Class**
   - B2 Standard for active files
   - Consider B2 Auto-Restore for archives

### Reduce Egress Costs

1. **Minimize Downloads**
   - Cache files locally
   - Batch downloads when possible

2. **Use CDN**
   - Cloudflare free tier
   - Cache frequently accessed files

3. **Monitor Usage**
   - Check B2 dashboard regularly
   - Set billing alerts

## Additional Resources

- **B2 Documentation**: https://www.backblaze.com/docs/cloud-storage
- **B2 S3 Compatibility**: https://www.backblaze.com/docs/cloud-storage-s3
- **B2 Pricing**: https://www.backblaze.com/b2/cloud-storage-pricing.html
- **B2 Support**: https://www.backblaze.com/docs/support

---

**Next:** [Genblaze Integration](GENBLAZE.md) to understand AI orchestration.
