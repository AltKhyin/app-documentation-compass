
// ABOUTME: The main sidebar navigation for desktop views with collapsible functionality.
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import NavItem from './NavItem';
import UserProfileBlock from './UserProfileBlock';
import { navigationItems, adminNavigationItems, getVisibleNavigationItems } from '@/config/navigation';
import { useAuthStore } from '@/store/auth';

interface CollapsibleSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const CollapsibleSidebar = ({ isCollapsed, onToggle }: CollapsibleSidebarProps) => {
  const { session } = useAuthStore();
  
  // Filter navigation items based on user role
  const userRole = session?.user?.app_metadata?.role || 'practitioner';
  const visibleMainItems = getVisibleNavigationItems(navigationItems, userRole);
  const visibleAdminItems = getVisibleNavigationItems(adminNavigationItems, userRole);

  return (
    <aside className={`fixed left-0 top-0 z-40 h-screen bg-background border-r border-border transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-60'} flex flex-col`}>
      {/* Header with logo - matching Blueprint 02 requirements */}
      <div className={`flex items-center border-b border-border h-16 ${isCollapsed ? 'justify-center px-2' : 'justify-center px-4'}`}>
        {!isCollapsed ? (
          <h1 className="font-serif font-medium tracking-tight text-3xl text-foreground">
            Reviews.
          </h1>
        ) : (
          <h1 className="font-serif font-medium tracking-tight text-3xl text-foreground">
            R.
          </h1>
        )}
      </div>

      {/* Navigation items */}
      <nav className={`flex-1 space-y-2 ${isCollapsed ? 'px-2 py-4' : 'px-4 py-4'}`}>
        {/* Main navigation */}
        {visibleMainItems.map((item) => (
          <NavItem
            key={item.path}
            href={item.path}
            icon={item.icon}
            label={item.label}
            isCollapsed={isCollapsed}
          />
        ))}
        
        {/* Admin navigation - show separator if items exist */}
        {visibleAdminItems.length > 0 && (
          <>
            <div className="border-t border-border my-4" />
            {visibleAdminItems.map((item) => (
              <NavItem
                key={item.path}
                href={item.path}
                icon={item.icon}
                label={item.label}
                isCollapsed={isCollapsed}
              />
            ))}
          </>
        )}
      </nav>

      {/* Collapse button */}
      <div className={`pb-2 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={`w-full ${isCollapsed ? 'justify-center' : 'justify-end'}`}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      {/* User profile block at bottom */}
      <div className={`border-t border-border ${isCollapsed ? 'p-2' : 'p-4'}`}>
        <UserProfileBlock isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
};

export default CollapsibleSidebar;
