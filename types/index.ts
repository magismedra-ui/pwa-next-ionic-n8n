// Tipos de Usuario y Auth
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  pass: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

// === NUEVOS TIPOS PARA OFFLINE-FIRST ===

export type SyncAction = "CREATE" | "UPDATE" | "DELETE";
export type SyncStatus = "synced" | "pending" | "failed";

// Interfaz base para entidades sincronizables
export interface BaseEntity {
  id: string | number; // UUID local o ID del servidor
  updatedAt: string; // Timestamp ISO
  _status?: SyncStatus; // Estado local de sincronización
}

// Tabla: Publicador
export interface Publicador extends BaseEntity {
  nombre: string;
  correo?: string;
  sexo: "MASCULINO" | "FEMENINO";
  esperanza: "OTRAS OVEJAS" | "UNGIDO";
  privilegio: "PUBLICADOR" | "SIERVO MINISTERIAL" | "ANCIANO";
  precursor: "PUBLICADOR" | "REGULAR" | "AUXILIAR";
  fecha_nacimiento?: string;
  fecha_bautismo?: string;
  direccion?: string;
  telefono?: number;
  telefono_familiar?: number;
  grupo: number;
  capitan?: boolean;
  auxiliar?: boolean;
  observaciones?: string;
  estado: "ACTIVO" | "INACTIVO";
}

// Tabla: Registro (Informe)
export interface Registro extends BaseEntity {
  anno_servicio: number;
  mes: number;
  predico: boolean;
  cursos: number;
  precursor: boolean;
  horas: number;
  notas?: string;
  idpublicador: string | number;
}

// Tabla: Asistencia
export interface Asistencia extends BaseEntity {
  fecha: string;
  presencial: number;
  zoom: number;
}

// Estructura de la Cola de Sincronización
export interface SyncQueueItem {
  id?: number; // Auto-increment (IndexedDB key)
  entityTable: "publicadores" | "registros" | "asistencia";
  action: SyncAction;
  payload: any; // El objeto completo a enviar
  timestamp: number;
}
