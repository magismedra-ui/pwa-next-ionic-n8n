"use client";

import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon } from '@ionic/react';
import { notificationsOutline, logOutOutline } from 'ionicons/icons';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    // Limpiamos la sesión y redirigimos al login
    auth.clearSession();
    router.replace('/login');
  };

  return (
    <IonHeader translucent={true} className="shadow-none">
      <IonToolbar>
        <IonTitle>{title}</IonTitle>
        <IonButtons slot="end">
          <IonButton onClick={handleLogout} color="danger">
            <IonIcon icon={logOutOutline} />
          </IonButton>
          <IonButton>
            <IonIcon icon={notificationsOutline} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
}
