import apiClient from "@/api/axios";
import {
  DISPATCH_LIST,
  DISPATCH_CREATE,
  DISPATCH_EDIT_LIST,
  DISPATCH_STATUS,
} from "@/api";

export const dispatchService = {
  getAll: async (token) => {
    const response = await apiClient.get(DISPATCH_LIST, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.dispatch;
  },

  getById: async (id, token) => {
    const response = await apiClient.get(`${DISPATCH_EDIT_LIST}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  create: async (data, token) => {
    const response = await apiClient.post(DISPATCH_CREATE, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  update: async (id, data, token) => {
    const response = await apiClient.put(`${DISPATCH_EDIT_LIST}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  delete: async (id, token) => {
    const response = await apiClient.delete(`${DISPATCH_EDIT_LIST}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateStatus: async (id, token) => {
    const response = await apiClient.get(`${DISPATCH_STATUS}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
