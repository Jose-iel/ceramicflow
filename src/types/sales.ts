// Tipos legados para compatibilidade com componentes existentes
// Estes tipos serão migrados para usar os tipos da API otimizada

// Tipo para dados do banco (snake_case)
export type SaleDbData = {
  id?: string;
  sale_date: string;
  customer_name: string;
  customer_contact?: string;
  brick_quantity: number;
  price_per_thousand: number;
  total_value: number;
  notes?: string;
  recorded_by: string;
};

// Tipo para dados brutos do Supabase
export type SaleRawData = {
  id: string;
  ceramic_id: string;
  sale_date: string;
  customer_name: string;
  customer_contact?: string;
  brick_quantity: number;
  price_per_thousand: number;
  total_value: number;
  notes?: string;
  recorded_by: string;
  created_at: string;
  updated_at: string;
};
