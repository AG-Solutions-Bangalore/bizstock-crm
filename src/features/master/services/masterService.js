import apiClient from "@/api/axios";
import { 
  BRANCH_LIST, BRANCH_CREATE, BRANCH_EDIT_GET, BRANCH_EDIT_SUMBIT,
  BUYER_LIST, BUYER_CREATE, BUYER_EDIT_GET, BUYER_EDIT_SUMBIT,
  CATEGORY_LIST, CATEGORY_CREATE, CATEGORY_DATA, CATEGORY_UPDATE,
  GODOWN_LIST, GODOWN_CREATE, GODOWN_UPDATE,
  ITEM_LIST, ITEM_CREATE, ITEM_EDIT_GET, ITEM_EDIT_SUMBIT,
  TEAM_LIST, CREATE_TEAM
} from "@/api";

const getHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const masterService = {
  // Branch
  getBranches: async (token) => {
    const response = await apiClient.get(BRANCH_LIST, getHeaders(token));
    return response.data.branch;
  },
  getBranchById: async (id, token) => {
    const response = await apiClient.get(`${BRANCH_EDIT_GET}/${id}`, getHeaders(token));
    return response.data.branch;
  },
  createBranch: async (data, token) => {
    return apiClient.post(BRANCH_CREATE, data, getHeaders(token));
  },
  updateBranch: async (id, data, token) => {
    return apiClient.put(`${BRANCH_EDIT_SUMBIT}/${id}`, data, getHeaders(token));
  },

  // Buyer
  getBuyers: async (token) => {
    const response = await apiClient.get(BUYER_LIST, getHeaders(token));
    return response.data.buyers;
  },
  getBuyerById: async (id, token) => {
    const response = await apiClient.get(`${BUYER_EDIT_GET}/${id}`, getHeaders(token));
    return response.data.buyers;
  },
  createBuyer: async (data, token) => {
    return apiClient.post(BUYER_CREATE, data, getHeaders(token));
  },
  updateBuyer: async (id, data, token) => {
    return apiClient.put(`${BUYER_EDIT_SUMBIT}/${id}`, data, getHeaders(token));
  },

  // Category
  getCategories: async (token) => {
    const response = await apiClient.get(CATEGORY_LIST, getHeaders(token));
    return response.data.category;
  },
  getCategoryById: async (id, token) => {
    const response = await apiClient.get(`${CATEGORY_DATA}/${id}`, getHeaders(token));
    return response.data.category;
  },
  createCategory: async (data, token) => {
    return apiClient.post(CATEGORY_CREATE, data, getHeaders(token));
  },
  updateCategory: async (id, data, token) => {
    return apiClient.put(`${CATEGORY_UPDATE}/${id}`, data, getHeaders(token));
  },

  // Godown
  getGodowns: async (token) => {
    const response = await apiClient.get(GODOWN_LIST, getHeaders(token));
    return response.data.godown;
  },
  getGodownById: async (id, token) => {
    const response = await apiClient.get(`${GODOWN_CREATE}/${id}`, getHeaders(token));
    return response.data.godown;
  },
  createGodown: async (data, token) => {
    return apiClient.post(GODOWN_CREATE, data, getHeaders(token));
  },
  updateGodown: async (id, data, token) => {
    return apiClient.put(`${GODOWN_UPDATE}/${id}`, data, getHeaders(token));
  },

  // Item
  getItems: async (token) => {
    const response = await apiClient.get(ITEM_LIST, getHeaders(token));
    return response.data.items;
  },
  getItemById: async (id, token) => {
    const response = await apiClient.get(`${ITEM_EDIT_GET}/${id}`, getHeaders(token));
    return response.data.items;
  },
  createItem: async (data, token) => {
    return apiClient.post(ITEM_CREATE, data, getHeaders(token));
  },
  updateItem: async (id, data, token) => {
    return apiClient.post(`${ITEM_EDIT_SUMBIT}/${id}`, data, getHeaders(token));
  },

  // Team
  getTeams: async (token) => {
    const response = await apiClient.get(TEAM_LIST, getHeaders(token));
    return response.data.team;
  },
  getTeamById: async (id, token) => {
    // Note: There's no specific fetch by ID for team in the provided API
    return null;
  },
  createTeam: async (data, token) => {
    return apiClient.post(CREATE_TEAM, data, getHeaders(token));
  },
  updateTeam: async (id, data, token) => {
    // Note: There's no specific update for team in the provided API, 
    // potentially it's CREATE_TEAM or a different endpoint
    return apiClient.post(CREATE_TEAM, data, getHeaders(token));
  },
};
