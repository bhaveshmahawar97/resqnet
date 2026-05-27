import { useState, forwardRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../utils/validators";
import { useAuth, ROLES } from "../../context/AuthContext";
import { useT } from "../../context/ThemeContext";

const ROLE_REDIRECTS = {
  [ROLES.user]: "/dashboard/user",
  [ROLES.ngo]: "/dashboard/ngo",
  [ROLES.volunteer]: "/dashboard/volunteer",
  [ROLES.admin]: "/dashboard/admin",
};

const PUBLIC_ROLES = [
  { id: ROLES.user, label: "User", hint: "Report incidents, track rescues." },
  { id: ROLES.ngo, label: "NGO", hint: "Manage your organization & teams." },
  { id: ROLES.volunteer, label: "Volunteer", hint: "Accept missions, log field work." },
];

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
  const score = [password.length >= 6, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length;
  const colors = [T.danger, T.warning, T.success, T.success];
  const labels = ["Weak", "Fair", "Good", "Strong"];
  const color = score > 0 ? colors[score - 1] : T.border;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <div style={{ display: "flex", gap: "0.2rem", flex: 1 }}>
        {[0,1,2,3].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < score ? color : T.border, transition: "background 0.2s" }} />)}
      </div>
      {score > 0 && <span style={{ fontSize: "0.66rem", color, fontWeight: 600, minWidth: 36, textAlign: "right" }}>{labels[score - 1]}</span>}
    </div>
  );
}

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
    const res = await registerFn({ fullName: data.fullName, email: data.email, password: data.password, role: data.role });
    setLoading(false);
    if (!res.success) { setGlobalError(res.message || "Registration failed"); return; }
    navigate(ROLE_REDIRECTS[res.user?.role || data.role] || "/dashboard/user", { replace: true });
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: T.bg, padding: "1.5rem", overflowY: "auto" }}>
      <div style={{ width: "100%", maxWidth: 460, background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: "1.75rem", boxShadow: T.shadowLg, margin: "auto" }}>

        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", marginBottom: "1.5rem" }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontSize: "0.95rem", fontWeight: 800, color: T.text, letterSpacing: "-0.02em" }}>ResQNet</span>
        </Link>

        <h1 style={{ fontSize: "1.35rem", fontWeight: 800, color: T.text, margin: "0 0 0.25rem", letterSpacing: "-0.025em" }}>Create account</h1>
        <p style={{ fontSize: "0.8rem", color: T.textSub, margin: "0 0 1.25rem" }}>Join the ResQNet rescue network.</p>

        {/* Role selector */}
        <div style={{ marginBottom: "1.25rem" }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 600, color: T.textSub, letterSpacing: "0.02em", display: "block", marginBottom: "0.5rem" }}>I am a</span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {PUBLIC_ROLES.map(role => (
              <button
                key={role.id}
                type="button"
                onClick={() => setValue("role", role.id)}
                style={{
                  flex: 1, padding: "0.55rem 0.5rem", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                  border: `1.5px solid ${selectedRole === role.id ? T.accent : T.border}`,
                  background: selectedRole === role.id ? T.accentPale : T.bgCard,
                  transition: "border-color 0.15s, background 0.15s",
                }}
              >
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: selectedRole === role.id ? T.accent : T.text }}>{role.label}</div>
                <div style={{ fontSize: "0.65rem", color: T.textMuted, marginTop: "0.15rem", lineHeight: 1.35 }}>{role.hint}</div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          <input type="hidden" {...register("role")} />
          <AuthInput label="Full Name" placeholder="Your full name" autoComplete="name" T={T} error={errors.fullName?.message} {...register("fullName")} />
          <AuthInput label="Email" type="email" placeholder="you@example.com" autoComplete="email" T={T} error={errors.email?.message} {...register("email")} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <AuthInput label="Password" type="password" placeholder="••••••••" autoComplete="new-password" T={T} error={errors.password?.message} {...register("password")} />
            <AuthInput label="Confirm Password" type="password" placeholder="••••••••" autoComplete="new-password" T={T} error={errors.confirmPassword?.message} {...register("confirmPassword")} />
          </div>

          {currentPassword && <PasswordStrength password={currentPassword} T={T} />}

          {globalError && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 0.85rem", borderRadius: 8, background: T.dangerPale, border: `1px solid ${T.dangerBorder}` }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.danger} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              <span style={{ fontSize: "0.78rem", color: T.danger }}>{globalError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "0.72rem", borderRadius: 9, border: "none", background: T.accent, color: "#fff", fontWeight: 700, fontSize: "0.88rem", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: loading ? 0.75 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
          >
            {loading ? (
              <>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ animation: "rqSpin 0.8s linear infinite" }}>
                  <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                  <path d="M8 2a6 6 0 0 1 6 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Creating account…
              </>
            ) : "Create account"}
          </button>
        </form>

        <p style={{ marginTop: "1.25rem", textAlign: "center", fontSize: "0.8rem", color: T.textSub }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: T.accent, fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
        </p>
        <p style={{ marginTop: "0.75rem", textAlign: "center", fontSize: "0.7rem", color: T.textMuted, lineHeight: 1.5 }}>
          By creating an account you agree to our <span style={{ color: T.accent, cursor: "pointer" }}>Terms</span> and <span style={{ color: T.accent, cursor: "pointer" }}>Privacy Policy</span>.
        </p>
      </div>
      <style>{`@keyframes rqSpin { to { transform: rotate(360deg); } } @media (max-width: 480px) { .rq-pw-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
