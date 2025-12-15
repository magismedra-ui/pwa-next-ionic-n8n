"use client";

import { IonPage, IonContent } from '@ionic/react';
import LoginForm from '@/components/forms/LoginForm';

export default function LoginPage() {
  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen>
        <div className="flex flex-col h-full justify-center max-w-md mx-auto">
          <div className="mb-10 text-center">
            {/* Placeholder para Logo */}
            <div className="w-24 h-24 bg-gray-200 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl">🚀</span>
            </div>
            <h2 className="text-xl font-bold">Mi App PWA</h2>
          </div>
          
          <LoginForm />
        </div>
      </IonContent>
    </IonPage>
  );
}

