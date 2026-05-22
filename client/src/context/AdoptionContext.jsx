import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import {
  fetchAdoptionListings,
  fetchAdoptionStats,
  applyForAdoption,
  fetchMyApplications,
  fetchNgoApplications,
  reviewApplication,
  createAdoptionListing,
} from "../services/adoptionService";

const AdoptionContext = createContext(null);

export function AdoptionProvider({ children }) {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState({ listed: 0, pendingReview: 0, adopted: 0, total: 0 });
  const [myApplications, setMyApplications] = useState([]);
  const [incomingApplications, setIncomingApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadListings = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    const result = await fetchAdoptionListings(params);
    if (result.success) {
      setListings(result.data);
    } else {
      setError(result.message);
      setListings([]);
    }
    setLoading(false);
    return result;
  }, []);

  const loadStats = useCallback(async () => {
    const result = await fetchAdoptionStats();
    if (result.success) setStats(result.data);
    return result;
  }, []);

  const loadMyApplications = useCallback(async () => {
    if (!user) return;
    const result = await fetchMyApplications();
    if (result.success) setMyApplications(result.data);
    return result;
  }, [user]);

  const loadIncomingApplications = useCallback(async () => {
    if (!user || !["ngo", "admin"].includes(user.role)) return;
    const result = await fetchNgoApplications();
    if (result.success) setIncomingApplications(result.data);
    return result;
  }, [user]);

  const submitApplication = async (adoptionId, message) => {
    const result = await applyForAdoption(adoptionId, message);
    if (result.success) {
      await Promise.all([loadListings(), loadMyApplications(), loadStats()]);
    }
    return result;
  };

  const submitReview = async (applicationId, status, reviewNote) => {
    const result = await reviewApplication(applicationId, status, reviewNote);
    if (result.success) {
      await Promise.all([loadIncomingApplications(), loadListings(), loadStats()]);
    }
    return result;
  };

  const submitListing = async (payload) => {
    const result = await createAdoptionListing(payload);
    if (result.success) {
      await Promise.all([loadListings(), loadStats()]);
    }
    return result;
  };

  useEffect(() => {
    loadListings();
    loadStats();
  }, [loadListings, loadStats]);

  useEffect(() => {
    if (!user) return;
    if (user.role === "user" || user.role === "admin") loadMyApplications();
    if (user.role === "ngo" || user.role === "admin") loadIncomingApplications();
  }, [user, loadMyApplications, loadIncomingApplications]);

  return (
    <AdoptionContext.Provider
      value={{
        listings,
        stats,
        myApplications,
        incomingApplications,
        loading,
        error,
        loadListings,
        loadStats,
        loadMyApplications,
        loadIncomingApplications,
        submitApplication,
        submitReview,
        submitListing,
      }}
    >
      {children}
    </AdoptionContext.Provider>
  );
}

export const useAdoption = () => {
  const ctx = useContext(AdoptionContext);
  if (!ctx) throw new Error("useAdoption must be used within AdoptionProvider");
  return ctx;
};
