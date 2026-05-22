import { User } from "../models/index.js";
import { extractCityFromAddress, haversineKm, formatDistance } from "../utils/geo.js";

const NGO_SELECT =
  "fullName email phone avatar role ngoProfile missionStats createdAt";
const VOLUNTEER_SELECT =
  "fullName email phone avatar role volunteerProfile missionStats createdAt";

const buildCityFilter = (city) => {
  if (!city?.trim()) return {};
  const pattern = new RegExp(city.trim(), "i");
  return {
    $or: [
      { "ngoProfile.city": pattern },
      { "ngoProfile.serviceAreas": pattern },
      { "ngoProfile.organizationName": pattern },
    ],
  };
};

const buildVolunteerCityFilter = (city) => {
  if (!city?.trim()) return {};
  const pattern = new RegExp(city.trim(), "i");
  return {
    $or: [{ "volunteerProfile.city": pattern }, { fullName: pattern }],
  };
};

export const listNgos = async ({ city, latitude, longitude, limit = 24, sort = "verified" } = {}) => {
  const query = {
    role: "ngo",
    isActive: true,
    ...buildCityFilter(city),
  };

  const sortOptions =
    sort === "latest"
      ? { createdAt: -1 }
      : { "ngoProfile.verified": -1, createdAt: -1 };

  const ngos = await User.find(query).select(NGO_SELECT).sort(sortOptions).limit(limit).lean();

  return ngos.map((ngo) => {
    const orgName = ngo.ngoProfile?.organizationName || ngo.fullName;
    const ngoCity =
      ngo.ngoProfile?.city ||
      ngo.ngoProfile?.serviceAreas?.[0] ||
      city ||
      "India";
    let distanceKm = null;
    const meta = ngo.ngoProfile?.metadata || {};
    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      if (Number.isFinite(meta.latitude) && Number.isFinite(meta.longitude)) {
        distanceKm = haversineKm(latitude, longitude, meta.latitude, meta.longitude);
      }
    }

    const ngoLatitude = Number.isFinite(meta.latitude)
      ? meta.latitude
      : Number.isFinite(ngo.ngoProfile?.latitude)
        ? ngo.ngoProfile.latitude
        : null;
    const ngoLongitude = Number.isFinite(meta.longitude)
      ? meta.longitude
      : Number.isFinite(ngo.ngoProfile?.longitude)
        ? ngo.ngoProfile.longitude
        : null;

    return {
      id: ngo._id.toString(),
      name: orgName,
      city: ngoCity,
      latitude: ngoLatitude,
      longitude: ngoLongitude,
      distance: distanceKm != null ? formatDistance(distanceKm) : null,
      distanceKm,
      responseTime: distanceKm != null && distanceKm < 5 ? "~10 min" : "~20 min",
      specialties: ngo.ngoProfile?.serviceAreas?.length
        ? ngo.ngoProfile.serviceAreas.slice(0, 4)
        : ["Rescue", "Rehabilitation"],
      rating: 4.8,
      verified: Boolean(ngo.ngoProfile?.verified),
      status: "available",
      phone: ngo.phone || "",
      email: ngo.email,
      missionsCompleted: ngo.missionStats?.missionsCompleted || 0,
    };
  }).sort((a, b) => {
    if (a.distanceKm == null) return 1;
    if (b.distanceKm == null) return -1;
    return a.distanceKm - b.distanceKm;
  });
};

export const listVolunteers = async ({ city, limit = 30 } = {}) => {
  const query = {
    role: "volunteer",
    isActive: true,
    ...buildVolunteerCityFilter(city),
  };

  const volunteers = await User.find(query).select(VOLUNTEER_SELECT).limit(limit).lean();

  return volunteers.map((vol) => ({
    id: vol._id.toString(),
    name: vol.fullName,
    email: vol.email,
    city: vol.volunteerProfile?.city || city || "—",
    availability: vol.volunteerProfile?.availability || "available",
    missionsCompleted: vol.missionStats?.missionsCompleted || 0,
    rating: 4.7,
    skills: vol.volunteerProfile?.skills || [],
    verified: Boolean(vol.volunteerProfile?.verified),
  }));
};

export const resolveCityFromQuery = ({ city, address }) =>
  city?.trim() || extractCityFromAddress(address) || "";

export default { listNgos, listVolunteers, resolveCityFromQuery };
