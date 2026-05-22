import api from "./api";

export async function getNgos({ limit = 6, sort } = {}) {
  const params = {};
  if (limit) params.limit = limit;
  if (sort) params.sort = sort;

  const { data } = await api.get("/users/ngos", { params });
  const result = data?.data;
  return Array.isArray(result) ? result : result?.ngos || [];
}
