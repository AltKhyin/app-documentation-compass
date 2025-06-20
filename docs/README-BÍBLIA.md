
# **EVIDENS Platform - Architectural Stabilization Plan**

**Version:** 6.0 (Stabilization Update)  
**Date:** June 20, 2025  
**Purpose:** Complete architectural documentation and implementation roadmap for shell independence and sustainable development patterns.

---

## **🎯 STRATEGIC OBJECTIVE**

Restore the EVIDENS application shell architecture to ensure persistent, stable navigation while establishing sustainable development patterns that prevent architectural drift and enable effective AI-assisted development.

## **🔍 CURRENT STATE ANALYSIS**

### **Critical Issues Identified**
1. **Shell-Data Coupling Crisis:** AppShell depends on homepage data, causing navigation disappearance
2. **Architectural Drift:** 10+ rounds of band-aid fixes violating core blueprints
3. **Scope Creep:** Global data providers used for page-specific functionality
4. **Error Propagation:** Page-level failures cascade to shell-level failures

### **User Experience Impact**
- ❌ Sidebar disappears during page loads
- ❌ Header missing on desktop views  
- ❌ Navigation instability across route changes
- ❌ Inconsistent loading states

---

## **🏗️ ARCHITECTURAL STABILIZATION PLAN**

### **PHASE 1: SHELL INDEPENDENCE RESTORATION**
**Objective:** Decouple shell rendering from data dependencies
**Timeline:** Week 1 (Critical Priority)
**Governing Directives:** [M2.2], [D3.2], [DAL.1]

#### **Task 1.1: AppShell Decoupling**
**Objective:** Remove `useAppData()` dependency from AppShell component
**Files to Modify:**
- `src/components/shell/AppShell.tsx`
- `src/contexts/AppDataContext.tsx`

**Technical Specification:**
1. Extract `useAppData()` call from AppShell.tsx
2. Replace data-dependent loading state with shell-only skeleton
3. Ensure shell renders immediately regardless of data state
4. Move loading logic to individual page components
5. Implement shell-specific error boundary

**Verification Criteria:**
- [ ] AppShell renders without data dependencies
- [ ] Sidebar persists across all route changes
- [ ] Header displays consistently on desktop and mobile
- [ ] Shell skeleton appears instantly on load

#### **Task 1.2: Independent Shell Components**
**Objective:** Create self-contained shell components with isolated data fetching
**Files to Modify:**
- `src/components/shell/UserProfileBlock.tsx`
- `src/components/shell/NotificationBell.tsx`
- `packages/hooks/useUserProfileQuery.ts` (create)
- `packages/hooks/useNotificationCountQuery.ts` (create)

**Technical Specification:**
1. Create `useUserProfileQuery()` hook for user data
2. Create `useNotificationCountQuery()` hook for notification count
3. Implement component-level loading states
4. Add error handling within each component
5. Ensure graceful degradation on data failures

**Verification Criteria:**
- [ ] UserProfileBlock loads independently
- [ ] NotificationBell shows count without global dependency
- [ ] Components handle their own loading/error states
- [ ] Shell remains functional during component data failures

### **PHASE 2: DATA PROVIDER RESTRUCTURING**
**Objective:** Eliminate global data providers and establish page-specific data patterns
**Timeline:** Week 2 (High Priority)
**Governing Directives:** [D3.3], [DAL.2], [DAL.3]

#### **Task 2.1: Remove Global AppDataProvider**
**Objective:** Extract AppDataProvider from global scope
**Files to Modify:**
- `src/components/providers/AppProviders.tsx`
- `src/pages/Index.tsx`
- `src/contexts/AppDataContext.tsx`

**Technical Specification:**
1. Remove `<AppDataProvider>` from AppProviders.tsx
2. Scope AppDataProvider to homepage usage only
3. Wrap only Index.tsx with AppDataProvider
4. Update import statements and dependencies
5. Verify other pages function without global data

