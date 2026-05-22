export const parsePagination = (query = {}, { maxLimit = 100, defaultLimit = 20 } = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(maxLimit, parseInt(query.limit, 10) || defaultLimit);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const buildPaginationMeta = (page, limit, total) => ({
  page,
  limit,
  total,
  pages: Math.ceil(total / limit) || 0,
});
