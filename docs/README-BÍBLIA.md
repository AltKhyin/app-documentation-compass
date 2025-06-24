# EVIDENS AI Development Bible v6.0

**Version:** 6.0.2 (Canon - Architectural Consistency Fix)
**Date:** June 24, 2025
**Purpose:** This document contains the complete, authoritative, and machine-optimized set of rules, architectural models, and implementation directives for the EVIDENS project.

---

## CRITICAL UPDATES v6.0.2

### 🔧 Architectural Consistency Achieved
- **RESOLVED**: Analytics dashboard function standardized to proven simplified pattern
- **STANDARDIZED**: All admin Edge Functions now use consistent, reliable implementation
- **SIMPLIFIED**: Removed complex shared utilities that were causing parameter passing errors
- **VERIFIED**: All admin functions now operational with identical patterns

---

## INDEX

*   [PART 1: PROJECT SETUP & WORKFLOW](#part-1-project-setup--workflow)
    *   [P1.1 — Development Environment Setup](#p11--development-environment-setup)
    *   [P1.2 — Version Control & Branching](#p12--version-control--branching)
    *   [P1.3 — Pre-Flight Checklist (Mandatory)](#p13--pre-flight-checklist-mandatory)
    *   [P1.4 — Conflict Resolution Protocol](#p14--conflict-resolution-protocol)
*   [PART 2: CANONICAL MODELS (THE PROJECT'S REALITY)](#part-2-canonical-models-the-projects-reality)
    *   [M2.1 — The Authentication Model](#m21--the-authentication-model)
    *   [M2.2 — The Data Model](#m22--the-data-model)
    *   [M2.3 — The Component Model](#m23--the-component-model)
    *   [M2.4 — The Directory Structure Model](#m24--the-directory-structure-model)

## PART 3: IMPLEMENTATION DIRECTIVES (CODING ALGORITHMS) - UPDATED v6.0.2

### [D3.5] — Security, API, & Edge Functions - UPDATED v6.0.2

*   **SEC.1 (RLS is Firewall):** All data access is governed by database-level RLS policies. Any new feature requiring data access **MUST** be accompanied by a corresponding migration file that defines its RLS policies. (Source: `[DOC_4]`)
*   **SEC.2 (JWT Claims):** Authorization logic **MUST** rely on JWT custom claims (`role`, `subscription_tier`). Functions that alter a user's role **MUST** also call `supabase.auth.admin.updateUserById()` to update these claims in the token.
*   **SEC.3 (Edge Function Pattern) - SIMPLIFIED CANONICAL PATTERN:** Every Edge Function **MUST** implement the following proven pattern:
    1.  **CORS Preflight**: Handle OPTIONS requests with corsHeaders
    2.  **Client Creation**: Create Supabase client with service role
    3.  **Authentication**: Verify JWT and extract user
    4.  **Authorization**: Check user role against requirements
    5.  **Business Logic**: Execute the core function logic
    6.  **Response**: Return structured response with CORS headers
*   **SEC.4 (Consistency Requirement):** All Edge Functions **MUST** use the same self-contained pattern for reliability and maintainability.

---

## CURRENT IMPLEMENTATION STATUS v6.0.2

### ✅ PHASE 1: INFRASTRUCTURE REPAIR & STANDARDIZATION - COMPLETED
- **Rate Limiting Architecture**: ✅ Simplified and standardized
- **Edge Function Pattern**: ✅ Consistent proven pattern applied to all admin functions
- **Admin Functions**: ✅ All operational with identical, reliable implementation
- **Analytics Dashboard**: ✅ Fixed and standardized to match other working functions
- **Architectural Consistency**: ✅ No more competing patterns - single reliable approach

### 🔄 PHASE 2: THEME COMPLIANCE & VISUAL STANDARDIZATION - READY
- **Admin Components Theme Compliance**: Ready to start
- **Component Audit & Fixes**: Pending theme application

### 🔄 PHASE 3: 08B COMPONENT IMPLEMENTATION - READY
- **User Management Interface**: Backend ready, frontend pending
- **Analytics Dashboard**: Backend operational, frontend ready
- **Tag Management System**: Architecture ready
- **Advanced Moderation Tools**: Foundation complete

---

## CRITICAL ARCHITECTURE COMPLIANCE STATUS v6.0.2

### ✅ FULLY COMPLIANT
- [D3.4] Data Access Layer - All admin functions use proper hooks
- [D3.5] Security & API - Simplified, consistent pattern enforced universally
- [SEC.3] Edge Function Pattern - Single proven pattern applied to all functions
- [DOC_5] API Contract - All Edge Functions follow identical structure
- [P1.3] Pre-Flight Checklist - Complete verification implemented

### 🔄 PARTIALLY COMPLIANT  
- [DOC_7] Visual System - Admin components need theme fixes (next priority)
- [D3.2] Component Architecture - Some admin components need refactoring

### ❌ NON-COMPLIANT
- None identified (all critical violations resolved in v6.0.2)

---

## TECHNICAL DEBT STATUS v6.0.2

### ✅ RESOLVED
- **CRITICAL**: Edge Function pattern inconsistency - Standardized to single reliable approach
- **CRITICAL**: Analytics dashboard errors - Fixed with proven simplified pattern
- **CRITICAL**: Parameter passing errors in shared utilities - Eliminated by removing abstractions
- **CRITICAL**: Architectural competing patterns - Single pattern now used universally
- **HIGH**: Complex rate limiting abstractions - Simplified to direct implementation

### 🔄 REMAINING
- **MEDIUM**: Admin component theme compliance needed
- **LOW**: Some component prop type standardization pending

---

## NEXT IMMEDIATE ACTIONS v6.0.2

1. **✅ Verify Infrastructure**: All admin functions now operational with consistent pattern
2. **🔄 Begin Task 2.1**: Apply [DOC_7] theme compliance to admin components  
3. **🔄 Proceed systematically** through 08b component implementation

---

**Last Updated**: June 24, 2025 - v6.0.2  
**Next Review**: After Phase 2 initiation and theme compliance verification

---

## IMPLEMENTATION PROGRESS FLOWCHART v6.0.2

```
PHASE 1: INFRASTRUCTURE REPAIR ✅ COMPLETED
├── Task 1.1: Rate Limiting Infrastructure ✅
├── Task 1.2: Edge Functions Standardization ✅  
├── Task 1.3: Admin Functions Completion ✅
└── Task 1.4: Architectural Consistency Fix ✅ NEW
    ├── Standardized Analytics Function ✅
    ├── Removed Complex Abstractions ✅
    ├── Applied Single Proven Pattern ✅
    └── All Admin Functions Verified Operational ✅

PHASE 2: THEME COMPLIANCE (CURRENT FOCUS)
├── Task 2.1: Admin Components Theme Fixes (READY)
└── Task 2.2: Component Standards Audit (READY)

PHASE 3: 08B IMPLEMENTATION (READY)
├── Task 3.1: User Management Interface (READY)
├── Task 3.2: Analytics Dashboard (READY)
├── Task 3.3: Tag Management System (READY)
└── Task 3.4: Advanced Moderation Tools (READY)
```

---

**✅ Infrastructure Layer: 100% Complete**  
**🔄 Presentation Layer: Ready to Start**  
**🔄 Feature Layer: Architecture Ready**

**Overall Project Completion: ~90% Infrastructure + Backend Architecture**
