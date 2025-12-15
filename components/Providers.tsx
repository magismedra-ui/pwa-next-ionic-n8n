"use client";

import { setupIonicReact } from "@ionic/react";
import { IonApp } from "@ionic/react";
import React from "react";

setupIonicReact({
  mode: "ios", // Forzamos modo iOS para consistencia, o dejar automático
});

export default function Providers({ children }: { children: React.ReactNode }) {
  // IonApp es necesario para el correcto funcionamiento de los componentes Ionic
  // especialmente overlays, modales y navegación.
  return (
    <IonApp>
      {children}
    </IonApp>
  );
}

