"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ListMusic, Store, BarChart2, Settings, LogOut, Menu, BookOpen, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useMyuze } from '@/context/MyuzeContext';
import { MadeWithDyad } from './made-with-dyad';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Biblioteca', path: '/library', icon: BookOpen },
  { name: 'Playlists', path: '/playlists', icon: ListMusic },
  { name: 'Instalações', path: '/installations', icon: Store }, // Changed 'Lojas' to 'Instalações' and path
  { name: 'Relatórios', path: '/reports', icon: BarChart2 },
  { name: 'Configurações', path: '/settings', icon: Settings },
];

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { logout, currentUser } = useMyuze();
  const location = useLocation();
  const isMobile = useIsMobile();

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-myuze-black text-myuze-white p-4">
      <div className="mb-8 text-center">
        <img src="/logo/logomyuzew.png" alt="Myuze Logo" className="h-16 mx-auto" />
      </div>
      <div className="flex-grow space-y-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">NAVEGAÇÃO</p>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.name} to={item.path}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-sm py-3 px-4 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-myuze-purple text-myuze-white hover:bg-myuze-purple/90'
                      : 'text-gray-300 hover:bg-myuze-gray-translucent hover:text-myuze-white'
                  }`}
                >
                  <Icon className="mr-4 h-6 w-6" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto pt-4 border-t border-gray-700">
        {currentUser && (
          <div className="text-sm text-gray-400 mb-2 text-center">
            Logado como: <span className="font-medium text-myuze-white">{currentUser.email}</span>
          </div>
        )}
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start text-sm py-3 px-4 rounded-lg text-red-400 hover:bg-myuze-gray-translucent hover:text-red-300"
        >
          <LogOut className="mr-4 h-6 w-6" />
          Sair
        </Button>
        <MadeWithDyad />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-myuze-black to-myuze-purple">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="w-64 flex-shrink-0 border-r border-gray-800 shadow-lg">
          <SidebarContent />
        </aside>
      )}

      <div className="flex flex-col flex-grow">
        {/* Mobile Header with Menu */}
        {isMobile && (
          <header className="bg-myuze-black p-4 flex items-center justify-between shadow-md">
            <img src="/logo/logomyuzew.png" alt="Myuze Logo" className="h-10" />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-myuze-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 border-none bg-myuze-black">
                <SidebarContent />
              </SheetContent>
            </Sheet>
          </header>
        )}

        {/* Main Content */}
        <main className="flex-grow p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;