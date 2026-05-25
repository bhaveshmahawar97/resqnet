import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { fetchDashboardData } from "../services/dashboardService.js";

export const getDashboardData = asyncHandler(async (req, res) => {
  const responseData = await fetchDashboardData(req.user);

  return sendSuccess(res, {
    message: "Dashboard data loaded",
    data: responseData
  });
});
