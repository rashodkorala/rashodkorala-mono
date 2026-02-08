# Security Audit Report

**Date:** 2026-02-08
**Scope:** Full codebase — `apps/cms`, `apps/photos`, `apps/portfolio`

---

## Critical Vulnerabilities

### 1. Open Redirect in Auth Confirmation Endpoint

**File:** `apps/cms/app/auth/confirm/route.ts:10`
**Severity:** HIGH

The `next` parameter is taken directly from the query string and passed to `redirect()` without validation:

```ts
const next = searchParams.get("next") ?? "/";
// ...
redirect(next);
```

An attacker can craft a URL like `/auth/confirm?token_hash=...&type=...&next=https://evil.com` to redirect users to a malicious site after email confirmation. This is a classic open redirect vulnerability that can be used in phishing attacks.

**Recommendation:** Validate that `next` is a relative path starting with `/` and does not contain `//` or protocol schemes.

---

### 2. Storage Bucket Policies Allow Cross-User File Manipulation

**Files:**
- `apps/cms/database-storage-media-bucket.sql:24-27`
- `apps/cms/database-storage-projects-bucket.sql:24-27`
- `apps/cms/database-storage-case-studies-bucket.sql:24-27`

**Severity:** HIGH

All storage bucket policies only check `bucket_id` but **do not enforce `owner` or path-based user isolation**. Any authenticated user can:

