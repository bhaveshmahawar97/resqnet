import { useT } from "../../context/ThemeContext";

export default function DashboardPage({ children }) {
  const { T } = useT();

  return (
    <main
      className="dashboard-page"
      style={{
        width: "100%",
        minHeight: "100vh",
        background: T.bg,
        paddingTop: "clamp(4.5rem, 12vw, 5.75rem)",
        overflowX: "hidden",
      }}
    >
      <div className="dashboard-shell">{children}</div>
    </main>
  );
}
