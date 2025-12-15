"use client";

import React, { useState } from 'react';
import { 
  IonButton, 
  IonInput, 
  IonItem, 
  IonList, 
  IonIcon, 
  IonText,
  IonSpinner
} from '@ionic/react';
import { logInOutline, lockClosedOutline, mailOutline } from 'ionicons/icons';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import axios from 'axios';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Llamada a nuestra propia API Route (proxy a n8n)
      const res = await axios.post('/api/auth', { email, pass });
      
      const { token, user } = res.data;
      
      if (token && user) {
        auth.setSession(token, user);
        router.push('/home'); // Redirigir a los tabs
      } else {
        throw new Error('Respuesta inválida del servidor');
      }

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Bienvenido</h1>
        <p className="text-gray-500">Inicia sesión para continuar</p>
      </div>

      <IonList className="bg-transparent">
        <IonItem className="rounded-lg mb-2" lines="none">
          <IonIcon slot="start" icon={mailOutline} className="text-gray-500" />
          <IonInput
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onIonInput={(e) => setEmail(e.detail.value!)}
            required
            className="custom-input"
          />
        </IonItem>

        <IonItem className="rounded-lg mb-4" lines="none">
          <IonIcon slot="start" icon={lockClosedOutline} className="text-gray-500" />
          <IonInput
            type="password"
            placeholder="Contraseña"
            value={pass}
            onIonInput={(e) => setPass(e.detail.value!)}
            required
            className="custom-input"
          />
        </IonItem>
      </IonList>

      {error && (
        <IonText color="danger" className="text-center text-sm">
          <p>{error}</p>
        </IonText>
      )}

      <IonButton 
        expand="block" 
        type="submit" 
        disabled={loading}
        className="mt-4"
        shape="round"
      >
        {loading ? <IonSpinner name="crescent" /> : 'Ingresar'}
        {!loading && <IonIcon slot="end" icon={logInOutline} />}
      </IonButton>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-500">
          ¿No tienes cuenta? <span className="text-primary font-bold cursor-pointer">Regístrate</span>
        </p>
      </div>
    </form>
  );
}

