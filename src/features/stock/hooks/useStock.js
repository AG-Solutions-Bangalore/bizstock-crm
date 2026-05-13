import { useQuery } from "@tanstack/react-query";
import { stockService } from "../services/stockService";
import usetoken from "@/api/usetoken";
import { getTodayDate } from "@/utils/currentDate";

export const useStockReport = (params = {}) => {
  const token = usetoken();
  const currentDate = getTodayDate();
  
  const defaultParams = {
    from_date: "2024-01-01",
    to_date: currentDate,
    ...params
  };

  return useQuery({
    queryKey: ["stockData", defaultParams],
    queryFn: () => stockService.getStockReport(defaultParams, token),
    enabled: !!token,
  });
};

export const useStockBatchReport = (formData) => {
  const token = usetoken();

  return useQuery({
    queryKey: ["buyerData", formData],
    queryFn: () => stockService.getStockBatchReport(formData, token),
    enabled: !!token && !!formData.from_date && !!formData.to_date,
  });
};
