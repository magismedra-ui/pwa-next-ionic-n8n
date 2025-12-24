import { dbPromise } from "@/lib/db";
import api from "@/lib/api";
import { v4 as uuidv4 } from "uuid";
import {
  SyncAction,
  SyncQueueItem,
  Publicador,
  Asistencia,
  Registro,
} from "@/types";

// Tablas soportadas
type TableName = "publicadores" | "registros" | "asistencia";

class DataService {
  // Mapeo de nombres de tablas local vs remoto
  private getRemoteTableName(localName: TableName): string {
    switch (localName) {
      case "publicadores":
        return "publicador";
      case "registros":
        return "registro";
      case "asistencia":
        return "asistencia";
      default:
        return localName;
    }
  }

  // ==========================================
  // Lógica Core: Save (Create/Update)
  // ==========================================
  async saveEntity<T extends { id?: string | number }>(
    table: TableName,
    data: T,
    action: SyncAction = "CREATE" // CREATE o UPDATE
  ): Promise<T> {
    const db = await dbPromise;
    if (!db) throw new Error("DB not initialized");

    // 1. Asegurar ID y Timestamps
    const itemToSave = {
      ...data,
      id: data.id || uuidv4(), // Si no tiene ID, generamos UUID local
      updatedAt: new Date().toISOString(),
      _status: "synced", // Asumimos synced por defecto, cambiamos si falla
    };

    const isOnline = navigator.onLine;

    if (isOnline) {
      try {
        // A. ONLINE: Intentar guardar en Nube (n8n)
        console.log(`[Online] Guardando en nube: ${table}`);

        // POST al webhook único
        await api.post("/", {
          tabla: this.getRemoteTableName(table),
          action: action,
          data: itemToSave,
        });

        // Si éxito: Guardar en Local como 'synced'
        await db.put(table, itemToSave as any);
        console.log(`[Online] Guardado y sincronizado localmente.`);
      } catch (error) {
        console.warn(
          `[Online] Falló guardado en nube, pasando a offline queue.`,
          error
        );
        // Fallback: Si falla API aunque haya internet, tratar como Offline
        await this.saveToQueue(table, itemToSave, action);
        itemToSave._status = "pending";
        await db.put(table, itemToSave as any);
      }
    } else {
      // B. OFFLINE: Guardar Local + Cola
      console.log(`[Offline] Guardando localmente: ${table}`);
      itemToSave._status = "pending";

      // 1. Guardar en Store Local
      await db.put(table, itemToSave as any);

      // 2. Añadir a SyncQueue
      await this.saveToQueue(table, itemToSave, action);
    }

    return itemToSave as T;
  }

  // Helper para añadir a la cola
  private async saveToQueue(table: TableName, data: any, action: SyncAction) {
    const db = await dbPromise;
    if (!db) return;

    const queueItem: SyncQueueItem = {
      entityTable: table,
      action: action,
      payload: data,
      timestamp: Date.now(),
    };

    await db.add("syncQueue", queueItem);
  }

  // ==========================================
  // Lógica Core: Read (Get)
  // ==========================================
  async getAll<T>(table: TableName): Promise<T[]> {
    const db = await dbPromise;
    if (!db) return [];

    // Offline-First: Devolvemos siempre lo local inmediatamente
    // En background podríamos refrescar desde la nube
    return db.getAll(table) as Promise<T[]>;
  }

