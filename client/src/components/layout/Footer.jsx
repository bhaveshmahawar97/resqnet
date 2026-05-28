/**
 * ResQNet Footer — Phase 2 Premium Redesign
 * Multi-column layout: Brand | Platform | Emergency | Adoption | NGOs | Company | Legal
 * Always dark surface. rgba opacity values are intentional (dark bg only).
 */

import { Link } from "react-router-dom";
import { useT } from "../../context/ThemeContext";

// Footer always renders on bgFooter — always dark in both themes.
// Named constants instead of scattered inline rgba strings.
const F = {
  fg:        "rgba(255,255,255,0.88)",
  fgMuted:   "rgba(255,255,255,0.45)",
  fgDim:     "rgba(255,255,255,0.28)",
  fgFaint:   "rgba(255,255,255,0.35)",
  border:    "rgba(255,255,255,0.08)",
  cardBg:    "rgba(255,255,255,0.04)",
  cardBgHov: "rgba(255,255,255,0.08)",
};

const COLS = [
  {
    heading: "Emergency Rescue",
    links: [
      { label: "Report Animal Emergency", to: "/rescue" },
      { label: "AI Health Assessment",    to: "/ai-health" },
      { label: "Rescue Tracking",         to: "/rescue" },
      { label: "Emergency Guidelines",    to: "#" },
    ],
  },
  {
    heading: "Adoption",
    links: [
      { label: "Give an Animal a Home",   to: "/adoption" },
      { label: "Browse Animals",          to: "/adoption" },
      { label: "How Adoption Works",      to: "#" },
      { label: "Adoption FAQs",           to: "#" },
    ],
  },
  {
    heading: "NGOs & Volunteers",
    links: [
      { label: "Locate Rescue Partners",  to: "/ngos" },
      { label: "Register Your NGO",       to: "/ngo-register" },
      { label: "Join Rescue Network",     to: "/register" },
      { label: "NGO Dashboard",           to: "/dashboard/ngo" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About ResQNet",           to: "#" },
      { label: "Contact",                 to: "#" },
      { label: "Privacy Policy",          to: "#" },
      { label: "Terms of Service",        to: "#" },
    ],
  },
];

const SOCIAL = [
  {
    label: "Twitter / X",
    href: "#",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.629L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "#",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const { T } = useT();

  return (
    <footer style={{ width: "100%", background: T.bgFooter, borderTop: `1px solid ${F.border}`, color: F.fg }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(3rem,6vw,4.5rem) clamp(1.25rem,4vw,3rem) 0" }}>

        {/* Main grid — brand col + 4 link columns */}
        <div className="rq-footer-grid" style={{
          display: "grid",
          gridTemplateColumns: "minmax(200px,260px) repeat(4,1fr)",
          gap: "clamp(1.5rem,3vw,2.5rem)",
          marginBottom: "clamp(2.5rem,4vw,3.5rem)",
        }}>
          {/* Brand column */}
          <div>
            <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem", textDecoration: "none", marginBottom: "1.25rem" }}>
              <div style={{
                width: 32, height: 32, borderRadius: "var(--radius-md)",
                background: T.accent,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontSize: "1.05rem", fontWeight: 800, color: F.fg, letterSpacing: "-0.025em" }}>ResQNet</span>
            </Link>

            <p style={{ fontSize: "0.78rem", color: F.fgFaint, lineHeight: 1.72, marginBottom: "1.5rem", maxWidth: 220 }}>
              AI-powered animal rescue coordination connecting communities, NGOs, and volunteers across India.
            </p>

            {/* Platform badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              padding: "0.28rem 0.75rem", borderRadius: "var(--radius-full)",
              border: `1px solid ${F.border}`, background: F.cardBg,
              marginBottom: "1.25rem",
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#34D399", animation: "rq-pulse-dot 3s ease-in-out infinite" }} />
              <span style={{ fontSize: "0.6rem", color: F.fgMuted, fontWeight: 600 }}>All systems operational</span>
            </div>

            {/* Social */}
            <div style={{ display: "flex", gap: "0.45rem" }}>
              {SOCIAL.map(s => (
                <a key={s.label} href={s.href} aria-label={s.label} style={{
                  width: 32, height: 32, borderRadius: "var(--radius-sm)",
                  border: `1px solid ${F.border}`, background: F.cardBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: F.fgFaint, textDecoration: "none",
                  transition: "background 0.15s, color 0.15s, border-color 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = F.cardBgHov; e.currentTarget.style.color = F.fg; e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = F.cardBg; e.currentTarget.style.color = F.fgFaint; e.currentTarget.style.borderColor = F.border; }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLS.map(col => (
            <div key={col.heading}>
              <div style={{
                fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", color: F.fgFaint, marginBottom: "1rem",
              }}>
                {col.heading}
              </div>
              <nav style={{ display: "flex", flexDirection: "column", gap: "0.72rem" }}>
                {col.links.map(link => (
                  <Link key={link.label} to={link.to} style={{
                    fontSize: "0.78rem", color: F.fgMuted, textDecoration: "none",
                    fontWeight: 400, lineHeight: 1.3,
                    transition: "color 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = F.fg}
                    onMouseLeave={e => e.currentTarget.style.color = F.fgMuted}>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${F.border}`, paddingTop: "1.5rem", paddingBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
            <span style={{ fontSize: "0.72rem", color: F.fgDim }}>
              © {new Date().getFullYear()} ResQNet. All rights reserved.
            </span>
            <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
              {[
                { label: "Privacy", to: "#" },
                { label: "Terms", to: "#" },
                { label: "Contact", to: "#" },
              ].map(l => (
                <Link key={l.label} to={l.to} style={{
                  fontSize: "0.72rem", color: F.fgDim, textDecoration: "none",
                  transition: "color 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.color = F.fgMuted}
                  onMouseLeave={e => e.currentTarget.style.color = F.fgDim}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive grid overrides */}
      <style>{`
        @media (max-width: 1023px) { .rq-footer-grid { grid-template-columns: 1fr 1fr 1fr !important; } }
        @media (max-width: 767px)  { .rq-footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 479px)  { .rq-footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}
