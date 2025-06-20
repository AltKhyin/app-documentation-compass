EVIDENS: Architectural Hardening & Production Readiness GuideDocument Version: 1.0Date: June 20, 2025Objective: To provide a comprehensive, step-by-step guide for executing critical architectural improvements to the EVIDENS platform. This document will guide a developer through a series of prioritized tasks to enhance performance, stability, and long-term maintainability, preparing the application for a production launch.Introduction: The "Why" Behind This RefactorAfter a series of deep-dive analyses, our codebase has been identified as architecturally sound but possessing several latent risks that could impact its long-term health. The current implementation has two primary issues that we must address:A Performance & Architectural Flaw: The application currently fetches all data required for the homepage on every single authenticated page. This is inefficient and slows down the user experience. This is caused by a React Context Provider (AppDataProvider) being applied globally when it should only apply to the homepage. While the app functions, this pattern is not scalable and leads to a suboptimal user experience.A Maintainability & Stability Flaw: The project's TypeScript configuration is not set to strict mode. This is a significant piece of technical debt that leaves us vulnerable to common runtime errors (like trying to access data on a null object) and makes the code harder to safely refactor in the future.The goal of this guide is to provide a meticulously detailed, step-by-step plan to fix these issues. We will work methodically to ensure the application remains stable at every stage of the process.Who is this document for?This guide is written for a developer who may not have full context on the initial architectural decisions. Every step includes the "What" (the action to take), the "How" (the specific code to write), and the "Why" (the reasoning behind the change).Prerequisites & SetupBefore you begin, please ensure you have the following set up:Git: You have Git installed and are ableto create and switch between branches.Node.js & npm: You have a recent version of Node.js and npm installed. Run npm install in the project root to ensure all dependencies are up to date.Code Editor: You are using a code editor like VS Code with appropriate extensions for TypeScript and React.Local Environment: Your local development environment is running correctly. You should be able to start the application with npm run dev.Your First Step: Create a New BranchAll of this work should be done on a dedicated feature branch to avoid disrupting the main branch.git checkout main
git pull
git checkout -b feature/architectural-hardening
Now, let's begin. We will tackle the tasks in order of priority.Task 1: Decoupling the Data Layer & Achieving Shell Independence (Highest Priority)Strategic Goal: To fix the core performance issue by ensuring data is only fetched for the page that needs it. We will decouple the application's main navigation "shell" from any page-specific data, making the application feel faster and more responsive.Part A: Scoping the Homepage Data ProviderThe Why: Currently, the AppDataProvider is wrapped around every single protected route in the application (src/components/routes/ProtectedAppRoute.tsx). This provider is responsible for fetching the homepage data. Our goal is to move this provider so it only wraps the homepage component itself.Step 1.1: Remove the Global ProviderWHAT: Open the file src/components/routes/ProtectedAppRoute.tsx.HOW: Locate the AppDataProvider component and remove it, leaving only its {children}.File: src/components/routes/ProtectedAppRoute.tsxCode (Before):import { AppDataProvider } from '@/contexts/AppDataContext';
import { ProtectedRoute } from '../auth/ProtectedRoute';
// ...
export const ProtectedAppRoute = ({ children, requiredRole = 'practitioner' }: ProtectedAppRouteProps) => {
  return (
    <ProtectedRoute requiredRole={requiredRole}>
      <AppDataProvider> {/* <-- THIS LINE AND THE CLOSING TAG WILL BE REMOVED */}
        {children}
      </AppDataProvider>
    </ProtectedRoute>
  );
};
Code (After):import { ProtectedRoute } from '../auth/ProtectedRoute';
// ... (The AppDataProvider import is now unused and can be removed)
export const ProtectedAppRoute = ({ children, requiredRole = 'practitioner' }: ProtectedAppRouteProps) => {
  return (
    <ProtectedRoute requiredRole={requiredRole}>
      {children}
    </ProtectedRoute>
  );
};
WHY: This change ensures that the ProtectedAppRoute component is solely responsible for one thing: checking if a user is authenticated and authorized. It no longer forces a data fetch on every page.VERIFICATION (Expect Breakage): Save the file. Your running application will now likely crash when you navigate to the homepage (/). This is expected and correct. It crashes because the homepage component (Index.tsx) uses the useAppData() hook, but we have just removed its provider. This proves the decoupling is working.Step 1.2: Relocate the Provider to the Homepage RouteWHAT: Open the main router configuration file, src/router/AppRouter.tsx. We will now apply the AppDataProvider only to the specific route that needs it.HOW: Import the AppDataProvider and wrap the Index component with it.File: src/router/AppRouter.tsxCode (Before):// ...
<Route index element={<Index />} />
// ...
Code (After):// Add the import at the top of the file
import { AppDataProvider } from '../contexts/AppDataContext';
// ...

