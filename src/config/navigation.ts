
// ABOUTME: Centralized navigation configuration with role-based access control for consistent routing.
import { Home, Archive, Users, User, Settings, Edit } from 'lucide-react';
import type { NavigationItem } from '@/types';

// Main navigation items (accessible to all authenticated users)
export const navigationItems: NavigationItem[] = [
  { 
    icon: Home, 
    label: 'Início', 
    path: '/' 
  },
  { 
    icon: Archive, 
    label: 'Acervo', 
    path: '/acervo' 
  },
  { 
    icon: Users, 
    label: 'Comunidade', 
    path: '/comunidade' 
  },
  { 
    icon: User, 
    label: 'Perfil', 
    path: '/perfil' 
  },
];

// Mobile-specific navigation (optimized for bottom tab bar)
export const mobileNavigationItems: NavigationItem[] = [
  ...navigationItems.slice(0, 3), // Home, Acervo, Comunidade
  { 
    icon: Settings, 
    label: 'Config', 
    path: '/configuracoes',
    mobileLabel: 'Config'
  },
];

// Admin navigation items (only visible to users with appropriate roles)
export const adminNavigationItems: NavigationItem[] = [
  { 
    icon: Edit, 
    label: 'Editor', 
    path: '/editor',
    requiredRole: 'editor'
  },
  // Future admin items will be added here
];

// Utility function to filter navigation items based on user role
export const getVisibleNavigationItems = (
  items: NavigationItem[], 
  userRole: string = 'practitioner'
): NavigationItem[] => {
  return items.filter(item => {
    if (!item.requiredRole) return true;
    
    const roleHierarchy: Record<string, number> = {
      admin: 3,
      moderator: 2,
      editor: 2,
      practitioner: 1,
    };
    
    const userLevel = roleHierarchy[userRole] || 0;
    const requiredLevel = roleHierarchy[item.requiredRole] || 0;
    
    return userLevel >= requiredLevel;
  });
};
