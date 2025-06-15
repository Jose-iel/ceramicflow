
export interface Route {
  id: string;
  path: string;
  name: string;
  description: string;
}

export interface UserLevelAccess {
  id: string;
  name: string;
  description: string;
  allowedRoutes: string[]; // Route paths
}

export interface BackofficeUser {
  id: string;
  email: string | null;
  full_name: string | null;
  is_admin: boolean | null;
  user_level_id: string | null;
  user_levels?: { name: string } | null;
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
  is_active: boolean;
  created_at: string;
  users: BackofficeUser[];
}
