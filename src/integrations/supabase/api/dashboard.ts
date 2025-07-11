import { supabase } from '../client';

export interface DashboardOverview {
  vehicles: {
    total: number;
    operational: number;
    maintenance: number;
    stopped: number;
  };
  employees: {
    total: number;
    regular: number;
    expiringSoon: number;
    expired: number;
  };
  operations: {
    active: number;
  };
  maintenances: {
    pending: number;
  };
  consumption: {
    wood: number;
    clay: number;
  };
  sales: {
    totalSales: number;
    totalRevenue: number;
    totalQuantity: number;
    averagePrice: number;
  };
}

export class DashboardService {
  static async getDashboardOverview(ceramicId: string, selectedMonth?: string): Promise<DashboardOverview> {
    const { data, error } = await supabase.functions.invoke('get-dashboard-overview', {
      body: { ceramic_id: ceramicId, selectedMonth },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}
