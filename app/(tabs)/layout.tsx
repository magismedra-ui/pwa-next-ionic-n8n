"use client";

import React from 'react';
import { 
  IonTabs, 
  IonTabBar, 
  IonTabButton, 
  IonIcon, 
  IonLabel,
  IonPage,
  IonRouterOutlet
} from '@ionic/react';
import { homeOutline, personOutline, pulseOutline } from 'ionicons/icons';
import { usePathname, useRouter } from 'next/navigation';

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Función para manejar navegación manual para evitar conflictos
  // Aunque IonTabButton tiene href, manejarlo con router de next da más control
  const navigate = (path: string) => {
    router.push(path);
  };

  return (
    // En App Router, no usamos IonTabs con IonRouterOutlet de la forma tradicional SPA
    // En su lugar, renderizamos los hijos y una TabBar fija abajo.
    // Usamos un div con flex para simular la estructura
    <div className="flex flex-col h-screen w-full">
      <div className="flex-1 overflow-hidden relative">
        {/* Aquí se renderizan las pages (children) */}
        {children}
      </div>

      <IonTabBar slot="bottom" className="border-t border-gray-100 dark:border-gray-800">
        <IonTabButton 
          tab="home" 
          selected={pathname === '/home'}
          onClick={() => navigate('/home')}
        >
          <IonIcon icon={homeOutline} />
          <IonLabel>Inicio</IonLabel>
        </IonTabButton>

        <IonTabButton 
          tab="activity" 
          selected={pathname === '/activity'}
          onClick={() => navigate('/activity')}
        >
          <IonIcon icon={pulseOutline} />
          <IonLabel>Actividad</IonLabel>
        </IonTabButton>

        <IonTabButton 
          tab="profile" 
          selected={pathname === '/profile'}
          onClick={() => navigate('/profile')}
        >
          <IonIcon icon={personOutline} />
          <IonLabel>Perfil</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </div>
  );
}

