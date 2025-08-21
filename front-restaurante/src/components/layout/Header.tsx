// src/components/layout/Header.tsx
'use client';

import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">Sistema de Restaurante</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Bienvenido, {user?.nombre}</span>
          <button
            onClick={logout}
            className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
}