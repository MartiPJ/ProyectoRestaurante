// src/app/dashboard/cocina/page.tsx
'use client';

import { useState, useEffect } from 'react';
import LayoutProvider from '@/components/layout/LayoutProvider';
import OrdenCard from '@/components/dashboard/OrdenCard';

type OrdenPlato = {
  id_ordenPlato: number;
  cantidad: number;
  observaciones?: string;
  orden: {
    id_orden: number;
    mesa?: {
      id_mesa: number;
      ubicacion: string;
    };
    estado: 'pendiente' | 'en proceso' | 'completado';
    fecha_hora: string;
  };
  plato: {
    id_plato: number;
    nombre: string;
  } | null; // Añadido | null para manejar casos donde plato puede ser null
};

type Plato = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  disponible: boolean;
  imagen?: string;
};

type Orden = {
  id: number;
  mesa: number;
  hora: string;
  items: { nombre: string; cantidad: number; observaciones?: string }[];
  estado: 'pendiente' | 'en proceso' | 'completado';
  tiempoProceso?: number;
};

export default function CocinaPage() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [platos, setPlatos] = useState<Plato[]>([]);

  // Función para obtener el token del localStorage
  const getAuthToken = (): string | null => {
    try {
      let authData = localStorage.getItem("token");

      if (!authData) {
        authData = localStorage.getItem("authToken");
      }

      if (!authData) {
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
      console.error("Error al obtener token:", error);
      return null;
    }
  };

  // Nueva función para obtener las órdenes con información de mesa
  const fetchOrdenesCompletas = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();

      if (!token) {
        throw new Error("No se encontró token de autenticación.");
      }
      console.log("ordenes en proceso:", ordenes.filter((o) => o.estado === "en proceso").map((o) => o.id));

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // Obtener ambas fuentes de datos
      const [ordenesResponse, ordenPlatoResponse] = await Promise.all([
        fetch("http://localhost:3001/orden", { method: "GET", headers }),
        fetch("http://localhost:3001/orden-plato", { method: "GET", headers }),
      ]);

      if (!ordenesResponse.ok || !ordenPlatoResponse.ok) {
        throw new Error(`Error al cargar las órdenes`);
      }

      const ordenesData = await ordenesResponse.json();
      const ordenesPlatoData = await ordenPlatoResponse.json();

      // Crear un mapa de órdenes con su información de mesa
      const ordenesMap = new Map<number, Orden>();

      ordenesData.forEach((orden: any) => {
        ordenesMap.set(orden.id_orden, {
          id: orden.id_orden,
          mesa: orden.mesa?.id_mesa || 0, // Usar el id_mesa o 0 si no hay
          hora: new Date(orden.fecha_hora).toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          items: [],
          estado: orden.estado,
        });
      });

      // Agregar los items a cada orden
      ordenesPlatoData.forEach((item: any) => {
        // Verificar si item.plato existe y tiene id_plato
        if (!item.plato || !item.plato.id_plato) {
          console.warn("Item sin plato válido:", item);
          return; // Saltar este item si no tiene plato válido
        }

        const plato = platos.find((p) => p.id === item.plato.id_plato);
        const nombrePlato = plato
          ? plato.nombre
          : `Plato ${item.plato.id_plato}`;

        const ordenItem = {
          nombre: nombrePlato,
          cantidad: item.cantidad,
          observaciones: item.observaciones,
        };

        const ordenId = item.orden?.id_orden;
        if (!ordenId) {
          console.warn("Orden sin ID:", item);
          return;
        }

        if (ordenesMap.has(ordenId)) {
          ordenesMap.get(ordenId)!.items.push(ordenItem);
        } else {
          ordenesMap.set(ordenId, {
            id: ordenId,
            mesa: item.orden?.mesa?.id_mesa || 0,
            hora: new Date(item.orden?.fecha_hora).toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            items: [ordenItem],
            estado: item.orden?.estado || "pendiente",
          });
        }

      });

      // Convertir el mapa a array
      setOrdenes(Array.from(ordenesMap.values()));
    } catch (err) {
      console.error("Error al cargar las órdenes:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Error desconocido al cargar las órdenes"
      );
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar los platos (para obtener nombres)
  const fetchPlatos = async () => {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error("No se encontró token de autenticación.");
      }

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch("http://localhost:3001/plato", {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        throw new Error(`Error al cargar los platos: ${response.status}`);
      }

      const platosData: Plato[] = await response.json();
      setPlatos(platosData);
    } catch (err) {
      console.error("Error al cargar los platos:", err);
    }
  };

  // Función para cargar las órdenes desde la API
  const fetchOrdenes = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();

      if (!token) {
        throw new Error("No se encontró token de autenticación.");
      }

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch("http://localhost:3001/orden-plato", {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        throw new Error(`Error al cargar las órdenes: ${response.status}`);
      }

      const ordenesData: OrdenPlato[] = await response.json();

      // Agrupar órdenes por id_orden
      const ordenesAgrupadas = ordenesData.reduce((acc, item) => {
        const existingOrden = acc.find((orden) => orden.id === item.orden.id_orden);
        console.log("item 1", item); // Verifica la estructura completa del objeto
        
        // Verificar si item.plato existe antes de acceder a sus propiedades
        if (!item.plato || !item.plato.id_plato) {
          console.warn("Item sin plato válido:", item);
          return acc; // Saltar este item si no tiene plato válido
        }

        const plato = item.plato ? platos.find((p) => p.id === item.plato!.id_plato) : undefined;
        const nombrePlato = item.plato
          ? (plato ? plato.nombre : `Plato ${item.plato.id_plato}`)
          : "Plato desconocido";
        console.log("item 2", item.plato); // Debería mostrarte el objeto plato o null
        
        const ordenItem = {
          nombre: nombrePlato,
          cantidad: item.cantidad,
          observaciones: item.observaciones,
        };

        if (existingOrden) {
          existingOrden.items.push(ordenItem);
        } else {
          acc.push({
            id: item.orden.id_orden,
            mesa: item.orden.mesa?.id_mesa || 0, // Usar el id_mesa o 0 si no hay
            hora: new Date().toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            items: [ordenItem],
            estado: "pendiente" as const,
          });
        }

        return acc;
      }, [] as Orden[]);

      setOrdenes(ordenesAgrupadas);
    } catch (err) {
      console.error("Error al cargar las órdenes:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Error desconocido al cargar las órdenes"
      );
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      await fetchPlatos(); // Espera a que se carguen los platos
      await fetchOrdenes(); // Luego carga las órdenes
    };
    loadData();
  }, []);

  // Recargar órdenes cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrdenesCompletas(); // Usar la nueva función
    }, 30000);

    return () => clearInterval(interval);
  }, [platos]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchPlatos();
        await fetchOrdenesCompletas(); // Usar la nueva función
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  // Actualizar tiempo de proceso cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      setOrdenes(
        ordenes.map((orden) => {
          if (
            orden.estado === "en proceso" &&
            orden.tiempoProceso !== undefined
          ) {
            return { ...orden, tiempoProceso: orden.tiempoProceso + 1 };
          }
          return orden;
        })
      );
    }, 60000);

    return () => clearInterval(interval);
  }, [ordenes]);

  const handleEstadoChange = (
    ordenId: number,
    nuevoEstado: "en proceso" | "completado"
  ) => {
    setOrdenes(
      ordenes.map((orden) => {
        if (orden.id === ordenId) {
          const updatedOrden = { ...orden, estado: nuevoEstado };
          if (nuevoEstado === "en proceso") {
            updatedOrden.tiempoProceso = 0;
          }
          return updatedOrden;
        }
        return orden;
      })
    );
  };

  const handleRefresh = () => {
    fetchOrdenes();
  };

  if (loading) {
    return (
      <LayoutProvider>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Cargando órdenes...</div>
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
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </LayoutProvider>
    );
  }

  return (
    <LayoutProvider>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Panel de Cocina</h1>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Actualizar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h2 className="font-bold mb-4 text-lg">
              Pendientes (
              {ordenes.filter((orden) => orden.estado === "pendiente").length})
            </h2>
            <div className="space-y-4">
              {ordenes
                .filter((orden) => orden.estado === "pendiente")
                .map((orden, index) => (
                  <OrdenCard
                    key={`orden-${orden.id}-${index}`}
                    mesa={orden.mesa}
                    ordenId={orden.id}
                    hora={orden.hora}
                    items={orden.items}
                    estado={orden.estado}
                    onEstadoChange={(nuevoEstado) =>
                      handleEstadoChange(orden.id, nuevoEstado)
                    }
                  />
                ))}
              {ordenes.filter((orden) => orden.estado === "pendiente")
                .length === 0 && (
                <div className="text-gray-500 text-center py-8">
                  No hay órdenes pendientes
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-bold mb-4 text-lg">
              En Proceso (
              {ordenes.filter((orden) => orden.estado === "en proceso").length})
            </h2>
            <div className="space-y-4">
              {ordenes
                .filter((orden) => orden.estado === "en proceso")
                .map((orden) => (
                  <OrdenCard
                    key={orden.id}
                    mesa={orden.mesa}
                    ordenId={orden.id}
                    hora={orden.hora}
                    items={orden.items}
                    estado={orden.estado}
                    tiempoProceso={orden.tiempoProceso}
                    onEstadoChange={(nuevoEstado) =>
                      handleEstadoChange(orden.id, nuevoEstado)
                    }
                  />
                ))}
              {ordenes.filter((orden) => orden.estado === "en proceso")
                .length === 0 && (
                <div className="text-gray-500 text-center py-8">
                  No hay órdenes en proceso
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-bold mb-4 text-lg">
              Completados (
              {ordenes.filter((orden) => orden.estado === "completado").length})
            </h2>
            <div className="space-y-4">
              {ordenes
                .filter((orden) => orden.estado === "completado")
                .map((orden) => (
                  <OrdenCard
                    key={orden.id}
                    mesa={orden.mesa}
                    ordenId={orden.id}
                    hora={orden.hora}
                    items={orden.items}
                    estado={orden.estado}
                    onEstadoChange={(nuevoEstado) =>
                      handleEstadoChange(orden.id, nuevoEstado)
                    }
                  />
                ))}
              {ordenes.filter((orden) => orden.estado === "completado")
                .length === 0 && (
                <div className="text-gray-500 text-center py-8">
                  No hay órdenes completadas
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <h2 className="font-semibold mb-2">Estadísticas del día:</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {ordenes.filter((o) => o.estado === "pendiente").length}
              </div>
              <div className="text-sm text-gray-600">Pendientes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {ordenes.filter((o) => o.estado === "en proceso").length}
              </div>
              <div className="text-sm text-gray-600">En Proceso</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {ordenes.filter((o) => o.estado === "completado").length}
              </div>
              <div className="text-sm text-gray-600">Completadas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">
                {ordenes.length}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </div>
      </div>
    </LayoutProvider>
  );
}