import { useQuery } from "@tanstack/react-query";
import { reportService } from "../services/reportService";
import usetoken from "@/api/usetoken";

export const useCategoryStock = (params) => {
  const token = usetoken();
  return useQuery({
    queryKey: ["categoryStock", params],
    queryFn: () => reportService.getCategoryStock(params, token),
    enabled: !!token && !!params.category_id,
  });
};

export const useGoDownStock = (params) => {
  const token = usetoken();
  return useQuery({
    queryKey: ["goDownStock", params],
    queryFn: () => reportService.getGoDownStock(params, token),
    enabled: !!token && !!params.godown_id,
  });
};

export const useDispatchReport = (params) => {
  const token = usetoken();
  return useQuery({
    queryKey: ["dispatchReport", params],
    queryFn: () => reportService.getDispatchReport(params, token),
    enabled: !!token && !!params.from_date && !!params.to_date,
  });
};

export const useBuyerReport = (params) => {
  const token = usetoken();
  return useQuery({
    queryKey: ["buyerReport", params],
    queryFn: () => reportService.getBuyerReport(params, token),
    enabled: !!token && !!params.buyer_id,
  });
};

export const useSingleItemStock = (params) => {
  const token = usetoken();
  return useQuery({
    queryKey: ["singleItemStock", params],
    queryFn: () => reportService.getSingleItemStock(params, token),
    enabled: !!token && !!params.item_name,
  });
};

export const useBuyerSummaryReport = () => {
  const token = usetoken();
  return useQuery({
    queryKey: ["buyerSummaryReport"],
    queryFn: () => reportService.getBuyerReport({}, token),
    enabled: !!token,
  });
};

export const usePurchaseReport = (params) => {
  const token = usetoken();
  return useQuery({
    queryKey: ["purchaseReport", params],
    queryFn: () => reportService.getPurchaseReport(params, token),
    enabled: !!token && !!params.from_date && !!params.to_date,
  });
};

export const usePaymentSummaryReport = (params) => {
  const token = usetoken();
  return useQuery({
    queryKey: ["paymentSummaryReport", params],
    queryFn: () => reportService.getPaymentSummaryReport(params, token),
    enabled: !!token && !!params.from_date && !!params.to_date,
  });
};

export const usePaymentLedgerReport = (params) => {
  const token = usetoken();
  return useQuery({
    queryKey: ["paymentLedgerReport", params],
    queryFn: () => reportService.getPaymentLedgerReport(params, token),
    enabled: !!token && !!params.buyer_id,
  });
};
