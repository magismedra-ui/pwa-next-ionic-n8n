"use client";

import { useEffect } from 'react';
import { dataService } from '@/services/dataService';
import { IonToast } from '@ionic/react';
import { useState } from 'react';

export default function SyncManager() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    // Handler para cuando vuelve la conexión
    const handleOnline = () => {
      console.log('Conexión detectada. Iniciando sincronización...');
      setToastMessage('Conexión restaurada. Sincronizando datos...');
      setShowToast(true);
      
      // Disparar proceso de la cola
      dataService.processSyncQueue().then(() => {
        console.log('Sincronización completada');
      });
    };

    const handleOffline = () => {
        setToastMessage('Estás offline. Los datos se guardarán localmente.');
        setShowToast(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Intentar sincronizar al montar por si acaso había pendientes
    if (navigator.onLine) {
        dataService.processSyncQueue();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <IonToast
      isOpen={showToast}
      onDidDismiss={() => setShowToast(false)}
      message={toastMessage}
      duration={3000}
      position="bottom"
    />
  );
}

