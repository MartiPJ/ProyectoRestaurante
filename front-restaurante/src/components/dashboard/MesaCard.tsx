// src/components/dashboard/MesaCard.tsx
import { FiCoffee } from 'react-icons/fi';

type MesaCardProps = {
  numero: number;
  estado: 'disponible' | 'ocupada' | 'reservada';
  onClick: () => void;
};

export default function MesaCard({ numero, estado, onClick }: MesaCardProps) {
  const estadoColores = {
    disponible: 'bg-green-100 text-green-800',
    ocupada: 'bg-red-100 text-red-800',
    reservada: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-6 rounded-lg shadow-md ${estadoColores[estado]} hover:shadow-lg transition-shadow`}
    >
      <FiCoffee className="text-2xl mb-2" />
      <span className="font-bold">MESA {numero}</span>
      <span className="capitalize">{estado}</span>
    </button>
  );
}