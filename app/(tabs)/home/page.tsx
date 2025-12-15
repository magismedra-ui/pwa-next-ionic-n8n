"use client";

import {
  IonContent,
  IonPage,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import Header from "@/components/ui/Header";
import { auth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { User } from "@/types";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    setUser(auth.getUser());
  }, []);

  const doRefresh = (event: CustomEvent) => {
    setTimeout(() => {
      event.detail.complete();
    }, 2000);
  };

  return (
    <IonPage>
      <Header title="Inicio" />
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="p-4 pb-0">
          <IonCard className="mx-0 mb-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <IonCardHeader>
              <IonCardSubtitle className="text-blue-100 text-center">
                Código: 10149
              </IonCardSubtitle>
              <IonCardTitle className="text-white text-center">
                Congregación Alto Bosque
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="text-blue-50 text-center">
              Hola, {user?.name || "Invitado"}
            </IonCardContent>
          </IonCard>

          <h3 className="text-lg font-semibold mb-2">
            Asistencia a las reuniones
          </h3>
        </div>

        {/* Scroll Horizontal Container 1 */}
        <div className="flex overflow-x-auto pb-6 px-4 space-x-4 scrollbar-hide snap-x">
          {[1, 2, 3, 4, 5].map((i) => (
            <IonCard
              key={i}
              className="mx-0 m-0 min-w-[65vw] max-w-[65vw] snap-start"
            >
              <IonCardHeader>
                <IonCardSubtitle>Info</IonCardSubtitle>
                <IonCardTitle className="text-lg">Grupo {i}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>
                  <strong>Capitán:</strong> capitan {i}
                </p>
                <p>
                  <strong>Auxiliar:</strong> auxiliar {i}
                </p>
                <p>
                  <strong>Miembros:</strong> 20
                </p>
                <p>
                  <strong>Informaron:</strong> 10
                </p>
              </IonCardContent>
            </IonCard>
          ))}
        </div>

        <div className="px-4 pb-0">
          <h3 className="text-lg font-semibold mb-2">Grupos</h3>
        </div>

        {/* Scroll Horizontal Container 2 */}
        <div className="flex overflow-x-auto pb-6 px-4 space-x-4 scrollbar-hide snap-x">
          {[1, 2, 3, 4, 5].map((i) => (
            <IonCard
              key={i}
              className="mx-0 m-0 min-w-[65vw] max-w-[65vw] snap-start p-4 mr-1 ml-1 cursor-pointer active:scale-95 transition-transform"
              color="white"
              onClick={() => router.push(`/home/group-detail/${i}`)}
            >
              <IonCardHeader>
                <IonCardTitle className="text-lg text-center">
                  Grupo {i}
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent className="text-center">
                <p>
                  <strong>Capitán:</strong> capitan {i}
                </p>
                <p>
                  <strong>Auxiliar:</strong> auxiliar {i}
                </p>
                <p>
                  <strong>Miembros:</strong> 20
                </p>
                <p>
                  <strong>Informaron:</strong> 10
                </p>
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
}
