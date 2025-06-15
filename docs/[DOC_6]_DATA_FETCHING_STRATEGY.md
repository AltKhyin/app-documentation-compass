# **\[DOC\_6\] Data-Fetching Strategy**

Version: 1.0  
Date: June 14, 2025  
Purpose: This document defines the canonical, non-negotiable strategy for all data fetching and server state management within the EVIDENS front-end applications (both Main and Admin). Its primary purpose is to prevent inefficient, redundant API calls and to ensure a consistently performant user experience. The AI developer must adhere to these rules without exception.

## **1.0 Core Principles**

* **PRINCIPLE 1 (Preventing "Chatty APIs"):** The architecture is designed to de-duplicate all data requests by default. A request for a specific resource (e.g., a specific Review) should only be made over the network once per page load, even if multiple components require that same resource.  
* **PRINCIPLE 2 (Separation of Concerns):** UI components are responsible for presentation only. They must be completely decoupled from the logic of how data is fetched. All data-fetching logic must reside in a dedicated data access layer (custom hooks).  
* **PRINCIPLE 3 (Server State vs. Client State):** A clear distinction must be maintained:  
  * **Server State:** Any data that persists on the backend (in our PostgreSQL database). This is asynchronous data. **It MUST be managed by TanStack Query.**  
  * **Client State:** Ephemeral state that lives only in the UI (e.g., the current state of a form input, whether a modal is open). **It SHOULD be managed by simple React hooks (useState, useReducer) or a lightweight client state manager like Zustand.**

## **2.0 The Mandatory Technology Stack**

* **RULE 1 (Server State Management):** **TanStack Query (v5) (@tanstack/react-query)** is the mandatory and sole library for managing all server state.  
* **RULE 2 (Data Fetching):** The **supabase-js** client library is the mandatory tool for making requests to the Supabase backend.

## **3.0 The Golden Rule: The Data-Fetching Mandate**

**RULE 3 (The Golden Rule): UI components MUST NOT call the supabase-js client directly.** All data access must be mediated through a dedicated custom hook that uses TanStack Query.

This is the most critical rule in this document. Adherence is not optional.

## **4.0 The Mandatory Implementation Patterns**

This section provides the precise, copy-pasteable patterns that the AI developer must follow.

### **4.1 Pattern for Reading Data (useQuery)**

This pattern is used for all SELECT operations.

* **Step 1:** Create a custom hook encapsulating the query logic. The hook's name must be prefixed with use and suffixed with Query (e.g., useReviewsQuery).  
* **Step 2:** Inside the hook, use useQuery from TanStack Query.  
* **Step 3:** The actual supabase-js call is made *only* inside the queryFn passed to useQuery.

**Reference Implementation:**

// FILE: /hooks/queries/useReviewQuery.ts

import { useQuery } from '@tanstack/react-query';  
import { supabase } from '../lib/supabaseClient'; // The configured Supabase client instance

/\*\*  
 \* Fetches a single review by its ID.  
 \* This function contains the actual data-fetching logic. It is not exported.  
 \* @param reviewId The ID of the review to fetch.  
 \*/  
const fetchReviewById \= async (reviewId: number) \=\> {  
  // RULE: The Supabase query is isolated here.  
  const { data, error } \= await supabase  
    .from('Reviews')  
    .select('\*') // Select all columns for the review  
    .eq('review\_id', reviewId)  
    .single(); // Expect only one result

  // RULE: Always handle potential errors and throw them.  
  if (error) {  
    throw new Error(error.message);  
  }

  return data;  
};

/\*\*  
 \* Custom hook for fetching a single EVIDENS Review.  
 \* UI components will use this hook to get review data.  
 \* It handles caching, re-fetching, and other server state logic via TanStack Query.  
 \* @param reviewId The ID of the review to fetch.  
 \*/  
export const useReviewQuery \= (reviewId: number) \=\> {  
  return useQuery({  
    // queryKey is an array that uniquely identifies this query in the cache.  
    // It includes the resource name and its unique identifier.  
    queryKey: \['reviews', reviewId\],  
    // queryFn is the function that will be called to fetch the data.  
    // TanStack Query automatically passes the queryKey to the function.  
    queryFn: () \=\> fetchReviewById(reviewId),  
    // enabled: false prevents the query from running automatically if reviewId is not yet available.  
    enabled: \!\!reviewId,  
  });  
};

### **4.2 Pattern for Creating/Updating/Deleting Data (useMutation)**

This pattern is used for all INSERT, UPDATE, and DELETE operations, or for calls to Edge Functions.

* **Step 1:** Use the useMutation hook from TanStack Query.  
* **Step 2:** On success, **invalidate** the relevant cached queries to ensure the UI automatically re-fetches fresh data.

**Reference Implementation:**

// FILE: /hooks/mutations/useCreatePostMutation.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';  
import { supabase } from '../lib/supabaseClient'; // The configured Supabase client instance  
import { type CreatePostPayload } from '../types'; // Assuming a type definition for the payload

/\*\*  
 \* The mutation function that calls our custom Supabase Edge Function.  
 \* @param postPayload The data needed to create the post.  
 \*/  
const createPost \= async (postPayload: CreatePostPayload) \=\> {  
  // RULE: Calls to Edge Functions are also managed by TanStack Query.  
  const { data, error } \= await supabase.functions.invoke('create-community-post', {  
    body: postPayload,  
  });

  if (error) {  
    throw new Error(error.message);  
  }

  return data;  
};

/\*\*  
 \* Custom hook for creating a new community post.  
 \* UI components will use this to trigger the post creation action.  
 \*/  
export const useCreatePostMutation \= () \=\> {  
  const queryClient \= useQueryClient();

  return useMutation({  
    mutationFn: createPost,  
    // RULE: On success, invalidate queries that are now stale.  
    onSuccess: (data) \=\> {  
      // This tells TanStack Query to re-fetch the main community feed  
      // because new content has been added.  
      queryClient.invalidateQueries({ queryKey: \['communityPosts'\] });  
        
      // We can also intelligently update the cache without a refetch  
      // using the returned data if desired.  
    },  
    onError: (error) \=\> {  
      // Handle and log the error, e.g., show a toast notification.  
      console.error('Failed to create post:', error);  
    },  
  });  
};

### **4.3 Pattern for Paginated/Infinite Data (useInfiniteQuery)**

This pattern is mandatory for feeds like the /community page to avoid loading all data at once.

* **Implementation:** Use the useInfiniteQuery hook. The queryFn will receive a pageParam which will be used with Supabase's .range() method to fetch data in pages.

## **5.0 Final Checklist for AI Developer**

**RULE:** Before committing code that involves data fetching, verify the following:

* \[ \] Is all server state managed by **TanStack Query**?  
* \[ \] Does the code avoid calling supabase-js directly from within a UI component?  
* \[ \] Is data-fetching logic properly encapsulated within a custom use...Query or use...Mutation hook?  
* \[ \] Do mutations correctly invalidate relevant queries in their onSuccess callback to keep the UI synchronized?  
* \[ \] Are infinite feeds implemented using useInfiniteQuery?