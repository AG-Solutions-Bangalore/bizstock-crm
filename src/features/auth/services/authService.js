import apiClient from "@/api/axios";
import { CREATE_SIGNUP, EDIT_PROFILE, PROFILE, PANEL_LOGIN, PANEL_FORGOT_PASSWORD } from "@/api";
import BASE_URL from "@/config/BaseUrl";
import axios from "axios";

export const loginUser = async (email, password) => {
  const formData = new FormData();
  formData.append("username", email);
  formData.append("password", password);
  const response = await apiClient.post(PANEL_LOGIN, formData);
  return response;
};

export const forgotPassword = async (email, username) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("name", username);
  const response = await apiClient.post(PANEL_FORGOT_PASSWORD, formData);
  return response;
};

export const signupUser = async (formData) => {
  const response = await apiClient.post(CREATE_SIGNUP, formData);
  return response;
};

export const fetchProfile = async (token) => {
  const response = await apiClient.get(PROFILE, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.profile;
};

export const updateProfile = async (formData, token) => {
  const response = await apiClient.put(EDIT_PROFILE, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

export const changePassword = async (formData, token) => {
  const response = await axios.post(`${BASE_URL}/change-password`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};
