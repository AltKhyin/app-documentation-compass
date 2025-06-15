
// ABOUTME: The primary navigation for mobile viewports, fixed to the bottom.
import React from 'react';
import { Home, Users, BookMarked, CircleUserRound } from 'lucide-react';
import NavItem from './NavItem';

const navItems = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/acervo', label: 'Acervo', icon: BookMarked },
  { href: '/comunidade', label: 'Comunidade', icon: Users },
  { href: '/perfil', label: 'Perfil', icon: CircleUserRound },
];

const BottomTabBar = () => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-10 border-t bg-background">
      <div className="grid h-16 grid-cols-4 items-center">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </div>
    </nav>
  );
};

export default BottomTabBar;
