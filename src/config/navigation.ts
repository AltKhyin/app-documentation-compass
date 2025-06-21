
// ABOUTME: Standardized navigation configuration with unified structure and role-based filtering

import { 
  Home, 
  BookOpen, 
  Users, 
  User, 
  Bookmark,
  Settings,
  Shield,
  BarChart3,
  FileText
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  path: string;
  label: string;
  mobileLabel?: string;
  icon: LucideIcon;
  requiredRoles?: string[];
  showOnMobile?: boolean;
  showOnDesktop?: boolean;
}

// UNIFIED navigation items - single source of truth
export const navigationItems: NavigationItem[] = [
  {
    path: '/',
    label: 'Início',
    mobileLabel: 'Início',
    icon: Home,
    showOnMobile: true,
    showOnDesktop: true,
  },
  {
    path: '/acervo',
    label: 'Acervo',
    mobileLabel: 'Acervo',
    icon: BookOpen,
    showOnMobile: true,
    showOnDesktop: true,
  },  
  {
    path: '/comunidade',
    label: 'Comunidade',
    mobileLabel: 'Comunidade',
    icon: Users,
    showOnMobile: true,
    showOnDesktop: true,
  },
  {
    path: '/salvos',
    label: 'Salvos',
    mobileLabel: 'Salvos',
    icon: Bookmark,
    showOnMobile: true,
    showOnDesktop: false, // Desktop users access via profile or other means
  },
  {
    path: '/perfil',
    label: 'Perfil',
    mobileLabel: 'Perfil',
    icon: User,
    showOnMobile: true,
    showOnDesktop: true,
  },
  // Admin items - desktop only
  {
    path: '/admin/settings',
    label: 'Configurações',
    icon: Settings,
    requiredRoles: ['admin'],
    showOnMobile: false,
    showOnDesktop: true,
  },
  {
    path: '/admin/moderation',
    label: 'Moderação',
    icon: Shield,
    requiredRoles: ['admin', 'editor'],
    showOnMobile: false,
    showOnDesktop: true,
  },
  {
    path: '/admin/analytics',
    label: 'Analytics',
    icon: BarChart3,
    requiredRoles: ['admin'],
    showOnMobile: false,
    showOnDesktop: true,
  },
  {
    path: '/admin/content',
    label: 'Conteúdo',
    icon: FileText,
    requiredRoles: ['admin', 'editor'],
    showOnMobile: false,
    showOnDesktop: true,
  },
];

// Utility function to filter navigation items based on context and user role
export const getNavigationItems = (
  context: 'mobile' | 'desktop',
  userRole: string = 'practitioner'
): NavigationItem[] => {
  return navigationItems.filter(item => {
    // Check context visibility
    const contextVisible = context === 'mobile' ? item.showOnMobile : item.showOnDesktop;
    if (!contextVisible) return false;

    // Check role requirements
    if (!item.requiredRoles) return true;
    return item.requiredRoles.includes(userRole);
  });
};

// Legacy support - DEPRECATED: Use getNavigationItems instead
export const getVisibleNavigationItems = (
  items: NavigationItem[], 
  userRole: string
): NavigationItem[] => {
  console.warn('getVisibleNavigationItems is deprecated. Use getNavigationItems instead.');
  return items.filter(item => {
    if (!item.requiredRoles) return true;
    return item.requiredRoles.includes(userRole);
  });
};

// DEPRECATED: Remove these after components are updated
export const mobileNavigationItems = getNavigationItems('mobile');
export const adminNavigationItems = navigationItems.filter(item => item.requiredRoles?.length);
