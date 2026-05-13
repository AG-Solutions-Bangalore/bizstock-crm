import apiClient from "@/api/axios";
import {
  BUYER_REPORT,
  STOCK_CATEGORY_REPORT,
  STOCK_GODOWN_REPORT,
  SINGLE_ITEM_STOCK_REPORT,
  PURCHASE_REPORT,
  DISPATCH_REPORT,
  PAYMENT_SUMMARY_REPORT,
  PAYMENT_LEDGER_REPORT,
} from "@/api";

export const reportService = {
  getCategoryStock: async (params, token) => {
    const response = await apiClient.post(STOCK_CATEGORY_REPORT, params, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getGoDownStock: async (params, token) => {
    const response = await apiClient.post(STOCK_GODOWN_REPORT, params, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getDispatchReport: async (params, token) => {
    const response = await apiClient.post(DISPATCH_REPORT, params, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getBuyerReport: async (params, token) => {
    const response = await apiClient.post(BUYER_REPORT, params, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getSingleItemStock: async (params, token) => {
    const response = await apiClient.post(SINGLE_ITEM_STOCK_REPORT, params, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getPurchaseReport: async (params, token) => {
    const response = await apiClient.post(PURCHASE_REPORT, params, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getPaymentSummaryReport: async (params, token) => {
    const response = await apiClient.post(PAYMENT_SUMMARY_REPORT, params, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getPaymentLedgerReport: async (params, token) => {
    const response = await apiClient.post(PAYMENT_LEDGER_REPORT, params, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
