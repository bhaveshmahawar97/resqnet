import {
  listNgos,
  listVolunteers,
  resolveCityFromQuery,
} from "../services/userDirectoryService.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getNgoDirectory = asyncHandler(async (req, res) => {
  const city = resolveCityFromQuery({
    city: req.query.city,
    address: req.query.address,
  });
  const latitude = req.query.latitude ? Number(req.query.latitude) : null;
  const longitude = req.query.longitude ? Number(req.query.longitude) : null;

  const ngos = await listNgos({
    city,
    latitude: Number.isFinite(latitude) ? latitude : null,
    longitude: Number.isFinite(longitude) ? longitude : null,
    limit: Math.min(Number(req.query.limit) || 24, 50),
    sort: req.query.sort || "verified",
  });

  return sendSuccess(res, {
    message: "NGO directory loaded",
    data: { ngos, city: city || null },
  });
});

export const getVolunteerDirectory = asyncHandler(async (req, res) => {
  const city = resolveCityFromQuery({
    city: req.query.city,
    address: req.query.address,
  });

  const volunteers = await listVolunteers({
    city,
    limit: Math.min(Number(req.query.limit) || 30, 50),
  });

  return sendSuccess(res, {
    message: "Volunteer directory loaded",
    data: { volunteers, city: city || null },
  });
});
