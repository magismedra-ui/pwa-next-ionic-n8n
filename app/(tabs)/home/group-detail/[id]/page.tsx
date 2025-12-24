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
  IonModal,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonDatetimeButton,
  IonDatetime,
  IonCheckbox,
  IonInput,
  useIonToast,
} from "@ionic/react";
import {
  createOutline,
  checkmarkCircleOutline,
  ellipseOutline,
  arrowBackOutline,
} from "ionicons/icons";
import Header from "@/components/ui/Header";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { dataService } from "@/services/dataService";
import { Registro } from "@/types";

export default function GroupDetailPage() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [present] = useIonToast();

  // Estados del formulario
  const [participo, setParticipo] = useState(false);
  const [estudios, setEstudios] = useState<number | undefined>(undefined);
  const [horas, setHoras] = useState<number | undefined>(undefined);
  const [comentarios, setComentarios] = useState("");

  // Datos de ejemplo para la lista (en una app real vendrían de la DB)
  const games = [
    { id: 101, name: "Pokémon Yellow", status: "active" },
    { id: 102, name: "Mega Man X", status: "inactive" },
    { id: 103, name: "The Legend of Zelda", status: "active" },
    { id: 104, name: "Pac-Man", status: "inactive" },
    { id: 105, name: "Super Mario World", status: "active" },
  ];

  const handleOpenModal = (game: any) => {
    setSelectedGame(game);
    // Resetear formulario al abrir o cargar datos existentes si los hubiera
    setParticipo(false);
    setEstudios(undefined);
    setHoras(undefined);
    setComentarios("");
  };

  const handleSubmit = async () => {
    if (!selectedGame) return;

    const nuevoRegistro: Partial<Registro> = {
      anno_servicio: new Date().getFullYear(),
      mes: new Date().getMonth() + 1,
      predico: participo,
      cursos: estudios || 0,
      precursor: false, // Lógica pendiente: determinar si es precursor
      horas: horas || 0,
      notas: comentarios,
      idpublicador: selectedGame.id || 0,
    };

    try {
      // Guardado Offline-First
      await dataService.saveEntity("registros", nuevoRegistro, "CREATE");

      present({
        message: "Informe guardado correctamente",
        duration: 2000,
        color: "success",
        position: "bottom",
      });

      setSelectedGame(null);
    } catch (err) {
      console.error(err);
      present({
        message: "Error al guardar el informe",
        duration: 2000,
        color: "danger",
        position: "bottom",
      });
    }
  };

  return (
    <IonPage>
      <Header title={`Detalle Grupo ${id}`} />

      <div className="bg-white dark:bg-black px-4 py-2 flex items-center border-b border-gray-100 dark:border-gray-800">
        <IonButton fill="clear" size="small" onClick={() => router.back()}>
          <IonIcon slot="icon-only" icon={arrowBackOutline} />
          <span className="ml-2 text-sm">Volver</span>
        </IonButton>
      </div>

      <IonContent>
        <IonList inset>
          <IonListHeader>
            <IonLabel className="text-xl font-bold">Publicadores</IonLabel>
          </IonListHeader>

          {games.map((game, index) => (
            <IonItem key={index} button onClick={() => handleOpenModal(game)}>
              <IonLabel>{game.name}</IonLabel>

              <div className="flex items-center gap-2" slot="end">
                <IonIcon
                  icon={
                    game.status === "active"
                      ? checkmarkCircleOutline
                      : ellipseOutline
                  }
                  color={game.status === "active" ? "success" : "medium"}
                  title="Estado"
                />
                <IonButton fill="clear" size="small">
                  <IonIcon slot="icon-only" icon={createOutline} />
                </IonButton>
              </div>
            </IonItem>
          ))}
        </IonList>

        <IonModal
          isOpen={!!selectedGame}
          onDidDismiss={() => setSelectedGame(null)}
          className="ion-modal-custom"
        >
          <div className="flex items-center justify-center min-h-full bg-black/50 p-4">
            <IonCard className="w-full max-w-md m-0 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <IonCardHeader>
                <IonCardSubtitle className="text-center mt-2 text-lg font-bold">
                  Informe de predicación
                </IonCardSubtitle>
                <IonCardTitle className="text-center mt-2 text-2xl font-bold">
                  {selectedGame?.name}
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="mb-4 flex justify-center">
                  <IonDatetimeButton
                    datetime="datetime-disabled"
                    disabled={true}
                  />
                </div>

                <IonModal keepContentsMounted={true}>
                  <IonDatetime
                    id="datetime-disabled"
                    presentation="date"
                    readonly
                  />
                </IonModal>

                <IonList>
                  <IonItem>
                    <IonCheckbox
                      labelPlacement="start"
                      justify="space-between"
                      checked={participo}
                      onIonChange={(e) => setParticipo(e.detail.checked)}
                    >
                      Participó
                    </IonCheckbox>
                  </IonItem>

                  <IonItem>
                    <IonInput
                      label="Estudios bíblicos"
                      labelPlacement="floating"
                      type="number"
                      placeholder="0"
                      value={estudios}
                      onIonInput={(e) =>
                        setEstudios(parseInt(e.detail.value!, 10))
                      }
                    />
                  </IonItem>

                  <IonItem>
                    <IonInput
                      label="Horas"
                      labelPlacement="floating"
                      type="number"
                      placeholder="0"
                      value={horas}
                      onIonInput={(e) =>
                        setHoras(parseFloat(e.detail.value!))
                      }
                    />
                  </IonItem>

                  <IonItem>
                    <IonInput
                      label="Comentarios"
                      labelPlacement="floating"
                      type="text"
                      placeholder="Escribe aquí..."
                      value={comentarios}
                      onIonInput={(e) => setComentarios(e.detail.value!)}
                    />
                  </IonItem>
                </IonList>

                <div className="flex justify-end gap-2 mt-4">
                  <IonButton
                    fill="clear"
                    color="medium"
                    onClick={() => setSelectedGame(null)}
                  >
                    Cancelar
                  </IonButton>
                  <IonButton fill="clear" onClick={handleSubmit}>
                    Enviar
                  </IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
}
