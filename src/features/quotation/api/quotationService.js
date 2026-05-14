import apiClient from "@/api/axios";
import {
  QUOTATION,
  QUOTATION_FORM,
  QUOTATION_SUB_DELETE,
  QUOTATION_STATUS,
} from "@/api";

export const quotationService = {
  getAll: async (token) => {
    const response = await apiClient.get(QUOTATION, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.quotation;
  },

  getById: async (id, token) => {
    const response = await apiClient.get(`${QUOTATION_FORM}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  create: async (data, token) => {
    const response = await apiClient.post(QUOTATION_FORM, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  update: async (id, data, token) => {
    const response = await apiClient.put(`${QUOTATION_FORM}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  delete: async (id, token) => {
    const response = await apiClient.delete(`${QUOTATION_FORM}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  deleteSubItem: async (id, token) => {
    const response = await apiClient.delete(`${QUOTATION_SUB_DELETE}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateStatus: async (id, token) => {
    const response = await apiClient.get(`${QUOTATION_STATUS}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