- **Upload** files to any path in the bucket (including overwriting other users' files)
- **Update** any file in the bucket
- **Delete** any file in the bucket

Example from media bucket:
```sql
CREATE POLICY "Users can upload media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');
-- No owner check!
```

**Recommendation:** Add `owner = auth.uid()` to USING/WITH CHECK clauses, or enforce path-based isolation like `(storage.foldername(name))[1] = auth.uid()::text`.

---

### 3. Unauthenticated AI API Endpoints (No Auth Check)

**Files:**
- `apps/cms/app/api/analyze-photo/route.ts:3`
- `apps/cms/app/api/generate-project-content/route.ts:3`
- `apps/cms/app/api/generate-project-from-questions/route.ts:3`

**Severity:** HIGH

These three API routes have **zero authentication**. Any anonymous user can:

- Send unlimited image analysis requests (consuming OpenAI API credits)
- Generate unlimited project content (consuming OpenAI API credits)
- Generate unlimited project-from-questions content (consuming OpenAI API credits)

There is no session check, no API key requirement, and no rate limiting. This creates a direct financial exposure vector.

**Recommendation:** Add `supabase.auth.getUser()` checks at the start of each handler, returning 401 if unauthenticated.

---

## High Vulnerabilities

### 4. CORS Wildcard with Credentials on Analytics Endpoint

**File:** `apps/cms/app/api/analytics/track/route.ts:10,91-92`
**Severity:** HIGH

The CORS configuration sets both:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
```

Per the CORS specification, `Access-Control-Allow-Credentials: true` combined with `Access-Control-Allow-Origin: *` is actually rejected by browsers. However, the intent here appears to be allowing cross-origin credentialed requests, which indicates a misunderstanding of CORS. If this is changed to reflect the actual requesting origin, it would allow any site to make authenticated requests to this endpoint.

**Recommendation:** Set `Access-Control-Allow-Origin` to a specific list of allowed domains. Remove `Access-Control-Allow-Credentials: true` if wildcard origin is needed.

---

### 5. Weak IP Hashing (Base64 is Not a Hash)

**File:** `apps/cms/app/api/analytics/track/route.ts:19-23`
**Severity:** MEDIUM

The `hashIP` function uses Base64 encoding, which is trivially reversible:

```ts
function hashIP(ip: string): string {
  return Buffer.from(ip).toString("base64").slice(0, 16);
}
```

Base64 is not a hash — it is a reversible encoding. The stored "hashed" IPs can be decoded back to the original IP address. This is a privacy concern, especially under GDPR.

**Recommendation:** Use `crypto.createHash('sha256').update(ip + salt).digest('hex')` with a server-side salt.

---

### 6. `SECURITY DEFINER` Function Without `search_path` Restriction

**File:** `apps/cms/database-schema-analytics.sql:122`
**Severity:** MEDIUM

The `get_analytics_summary` function uses `SECURITY DEFINER` without setting a restricted `search_path`:

```sql
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

A `SECURITY DEFINER` function runs with the privileges of the function owner (typically a superuser). Without `SET search_path = public`, an attacker could exploit search path injection to escalate privileges.

**Recommendation:** Add `SET search_path = public` to the function definition, or switch to `SECURITY INVOKER` if the function doesn't need elevated privileges.

---

### 7. Wildcard Image Remote Patterns in CMS Next.js Config

**File:** `apps/cms/next.config.ts:38-39`
**Severity:** MEDIUM

The CMS Next.js image configuration allows **all HTTPS domains**:

```ts
{
  protocol: "https",
  hostname: "**",
}
```

Combined with `dangerouslyAllowSVG: true` (line 55), this allows Next.js to proxy and optimize images from any domain, including potentially malicious SVGs. While the `contentSecurityPolicy` on SVGs helps mitigate script execution, this broadens the attack surface for SSRF through the image optimization endpoint.

**Recommendation:** Remove the wildcard pattern and only whitelist domains you actually use. Remove `dangerouslyAllowSVG: true` unless specifically needed.

---

## Medium Vulnerabilities

### 8. No Rate Limiting on Any API Endpoint

**Severity:** MEDIUM

None of the API routes implement rate limiting:
- `/api/analytics/track` — could be flooded with fake analytics data
- `/api/analyze-photo` — each request costs OpenAI API credits
- `/api/generate-project-content` — each request costs OpenAI API credits
- `/api/generate-project-from-questions` — each request costs OpenAI API credits
- `/api/projects` — could be used for enumeration

**Recommendation:** Implement rate limiting using middleware (e.g., Upstash ratelimit with Redis, or Vercel's built-in rate limiting).

---

### 9. Error Messages Leak Internal Details

**Files:**
- `apps/cms/app/api/analytics/track/route.ts:185`
- `apps/cms/app/api/analyze-photo/route.ts:135`
- `apps/cms/app/api/generate-project-content/route.ts:167`

**Severity:** LOW-MEDIUM

Error handlers return `error.message` directly to the client:

```ts
{ error: error instanceof Error ? error.message : "Unknown error" }
```

Internal error messages may reveal stack traces, database details, or file paths that help attackers understand the system.

**Recommendation:** Return generic error messages to clients. Log detailed errors server-side only.

---

### 10. Analytics API Key Comparison Vulnerable to Timing Attacks

**File:** `apps/cms/app/api/analytics/track/route.ts:84`
**Severity:** LOW

The API key comparison uses simple string equality:

```ts
if (!apiKey || !expectedKey || apiKey !== expectedKey)
```

While the practical exploitability is low, direct string comparison is technically vulnerable to timing attacks.

**Recommendation:** Use `crypto.timingSafeEqual()` for API key comparison.

---

### 11. User ID Can Be Spoofed in Analytics External API

**File:** `apps/cms/app/api/analytics/track/route.ts:98`
**Severity:** MEDIUM

When using API key auth (non-session), the `userId` can come from the request body:

```ts
const userId = body.userId || process.env.ANALYTICS_USER_ID
```

If the `ANALYTICS_API_KEY` is compromised or shared, any caller can inject analytics data for any `userId`, potentially corrupting another user's analytics dashboard.

**Recommendation:** When using API key auth, always use the `ANALYTICS_USER_ID` from the environment and ignore client-supplied values.

---

### 12. No File Size/Type Validation on Photo Analysis Upload

**File:** `apps/cms/app/api/analyze-photo/route.ts:5-6`
**Severity:** MEDIUM

The endpoint accepts FormData file uploads with no validation of:
- File size (could accept multi-GB files, causing memory exhaustion)
- File type (the `mimeType` is trusted from the client and sent to OpenAI)

```ts
const formData = await request.formData()
const file = formData.get("file") as File
```

**Recommendation:** Validate file size (e.g., max 10MB) and verify the MIME type server-side before processing.

---

### 13. Photos App Console Logging in Production

**File:** `apps/photos/app/actions/photos.ts:46-50`
**Severity:** LOW

The photos server action logs potentially sensitive error details and data counts to the console in production:

```ts
console.error('Error details:', JSON.stringify(error, null, 2));
console.log(`Successfully fetched ${data?.length || 0} photos...`);
```

**Recommendation:** Use a proper logging library with log levels. Avoid `JSON.stringify(error)` in production as it may serialize sensitive data.

---

### 14. Hardcoded Service Account Email Fallback

**File:** `apps/photos/utils/supabase/server.ts:68`
**Severity:** LOW

A default email is hardcoded as a fallback:

```ts
const serviceEmail = process.env.SUPABASE_SERVICE_ACCOUNT_EMAIL || 'service@photos.rashodkorala.com';
```

While low severity, hardcoded fallback credentials in source code are a code smell and could lead to confusion or misuse.

**Recommendation:** Require the environment variable and throw an error if it's not set.

---

### 15. Portfolio App Uses Global Singleton Supabase Client

**File:** `apps/portfolio/lib/supabase.ts:21`
**Severity:** LOW

```ts
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

A singleton client is created at module load time and shared across all requests. In serverless environments this is usually fine (cold start per instance), but in long-lived server processes this could theoretically lead to stale state.

**Recommendation:** Consider using `createServerClient` from `@supabase/ssr` for server-side rendering, consistent with the other apps.

---

## Informational Findings

### 16. CMS Middleware Uses `hasEnvVars` Bypass

**File:** `apps/cms/lib/supabase/middleware.ts:12-14`

The middleware skips auth checks entirely when `hasEnvVars` is false. If environment variables are misconfigured in production, all routes become publicly accessible.

### 17. Non-Null Assertions on Environment Variables

Multiple files use `!` assertions on environment variables (e.g., `process.env.NEXT_PUBLIC_SUPABASE_URL!`). If these are missing, the app will throw cryptic runtime errors instead of clear startup failures.

### 18. `dangerouslySetInnerHTML` Usage

Found in `apps/photos/app/layout.tsx:180,184` and `apps/cms/components/ui/chart.tsx:83`. The photos app usage is safe (server-controlled JSON-LD). The chart component uses config-driven values which are also safe.

### 19. SQL Schema Files in Source Code

Database schema `.sql` files are committed to the repo at `apps/cms/database-*.sql`. While not a vulnerability, these provide an attacker with full knowledge of the database structure. Consider keeping schema migrations in a protected directory or using a migration tool like Supabase CLI migrations.

---

## Summary

| # | Vulnerability | Severity | Category |
|---|---|---|---|
| 1 | Open Redirect in Auth Confirm | HIGH | Input Validation |
| 2 | Storage Policies Allow Cross-User Access | HIGH | Authorization |
| 3 | Unauthenticated AI API Endpoints | HIGH | Authentication |
| 4 | CORS Wildcard with Credentials | HIGH | Configuration |
| 5 | Weak IP "Hashing" (Base64) | MEDIUM | Privacy |
| 6 | SECURITY DEFINER Without search_path | MEDIUM | Database |
| 7 | Wildcard Image Domains + SVG | MEDIUM | Configuration |
| 8 | No Rate Limiting | MEDIUM | Availability |
| 9 | Error Message Information Leak | LOW-MEDIUM | Information Disclosure |
| 10 | Timing-Unsafe API Key Comparison | LOW | Authentication |
| 11 | User ID Spoofing in Analytics | MEDIUM | Authorization |
| 12 | No File Upload Validation | MEDIUM | Input Validation |
| 13 | Verbose Console Logging | LOW | Information Disclosure |
| 14 | Hardcoded Service Account Email | LOW | Configuration |
| 15 | Singleton Supabase Client | LOW | Architecture |

**Critical/High: 4** | **Medium: 5** | **Low: 6**