// Find the route for the Index page and wrap the element
<Route index element={
  <AppDataProvider>
    <Index />
  </AppDataProvider>
} />
// ...
WHY: This correctly scopes the homepage data. The useConsolidatedHomepageFeedQuery will now only be executed when the user is on the homepage route. No other page will trigger this data fetch.VERIFICATION: Save the file. Go to your running application and navigate to the homepage (/). It should now load and function correctly, just as it did before. However, if you navigate to another page like /comunidade, you might notice that the UserProfileBlock in the sidebar is now broken. This is also expected and is what we will fix in Part B.Part B: Creating Self-Contained Shell ComponentsThe Why: The application shell (the sidebar, header, etc.) should not depend on data from any specific page. Shell components like the UserProfileBlock need only a tiny amount of data (the user's profile) and should be responsible for fetching it themselves.Step 1.3: Create a Dedicated useUserProfileQuery HookWHAT: Create a new file for a highly-focused TanStack Query hook that fetches only the profile for the currently logged-in user.HOW: Create the file packages/hooks/useUserProfileQuery.ts and add the following code.File: packages/hooks/useUserProfileQuery.tsCode:import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/auth';
import type { UserProfile } from '@/types'; // Assuming UserProfile is correctly defined in types

// This is a small, focused function to fetch just the practitioner's profile.
const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('Practitioners')
    .select('id, full_name, avatar_url, role') // Only select the fields you need!
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error.message);
    // In a real production app, you might want to log this to a service like Sentry.
    throw new Error(error.message);
  }
  return data;
};

export const useUserProfileQuery = () => {
  // We get the userId from our global Zustand auth store.
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    // The query key is an array. The first element is a generic name for the query.
    // The second element is the dynamic part (the userId).
    // This ensures that if the user logs out and another logs in,
    // TanStack Query will fetch the new user's data.
    queryKey: ['user-profile', userId],

    // The function that will be executed to fetch the data.
    queryFn: () => {
      if (!userId) {
        // If there's no user, we shouldn't attempt to fetch.
        return Promise.resolve(null);
      }
      return fetchUserProfile(userId);
    },

    // This is a crucial option. It tells the query not to run at all
    // until a userId is available.
    enabled: !!userId,

    // This tells TanStack Query to consider the data "fresh" for 15 minutes.
    // It won't be refetched on window focus during this time, which is good
    // because a user's profile doesn't change very often.
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};
WHY: This hook is reusable, efficient, and completely independent of any page data. It perfectly encapsulates the logic for fetching the user's profile. By only selecting the columns it needs, it's also more performant than fetching *.Step 1.4: Refactor UserProfileBlock.tsxWHAT: Open src/components/shell/UserProfileBlock.tsx and replace its dependency on the global useAppData with our new, self-contained useUserProfileQuery.HOW: Modify the component as follows.File: src/components/shell/UserProfileBlock.tsxCode (Before):import { useAppData } from '@/contexts/AppDataContext';
// ...
const UserProfileBlock = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const { userProfile, isLoading } = useAppData();

  if (isLoading) {
    // ... skeleton logic ...
  }
  // ... rest of the component
};
Code (After):import { Skeleton } from '@/components/ui/skeleton';
import { useUserProfileQuery } from '../../../packages/hooks/useUserProfileQuery'; // Adjust path if necessary
// ... other imports

