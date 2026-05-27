import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  createRescue,
  getMyRescues,
  getAllRescues,
  getSingleRescue,
  updateRescueStatus,
  assignNgo,
  autoAssignNgo,
  assignVolunteer,
  acceptMission,
  rejectMission,
  updateMissionStatus,
  getAssignedRescues,
  getRescueStats,
  getCriticalRescues,
} from "../services/rescueService";

const RescueContext = createContext();

export const RescueProvider = ({ children }) => {
  const { user } = useAuth();

  const [rescues, setRescues] = useState([]);
  const [myRescues, setMyRescues] = useState([]);
  const [criticalRescues, setCriticalRescues] = useState([]);
  const [assignedRescues, setAssignedRescues] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const severityScoreMap = {
    critical: 92,
    high: 76,
    medium: 54,
    low: 28,
  };

  const normalizeRescue = (rescue = {}) => {
    const normalized = {
      ...rescue,
      id: rescue._id?.toString() || rescue.id || "",
      animal: rescue.animalType || rescue.animal || rescue.condition || "Unknown",
      location:
        rescue.address ||
        [rescue.city, rescue.state].filter(Boolean).join(", ") ||
        (rescue.location?.city || rescue.location?.state ? [rescue.location.city, rescue.location.state].filter(Boolean).join(", ") : null) ||
        rescue.location ||
        "Unknown location",
      aiScore: typeof rescue.aiScore === "number" ? rescue.aiScore : severityScoreMap[rescue.severity] ?? 0,
      notes: rescue.description ?? rescue.notes ?? "",
      assignedTo: rescue.assignedNgo?.fullName || rescue.assignedVolunteer?.fullName || "",
      volunteer: rescue.assignedVolunteer?.fullName || rescue.assignedVolunteer?.email || "",
      rescueTimeline: Array.isArray(rescue.rescueTimeline) ? rescue.rescueTimeline : [],
      assignedNgo: rescue.assignedNgo || null,
      assignedVolunteer: rescue.assignedVolunteer || null,
      rejectedBy: rescue.rejectedBy || [],
    };

    return normalized;
  };

  const normalizeRescueList = (list = []) => list.map(normalizeRescue);

  const updateRescueLists = (updatedRescue) => {
    const normalized = normalizeRescue(updatedRescue);
    setMyRescues((prev) => prev.map((item) => (item.id === normalized.id ? normalized : item)));
    setRescues((prev) => prev.map((item) => (item.id === normalized.id ? normalized : item)));
    setCriticalRescues((prev) => prev.map((item) => (item.id === normalized.id ? normalized : item)));
    setAssignedRescues((prev) => prev.map((item) => (item.id === normalized.id ? normalized : item)));
    return normalized;
  };

  const mergeRescueIntoList = (list, rescue) => {
    const normalized = normalizeRescue(rescue);
    return list.some((item) => item.id === normalized.id)
      ? list.map((item) => (item.id === normalized.id ? normalized : item))
      : [normalized, ...list];
  };

  // =========================
  // CREATE RESCUE
  // =========================
  const handleCreateRescue = async (rescueData) => {
    setLoading(true);
    setError(null);

    const result = await createRescue(rescueData);

    if (result.success) {
      const normalized = normalizeRescue(result.data);
      setMyRescues((prev) => [normalized, ...prev]);
      setLoading(false);
      return { success: true, data: normalized };
    } else {
      setError(result.message);
      setLoading(false);
      return { success: false, message: result.message };
    }
  };

  // =========================
  // FETCH MY RESCUES
  // =========================
  const handleFetchMyRescues = async (params = {}) => {
    setLoading(true);
    setError(null);

    const result = await getMyRescues(params);

    if (result.success) {
      const normalized = normalizeRescueList(result.data);
      setMyRescues(normalized);
      setPagination(result.pagination);
      setLoading(false);
      return { success: true };
    } else {
      setError(result.message);
      setMyRescues([]);
      setLoading(false);
      return { success: false, message: result.message };
    }
  };

  // =========================
  // FETCH ALL RESCUES
  // =========================
  const handleFetchAllRescues = async (params = {}) => {
    setLoading(true);
    setError(null);

    const result = await getAllRescues(params);

    if (result.success) {
      const normalized = normalizeRescueList(result.data);
      setRescues(normalized);
      setPagination(result.pagination);
      setLoading(false);
      return { success: true };
    } else {
      setError(result.message);
      setRescues([]);
      setLoading(false);
      return { success: false, message: result.message };
    }
  };

  // =========================
  // FETCH CRITICAL RESCUES
  // =========================
  const handleFetchCriticalRescues = async (params = {}) => {
    setLoading(true);
    setError(null);

    const result = await getCriticalRescues(params);

    if (result.success) {
      const normalized = normalizeRescueList(result.data);
      setCriticalRescues(normalized);
      setLoading(false);
      return { success: true };
    } else {
      setError(result.message);
      setCriticalRescues([]);
      setLoading(false);
      return { success: false, message: result.message };
    }
  };

  // =========================
  // FETCH ASSIGNED RESCUES
  const handleFetchAssignedRescues = async (params = {}) => {
    setLoading(true);
    setError(null);

    const result = await getAssignedRescues(params);

    if (result.success) {
      const normalized = normalizeRescueList(result.data);
      setAssignedRescues(normalized);
      setLoading(false);
      return { success: true };
    } else {
      setError(result.message);
      setAssignedRescues([]);
      setLoading(false);
      return { success: false, message: result.message };
    }
  };

  // =========================
  // UPDATE RESCUE STATUS
  // =========================
  const handleAssignNgo = async (rescueId, ngoId) => {
    setLoading(true);
    setError(null);

    const result = await assignNgo(rescueId, ngoId);

    if (result.success) {
      const updated = normalizeRescue(result.data);
      setRescues((prev) => mergeRescueIntoList(prev, updated));
      setAssignedRescues((prev) => mergeRescueIntoList(prev, updated));
      setCriticalRescues((prev) => mergeRescueIntoList(prev, updated));
      if (user?.role === "admin") await handleFetchStats();
      setLoading(false);
      return { success: true, data: updated };
    }

    setError(result.message);
    setLoading(false);
    return { success: false, message: result.message };
  };

  const handleAutoAssignNgo = async (rescueId) => {
    setLoading(true);
    setError(null);

    const result = await autoAssignNgo(rescueId);

    if (result.success) {
      const updated = normalizeRescue(result.data);
      setRescues((prev) => mergeRescueIntoList(prev, updated));
      setAssignedRescues((prev) => mergeRescueIntoList(prev, updated));
      setCriticalRescues((prev) => mergeRescueIntoList(prev, updated));
      if (user?.role === "admin") await handleFetchStats();
      setLoading(false);
      return { success: true, data: updated };
    }

    setError(result.message);
    setLoading(false);
    return { success: false, message: result.message };
  };

  const handleAssignVolunteer = async (rescueId, volunteerId) => {
    setLoading(true);
    setError(null);

    const result = await assignVolunteer(rescueId, volunteerId);

    if (result.success) {
      const updated = normalizeRescue(result.data);
      setRescues((prev) => mergeRescueIntoList(prev, updated));
      setAssignedRescues((prev) => mergeRescueIntoList(prev, updated));
      setCriticalRescues((prev) => mergeRescueIntoList(prev, updated));
      if (user?.role === "admin") await handleFetchStats();
      setLoading(false);
      return { success: true, data: updated };
    }

    setError(result.message);
    setLoading(false);
    return { success: false, message: result.message };
  };

  const handleAcceptMission = async (rescueId) => {
    setLoading(true);
    setError(null);

    const result = await acceptMission(rescueId);

    if (result.success) {
      const updated = normalizeRescue(result.data);
      setMyRescues((prev) => mergeRescueIntoList(prev, updated));
      setRescues((prev) => mergeRescueIntoList(prev, updated));
      setAssignedRescues((prev) => mergeRescueIntoList(prev, updated));
      setCriticalRescues((prev) => mergeRescueIntoList(prev, updated));
      if (user?.role === "admin") await handleFetchStats();
      setLoading(false);
      return { success: true, data: updated };
    }

    setError(result.message);
    setLoading(false);
    return { success: false, message: result.message };
  };

  const handleRejectMission = async (rescueId) => {
    setLoading(true);
    setError(null);

    const result = await rejectMission(rescueId);

    if (result.success) {
      const updated = normalizeRescue(result.data);
      // Remove from assigned list if the current user rejected it
      setAssignedRescues((prev) => prev.filter(r => r.id !== updated.id));
      setMyRescues((prev) => prev.filter(r => r.id !== updated.id));
      setRescues((prev) => mergeRescueIntoList(prev, updated));
      setCriticalRescues((prev) => mergeRescueIntoList(prev, updated));
      if (user?.role === "admin") await handleFetchStats();
      setLoading(false);
      return { success: true, data: updated };
    }

    setError(result.message);
    setLoading(false);
    return { success: false, message: result.message };
  };

  const handleUpdateMissionStatus = async (rescueId, status, note = "") => {
    setLoading(true);
    setError(null);

    const result = await updateMissionStatus(rescueId, status, note);

    if (result.success) {
      const updated = normalizeRescue(result.data);
      setMyRescues((prev) => mergeRescueIntoList(prev, updated));
      setRescues((prev) => mergeRescueIntoList(prev, updated));
      setAssignedRescues((prev) => mergeRescueIntoList(prev, updated));
      setCriticalRescues((prev) => mergeRescueIntoList(prev, updated));
      if (user?.role === "admin") await handleFetchStats();
      setLoading(false);
      return { success: true, data: updated };
    }

    setError(result.message);
    setLoading(false);
    return { success: false, message: result.message };
  };

  const handleUpdateRescueStatus = async (rescueId, status, note = "") => {
    setLoading(true);
    setError(null);

    const result = await updateRescueStatus(rescueId, status, note);

    if (result.success) {
      const updated = normalizeRescue(result.data);
      const idKey = updated.id.toString();

      const updateList = (list) => {
        const hasItem = list.some((r) => r.id?.toString() === idKey);
        if (hasItem) {
          return list.map((r) => (r.id?.toString() === idKey ? updated : r));
        }
        return [updated, ...list];
      };

      setMyRescues((prev) => updateList(prev));
      setRescues((prev) => updateList(prev));
      setAssignedRescues((prev) => updateList(prev));
      setCriticalRescues((prev) => updateList(prev));

      if (user?.role === "admin") {
        await handleFetchStats();
      }
      if (["ngo", "volunteer", "admin"].includes(user?.role)) {
        await Promise.all([handleFetchAllRescues(), handleFetchCriticalRescues()]);
      }

      setLoading(false);
      return { success: true, data: updated };
    } else {
      setError(result.message);
      setLoading(false);
      return { success: false, message: result.message };
    }
  };

  // =========================
  // FETCH STATS
  // =========================
  const handleFetchStats = async () => {
    const result = await getRescueStats();

    if (result.success) {
      setStats(result.data);
      return { success: true };
    } else {
      setError(result.message);
      return { success: false, message: result.message };
    }
  };

  // =========================
  // AUTO-LOAD DATA ON MOUNT
  // =========================
  useEffect(() => {
    if (!user) return;

    const isOperationalNGO = user.role === "ngo" && user.ngoProfile?.verified;
    const isOperationalOther = ["volunteer", "admin"].includes(user.role);
    const isOperational = isOperationalNGO || isOperationalOther;

    // Load user's rescues
    if (["user", "ngo", "volunteer", "admin"].includes(user.role)) {
      handleFetchMyRescues();
    }

    // Load operational rescues
    if (isOperational) {
      handleFetchAllRescues();
      handleFetchCriticalRescues();
      handleFetchAssignedRescues();
    }

    // Load stats for admin
    if (user.role === "admin") {
      handleFetchStats();
    }
  }, [user]);

  return (
    <RescueContext.Provider
      value={{
        // State
        rescues,
        myRescues,
        criticalRescues,
        assignedRescues,
        stats,
        loading,
        error,
        pagination,

        // Actions
        createRescue: handleCreateRescue,
        fetchMyRescues: handleFetchMyRescues,
        fetchAllRescues: handleFetchAllRescues,
        fetchCriticalRescues: handleFetchCriticalRescues,
        fetchAssignedRescues: handleFetchAssignedRescues,
        assignNgo: handleAssignNgo,
        autoAssignNgo: handleAutoAssignNgo,
        assignVolunteer: handleAssignVolunteer,
        acceptMission: handleAcceptMission,
        rejectMission: handleRejectMission,
        updateMissionStatus: handleUpdateMissionStatus,
        updateRescueStatus: handleUpdateRescueStatus,
        fetchStats: handleFetchStats,
      }}
    >
      {children}
    </RescueContext.Provider>
  );
};

export const useRescue = () => {
  const context = useContext(RescueContext);
  if (!context) {
    throw new Error("useRescue must be used within RescueProvider");
  }
  return context;
};
