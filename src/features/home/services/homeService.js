import apiClient from "@/api/axios";
import { DASHBOARD_LIST, STOCK_REPORT } from "@/api";

export const fetchDashboardData = async (token, year_month) => {
  const response = await apiClient.post(
    DASHBOARD_LIST,
    { year_month },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const fetchStockData = async (token, from_date, to_date) => {
  const response = await apiClient.post(
    STOCK_REPORT,
    { from_date, to_date },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data.stock;
};
