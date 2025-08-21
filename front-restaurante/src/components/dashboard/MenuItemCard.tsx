// src/components/dashboard/MenuItemCard.tsx
'use client';

import { useState } from 'react';

type MenuItemCardProps = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  disponible: boolean;
  imagen?: string;
  onAdd: (id: number, cantidad: number, observaciones?: string) => void;
};

export default function MenuItemCard({
  id,
  nombre,
  descripcion,
  precio,
  disponible,
  imagen,
  onAdd,
}: MenuItemCardProps) {
  const [cantidad, setCantidad] = useState(1);
  const [observaciones, setObservaciones] = useState('');
  const [showObservaciones, setShowObservaciones] = useState(false);

  const handleAdd = () => {
    if (disponible) {
      onAdd(id, cantidad, observaciones.trim() || undefined);
      setCantidad(1);
      setObservaciones('');
      setShowObservaciones(false);
    }
  };

  const incrementarCantidad = () => setCantidad(prev => prev + 1);
  const decrementarCantidad = () => setCantidad(prev => Math.max(1, prev - 1));

  return (
    <div className={`p-4 border rounded-lg ${disponible ? 'bg-white' : 'bg-gray-100'} shadow-sm`}>
      {imagen && (
        <img 
          src={imagen} 
          alt={nombre} 
          className="w-full h-32 object-cover rounded-md mb-3"
        />
      )}
      
      <h3 className={`font-semibold text-lg ${!disponible ? 'text-gray-500' : ''}`}>
        {nombre}
      </h3>
      
      <p className={`text-sm mb-2 ${!disponible ? 'text-gray-400' : 'text-gray-600'}`}>
        {descripcion}
      </p>
      
      <div className="flex justify-between items-center mb-3">
        <span className={`font-bold text-lg ${!disponible ? 'text-gray-500' : 'text-green-600'}`}>
          ${precio.toFixed(2)}
        </span>
        {!disponible && (
          <span className="text-red-500 text-sm font-medium">No disponible</span>
        )}
      </div>

      {disponible && (
        <div className="space-y-3">
          {/* Selector de cantidad */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Cantidad:</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={decrementarCantidad}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
              >
                -
              </button>
              <span className="w-8 text-center font-medium">{cantidad}</span>
              <button
                onClick={incrementarCantidad}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Botón para mostrar observaciones */}
          <button
            onClick={() => setShowObservaciones(!showObservaciones)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showObservaciones ? 'Ocultar' : 'Agregar'} observaciones
          </button>

          {/* Campo de observaciones */}
          {showObservaciones && (
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Observaciones especiales (opcional)"
              className="w-full p-2 border rounded-md text-sm"
              rows={2}
            />
          )}

          {/* Botón de agregar */}
          <button
            onClick={handleAdd}
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Agregar ${(precio * cantidad).toFixed(2)}
          </button>
        </div>
      )}
    </div>
  );
}