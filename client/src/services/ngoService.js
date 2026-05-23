import api from "./api";
import { getApiErrorMessage } from "../utils/apiErrors";

export async function getNgos({ limit = 6, sort } = {}) {
  const params = {};
  if (limit) params.limit = limit;
  if (sort) params.sort = sort;

  const { data } = await api.get("/users/ngos", { params });
  const result = data?.data;
  return Array.isArray(result) ? result : result?.ngos || [];
}

/**
 * Get NGO stats overview
 */
export async function getNgoStatsOverview() {
  try {
    const { data } = await api.get("/ngos/stats/overview");
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error, "Failed to fetch NGO stats") };
  }
}

/**
 * Register a new NGO
 */
export async function registerNGO(ngoData) {
  try {
    const { data } = await api.post("/ngos/register", ngoData);
    return { success: true, data: data.data, message: data.message };
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to register NGO"),
    };
  }
}

/**
 * Get all verified NGOs
 */
export async function getAllNGOs({ limit = 50, city, type } = {}) {
  try {
    const params = { limit };
    if (city) params.city = city;
    if (type) params.type = type;

    const { data } = await api.get("/ngos", { params });
    return { success: true, data: data.data, message: data.message };
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to fetch NGOs"),
      data: { ngos: [] },
    };
  }
}

/**
 * Get NGO by ID
 */
export async function getNGOById(id) {
  try {
    const { data } = await api.get(`/ngos/${id}`);
    return { success: true, data: data.data, message: data.message };
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to fetch NGO"),
    };
  }
}

/**
 * Get verification status for an NGO
 */
export async function getVerificationStatus(id) {
  try {
    const { data } = await api.get(`/ngos/${id}/verification-status`);
    return { success: true, data: data.data, message: data.message };
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to fetch verification status"),
    };
  }
}

/**
 * Get pending NGOs for admin (admin only)
 */
export async function getPendingNGOs({ limit = 50, page = 1 } = {}) {
  try {
    const { data } = await api.get("/ngos/admin/pending", {
      params: { limit, page },
    });
    return { success: true, data: data.data, message: data.message };
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to fetch pending NGOs"),
    };
  }
}

/**
 * Verify an NGO (admin only)
 */
export async function verifyNGO(id, { status, notes }) {
  try {
    const { data } = await api.post(`/ngos/admin/verify/${id}`, {
      status,
      notes,
    });
    return { success: true, data: data.data, message: data.message };
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to verify NGO"),
    };
  }
}

/**
 * Get the currently logged-in user's NGO profile
 */
export async function fetchMyNgoProfile() {
  try {
    const { data } = await api.get("/ngos/my-profile");
    return { success: true, data: data.data, message: data.message };
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to fetch NGO profile"),
      status: error.response?.status,
    };
  }
}
