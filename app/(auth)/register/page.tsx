"use client";

import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="flex flex-col h-full justify-center max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Crear Cuenta</h2>
          <p className="text-gray-500 mb-8">
            El registro de usuarios se gestiona centralizadamente. 
            Por favor contacta al administrador.
          </p>
          
          <Link href="/login" passHref legacyBehavior>
            <IonButton expand="block" fill="outline">
              <IonIcon icon={arrowBackOutline} slot="start" />
              Volver al Login
            </IonButton>
          </Link>
        </div>
      </IonContent>
    </IonPage>
  );
}

