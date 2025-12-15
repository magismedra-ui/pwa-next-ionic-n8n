import { NextResponse } from "next/server";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, pass } = body;

    // Conexión con n8n u otro backend
    // Se recomienda usar variables de entorno: N8N_AUTH_URL
    const N8N_WEBHOOK_URL = process.env.N8N_AUTH_URL;

    if (!N8N_WEBHOOK_URL) {
      console.error("N8N_AUTH_URL no está definida.");
      return NextResponse.json(
        {
          message: "Error de configuración del servidor (URL de Auth faltante)",
        },
        { status: 500 }
      );
    }

    // Enviamos los datos reales ingresados en el formulario
    const response = await axios.post(N8N_WEBHOOK_URL, {
      email,
      password: pass,
      accion: "Login",
    });

    // 1. Obtener el token de la respuesta de n8n
    // Soporta si n8n devuelve { "token": "..." } o texto plano directo
    const data = response.data;
    const token = data.token || (typeof data === "string" ? data : null);

    if (!token) {
      console.error("Respuesta n8n sin token:", data);
      return NextResponse.json(
        { message: "El servidor no devolvió un token válido" },
        { status: 502 }
      );
    }

    // 2. Decodificar el token para extraer datos del usuario
    let user;
    try {
      const decoded: any = jwtDecode(token);

      // Mapeamos los campos estándares JWT o fallbacks
      user = {
        id: decoded.id || decoded.sub || "user_id",
        name:
          decoded.name ||
          decoded.nombre ||
          decoded.username ||
          email.split("@")[0],
        email: decoded.email || email,
        avatar: decoded.avatar || decoded.picture || undefined,
      };
    } catch (decodeError) {
      console.error("Error decodificando token:", decodeError);
      return NextResponse.json(
        { message: "Token inválido recibido del servidor" },
        { status: 502 }
      );
    }

    // 3. Retornar estructura combinada al frontend
    return NextResponse.json({
      token,
      user,
    });
  } catch (error: any) {
    console.error("Auth Error:", error.message);

    // Manejo de errores específicos del backend
    if (error.response) {
      return NextResponse.json(
        { message: error.response.data?.message || "Credenciales inválidas" },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { message: "Error de conexión con el servidor de autenticación" },
      { status: 500 }
    );
  }
}
