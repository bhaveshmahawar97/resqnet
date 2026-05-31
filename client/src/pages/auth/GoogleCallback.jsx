import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useT } from "../../context/ThemeContext";

const ROLE_REDIRECTS = {
  user: "/dashboard/user",
  ngo: "/dashboard/ngo",
  volunteer: "/dashboard/volunteer",
  admin: "/dashboard/admin",
};

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const { googleSignIn } = useAuth();
  const { T } = useT();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const userRaw = searchParams.get("user");
    const err = searchParams.get("error");

    if (err) {
      setError(`Google sign-in failed: ${err.replace(/_/g, " ")}`);
      return;
    }

    if (!token) {
      setError("Authentication failed: no token received.");
      return;
    }

    let user = null;
    try {
      user = userRaw ? JSON.parse(decodeURIComponent(userRaw)) : null;
    } catch {
      setError("Authentication failed: invalid user data.");
      return;
    }

    const result = googleSignIn({ token, user });
    if (!result?.success) {
      setError("Authentication failed: could not sign in.");
      return;
    }

    const role = user?.role || "user";
    navigate(ROLE_REDIRECTS[role] || "/dashboard/user", { replace: true });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div style={{
        position: "fixed", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "1rem",
        background: T.bg, padding: "2rem",
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          background: T.dangerPale, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.danger} strokeWidth="2.2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4M12 16h.01"/>
          </svg>
        </div>
        <p style={{ fontSize: "0.9rem", fontWeight: 600, color: T.danger, textAlign: "center" }}>{error}</p>
        <a href="/login" style={{
          fontSize: "0.82rem", color: T.accent, fontWeight: 600, textDecoration: "none",
        }}>
          Back to login
        </a>
      </div>
    );
  }

  return (
    <div style={{
      position: "fixed", inset: 0, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "0.85rem",
      background: T.bg,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: "50%",
        border: `3px solid ${T.border}`,
        borderTopColor: T.accent,
        animation: "rqSpin 0.75s linear infinite",
      }} />
      <span style={{ fontSize: "0.85rem", color: T.textSub, fontWeight: 500 }}>
        Signing you in with Google…
      </span>
      <style>{`@keyframes rqSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
