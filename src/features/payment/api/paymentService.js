import apiClient from "@/api/axios";
import {
  PAYMENT_LIST,
  PAYMENT_FORM,
} from "@/api";

export const paymentService = {
  getAll: async (token) => {
    const response = await apiClient.get(PAYMENT_LIST, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.payment;
  },

  getById: async (id, token) => {
    const response = await apiClient.get(`${PAYMENT_FORM}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  create: async (data, token) => {
    const response = await apiClient.post(PAYMENT_FORM, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  update: async (id, data, token) => {
    const response = await apiClient.put(`${PAYMENT_FORM}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  delete: async (id, token) => {
    const response = await apiClient.delete(`${PAYMENT_FORM}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
