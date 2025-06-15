# ***\[DOC\_5\] EVIDENS API Contract***

***Version:** 3.1*  
 ***Date:** June 14, 2025*

***Purpose:** This document defines the canonical contract for all server‑side business logic within the EVIDENS ecosystem. It specifies when to use Supabase’s auto‑generated API and provides the definitive blueprint for all custom Supabase Edge Functions. The AI developer must adhere to this specification to ensure all backend interactions are secure, transactional, and predictable.*

---

## ***1.0 Core Principles & The Dual API Strategy***

***PRINCIPLE 1 (Default to Auto‑API):***  
 *For all simple Create, Read, Update, and Delete (CRUD) operations, the primary method of data interaction is through Supabase’s auto‑generated REST API, secured by RLS policies in \[DOC\_4\]\_ROW\_LEVEL\_SECURITY.md. Custom Edge Functions **must not** be created for these tasks.*

*Use Case: Fetching lists (e.g., reviews, user profiles), updating simple fields (e.g., biography).*  
 *Implementation: Use the `supabase-js` client directly within the data‑fetching hooks defined in \[DOC\_6\]\_DATA\_FETCHING\_STRATEGY.md.*

***PRINCIPLE 2 (Edge Functions for Business Logic):***  
 *Use Edge Functions exclusively for operations that involve complex, multi‑step, or transactional business logic beyond a single CRUD action.*

*Use Case: Casting a community vote (atomic updates across tables), creating content with side effects (auto‑upvote), publishing a review with auto‑generated discussion, processing analytics ETL.*

***PRINCIPLE 3 (Security First):***  
 *Every Edge Function must validate inputs, enforce authorization, and handle errors explicitly before executing core logic.*

***PRINCIPLE 4 (Schema‑Driven Contract):***  
 *Input and output of every Edge Function **must** be defined by Zod schemas to guarantee type safety and predictable behavior.*

---

## ***2.0 Standardized Error Response***

*All Edge Functions must return errors in the following JSON format:*

*{*

  *"error": {*

    *"message": "A human‑readable error message.",*

    *"code": "ERROR\_CODE\_ENUM" // e.g., "VALIDATION\_FAILED", "UNAUTHORIZED"*

  *}*

*}*

*This enables uniform error handling on the frontend.*

---

## ***3.0 Edge Function Specifications***

### ***3.1 Function: `upsert-review`***

* ***Trigger:** `POST /functions/v1/upsert-review`*

* ***Purpose:** Create or update a Review, validating the `structured_content` v2.0 payload.*

* ***Auth:** Required (`admin` role).*

***Request Body Schema (Zod):***

*import { z } from 'zod';*

*const Position   \= z.object({ x: z.number(), y: z.number() });*

*const Size       \= z.object({ width: z.number(), height: z.number() });*

*const LayoutItem \= z.object({ nodeId: z.string(), position: Position, size: Size });*

*const Node       \= z.object({ id: z.string(), type: z.string(), data: z.record(z.any()) });*

*const ContentV2  \= z.object({*

  *version: z.literal("2.0"),*

  *nodes:   z.array(Node),*

  *layouts: z.object({*

    *desktop: z.array(LayoutItem),*

    *mobile:  z.array(LayoutItem),*

  *}),*

  *canvasState: z.any(),*

*});*

*const UpsertReview \= z.object({*

  *reviewId:               z.number().int().optional().nullable(),*

  *source\_article\_title:   z.string().min(1),*

  *source\_article\_citation:z.string().min(1),*

  *cover\_image\_url:        z.string().url().optional().nullable(),*

  *access\_level:           z.enum(\['public','free\_users\_only','paying\_users\_only'\]),*

  *status:                 z.enum(\['draft','published'\]),*

  *structured\_content:     ContentV2,*

*});*

***Business Logic:***

1. *Validate JWT contains `admin` role; else 403\.*

2. *Validate body against `UpsertReview`; else 400\.*

3. *If `reviewId` exists, verify edit permission; else 403\.*

4. *Upsert into `Reviews` table via `supabase-js`.*

