import { useAuth } from "../context/AuthContext";
import { useT } from "../context/ThemeContext";
import PageHeader from "../components/ui/PageHeader";

export default function Profile() {
  const { name, email, role } = useAuth();
  const { T } = useT();

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
      <PageHeader 
        title="My Profile" 
        subtitle="Manage your personal information and account settings" 
      />
      <div style={{
        background: T.bgCard,
        borderRadius: 16,
        padding: "2rem",
        border: `1px solid ${T.border}`,
        marginTop: "2rem"
      }}>
        <h3 style={{ color: T.textHeading, margin: "0 0 1rem 0" }}>Profile Details</h3>
        <div style={{ display: "grid", gap: "1rem" }}>
          <div>
            <strong style={{ color: T.textSub }}>Name:</strong>
            <div style={{ color: T.text, marginTop: "0.25rem" }}>{name}</div>
          </div>
          <div>
            <strong style={{ color: T.textSub }}>Email:</strong>
            <div style={{ color: T.text, marginTop: "0.25rem" }}>{email}</div>
          </div>
          <div>
            <strong style={{ color: T.textSub }}>Role:</strong>
            <div style={{ color: T.text, marginTop: "0.25rem", textTransform: "capitalize" }}>{role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
