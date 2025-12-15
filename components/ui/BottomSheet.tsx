"use client";

import { IonModal, IonContent, IonToolbar, IonTitle, IonButtons, IonButton } from '@ionic/react';
import React from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onDismiss: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function BottomSheet({ isOpen, onDismiss, title, children }: BottomSheetProps) {
  return (
    <IonModal 
      isOpen={isOpen} 
      onDidDismiss={onDismiss}
      initialBreakpoint={0.5}
      breakpoints={[0, 0.5, 0.9]}
      handleBehavior="cycle"
    >
      <IonContent className="ion-padding">
        {title && (
          <div className="text-center mb-4 border-b pb-2">
             <h3 className="text-lg font-bold">{title}</h3>
          </div>
        )}
        {children}
      </IonContent>
    </IonModal>
  );
}

