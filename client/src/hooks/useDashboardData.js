import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

export default function useDashboardData(options = {}) {
  return useQuery({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      const { data } = await api.get("/dashboard");
      return data.data;
    },
    ...options,
  });
}