const UserProfileBlock = ({ isCollapsed }: { isCollapsed: boolean }) => {
  // The component now uses its own data-fetching hook.
  const { data: userProfile, isLoading } = useUserProfileQuery();

  // Its loading state is now independent.
  if (isLoading) {
    return (
      <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center p-2' : 'p-3'}`}>
        <Skeleton className="h-9 w-9 rounded-full" />
        {!isCollapsed && <Skeleton className="h-4 w-24" />}
      </div>
    );
  }

  // We add a guard for the case where the user profile couldn't be fetched.
  if (!userProfile) {
    return (
      <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center p-2' : 'p-3'}`}>
        {/* You can show a placeholder or an error state */}
        <div className="h-9 w-9 rounded-full bg-muted" />
        {!isCollapsed && <span className="text-sm text-muted-foreground">User not found</span>}
      </div>
    );
  }

  // The rest of the component remains largely the same, using the 'userProfile' data.
  // ...
  return (
    // ... JSX to render the user's name and avatar
  );
};
WHY: The UserProfileBlock is now a truly independent, "smart" component. It knows how to fetch its own data and how to display its own loading state. Its success or failure has zero impact on any other part of the application. This is a robust and maintainable pattern.Final Verification for Task 1After completing all the steps above, you should be able to verify the following:[ ] Homepage Works: Navigate to /. The page should load and display all its data as before.[ ] Other Pages Are Fast: Navigate to /comunidade or /acervo. The application shell (sidebar, header) should appear instantly.[ ] Shell Component Loads Independently: On the /comunidade page, you will briefly see a skeleton in the sidebar where the UserProfileBlock is, which will then be replaced by the user's information. This "pop-in" is the visual proof of our decoupling.[ ] Efficient Network Requests: Open your browser's Developer Tools to the "Network" tab. When you load the /comunidade page, you should NOT see a call to the get-homepage-feed function. You should see a database query to the Practitioners table. This confirms we have eliminated the unnecessary data fetching.If all these checks pass, you have successfully completed the most critical architectural improvement. You can now commit your changes for this task.git add .
git commit -m "feat: decouple data providers and create independent shell components"
Task 2: Implementing a Tiered Error Boundary System (High Priority)Strategic Goal: To make our application more resilient. A runtime error in one part of the app should not crash the entire screen. We will create a layered "safety net" so that if a component breaks, only that component is replaced with an error message, leaving the rest of the application functional.The Why: Currently, our app has some error handling, but a severe error in a page's content could potentially crash the main navigation shell, leaving the user with a blank white page and no way to recover. This is a very poor user experience.Step 2.1: Enhance the Generic ErrorBoundary ComponentWHAT: We will improve our main error boundary component to provide a more user-friendly fallback UI.HOW: Open src/components/ErrorBoundary.tsx and update its render method.File: src/components/ErrorBoundary.tsxCode:import React from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // In a real production app, you would log this error to a service.
    // Example: Sentry.captureException(error, { extra: errorInfo });
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-background p-6">
          <div className="text-center">
            <h1 className="text-xl font-bold text-destructive">Oops! Algo deu errado.</h1>
            <p className="mt-2 text-muted-foreground">
              Nossa equipe de engenharia foi notificada. Por favor, tente recarregar a página.
            </p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Recarregar Página
            </Button>
            {/* This <details> block will only show in development mode, which is helpful for debugging */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm">Detalhes do erro</summary>
                <pre className="mt-2 whitespace-pre-wrap rounded-md bg-muted p-4 text-xs">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
WHY: This provides a single, consistent, and helpful error screen that gives the user a clear action (reload) and gives developers debugging information when in development mode.Step 2.2: Implement Tier 1 & 2 Boundaries (Application Root & Page Content)The Why: We will now use our enhanced ErrorBoundary in two key places. Tier 1 will wrap the entire application as a last-resort safety net. Tier 2 will wrap the page content area, isolating it from the main navigation shell.WHAT: Wrap the entire application router in the ErrorBoundary.HOW: Open src/App.tsx.File: src/App.tsxCode:import { AppProviders } from '@/components/providers/AppProviders';
import { AppRouter } from '@/router/AppRouter';
import { ErrorBoundary } from './components/ErrorBoundary'; // Import the boundary

function App() {
  return (
    <ErrorBoundary> {/* <-- TIER 1: The Root Boundary */}
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </ErrorBoundary>
  );
}

export default App;
WHAT: Now, wrap the page content Outlet to protect the shell.HOW: Open src/components/shell/AppShell.tsx. This requires a small refactor to how children are passed.File: src/components/shell/AppShell.tsxCode:import { Outlet } from 'react-router-dom';
import { DesktopShell } from './DesktopShell';
import { MobileShell } from './MobileShell';
import { useIsMobile } from '@/hooks/use-mobile';
import { ErrorBoundary } from '@/components/ErrorBoundary'; // Import the boundary

export const AppShell = () => {
  const isMobile = useIsMobile();

  // We create a component for the page content that is wrapped in our boundary.
  const PageContent = (
    <div className="flex-1 overflow-auto p-4 md:p-6">
      <ErrorBoundary> {/* <-- TIER 2: The Page Content Boundary */}
        <Outlet />
      </ErrorBoundary>
    </div>
  );

  if (isMobile) {
    return <MobileShell>{PageContent}</MobileShell>;
  }
  return <DesktopShell>{PageContent}</DesktopShell>;
};
WHAT: You now need to update DesktopShell and MobileShell to accept and render this PageContent as a child.HOW:Open src/components/shell/DesktopShell.tsx. Modify it to accept children.// src/components/shell/DesktopShell.tsx
export const DesktopShell = ({ children }: { children: React.ReactNode }) => {
    // ...
    return (
        <div className="flex h-screen w-full">
            <CollapsibleSidebar />
            <div className="flex flex-1 flex-col">
                <Header />
                <main className="flex-1 bg-muted/30">{children}</main> {/* <-- Render children here */}
            </div>
        </div>
    );
};
Open src/components/shell/MobileShell.tsx. Modify it to accept children.// src/components/shell/MobileShell.tsx
export const MobileShell = ({ children }: { children: React.ReactNode }) => {
    // ...
    return (
        <div className="flex h-screen w-full flex-col">
            <Header />
            <main className="flex-1 overflow-y-auto bg-muted/30">{children}</main> {/* <-- Render children here */}
            <BottomTabBar />
        </div>
    );
};
Verification for Task 2This is best tested by temporarily introducing an error.Test Tier 2:Open src/pages/CommunityPage.tsx.At the very top of the component function, add this line: throw new Error('Test Error from Community Page');Save the file and navigate to /comunidade.Expected Result: The main navigation shell (sidebar/header) should remain perfectly visible and functional. The main content area where the posts would normally appear should now display your enhanced error fallback UI. This proves the page content is isolated.Cleanup: Remember to remove the throw new Error line.Test Tier 1:Open src/components/shell/Header.tsx.At the top of the component, add throw new Error('Test Error from Header');Expected Result: Because the Header is outside the Tier 2 boundary, this error will bubble up to the Tier 1 boundary in App.tsx. The entire screen should now show the error fallback UI. This proves your final safety net works.Cleanup: Remove the throw new Error line.If these tests pass, you have successfully implemented a robust, layered error-handling system. You can now commit your changes.git add .
git commit -m "feat: implement tiered error boundary system for stability"
Task 3: Migrating to a Strict TypeScript Environment (Medium Priority)Strategic Goal: To dramatically improve the long-term quality, maintainability, and stability of our codebase by enabling TypeScript's strictest settings. This is the most important investment we can make in the future health of the project.The Why: Currently, our project has "strict": false in its tsconfig.app.json. This means we are missing out on TypeScript's most powerful feature: its ability to catch potential errors before they happen. Specifically, without strict mode, TypeScript doesn't effectively check for null or undefined values, which is the cause of most runtime errors in web applications. This task will fix that.Important: This task is more challenging than the others and requires careful, methodical work. It may produce many errors initially. Do not be discouraged. This is expected. We will fix them one by one.The "Boil the Ocean Slowly" StrategyWe will not try to fix all errors at once. We will follow a bottom-up approach:Enable strict mode.Fix the core type definitions first.Fix the data-fetching hooks.Fix the components and pages.Step 3.1: Enable Strict Mode & Establish a BaselineWHAT: Update the two main tsconfig files to enable strict mode.HOW:Open tsconfig.json. Find and remove the following lines if they exist: "strictNullChecks": false and "noImplicitAny": false.Open tsconfig.app.json. Find the "strict" flag and change its value to true.File: tsconfig.app.jsonCode (After):{
  "compilerOptions": {
    // ...
    "strict": true // <-- This is the most important change
  },
  // ...
}
WHAT: Get a list of all the new type errors.HOW: Open your terminal in the project root and run npm run build. This command will fail, which is what we want. It will print a long list of all the files and lines that now have type errors.ACTION: Copy this entire output into a new text file called typescript-errors.md. This is now your checklist. As you fix errors, you can delete them from this file.Step 3.2: Fixing the Most Common Error TypesYou will encounter two main categories of errors repeatedly. Here is how to fix them.Error Type 1: Object is possibly 'null' or 'undefined'.This is the most common and most important error to fix. It means you are trying to use a variable that might not have a value yet.THE WRONG WAY (Avoid This): Using the non-null assertion operator !.const { data } = useSomeQuery();
// This tells TypeScript "trust me, data is not null", but it might be! This is dangerous.
return <div>{data!.title}</div>; // AVOID THIS PATTERN
THE RIGHT WAY (Use Type Guards): Explicitly check for the value before you use it.const { data, isLoading } = useSomeQuery();

