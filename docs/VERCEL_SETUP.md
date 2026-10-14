# Vercel & Supabase Production Deployment Checklist

This document provides a step-by-step checklist for configuring and verifying Skill Setu in production on Vercel and Supabase.

---

## 1. Production Environment Variables

Configure these variables in your Vercel Project Settings under **Environment Variables** (apply to **Production** environment).

### A. Hard-Enforced Variables (Process Crash on Startup)
If any of these 4 variables are missing or set to placeholder values, `apps/api/src/config/index.ts` immediately throws a `FATAL` error and crashes the serverless process at boot:

| Environment Variable | Enforcement | Description / Purpose | Example Placeholder |
| :--- | :--- | :--- | :--- |
| `SUPABASE_URL` | **Hard (Fatal)** | Supabase project API URL (HTTPS) | `https://your-project.supabase.co` |
| `SUPABASE_ANON_KEY` | **Hard (Fatal)** | Public / Anonymous key for client JWT verification | `eyJh...` |
| `SUPABASE_SERVICE_ROLE_KEY` | **Hard (Fatal)** | Elevated service-role key for server administration | `eyJh...` |
| `INITIAL_ADMIN_EMAIL` | **Hard (Fatal)** | Verified email address designated for bootstrap administrator | `admin@yourdomain.com` |

### B. Soft-Enforced Variables (Runtime Functionality with Fallbacks)
The server boots if these are omitted, but core features fail at runtime or default to fallbacks:

| Environment Variable | Enforcement | Description / Purpose | Example Placeholder / Default |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | **Soft at boot, required at runtime** | Connection-pooled PostgreSQL connection string (Transaction Pooler port 6543) | `postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | **Soft at boot, required for seeds/migrations** | Direct PostgreSQL connection string (Session/Direct port 5432) | `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres` |
| `CORS_ORIGIN` | **Soft** (defaults to `http://localhost:5173`) | Exact production URL(s) allowed for CORS (comma-separated if multiple, trimmed, no trailing slashes). Wildcards like `*.vercel.app` are rejected. | `https://your-production-app.vercel.app, https://skill-setu.org` |
| `GEMINI_API_KEY` | **Soft at boot, required for AI** | Google AI Studio API Key for Gemini inference (fails with 500 if missing when invoking AI) | `AIzaSy...` |
| `GEMINI_MODEL` | **Soft** (defaults to `gemini-3.5-flash-lite`) | Gemini primary generative model name | `gemini-3.5-flash-lite` |
| `GEMINI_FALLBACK_MODEL` | **Soft** (defaults to `gemini-3.1-flash-lite`) | Fallback model when primary is rate-limited (429) or unavailable (503) | `gemini-3.1-flash-lite` |
| `GEMINI_TIMEOUT_MS` | **Soft** (defaults to `45000`) | Max API timeout for AI generation (shared total budget for quiz generation is capped at 55s) | `45000` |
| `SUPABASE_JWT_SECRET` | **Optional** (defaults to `''`) | Supabase JWT Secret. Code reads `config.supabase.jwtSecret`, but the auth middleware verifies tokens directly via Supabase Auth API (`supabaseAuth.auth.getUser`), so local secret validation is not actively executed. | `your-supabase-jwt-secret` |

> **Note:** Never commit real secrets or credentials to source control.

---

## 2. Where to Click in Vercel and Supabase

### In Supabase Dashboard
1. Go to **Project Settings** (gear icon at the bottom left) -> **API**:
   - Copy **Project URL** -> use as `SUPABASE_URL`.
   - Under **Project API keys**, copy `anon` `public` key -> use as `SUPABASE_ANON_KEY`.
   - Under **Project API keys**, copy `service_role` `secret` key -> use as `SUPABASE_SERVICE_ROLE_KEY`.
   - Under **JWT Settings**, copy **JWT Secret** -> optional `SUPABASE_JWT_SECRET`.
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
4. Add the production variables listed above. Ensure the **Production** checkbox is checked for each variable.
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
