import { supabase } from '../client';

export interface Sale {
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
}

export interface CreateSalePayload {
  sale_date: string;
  customer_name: string;
  customer_contact?: string;
  brick_quantity: number;
  price_per_thousand: number;
  total_value: number;
  notes?: string;
  recorded_by: string;
}

export type UpdateSalePayload = Partial<CreateSalePayload>;

export interface SalesStats {
  totalSales: number;
  totalRevenue: number;
  totalQuantity: number;
  averagePrice: number;
}

export class SalesService {
  static async getCurrentUserCeramicId(): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      throw new Error('Usuário não autenticado');
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('ceramic_id')
      .eq('id', session.user.id)
      .single();

    if (!profile?.ceramic_id) {
      throw new Error('Usuário não tem cerâmica associada');
    }

    return profile.ceramic_id;
  }

  static async getAllSales(): Promise<Sale[]> {
    try {
      const ceramicId = await SalesService.getCurrentUserCeramicId();

      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('ceramic_id', ceramicId)
        .order('sale_date', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar vendas:', error);
      throw error;
    }
  }

  static async createSale(payload: CreateSalePayload): Promise<void> {
    const ceramicId = await SalesService.getCurrentUserCeramicId();

    const { error } = await supabase
      .from('sales')
      .insert({
        ceramic_id: ceramicId,
        ...payload,
      });

    if (error) {
      throw new Error(error.message);
    }
  }

  static async updateSale(saleId: string, payload: UpdateSalePayload): Promise<void> {
    const { error } = await supabase
      .from('sales')
      .update(payload)
      .eq('id', saleId);

    if (error) {
      throw new Error(error.message);
    }
  }

  static async deleteSale(saleId: string): Promise<void> {
    const { error } = await supabase
      .from('sales')
      .delete()
      .eq('id', saleId);

    if (error) {
      throw new Error(error.message);
    }
  }

  static async getSalesStats(): Promise<SalesStats> {
    const ceramicId = await SalesService.getCurrentUserCeramicId();

    const { data, error } = await supabase
      .from('sales')
      .select('brick_quantity, total_value, price_per_thousand')
      .eq('ceramic_id', ceramicId);

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return {
        totalSales: 0,
        totalRevenue: 0,
        totalQuantity: 0,
        averagePrice: 0,
      };
    }

    const totalSales = data.length;
    const totalRevenue = data.reduce((sum, sale) => sum + Number(sale.total_value), 0);
    const totalQuantity = data.reduce((sum, sale) => sum + sale.brick_quantity, 0);
    const averagePrice = data.reduce((sum, sale) => sum + Number(sale.price_per_thousand), 0) / data.length;

    return {
      totalSales,
      totalRevenue,
      totalQuantity,
      averagePrice,
    };
  }

  static async getSalesStatsByMonth(selectedMonth: string): Promise<SalesStats> {
    const ceramicId = await SalesService.getCurrentUserCeramicId();

    const startDate = `${selectedMonth}-01`;
    const endDate = `${selectedMonth}-31`;

    const { data, error } = await supabase
      .from('sales')
      .select('brick_quantity, total_value, price_per_thousand')
      .eq('ceramic_id', ceramicId)
      .gte('sale_date', startDate)
      .lte('sale_date', endDate);

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return {
        totalSales: 0,
        totalRevenue: 0,
        totalQuantity: 0,
        averagePrice: 0,
      };
    }

    const totalSales = data.length;
    const totalRevenue = data.reduce((sum, sale) => sum + Number(sale.total_value), 0);
    const totalQuantity = data.reduce((sum, sale) => sum + sale.brick_quantity, 0);
    const averagePrice = data.reduce((sum, sale) => sum + Number(sale.price_per_thousand), 0) / data.length;

    return {
      totalSales,
      totalRevenue,
      totalQuantity,
      averagePrice,
    };
  }
}