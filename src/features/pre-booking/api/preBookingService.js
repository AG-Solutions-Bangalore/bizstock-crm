import apiClient from "@/api/axios";
import {
  PRE_BOOKING_LIST,
  PRE_BOOKING_CREATE,
} from "@/api";

export const preBookingService = {
  getAll: async (token) => {
    const response = await apiClient.get(PRE_BOOKING_LIST, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.pre_booking;
  },

  getById: async (id, token) => {
    const response = await apiClient.get(`${PRE_BOOKING_CREATE}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  create: async (data, token) => {
    const response = await apiClient.post(PRE_BOOKING_CREATE, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  update: async (id, data, token) => {
    const response = await apiClient.put(`${PRE_BOOKING_CREATE}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  delete: async (id, token) => {
    const response = await apiClient.delete(`${PRE_BOOKING_CREATE}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  deleteSubItem: async (id, token) => {
    // Check if there's a specific endpoint for sub item deletion in PreBooking
    // For now assuming it follows the same pattern as purchase if needed
    const response = await apiClient.delete(`${PRE_BOOKING_CREATE}/sub/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
