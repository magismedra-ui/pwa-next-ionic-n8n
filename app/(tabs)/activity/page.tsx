"use client";

import { IonPage, IonContent, IonList, IonItem, IonLabel, IonNote, IonIcon } from '@ionic/react';
import Header from '@/components/ui/Header';
import { timeOutline } from 'ionicons/icons';

export default function ActivityPage() {
  const activities = [
    { id: 1, title: 'Login detectado', time: 'Hace 5 min', type: 'security' },
    { id: 2, title: 'Sincronización n8n', time: 'Hace 1 hora', type: 'sync' },
    { id: 3, title: 'Actualización de perfil', time: 'Ayer', type: 'user' },
  ];

  return (
    <IonPage>
      <Header title="Actividad" />
      <IonContent>
        <IonList inset>
          {activities.map((act) => (
            <IonItem key={act.id} button detail>
              <IonIcon icon={timeOutline} slot="start" color="primary" />
              <IonLabel>
                <h2>{act.title}</h2>
                <p>Sistema</p>
              </IonLabel>
              <IonNote slot="end" className="text-xs">{act.time}</IonNote>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}

