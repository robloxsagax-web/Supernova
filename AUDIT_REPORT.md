# Production Stability Audit Report

**Date:** July 18, 2026  
**Auditor:** Senior Software Engineer  
**Scope:** Full codebase audit for production readiness

---

## Executive Summary

The codebase is **generally well-structured** with good error handling in most critical paths. The Market Intelligence pipeline has robust fallback handling. However, several critical security and stability issues were identified that require immediate attention before production deployment.

**Overall Readiness:** 7/10  
**Critical Issues:** 3  
**High Priority Issues:** 8  
**Medium Priority Issues:** 12  
**Low Priority Issues:** 6  

---

## Critical Bugs (Block Production)

### 1. API Key Exposed in Source Code 🔴 CRITICAL
**File:** `src/app/api/generate-video/route.ts:5`
```typescript
const PEXELS_API_KEY = 'Hx7oUDboB3bkjIlprNiGwO13l1eDRzBg9WfXotQm8aMLwq96WCAv06hg';
```
**Issue:** Pexels API key is hardcoded in the frontend code.
**Impact:** Key is publicly visible to anyone who inspects the source.
**Fix:** Move to environment variable `PEXELS_API_KEY` and access via `process.env`.

### 2. Gallery Cards Don't Display Actual Images 🟠 HIGH
**File:** `src/app/(app)/projects/page.tsx:341-346`
```tsx
<div className="w-full h-40 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 overflow-hidden">
  {campaign.image_count > 0 ? (
    <ImageIcon className="w-12 h-12 text-primary" />
  ) : (
    <Folder className="w-12 h-12 text-primary" />
  )}
</div>
```
**Issue:** Gallery shows generic icons instead of actual campaign images.
**Impact:** Users cannot preview their campaign content in the gallery.
**Fix:** Fetch and display thumbnail from `campaign.objects` or add thumbnail_url to metadata.

### 3. Date Sorting Will Crash on Invalid Dates 🟠 HIGH
**File:** `src/app/(app)/projects/page.tsx:69`
```typescript
return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
```
**Issue:** If `created_at` is empty string or invalid, `getTime()` returns `NaN`, causing sort comparison to fail.
**Impact:** Gallery page will crash or show undefined behavior.
**Fix:** Add date validation before sorting:
```typescript
const timeA = new Date(a.created_at).getTime() || 0;
const timeB = new Date(b.created_at).getTime() || 0;
return timeB - timeA;
```

---

## High Priority Issues

### 4. Missing `retrySaveCampaign` Action
**File:** `src/components/dashboard/CampaignSave.tsx:18`
```typescript
const handleRetry = () => {
  retrySaveCampaign();
};
```
**Issue:** `retrySaveCampaign` is used but not defined in the store interface.
**Fix:** Add to store interface and implementation.

### 5. Blob URL Memory Leak in VideoPlayer
**File:** `src/components/VideoPlayer.tsx:233-236`
```typescript
return () => {
  mounted = false;
  if (currentUrl) URL.revokeObjectURL(currentUrl);
};
```
**Issue:** Cleanup only runs if `currentUrl` was set. If `generateVoiceover` fails before setting `currentUrl`, cleanup never runs.
**Fix:** Initialize `currentUrl` properly and add try/finally cleanup.

### 6. Video Upload Has No Size Limit
**File:** `src/app/api/storage/upload/route.ts:192-210`
**Issue:** Large video uploads could timeout or crash the serverless function.
**Fix:** Add size validation before upload (max ~50MB for serverless).

### 7. Image URLs Not Validated Before Fetch
**File:** `src/app/api/storage/upload/route.ts:144-145`
```typescript
const response = await fetch(imageUrl);
const blob = await response.blob();
```
**Issue:** If `imageUrl` is invalid or points to non-existent resource, fetch will fail silently.
**Fix:** Add URL validation and error handling:
```typescript
if (!imageUrl || !isValidUrl(imageUrl)) return { success: false };
```

