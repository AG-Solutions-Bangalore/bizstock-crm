import apiClient from "@/api/axios";
import {
  PURCHASE_LIST,
  PURCHASE_EDIT_LIST,
  PURCHASE_CREATE,
  PURCHASE_SUB_DELETE,
  PURCHASE_STATUS,
} from "@/api";

export const purchaseService = {
  getAll: async (token) => {
    const response = await apiClient.get(`${PURCHASE_LIST}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.purchase;
  },

  getById: async (id, token) => {
    const response = await apiClient.get(`${PURCHASE_EDIT_LIST}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  create: async (data, token) => {
    const response = await apiClient.post(PURCHASE_CREATE, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  update: async (id, data, token) => {
    const response = await apiClient.put(`${PURCHASE_EDIT_LIST}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  delete: async (id, token) => {
    const response = await apiClient.delete(`${PURCHASE_EDIT_LIST}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  deleteSubItem: async (id, token) => {
    const response = await apiClient.delete(`${PURCHASE_SUB_DELETE}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateStatus: async (id, token) => {
    const response = await apiClient.get(`${PURCHASE_STATUS}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
