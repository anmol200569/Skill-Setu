# Vercel & Supabase Production Deployment Checklist

This document provides a step-by-step checklist for configuring and verifying Skill Setu in production on Vercel and Supabase.

---

## 1. Required Production Environment Variables

Configure these variables in your Vercel Project Settings under **Environment Variables** (apply to **Production** environment).

| Environment Variable | Description / Purpose | Example Placeholder |
| :--- | :--- | :--- |
| `SUPABASE_URL` | Supabase project API URL (HTTPS) | `https://your-project.supabase.co` |
| `SUPABASE_ANON_KEY` | Public / Anonymous key for client JWT verification | `eyJh...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Elevated service-role key for server administration | `eyJh...` |
| `INITIAL_ADMIN_EMAIL` | Verified email address designated for bootstrap administrator | `admin@yourdomain.com` |
| `CORS_ORIGIN` | Exact production URL(s) allowed for CORS (comma-separated if multiple, trimmed, no trailing slashes). CORS_ORIGIN must be the exact production URL — there are no hardcoded fallbacks and wildcards like `*.vercel.app` are strictly rejected. Same-origin requests are automatically permitted. | `https://your-production-app.vercel.app, https://skill-setu.org` |
| `GEMINI_API_KEY` | Google AI Studio API Key for Gemini model inference | `AIzaSy...` |
| `GEMINI_MODEL` | Gemini primary generative model name | `gemini-3.5-flash-lite` |
| `GEMINI_FALLBACK_MODEL` | Optional fallback model when primary is rate-limited / unavailable | `gemini-3.1-flash-lite` |
| `GEMINI_TIMEOUT_MS` | Max API timeout for AI generation (default 45000ms) | `45000` |
| `DATABASE_URL` | Connection-pooled PostgreSQL connection string | `postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | Direct PostgreSQL connection string for Prisma migrations | `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres` |

> **Note:** Never commit real secrets or credentials to source control.

---

## 2. Where to Click in Vercel and Supabase

### In Supabase Dashboard
1. Go to **Project Settings** (gear icon at the bottom left) -> **API**:
   - Copy **Project URL** -> use as `SUPABASE_URL`.
   - Under **Project API keys**, copy `anon` `public` key -> use as `SUPABASE_ANON_KEY`.
   - Under **Project API keys**, copy `service_role` `secret` key -> use as `SUPABASE_SERVICE_ROLE_KEY`.
2. Go to **Project Settings** -> **Database**:
   - Scroll to **Connection string**.
   - Select **URI** tab.
   - For `DATABASE_URL`: select **Transaction Pooler** (port `6543`).
   - For `DIRECT_URL`: select **Session** or **Direct** connection (port `5432`).
3. Go to **Authentication** -> **Users**:
   - Verify that the email set in `INITIAL_ADMIN_EMAIL` has a confirmed email address (`Confirmed at` timestamp present).

### In Vercel Dashboard
1. Open your project on Vercel.
2. Click on the **Settings** tab along the top navigation bar.
3. In the left sidebar, click **Environment Variables**.
4. Add each of the 10 variables listed above. Ensure the **Production** checkbox is checked for each variable.
5. Save each variable and trigger a new deployment (or redeploy the latest commit) for changes to take effect.

---

## 3. Post-Deployment Verification (4 Live Checks)

Perform these 4 checks immediately after deployment to ensure system integrity:

### Check 1: User Login & Session Verification
- Open your production URL (`https://your-production-app.vercel.app`).
- Sign in with an onboarded user account via Supabase Auth.
- Verify that authentication succeeds, tokens are securely stored, and the learner dashboard loads without redirection loops.

### Check 2: Confirm `/auth/bootstrap-admin` is Removed (HTTP 404)
- Send a `POST` request to the legacy bootstrap route:
  ```bash
  curl -X POST https://your-api.vercel.app/api/v1/auth/bootstrap-admin \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com"}'
  ```
- **Expected Result:** HTTP `404 Not Found`. This confirms the bootstrap endpoint has been permanently decommissioned.

### Check 3: Confirm Test Token Bypass is Inactive in Production (HTTP 401)
- Send a request to any protected endpoint using the development bypass token:
  ```bash
  curl -i https://your-api.vercel.app/api/v1/profile \
    -H "Authorization: Bearer test-admin-token"
  ```
- **Expected Result:** HTTP `401 Unauthorized`. The development test tokens must be completely disabled in production.

### Check 4: AI Assessment & Quiz Generation Timing
- Initiate a diagnostic skill assessment or quiz on the platform (5 questions).
- Verify that questions generate and render reliably within the configured timeout window (`GEMINI_TIMEOUT_MS=45000`).
- Ensure no gateway timeouts (HTTP 504) or unhandled promise rejections occur.
