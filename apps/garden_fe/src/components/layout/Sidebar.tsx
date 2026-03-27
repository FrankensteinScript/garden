'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Home, BarChart3, Bell, Settings } from 'lucide-react';

import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Prehled', icon: LayoutDashboard },
  { href: '/dashboard/rooms', label: 'Mistnosti', icon: Home },
  { href: '/dashboard/grafy', label: 'Grafy', icon: BarChart3 },
  { href: '/dashboard/notifications', label: 'Upozorneni', icon: Bell },
  { href: '/dashboard/settings', label: 'Nastaveni', icon: Settings },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn('hidden h-[calc(100vh-3.5rem)] w-64 border-r bg-white md:flex md:flex-col', onNavigate && 'flex')}>
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