***Success Response:** `200 OK` (update) or `201 Created` (create)*

*{*

  *"review\_id": 457,*

  *"source\_article\_title": "..."*

  */\* full review object \*/*

*}*

---

### ***3.2 Function: `create-community-post`***

* ***Trigger:** `POST /functions/v1/create-community-post`*

* ***Purpose:** Create a community post/comment, auto‑upvote, update `contribution_score`, optionally create a poll.*

* ***Auth:** Required (authenticated).*

***Request Body Schema (Zod):***

*import { z } from 'zod';*

*const CreatePost \= z.object({*

  *review\_id:      z.number().int().optional().nullable(),*

  *parent\_post\_id: z.number().int().optional().nullable(),*

  *title:          z.string().min(1).optional().nullable(),*

  *content:        z.string().min(1),*

  *category:       z.string().min(1),*

  *poll: z.object({*

    *question: z.string().min(1),*

    *options:  z.array(z.string().min(1)).min(2),*

  *}).optional(),*

*});*

***Business Logic (Transactional RPC):***

1. *Extract `practitioner_id` from JWT.*

2. *Validate input; else 400\.*

3. *RPC transaction:*  
    *a. INSERT into `CommunityPosts` with `upvotes = 1`.*  
    *b. INSERT into `CommunityPost_Votes` for auto‑upvote.*  
    *c. UPDATE `Practitioners.contribution_score` \+1.*  
    *d. If `poll`, INSERT into `Polls` & `Poll_Options`.*

***Success Response:** `201 Created`*

*{ "post\_id": 123 /\* full post object \*/ }*

---

### ***3.3 Function: `cast-post-vote`***

* ***Trigger:** `POST /functions/v1/cast-post-vote`*

* ***Purpose:** Cast, change, or retract a vote; update post counters and contributor score.*

* ***Auth:** Required (authenticated).*

***Request Body Schema (Zod):***

*import { z } from 'zod';*

*const CastVote \= z.object({*

  *post\_id:   z.number().int(),*

  *vote\_type: z.enum(\['up','down','none'\]),*

*});*

***Business Logic (Transactional RPC):***

1. *Validate input; else 400\.*

2. *RPC transaction:*  
    *a. UPSERT/DELETE in `CommunityPost_Votes`.*  
    *b. UPDATE `CommunityPosts.upvotes / downvotes`.*  
    *c. UPDATE author’s `contribution_score` by delta.*

***Success Response:** `200 OK`*

*{ "post\_id": 123, "new\_upvotes": 5, "new\_downvotes": 1 }*

---

### ***3.4 Function: `publish-review`***

* ***Trigger:** `POST /functions/v1/publish-review`*

* ***Purpose:** Mark Review as `published` and auto‑create discussion post.*

* ***Auth:** Required (`admin` role).*

***Request Body Schema (Zod):***

*import { z } from 'zod';*

*const PublishReview \= z.object({ review\_id: z.number().int() });*

***Business Logic (Transactional):***

1. *Verify `admin` role; else 403\.*

2. *Validate input; else 400\.*

3. *Transaction:*  
    *a. UPDATE `Reviews.status` to `published`.*  
    *b. FETCH `Review.title`.*  
    *c. INSERT into `CommunityPosts` with title `Discussão: [Review Title]`.*

***Success Response:** `200 OK`*

*{*

  *"message": "Review published and discussion created successfully.",*

  *"review\_id": 456,*

  *"community\_post\_id": 789*

*}*

---

### ***3.5 Cron Function: `run-analytics-etl`***

* ***Trigger:** Scheduled (e.g., hourly) via Supabase Cron.*

* ***Purpose:** Process `Analytics_Events` into `Summary_*` tables.*

* ***Auth:** Runs with `service_role`.*

***Business Logic:***

1. *Determine last‑processed timestamp.*

2. *SELECT new events since then.*

3. *Aggregate counts (DAU, page views).*

4. *UPSERT into `Summary_*` tables.*

5. *Record new last‑processed timestamp.*

---

*End of \[DOC\_5\] EVIDENS API Contract*

