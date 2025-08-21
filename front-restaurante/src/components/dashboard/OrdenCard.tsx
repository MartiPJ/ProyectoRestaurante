// src/components/dashboard/OrdenCard.tsx
'use client';

type OrdenCardProps = {
  mesa: number;
  ordenId: number;
  hora: string;
  items: { nombre: string; cantidad: number; observaciones?: string }[];
  estado: 'pendiente' | 'en proceso' | 'completado';
  tiempoProceso?: number;
  onEstadoChange: (nuevoEstado: 'en proceso' | 'completado') => void;
};

export default function OrdenCard({
  mesa,
  ordenId,
  hora,
  items,
  estado,
  tiempoProceso,
  onEstadoChange,
}: OrdenCardProps) {
  const getEstadoColor = () => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 border-yellow-300';
      case 'en proceso':
        return 'bg-blue-100 border-blue-300';
      case 'completado':
        return 'bg-green-100 border-green-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const getEstadoTextColor = () => {
    switch (estado) {
      case 'pendiente':
        return 'text-yellow-800';
      case 'en proceso':
        return 'text-blue-800';
      case 'completado':
        return 'text-green-800';
      default:
        return 'text-gray-800';
    }
  };

  const formatTiempo = (minutos: number) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    if (horas > 0) {
      return `${horas}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className={`p-4 rounded-lg border-2 shadow-sm ${getEstadoColor()}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg">Mesa {mesa}</h3>
          <p className="text-sm text-gray-600">Orden #{ordenId}</p>
          <p className="text-sm text-gray-600">{hora}</p>
        </div>
        <div className="text-right">
          <span className={`px-2 py-1 rounded text-xs font-medium ${getEstadoTextColor()}`}>
            {estado.toUpperCase()}
          </span>
          {tiempoProceso !== undefined && estado === 'en proceso' && (
            <div className="text-sm mt-1">
              <span className={`font-medium ${tiempoProceso > 30 ? 'text-red-600' : 'text-blue-600'}`}>
                {formatTiempo(tiempoProceso)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold mb-2">Items:</h4>
        <ul className="space-y-1">
          {items.map((item, index) => (
            <li key={index} className="text-sm">
              <div className="flex justify-between">
                <span>{item.cantidad}x {item.nombre}</span>
              </div>
              {item.observaciones && (
                <div className="text-xs text-gray-600 italic ml-4">
                  Obs: {item.observaciones}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex space-x-2">
        {estado === 'pendiente' && (
          <button
            onClick={() => onEstadoChange('en proceso')}
            className="flex-1 py-2 px-3 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
          >
            Iniciar Preparación
          </button>
        )}
        
        {estado === 'en proceso' && (
          <button
            onClick={() => onEstadoChange('completado')}
            className="flex-1 py-2 px-3 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
          >
            Marcar Completado
          </button>
        )}
        
        {estado === 'completado' && (
          <div className="flex-1 py-2 px-3 bg-gray-200 text-gray-600 rounded text-sm text-center">
            Completado ✓
          </div>
        )}
      </div>
    </div>
  );
}