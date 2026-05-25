/**
 * ResQNet — Register Page (Premium Two-Column Auth)
 * Route: /register
 * Integrates with AuthContext (signIn, ROLES) + React Router (navigate by role).
 * Auth pages render inside MainLayout but override full-screen layout via CSS.
 */

import { useState, forwardRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../utils/validators";
import { useAuth, ROLES } from "../../context/AuthContext";
import { useT } from "../../context/ThemeContext";
import logoMain from "../../assets/logos/logo-main.png";

// ─── ROLE REDIRECT MAP ────────────────────────────────────────────────────────
const ROLE_REDIRECTS = {
  [ROLES.user]: "/dashboard/user",
  [ROLES.ngo]: "/dashboard/ngo",
  [ROLES.volunteer]: "/dashboard/volunteer",
  [ROLES.admin]: "/dashboard/admin",
};

// ─── ROLE DEFINITIONS (public-facing only — no admin) ─────────────────────────
const PUBLIC_ROLES = [
  {
    id: ROLES.user,
    label: "User",
    description: "Report incidents, track rescues, and stay informed.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path
          d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: ROLES.ngo,
    label: "NGO",
    description: "Manage your organization, coordinate teams, and oversee rescues.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 9.5L12 4l9 5.5V20H3V9.5z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="9" y="14" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: ROLES.volunteer,
    label: "Volunteer",
    description: "Accept rescue missions, log field activity, and earn trust points.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 21C12 21 4 14.5 4 9a8 8 0 0 1 16 0c0 5.5-8 12-8 12z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

// ─── BRAND PANEL (LEFT) ───────────────────────────────────────────────────────
function BrandPanel({ mode, T }) {
  const nodes = [
    { x: "22%", y: "18%", r: 5, d: 0 },
    { x: "68%", y: "12%", r: 4, d: 0.5 },
    { x: "48%", y: "34%", r: 7, d: 0.9 },
    { x: "30%", y: "55%", r: 4, d: 0.2 },
    { x: "70%", y: "50%", r: 6, d: 1.1 },
    { x: "85%", y: "70%", r: 4, d: 0.7 },
    { x: "14%", y: "75%", r: 5, d: 1.3 },
    { x: "55%", y: "68%", r: 3, d: 0.4 },
  ];

  const testimonials = [
    { quote: "ResQNet cut our response time in half.", name: "Priya S.", org: "Paws Rescue, Mumbai" },
    { quote: "Finally, a platform built for field teams.", name: "Arjun M.", org: "NGO Coordinator, Delhi" },
  ];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: T.gradHero,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "clamp(2rem, 4vw, 3rem)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            `linear-gradient(${T.grid} 1px, transparent 1px), linear-gradient(90deg, ${T.grid} 1px, transparent 1px)`,
          backgroundSize: "44px 44px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "38%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 500,
          background: `radial-gradient(circle, ${T.accentPale} 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <svg
          width="100%"
          height="100%"
          style={{ position: "absolute", inset: 0 }}
          preserveAspectRatio="none"
        >
          <line x1="22%" y1="18%" x2="48%" y2="34%" stroke={T.accentGlow} strokeWidth="1" />
          <line x1="68%" y1="12%" x2="48%" y2="34%" stroke={T.accentGlow} strokeWidth="1" />
          <line x1="48%" y1="34%" x2="30%" y2="55%" stroke={T.accentGlow} strokeWidth="1" />
          <line x1="48%" y1="34%" x2="70%" y2="50%" stroke={T.accentGlow} strokeWidth="1" />
          <line x1="30%" y1="55%" x2="14%" y2="75%" stroke={T.accentGlow} strokeWidth="1" />
          <line x1="70%" y1="50%" x2="85%" y2="70%" stroke={T.accentGlow} strokeWidth="1" />
          <line x1="30%" y1="55%" x2="55%" y2="68%" stroke={T.accentGlow} strokeWidth="1" />
          <line x1="70%" y1="50%" x2="55%" y2="68%" stroke={T.accentGlow} strokeWidth="1" />
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
              background: T.accent,
              boxShadow: `0 0 10px ${T.accentGlow}`,
              transform: "translate(-50%, -50%)",
              animation: `rqNodePulse 3s ease-in-out ${n.d}s infinite`,
            }}
          />
        ))}
      </div>
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.35rem" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: T.gradAccent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: T.shadowMd,
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="3" fill="rgba(255,255,255,0.92)" />
            </svg>
          </div>
          <span style={{ fontSize: "1.15rem", fontWeight: 700, color: T.text, letterSpacing: "-0.015em" }}>
            ResQNet
          </span>
        </div>
        <span
          style={{
            fontSize: "0.66rem",
            fontWeight: 600,
            color: T.accent,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Animal Rescue Intelligence
        </span>
      </div>
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
            fontSize: "clamp(1.4rem, 2.2vw, 1.85rem)",
            fontWeight: 800,
            lineHeight: 1.22,
            color: T.text,
            marginBottom: "1rem",
            letterSpacing: "-0.025em",
          }}
        >
          Join the network
          <br />
          <span style={{ color: T.accent }}>saving lives.</span>
        </p>
        <p
          style={{
            fontSize: "0.87rem",
            color: T.textSub,
            lineHeight: 1.72,
            maxWidth: 310,
          }}
        >
          Connect with rescue organizations, volunteer coordinators, and AI-powered triage — all on one platform.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", marginTop: "2rem" }}>
          {testimonials.map((t) => (
            <div
              key={t.name}
              style={{
                background: T.bgGlass,
                backdropFilter: "blur(8px)",
                border: `1px solid ${T.borderGlass}`,
                borderRadius: 10,
                padding: "0.8rem 1rem",
              }}
            >
              <p style={{ fontSize: "0.8rem", color: T.textSub, lineHeight: 1.55, margin: 0 }}>
                "{t.quote}"
              </p>
              <p style={{ fontSize: "0.68rem", color: T.accent, marginTop: "0.4rem", margin: "0.4rem 0 0" }}>
                — {t.name}, {t.org}
              </p>
            </div>
          ))}
        </div>
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

// ─── ROLE CARD ────────────────────────────────────────────────────────────────
function RoleCard({ role, selected, onSelect, T }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(role.id)}
      style={{
        flex: 1,
        minWidth: 0,
        padding: "0.9rem 0.75rem",
        borderRadius: 12,
        border: `1.5px solid ${selected ? T.accent : T.border}`,
        background: selected ? T.accentPale : T.bgCard,
        cursor: "pointer",
        fontFamily: "inherit",
        textAlign: "left",
        transition: "border-color 0.18s, background 0.18s, box-shadow 0.18s",
        boxShadow: selected ? `0 0 0 2px ${T.accentPale}` : "none",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 9,
          background: selected ? T.accent : T.border,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: selected ? "#fff" : T.textMuted,
          transition: "background 0.18s, color 0.18s",
          flexShrink: 0,
        }}
      >
        {role.icon}
      </div>
      <div>
        <div
          style={{
            fontSize: "0.84rem",
            fontWeight: 700,
            color: selected ? T.accent : T.text,
            letterSpacing: "-0.01em",
            marginBottom: "0.2rem",
          }}
        >
          {role.label}
        </div>
        <div style={{ fontSize: "0.7rem", color: T.textMuted, lineHeight: 1.45 }}>
          {role.description}
        </div>
      </div>
    </button>
  );
}

// ─── PASSWORD STRENGTH ────────────────────────────────────────────────────────
function PasswordStrength({ password, T }) {
  const checks = [
    password.length >= 6,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ["Weak", "Fair", "Good", "Strong"];
  const colors = ["#DC2626", "#F59E0B", "#16A056", "#16A056"];
  const label = labels[score - 1] || "Weak";
  const color = score > 0 ? colors[score - 1] : T.border;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <div style={{ display: "flex", gap: "0.3rem" }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: i < score ? color : T.border,
              transition: "background 0.2s",
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: "0.7rem", color, fontWeight: 600 }}>
        Password strength: {label}
      </span>
    </div>
  );
}

// ─── REGISTER PAGE ────────────────────────────────────────────────────────────
export default function Register() {
  const { T, mode } = useT();
  const { register: registerFn } = useAuth();
  const navigate = useNavigate();

  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: ROLES.user,
    },
  });

  const selectedRole = watch("role");
  const currentPassword = watch("password") || "";

  const onSubmit = async (data) => {
    setGlobalError("");
    setLoading(true);

    const payload = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      role: data.role,
    };

    const res = await registerFn(payload);
    setLoading(false);

    if (!res.success) {
      setGlobalError(res.message || "Registration failed");
      return;
    }

    const role = res.user?.role || data.role || "user";
    navigate(ROLE_REDIRECTS[role] || "/dashboard/user", { replace: true });
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
        <BrandPanel mode={mode} T={T} />
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

        <div style={{ width: "100%", maxWidth: 440 }}>
          {/* Header */}
          <div style={{ marginBottom: "1.75rem" }}>
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
                Create Account
              </span>
            </div>
            <h1
              style={{
                fontSize: "clamp(1.4rem, 2.5vw, 1.75rem)",
                fontWeight: 800,
                color: T.text,
                letterSpacing: "-0.028em",
                lineHeight: 1.15,
                marginBottom: "0.5rem",
              }}
            >
              Join ResQNet
            </h1>
            <p style={{ fontSize: "0.875rem", color: T.textSub, lineHeight: 1.65 }}>
              Create your account and start coordinating rescues in minutes.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {/* Account type */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: T.textSub,
                  letterSpacing: "0.02em",
                }}
              >
                What kind of account do you want to create?
              </span>
              <div style={{ display: "flex", gap: "0.6rem" }} className="rq-role-grid">
                {PUBLIC_ROLES.map((role) => (
                  <RoleCard
                    key={role.id}
                    role={role}
                    selected={selectedRole === role.id}
                    onSelect={(id) => setValue("role", id)}
                    T={T}
                  />
                ))}
              </div>
            </div>

            {/* Full name */}
            <AuthInput
              label="Full name"
              type="text"
              placeholder="Your full name"
              autoComplete="name"
              T={T}
              error={errors.fullName?.message}
              {...register("fullName")}
            />

            {/* Email */}
            <AuthInput
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              T={T}
              error={errors.email?.message}
              {...register("email")}
            />

            {/* Password + Confirm */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }} className="rq-pw-grid">
              <AuthInput
                label="Password"
                type="password"
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                T={T}
                error={errors.password?.message}
                {...register("password")}
              />
              <AuthInput
                label="Confirm password"
                type="password"
                placeholder="Repeat password"
                autoComplete="new-password"
                T={T}
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />
            </div>

            {/* Password strength indicator */}
            {currentPassword.length > 0 && (
              <PasswordStrength password={currentPassword} T={T} />
            )}

            {/* Global error */}
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
                  Creating account…
                </>
              ) : (
                "Create ResQNet account"
              )}
            </button>
          </form>

          {/* Login link */}
          <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.83rem", color: T.textSub }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: T.accent, fontWeight: 600, textDecoration: "none" }}>
              Sign in
            </Link>
          </p>

          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <Link to="/" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", textDecoration: "none", color: T.textSub, opacity: 0.95 }} aria-label="Go to ResQNet home">
              <img src={logoMain} alt="ResQNet" style={{ width: 44, height: 44, objectFit: "contain" }} />
            </Link>
          </div>

          {/* Terms note */}
          <p
            style={{
              marginTop: "1rem",
              textAlign: "center",
              fontSize: "0.72rem",
              color: T.textMuted,
              lineHeight: 1.55,
            }}
          >
            By creating an account you agree to our{" "}
            <span style={{ color: T.accent, cursor: "pointer" }}>Terms of Service</span> and{" "}
            <span style={{ color: T.accent, cursor: "pointer" }}>Privacy Policy</span>.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes rqSpin { to { transform: rotate(360deg); } }
        @media (min-width: 768px) { .rq-auth-left { display: block !important; } }
        @media (max-width: 767px) { .rq-mobile-logo { display: flex !important; } }
        @media (max-width: 480px) {
          .rq-role-grid { flex-direction: column !important; }
          .rq-pw-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
