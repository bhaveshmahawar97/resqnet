import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { useT } from "../../context/ThemeContext";

export default function FooterCTA() {
  const { T } = useT();
  return (
    <footer style={{ width: "100%", padding: "3rem 0", background: T.bgAlt }}>
      <div style={{ width: "100%", maxWidth: 1100, margin: "0 auto", padding: "0 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: T.text }}>Ready to help or collaborate?</div>
          <div style={{ color: T.textSub }}>Create an account or get in touch to join the ResQNet ecosystem.</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link to="/adopt"><Button variant="ghost">Browse</Button></Link>
          <Link to="/ngos"><Button variant="primary">Partners</Button></Link>
        </div>
      </div>
    </footer>
  );
}
