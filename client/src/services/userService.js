import api from "./api";
import { getApiErrorMessage } from "../utils/apiErrors";

export const fetchNgos = async ({ city, address, latitude, longitude, limit = 24 } = {}) => {
  try {
    const params = { limit };
    if (city) params.city = city;
    if (address) params.address = address;
    if (latitude != null) params.latitude = latitude;
    if (longitude != null) params.longitude = longitude;

    const { data } = await api.get("/users/ngos", { params });
    return { success: true, data: data.data };
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to load NGOs"),
      data: { ngos: [], city: null },
    };
  }
};

export const fetchVolunteers = async ({ city, address, limit = 30 } = {}) => {
  try {
    const params = { limit };
    if (city) params.city = city;
    if (address) params.address = address;

    const { data } = await api.get("/users/volunteers", { params });
    return { success: true, data: data.data };
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to load volunteers"),
      data: { volunteers: [], city: null },
    };
  }
};

export default { fetchNgos, fetchVolunteers };
