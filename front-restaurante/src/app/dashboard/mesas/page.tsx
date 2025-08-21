// src/app/dashboard/mesas/page.tsx
'use client';

import { useState, useEffect } from 'react';
import LayoutProvider from '@/components/layout/LayoutProvider';
import MesaCard from '@/components/dashboard/MesaCard';
import Modal from '@/components/ui/Modal';
import MenuItemCard from '@/components/dashboard/MenuItemCard';

type Mesa = {
  id: number;
  numero: number;
  estado: 'disponible' | 'ocupada' | 'reservada';
  ubicacion: string;
};

type MesaAPI = {
  id_mesa: number;
  ubicacion: string;
  disponible: boolean;
};

type Plato = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  disponible: boolean;
  imagen?: string;
};

type ItemOrden = {
  id_plato: number;
  cantidad: number;
  observaciones?: string;
  plato: Plato; // Para mostrar en la UI
};

export default function MesasPage() {
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [menu, setMenu] = useState<Plato[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mesaSeleccionada, setMesaSeleccionada] = useState<Mesa | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [orden, setOrden] = useState<ItemOrden[]>([]);
  const [enviandoOrden, setEnviandoOrden] = useState(false);
  const [showModalAgregarMesa, setShowModalAgregarMesa] = useState(false);
  const [nuevaMesa, setNuevaMesa] = useState({
    ubicacion: '',
    disponible: true
  });

  // Función para transformar datos de la API al formato interno
  const transformMesaData = (mesaAPI: MesaAPI): Mesa => {
    return {
      id: mesaAPI.id_mesa,
      numero: mesaAPI.id_mesa,
      estado: mesaAPI.disponible ? 'disponible' : 'ocupada',
      ubicacion: mesaAPI.ubicacion
    };
  };

  // Función mejorada para obtener el token del localStorage
  const getAuthToken = (): string | null => {
    try {
      let authData = localStorage.getItem('token');
      
      if (!authData) {
        authData = localStorage.getItem('authToken');
      }
      
      if (!authData) {
        console.log('No hay token en localStorage');
        return null;
      }

      try {
        const parsedAuth = JSON.parse(authData);
        if (parsedAuth && parsedAuth.accessToken) {
          return parsedAuth.accessToken;
        }
      } catch (parseError) {
        return authData;
      }

      return null;
    } catch (error) {
      console.error('Error al obtener token:', error);
      return null;
    }
  };

  // Función para cargar las mesas desde la API
  const fetchMesas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No se encontró token de autenticación. Por favor, inicia sesión.');
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch('http://localhost:3001/mesa', {
        method: 'GET',
        headers,
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('authToken');
          throw new Error('Token expirado o inválido. Por favor, inicia sesión nuevamente.');
        }
        
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        try {
          const errorBody = await response.text();
          if (errorBody) {
            errorMessage += ` - ${errorBody}`;
          }
        } catch (e) {
          // Ignorar errores al leer el body
        }
        
        throw new Error(errorMessage);
      }
      
      const mesasAPI: MesaAPI[] = await response.json();
      const mesasTransformadas = mesasAPI.map(transformMesaData);
      
      setMesas(mesasTransformadas);
    } catch (err) {
      console.error('Error al cargar las mesas:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar las mesas');
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar el menú desde la API
  const fetchMenu = async () => {
    try {
      setLoadingMenu(true);
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No se encontró token de autenticación.');
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch('http://localhost:3001/plato', {
        method: 'GET',
        headers,
      });
      
      if (!response.ok) {
        throw new Error(`Error al cargar el menú: ${response.status}`);
      }
      
      const menuData: Plato[] = await response.json();
      setMenu(menuData);
    } catch (err) {
      console.error('Error al cargar el menú:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar el menú');
    } finally {
      setLoadingMenu(false);
    }
  };

  // Cargar mesas al montar el componente
  useEffect(() => {
    fetchMesas();
  }, []);

  // Función para agregar una nueva mesa
  const agregarMesa = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No se encontró token de autenticación.');
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch('http://localhost:3001/mesa', {
        method: 'POST',
        headers,
        body: JSON.stringify(nuevaMesa)
      });
      
      if (!response.ok) {
        throw new Error(`Error al agregar mesa: ${response.status}`);
      }
      
      // Cerrar modal y limpiar formulario
      setShowModalAgregarMesa(false);
      setNuevaMesa({
        ubicacion: '',
        disponible: true
      });
      
      // Actualizar lista de mesas
      await fetchMesas();
    } catch (err) {
      console.error('Error al agregar mesa:', err);
      setError(err instanceof Error ? err.message : 'Error al agregar mesa');
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar una mesa
  const eliminarMesa = async (idMesa: number) => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No se encontró token de autenticación.');
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch(`http://localhost:3001/mesa/${idMesa}`, {
        method: 'DELETE',
        headers
      });
      
      if (!response.ok) {
        throw new Error(`Error al eliminar mesa: ${response.status}`);
      }
      
      // Actualizar lista de mesas
      await fetchMesas();
    } catch (err) {
      console.error('Error al eliminar mesa:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar mesa');
    } finally {
      setLoading(false);
    }
  };

  // Función para desocupar una mesa
  const desocuparMesa = async (idMesa: number) => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No se encontró token de autenticación.');
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch(`http://localhost:3001/mesa/${idMesa}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ disponible: true })
      });
      
      if (!response.ok) {
        throw new Error(`Error al desocupar mesa: ${response.status}`);
      }
      
      // Actualizar lista de mesas
      await fetchMesas();
    } catch (err) {
      console.error('Error al desocupar mesa:', err);
      setError(err instanceof Error ? err.message : 'Error al desocupar mesa');
    } finally {
      setLoading(false);
    }
  };

  // Función para ocupar una mesa
  const ocuparMesa = async (idMesa: number) => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No se encontró token de autenticación.');
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch(`http://localhost:3001/mesa/${idMesa}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ disponible: false })
      });
      
      if (!response.ok) {
        throw new Error(`Error al ocupar mesa: ${response.status}`);
      }
      
      // Actualizar lista de mesas
      await fetchMesas();
    } catch (err) {
      console.error('Error al ocupar mesa:', err);
      setError(err instanceof Error ? err.message : 'Error al ocupar mesa');
    } finally {
      setLoading(false);
    }
  };

  const handleMesaClick = (mesa: Mesa) => {
    setMesaSeleccionada(mesa);
    setShowModal(true);
    setOrden([]);
    // Cargar el menú cuando se abre el modal
    fetchMenu();
    
    // Si la mesa está disponible, ocuparla automáticamente
    if (mesa.estado === 'disponible') {
      ocuparMesa(mesa.id);
    }
  };

  const agregarPlato = (id_plato: number, cantidad: number, observaciones?: string) => {
    const plato = menu.find(p => p.id === id_plato);
    if (plato) {
      const nuevoItem: ItemOrden = {
        id_plato,
        cantidad,
        observaciones,
        plato
      };
      setOrden([...orden, nuevoItem]);
    }
  };

  const eliminarItemOrden = (index: number) => {
    setOrden(orden.filter((_, i) => i !== index));
  };

  const enviarACocina = async () => {
    if (!mesaSeleccionada || orden.length === 0) {
      return;
    }

    try {
      setEnviandoOrden(true);
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No se encontró token de autenticación.');
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      // Enviar cada item de la orden
      for (const item of orden) {
        const ordenData = {
          id_orden: Date.now(), // Temporal, debería venir del backend
          id_plato: item.id_plato,
          cantidad: item.cantidad,
          observaciones: item.observaciones
        };

        const response = await fetch('http://localhost:3001/orden-plato', {
          method: 'POST',
          headers,
          body: JSON.stringify(ordenData)
        });

        if (!response.ok) {
          throw new Error(`Error al enviar item: ${response.status}`);
        }
      }

      console.log('Orden enviada exitosamente:', { mesa: mesaSeleccionada, orden });
      
      // Cerrar modal y limpiar orden
      setShowModal(false);
      setOrden([]);
      
      // Actualizar estado local de la mesa
      setMesas(mesas.map(m => 
        m.id === mesaSeleccionada?.id ? { ...m, estado: 'ocupada' } : m
      ));
      
      // Opcional: recargar las mesas desde la API
      await fetchMesas();
      
    } catch (err) {
      console.error('Error al enviar orden:', err);
      setError(err instanceof Error ? err.message : 'Error al enviar orden');
    } finally {
      setEnviandoOrden(false);
    }
  };

  // Función para refrescar las mesas
  const handleRefresh = () => {
    fetchMesas();
  };

  if (loading) {
    return (
      <LayoutProvider>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Cargando mesas...</div>
          </div>
        </div>
      </LayoutProvider>
    );
  }

  if (error) {
    return (
      <LayoutProvider>
        <div className="p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
          <div className="space-x-2">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Reintentar
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('authToken');
                window.location.href = '/login';
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </LayoutProvider>
    );
  }

  return (
    <LayoutProvider>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestión de Mesas</h1>
          <div className="space-x-2">
            <button
              onClick={() => setShowModalAgregarMesa(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Agregar Mesa
            </button>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Actualizar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {mesas.map((mesa) => (
            <div key={mesa.id} className="relative group">
              <MesaCard
                numero={mesa.numero}
                estado={mesa.estado}
                onClick={() => handleMesaClick(mesa)}
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                {mesa.estado === 'disponible' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      ocuparMesa(mesa.id);
                    }}
                    className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    title="Ocupar mesa"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                )}
                {mesa.estado === 'ocupada' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      desocuparMesa(mesa.id);
                    }}
                    className="p-1 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
                    title="Desocupar mesa"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`¿Estás seguro de eliminar la mesa ${mesa.numero}?`)) {
                      eliminarMesa(mesa.id);
                    }
                  }}
                  className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  title="Eliminar mesa"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <h2 className="font-semibold mb-2">Leyenda:</h2>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <span>Disponible</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              <span>Ocupada</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
              <span>Reservada</span>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Total de mesas: {mesas.length} | Disponibles:{" "}
            {mesas.filter((m) => m.estado === "disponible").length} | Ocupadas:{" "}
            {mesas.filter((m) => m.estado === "ocupada").length}
          </div>
        </div>

        {/* Modal para agregar nueva mesa */}
        <Modal isOpen={showModalAgregarMesa} onClose={() => setShowModalAgregarMesa(false)}>
          <div className="p-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Agregar Nueva Mesa</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ubicación
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={nuevaMesa.ubicacion}
                onChange={(e) => setNuevaMesa({...nuevaMesa, ubicacion: e.target.value})}
                placeholder="Ej: Nivel 1, Terraza, etc."
              />
            </div>
            
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={nuevaMesa.disponible}
                  onChange={(e) => setNuevaMesa({...nuevaMesa, disponible: e.target.checked})}
                  className="rounded"
                />
                <span>Disponible</span>
              </label>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModalAgregarMesa(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={agregarMesa}
                disabled={!nuevaMesa.ubicacion}
                className={`px-4 py-2 rounded-md text-white ${
                  !nuevaMesa.ubicacion
                    ? "bg-gray-400"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Agregar Mesa
              </button>
            </div>
          </div>
        </Modal>

        {/* Modal para ordenar en mesa */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          {mesaSeleccionada && (
            <div className="p-4 max-w-4xl mx-auto">
              <h2 className="text-xl font-bold mb-4">
                Mesa {mesaSeleccionada.numero} - {mesaSeleccionada.ubicacion}
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  mesaSeleccionada.estado === 'disponible' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {mesaSeleccionada.estado.toUpperCase()}
                </span>
              </h2>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Menú</h3>
                {loadingMenu ? (
                  <div className="text-center py-4">Cargando menú...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                    {menu.map((plato, index) => (
                      <MenuItemCard
                        key={`plato-${plato.id}-${index}`} // Usar combinación de id e index
                        id={plato.id}
                        nombre={plato.nombre}
                        descripcion={plato.descripcion}
                        precio={plato.precio}
                        disponible={plato.disponible}
                        imagen={plato.imagen}
                        onAdd={agregarPlato}
                      />
                    ))}
                  </div>
                )}
              </div>

              {orden.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Orden Actual:</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="space-y-2 mb-4">
                      {orden.map((item, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center"
                        >
                          <div>
                            <span className="font-medium">
                              {item.cantidad}x {item.plato.nombre}
                            </span>
                            {item.observaciones && (
                              <div className="text-sm text-gray-600">
                                Obs: {item.observaciones}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span>
                              ${(item.plato.precio * item.cantidad).toFixed(2)}
                            </span>
                            <button
                              onClick={() => eliminarItemOrden(index)}
                              className="text-red-500 hover:text-red-700 px-2"
                            >
                              ×
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t pt-2 font-bold flex justify-between">
                      <span>Total:</span>
                      <span>
                        $
                        {orden
                          .reduce(
                            (total, item) =>
                              total + item.plato.precio * item.cantidad,
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={() => {
                    if (mesaSeleccionada.estado === 'ocupada' && confirm('¿Desocupar esta mesa?')) {
                      desocuparMesa(mesaSeleccionada.id);
                      setShowModal(false);
                    }
                  }}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                  disabled={mesaSeleccionada.estado === 'disponible'}
                >
                  Desocupar Mesa
                </button>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border rounded-md hover:bg-gray-50"
                    disabled={enviandoOrden}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={enviarACocina}
                    disabled={orden.length === 0 || enviandoOrden}
                    className={`px-4 py-2 rounded-md text-white ${
                      orden.length === 0 || enviandoOrden
                        ? "bg-gray-400"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {enviandoOrden ? "Enviando..." : "Enviar a Cocina"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </LayoutProvider>
  );
}