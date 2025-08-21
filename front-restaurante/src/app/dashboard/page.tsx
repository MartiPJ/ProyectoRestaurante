// src/app/dashboard/page.tsx
import LayoutProvider from '@/components/layout/LayoutProvider';
import Link from 'next/dist/client/link';

export default function DashboardPage() {
  return (
    <LayoutProvider>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Panel Principal</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Aquí irán los componentes de estadísticas */}
          <Link
              href="/dashboard/mesas"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              Ir a Mesas
            </Link>
            <Link
              href="/dashboard/cocina"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              Ir a Cocina
            </Link>
        </div>
      </div>
    </LayoutProvider>
  );
}