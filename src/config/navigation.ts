
// ABOUTME: Standardized navigation configuration with English internal names and Portuguese user-facing labels

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
}

// Main navigation items - standardized English internal structure
export const navigationItems: NavigationItem[] = [
  {
    path: '/',
    label: 'Início',
    mobileLabel: 'Início',
    icon: Home,
  },
  {
    path: '/acervo',
    label: 'Acervo',
    mobileLabel: 'Acervo',
    icon: BookOpen,
  },
  {
    path: '/comunidade',
    label: 'Comunidade',
    mobileLabel: 'Comunidade',
    icon: Users,
  },
  {
    path: '/perfil',
    label: 'Perfil',
    mobileLabel: 'Perfil',
    icon: User,
  },
];

// Mobile-specific navigation items
export const mobileNavigationItems: NavigationItem[] = [
  {
    path: '/',
    label: 'Início',
    mobileLabel: 'Início',
    icon: Home,
  },
  {
    path: '/acervo',
    label: 'Acervo',
    mobileLabel: 'Acervo',
    icon: BookOpen,
  },
  {
    path: '/comunidade',
    label: 'Comunidade',
    mobileLabel: 'Comunidade',
    icon: Users,
  },
  {
    path: '/salvos',
    label: 'Salvos',
    mobileLabel: 'Salvos',
    icon: Bookmark,
  },
  {
    path: '/perfil',
    label: 'Perfil',
    mobileLabel: 'Perfil',
    icon: User,
  },
];

// Admin navigation items - standardized English internal structure
export const adminNavigationItems: NavigationItem[] = [
  {
    path: '/admin/settings',
    label: 'Configurações',
    icon: Settings,
    requiredRoles: ['admin'],
  },
  {
    path: '/admin/moderation',
    label: 'Moderação',
    icon: Shield,
    requiredRoles: ['admin', 'editor'],
  },
  {
    path: '/admin/analytics',
    label: 'Analytics',
    icon: BarChart3,
    requiredRoles: ['admin'],
  },
  {
    path: '/admin/content',
    label: 'Conteúdo',
    icon: FileText,
    requiredRoles: ['admin', 'editor'],
  },
];

// Utility function to filter navigation items based on user role
export const getVisibleNavigationItems = (
  items: NavigationItem[], 
  userRole: string
): NavigationItem[] => {
  return items.filter(item => {
    if (!item.requiredRoles) return true;
    return item.requiredRoles.includes(userRole);
  });
};
