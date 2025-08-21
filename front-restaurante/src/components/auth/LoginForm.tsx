// src/components/auth/LoginForm.tsx
'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('LoginForm - Iniciando login para:', username);
      await login(username, password);
      console.log('LoginForm - Login exitoso');
      // El AuthContext se encarga de la redirección
    } catch (err: any) {
      console.error('LoginForm - Error:', err);
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="username">
            Usuario
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
      
      {/* Botón de prueba temporal - REMOVER EN PRODUCCIÓN */}
      <button 
        onClick={() => {
          console.log('=== PRUEBA MANUAL ===');
          const testUser = { id: 1, nombre: 'Test User', rol: 'admin' as const };
          localStorage.setItem('user', JSON.stringify(testUser));
          localStorage.setItem('token', 'test-token');
          console.log('Datos guardados manualmente');
          window.location.reload();
        }}
        className="w-full mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Prueba Manual (Temporal)
      </button>
    </div>
  );
}