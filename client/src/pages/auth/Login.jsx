/**
 * ResQNet — Login Page (Premium Two-Column Auth)
 * Route: /login
 * Integrates with AuthContext (signIn, ROLES) + React Router (navigate by role).
 * Auth pages render inside MainLayout but override full-screen layout via CSS.
 */

import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth, ROLES } from "../../context/AuthContext";
import { useT } from "../../context/ThemeContext";
// ─── ROLE REDIRECT MAP ────────────────────────────────────────────────────────
const ROLE_REDIRECTS = {
  [ROLES.user]: "/dashboard/user",
  [ROLES.ngo]: "/dashboard/ngo",
  [ROLES.volunteer]: "/dashboard/volunteer",
  [ROLES.admin]: "/dashboard/admin",
};

/** Seeded Atlas test accounts (npm run seed:test) */
const DEMO_ACCOUNTS = [
  { email: "aarav.sharma@test.com", password: "Aarav@123", role: ROLES.user, label: "User" },
  { email: "contact@jeevraksha.org", password: "NGO@123", role: ROLES.ngo, label: "NGO" },
  { email: "priya.verma@test.com", password: "Volunteer@123", role: ROLES.volunteer, label: "Volunteer" },
  { email: "admin@resqnet.in", password: "Admin@123", role: ROLES.admin, label: "Admin" },
];

// ─── BRAND PANEL (LEFT) ───────────────────────────────────────────────────────
function BrandPanel({ mode }) {
  const isDark = mode === "dark";

  const stats = [
    { value: "12,400+", label: "Animals rescued" },
    { value: "380+", label: "NGO partners" },
    { value: "94%", label: "Response rate" },
  ];

  const nodes = [
    { x: "18%", y: "22%", r: 5, d: 0 },
    { x: "72%", y: "15%", r: 4, d: 0.4 },
    { x: "45%", y: "38%", r: 7, d: 0.8 },
    { x: "28%", y: "58%", r: 4, d: 0.2 },
    { x: "65%", y: "52%", r: 6, d: 1.0 },
    { x: "82%", y: "72%", r: 4, d: 0.6 },
    { x: "15%", y: "78%", r: 5, d: 1.2 },
    { x: "52%", y: "70%", r: 3, d: 0.3 },
  ];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: isDark
          ? "linear-gradient(145deg, #050D18 0%, #0A1828 50%, #071520 100%)"
          : "linear-gradient(145deg, #0A2218 0%, #0F3A26 50%, #082B1C 100%)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "clamp(2rem, 4vw, 3rem)",
      }}
    >
      {/* Grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(46,210,130,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(46,210,130,0.04) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          pointerEvents: "none",
        }}
      />

      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 480,
          height: 480,
          background: "radial-gradient(circle, rgba(22,160,86,0.16) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Network visualization */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <svg
          width="100%"
          height="100%"
          style={{ position: "absolute", inset: 0 }}
          preserveAspectRatio="none"
        >
          <line x1="18%" y1="22%" x2="45%" y2="38%" stroke="rgba(46,210,130,0.14)" strokeWidth="1" />
          <line x1="72%" y1="15%" x2="45%" y2="38%" stroke="rgba(46,210,130,0.10)" strokeWidth="1" />
          <line x1="45%" y1="38%" x2="28%" y2="58%" stroke="rgba(46,210,130,0.12)" strokeWidth="1" />
          <line x1="45%" y1="38%" x2="65%" y2="52%" stroke="rgba(46,210,130,0.10)" strokeWidth="1" />
          <line x1="28%" y1="58%" x2="15%" y2="78%" stroke="rgba(46,210,130,0.08)" strokeWidth="1" />
          <line x1="65%" y1="52%" x2="82%" y2="72%" stroke="rgba(46,210,130,0.08)" strokeWidth="1" />
          <line x1="28%" y1="58%" x2="52%" y2="70%" stroke="rgba(46,210,130,0.10)" strokeWidth="1" />
          <line x1="65%" y1="52%" x2="52%" y2="70%" stroke="rgba(46,210,130,0.08)" strokeWidth="1" />
        </svg>
        {nodes.map((n, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: n.x,
              top: n.y,
              width: n.r * 2,
              height: n.r * 2,
              borderRadius: "50%",
              background: "rgba(46,210,130,0.6)",
              boxShadow: "0 0 10px rgba(46,210,130,0.35)",
              transform: "translate(-50%, -50%)",
              animation: `rqNodePulse 3s ease-in-out ${n.d}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.35rem" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #16A056 0%, #0F7A40 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 18px rgba(22,160,86,0.45)",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="3" fill="rgba(255,255,255,0.92)" />
            </svg>
          </div>
          <span style={{ fontSize: "1.15rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.015em" }}>
            ResQNet
          </span>
        </div>
        <span
          style={{
            fontSize: "0.66rem",
            fontWeight: 600,
            color: "rgba(46,210,130,0.65)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Animal Rescue Intelligence
        </span>
      </div>

      {/* Mission copy */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "2.5rem 0",
        }}
      >
        <p
          style={{
            fontSize: "clamp(1.55rem, 2.6vw, 2.15rem)",
            fontWeight: 800,
            lineHeight: 1.22,
            color: "#fff",
            marginBottom: "1rem",
            letterSpacing: "-0.025em",
          }}
        >
          Every second counts
          <br />
          <span style={{ color: "rgba(46,210,130,0.82)" }}>in a rescue.</span>
        </p>
        <p
          style={{
            fontSize: "0.87rem",
            color: "rgba(255,255,255,0.44)",
            lineHeight: 1.72,
            maxWidth: 310,
          }}
        >
          Coordinating NGOs, volunteers, and AI-powered triage — built for the teams on the ground.
        </p>

        {/* Feature pills */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "2rem" }}>
          {[
            { icon: "◈", text: "AI health scan & triage" },
            { icon: "◎", text: "Real-time rescue coordination" },
            { icon: "◉", text: "NGO & volunteer network" },
          ].map((f) => (
            <div
              key={f.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
              }}
            >
              <span style={{ fontSize: "0.75rem", color: "rgba(46,210,130,0.7)" }}>{f.icon}</span>
              <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "0.5rem",
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: "rgba(255,255,255,0.055)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 10,
              padding: "0.7rem 0.8rem",
            }}
          >
            <div
              style={{
                fontSize: "1.05rem",
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.02em",
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: "0.67rem", color: "rgba(255,255,255,0.38)", marginTop: 2 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes rqNodePulse {
          0%, 100% { opacity: 0.45; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.95; transform: translate(-50%, -50%) scale(1.6); }
        }
      `}</style>
    </div>
  );
}

// ─── AUTH INPUT ───────────────────────────────────────────────────────────────
function AuthInput({ label, type = "text", value, onChange, placeholder, autoComplete, T }) {
  const [focused, setFocused] = useState(false);
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <span style={{ fontSize: "0.75rem", fontWeight: 600, color: T.textSub, letterSpacing: "0.02em" }}>
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "0.75rem 1rem",
          borderRadius: 10,
          border: `1.5px solid ${focused ? T.accent : T.border}`,
          background: T.bgCard,
          color: T.text,
          fontSize: "0.9rem",
          fontFamily: "inherit",
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.18s, box-shadow 0.18s",
          boxShadow: focused ? `0 0 0 3px ${T.accentPale}` : "none",
        }}
      />
    </label>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
