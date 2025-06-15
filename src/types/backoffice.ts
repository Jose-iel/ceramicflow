
export enum UserLevel {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  SUPERVISOR = "SUPERVISOR", 
  OPERATOR = "OPERATOR",
  VIEWER = "VIEWER"
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
  email: string | null;
  full_name: string | null;
  is_admin: boolean | null;
  user_level: UserLevel | null;
  ceramic_id: string | null;
  ceramics?: { name: string } | null;
  is_active: boolean | null;
  created_at: string;
  last_login: string | null;
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
