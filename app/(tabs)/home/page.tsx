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
import { User, Publicador } from "@/types";
import { useRouter } from "next/navigation";
import { dataService } from "@/services/dataService";

interface GroupData {
  groupId: number;
  capitan: string;
  auxiliar: string;
  miembros: number;
  informaron: number; // Placeholder por ahora, o calculado de registros si existen
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [groups, setGroups] = useState<GroupData[]>([]);
  const router = useRouter();

  useEffect(() => {
    setUser(auth.getUser());
    // Intentar cargar primero, si no hay datos, sincronizar
    loadGroups().then((loaded) => {
      if (!loaded || loaded.length === 0) {
        dataService.syncFromCloud().then(() => loadGroups());
      }
    });
  }, []);

  const loadGroups = async () => {
    try {
      const publicadores = await dataService.getPublicadores();

      if (publicadores.length === 0) {
        setGroups([]);
        return [];
      }

      // Agrupar por 'grupo'
      const groupsMap = new Map<number, Publicador[]>();
      publicadores.forEach((pub) => {
        if (!groupsMap.has(pub.grupo)) {
          groupsMap.set(pub.grupo, []);
        }
        groupsMap.get(pub.grupo)?.push(pub);
      });

      // Transformar a GroupData
      const groupsData: GroupData[] = [];
      groupsMap.forEach((pubs, groupId) => {
        const capitan =
          pubs.find((p) => p.capitan === true)?.nombre || "No asignado";
        const auxiliar =
          pubs.find((p) => p.auxiliar === true)?.nombre || "No asignado";

        groupsData.push({
          groupId,
          capitan,
          auxiliar,
          miembros: pubs.length,
          informaron: 0, // TODO: Calcular cuando tengamos registros vinculados
        });
      });

      // Ordenar por ID de grupo
      groupsData.sort((a, b) => a.groupId - b.groupId);
      setGroups(groupsData);
    } catch (error) {
      console.error("Error loading groups", error);
    }
  };

  const doRefresh = async (event: CustomEvent) => {
    await dataService.syncFromCloud(); // Refrescar datos desde la nube
    await loadGroups();
    event.detail.complete();
  };

  // Fecha actual formateada (ej: "16 oct 2023")
  const currentDate = new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <IonPage>
      <Header title="Inicio" />
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="px-5 pt-4 pb-0">
          {/* Tarjeta Principal usando el color Primary (#081c15) */}
          <IonCard
            className="m-0 mb-6 text-white border border-green-900"
            style={{ backgroundColor: "var(--ion-color-primary)" }}
          >
            <IonCardHeader>
              <IonCardSubtitle className="text-green-100 text-center">
                Código: 20149
              </IonCardSubtitle>
              <IonCardTitle className="text-white text-center">
                Congregación Alto Bosque
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="text-green-50 text-center">
              {user?.name || "Invitado"}
            </IonCardContent>
          </IonCard>

          <h3 className="text-lg font-semibold mb-2">
            Asistencia a las reuniones
          </h3>
        </div>

        {/* Scroll Horizontal Container 1 - ASISTENCIA (#b8dbd9) */}
        <div className="flex overflow-x-auto pb-4 px-2 space-x-2 scrollbar-hide snap-x mr-5 ml-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <IonCard
              key={i}
              className="mx-0 m-0 min-w-[45vw] max-w-[45vw] snap-start border border-gray-300 dark:border-gray-600 bg-card-attendance p-2 mr-1 ml-1"
            >
              <IonCardHeader className="p-2 pb-0">
                <IonCardSubtitle className="text-gray-700 text-center text-[10px] uppercase">
                  {currentDate}
                </IonCardSubtitle>
                <IonCardTitle className="text-xs font-bold text-gray-900 text-center leading-tight whitespace-nowrap">
                  Asistencia a la reunión {i}
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent className="text-gray-800 text-center text-xs p-2 pt-1">
                <p className="text-center mb-1">
                  <strong>Presencial:</strong> 20
                </p>
                <p className="text-center">
                  <strong>Zoom:</strong> 10
                </p>
              </IonCardContent>
            </IonCard>
          ))}
        </div>

        <div className="px-5 pb-0">
          <h3 className="text-lg font-semibold mb-2">Grupos de predicación</h3>
        </div>

        {/* Scroll Horizontal Container 2 - GRUPOS (#d8f3dc) */}
        <div className="flex overflow-x-auto pb-6 px-4 space-x-4 scrollbar-hide snap-x mr-5 ml-5">
          {groups.length > 0 ? (
            groups.map((group) => (
              <IonCard
                key={group.groupId}
                className="mx-0 m-0 min-w-[65vw] max-w-[65vw] snap-start p-4 mr-1 ml-1 cursor-pointer active:scale-95 transition-transform border border-gray-300 dark:border-gray-600 bg-card-groups"
                onClick={() =>
                  router.push(`/home/group-detail/${group.groupId}`)
                }
              >
                <IonCardHeader>
                  <IonCardTitle className="text-lg text-left text-gray-900">
                    Grupo {group.groupId}
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent className="text-left text-gray-800">
                  <p>
                    <strong>Capitán:</strong> {group.capitan}
                  </p>
                  <p>
                    <strong>Auxiliar:</strong> {group.auxiliar}
                  </p>
                  <p>
                    <strong>Miembros:</strong> {group.miembros}
                  </p>
                  <p>
                    <strong>Informaron:</strong> {group.informaron}
                  </p>
                </IonCardContent>
              </IonCard>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500 w-full flex justify-center items-center">
              <p>No hay grupos disponibles</p>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}
