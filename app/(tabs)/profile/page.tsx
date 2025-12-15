"use client";

import { 
  IonPage, 
  IonContent, 
  IonAvatar, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonIcon, 
  IonButton 
} from '@ionic/react';
import Header from '@/components/ui/Header';
import { auth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { logOutOutline, settingsOutline, shieldCheckOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { User } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(auth.getUser());
  }, []);

  const handleLogout = () => {
    auth.clearSession();
    router.replace('/login');
  };

  return (
    <IonPage>
      <Header title="Perfil" />
      <IonContent>
        <div className="flex flex-col items-center py-8 bg-gray-50 dark:bg-gray-900">
          <IonAvatar className="w-24 h-24 mb-4">
            <img src={user?.avatar || "https://ionicframework.com/docs/img/demos/avatar.svg"} alt="Avatar" />
          </IonAvatar>
          <h2 className="text-xl font-bold">{user?.name || 'Usuario'}</h2>
          <p className="text-gray-500">{user?.email || 'cargando...'}</p>
        </div>

        <IonList inset>
          <IonItem button detail>
            <IonIcon icon={settingsOutline} slot="start" />
            <IonLabel>Configuración</IonLabel>
          </IonItem>
          <IonItem button detail>
            <IonIcon icon={shieldCheckOutline} slot="start" />
            <IonLabel>Seguridad</IonLabel>
          </IonItem>
        </IonList>

        <div className="p-4 mt-4">
          <IonButton expand="block" color="danger" onClick={handleLogout}>
            <IonIcon icon={logOutOutline} slot="start" />
            Cerrar Sesión
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}

