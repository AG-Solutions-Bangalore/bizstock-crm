import apiClient from "@/api/axios";
import {
  PURCHASE_RETURN_LIST,
  PURCHASE_RETURN_EDIT_LIST,
  PURCHASE_RETURN_CREATE,
  PURCHASE_RETURN_SUB_DELETE,
} from "@/api";

export const purchaseReturnService = {
  getAll: async (token) => {
    const response = await apiClient.get(`${PURCHASE_RETURN_LIST}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.purchase;
  },

  getById: async (id, token) => {
    const response = await apiClient.get(`${PURCHASE_RETURN_EDIT_LIST}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  create: async (data, token) => {
    const response = await apiClient.post(PURCHASE_RETURN_CREATE, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  update: async (id, data, token) => {
    const response = await apiClient.put(`${PURCHASE_RETURN_EDIT_LIST}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  delete: async (id, token) => {
    const response = await apiClient.delete(`${PURCHASE_RETURN_EDIT_LIST}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  deleteSubItem: async (id, token) => {
    const response = await apiClient.delete(`${PURCHASE_RETURN_SUB_DELETE}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
