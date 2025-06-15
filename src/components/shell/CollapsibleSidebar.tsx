
// ABOUTME: The main desktop navigation sidebar, which can be collapsed.
import React from 'react';
import {
  Home,
  Users,
  BookMarked,
  ChevronsLeft,
  CircleUserRound,
} from 'lucide-react';
import NavItem from './NavItem';
import UserProfileBlock from './UserProfileBlock';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import RLogo from '../icons/RLogo';

const navItems = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/acervo', label: 'Acervo', icon: BookMarked },
  { href: '/comunidade', label: 'Comunidade', icon: Users },
  { href: '/perfil', label: 'Perfil', icon: CircleUserRound },
];

type CollapsibleSidebarProps = {
  isCollapsed: boolean;
  onToggle: () => void;
};

const CollapsibleSidebar = ({ isCollapsed, onToggle }: CollapsibleSidebarProps) => {
  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col fixed inset-y-0 left-0 z-10 border-r bg-background transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-20' : 'w-60'
      )}
    >
      <div className="flex h-16 items-center px-4 border-b">
        {isCollapsed ? (
          <RLogo className="h-8 w-8 text-foreground mx-auto" />
        ) : (
          <h1 className="font-serif font-medium tracking-tight text-3xl text-black flex items-center">
            Reviews.
          </h1>
        )}
      </div>
      <nav className="flex-1 flex flex-col gap-1 p-2">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} isCollapsed={isCollapsed} />
        ))}
      </nav>
      <div className="border-t">
        <Button onClick={onToggle} variant="ghost" className={cn('w-full h-14 justify-end', isCollapsed && 'justify-center')}>
          <ChevronsLeft className={cn('h-5 w-5 transition-transform', isCollapsed && 'rotate-180')} />
        </Button>
      </div>
      <div className="border-t">
        <UserProfileBlock isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
};

export default CollapsibleSidebar;
