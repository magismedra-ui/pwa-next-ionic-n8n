import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Publicador, Registro, Asistencia, SyncQueueItem } from '@/types';

interface AppDB extends DBSchema {
  publicadores: {
    key: string | number;
    value: Publicador;
    indexes: { 'by-status': string };
  };
  registros: {
    key: string | number;
    value: Registro;
    indexes: { 'by-publicador': string | number };
  };
  asistencia: {
    key: string | number;
    value: Asistencia;
    indexes: { 'by-date': string };
  };
  syncQueue: {
    key: number;
    value: SyncQueueItem;
    indexes: { 'by-timestamp': number };
  };
}

const DB_NAME = 'pwa-app-db';
const DB_VERSION = 1;

export const initDB = async (): Promise<IDBPDatabase<AppDB>> => {
  return openDB<AppDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Tabla Publicadores
      if (!db.objectStoreNames.contains('publicadores')) {
        const store = db.createObjectStore('publicadores', { keyPath: 'id' });
        store.createIndex('by-status', '_status');
      }

      // Tabla Registros
      if (!db.objectStoreNames.contains('registros')) {
        const store = db.createObjectStore('registros', { keyPath: 'id' });
        store.createIndex('by-publicador', 'idpublicador');
      }

      // Tabla Asistencia
      if (!db.objectStoreNames.contains('asistencia')) {
        const store = db.createObjectStore('asistencia', { keyPath: 'id' });
        store.createIndex('by-date', 'fecha');
      }

      // Cola de Sincronización
      if (!db.objectStoreNames.contains('syncQueue')) {
        const store = db.createObjectStore('syncQueue', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        store.createIndex('by-timestamp', 'timestamp');
      }
    },
  });
};

export const dbPromise = typeof window !== 'undefined' ? initDB() : null;

