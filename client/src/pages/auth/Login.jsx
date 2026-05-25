import { useState, forwardRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../utils/validators";
import { useAuth, ROLES } from "../../context/AuthContext";
import { useT } from "../../context/ThemeContext";
// ─── ROLE REDIRECT MAP ────────────────────────────────────────────────────────
const ROLE_REDIRECTS = {
  [ROLES.user]: "/dashboard/user",
  [ROLES.ngo]: "/dashboard/ngo",
  [ROLES.volunteer]: "/dashboard/volunteer",
  [ROLES.admin]: "/dashboard/admin",
};

// ─── BRAND PANEL (LEFT) ───────────────────────────────────────────────────────
function BrandPanel() {
  const features = [
    { text: "AI-powered health scan & triage" },
    { text: "Real-time rescue coordination" },
    { text: "NGO & volunteer network" },
  ];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "linear-gradient(155deg, #0B1524 0%, #101D30 55%, #0C1D3A 100%)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "clamp(2rem, 4vw, 3rem)",
      }}
    >
      {/* Grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          pointerEvents: "none",
        }}
      />

      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 500,
          background: "radial-gradient(circle, rgba(29,111,164,0.12) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Logo */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.4rem" }}>
          <div
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #1D6FA4 0%, #38BDF8 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 16px rgba(56,189,248,0.3)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontSize: "1.15rem", fontWeight: 800, color: T.textOnAccent, letterSpacing: "-0.03em" }}>
            ResQ<span style={{ color: T.accent }}>Net</span>
          </span>
        </div>
        <span style={{ fontSize: "0.66rem", fontWeight: 600, color: "rgba(56,189,248,0.55)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
          Animal Rescue Intelligence
        </span>
      </div>

      {/* Mission copy */}
      <div
        style={{
          position: "relative", zIndex: 2, flex: 1,
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "2.5rem 0",
        }}
      >
        <p
          style={{
            fontSize: "clamp(1.4rem, 2.2vw, 1.85rem)",
            fontWeight: 800, lineHeight: 1.25,
            color: T.textOnAccent, marginBottom: "0.75rem", letterSpacing: "-0.025em",
          }}
        >
          Every second counts<br />
          <span style={{ color: T.accent }}>in a rescue.</span>
        </p>
        <p
          style={{
            fontSize: "0.85rem", color: "rgba(255,255,255,0.42)",
            lineHeight: 1.75, maxWidth: 310,
          }}
        >
          Coordinating NGOs, volunteers, and AI-powered triage — built for teams on the ground.
        </p>

        {/* Feature list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", marginTop: "1.75rem" }}>
          {features.map((f) => (
            <div key={f.text} style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
              <div style={{
                width: 20, height: 20, borderRadius: 6,
                background: "rgba(56,189,248,0.12)",
                border: "1px solid rgba(56,189,248,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 5L4 7.5 8.5 2.5" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── AUTH INPUT ───────────────────────────────────────────────────────────────
const AuthInput = forwardRef(({ label, type = "text", placeholder, autoComplete, T, error, ...rest }, ref) => {
  const [focused, setFocused] = useState(false);
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <span style={{ fontSize: "0.75rem", fontWeight: 600, color: T.textSub, letterSpacing: "0.02em" }}>
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
          rest.onBlur && rest.onBlur(e);
        }}
        {...rest}
        style={{
          width: "100%",
          padding: "0.75rem 1rem",
          borderRadius: 10,
          border: `1.5px solid ${error ? "rgba(220,38,38,0.5)" : focused ? T.accent : T.border}`,
          background: T.bgCard,
          color: T.text,
          fontSize: "0.9rem",
          fontFamily: "inherit",
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.18s, box-shadow 0.18s",
          boxShadow: error
            ? "0 0 0 3px rgba(220,38,38,0.08)"
            : focused
            ? `0 0 0 2px ${T.accentPale}`
            : "none",
        }}
      />
      {error && (
        <span style={{ fontSize: "0.72rem", color: T.danger, marginTop: "0.1rem" }}>{error}</span>
      )}
    </label>
  );
});

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
export default function Login() {
  const { T, mode } = useT();
  const { signIn, role: currentRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
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
        background: T.bg,
        overflow: "hidden",
      }}
    >
      {/* ── LEFT: Brand ── */}
      <div
        className="rq-auth-left"
        style={{
          width: "44%",
          minWidth: 360,
          flexShrink: 0,
          display: "none",
          height: "100%",
        }}
      >
        <BrandPanel />
      </div>

      {/* ── RIGHT: Form ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflowY: "auto",
          padding: "clamp(2rem, 6vw, 4rem) clamp(1.5rem, 5vw, 3.5rem)",
        }}
      >
        {/* Mobile logo */}
        <div
          className="rq-mobile-logo"
          style={{
            display: "none",
            alignItems: "center",
            gap: "0.65rem",
            marginBottom: "2.5rem",
            alignSelf: "flex-start",
          }}
        >
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}>
            <span style={{ fontSize: "1.05rem", fontWeight: 700, color: T.text }}>ResQNet</span>
          </Link>
        </div>

        <div style={{ width: "100%", maxWidth: 400 }}>
          {/* Header */}
          <div style={{ marginBottom: "2rem" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                background: T.accentPale,
                border: `1px solid ${T.accentGlow}`,
                borderRadius: 20,
                padding: "0.22rem 0.7rem",
                marginBottom: "1rem",
              }}
            >
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.accent }} />
              <span
                style={{
                  fontSize: "0.67rem",
                  fontWeight: 700,
                  color: T.accent,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Secure Sign-In
              </span>
            </div>
            <h1
              style={{
                fontSize: "clamp(1.5rem, 2.5vw, 1.85rem)",
                fontWeight: 800,
                color: T.text,
                letterSpacing: "-0.028em",
                lineHeight: 1.15,
                marginBottom: "0.5rem",
              }}
            >
              Welcome back
            </h1>
            <p style={{ fontSize: "0.875rem", color: T.textSub, lineHeight: 1.65 }}>
              Sign in to access your ResQNet dashboard and operations.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <AuthInput
              label="Email address"
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
              placeholder="Enter your password"
              autoComplete="current-password"
              T={T}
              error={errors.password?.message}
              {...register("password")}
            />

            {/* Remember + Forgot */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}
                onClick={() => setRemember((r) => !r)}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    border: `1.5px solid ${remember ? T.accent : T.border}`,
                    background: remember ? T.accent : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s",
                    flexShrink: 0,
                  }}
                >
                  {remember && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6 8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: "0.8rem", color: T.textSub, userSelect: "none" }}>Remember me</span>
              </div>
              <button
                type="button"
                style={{
                  fontSize: "0.8rem",
                  color: T.accent,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  padding: 0,
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* Error */}
            {globalError && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.65rem 0.9rem",
                  borderRadius: 8,
                  background: "rgba(220,38,38,0.07)",
                  border: "1px solid rgba(220,38,38,0.16)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="#DC2626" strokeWidth="1.5" />
                  <path d="M8 5v3.5M8 11v.5" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />
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
                padding: "0.85rem",
                borderRadius: 10,
                border: "none",
                background: `linear-gradient(135deg, ${T.accent} 0%, ${T.accentDim} 100%)`,
                color: T.textOnAccent,
                fontSize: "0.92rem",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                letterSpacing: "-0.01em",
                opacity: loading ? 0.8 : 1,
                transition: "opacity 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                boxShadow: `0 2px 10px ${T.accentGlow}`,
              }}
            >
              {loading ? (
                <>
                  <svg
                    width="15"
                    height="15"
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
          <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.83rem", color: T.textSub }}>
            New to ResQNet?{" "}
            <Link to="/register" style={{ color: T.accent, fontWeight: 600, textDecoration: "none" }}>
              Create an account
            </Link>
          </p>


        </div>
      </div>

      <style>{`
        @keyframes rqSpin { to { transform: rotate(360deg); } }
        @media (min-width: 768px) { .rq-auth-left { display: block !important; } }
        @media (max-width: 767px) { .rq-mobile-logo { display: flex !important; } }
      `}</style>
    </div>
  );
}