**Verification Criteria:**
- [ ] AppDataProvider only wraps homepage
- [ ] Community, Acervo, Profile pages load independently
- [ ] No global data queries on non-homepage routes
- [ ] Route-specific data loading patterns established

#### **Task 2.2: Page-Specific Data Architecture**
**Objective:** Implement isolated data fetching per page
**Files to Create:**
- `src/contexts/CommunityDataContext.tsx`
- `src/contexts/AcervoDataContext.tsx`
- `packages/hooks/useCommunityShellData.ts`

**Technical Specification:**
1. Create page-specific data contexts
2. Implement route-aware data loading
3. Add progressive loading states
4. Establish data invalidation patterns
5. Optimize query key strategies

**Verification Criteria:**
- [ ] Each page manages its own data
- [ ] No cross-page data dependencies
- [ ] Optimized loading sequences
- [ ] Clear data boundaries between pages

### **PHASE 3: ERROR HANDLING STANDARDIZATION**
**Objective:** Implement layered error boundaries with progressive recovery
**Timeline:** Week 3 (Medium Priority)
**Governing Directives:** [P1.2], [SEC.3]

#### **Task 3.1: Three-Tier Error Boundary System**
**Objective:** Protect navigation, content, and features with isolated error scopes
**Files to Create:**
- `src/components/error-boundaries/ShellErrorBoundary.tsx`
- `src/components/error-boundaries/PageErrorBoundary.tsx`
- `src/components/error-boundaries/ComponentErrorBoundary.tsx`

**Technical Specification:**
1. **Shell-Level:** Protect navigation and core shell functionality
2. **Page-Level:** Isolate page content failures from shell
3. **Component-Level:** Contain feature-specific errors
4. Implement error reporting and recovery mechanisms
5. Add context-aware error messages

**Verification Criteria:**
- [ ] Navigation never disappears due to content errors
- [ ] Page failures don't affect shell functionality
- [ ] Component errors are isolated and recoverable
- [ ] Clear error reporting and user feedback

#### **Task 3.2: Smart Error Recovery**
**Objective:** Implement progressive error recovery with retry mechanisms
**Files to Modify:**
- All error boundary components
- Key data fetching hooks

**Technical Specification:**
1. Network-aware error handling
2. Exponential backoff retry strategies
3. Context-specific error messages
4. Graceful degradation patterns
5. User-initiated recovery actions

**Verification Criteria:**
- [ ] Automatic retry on network failures
- [ ] Clear user feedback during errors
- [ ] Recovery actions work as expected
- [ ] Graceful degradation maintains core functionality

### **PHASE 4: PERFORMANCE OPTIMIZATION**
**Objective:** Optimize loading sequences and eliminate unnecessary API calls
**Timeline:** Week 4 (Low Priority)
**Governing Directives:** [AD.4], [D3.4]

#### **Task 4.1: Route-Specific Data Loading**
**Objective:** Eliminate unnecessary API calls based on current route
**Files to Modify:**
- All page components
- Data fetching hooks
- Route configuration

**Technical Specification:**
1. Implement route-aware data loading
2. Add data prefetching for common paths
3. Optimize query invalidation strategies
4. Cache management improvements
5. Progressive data loading patterns

**Verification Criteria:**
- [ ] No unnecessary API calls on route changes
- [ ] Improved page load performance
- [ ] Smart caching reduces redundant requests
- [ ] Progressive loading enhances UX

#### **Task 4.2: Loading Sequence Optimization**
**Objective:** Ensure shell renders immediately with progressive content loading
**Files to Modify:**
- Shell components
- Page components
- Loading state components

**Technical Specification:**
1. Shell renders within 100ms
2. Progressive content loading
3. Skeleton states for all components
4. Smooth loading transitions
5. Performance monitoring integration

**Verification Criteria:**
- [ ] Shell appears instantly on all routes
- [ ] Progressive loading provides smooth UX
- [ ] Loading states are consistent across app
- [ ] Performance metrics meet targets

