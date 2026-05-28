import { useState, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ngoRegistrationSchema } from "../../utils/validators";
import { useT } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import useViewport from "../../hooks/useViewport";
import { registerNGO } from "../../services/ngoService";
import { uploadToCloudinary } from "../../services/aiService";

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

// Input wrapper component for consistent styling
const OnboardingInput = forwardRef(({ label, type = "text", error, readOnly, ...rest }, ref) => {
  const { T } = useT();
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "grid", gap: "0.4rem" }}>
      <label style={{ fontSize: "0.85rem", fontWeight: 700, color: T.text, letterSpacing: "0.01em" }}>
        {label}
      </label>
      <input
        ref={ref}
        type={type}
        readOnly={readOnly}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur && rest.onBlur(e);
        }}
        {...rest}
        style={{
          width: "100%",
          padding: "0.8rem 1rem",
          border: `1.5px solid ${error ? "#EF4444" : focused ? T.accent : T.border}`,
          borderRadius: 10,
          background: readOnly ? T.bgAlt : T.bg,
          color: readOnly ? T.textSub : T.text,
          fontSize: "0.95rem",
          outline: "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxShadow: focused && !error ? `0 0 0 3px ${T.accentPale}` : "none",
          cursor: readOnly ? "not-allowed" : "text",
          fontFamily: "inherit",
          boxSizing: "border-box"
        }}
      />
      {error && <span style={{ fontSize: "0.75rem", color: T.danger, fontWeight: 600 }}>{error}</span>}
    </div>
  );
});

