import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import useViewport from "../../hooks/useViewport";
import { vFadeUp } from "../../animations/variants";
import { registerNGO } from "../../services/ngoService";
import Btn from "../ui/Button";

const NGO_TYPES = [
  "Rescue",
  "Shelter",
  "Medical",
  "Wildlife",
  "Adoption",
  "Sanctuary",
  "Welfare",
  "Other",
];

export default function NGORegistrationForm() {
  const { T } = useT();
  const vp = useViewport();
  const { user, email: authEmail } = useAuth();

  const [formData, setFormData] = useState({
    organizationName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",
    registrationNumber: "",
    ngoType: ["Rescue"],
    description: "",
    website: "",
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
      youtube: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (authEmail || user?.name || user?.fullName) {
      setFormData((prev) => ({
        ...prev,
        email: prev.email || authEmail || "",
        organizationName: prev.organizationName || user?.fullName || user?.name || "",
      }));
    }
  }, [authEmail, user]);

  const steps = [
    { title: "Basic Information", fields: ["organizationName", "email", "phone"] },
    { title: "Location", fields: ["address", "city", "state", "pincode"] },
    { title: "Organization Details", fields: ["registrationNumber", "ngoType", "description"] },
    { title: "Contact & Social", fields: ["website", "socialMedia"] },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialMediaChange = (platform, value) => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value,
      },
    }));
  };

  const handleNgoTypeToggle = (type) => {
    setFormData((prev) => {
      const types = prev.ngoType.includes(type)
        ? prev.ngoType.filter((t) => t !== type)
        : [...prev.ngoType, type];
      return { ...prev, ngoType: types };
    });
  };

  const validateStep = (stepIndex) => {
    const stepFields = steps[stepIndex].fields;
    for (const field of stepFields) {
      if (field === "ngoType") {
        if (!formData.ngoType.length) return false;
      } else if (field === "socialMedia") {
        // Optional
        continue;
      } else if (!formData[field]) {
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep < steps.length - 1) {
        setActiveStep(activeStep + 1);
        setError(null);
      }
    } else {
      setError("Please fill all required fields in this step");
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate all fields
    if (!formData.organizationName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.state) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }

    const result = await registerNGO({
      organizationName: formData.organizationName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      registrationNumber: formData.registrationNumber,
      ngoType: formData.ngoType,
      description: formData.description,
      website: formData.website,
      socialMedia: formData.socialMedia,
    });

    setLoading(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.message);
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={vFadeUp}
      style={{
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: 16,
        padding: "clamp(1.5rem, 3vw, 2.5rem)",
        boxShadow: T.shadow,
      }}
    >
      {/* Header */}
      {!success && (
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 1.8rem)", fontWeight: 800, color: T.text, margin: "0 0 0.5rem" }}>
            Register Your NGO
          </h2>
          <p style={{ fontSize: "0.9rem", color: T.textSub, margin: 0 }}>
            Join ResQNet and get access to animal rescue coordination tools
          </p>
        </div>
      )}

      {success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            padding: "3rem 1rem",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
          <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 1.8rem)", fontWeight: 800, color: T.text, margin: "0 0 1rem" }}>
            Thank you for joining our team!
          </h2>
          <p style={{ fontSize: "1.05rem", color: T.textSub, margin: "0 auto 2.5rem", maxWidth: "500px", lineHeight: 1.6 }}>
            We have received your application. You will be able to access the dashboard as soon as we verify your identity and confirm your organization. Please wait for approval.
          </p>
          <motion.button
            onClick={() => window.location.href = "/"}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "0.8rem 2.5rem",
              background: T.accent,
              color: "white",
              borderRadius: 8,
              border: "none",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: `0 4px 14px ${T.accent}40`,
            }}
          >
            Return to Home
          </motion.button>
        </motion.div>
      ) : (
        <>
          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  padding: "1rem",
                  background: "#FEE2E2",
                  border: "1px solid #FCA5A5",
                  borderRadius: 10,
                  marginBottom: "1.5rem",
                  color: "#991B1B",
                  fontSize: "0.9rem",
                }}
              >
                ✗ {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress Steps */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: vp.mobile ? "wrap" : "nowrap" }}>
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                onClick={() => idx <= activeStep && setActiveStep(idx)}
                style={{
                  flex: 1,
                  minWidth: vp.mobile ? "calc(50% - 0.25rem)" : "auto",
                  height: 40,
                  background: idx === activeStep ? T.accent : idx < activeStep ? T.accentPale : T.bgAlt,
                  border: `1px solid ${idx === activeStep ? T.accent : T.border}`,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: idx < activeStep ? "pointer" : "default",
                  transition: "all 0.3s",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: idx === activeStep ? "white" : idx < activeStep ? T.accent : T.textSub,
                  whileHover: idx < activeStep ? { scale: 1.05 } : {},
                }}
                as={motion.div}
              >
                {vp.mobile ? `${idx + 1}` : step.title}
              </motion.div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Information */}
        <AnimatePresence mode="wait">
          {activeStep === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ display: "grid", gap: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: T.text, marginBottom: "0.4rem" }}>
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleInputChange}
                    placeholder="e.g., Apple Dog Society NGO Kota"
                    style={{
                      width: "100%",
                      padding: "0.7rem",
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      background: T.bg,
                      color: T.text,
                      fontSize: "0.9rem",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = T.accent)}
                    onBlur={(e) => (e.target.style.borderColor = T.border)}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: T.text, marginBottom: "0.4rem" }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contact@ngo.com"
                    readOnly={!!authEmail}
                    style={{
                      width: "100%",
                      padding: "0.7rem",
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      background: authEmail ? T.bgAlt : T.bg,
                      color: authEmail ? T.textSub : T.text,
                      fontSize: "0.9rem",
                      outline: "none",
                      transition: "border-color 0.2s",
                      cursor: authEmail ? "not-allowed" : "text",
                    }}
                    onFocus={(e) => !authEmail && (e.target.style.borderColor = T.accent)}
                    onBlur={(e) => !authEmail && (e.target.style.borderColor = T.border)}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: T.text, marginBottom: "0.4rem" }}>
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 XXXXX XXXXX"
                    style={{
                      width: "100%",
                      padding: "0.7rem",
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      background: T.bg,
                      color: T.text,
                      fontSize: "0.9rem",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = T.accent)}
                    onBlur={(e) => (e.target.style.borderColor = T.border)}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Location */}
          {activeStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ display: "grid", gap: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: T.text, marginBottom: "0.4rem" }}>
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Full address with area"
                    style={{
                      width: "100%",
                      padding: "0.7rem",
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      background: T.bg,
                      color: T.text,
                      fontSize: "0.9rem",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = T.accent)}
                    onBlur={(e) => (e.target.style.borderColor = T.border)}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: T.text, marginBottom: "0.4rem" }}>
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Kota"
                      style={{
                        width: "100%",
                        padding: "0.7rem",
                        border: `1px solid ${T.border}`,
                        borderRadius: 8,
                        background: T.bg,
                        color: T.text,
                        fontSize: "0.9rem",
                        outline: "none",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = T.accent)}
                      onBlur={(e) => (e.target.style.borderColor = T.border)}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: T.text, marginBottom: "0.4rem" }}>
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Rajasthan"
                      style={{
                        width: "100%",
                        padding: "0.7rem",
                        border: `1px solid ${T.border}`,
                        borderRadius: 8,
                        background: T.bg,
                        color: T.text,
                        fontSize: "0.9rem",
                        outline: "none",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = T.accent)}
                      onBlur={(e) => (e.target.style.borderColor = T.border)}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: T.text, marginBottom: "0.4rem" }}>
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="324005"
                      style={{
                        width: "100%",
                        padding: "0.7rem",
                        border: `1px solid ${T.border}`,
                        borderRadius: 8,
                        background: T.bg,
                        color: T.text,
                        fontSize: "0.9rem",
                        outline: "none",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = T.accent)}
                      onBlur={(e) => (e.target.style.borderColor = T.border)}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: T.text, marginBottom: "0.4rem" }}>
                      Latitude (Optional)
                    </label>
                    <input
                      type="number"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      placeholder="25.2108"
                      step="0.0001"
                      style={{
                        width: "100%",
                        padding: "0.7rem",
                        border: `1px solid ${T.border}`,
                        borderRadius: 8,
                        background: T.bg,
                        color: T.text,
                        fontSize: "0.9rem",
                        outline: "none",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = T.accent)}
                      onBlur={(e) => (e.target.style.borderColor = T.border)}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: T.text, marginBottom: "0.4rem" }}>
                    Longitude (Optional)
                  </label>
                  <input
                    type="number"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="75.8863"
                    step="0.0001"
                    style={{
                      width: "100%",
                      padding: "0.7rem",
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      background: T.bg,
                      color: T.text,
                      fontSize: "0.9rem",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = T.accent)}
                    onBlur={(e) => (e.target.style.borderColor = T.border)}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Organization Details */}
          {activeStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ display: "grid", gap: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: T.text, marginBottom: "0.4rem" }}>
                    Registration Number
                  </label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                    placeholder="NGO registration / 12A number"
                    style={{
                      width: "100%",
                      padding: "0.7rem",
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      background: T.bg,
                      color: T.text,
                      fontSize: "0.9rem",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = T.accent)}
                    onBlur={(e) => (e.target.style.borderColor = T.border)}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: T.text, marginBottom: "0.75rem" }}>
                    NGO Type (Select all that apply) *
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: vp.mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: "0.5rem" }}>
                    {NGO_TYPES.map((type) => (
                      <motion.button
                        key={type}
                        type="button"
                        onClick={() => handleNgoTypeToggle(type)}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          padding: "0.6rem",
                          border: `1px solid ${formData.ngoType.includes(type) ? T.accent : T.border}`,
                          background: formData.ngoType.includes(type) ? T.accentPale : T.bg,
                          color: formData.ngoType.includes(type) ? T.accent : T.textSub,
                          borderRadius: 8,
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.2s",
                          fontFamily: "inherit",
                        }}
                      >
                        {type}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: T.text, marginBottom: "0.4rem" }}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell us about your NGO, mission, and impact"
                    rows="4"
                    style={{
                      width: "100%",
                      padding: "0.7rem",
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      background: T.bg,
                      color: T.text,
                      fontSize: "0.9rem",
                      outline: "none",
                      transition: "border-color 0.2s",
                      fontFamily: "inherit",
                      resize: "vertical",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = T.accent)}
                    onBlur={(e) => (e.target.style.borderColor = T.border)}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Contact & Social */}
          {activeStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ display: "grid", gap: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: T.text, marginBottom: "0.4rem" }}>
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://yourwebsite.com"
                    style={{
                      width: "100%",
                      padding: "0.7rem",
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      background: T.bg,
                      color: T.text,
                      fontSize: "0.9rem",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = T.accent)}
                    onBlur={(e) => (e.target.style.borderColor = T.border)}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: T.text, marginBottom: "0.4rem" }}>
                    Facebook
                  </label>
                  <input
                    type="url"
                    value={formData.socialMedia.facebook}
                    onChange={(e) => handleSocialMediaChange("facebook", e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                    style={{
                      width: "100%",
                      padding: "0.7rem",
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      background: T.bg,
                      color: T.text,
                      fontSize: "0.9rem",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = T.accent)}
                    onBlur={(e) => (e.target.style.borderColor = T.border)}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: T.text, marginBottom: "0.4rem" }}>
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={formData.socialMedia.instagram}
                    onChange={(e) => handleSocialMediaChange("instagram", e.target.value)}
                    placeholder="https://instagram.com/yourprofile"
                    style={{
                      width: "100%",
                      padding: "0.7rem",
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      background: T.bg,
                      color: T.text,
                      fontSize: "0.9rem",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = T.accent)}
                    onBlur={(e) => (e.target.style.borderColor = T.border)}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: T.text, marginBottom: "0.4rem" }}>
                    Twitter
                  </label>
                  <input
                    type="url"
                    value={formData.socialMedia.twitter}
                    onChange={(e) => handleSocialMediaChange("twitter", e.target.value)}
                    placeholder="https://twitter.com/yourhandle"
                    style={{
                      width: "100%",
                      padding: "0.7rem",
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      background: T.bg,
                      color: T.text,
                      fontSize: "0.9rem",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = T.accent)}
                    onBlur={(e) => (e.target.style.borderColor = T.border)}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: T.text, marginBottom: "0.4rem" }}>
                    YouTube
                  </label>
                  <input
                    type="url"
                    value={formData.socialMedia.youtube}
                    onChange={(e) => handleSocialMediaChange("youtube", e.target.value)}
                    placeholder="https://youtube.com/yourchannel"
                    style={{
                      width: "100%",
                      padding: "0.7rem",
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      background: T.bg,
                      color: T.text,
                      fontSize: "0.9rem",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = T.accent)}
                    onBlur={(e) => (e.target.style.borderColor = T.border)}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", justifyContent: "space-between" }}>
          <motion.button
            type="button"
            onClick={handlePrev}
            disabled={activeStep === 0}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "0.7rem 1.5rem",
              border: `1px solid ${T.border}`,
              background: T.bg,
              color: T.text,
              borderRadius: 8,
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: activeStep === 0 ? "not-allowed" : "pointer",
              opacity: activeStep === 0 ? 0.5 : 1,
              transition: "all 0.2s",
              fontFamily: "inherit",
            }}
          >
            ← Previous
          </motion.button>

          {activeStep === steps.length - 1 ? (
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "0.7rem 2rem",
                background: T.accent,
                color: "white",
                borderRadius: 8,
                border: "none",
                fontSize: "0.9rem",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
            >
              {loading ? "Registering..." : "Submit Registration"}
            </motion.button>
          ) : (
            <motion.button
              type="button"
              onClick={handleNext}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "0.7rem 1.5rem",
                background: T.accent,
                color: "white",
                borderRadius: 8,
                border: "none",
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
            >
              Next →
            </motion.button>
          )}
        </div>
      </form>
      </>
      )}
    </motion.div>
  );
}
