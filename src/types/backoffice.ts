
export enum UserLevel {
  ADMIN = "Administrador",
  MANAGER = "Gerente",
  SUPERVISOR = "Supervisor", 
  OPERATOR = "Operador",
  VIEWER = "Visualizador"
}

export interface Route {
  id: string;
  path: string;
  name: string;
  description: string;
}

export interface UserLevelAccess {
  id: string;
  name: UserLevel;
  description: string;
  allowedRoutes: string[]; // Route IDs
}

export interface BackofficeUser {
  id: string;
  name: string;
  email: string;
  userLevel: UserLevel;
  ceramicId?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface Ceramic {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  users: BackofficeUser[];
}
