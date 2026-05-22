import api from "./api";
import { getApiErrorMessage } from "../utils/apiErrors";

const RESCUE_API = "/rescue";

const rescueFail = (error, fallback, context, extra = {}) => {
  if (import.meta.env.DEV && context) {
    console.error(context, error.response?.data || error.message);
  }
  return { success: false, message: getApiErrorMessage(error, fallback), ...extra };
};

/**
 * Build multipart FormData for rescue creation (required for uploads).
 */
export const buildRescueFormData = (data = {}) => {
  const formData = new FormData();

  const textFields = [
    "animalType",
    "condition",
    "description",
    "severity",
    "latitude",
    "longitude",
    "address",
  ];

  textFields.forEach((field) => {
    const value = data[field];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      formData.append(field, String(value).trim());
    }
  });

  if (data.images) {
    const files = Array.isArray(data.images) ? data.images : [data.images];
    files.forEach((file) => {
      if (file instanceof File || file instanceof Blob) {
        formData.append("images", file);
      }
    });
  }

  return formData;
};

/**
 * Create a new rescue request (always multipart FormData).
 */
export const createRescue = async (rescueData) => {
  try {
    const payload =
      rescueData instanceof FormData ? rescueData : buildRescueFormData(rescueData);

    const response = await api.post(`${RESCUE_API}/create`, payload);
    const { data } = response;
    return { success: true, data: data.data };
  } catch (error) {
    return rescueFail(error, "Failed to create rescue request", "CREATE RESCUE");
  }
};

export const getAllRescues = async (params = {}) => {
  try {
    const { data } = await api.get(`${RESCUE_API}/all`, { params });
    return {
      success: true,
      data: data.data,
      pagination: data.pagination || { page: 1, limit: 20, total: 0, pages: 0 },
    };
  } catch (error) {
    return rescueFail(error, "Failed to fetch rescue requests", "GET ALL RESCUES", {
      data: [],
      pagination: { page: 1, limit: 20, total: 0, pages: 0 },
    });
  }
};

export const getMyRescues = async (params = {}) => {
  try {
    const { data } = await api.get(`${RESCUE_API}/my`, { params });
    return {
      success: true,
      data: data.data,
      pagination: data.pagination || { page: 1, limit: 20, total: 0, pages: 0 },
    };
  } catch (error) {
    return rescueFail(error, "Failed to fetch your rescues", "GET MY RESCUES", {
      data: [],
      pagination: { page: 1, limit: 20, total: 0, pages: 0 },
    });
  }
};

export const getSingleRescue = async (rescueId) => {
  try {
    const { data } = await api.get(`${RESCUE_API}/${rescueId}`);
    return { success: true, data: data.data };
  } catch (error) {
    return rescueFail(error, "Failed to fetch rescue request", "GET SINGLE RESCUE");
  }
};

export const assignNgo = async (rescueId, ngoId) => {
  try {
    const { data } = await api.put(`${RESCUE_API}/assign-ngo/${rescueId}`, { ngoId });
    return { success: true, data: data.data };
  } catch (error) {
    return rescueFail(error, "Failed to assign NGO", "ASSIGN NGO");
  }
};

export const assignVolunteer = async (rescueId, volunteerId) => {
  try {
    const { data } = await api.put(`${RESCUE_API}/assign-volunteer/${rescueId}`, {
      volunteerId,
    });
    return { success: true, data: data.data };
  } catch (error) {
    return rescueFail(error, "Failed to assign volunteer", "ASSIGN VOLUNTEER");
  }
};

export const acceptMission = async (rescueId) => {
  try {
    const { data } = await api.put(`${RESCUE_API}/accept/${rescueId}`);
    return { success: true, data: data.data };
  } catch (error) {
    return rescueFail(error, "Failed to accept mission", "ACCEPT MISSION");
  }
};

export const updateMissionStatus = async (rescueId, status, note = "") => {
  try {
    const { data } = await api.put(`${RESCUE_API}/update-mission/${rescueId}`, {
      status,
      note,
    });
    return { success: true, data: data.data };
  } catch (error) {
    return rescueFail(error, "Failed to update mission status", "UPDATE MISSION STATUS");
  }
};

export const getAssignedRescues = async (params = {}) => {
  try {
    const { data } = await api.get(`${RESCUE_API}/assigned`, { params });
    return {
      success: true,
      data: data.data,
      pagination: data.pagination || { page: 1, limit: 20, total: 0, pages: 0 },
    };
  } catch (error) {
    return rescueFail(error, "Failed to fetch assigned rescues", "GET ASSIGNED RESCUES", {
      data: [],
      pagination: { page: 1, limit: 20, total: 0, pages: 0 },
    });
  }
};

export const updateRescueStatus = async (rescueId, status, note = "") => {
  try {
    const { data } = await api.put(`${RESCUE_API}/update-status/${rescueId}`, {
      status,
      note,
    });
    return { success: true, data: data.data };
  } catch (error) {
    return rescueFail(error, "Failed to update rescue status", "UPDATE RESCUE STATUS");
  }
};

export const getRescueStats = async () => {
  try {
    const { data } = await api.get(`${RESCUE_API}/stats/overview`);
    return { success: true, data: data.data };
  } catch (error) {
    return rescueFail(error, "Failed to fetch statistics", "GET RESCUE STATS");
  }
};

export const getCriticalRescues = async (params = {}) => {
  try {
    const { data } = await api.get(`${RESCUE_API}/critical/list`, { params });
    return {
      success: true,
      data: data.data,
      pagination: data.pagination || { page: 1, limit: 10, total: 0, pages: 0 },
    };
  } catch (error) {
    return rescueFail(error, "Failed to fetch critical rescues", "GET CRITICAL RESCUES", {
      data: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 0 },
    });
  }
};
