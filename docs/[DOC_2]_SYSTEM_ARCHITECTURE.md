
# **\[DOC\_2\] EVIDENS System Architecture**

**Version: 1.2**  
 **Date: June 16, 2025**

**Purpose — This document is the canonical, high‑level technical blueprint for the entire EVIDENS ecosystem.**  
 **It defines the permanent boundaries between the Front‑End applications and the Supabase‑native Back‑End, the communication contracts between those layers, and the mandatory technology choices.**  
 **Every architectural or implementation decision must be traceable back to the rules in this document.**

---

**\#\# 1.0 Overview · The Decoupled Architecture**

**graph TD**

  **subgraph "Frontend Applications"**

      **A\[Main Application (Next.js)\]**

      **B\[Admin Application (Next.js) – hosts the \*\*Visual Composition Engine\*\*\]**

  **end**

  **subgraph "Backend (Supabase Platform)"**

      **C\[Supabase Auth\]**

      **D\[Supabase Database (PostgreSQL \+ RLS)\]**

      **E\[Supabase Edge Functions\]**

      **F\[Supabase Storage\]**

  **end**

  **A \--\>|"supabase‑js SDK"| C**

  **A \--\>|"supabase‑js SDK"| D**

  **A \--\>|"supabase‑js SDK"| E**

  **A \--\>|"supabase‑js SDK"| F**

  **B \--\>|"supabase‑js SDK"| C**

  **B \--\>|"supabase‑js SDK"| D**

  **B \--\>|"supabase‑js SDK"| E**

  **B \--\>|"supabase‑js SDK"| F**

**\#\#\# 1.1 Applications**

* **Main Application (`app.evidens.com.br`) — User‑facing. Optimised for content consumption, discovery and community.**

* **Admin Application (`admin.evidens.com.br`) — Secure, staff‑only. Hosts the Visual Composition Engine (VCE), user & tag managers, analytics, etc.**

**\#\#\# 1.2 Data Contract Between Apps**

* **Both apps read/write the same Postgres cluster via Supabase.**

* **Reviews.structured\_content now stores a page schema (v2.0). It contains:**

  * **`nodes[]` — semantic content blocks.**

  * **`layouts.desktop[]` \+ `layouts.mobile[]` — responsive positional metadata.**

* **The Main App's `LayoutAwareRenderer` consumes this schema; the Admin App's VCE produces it.**

---

**\#\# 2.0 Backend · Supabase‑Native Stack**

**\#\#\# 2.1 Database (PostgreSQL)**

* **Full DDL is in \[DOC\_3\] DATABASE\_SCHEMA.md.**

* **Rule — Business logic that spans multiple tables must not be hidden in complex views/triggers; implement it in Edge Functions.**

**\#\#\# 2.2 Authentication**

* **Technology — Supabase Auth only. `next-auth` is forbidden.**

* **JWT is the single source of truth for identity & role (`role`, `subscription_tier`).**

**\#\#\# 2.3 Cross-Origin Resource Sharing (CORS) Policy**

* **Architectural Requirement: All Supabase Edge Functions MUST manually implement CORS handling logic within their code. This involves responding to `OPTIONS` preflight requests and adding `Access-Control-Allow-Origin` headers to all responses. This is a non-negotiable security and functionality requirement.**

* **Note: As of 2025, Supabase no longer provides dashboard-based CORS configuration. All CORS handling must be implemented at the function level.**

**\#\#\# 2.4 API Layer (Dual Strategy)**

| Layer | When To Use | Transport |
| ----- | ----- | ----- |
| **Auto‑generated REST** | **Simple CRUD gated only by RLS** | **HTTPS (supabase-js)** |
| **Edge Functions** | **Multi‑step, transactional or privileged logic** | **HTTPS (supabase-js → `/functions/v1/...`)** |

*   
  **Detailed contracts live in \[DOC\_5\] API\_CONTRACT.md.**

**\#\#\# 2.5 File Storage**

* **All binaries (avatars, cover images) → Supabase Storage. Paths are stored in DB; access controlled by Storage RLS.**

---

**\#\# 3.0 Frontend · Applications & Data Strategy**

**\#\#\# 3.1 Main Application**

* **Next.js (App Router). Uses SSR/SSG for SEO‑critical pages (Reviews), CSR elsewhere.**

* **Data layer: React Query custom hooks (`useXQuery`). UI components never call `supabase.from()` directly.**

* **Mobile adaptation strictly follows \[DOC\_8\] MOBILE\_ADAPTATION.md.**

**\#\#\# 3.2 Admin Application**

* **SPA (Next.js Pages Router). Auth‑guarded at the layout level.**

* **Hosts the Visual Composition Engine — a React Flow \+ dnd‑kit canvas for free‑form page authoring.**

* **Other admin tools (User manager, Tag tree, Analytics dashboard) live here.**

**\#\#\# 3.3 Data‑Fetching Mandate**

* **All server state in both apps travels through React Query hooks; see \[DOC\_6\] DATA\_FETCHING\_STRATEGY.md for the mandatory pattern.**

* **Query deduplication, cache, background revalidation are handled by React Query.**

---

**\#\# 4.0 Server‑Side & Asynchronous Processes**

**\#\#\# 4.1 Cron Jobs**

* **Implemented as scheduled Edge Functions.**

* **Examples: analytics ETL, "Próxima Edição" scheduler, subscription‑billing sync (future).**

**\#\#\# 4.2 Analytics Pipeline**

1. **Ingest — `/functions/v1/log-event` (fast write to `Analytics_Events`).**

2. **Aggregate — `run-analytics-etl` cron populates `Summary_*` tables.**

3. **Serve — Admin App dashboards read from summaries.**

---

**\#\# 5.0 Security & Compliance Highlights**

* **RLS first — Every table has `SELECT`/`INSERT`/`UPDATE`/`DELETE` policies.**

* **API keys: public (`anon`) for browsers, `service_role` only in Edge Functions.**

* **Access levels enforced by RLS & middleware: unauth, free, paying, admin.**

---

***End of \[DOC\_2\] EVIDENS System Architecture***
