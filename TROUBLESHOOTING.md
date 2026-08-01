# Troubleshooting

Common issues and their solutions for Supernova.

---

## Missing Environment Variables

**Error:** `Missing required environment variable`

**Fix:**
1. Copy `.env.example` to `.env.local` for frontend
2. Copy `services/api/.env.example` to `services/api/.env` for backend
3. Fill in all required API keys and URLs
4. Restart the development server

---

## Supabase Connection

**Error:** `Failed to connect to Supabase` or authentication failures

**Fix:**
1. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
2. Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is valid
3. Ensure Supabase project is active
4. Check RLS policies are configured

---

## Railway Backend Offline

**Error:** `Connection refused` or `Backend unavailable`

**Fix:**
1. Check Railway dashboard for deployment status
2. Verify environment variables are set in Railway
3. Check logs for startup errors
4. Redeploy if necessary

---

## Vercel Deployment

**Error:** Build failures or 500 errors on Vercel

**Fix:**
1. Ensure all environment variables are set in Vercel dashboard
2. Run `npm run build` locally to check for errors
3. Check Vercel build logs for specific issues
4. Verify `vercel.json` configuration is correct

---

## Backblaze Credentials

**Error:** `B2 credentials invalid` or `Access Denied`

**Fix:**
1. Verify `B2_ACCESS_KEY_ID` is correct
2. Check `B2_SECRET_KEY` is accurate
3. Ensure bucket name in `B2_BUCKET_NAME` exists
4. Verify application key has appropriate permissions

---

## OpenRouter Errors

**Error:** `OpenRouter API error` or `Invalid API key`

**Fix:**
1. Check `OPENROUTER_API_KEY` is set correctly
2. Verify key has not expired
3. Check OpenRouter dashboard for usage limits
4. Ensure the account has sufficient credits

---

## Genblaze Errors

**Error:** `Genblaze initialization failed`

**Fix:**
1. Verify all AI provider keys are configured
2. Check Genblaze SDK is installed: `pip install genblaze`
3. Review Genblaze documentation for latest requirements
4. Check backend logs for specific error messages

---

## Missing API Keys

**Error:** `API key not found` or `Configuration missing`

**Fix:**
1. Review `.env` files for all required keys
2. Check deployment platform environment variables
3. Ensure no typos in variable names
4. Restart application after adding keys

---

## Empty Generation

**Error:** Script or content returns empty

**Fix:**
1. Verify product URL returns valid HTML content
2. Check internet connectivity
3. Review API response for error messages
4. Try a different product URL

---

## Image Generation Failures

**Error:** `Image generation failed` or timeout

**Fix:**
1. Check ElevenLabs/Pexels API keys are valid
2. Verify API rate limits not exceeded
3. Try generating with a different product
4. Check backend logs for specific API errors

---

## Build Issues

**Error:** `npm run build` fails

**Fix:**
```bash
# Clear cache and reinstall
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

---

## npm Install

**Error:** `npm install` fails or hangs

**Fix:**
```bash
# Use npm with legacy peer deps
npm install --legacy-peer-deps

# Or clear cache
npm cache clean --force
npm install
```

---

## Python Dependencies

**Error:** `Module not found` or import errors

**Fix:**
```bash
cd services/api
pip install -r requirements.txt

# Or reinstall
pip uninstall -r requirements.txt -y
pip install -r requirements.txt
```

---

## Still Stuck?

1. Check the [GitHub Issues](https://github.com/robloxsagax-web/Supernova/issues)
2. Review deployment platform status pages
3. Check API provider status dashboards
4. Enable debug logging for more details
