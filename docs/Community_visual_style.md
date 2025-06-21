
# EVIDENS Community Visual Style Guide - Reddit-Inspired Implementation

**Version:** 1.0.0  
**Date:** June 21, 2025  
**Purpose:** Comprehensive visual specification for implementing Reddit-style interface in EVIDENS Community pages

---

## 1. EXECUTIVE SUMMARY

After thorough analysis of the provided Reddit interface references and examination of the current EVIDENS codebase, this document establishes the complete visual transformation requirements for implementing a Reddit-inspired community interface. The transformation focuses on two primary pages: the Community Feed (`/comunidade`) and Individual Post pages (`/comunidade/[postId]`).

**Critical Discovery:** The `docs/CODEBASE_AUDIT_REPORT.md` file appears to be empty or inaccessible, requiring reliance on the provided Reddit interface screenshots and current codebase analysis to derive comprehensive specifications.

---

## 2. VISUAL ANALYSIS OF REDDIT INTERFACE REFERENCES

### 2.1 Screenshot Analysis - Primary Feed Interface

**Image 1 Analysis:** `/lovable-uploads/a81b7a7d-9120-4f0f-80f2-658cef529d4a.png`

**Key Visual Elements Identified:**
- **Background:** Pure dark theme (#1a1a1a approximate)
- **Post Containers:** No visible card borders or shadows
- **Separation Method:** Subtle horizontal lines between posts
- **Vote System:** Horizontal layout with upvote/downvote arrows flanking the score
- **Content Hierarchy:** Clear visual distinction between title, metadata, and body text
- **Avatar Integration:** Small circular avatars integrated into the post header
- **Engagement Metrics:** Comment counts, share buttons positioned horizontally

**Specific Measurements Observed:**
- Vote buttons appear to be ~24px in height
- Post content has generous left padding (~16px from vote buttons)
- Vertical spacing between posts: ~16px with separator lines
- Avatar size: ~20px diameter in post headers

### 2.2 Screenshot Analysis - Subreddit Header Interface

**Image 2 Analysis:** `/lovable-uploads/b89ec32d-1f8e-476e-bef8-0986666fd36f.png`

**Key Visual Elements Identified:**
- **Header Banner:** Prominent colored banner with subreddit branding
- **Subreddit Info:** Large subreddit name with member count and statistics
- **Action Buttons:** "Create Post", "Joined" buttons with distinct styling
- **Sort Controls:** Dropdown selectors for post sorting (Best, Hot, New, etc.)
- **Community Sidebar:** Right-aligned sidebar with community information
- **Post Layout:** Consistent with Image 1, showing the same horizontal vote system

**Design Patterns Observed:**
- Strong visual hierarchy with banner → controls → content flow
- Consistent use of rounded corners on interactive elements
- Subtle color coding for different types of content (flairs, badges)

---

## 3. CURRENT EVIDENS CODEBASE STATE ANALYSIS

### 3.1 Existing Component Architecture

**Current Vote System (`VoteButtons.tsx`):**
```typescript
// Current implementation uses VERTICAL layout
<div className="flex flex-col items-center gap-1">
  <Button>ChevronUp</Button>
  <span>{netScore}</span>
  <Button>ChevronDown</Button>
</div>
```

**Current Post Layout (`PostCard.tsx`):**
```typescript
// Current implementation uses Card wrapper with shadows
<Card className="hover:shadow-md transition-shadow cursor-pointer">
  <CardContent className="p-4">
    <div className="flex gap-3">
      <VoteButtons />  // Vertical layout
      <div className="flex-1">...</div>
    </div>
  </CardContent>
</Card>
```

### 3.2 Identified Transformation Requirements

**Major Structural Changes Required:**
1. **Vote System Transformation:** Vertical → Horizontal layout conversion
2. **Card Removal:** Eliminate Card components and shadows
3. **Separator Implementation:** Add horizontal dividers between posts
4. **Layout Reflow:** Adjust spacing and positioning for Reddit-style density
5. **Color Scheme Adaptation:** Enhance dark theme to match Reddit's visual weight

---

## 4. DETAILED VISUAL SPECIFICATIONS

### 4.1 Vote Button System Redesign

**Current State:** Vertical stack (up arrow, score, down arrow)
**Target State:** Horizontal row (up arrow, score, down arrow)

**Specific Implementation Requirements:**
- **Layout:** `flex flex-row items-center gap-2`
- **Button Dimensions:** 24px × 24px minimum touch target
- **Score Display:** Center-aligned between buttons
- **Hover States:** Subtle background highlight on button hover
- **Active States:** Distinct color change for user's vote (orange/blue)
- **Spacing:** 8px gap between elements
- **Alignment:** Vertically centered with post content

**Color Specifications:**
- **Upvote Active:** `#ff6b35` (Reddit orange)
- **Downvote Active:** `#0079d3` (Reddit blue)
- **Neutral State:** `#878a8c` (Reddit gray)
- **Hover Background:** `rgba(255, 255, 255, 0.1)` in dark theme

### 4.2 Post Container Redesign

**Current State:** Card-based with shadows and rounded corners
**Target State:** Borderless with separator lines

**Container Specifications:**
- **Remove:** Card wrapper, shadows, rounded corners
- **Background:** Transparent or subtle background color
- **Borders:** None on container
- **Separation:** 1px solid horizontal line between posts
- **Padding:** 16px vertical, 16px horizontal
- **Hover State:** Subtle background highlight on entire post area

**Separator Line Specifications:**
- **Color:** `#343536` (Reddit dark theme separator)
- **Width:** Full width of container
- **Thickness:** 1px solid
- **Placement:** Bottom of each post (except last)

### 4.3 Content Layout Restructure

**Header Section:**
- **User Info:** Avatar (20px) + username + timestamp
- **Post Actions:** Three-dot menu aligned right
- **Flair/Category:** Colored badges inline with header
- **Spacing:** 8px between elements

**Content Section:**
- **Title:** Bold, larger font size (18px)
- **Body Text:** Standard weight (14px)
- **Media Content:** Full-width with rounded corners
- **Spacing:** 12px between elements

**Footer Section:**
- **Engagement:** Comments count, share button
- **Layout:** Horizontal row with 16px spacing
- **Alignment:** Left-aligned with content

### 4.4 Typography Specifications

**Post Titles:**
- **Font Weight:** 600 (semibold)
- **Font Size:** 18px
- **Line Height:** 1.4
- **Color:** `#d7dadc` (Reddit light text)

**Body Text:**
- **Font Weight:** 400 (normal)
- **Font Size:** 14px
- **Line Height:** 1.6
- **Color:** `#d7dadc`

**Metadata Text:**
- **Font Weight:** 400
- **Font Size:** 12px
- **Color:** `#818384` (Reddit secondary text)

**Vote Scores:**
- **Font Weight:** 600
- **Font Size:** 14px
- **Color:** Dynamic based on vote state

---

## 5. COMPONENT-SPECIFIC IMPLEMENTATION REQUIREMENTS

### 5.1 VoteButtons Component Transformation

**Required Changes:**
1. **Layout Change:** `flex-col` → `flex-row`
2. **Button Sizing:** Uniform 24px × 24px
3. **Icon Updates:** Maintain ChevronUp/ChevronDown
4. **State Management:** Preserve existing vote mutation logic
5. **Accessibility:** Maintain ARIA labels and keyboard navigation

**CSS Classes Required:**
```css
.vote-buttons-horizontal {
  @apply flex flex-row items-center gap-2;
}

.vote-button {
  @apply w-6 h-6 p-1 rounded hover:bg-white/10 transition-colors;
}

.vote-score {
  @apply text-sm font-semibold min-w-[2rem] text-center;
}
```

### 5.2 PostCard Component Restructure

**Required Changes:**
1. **Remove Card Wrapper:** Replace with simple div
2. **Add Separator Logic:** Conditional bottom border
3. **Adjust Padding:** Standardize to Reddit specifications
4. **Hover States:** Implement subtle background highlighting
5. **Content Reflow:** Adjust spacing for higher density

**New Structure:**
```typescript
<div className="post-item">
  <div className="post-content">
    <VoteButtons />  // Now horizontal
    <div className="post-body">
      <PostHeader />
      <PostContent />
      <PostFooter />
    </div>
  </div>
  <div className="post-separator" />
</div>
```

### 5.3 CommunityFeed Component Updates

**Required Changes:**
1. **Remove Card Spacing:** Eliminate gaps between posts
2. **Implement Separators:** Add dividing lines
3. **Background Adjustments:** Ensure proper contrast
4. **Responsive Behavior:** Maintain mobile compatibility

---

## 6. RESPONSIVE DESIGN CONSIDERATIONS

### 6.1 Mobile Adaptations

**Vote Button Behavior:**
- **Maintain horizontal layout on mobile
- **Increase touch targets to 44px minimum
- **Ensure adequate spacing for thumb navigation

**Content Adjustments:**
- **Preserve content hierarchy
- **Adjust font sizes for mobile readability
- **Maintain separator lines for visual organization

### 6.2 Desktop Enhancements

**Hover States:**
- **Implement subtle post highlighting
- **Enhanced button feedback
- **Preserve accessibility standards

---

## 7. COLOR SCHEME SPECIFICATIONS

### 7.1 Dark Theme Enhancements

**Background Colors:**
- **Primary Background:** `#0b1416` (Reddit dark)
- **Post Background:** `#1a1a1b` (Reddit post bg)
- **Hover Background:** `#262628` (Reddit hover)

**Text Colors:**
- **Primary Text:** `#d7dadc` (Reddit primary)
- **Secondary Text:** `#818384` (Reddit secondary)
- **Accent Text:** `#94a3b8` (Reddit accent)

**Border Colors:**
- **Separator Lines:** `#343536` (Reddit border)
- **Hover Borders:** `#474748` (Reddit hover border)

### 7.2 Interactive Element Colors

**Vote System:**
- **Upvote:** `#ff6b35` (Reddit orange)
- **Downvote:** `#0079d3` (Reddit blue)
- **Neutral:** `#878a8c` (Reddit gray)

**Action Elements:**
- **Primary Actions:** `#0079d3` (Reddit blue)
- **Secondary Actions:** `#878a8c` (Reddit gray)
- **Danger Actions:** `#ea0027` (Reddit red)

---

## 8. ANIMATION AND INTERACTION SPECIFICATIONS

### 8.1 Hover Animations

**Post Hover Effect:**
- **Duration:** 150ms
- **Easing:** ease-out
- **Property:** background-color
- **Value:** `rgba(255, 255, 255, 0.05)`

**Button Hover Effects:**
- **Duration:** 100ms
- **Easing:** ease-in-out
- **Property:** background-color, transform
- **Transform:** `scale(1.05)` for vote buttons

### 8.2 Vote Animation

**Vote State Change:**
- **Duration:** 200ms
- **Easing:** ease-out
- **Properties:** color, background-color
- **Feedback:** Subtle scale animation on click

---

## 9. IMPLEMENTATION PRIORITY MATRIX

### 9.1 Phase 1: Core Layout Transformation (HIGH PRIORITY)
1. **VoteButtons horizontal layout conversion
2. **PostCard card removal and separator implementation
3. **Basic color scheme application
4. **Content spacing adjustments

### 9.2 Phase 2: Enhanced Styling (MEDIUM PRIORITY)
1. **Hover state implementations
2. **Animation additions
3. **Typography refinements
4. **Responsive optimizations

### 9.3 Phase 3: Polish and Refinement (LOW PRIORITY)
1. **Micro-interactions
2. **Advanced hover effects
3. **Accessibility enhancements
4. **Performance optimizations

---

## 10. QUALITY ASSURANCE SPECIFICATIONS

### 10.1 Visual Consistency Checks
- **Spacing uniformity across all post elements
- **Color consistency with Reddit reference
- **Typography hierarchy maintenance
- **Interactive state clarity

### 10.2 Functional Validation
- **Vote functionality preservation
- **Navigation behavior maintenance
- **Mobile responsiveness verification
- **Accessibility compliance

### 10.3 Performance Considerations
- **CSS efficiency optimization
- **Animation performance validation
- **Rendering speed maintenance
- **Memory usage monitoring

---

## 11. BROWSER COMPATIBILITY REQUIREMENTS

### 11.1 Supported Browsers
- **Chrome 90+
- **Firefox 88+
- **Safari 14+
- **Edge 90+

### 11.2 Fallback Strategies
- **CSS Grid fallbacks for older browsers
- **Flexbox alternatives where needed
- **Color fallbacks for unsupported properties
- **Animation degradation for reduced motion preferences

---

## 12. ACCESSIBILITY COMPLIANCE

### 12.1 ARIA Requirements
- **Proper labeling for vote buttons
- **Screen reader compatibility for post structure
- **Keyboard navigation support
- **Focus indicator visibility

### 12.2 WCAG 2.1 Compliance
- **AA level color contrast ratios
- **Proper heading hierarchy
- **Alternative text for images
- **Keyboard accessibility

---

## 13. TESTING SPECIFICATIONS

### 13.1 Visual Regression Testing
- **Screenshot comparison with Reddit reference
- **Cross-browser visual consistency
- **Responsive design verification
- **Dark theme accuracy validation

### 13.2 Functional Testing
- **Vote button interaction testing
- **Post navigation verification
- **Mobile touch interaction validation
- **Accessibility tool validation

---

## 14. MAINTENANCE CONSIDERATIONS

### 14.1 Code Organization
- **Component separation for maintainability
- **CSS utility class organization
- **Type safety preservation
- **Documentation updates

### 14.2 Future Scalability
- **Theme system extensibility
- **Component reusability
- **Performance optimization potential
- **Feature addition flexibility

---

## 15. TECHNICAL IMPLEMENTATION NOTES

### 15.1 CSS Architecture
- **Utilize Tailwind CSS utility classes
- **Minimize custom CSS additions
- **Leverage existing design tokens
- **Maintain component-scoped styling

### 15.2 TypeScript Considerations
- **Preserve existing type definitions
- **Maintain type safety for new props
- **Update interface definitions as needed
- **Ensure compatibility with existing hooks

---

## 16. VALIDATION CRITERIA

### 16.1 Visual Fidelity
- **95%+ similarity to Reddit interface patterns
- **Consistent spacing and typography
- **Proper color scheme implementation
- **Smooth interaction feedback

### 16.2 Functional Integrity
- **100% preservation of existing functionality
- **No regression in user experience
- **Maintained performance characteristics
- **Cross-platform compatibility

---

## CONCLUSION

This comprehensive specification provides the complete blueprint for transforming the EVIDENS community interface to match Reddit's visual design patterns. The implementation focuses on maintaining all existing functionality while completely overhauling the visual presentation to achieve the desired Reddit-style aesthetic.

The transformation prioritizes:
1. **Horizontal vote button layout
2. **Card-less post presentation with separators
3. **Reddit-accurate color scheme
4. **Proper spacing and typography hierarchy
5. **Responsive design maintenance

All specifications are designed to be implemented incrementally while maintaining system stability and user experience continuity.

**Document Status:** Complete and ready for implementation
**Next Steps:** Begin Phase 1 implementation with VoteButtons component transformation