### 8. `any` Type Pollution in API Routes
**Files:** Multiple
```typescript
// src/app/api/storage/upload/route.ts:34
let body: any;

// src/app/api/generate-video/route.ts:182-193
.filter((f: any) => f.height >= 720...)
```
**Issue:** Unsafe type usage bypasses TypeScript safety checks.
**Fix:** Define proper interfaces for all request/response types.

### 9. Missing Request Timeouts on Some Fetches
**File:** `src/app/api/storage/upload/route.ts`
**Issue:** Image upload fetches don't have timeout handling.
**Fix:** Add AbortController timeouts to all fetch calls.

### 10. Voiceover Route Returns HTTP 500 on Failure
**File:** `src/app/api/voiceover/route.ts:147-154`
**Issue:** ElevenLabs failures return HTTP 500 instead of graceful degradation.
**Fix:** Add fallback response or return HTTP 200 with error in body.

### 11. Storage Response Type Uses `any`
**File:** `src/lib/storage.ts:61`
```typescript
private cache: Map<string, { data: any; timestamp: number }> = new Map();
```
**Issue:** Cache data is untyped, losing type safety.
**Fix:** Use proper generic type: `Map<string, { data: T; timestamp: number }>`.

---

## Medium Priority Issues

### 12. 140+ Console.log Statements
**Files:** Throughout codebase
**Issue:** Excessive logging may expose sensitive info and impact performance.
**Fix:** Replace with structured logging and remove spam logging.

### 13. Missing Loading States in Gallery
**File:** `src/app/(app)/projects/page.tsx`
**Issue:** While campaigns load, no skeleton or shimmer effect.
**Fix:** Add loading skeleton component.

### 14. Video Generation Missing Error State UI
**File:** `src/components/VideoPlayer.tsx:256`
**Issue:** Early return on `!script || !product` returns null with no user feedback.
**Fix:** Show meaningful message when data is missing.

### 15. Missing Retry Logic for B-Roll Fetch
**File:** `src/app/api/generate-video/route.ts`
**Issue:** Pexels API failures have no retry logic.
**Fix:** Add exponential backoff retry (3 attempts).

### 16. Unused `statusFilter` in Projects Page
**File:** `src/app/(app)/projects/page.tsx:61-63`
**Issue:** `statusFilter` is set but campaigns don't have status matching logic.
**Fix:** Either implement properly or remove the filter UI.

### 17. Potential Race Condition in Store
**File:** `src/lib/store.ts:305`
```typescript
await loadB2Campaigns(); // Race: state might change between operations
```
**Issue:** State could change while awaiting.
**Fix:** Use functional updates or add state guards.

### 18. MarketIntelligence Component Missing Try/Catch
**File:** `src/components/MarketIntelligence.tsx:118`
```typescript
setMarketIntelligence(data);
```
**Issue:** If data is malformed, component will crash.
**Fix:** Validate data structure before setting.

### 19. Missing Type for `filters` in `loadB2Campaigns`
**File:** `src/lib/store.ts:118`
```typescript
loadB2Campaigns: (filters?: any) => Promise<void>;
```
**Fix:** Define proper `SearchFilters` type.

### 20. Duplicate Script Cleaning Logic
**Files:** 
- `src/app/api/voiceover/route.ts`
- `src/components/VideoPlayer.tsx`

**Issue:** Same `cleanScriptForVoiceover` function exists in two places.
**Fix:** Extract to shared utility.

### 21. `audience` and `competitorAnalysis` Use `any` Type
**File:** `src/lib/storage.ts:163-164`
```typescript
audience?: any;
competitorAnalysis?: any;
```
**Fix:** Define proper interfaces.

### 22. Video Download Route Missing Content-Type Header
**File:** `src/app/api/storage/campaigns/[campaignId]/download/route.ts`
**Issue:** Download might fail on some browsers.
**Fix:** Add `Content-Type: application/zip` header.

### 23. Missing Error Boundary in Dashboard
**Files:** `src/app/(app)/dashboard/page.tsx`
**Issue:** Component errors will crash the entire page.
**Fix:** Add React Error Boundary wrapper.

---

## Low Priority Issues

### 24. Unused Imports in VideoPlayer
**File:** `src/components/VideoPlayer.tsx`
**Issue:** Some imports may not be used.
**Fix:** Run ESLint to identify and remove.

