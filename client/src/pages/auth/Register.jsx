import { useState, forwardRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { registerSchema } from "../../utils/validators";
import { useAuth, ROLES } from "../../context/AuthContext";
import { useT } from "../../context/ThemeContext";
import { API_URL } from "../../services/api";

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLE_REDIRECTS = {
  [ROLES.user]: "/dashboard/user",
  [ROLES.ngo]: "/dashboard/ngo",
  [ROLES.volunteer]: "/dashboard/volunteer",
  [ROLES.admin]: "/dashboard/admin",
};

const PUBLIC_ROLES = [
  {
    id: ROLES.user,
    label: "User",
    hint: "Report & track rescues",
    color: "#3B82F6",
    paleBg: "rgba(59,130,246,0.10)",
    borderActive: "#3B82F6",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" stroke="currentColor"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor"/>
      </svg>
    ),
  },
  {
    id: ROLES.ngo,
    label: "NGO",
    hint: "Manage operations",
    color: "#10B981",
    paleBg: "rgba(16,185,129,0.10)",
    borderActive: "#10B981",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M3 7l9-4 9 4M4 7v14M20 7v14M9 21V12h6v9" stroke="currentColor"/>
      </svg>
    ),
  },
  {
    id: ROLES.volunteer,
    label: "Volunteer",
    hint: "Join field missions",
    color: "#F59E0B",
    paleBg: "rgba(245,158,11,0.10)",
    borderActive: "#F59E0B",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor"/>
      </svg>
    ),
  },
];

const LEFT_FEATURES = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor"/>
        <path d="M8 21h8M12 17v4" stroke="currentColor"/>
        <path d="M9 8l2 2 4-4" stroke="currentColor"/>
      </svg>
    ),
    title: "AI Animal Detection",
    desc: "Instant species & condition scan",
    accent: "#6366F1",
    paleBg: "rgba(99,102,241,0.12)",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.1 12a19.79 19.79 0 0 1-3-8.57 2 2 0 0 1 1.97-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.14 6.14l1.25-1.31a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor"/>
      </svg>
    ),
    title: "Emergency Dispatch",
    desc: "Route rescuers in real-time",
    accent: "#EF4444",
    paleBg: "rgba(239,68,68,0.12)",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" stroke="currentColor"/>
        <path d="M8 12h8M12 8v8" stroke="currentColor"/>
      </svg>
    ),
    title: "NGO Network",
    desc: "Connect 500+ rescue orgs",
    accent: "#10B981",
    paleBg: "rgba(16,185,129,0.12)",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor"/>
      </svg>
    ),
    title: "Adoption Portal",
    desc: "Find forever homes fast",
    accent: "#F59E0B",
    paleBg: "rgba(245,158,11,0.12)",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const AuthInput = forwardRef(({ label, type = "text", placeholder, autoComplete, T, error, ...rest }, ref) => {
  const [focused, setFocused] = useState(false);
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <span style={{ fontSize: "0.72rem", fontWeight: 600, color: T.textSub, letterSpacing: "0.02em" }}>{label}</span>
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onFocus={() => setFocused(true)}
        onBlur={(e) => { setFocused(false); rest.onBlur?.(e); }}
        {...rest}
        style={{
          width: "100%", padding: "0.72rem 0.9rem", borderRadius: 9, boxSizing: "border-box",
          border: `1.5px solid ${error ? T.danger : focused ? T.borderInputFocus : T.borderInput}`,
          background: T.bgInput, color: T.text, fontSize: "0.88rem", fontFamily: "inherit", outline: "none",
          boxShadow: focused && !error ? `0 0 0 3px ${T.ring}` : error ? `0 0 0 3px ${T.dangerPale}` : "none",
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}
      />
      {error && <span style={{ fontSize: "0.7rem", color: T.danger }}>{error}</span>}
    </label>
  );
});
AuthInput.displayName = "AuthInput";

