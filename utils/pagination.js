// utils/pagination.js

/**
 * Default pagination limit = 20
 * Can override using ?page=2&limit=10
 */
export const getPagination = (req) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);

  // DEFAULT LIMIT = 20 (your requirement)
  const limit = Math.max(parseInt(req.query.limit) || 20, 1);

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};


/**
 * Build pagination metadata
 */
export const buildPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);

  return {
    totalRecords: total,
    currentPage: page,
    totalPages,
    limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};