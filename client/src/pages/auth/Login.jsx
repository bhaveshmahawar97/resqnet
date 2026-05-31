import { useState, forwardRef, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { loginSchema } from "../../utils/validators";
import { useAuth, ROLES } from "../../context/AuthContext";
import { useT } from "../../context/ThemeContext";
import { API_URL } from "../../services/api";

const ROLE_REDIRECTS = {
  [ROLES.user]: "/dashboard/user",
  [ROLES.ngo]: "/dashboard/ngo",
  [ROLES.volunteer]: "/dashboard/volunteer",
  [ROLES.admin]: "/dashboard/admin",
};

const STATS = [
  { value: 2400, suffix: "+", label: "Animals Rescued" },
  { value: 340, suffix: "+", label: "NGOs" },
  { value: 18000, suffix: "+", label: "Volunteers" },
];

const FEED_ITEMS = [
  { icon: "🐕", text: "Golden Retriever rescued in Mumbai", time: "2m ago", color: "#7C3AED" },
  { icon: "🐈", text: "3 kittens found shelter in Delhi", time: "8m ago", color: "#3B82F6" },
  { icon: "🦜", text: "Injured parrot treated in Pune", time: "15m ago", color: "#06B6D4" },
  { icon: "🐕‍🦺", text: "Stray dog vaccinated in Bangalore", time: "22m ago", color: "#7C3AED" },
];

// ── Count-up component ──────────────────────────────────────────────────────
function CountUp({ to, suffix = "" }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.floor(v).toLocaleString() + suffix);
  const ref = useRef(null);

  useEffect(() => {
    const controls = animate(count, to, { duration: 2, ease: "easeOut" });
    return controls.stop;
  }, [count, to]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

// ── Orb component ────────────────────────────────────────────────────────────
function Orb({ style, delay = 0, duration = 6 }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        borderRadius: "50%",
        filter: "blur(60px)",
        opacity: 0.35,
        pointerEvents: "none",
        ...style,
      }}
      animate={{
        scale: [1, 1.15, 1],
        y: [0, -18, 0],
        opacity: [0.3, 0.45, 0.3],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// ── AuthInput ─────────────────────────────────────────────────────────────────
const AuthInput = forwardRef(({ label, type = "text", placeholder, autoComplete, T, error, ...rest }, ref) => {
  const [focused, setFocused] = useState(false);
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <span style={{ fontSize: "0.72rem", fontWeight: 600, color: T.textSub, letterSpacing: "0.02em", textTransform: "uppercase" }}>
        {label}
      </span>
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
        {...rest}
        style={{
          width: "100%",
          padding: "0.72rem 0.9rem",
          borderRadius: 9,
          boxSizing: "border-box",
          border: `1.5px solid ${error ? T.danger : focused ? T.borderInputFocus : T.borderInput}`,
          background: T.bgInput,
          color: T.text,
          fontSize: "0.88rem",
          fontFamily: "inherit",
          outline: "none",
          boxShadow: focused && !error
            ? `0 0 0 3px ${T.ring}`
            : error
            ? `0 0 0 3px ${T.dangerPale}`
            : "none",
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}
      />
      {error && (
        <span style={{ fontSize: "0.7rem", color: T.danger }}>{error}</span>
      )}
    </label>
  );
});
AuthInput.displayName = "AuthInput";

// ── Google SVG icon ───────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M47.532 24.552c0-1.636-.148-3.209-.424-4.727H24.48v8.944h12.99c-.56 3.02-2.264 5.576-4.824 7.296v6.064h7.808c4.565-4.203 7.078-10.4 7.078-17.577z" fill="#4285F4"/>
      <path d="M24.48 48c6.52 0 11.988-2.163 15.985-5.872l-7.809-6.063c-2.163 1.45-4.929 2.308-8.176 2.308-6.288 0-11.617-4.247-13.52-9.953H2.888v6.255C6.87 42.926 15.09 48 24.48 48z" fill="#34A853"/>
      <path d="M10.96 28.42A14.459 14.459 0 0 1 10.17 24c0-1.537.264-3.027.79-4.42V13.325H2.888A23.97 23.97 0 0 0 .48 24c0 3.866.927 7.524 2.408 10.675L10.96 28.42z" fill="#FBBC05"/>
      <path d="M24.48 9.627c3.543 0 6.724 1.217 9.228 3.609l6.92-6.92C36.466 2.392 30.997 0 24.48 0 15.09 0 6.87 5.074 2.888 13.325l8.072 6.255c1.903-5.706 7.232-9.953 13.52-9.953z" fill="#EA4335"/>
    </svg>
  );
}

// ── Main Login component ──────────────────────────────────────────────────────
export default function Login() {
  const { T } = useT();
  const { signIn, role: currentRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const from = location.state?.from?.pathname;

  const onSubmit = async (data) => {
    setLoading(true);
    setGlobalError("");
    const res = await signIn({ email: data.email, password: data.password });
    setLoading(false);
    if (!res.success) {
      setGlobalError(res.message || "Invalid credentials");
      return;
    }
    const role = res.user?.role || currentRole || "user";
    navigate(from || ROLE_REDIRECTS[role] || "/dashboard/user", { replace: true });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        overflow: "hidden",
      }}
    >
      {/* ── LEFT BRAND PANEL ─────────────────────────────────────────────────── */}
      <div
        className="rq-auth-left"
        style={{
          flex: "0 0 48%",
          position: "relative",
          background: "#0F172A",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "3rem 3.5rem",
          overflow: "hidden",
        }}
      >
        {/* Gradient orbs */}
        <Orb style={{ width: 360, height: 360, background: "#7C3AED", top: -80, left: -80 }} delay={0} duration={7} />
        <Orb style={{ width: 280, height: 280, background: "#3B82F6", bottom: 60, right: -60 }} delay={1.5} duration={8} />
        <Orb style={{ width: 220, height: 220, background: "#06B6D4", bottom: -40, left: "30%" }} delay={3} duration={6} />

        {/* Subtle grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }}
        />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "3rem" }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 20px rgba(124,58,237,0.5)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span
              style={{
                fontSize: "1.15rem",
                fontWeight: 800,
                color: "#F1F5F9",
                letterSpacing: "-0.02em",
              }}
            >
              ResQNet
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2
              style={{
                fontSize: "2.25rem",
                fontWeight: 900,
                color: "#F1F5F9",
                lineHeight: 1.15,
                margin: "0 0 0.75rem",
                letterSpacing: "-0.03em",
              }}
            >
              Every second
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #A78BFA 0%, #60A5FA 50%, #22D3EE 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                counts.
              </span>
            </h2>
            <p
              style={{
                fontSize: "0.88rem",
                color: "rgba(148,163,184,0.85)",
                margin: "0 0 2.5rem",
                letterSpacing: "0.12em",
                fontWeight: 500,
              }}
            >
              Rescue · Heal · Connect · Adopt
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{ display: "flex", gap: "1.75rem", marginBottom: "2.5rem", flexWrap: "wrap" }}
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    color: "#F1F5F9",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  <CountUp to={s.value} suffix={s.suffix} />
                </div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "rgba(148,163,184,0.7)",
                    fontWeight: 500,
                    marginTop: "0.2rem",
                    letterSpacing: "0.03em",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Live activity feed cards */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}
          >
            {FEED_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.5 + i * 0.08 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.65rem 0.9rem",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: `${item.color}22`,
                    border: `1px solid ${item.color}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.95rem",
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "#CBD5E1",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.text}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "0.68rem",
                    color: "rgba(148,163,184,0.6)",
                    flexShrink: 0,
                    fontWeight: 500,
                  }}
                >
                  {item.time}
                </div>
                {/* Live dot */}
                <motion.div
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.4 }}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: item.color,
                    flexShrink: 0,
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ─────────────────────────────────────────────────── */}
      <div
        className="rq-auth-right"
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: T.bg,
          overflowY: "auto",
          padding: "1.5rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: "100%",
            maxWidth: 400,
            margin: "auto",
          }}
        >
          {/* Mobile-only logo */}
          <div className="rq-mobile-logo" style={{ display: "none", marginBottom: "1.5rem" }}>
            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span
                style={{
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: T.text,
                  letterSpacing: "-0.02em",
                }}
              >
                ResQNet
              </span>
            </Link>
          </div>

          {/* Card */}
          <div
            style={{
              background: T.bgCard,
              border: `1px solid ${T.border}`,
              borderRadius: 16,
              padding: "2rem",
              boxShadow: T.shadowLg,
            }}
          >
            <h1
              style={{
                fontSize: "1.45rem",
                fontWeight: 800,
                color: T.textHeading,
                margin: "0 0 0.25rem",
                letterSpacing: "-0.025em",
              }}
            >
              Welcome back
            </h1>
            <p style={{ fontSize: "0.82rem", color: T.textSub, margin: "0 0 1.75rem" }}>
              Sign in to your ResQNet account.
            </p>

            {/* Google OAuth button */}
            <a
              href={`${API_URL}/auth/google`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.65rem",
                width: "100%",
                padding: "0.72rem 1rem",
                borderRadius: 9,
                border: `1.5px solid ${T.border}`,
                background: T.bgCard,
                color: T.text,
                fontWeight: 600,
                fontSize: "0.88rem",
                fontFamily: "inherit",
                textDecoration: "none",
                cursor: "pointer",
                transition: "background 0.15s, border-color 0.15s, box-shadow 0.15s",
                boxShadow: T.shadowSm,
                boxSizing: "border-box",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = T.bgCardHov;
                e.currentTarget.style.borderColor = T.borderHov;
                e.currentTarget.style.boxShadow = T.shadowMd;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = T.bgCard;
                e.currentTarget.style.borderColor = T.border;
                e.currentTarget.style.boxShadow = T.shadowSm;
              }}
            >
              <GoogleIcon />
              Continue with Google
            </a>

            {/* Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                margin: "1.25rem 0",
              }}
            >
              <div style={{ flex: 1, height: 1, background: T.divider }} />
              <span style={{ fontSize: "0.72rem", color: T.textMuted, fontWeight: 500, letterSpacing: "0.04em" }}>
                or continue with email
              </span>
              <div style={{ flex: 1, height: 1, background: T.divider }} />
            </div>

            {/* Email / Password form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <AuthInput
                label="Email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                T={T}
                error={errors.email?.message}
                {...register("email")}
              />
              <AuthInput
                label="Password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                T={T}
                error={errors.password?.message}
                {...register("password")}
              />

              {/* Forgot password */}
              <div style={{ textAlign: "right", marginTop: "-0.4rem" }}>
                <Link
                  to="/forgot-password"
                  style={{ fontSize: "0.75rem", color: T.accent, fontWeight: 500, textDecoration: "none" }}
                >
                  Forgot password?
                </Link>
              </div>

              {/* Global error */}
              {globalError && (
                <div
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
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                  <span style={{ fontSize: "0.78rem", color: T.danger }}>{globalError}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "0.78rem",
                  borderRadius: 9,
                  border: "none",
                  background: T.gradAccent,
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
                  marginTop: "0.25rem",
                  transition: "opacity 0.15s, transform 0.1s",
                }}
              >
                {loading ? (
                  <>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      style={{ animation: "rqSpin 0.8s linear infinite" }}
                    >
                      <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                      <path d="M8 2a6 6 0 0 1 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  "Sign in to ResQNet"
                )}
              </button>
            </form>

            {/* Register link */}
            <p
              style={{
                marginTop: "1.25rem",
                textAlign: "center",
                fontSize: "0.8rem",
                color: T.textSub,
              }}
            >
              New to ResQNet?{" "}
              <Link
                to="/register"
                style={{ color: T.accent, fontWeight: 600, textDecoration: "none" }}
              >
                Create an account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Global styles ─────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes rqSpin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .rq-auth-left { display: none !important; }
          .rq-auth-right { flex: 1 !important; }
          .rq-mobile-logo { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
