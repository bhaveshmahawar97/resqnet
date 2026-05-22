import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useT } from "../../context/ThemeContext";
import DashboardPage from "../../components/dashboard/DashboardPage";
import Button from "../../components/ui/Button";

export default function AccessDenied({ scope = "admin" }) {
  const { T } = useT();

  return (
    <DashboardPage>
      <div
        style={{
          maxWidth: 520,
          margin: "4rem auto",
          textAlign: "center",
          padding: "clamp(2rem, 5vw, 3rem)",
          background: T.bgCard,
          border: `1px solid ${T.border}`,
          borderRadius: 16,
          boxShadow: `0 8px 32px ${T.shadow}`,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            margin: "0 auto 1.25rem",
            background: T.bgAlt,
            border: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: T.textMuted,
          }}
        >
          <ShieldAlert size={24} strokeWidth={1.75} />
        </div>
        <h1 style={{ fontSize: "clamp(1.35rem, 3vw, 1.75rem)", fontWeight: 800, color: T.text, margin: "0 0 0.75rem" }}>
          Access restricted
        </h1>
        <p style={{ fontSize: "0.9rem", color: T.textSub, lineHeight: 1.7, margin: "0 0 1.5rem" }}>
          {scope === "admin"
            ? "The admin operations console requires an authenticated admin session. This route is not listed in public navigation."
            : "You do not have permission to view this dashboard area."}
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Button variant="ghost" size="sm">Back to Platform</Button>
          </Link>
          <Link to="/login" state={{ from: { pathname: scope === "admin" ? "/dashboard/admin" : "/dashboard/user" } }} style={{ textDecoration: "none" }}>
            <Button variant="primary" size="sm">Sign In</Button>
          </Link>
        </div>
      </div>
    </DashboardPage>
  );
}
