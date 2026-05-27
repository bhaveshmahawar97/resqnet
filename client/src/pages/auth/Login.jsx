import { useState, forwardRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../utils/validators";
import { useAuth, ROLES } from "../../context/AuthContext";
import { useT } from "../../context/ThemeContext";

const ROLE_REDIRECTS = {
  [ROLES.user]: "/dashboard/user",
  [ROLES.ngo]: "/dashboard/ngo",
  [ROLES.volunteer]: "/dashboard/volunteer",
  [ROLES.admin]: "/dashboard/admin",
};

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

export default function Login() {
  const { T } = useT();
  const { signIn, role: currentRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) });
  const from = location.state?.from?.pathname;

  const onSubmit = async (data) => {
    setLoading(true);
    setGlobalError("");
    const res = await signIn({ email: data.email, password: data.password });
    setLoading(false);
    if (!res.success) { setGlobalError(res.message || "Invalid credentials"); return; }
    const role = res.user?.role || currentRole || "user";
    navigate(from || ROLE_REDIRECTS[role] || "/dashboard/user", { replace: true });
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: T.bg, padding: "1.5rem", overflowY: "auto" }}>
      <div style={{ width: "100%", maxWidth: 400, background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: "1.75rem", boxShadow: T.shadowLg, margin: "auto" }}>

        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", marginBottom: "1.5rem" }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontSize: "0.95rem", fontWeight: 800, color: T.text, letterSpacing: "-0.02em" }}>ResQNet</span>
        </Link>

        <h1 style={{ fontSize: "1.35rem", fontWeight: 800, color: T.text, margin: "0 0 0.25rem", letterSpacing: "-0.025em" }}>Sign in</h1>
        <p style={{ fontSize: "0.8rem", color: T.textSub, margin: "0 0 1.5rem" }}>Access your ResQNet dashboard.</p>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <AuthInput label="Email" type="email" placeholder="you@example.com" autoComplete="email" T={T} error={errors.email?.message} {...register("email")} />
          <AuthInput label="Password" type="password" placeholder="••••••••" autoComplete="current-password" T={T} error={errors.password?.message} {...register("password")} />

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
                Signing in…
              </>
            ) : "Sign in to ResQNet"}
          </button>
        </form>

        <p style={{ marginTop: "1.25rem", textAlign: "center", fontSize: "0.8rem", color: T.textSub }}>
          New to ResQNet?{" "}
          <Link to="/register" style={{ color: T.accent, fontWeight: 600, textDecoration: "none" }}>Create an account</Link>
        </p>
      </div>
      <style>{`@keyframes rqSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
