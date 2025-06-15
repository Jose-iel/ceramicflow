export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ceramics: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      clay_consumptions: {
        Row: {
          ceramic_id: string
          created_at: string | null
          date: string | null
          id: string
          notes: string | null
          origin: string | null
          recorded_by: string
          supplier: string | null
          truck_id: string | null
          trucks_quantity: number
          updated_at: string | null
        }
        Insert: {
          ceramic_id: string
          created_at?: string | null
          date?: string | null
          id?: string
          notes?: string | null
          origin?: string | null
          recorded_by: string
          supplier?: string | null
          truck_id?: string | null
          trucks_quantity: number
          updated_at?: string | null
        }
        Update: {
          ceramic_id?: string
          created_at?: string | null
          date?: string | null
          id?: string
          notes?: string | null
          origin?: string | null
          recorded_by?: string
          supplier?: string | null
          truck_id?: string | null
          trucks_quantity?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clay_consumptions_ceramic_id_fkey"
            columns: ["ceramic_id"]
            isOneToOne: false
            referencedRelation: "ceramics"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          aso_expiration_date: string | null
          ceramic_id: string
          contact: string | null
          cpf: string | null
          created_at: string | null
          id: string
          name: string
          nr_expiration_date: string | null
          registration_date: string | null
          role: string
          shift: string | null
          updated_at: string | null
        }
        Insert: {
          aso_expiration_date?: string | null
          ceramic_id: string
          contact?: string | null
          cpf?: string | null
          created_at?: string | null
          id?: string
          name: string
          nr_expiration_date?: string | null
          registration_date?: string | null
          role: string
          shift?: string | null
          updated_at?: string | null
        }
        Update: {
          aso_expiration_date?: string | null
          ceramic_id?: string
          contact?: string | null
          cpf?: string | null
          created_at?: string | null
          id?: string
          name?: string
          nr_expiration_date?: string | null
          registration_date?: string | null
          role?: string
          shift?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_ceramic_id_fkey"
            columns: ["ceramic_id"]
            isOneToOne: false
            referencedRelation: "ceramics"
            referencedColumns: ["id"]
          },
        ]
      }
      gas_supplies: {
        Row: {
          ceramic_id: string
          created_at: string | null
          date: string | null
          id: string
          quantity: number
          recorded_by: string
          supplier: string | null
          total_value: number
          unit_price: number
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          ceramic_id: string
          created_at?: string | null
          date?: string | null
          id?: string
          quantity: number
          recorded_by: string
          supplier?: string | null
          total_value: number
          unit_price: number
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          ceramic_id?: string
          created_at?: string | null
          date?: string | null
          id?: string
          quantity?: number
          recorded_by?: string
          supplier?: string | null
          total_value?: number
          unit_price?: number
          updated_at?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gas_supplies_ceramic_id_fkey"
            columns: ["ceramic_id"]
            isOneToOne: false
            referencedRelation: "ceramics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gas_supplies_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenances: {
        Row: {
          ceramic_id: string
          completed_date: string | null
          created_at: string | null
          id: string
          issue: string
          reported_by: string
          reported_date: string | null
          status: string
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          ceramic_id: string
          completed_date?: string | null
          created_at?: string | null
          id?: string
          issue: string
          reported_by: string
          reported_date?: string | null
          status?: string
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          ceramic_id?: string
          completed_date?: string | null
          created_at?: string | null
          id?: string
          issue?: string
          reported_by?: string
          reported_date?: string | null
          status?: string
          updated_at?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenances_ceramic_id_fkey"
            columns: ["ceramic_id"]
            isOneToOne: false
            referencedRelation: "ceramics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenances_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      operations: {
        Row: {
          ceramic_id: string
          created_at: string | null
          current_hour_meter: number | null
          description: string | null
          employee_id: string | null
          end_date: string | null
          end_time: string | null
          gas_consumption: number | null
          id: string
          initial_hour_meter: number | null
          location: string | null
          operation_type: string | null
          operator: string | null
          start_date: string | null
          start_time: string | null
          status: string
          type: string
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          ceramic_id: string
          created_at?: string | null
          current_hour_meter?: number | null
          description?: string | null
          employee_id?: string | null
          end_date?: string | null
          end_time?: string | null
          gas_consumption?: number | null
          id?: string
          initial_hour_meter?: number | null
          location?: string | null
          operation_type?: string | null
          operator?: string | null
          start_date?: string | null
          start_time?: string | null
          status?: string
          type: string
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          ceramic_id?: string
          created_at?: string | null
          current_hour_meter?: number | null
          description?: string | null
          employee_id?: string | null
          end_date?: string | null
          end_time?: string | null
          gas_consumption?: number | null
          id?: string
          initial_hour_meter?: number | null
          location?: string | null
          operation_type?: string | null
          operator?: string | null
          start_date?: string | null
          start_time?: string | null
          status?: string
          type?: string
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "operations_ceramic_id_fkey"
            columns: ["ceramic_id"]
            isOneToOne: false
            referencedRelation: "ceramics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operations_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operations_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          ceramic_id: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          is_admin: boolean | null
          last_login: string | null
          updated_at: string | null
          user_level: Database["public"]["Enums"]["user_level"] | null
        }
        Insert: {
          ceramic_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          is_admin?: boolean | null
          last_login?: string | null
          updated_at?: string | null
          user_level?: Database["public"]["Enums"]["user_level"] | null
        }
        Update: {
          ceramic_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          is_admin?: boolean | null
          last_login?: string | null
          updated_at?: string | null
          user_level?: Database["public"]["Enums"]["user_level"] | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_ceramic_id_fkey"
            columns: ["ceramic_id"]
            isOneToOne: false
            referencedRelation: "ceramics"
            referencedColumns: ["id"]
          },
        ]
      }
      routes: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          path: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          path: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          path?: string
        }
        Relationships: []
      }
      user_level_permissions: {
        Row: {
          created_at: string | null
          id: string
          route_id: string | null
          user_level: Database["public"]["Enums"]["user_level"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          route_id?: string | null
          user_level: Database["public"]["Enums"]["user_level"]
        }
        Update: {
          created_at?: string | null
          id?: string
          route_id?: string | null
          user_level?: Database["public"]["Enums"]["user_level"]
        }
        Relationships: [
          {
            foreignKeyName: "user_level_permissions_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          acquisition_date: string | null
          capacity: string | null
          ceramic_id: string
          created_at: string | null
          hour_meter: number | null
          id: string
          last_maintenance: string | null
          model: string
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          acquisition_date?: string | null
          capacity?: string | null
          ceramic_id: string
          created_at?: string | null
          hour_meter?: number | null
          id?: string
          last_maintenance?: string | null
          model: string
          status?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          acquisition_date?: string | null
          capacity?: string | null
          ceramic_id?: string
          created_at?: string | null
          hour_meter?: number | null
          id?: string
          last_maintenance?: string | null
          model?: string
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_ceramic_id_fkey"
            columns: ["ceramic_id"]
            isOneToOne: false
            referencedRelation: "ceramics"
            referencedColumns: ["id"]
          },
        ]
      }
      wood_consumptions: {
        Row: {
          ceramic_id: string
          created_at: string | null
          date: string | null
          id: string
          observations: string | null
          oven: string | null
          quantity: number
          responsible: string | null
          updated_at: string | null
        }
        Insert: {
          ceramic_id: string
          created_at?: string | null
          date?: string | null
          id?: string
          observations?: string | null
          oven?: string | null
          quantity: number
          responsible?: string | null
          updated_at?: string | null
        }
        Update: {
          ceramic_id?: string
          created_at?: string | null
          date?: string | null
          id?: string
          observations?: string | null
          oven?: string | null
          quantity?: number
          responsible?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wood_consumptions_ceramic_id_fkey"
            columns: ["ceramic_id"]
            isOneToOne: false
            referencedRelation: "ceramics"
            referencedColumns: ["id"]
          },
        ]
      }
      wood_purchases: {
        Row: {
          ceramic_id: string
          created_at: string | null
          date: string | null
          id: string
          invoice_number: string | null
          notes: string | null
          quantity: number
          supplier: string
          total_value: number
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          ceramic_id: string
          created_at?: string | null
          date?: string | null
          id?: string
          invoice_number?: string | null
          notes?: string | null
          quantity: number
          supplier: string
          total_value: number
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          ceramic_id?: string
          created_at?: string | null
          date?: string | null
          id?: string
          invoice_number?: string | null
          notes?: string | null
          quantity?: number
          supplier?: string
          total_value?: number
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wood_purchases_ceramic_id_fkey"
            columns: ["ceramic_id"]
            isOneToOne: false
            referencedRelation: "ceramics"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      user_has_route_permission: {
        Args: { user_id: string; route_path: string }
        Returns: boolean
      }
    }
    Enums: {
      user_level: "ADMIN" | "MANAGER" | "SUPERVISOR" | "OPERATOR" | "VIEWER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_level: ["ADMIN", "MANAGER", "SUPERVISOR", "OPERATOR", "VIEWER"],
    },
  },
} as const
