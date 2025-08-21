
// src/app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-6">
            Sistema de Gestión para Restaurantes
          </h1>
          
          <p className="text-xl text-gray-600 mb-10">
            Una solución completa para administrar mesas, órdenes y cocina de tu restaurante
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/login"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              Iniciar Sesión
            </Link>
            
            <Link
              href="/about"
              className="px-8 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg shadow-sm hover:bg-blue-50 transition-colors text-lg font-medium"
            >
              Conoce más
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            title="Gestión de Mesas"
            description="Controla el estado de tus mesas en tiempo real"
            icon="🍽️"
          />
          <FeatureCard 
            title="Panel de Cocina"
            description="Sistema eficiente para manejar órdenes"
            icon="👨‍🍳"
          />
          <FeatureCard 
            title="Reportes"
            description="Genera reportes de ventas y desempeño"
            icon="📊"
          />
        </div>
      </div>
    </main>
  );
}

type FeatureCardProps = {
  title: string;
  description: string;
  icon: string;
};

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}