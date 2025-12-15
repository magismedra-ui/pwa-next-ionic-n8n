"use client";

import {
  IonPage,
  IonContent,
  IonList,
  IonListHeader,
  IonLabel,
  IonItem,
  IonIcon,
  IonButton,
  IonButtons,
  IonBackButton
} from "@ionic/react";
import { 
  createOutline, 
  checkmarkCircleOutline, 
  ellipseOutline,
  arrowBackOutline
} from "ionicons/icons";
import Header from "@/components/ui/Header";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function GroupDetailPage() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  // Datos de ejemplo para la lista
  const games = [
    { name: "Pokémon Yellow", status: "active" },
    { name: "Mega Man X", status: "inactive" },
    { name: "The Legend of Zelda", status: "active" },
    { name: "Pac-Man", status: "inactive" },
    { name: "Super Mario World", status: "active" },
  ];

  return (
    <IonPage>
      {/* Header personalizado con botón de volver */}
      <Header title={`Detalle Grupo ${id}`} />
      
      {/* Botón flotante o barra superior secundaria para volver si el header principal no lo soporta directamente */}
      <div className="bg-white dark:bg-black px-4 py-2 flex items-center border-b border-gray-100 dark:border-gray-800">
          <IonButton fill="clear" size="small" onClick={() => router.back()}>
              <IonIcon slot="icon-only" icon={arrowBackOutline} />
              <span className="ml-2 text-sm">Volver</span>
          </IonButton>
      </div>

      <IonContent>
        <IonList inset>
          <IonListHeader>
            <IonLabel className="text-xl font-bold">Video Games</IonLabel>
          </IonListHeader>
          
          {games.map((game, index) => (
            <IonItem key={index}>
              <IonLabel>{game.name}</IonLabel>
              
              {/* Iconos de acciones/estado */}
              <div className="flex items-center gap-2" slot="end">
                 {/* Icono de Estado */}
                 <IonIcon 
                    icon={game.status === 'active' ? checkmarkCircleOutline : ellipseOutline} 
                    color={game.status === 'active' ? 'success' : 'medium'}
                    title="Estado"
                 />
                 
                 {/* Botón de Editar */}
                 <IonButton fill="clear" size="small">
                    <IonIcon slot="icon-only" icon={createOutline} />
                 </IonButton>
              </div>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}