### **PHASE 5: CLEANUP & VALIDATION**
**Objective:** Remove deprecated code and validate architectural integrity
**Timeline:** Week 5 (Maintenance)

#### **Task 5.1: Code Cleanup**
**Files to Remove/Modify:**
- Deprecated global data patterns
- Unused error handling code
- Redundant loading states
- Legacy shell dependencies

#### **Task 5.2: Architectural Validation**
**Verification Checklist:**
- [ ] Shell independence verified across all routes
- [ ] Data fetching follows [DAL.1-4] patterns
- [ ] Error boundaries protect all levels
- [ ] Performance targets achieved
- [ ] Blueprint compliance confirmed

---

## **🔄 IMPLEMENTATION FLOWCHART**

```
START
  ↓
[Phase 1: Shell Independence]
  ├── Remove AppShell data dependencies
  ├── Create independent shell components
  └── Implement shell error boundaries
  ↓
[Phase 2: Data Restructuring]
  ├── Remove global AppDataProvider
  ├── Create page-specific data contexts
  └── Implement isolated data fetching
  ↓
[Phase 3: Error Handling]
  ├── Three-tier error boundary system
  ├── Smart error recovery mechanisms
  └── Progressive recovery patterns
  ↓
[Phase 4: Performance Optimization]
  ├── Route-specific data loading
  ├── Loading sequence optimization
  └── Cache management improvements
  ↓
[Phase 5: Cleanup & Validation]
  ├── Remove deprecated code
  ├── Validate architectural integrity
  └── Performance testing
  ↓
COMPLETE: Stable, Sustainable Architecture
```

---

## **⚠️ RISK ASSESSMENT**

### **High-Risk Items**
1. **Data Migration Complexity:** Moving from global to page-specific data
   - *Mitigation:* Gradual migration with backward compatibility
2. **Error Boundary Implementation:** Complex error propagation patterns
   - *Mitigation:* Extensive testing of error scenarios

### **Medium-Risk Items**
1. **Performance Regression:** Changes to data loading patterns
   - *Mitigation:* Performance monitoring and optimization
2. **Component Integration:** Shell components with new data patterns
   - *Mitigation:* Comprehensive integration testing

### **Low-Risk Items**
1. **UI Consistency:** Minor visual changes during transition
   - *Mitigation:* Visual regression testing

---

## **🎯 SUCCESS CRITERIA**

### **Technical Metrics**
- [ ] Shell renders within 100ms on all routes
- [ ] Zero shell disappearance incidents
- [ ] 90%+ reduction in shell-related errors
- [ ] Consistent navigation behavior across all pages

### **Architectural Metrics**
- [ ] 100% compliance with [DAL.1-4] directives
- [ ] Zero global data dependencies in shell
- [ ] Three-tier error boundary coverage
- [ ] Page-specific data isolation achieved

### **Development Metrics**
- [ ] Reduced AI context requirements for shell changes
- [ ] Standardized patterns across all components
- [ ] Improved code maintainability scores
- [ ] Enhanced development velocity

---

## **📚 GOVERNING DOCUMENTATION**

This plan is governed by and must comply with:
- **[DOC_2]** System Architecture - Shell design patterns
- **[DOC_6]** Data Fetching Strategy - Component data isolation
- **[Blueprint 02]** Main App Shell - Shell independence requirements
- **Development Protocols** - Standardization and sustainability requirements

---

## **🔄 NEXT STEPS**

1. **Review and Approve:** Technical team review of stabilization plan
2. **Phase 1 Implementation:** Begin shell independence restoration
3. **Progressive Rollout:** Implement phases with continuous validation
4. **Monitor and Adjust:** Track metrics and adjust implementation as needed
5. **Documentation Update:** Maintain current documentation throughout process

---

**Last Updated:** June 20, 2025  
**Status:** Ready for Implementation  
**Priority:** Critical - Foundation for Sustainable Development

