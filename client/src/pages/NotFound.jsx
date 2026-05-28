import { Link } from "react-router-dom";
import { useT } from "../context/ThemeContext";

export default function NotFound() {
  const { T } = useT();
  return (
    <main style={{ width:"100%", minHeight:"80vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:T.bg, padding:"2rem", textAlign:"center" }}>
      <div style={{ fontSize:"4rem", fontWeight:900, color:T.border, letterSpacing:"-0.05em", lineHeight:1 }}>404</div>
      <h1 style={{ fontSize:"1.25rem", fontWeight:800, color:T.text, margin:"1rem 0 0.5rem" }}>Page not found</h1>
      <p style={{ fontSize:"0.85rem", color:T.textMuted, margin:"0 0 1.5rem", lineHeight:1.6 }}>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" style={{ padding:"0.65rem 1.25rem", borderRadius:8, background:T.accent, color:"#fff", fontWeight:700, fontSize:"0.85rem", textDecoration:"none" }}>Back to Home</Link>
    </main>
  );
}
