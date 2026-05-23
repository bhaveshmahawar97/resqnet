import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchScanHistory, scanAnimal } from "../../services/aiService";

export function useScanHistory(params = { limit: 8, page: 1 }) {
  return useQuery({
    queryKey: ["ai", "scans", params],
    queryFn: async () => {
      const res = await fetchScanHistory(params);
      return res;
    },
  });
}

export function useScanAnimal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ imageUrl, imageName }) => scanAnimal(imageUrl, imageName),
    onSuccess: () => {
      queryClient.invalidateQueries(["ai", "scans"]);
    },
  });
}