if (isLoading) {
  return <p>Loading...</p>;
}

// This is a type guard. After this 'if' block, TypeScript *knows*
// that 'data' cannot be null or undefined.
if (!data) {
  return <p>No data available.</p>;
}

// Now it is 100% safe to access data.title
return <div>{data.title}</div>;
Another Right Way (Optional Chaining ?.): Use this when you want to render nothing if the object is null.// If userProfile is null, this expression will safely return 'undefined' instead of crashing.
return <div>{userProfile?.name}</div>
Error Type 2: Parameter 'x' implicitly has an 'any' type.This means you have a function parameter without a type.Solution: Add an explicit type. If you're not sure what the type is, you can often find it by looking at where the function is being called or by inspecting the types from the library you are using (like React).Example (Event Handler):// BEFORE
const handleInputChange = (event) => { /* ... */ }

// AFTER
const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => { /* ... */ }
Example (Custom Component Prop):// BEFORE
const MyComponent = ({ user }) => { /* ... */ }

// AFTER
import type { UserProfile } from '@/types';
const MyComponent = ({ user }: { user: UserProfile | null }) => { /* ... */ }
Step 3.3: The Step-by-Step Fixing ProcessStart with src/types/: Open all files in this directory. Review every interface and type. If a property can truly be null from the database, its type must reflect that. For example, avatar_url: string should become avatar_url: string | null;.Move to packages/hooks/: Fix all the data-fetching hooks. The return types of their queryFn must be accurate. If a query can return no result, the promise should resolve to null, and the function's return type should be Promise<YourType | null>.Fix Pages and Components: Go through your typescript-errors.md checklist file by file. Apply the type guarding and explicit typing patterns described above.Rerun the Build: Periodically, run npm run build to see your list of errors get shorter. This will help keep you motivated!Verification for Task 3The task is complete when npm run build runs successfully and reports zero errors. At this point, you have significantly improved the quality and stability of the entire application. You can commit your work.git add .
git commit -m "feat: enable strict typescript and resolve all type errors"
Final Document ConclusionBy completing these three tasks, you will have addressed the most critical architectural and quality issues in the codebase. You will have:Dramatically improved the application's performance and responsiveness.Made the UI far more resilient to runtime errors.Eliminated an entire class of potential bugs by enforcing strict type safety.The application is now on a solid foundation, ready for future feature development and a confident production launch.