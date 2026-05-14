import apiClient from "@/api/axios";
import {
  DISPATCH_RETURN_LIST,
  DISPATCH_RETURN_CREATE,
  DISPATCH_RETURN_EDIT_LIST,
} from "@/api";

export const dispatchReturnService = {
  getAll: async (token) => {
    const response = await apiClient.get(DISPATCH_RETURN_LIST, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.dispatch;
  },

  getById: async (id, token) => {
    const response = await apiClient.get(`${DISPATCH_RETURN_EDIT_LIST}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  create: async (data, token) => {
    const response = await apiClient.post(DISPATCH_RETURN_CREATE, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  update: async (id, data, token) => {
    const response = await apiClient.put(`${DISPATCH_RETURN_EDIT_LIST}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  delete: async (id, token) => {
    const response = await apiClient.delete(`${DISPATCH_RETURN_EDIT_LIST}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