export default function NGOOnboarding() {
  const { T } = useT();
  const vp = useViewport();
  const { user, email: authEmail } = useAuth();

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ngoRegistrationSchema),
    defaultValues: {
      organizationName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      registrationNumber: "",
      ngoType: ["Rescue"],
      website: "",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const ngoType = watch("ngoType") || [];
  const organizationName = watch("organizationName");
  const email = watch("email");
  const phone = watch("phone");
  const city = watch("city");
  const state = watch("state");
  const registrationNumber = watch("registrationNumber");

  const [docFile, setDocFile] = useState(null);
  const [docPreview, setDocPreview] = useState(null);
  const [docError, setDocError] = useState("");

  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (authEmail || user?.name || user?.fullName) {
      if (!email && authEmail) setValue("email", authEmail);
      if (!organizationName && (user?.fullName || user?.name)) {
        setValue("organizationName", user.fullName || user.name);
      }
    }
  }, [authEmail, user, setValue, email, organizationName]);

  const steps = [
    { title: "Identity", subtitle: "Who are you?", fields: ["organizationName", "website", "ngoType"] },
    { title: "Contact", subtitle: "Where are you located?", fields: ["email", "phone", "address", "city", "state", "pincode"] },
    { title: "Verification", subtitle: "Upload documents", fields: ["registrationNumber"] },
    { title: "Review", subtitle: "Final check", fields: [] }
  ];

  const handleNgoTypeToggle = (type) => {
    const types = ngoType.includes(type)
      ? ngoType.filter((t) => t !== type)
      : [...ngoType, type];
    setValue("ngoType", types, { shouldValidate: true });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp", "application/pdf"];
    if (!allowed.includes(file.type)) {
      setDocError("Invalid file format. Use JPG, PNG, or PDF.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setDocError("File too large. Maximum size is 5MB.");
      return;
    }
    setDocError("");
    setDocFile(file);
    if (file.type.startsWith("image/")) {
      setDocPreview(URL.createObjectURL(file));
    } else {
      setDocPreview("PDF_ICON");
    }
  };

  const handleNext = async () => {
    setGlobalError(null);
    let isValid;
    
    if (activeStep === 2) {
      isValid = await trigger(steps[activeStep].fields);
      if (!docFile) {
        setDocError("A registration certificate or ID is required to proceed.");
        isValid = false;
      }
    } else {
      isValid = await trigger(steps[activeStep].fields);
    }

    if (isValid) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrev = () => {
    setGlobalError(null);
    setActiveStep(activeStep - 1);
  };

  const onSubmit = async (data) => {
    if (!docFile) {
      setDocError("A registration certificate or ID is required to proceed.");
      return;
    }
    
    setLoading(true);
    setGlobalError(null);

    try {
      const documentUrl = await uploadToCloudinary(docFile);

      const payload = {
        ...data,
        documents: {
          registrationCertificate: { url: documentUrl, publicId: "" }
        }
      };

      const result = await registerNGO(payload);

      if (result.success) {
        setSuccess(true);
        // Force refresh to reload status
        setTimeout(() => {
          window.location.href = "/dashboard/ngo";
        }, 3000);
      } else {
        setGlobalError(result.message || "Failed to submit application.");
      }
    } catch {
      setGlobalError("An unexpected error occurred during submission.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{
        maxWidth: 600, margin: "0 auto", padding: "4rem 2rem", background: T.bgCard, 
        borderRadius: 24, border: `1px solid ${T.border}`, boxShadow: T.shadow, textAlign: "center"
      }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#D1FAE5", color: T.success, 
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", margin: "0 auto 1.5rem" }}>
          ✓
        </div>
        <h2 style={{ fontSize: "2rem", fontWeight: 800, color: T.text, marginBottom: "1rem", letterSpacing: "-0.02em" }}>
          Application Submitted!
        </h2>
        <p style={{ fontSize: "1.05rem", color: T.textSub, lineHeight: 1.6, marginBottom: "2rem" }}>
          Thank you for joining ResQNet. Your organization's details and documents have been sent to our admin team for verification. We'll notify you once approved.
        </p>
        <p style={{ fontSize: "0.85rem", color: T.textMuted }}>Redirecting to your dashboard...</p>
      </motion.div>
    );
  }

  return (
    <div style={{
      maxWidth: 800, margin: "0 auto", background: T.bgCard, 
      borderRadius: 20, border: `1px solid ${T.border}`, boxShadow: T.shadow, overflow: "hidden"
    }}>
      {/* Header Progress Tracker */}
      <div style={{ display: "flex", background: T.bgAlt, borderBottom: `1px solid ${T.border}` }}>
        {steps.map((step, idx) => {
          const isActive = idx === activeStep;
          const isPast = idx < activeStep;
          return (
            <div key={idx} style={{
              flex: 1, padding: "1.2rem 1rem", position: "relative",
              borderRight: idx < steps.length - 1 ? `1px solid ${T.border}` : "none",
              background: isActive ? T.bgCard : "transparent"
            }}>
              <div style={{
                fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em",
                color: isActive ? T.accent : isPast ? T.text : T.textMuted, marginBottom: "0.2rem"
              }}>
                Step {idx + 1}
              </div>
              <div style={{ fontSize: "0.9rem", fontWeight: 600, color: isActive ? T.text : T.textSub }}>
                {vp.mobile ? step.title : step.subtitle}
              </div>
              {isActive && (
                <motion.div layoutId="activeStepIndicator" style={{
                  position: "absolute", bottom: -1, left: 0, right: 0, height: 3, background: T.accent
                }} />
              )}
            </div>
          );
        })}
      </div>

      <div style={{ padding: "clamp(2rem, 5vw, 3rem)" }}>
        {globalError && (
          <div style={{ padding: "1rem", background: T.dangerPale, color: "#991B1B", borderRadius: 8, marginBottom: "2rem", border: "1px solid #FCA5A5", fontSize: "0.9rem", fontWeight: 600 }}>
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {/* STEP 1: IDENTITY */}
            {activeStep === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: T.text, marginBottom: "1.5rem" }}>Tell us about your organization</h3>
                <div style={{ display: "grid", gap: "1.5rem" }}>
                  <OnboardingInput 
                    label="Organization Name *" 
                    placeholder="e.g. Wildlife Trust of India" 
                    error={errors.organizationName?.message}
                    {...register("organizationName")} 
                  />
                  <OnboardingInput 
                    label="Website (Optional)" 
                    placeholder="https://yourwebsite.com" 
                    error={errors.website?.message}
                    {...register("website")}
                  />
                  
                  <div>
                    <label style={{ fontSize: "0.85rem", fontWeight: 700, color: T.text, marginBottom: "0.6rem", display: "block" }}>Organization Type *</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "0.6rem" }}>
                      {NGO_TYPES.map(type => (
                        <button key={type} type="button" onClick={() => handleNgoTypeToggle(type)} style={{
                          padding: "0.8rem", borderRadius: 10, border: `1.5px solid ${ngoType.includes(type) ? T.accent : T.border}`,
                          background: ngoType.includes(type) ? T.accentPale : T.bgAlt,
                          color: ngoType.includes(type) ? T.accent : T.textSub,
                          fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", transition: "all 0.2s"
                        }}>
                          {type}
                        </button>
                      ))}
                    </div>
                    {errors.ngoType && <div style={{ fontSize: "0.75rem", color: T.danger, marginTop: "0.4rem", fontWeight: 600 }}>{errors.ngoType.message}</div>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: CONTACT */}
            {activeStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: T.text, marginBottom: "1.5rem" }}>Contact & Location Details</h3>
                <div style={{ display: "grid", gap: "1.5rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: vp.mobile ? "1fr" : "1fr 1fr", gap: "1rem" }}>
                    <OnboardingInput 
                      label="Official Email *" 
                      type="email" 
                      readOnly={!!authEmail} 
                      error={errors.email?.message} 
                      {...register("email")}
                    />
                    <OnboardingInput 
                      label="Contact Phone *" 
                      type="tel" 
                      placeholder="+91 XXXXXXXXXX" 
                      error={errors.phone?.message} 
                      {...register("phone")}
                    />
                  </div>
                  <OnboardingInput 
                    label="Operational Address *" 
                    placeholder="Street, Area, Landmark" 
                    error={errors.address?.message} 
                    {...register("address")}
                  />
                  <div style={{ display: "grid", gridTemplateColumns: vp.mobile ? "1fr" : "1fr 1fr 1fr", gap: "1rem" }}>
                    <OnboardingInput label="City *" error={errors.city?.message} {...register("city")} />
                    <OnboardingInput label="State *" error={errors.state?.message} {...register("state")} />
                    <OnboardingInput label="Pincode" error={errors.pincode?.message} {...register("pincode")} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: VERIFICATION */}
            {activeStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: T.text, marginBottom: "0.5rem" }}>Legal Verification</h3>
                <p style={{ color: T.textSub, fontSize: "0.95rem", marginBottom: "2rem", lineHeight: 1.5 }}>
                  To ensure the safety and legitimacy of our network, we require a valid NGO registration number and a copy of your certificate.
                </p>
                
                <div style={{ display: "grid", gap: "2rem" }}>
                  <OnboardingInput 
                    label="NGO Registration / 12A Number *" 
                    placeholder="e.g. RJ/2021/0123456" 
                    error={errors.registrationNumber?.message} 
                    {...register("registrationNumber")}
                  />
                  
                  <div>
                    <label style={{ fontSize: "0.85rem", fontWeight: 700, color: T.text, marginBottom: "0.6rem", display: "block" }}>Registration Certificate Image/PDF *</label>
                    
                    <label style={{
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      padding: "3rem 2rem", border: `2px dashed ${docError ? "#EF4444" : T.border}`, borderRadius: 16,
                      background: docPreview ? T.bgAlt : T.bg, cursor: "pointer", transition: "all 0.2s",
                      textAlign: "center"
                    }}>
                      <input type="file" accept="image/png,image/jpeg,image/webp,application/pdf" onChange={handleFileChange} style={{ display: "none" }} />
                      
                      {docPreview ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          {docPreview === "PDF_ICON" ? (
                            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📄</div>
                          ) : (
                            <img src={docPreview} alt="Certificate preview" style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8, marginBottom: "1rem" }} />
                          )}
                          <span style={{ fontSize: "0.9rem", color: T.accent, fontWeight: 700 }}>{docFile.name}</span>
                          <span style={{ fontSize: "0.8rem", color: T.textMuted, marginTop: "0.5rem" }}>Click to change file</span>
                        </div>
                      ) : (
                        <>
                          <div style={{ width: 64, height: 64, borderRadius: "50%", background: T.accentPale, color: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: "1rem" }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                          </div>
                          <div style={{ fontSize: "1.05rem", fontWeight: 700, color: T.text, marginBottom: "0.4rem" }}>Click to upload document</div>
                          <div style={{ fontSize: "0.85rem", color: T.textSub }}>Supports JPG, PNG, WEBP, or PDF (Max 5MB)</div>
                        </>
                      )}
                    </label>
                    {docError && <div style={{ fontSize: "0.75rem", color: T.danger, marginTop: "0.5rem", fontWeight: 600 }}>{docError}</div>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: REVIEW */}
            {activeStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: T.text, marginBottom: "1.5rem" }}>Review your application</h3>
                
                <div style={{ display: "grid", gap: "1rem", background: T.bgAlt, padding: "1.5rem", borderRadius: 12, border: `1px solid ${T.border}` }}>
                  {[
                    ["Organization", organizationName],
                    ["Type", ngoType.join(", ")],
                    ["Email", email],
                    ["Phone", phone],
                    ["Location", `${city}, ${state}`],
                    ["Reg Number", registrationNumber],
                    ["Document", docFile ? docFile.name : "Uploaded"]
                  ].map(([label, val], i) => (
                    <div key={i} style={{ display: "flex", gap: "1rem" }}>
                      <span style={{ width: 120, fontSize: "0.85rem", color: T.textMuted, fontWeight: 600 }}>{label}</span>
                      <span style={{ flex: 1, fontSize: "0.95rem", color: T.text, fontWeight: 500 }}>{val}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "3rem", paddingTop: "2rem", borderTop: `1px solid ${T.border}` }}>
            <button
              type="button"
              onClick={handlePrev}
              disabled={activeStep === 0 || loading}
              style={{
                padding: "0.8rem 2rem", borderRadius: 10, border: `1px solid ${T.border}`, background: T.bgAlt,
                color: T.text, fontSize: "0.95rem", fontWeight: 700, cursor: activeStep === 0 ? "not-allowed" : "pointer",
                opacity: activeStep === 0 ? 0.5 : 1, fontFamily: "inherit"
              }}
            >
              Back
            </button>

            {activeStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                style={{
                  padding: "0.8rem 2.5rem", borderRadius: 10, border: "none", background: T.accent,
                  color: T.textOnAccent, fontSize: "0.95rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                  boxShadow: `0 4px 14px ${T.accent}40`
                }}
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "0.8rem 2.5rem", borderRadius: 10, border: "none", background: T.accent,
                  color: T.textOnAccent, fontSize: "0.95rem", fontWeight: 700, cursor: loading ? "wait" : "pointer", 
                  fontFamily: "inherit", boxShadow: `0 4px 14px ${T.accent}40`, display: "flex", gap: "0.5rem", alignItems: "center"
                }}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
