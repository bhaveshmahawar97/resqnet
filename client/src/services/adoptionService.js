import { fetchJSON } from "./api";

export async function getAdoptions({ limit = 6 } = {}) {
  const q = limit ? `?limit=${limit}` : "";
  return fetchJSON(`/api/adoptions${q}`);
}
import api from "./api";
import { getApiErrorMessage } from "../utils/apiErrors";

const normalizeListing = (item = {}) => ({
  id: item._id?.toString() || item.id,
  name: item.animalName || item.name || "Unknown",
  species: item.animalType || item.species || "Animal",
  breed: item.breed || "—",
  age: item.metadata?.age || "—",
  gender: item.metadata?.gender || "—",
  status: item.status || "listed",
  city: item.location || item.city || "—",
  ngo: item.listedBy?.ngoProfile?.organizationName || item.listedBy?.fullName || "ResQNet NGO",
  vaccinated: Boolean(item.metadata?.vaccinated),
  neutered: Boolean(item.metadata?.neutered),
  description: item.description || "",
  images: item.images || [],
  compatibility: item.metadata?.compatibility || 85,
});

export const fetchAdoptionListings = async (params = {}) => {
  try {
    const { data } = await api.get("/adoption", { params });
    const listings = (data.data || []).map(normalizeListing);
    return { success: true, data: listings };
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to load adoptable animals"),
      data: [],
    };
  }
};

export const fetchAdoptionStats = async () => {
  try {
    const { data } = await api.get("/adoption/stats");
    return { success: true, data: data.data };
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to load adoption stats"),
      data: { listed: 0, pendingReview: 0, adopted: 0, total: 0 },
    };
  }
};

export const applyForAdoption = async (adoptionId, applicationData) => {
  try {
    const { data } = await api.post(`/adoption/${adoptionId}/apply`, applicationData);
    return { success: true, data: data.data };
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to submit application"),
    };
  }
};

export const fetchMyApplications = async () => {
  try {
    const { data } = await api.get("/adoption/applications/mine");
    return { success: true, data: data.data || [] };
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to load applications"),
      data: [],
    };
  }
};

export const fetchNgoApplications = async () => {
  try {
    const { data } = await api.get("/adoption/applications/incoming");
    return { success: true, data: data.data || [] };
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to load applications"),
      data: [],
    };
  }
};

export const reviewApplication = async (applicationId, status, reviewNote = "") => {
  try {
    const { data } = await api.put(`/adoption/applications/${applicationId}/review`, {
      status,
      reviewNote,
    });
    return { success: true, data: data.data };
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to update application"),
    };
  }
};

export const createAdoptionListing = async (payload) => {
  try {
    const { data } = await api.post("/adoption/listings", payload);
    return { success: true, data: normalizeListing(data.data) };
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to create listing"),
    };
  }
};

export default {
  fetchAdoptionListings,
  fetchAdoptionStats,
  applyForAdoption,
  fetchMyApplications,
  fetchNgoApplications,
  reviewApplication,
  createAdoptionListing,
};