### 25. Magic Number: 35000ms Timeout
**File:** `src/components/VideoPlayer.tsx:185`
```typescript
const dismissTimer = setTimeout(() => {
  setShowBRollNote(false);
}, 35000);
```
**Fix:** Extract to named constant: `B_ROLL_NOTE_DISPLAY_MS`.

### 26. Duplicate Function Signatures
**Files:** Multiple
**Issue:** Similar functions exist in multiple places.
**Fix:** Consolidate into shared utilities.

### 27. Missing `campaign_id` in Store Interface
**File:** `src/lib/store.ts`
**Issue:** `CampaignMetadata` has `campaign_id` but store doesn't use it consistently.
**Fix:** Audit and standardize usage.

### 28. Hardcoded 5000ms Cache Timeout
**File:** `src/lib/storage.ts:62`
```typescript
private cacheTimeout = 5 * 60 * 1000;
```
**Fix:** Extract to config constant.

### 29. Inconsistent Error Message Format
**Files:** Throughout API routes
**Issue:** Some return `{error}`, others return `{error, code}`.
**Fix:** Standardize to `{success, error, code, requestId}`.

---

## Performance Improvements

### 1. Memoize `filteredCampaigns`
**File:** `src/app/(app)/projects/page.tsx:47-80`
**Status:** Already memoized with `useMemo` ✅

### 2. Add Image Lazy Loading
**File:** `src/app/(app)/projects/page.tsx`
**Fix:** Add `loading="lazy"` to any `<img>` tags when added.

### 3. Optimize ZIP Generation
**File:** `services/api/app/routes/storage.py:484-506`
**Issue:** Downloads all objects synchronously.
**Fix:** Consider streaming for large campaigns.

### 4. Reduce Bundle Size
**Recommendation:** Use dynamic imports for heavy components like Remotion player.

---

## Architecture Improvements

### 1. Shared Types Package
**Current:** Types defined in multiple places
**Recommendation:** Create `@/types/shared` for common interfaces used across frontend/backend.

### 2. API Client Abstraction
**Current:** Direct fetch calls scattered throughout
**Recommendation:** Create typed API client with automatic error handling.

### 3. Unified Error Handling
**Current:** Each component handles errors differently
**Recommendation:** Create `<ErrorBoundary>` and `useApi` hook.

### 4. Backend Health Checks
**Current:** No standardized health check format
**Recommendation:** Add consistent `{status, timestamp, version}` response.

---

## Files Modified (Recommended Changes)

| File | Changes |
|------|---------|
| `src/app/api/generate-video/route.ts` | Fix API key exposure, add timeouts |
| `src/app/(app)/projects/page.tsx` | Fix date sorting, display images |
| `src/app/api/storage/upload/route.ts` | Add URL validation, type safety |
| `src/app/api/voiceover/route.ts` | Add fallback handling |
| `src/app/api/storage/campaigns/[campaignId]/download/route.ts` | Add Content-Type header |
| `src/components/VideoPlayer.tsx` | Fix cleanup, add error UI |
| `src/components/MarketIntelligence.tsx` | Add data validation |
| `src/lib/storage.ts` | Remove `any` types |
| `src/lib/store.ts` | Add missing `retrySaveCampaign`, types |
| `src/components/dashboard/CampaignSave.tsx` | Fix retry button |

---

## Security Checklist

- [ ] API keys moved to environment variables
- [ ] No secrets in client-side code
- [ ] Input validation on all API routes
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] SQL injection prevention (if applicable)
- [ ] XSS prevention in user-generated content

---

## Recommendations

1. **Immediate:** Fix the 3 critical issues before deployment
2. **Week 1:** Address all high-priority issues
3. **Week 2:** Complete medium-priority fixes
4. **Week 3:** Performance optimization and cleanup
5. **Ongoing:** Add integration tests for critical paths

---

## Conclusion

The codebase has a solid foundation with good error handling in the Market Intelligence pipeline. The main concerns are:
1. **Security:** Exposed API key
2. **UX:** Gallery doesn't show images
3. **Stability:** Date handling edge cases

With the recommended fixes applied, the application will be production-ready.
