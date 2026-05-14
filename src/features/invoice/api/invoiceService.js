import apiClient from "@/api/axios";
import {
  INVOICE,
  INVOICE_FORM,
  INVOICE_SUB,
} from "@/api";

export const invoiceService = {
  getAll: async (token) => {
    const response = await apiClient.get(INVOICE, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.invoice;
  },

  getById: async (id, token) => {
    const response = await apiClient.get(`${INVOICE_FORM}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  create: async (data, token) => {
    const response = await apiClient.post(INVOICE_FORM, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  update: async (id, data, token) => {
    const response = await apiClient.put(`${INVOICE_FORM}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  delete: async (id, token) => {
    const response = await apiClient.delete(`${INVOICE_FORM}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  deleteSubItem: async (id, token) => {
    const response = await apiClient.delete(`${INVOICE_SUB}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
