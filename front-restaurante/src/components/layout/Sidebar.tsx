// src/components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiUsers, FiCoffee, FiClock, FiPieChart, FiSettings } from 'react-icons/fi';

type SidebarProps = {
  userRole: 'admin' | 'mesero' | 'cocinero' | 'cajero' | undefined;
};

export default function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', icon: <FiHome />, label: 'Inicio', roles: ['admin', 'mesero', 'cocinero', 'cajero'] },
    { href: '/dashboard/mesas', icon: <FiCoffee />, label: 'Mesas', roles: ['admin', 'mesero'] },
    { href: '/dashboard/cocina', icon: <FiClock />, label: 'Cocina', roles: ['admin', 'cocinero'] },
    { href: '/dashboard/administracion', icon: <FiPieChart />, label: 'Administración', roles: ['admin'] },
    { href: '/dashboard/usuarios', icon: <FiUsers />, label: 'Usuarios', roles: ['admin'] },
  ];

  const filteredNavItems = navItems.filter(item => 
    userRole && item.roles.includes(userRole)
  );

  return (
    <aside className="w-64 bg-white shadow-sm">
      <nav className="p-4">
        <ul className="space-y-2">
          {filteredNavItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center px-4 py-2 rounded-md ${pathname === item.href ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}