  // ==========================================
  // Sincronización (Queue Processor)
  // ==========================================
  async processSyncQueue() {
    if (!navigator.onLine) return;

    const db = await dbPromise;
    if (!db) return;

    const queueItems = await db.getAll("syncQueue");
    if (queueItems.length === 0) return;

    console.log(
      `[Sync] Procesando ${queueItems.length} elementos pendientes...`
    );

    for (const item of queueItems) {
      try {
        // Enviar a la nube (Webhook único)
        await api.post("/", {
          tabla: this.getRemoteTableName(item.entityTable as TableName),
          action: item.action,
          data: item.payload,
        });

        // Si éxito:
        // 1. Actualizar estado en tabla local a 'synced'
        const currentLocal = await db.get(item.entityTable, item.payload.id);
        if (currentLocal) {
          currentLocal._status = "synced";
          await db.put(item.entityTable, currentLocal);
        }

        // 2. Eliminar de la cola
        if (item.id) {
          await db.delete("syncQueue", item.id);
        }
      } catch (error) {
        console.error(`[Sync] Error sincronizando item ${item.id}`, error);
        // Opcional: Implementar reintentos o dejar en cola para después
      }
    }

    console.log(`[Sync] Proceso finalizado.`);
  }

  // ==========================================
  // Sincronización desde Nube (Pull)
  // ==========================================
  async syncFromCloud() {
    if (!navigator.onLine) return;

    const db = await dbPromise;
    if (!db) return;

    const tables: TableName[] = ["publicadores", "registros", "asistencia"];

    console.log("[Sync] Iniciando sincronización desde la nube...");

    for (const table of tables) {
      try {
        const remoteTable = this.getRemoteTableName(table);
        console.log(`[Sync] Descargando ${remoteTable}...`);

        // Llamada al webhook n8n para obtener datos
        const response = await api.post("/", {
          tabla: remoteTable,
        });

        console.log(
          `[Sync Debug] Respuesta raw para ${remoteTable}:`,
          response.data
        );

        // Manejo flexible de la respuesta (array directo o envuelto en data)
        const items = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];

        console.log(
          `[Sync Debug] Items a procesar para ${remoteTable}:`,
          items.length
        );

        if (Array.isArray(items) && items.length > 0) {
          const tx = db.transaction(table, "readwrite");

          for (const item of items) {
            // Log para inspeccionar el primer elemento y detectar estructura
            if (items.indexOf(item) === 0)
              console.log(`[Sync Debug] Primer item de ${table}:`, item);

            // Mapear o limpiar datos si es necesario
            // Aseguramos que tenga el status 'synced' ya que viene de la nube
            // Aseguramos tipos correctos para campos críticos
            const itemToSave = {
              ...item,
              id: item.id || item.Id || item.ID || uuidv4(), // Asegurar ID (importante para IndexedDB)
              // Convertir "1"/"0" o "true"/"false" strings a boolean
              capitan:
                item.capitan === true ||
                item.capitan === "true" ||
                item.capitan === 1 ||
                item.capitan === "1",
              auxiliar:
                item.auxiliar === true ||
                item.auxiliar === "true" ||
                item.auxiliar === 1 ||
                item.auxiliar === "1",
              grupo: item.grupo ? Number(item.grupo) : 0, // Forzar número
              _status: "synced",
            };

            // Usamos put para insertar o actualizar
            await tx.store.put(itemToSave);
          }

          await tx.done;
          console.log(
            `[Sync] ${table} actualizado con ${items.length} registros.`
          );
        } else {
          console.log(
            `[Sync] No se encontraron registros nuevos para ${table}.`
          );
        }
      } catch (error) {
        console.error(`[Sync] Error descargando ${table}`, error);
      }
    }
    console.log("[Sync] Sincronización desde la nube finalizada.");
  }

  // ==========================================
  // Wrappers Específicos (Sugar Syntax)
  // ==========================================

  // Publicadores
  async getPublicadores() {
    return this.getAll<Publicador>("publicadores");
  }

  async savePublicador(publicador: Partial<Publicador>) {
    return this.saveEntity(
      "publicadores",
      publicador,
      publicador.id ? "UPDATE" : "CREATE"
    );
  }

  // Asistencia
  async getAsistencias() {
    return this.getAll<Asistencia>("asistencia");
  }

  async saveAsistencia(asistencia: Partial<Asistencia>) {
    return this.saveEntity(
      "asistencia",
      asistencia,
      asistencia.id ? "UPDATE" : "CREATE"
    );
  }
}

export const dataService = new DataService();
