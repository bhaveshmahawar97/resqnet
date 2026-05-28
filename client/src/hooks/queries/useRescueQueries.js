import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllRescues,
  getMyRescues,
  getAssignedRescues,
  getRescueStats,
  getCriticalRescues,
  getSingleRescue,
  updateRescueStatus,
  createRescue
} from "../../services/rescueService";

// Queries
export function useAllRescues(params = {}) {
  return useQuery({
    queryKey: ["rescues", "all", params],
    queryFn: async () => {
      const res = await getAllRescues(params);
      if (!res.success) throw new Error(res.message);
      return res;
    },
  });
}

export function useMyRescues(params = {}) {
  return useQuery({
    queryKey: ["rescues", "my", params],
    queryFn: async () => {
      const res = await getMyRescues(params);
      if (!res.success) throw new Error(res.message);
      return res;
    },
  });
}

export function useAssignedRescues(params = {}) {
  return useQuery({
    queryKey: ["rescues", "assigned", params],
    queryFn: async () => {
      const res = await getAssignedRescues(params);
      if (!res.success) throw new Error(res.message);
      return res;
    },
  });
}

export function useCriticalRescues(params = {}) {
  return useQuery({
    queryKey: ["rescues", "critical", params],
    queryFn: async () => {
      const res = await getCriticalRescues(params);
      if (!res.success) throw new Error(res.message);
      return res;
    },
  });
}

export function useRescueStats() {
  return useQuery({
    queryKey: ["rescues", "stats"],
    queryFn: async () => {
      const res = await getRescueStats();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
  });
}

export function useSingleRescue(id) {
  return useQuery({
    queryKey: ["rescues", id],
    queryFn: async () => {
      const res = await getSingleRescue(id);
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    enabled: !!id,
  });
}

// Mutations
export function useCreateRescue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createRescue(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["rescues"]);
    },
  });
}

export function useUpdateRescueStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, note }) => updateRescueStatus(id, status, note),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["rescues"]);
      queryClient.invalidateQueries(["rescues", variables.id]);
    },
  });
}