export default function Login() {
  const { T, mode } = useT();
  const { signIn, email: currentEmail, role: currentRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = mode === "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname;

  useEffect(() => {
    if (currentEmail) {
      navigate(ROLE_REDIRECTS[currentRole] || "/dashboard/user", { replace: true });
    }
  }, [currentEmail, currentRole, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!normalized) { setError("Please enter your email address."); return; }
    if (!password) { setError("Please enter your password."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    setError("");

    const res = await signIn({ email: normalized, password });
    setLoading(false);

    if (!res.success) {
      setError(res.message || "Invalid credentials");
      return;
    }

    const role = res.user?.role || currentRole || "user";
    navigate(from || ROLE_REDIRECTS[role] || "/dashboard/user", { replace: true });
  }

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
        <BrandPanel mode={mode} />
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
            gap: "0.5rem",
            marginBottom: "2.5rem",
            alignSelf: "flex-start",
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "linear-gradient(135deg, #16A056 0%, #0F7A40 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="3" fill="rgba(255,255,255,0.92)" />
            </svg>
          </div>
          <span style={{ fontSize: "1rem", fontWeight: 700, color: T.text }}>ResQNet</span>
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
                fontSize: "clamp(1.65rem, 3vw, 2.05rem)",
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
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <AuthInput
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="you@example.com"
              autoComplete="email"
              T={T}
            />
            <AuthInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="Enter your password"
              autoComplete="current-password"
              T={T}
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
            {error && (
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
                <span style={{ fontSize: "0.78rem", color: "#DC2626" }}>{error}</span>
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
                color: "#fff",
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
                boxShadow: `0 4px 16px ${T.accentGlow}`,
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

          {/* Demo accounts */}
          <div
            style={{
              marginTop: "1.75rem",
              padding: "0.9rem 1rem",
              borderRadius: 10,
              background: isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.025)",
              border: `1px solid ${T.border}`,
            }}
          >
            <div
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                color: T.textMuted,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "0.65rem",
              }}
            >
              Demo access
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              {DEMO_ACCOUNTS.map((d) => (
                <button
                  key={d.email}
                  type="button"
                  onClick={() => { setEmail(d.email); setPassword(d.password); setError(""); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    padding: "0.15rem 0",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: "0.78rem", color: T.textSub }}>{d.label} — {d.email}</span>
                  <span
                    style={{
                      fontSize: "0.63rem",
                      fontWeight: 600,
                      color: T.accent,
                      background: T.accentPale,
                      borderRadius: 4,
                      padding: "1px 6px",
                      textTransform: "capitalize",
                    }}
                  >
                    {d.role}
                  </span>
                </button>
              ))}
            </div>
          </div>
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
