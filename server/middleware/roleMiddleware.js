const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // If the user is an NGO and requires operational access, they must be verified
    if (req.user.role === "ngo") {
      try {
        const { NGO } = await import("../models/index.js");
        const ngo = await NGO.findOne({ email: req.user.email });
        if (!ngo || ngo.verificationStatus !== "approved") {
          return res.status(403).json({ success: false, message: "Verified NGO access required" });
        }
        req.ngo = ngo;
      } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to verify NGO status", error: err.message });
      }
    }

    next();
  };
};

export const isVerifiedNgo = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "ngo") {
      return res.status(403).json({ success: false, message: "NGO access required" });
    }
    
    // Check NGO verification status dynamically
    const { NGO } = await import("../models/index.js");
    const ngo = await NGO.findOne({ email: req.user.email });
    
    if (!ngo || ngo.verificationStatus !== "approved") {
      return res.status(403).json({ success: false, message: "Verified NGO access required" });
    }
    
    // Attach the NGO document to the request for convenience
    req.ngo = ngo;
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to verify NGO status", error: err.message });
  }
};

export default authorizeRoles;