function PasswordStrength({ password, T }) {
  const score = [
    password.length >= 6,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;
  const colors = [T.danger, T.warning || "#F59E0B", T.success, T.success];
  const labels = ["Weak", "Fair", "Good", "Strong"];
  const color = score > 0 ? colors[score - 1] : T.border;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <div style={{ display: "flex", gap: "0.2rem", flex: 1 }}>
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            style={{ flex: 1, height: 3, borderRadius: 2, background: i < score ? color : T.border }}
            animate={{ background: i < score ? color : T.border }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </div>
      <AnimatePresence mode="wait">
        {score > 0 && (
          <motion.span
            key={labels[score - 1]}
            initial={{ opacity: 0, x: 4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            style={{ fontSize: "0.66rem", color, fontWeight: 600, minWidth: 36, textAlign: "right" }}
          >
            {labels[score - 1]}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Left Panel ───────────────────────────────────────────────────────────────

function LeftPanel() {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 280, damping: 22 } },
  };
  const titleVariants = {
    hidden: { opacity: 0, y: -16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div
      style={{
        flex: "0 0 420px",
        background: "#0F172A",
        borderRadius: "14px 0 0 14px",
        padding: "2.5rem 2rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        minHeight: 580,
      }}
    >
      {/* Gradient orbs */}
      <div style={{ position: "absolute", top: -80, left: -80, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -60, right: -60, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "40%", right: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ display: "flex", alignItems: "center", gap: "0.55rem", marginBottom: "2.25rem" }}
      >
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #6366F1, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.025em" }}>ResQNet</span>
      </motion.div>

      {/* Headline */}
      <motion.div variants={titleVariants} initial="hidden" animate="visible" style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#F8FAFC", margin: "0 0 0.5rem", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
          Every second<br />counts for animals
        </h2>
        <p style={{ fontSize: "0.82rem", color: "#94A3B8", margin: 0, lineHeight: 1.55 }}>
          Join a network built to save lives through technology, community, and speed.
        </p>
      </motion.div>

      {/* Feature cards */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
        {LEFT_FEATURES.map((feat) => (
          <motion.div
            key={feat.title}
            variants={cardVariants}
            whileHover={{ scale: 1.015, transition: { duration: 0.15 } }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.9rem",
              padding: "0.75rem 1rem",
              borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div style={{ width: 34, height: 34, borderRadius: 8, background: feat.paleBg, display: "flex", alignItems: "center", justifyContent: "center", color: feat.accent, flexShrink: 0 }}>
              {feat.icon}
            </div>
            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#F1F5F9" }}>{feat.title}</div>
              <div style={{ fontSize: "0.72rem", color: "#64748B", marginTop: "0.1rem" }}>{feat.desc}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        style={{ marginTop: "2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
      >
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
        <span style={{ fontSize: "0.7rem", color: "#475569" }}>Trusted by 500+ rescue organizations</span>
      </motion.div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Register() {
  const { T } = useT();
  const { register: registerFn } = useAuth();
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: ROLES.user },
  });

  const selectedRole = watch("role");
  const currentPassword = watch("password") || "";

  const onSubmit = async (data) => {
    setGlobalError("");
    setLoading(true);
    const res = await registerFn({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      role: data.role,
    });
    setLoading(false);
    if (!res.success) { setGlobalError(res.message || "Registration failed"); return; }
    navigate(ROLE_REDIRECTS[res.user?.role || data.role] || "/dashboard/user", { replace: true });
  };

  const formVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
  };
  const fieldVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  const activeRole = PUBLIC_ROLES.find((r) => r.id === selectedRole);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: T.bg,
        padding: "1.5rem",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          display: "flex",
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: T.shadowLg || "0 20px 60px rgba(0,0,0,0.3)",
          margin: "auto",
        }}
        className="rq-register-shell"
      >
        {/* Left panel — hidden on mobile via CSS class */}
        <div className="rq-register-left">
          <LeftPanel />
        </div>

        {/* Right panel */}
        <div
          style={{
            flex: 1,
            background: T.bgCard,
            padding: "2rem 2.25rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            overflowY: "auto",
            maxHeight: "90vh",
          }}
          className="rq-register-right"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ marginBottom: "1.5rem" }}
          >
            {/* Mobile-only logo */}
            <Link
              to="/"
              className="rq-mobile-logo"
              style={{ display: "none", alignItems: "center", gap: "0.5rem", textDecoration: "none", marginBottom: "1.25rem" }}
            >
              <div style={{ width: 28, height: 28, borderRadius: 7, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontSize: "0.95rem", fontWeight: 800, color: T.text, letterSpacing: "-0.02em" }}>ResQNet</span>
            </Link>

            <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: T.text, margin: "0 0 0.2rem", letterSpacing: "-0.025em" }}>
              Create account
            </h1>
            <p style={{ fontSize: "0.8rem", color: T.textSub, margin: 0 }}>
              Join the ResQNet rescue network.
            </p>
          </motion.div>

          {/* Google OAuth */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.35 }}
            style={{ marginBottom: "1.25rem" }}
          >
            <a
              href={`${API_URL}/auth/google?role=${selectedRole || "user"}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.6rem",
                width: "100%",
                padding: "0.72rem",
                borderRadius: 9,
                border: `1.5px solid ${T.border}`,
                background: T.bgCard,
                color: T.text,
                fontWeight: 600,
                fontSize: "0.86rem",
                fontFamily: "inherit",
                textDecoration: "none",
                cursor: "pointer",
                transition: "border-color 0.15s, background 0.15s",
                boxSizing: "border-box",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.borderInputFocus; e.currentTarget.style.background = T.bgInput; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.bgCard; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </a>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18 }}
            style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}
          >
            <div style={{ flex: 1, height: 1, background: T.border }} />
            <span style={{ fontSize: "0.7rem", color: T.textSub, whiteSpace: "nowrap" }}>or register with email</span>
            <div style={{ flex: 1, height: 1, background: T.border }} />
          </motion.div>

          {/* Role selector */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.22, type: "spring", stiffness: 280, damping: 22 }}
            style={{ marginBottom: "1.25rem" }}
          >
            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: T.textSub, letterSpacing: "0.02em", display: "block", marginBottom: "0.5rem" }}>
              I am a
            </span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {PUBLIC_ROLES.map((role) => {
                const isActive = selectedRole === role.id;
                return (
                  <motion.button
                    key={role.id}
                    type="button"
                    onClick={() => setValue("role", role.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      flex: 1,
                      padding: "0.6rem 0.5rem",
                      borderRadius: 9,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      textAlign: "left",
                      border: `1.5px solid ${isActive ? role.borderActive : T.border}`,
                      background: isActive ? role.paleBg : T.bgCard,
                      transition: "border-color 0.15s, background 0.15s",
                      outline: "none",
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 7,
                        background: isActive ? role.paleBg : T.bgInput,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: isActive ? role.color : T.textSub,
                        marginBottom: "0.4rem",
                        transition: "color 0.15s, background 0.15s",
                      }}
                    >
                      {role.icon}
                    </div>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: isActive ? role.color : T.text }}>{role.label}</div>
                    <div style={{ fontSize: "0.64rem", color: T.textMuted || T.textSub, marginTop: "0.12rem", lineHeight: 1.3 }}>{role.hint}</div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
          >
            <input type="hidden" {...register("role")} />

            <motion.div variants={fieldVariants}>
              <AuthInput
                label="Full Name"
                placeholder="Your full name"
                autoComplete="name"
                T={T}
                error={errors.fullName?.message}
                {...register("fullName")}
              />
            </motion.div>

            <motion.div variants={fieldVariants}>
              <AuthInput
                label="Email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                T={T}
                error={errors.email?.message}
                {...register("email")}
              />
            </motion.div>

            <motion.div variants={fieldVariants} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }} className="rq-pw-grid">
              <AuthInput
                label="Password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                T={T}
                error={errors.password?.message}
                {...register("password")}
              />
              <AuthInput
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                T={T}
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />
            </motion.div>

            <AnimatePresence>
              {currentPassword && (
                <motion.div
                  key="pw-strength"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: "hidden" }}
                >
                  <PasswordStrength password={currentPassword} T={T} />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {globalError && (
                <motion.div
                  key="global-error"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.65rem 0.85rem",
                    borderRadius: 8,
                    background: T.dangerPale,
                    border: `1px solid ${T.dangerBorder}`,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.danger} strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v4M12 16h.01"/>
                  </svg>
                  <span style={{ fontSize: "0.78rem", color: T.danger }}>{globalError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={fieldVariants}>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.01 } : {}}
                whileTap={!loading ? { scale: 0.99 } : {}}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: 9,
                  border: "none",
                  background: activeRole ? activeRole.color : T.accent,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  opacity: loading ? 0.75 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  transition: "background 0.2s",
                }}
              >
                {loading ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ animation: "rqSpin 0.8s linear infinite" }}>
                      <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                      <path d="M8 2a6 6 0 0 1 6 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Creating account…
                  </>
                ) : (
                  `Join as ${PUBLIC_ROLES.find((r) => r.id === selectedRole)?.label || "User"}`
                )}
              </motion.button>
            </motion.div>
          </motion.form>

          {/* Footer links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p style={{ marginTop: "1.25rem", textAlign: "center", fontSize: "0.8rem", color: T.textSub }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: T.accent, fontWeight: 600, textDecoration: "none" }}>
                Sign in
              </Link>
            </p>
            <p style={{ marginTop: "0.6rem", textAlign: "center", fontSize: "0.68rem", color: T.textMuted || T.textSub, lineHeight: 1.5 }}>
              By creating an account you agree to our{" "}
              <span style={{ color: T.accent, cursor: "pointer" }}>Terms</span>{" "}
              and{" "}
              <span style={{ color: T.accent, cursor: "pointer" }}>Privacy Policy</span>.
            </p>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes rqSpin { to { transform: rotate(360deg); } }

        .rq-register-left { display: flex; }

        @media (max-width: 720px) {
          .rq-register-shell {
            flex-direction: column !important;
            max-width: 460px !important;
          }
          .rq-register-left { display: none !important; }
          .rq-register-right {
            border-radius: 14px !important;
            max-height: none !important;
          }
          .rq-mobile-logo { display: inline-flex !important; }
          .rq-pw-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
