import { useQuery } from "@tanstack/react-query";
import { fetchNgos, fetchVolunteers } from "../../services/userService";

export function useNgos(params = {}) {
  return useQuery({
    queryKey: ["ngos", params],
    queryFn: async () => {
      const res = await fetchNgos(params);
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
  });
}

export function useVolunteers(params = {}) {
  return useQuery({
    queryKey: ["volunteers", params],
    queryFn: async () => {
      const res = await fetchVolunteers(params);
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
  });
}
