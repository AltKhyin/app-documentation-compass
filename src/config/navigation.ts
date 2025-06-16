
// ABOUTME: Centralized navigation configuration for consistent routing across desktop and mobile.
import { Home, Archive, Users, User, Settings } from 'lucide-react';

export type NavigationItem = {
  icon: React.ElementType;
  label: string;
  path: string;
  mobileLabel?: string; // Optional shorter label for mobile
};

// Single source of truth for all navigation
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

// Additional mobile-specific navigation (if different from main nav)
export const mobileNavigationItems: NavigationItem[] = [
  ...navigationItems.slice(0, 3), // Home, Acervo, Comunidade
  { 
    icon: Settings, 
    label: 'Config', 
    path: '/configuracoes',
    mobileLabel: 'Config'
  },
];
