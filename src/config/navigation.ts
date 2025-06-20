
// ABOUTME: Navigation configuration with role-based visibility and path definitions.

import { Home, Library, Users, User, Settings, Shield, BarChart3 } from 'lucide-react';

export interface NavigationItem {
  path: string;
  label: string;
  icon: any;
  roles?: string[];
}

export const navigationItems: NavigationItem[] = [
  {
    path: '/',
    label: 'Início',
    icon: Home,
  },
  {
    path: '/acervo',
    label: 'Acervo',
    icon: Library,
  },
  {
    path: '/comunidade',
    label: 'Comunidade',
    icon: Users,
  },
  {
    path: '/perfil',
    label: 'Perfil',
    icon: User,
  },
];

export const adminNavigationItems: NavigationItem[] = [
  {
    path: '/admin/moderation',
    label: 'Moderação',
    icon: Shield,
    roles: ['admin', 'moderator'],
  },
  {
    path: '/admin/analytics',
    label: 'Analytics',
    icon: BarChart3,
    roles: ['admin'],
  },
  {
    path: '/admin/settings',
    label: 'Configurações',
    icon: Settings,
    roles: ['admin'],
  },
];

export const getVisibleNavigationItems = (items: NavigationItem[], userRole: string) => {
  return items.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(userRole);
  });
};
