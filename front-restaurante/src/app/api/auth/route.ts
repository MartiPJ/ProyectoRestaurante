// src/app/api/auth/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    console.log('API Route - Datos recibidos:', { username, password });
    
    // Llamada a tu backend en localhost:3001
    const response = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre: username, password }),
    });
    
    const data = await response.json();
    console.log('API Route - Respuesta del backend:', data);
    
    if (response.ok) {
      // Asumiendo que tu backend devuelve algo como:
      // { accessToken: "...", user: { id, nombre, rol } }
      return NextResponse.json({ 
        success: true, 
        token: data.accessToken,
        user: data.user || { 
          id: data.id, 
          nombre: data.nombre, 
          rol: data.rol 
        }
      });
    } else {
      console.log('API Route - Error del backend:', data);
      return NextResponse.json({ 
        success: false, 
        message: data.message || 'Credenciales incorrectas' 
      }, { status: 401 });
    }
  } catch (error) {
    console.error('API Route - Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error de conexión con el servidor' 
    }, { status: 500 });
  }
}