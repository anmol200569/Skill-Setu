# Skill Setu — Codebase Audit Corrections & Technical Clarifications

**Document Version:** 1.0.0  
**Context:** Verification and corrections to platform architecture, SDK versions, test mechanics, and state persistence based on direct codebase auditing.

---

### 1. Google Gemini SDK & API Clarifications
* **Active SDK vs. Residual Dependency:**
  * The codebase exclusively invokes the official `@google/genai` (v2.28.0) SDK via `new GoogleGenAI({ apiKey })`.
  * The older `@google/generative-ai` (v0.21.0) was previously listed in `package.json` as a legacy entry; it has been identified as completely unused across all application source code and removed.
* **Configured Model & Thinking Configuration:**
  * The production model is configured as `gemini-3.8-flash`.
  * **Critical API Observation:** Live API evaluation confirms that `gemini-3.8-flash` **rejects** `thinkingLevel: 'MINIMAL'` with HTTP 400 (`"Thinking level MINIMAL is not supported for this model. Please retry with other thinking level."`).
  * The supported and validated configuration in code is `thinkingLevel: 'LOW'`, which generates valid structured JSON quizzes in ~10 seconds while passing strict Zod validation (`aiGeneratedQuizOutputSchema`).
  * The default inference timeout for quiz generation is set to $\ge 45,000\text{ ms}$ (overridable via `GEMINI_TIMEOUT_MS`).

---

### 2. Automated Test Execution Mechanics
* **Deterministic Fixtures:**
  * Vitest suites (`apps/api/tests/` and `apps/web/src/tests/`) run in offline isolation (`NODE_ENV=test`, `VITEST=true`).
  * Live external network calls to Google AI Studio and Supabase Auth are intentionally mocked with deterministic fixtures and recognized mock tokens (`test-admin-token`, `test-learner-token`, `test-trainer-token`).
  * This guarantees repeatable, zero-cost CI validation and eliminates rate-limiting flakiness during automated builds.

---

### 3. In-Memory Caches & Rate Limiters in Serverless Deployments
* **Process Memory Storage:**
  * In-memory `Map` instances are utilized for:
    1. Short-lived authentication token cache (`authCache` in `middleware/auth.ts`, 60-second TTL).
    2. Strategic gap analysis summary cache (`summaryCache` in `gapAnalysisEngine.ts`, 24-hour TTL with MD5 state hashing).
    3. Sliding-window rate limiters (`generalRateLimiter` at 100 req/min, `aiRateLimiter` at 10 req/min in `middleware/rateLimiter.ts`).
* **Vercel / Multi-Instance Limitation:**
  * In serverless hosting environments (e.g. Vercel Serverless Functions where instances spin down or execute concurrently across multiple isolated containers) or horizontally autoscaled containers, process memory is not shared across instances.
  * While this is lightweight and zero-dependency for single-instance hosting and local development, high-scale production deployments require an external distributed cache (such as Upstash Redis or AWS ElastiCache) for unified rate enforcement and shared cache invalidation.

---

### 4. Diagnostic Question Bank Size
* **Initial State:**
  * The initial baseline seed data (`apps/api/prisma/seedData.ts`) contained only 1 diagnostic question per skill (22 diagnostic questions in total across all 7 domains).
* **Target Revision (Phase 2):**
  * Expanding the diagnostic repository to 10 verified, pre-computed diagnostic questions per skill (220 questions total covering beginner, intermediate, and advanced levels, single-choice and multi-choice, with explanations).
  * Diagnostics are served from the database without invoking live LLM calls during assessment sessions to guarantee immediate response times and zero user-facing latency.

---

### 5. Role Defaulting & Security Hardening
* **No Default Target Role:**
  * Previously, gap analysis defaulted to the first role found in the database (`Full-Stack Developer`) if the learner had not chosen a role.
  * Corrected behavior: If a user has no target role selected, the system returns an explicit `status: "not_started"` state with `null` readiness (no numbers computed), prompting the user to select a career role in their profile.
* **Administrator Promotion Security:**
  * The insecure `/auth/bootstrap-admin` endpoint has been removed.
  * Promotion to `admin` for `INITIAL_ADMIN_EMAIL` requires a verified email (`supabaseUser.email_confirmed_at`).
  * In `NODE_ENV=production`, missing or placeholder Supabase credentials fail fast with clear fatal startup errors.
  * CORS in production strictly allows only `config.corsOrigin` and the exact Vercel production domain, rejecting wildcard `.vercel.app` subdomains.
