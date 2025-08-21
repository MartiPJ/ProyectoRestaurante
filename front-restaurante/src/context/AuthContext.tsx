// src/context/AuthContext.tsx (versión simplificada)
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: number;
  nombre: string;
  rol: 'admin' | 'mesero' | 'cocinero' | 'cajero';
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Función para inicializar el estado de autenticación
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        console.log('Inicializando auth:', { hasUser: !!storedUser, hasToken: !!storedToken });
        
        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          console.log('Usuario restaurado desde localStorage:', userData);
        }
      } catch (error) {
        console.error('Error al restaurar usuario:', error);
        // Limpiar localStorage si hay datos corruptos
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    // Pequeño delay para evitar hidration issues
    const timer = setTimeout(initializeAuth, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      console.log('=== INICIANDO LOGIN ===');
      console.log('Intentando login para:', username);
      
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      console.log('AuthContext - Respuesta del servidor:', data);
      
      if (response.ok && data.success) {
        const userData = {
          id: data.user.id,
          nombre: data.user.nombre,
          rol: data.user.rol
        };
        
        console.log('=== GUARDANDO DATOS ===');
        console.log('Datos del usuario a guardar:', userData);
        
        // Primero guardar en localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', data.token);
        
        // Verificar que se guardó correctamente
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('token');
        console.log('Verificación de guardado:', { 
          savedUser, 
          savedToken: savedToken ? 'exists' : 'null' 
        });
        
        // Luego actualizar el estado
        setUser(userData);
        console.log('Estado de usuario actualizado');
        
        // Redirigir después de un pequeño delay
        setTimeout(() => {
          console.log('=== REDIRIGIENDO A DASHBOARD ===');
          router.push('/dashboard');
        }, 200);
      } else {
        throw new Error(data.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('Cerrando sesión');
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/login');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  // Debug log
  console.log('AuthContext render:', { 
    hasUser: !!user, 
    isAuthenticated: !!user, 
    loading,
    userName: user?.nombre 
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}