import apiClient from "@/api/axios";
import { STOCK_REPORT, STOCK_BATCH_REPORT } from "@/api";

export const stockService = {
  getStockReport: async (params, token) => {
    const response = await apiClient.post(STOCK_REPORT, params, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Sorting logic moved from component to service or hook
    const sortedStock = (response.data.stock || []).sort((a, b) => {
      const nameA = String(a.item_name || "");
      const nameB = String(b.item_name || "");

      const numA = parseFloat(nameA);
      const numB = parseFloat(nameB);

      if (!isNaN(numA) && !isNaN(numB)) {
        if (numA !== numB) return numA - numB;
      } else if (!isNaN(numA)) {
        return -1;
      } else if (!isNaN(numB)) {
        return 1;
      }

      return nameA.localeCompare(nameB, undefined, { sensitivity: 'base', numeric: true });
    });

    return sortedStock;
  },

  getStockBatchReport: async (params, token) => {
    const response = await apiClient.post(STOCK_BATCH_REPORT, params, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.stock || [];
  },
};
