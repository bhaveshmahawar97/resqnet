import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdoptionListings,
  fetchAdoptionStats,
  fetchMyApplications,
  fetchNgoApplications,
  applyForAdoption,
  reviewApplication,
  createAdoptionListing,
} from "../../services/adoptionService";

export function useAdoptionListings(params = {}) {
  return useQuery({
    queryKey: ["adoptions", "listings", params],
    queryFn: async () => {
      const res = await fetchAdoptionListings(params);
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
  });
}

export function useAdoptionStats() {
  return useQuery({
    queryKey: ["adoptions", "stats"],
    queryFn: async () => {
      const res = await fetchAdoptionStats();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
  });
}

export function useMyApplications() {
  return useQuery({
    queryKey: ["adoptions", "my-applications"],
    queryFn: async () => {
      const res = await fetchMyApplications();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
  });
}

export function useNgoApplications() {
  return useQuery({
    queryKey: ["adoptions", "ngo-applications"],
    queryFn: async () => {
      const res = await fetchNgoApplications();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
  });
}

// Mutations
export function useCreateAdoptionListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createAdoptionListing(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["adoptions", "listings"]);
    },
  });
}

export function useApplyForAdoption() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => applyForAdoption(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["adoptions", "my-applications"]);
    },
  });
}

export function useReviewApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, note }) => reviewApplication(id, status, note),
    onSuccess: () => {
      queryClient.invalidateQueries(["adoptions", "ngo-applications"]);
    },
  });
}
