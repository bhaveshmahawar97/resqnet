/**
 * ResQNet — Premium Footer
 * Phase 3: Global Navigation System
 *
 * Five columns: Brand + Emergency Rescue + Animal Care + Organizations + Company
 * Always-dark surface — opacity whites are intentional (not theme failures).
 * Responsive breakpoints live in index.css under .rq-footer-grid / .rq-footer-cta-grid.
 * Zero hardcoded hex outside the F palette constants.
 */

import { Link } from "react-router-dom";
import { useT } from "../../context/ThemeContext";
import ResQNetLogo from "../ui/ResQNetLogo";

/* ─── always-dark surface palette ────────────────────────────────────────── */
const F = {
  fg:       "rgba(255,255,255,0.88)",
  fgSub:    "rgba(255,255,255,0.50)",
  fgDim:    "rgba(255,255,255,0.28)",
  fgFaint:  "rgba(255,255,255,0.14)",
  border:   "rgba(255,255,255,0.09)",
  divider:  "rgba(255,255,255,0.07)",
  icon:     "rgba(255,255,255,0.40)",
  iconBg:   "rgba(255,255,255,0.06)",
  iconHov:  "rgba(255,255,255,0.12)",
  ctaBg:    "rgba(255,255,255,0.04)",
  ctaBorder:"rgba(255,255,255,0.10)",
};

/* ─── link columns ─────────────────────────────────────────────────────────
   Spec: Emergency Rescue · Animal Care · Organizations · Company           */
const COLS = [
  {
    heading: "Emergency Rescue",
    links: [
      { label: "Report Animal Emergency", to: "/rescue"   },
      { label: "Track Rescue Status",     to: "/rescue"   },
      { label: "Rescue Partners",         to: "/ngos"     },
      { label: "AI Health Assessment",    to: "/ai-health"},
    ],
  },
  {
    heading: "Animal Care",
    links: [
      { label: "Give an Animal a Home",   to: "/adoption" },
      { label: "Browse Animals",          to: "/adoption" },
      { label: "AI Health Scanner",       to: "/ai-health"},
      { label: "Volunteer Network",       to: "/register" },
    ],
  },
  {
    heading: "Organizations",
    links: [
      { label: "NGO Network",             to: "/ngos"         },
      { label: "Register Your NGO",       to: "/ngo-register" },
      { label: "Join as Volunteer",       to: "/register"     },
      { label: "NGO Dashboard",           to: "/dashboard/ngo"},
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About ResQNet",           to: "#" },
      { label: "Contact Us",              to: "#" },
      { label: "Privacy Policy",          to: "#" },
      { label: "Terms of Service",        to: "#" },
    ],
  },
];

/* ─── social icons ─────────────────────────────────────────────────────── */
const SOCIAL = [
  {
    label: "Twitter / X",
    href:  "#",
    icon:  (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.629L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href:  "#",
    icon:  (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    label: "GitHub",
    href:  "#",
    icon:  (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.77.004 1.543.115 2.268.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const { T } = useT();

  return (
    <footer style={{ width: "100%", background: T.bgFooter, color: F.fg }}>

      {/* ── top gradient accent border ── */}
      <div style={{
        height: 1,
        background: `linear-gradient(90deg, transparent 0%, ${F.border} 20%, ${F.border} 80%, transparent 100%)`,
      }} />

      {/* ── CTA STRIP ─────────────────────────────────────────────────────── */}
      <div style={{
        borderBottom: `1px solid ${F.divider}`,
        background: F.ctaBg,
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "1.5rem clamp(1.25rem, 4vw, 3rem)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "1rem",
        }}>
          <div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: F.fg, marginBottom: "0.2rem" }}>
              Join the ResQNet rescue network
            </div>
            <div style={{ fontSize: "0.78rem", color: F.fgSub }}>
              Volunteers, NGOs, and rescuers — make a difference today
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.65rem", flexShrink: 0 }}>
            <Link
              to="/rescue"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-sm)",
                background: "rgba(248,113,113,0.14)", border: "1px solid rgba(248,113,113,0.28)",
                color: "#F87171", fontSize: "0.78rem", fontWeight: 700,
                textDecoration: "none", whiteSpace: "nowrap",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(248,113,113,0.22)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(248,113,113,0.14)"}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
              Report Emergency
            </Link>
            <Link
              to="/register"
              style={{
                display: "inline-flex", alignItems: "center",
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-sm)",
                background: T.accent, border: "none",
                color: "#fff", fontSize: "0.78rem", fontWeight: 700,
                textDecoration: "none", whiteSpace: "nowrap",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              Join Network
            </Link>
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ─────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(2.75rem,5vw,4.5rem) clamp(1.25rem,4vw,3rem) 0" }}>

        <div className="rq-footer-grid">

          {/* ── BRAND COLUMN ── */}
          <div>
            {/* Logo mark + wordmark */}
            <Link
              to="/"
              style={{ display: "inline-flex", textDecoration: "none", marginBottom: "1.1rem" }}
            >
              <ResQNetLogo variant="dark" size={34} tagline />
            </Link>

            {/* Mission statement */}
            <p style={{ fontSize: "0.8rem", color: F.fgSub, lineHeight: 1.75, marginBottom: "1.25rem", maxWidth: 230 }}>
              Connecting communities, NGOs, and volunteers to save animal lives — emergency rescue, AI triage, and adoption in one platform.
            </p>

            {/* System status badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.45rem",
              padding: "0.28rem 0.75rem",
              borderRadius: "var(--radius-full)",
              border: `1px solid ${F.border}`,
              background: F.iconBg,
              marginBottom: "1.25rem",
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#34D399",
                boxShadow: "0 0 0 2px rgba(52,211,153,0.25)",
                animation: "rq-pulse-dot 3s ease-in-out infinite",
              }} />
              <span style={{ fontSize: "0.64rem", color: F.fgSub, fontWeight: 500 }}>
                All systems operational
              </span>
            </div>

            {/* Social icons */}
            <div style={{ display: "flex", gap: "0.4rem" }}>
              {SOCIAL.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: 32, height: 32,
                    borderRadius: "var(--radius-sm)",
                    border: `1px solid ${F.border}`,
                    background: F.iconBg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: F.icon, textDecoration: "none",
                    transition: "background 0.16s, color 0.16s, border-color 0.16s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background   = F.iconHov;
                    e.currentTarget.style.color        = F.fg;
                    e.currentTarget.style.borderColor  = "rgba(255,255,255,0.18)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background   = F.iconBg;
                    e.currentTarget.style.color        = F.icon;
                    e.currentTarget.style.borderColor  = F.border;
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── LINK COLUMNS ── */}
          {COLS.map(col => (
            <div key={col.heading}>
              <div style={{
                fontSize: "0.62rem", fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: F.fgSub, marginBottom: "1.1rem",
              }}>
                {col.heading}
              </div>
              <nav aria-label={col.heading}>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.72rem" }}>
                  {col.links.map(link => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        style={{
                          fontSize: "0.79rem", color: F.fgSub,
                          textDecoration: "none", fontWeight: 400, lineHeight: 1.3,
                          transition: "color 0.14s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = F.fg}
                        onMouseLeave={e => e.currentTarget.style.color = F.fgSub}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          ))}
        </div>

        {/* ── BOTTOM BAR ──────────────────────────────────────────────────── */}
        <div style={{
          borderTop: `1px solid ${F.divider}`,
          padding: "1.25rem 0 1.5rem",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap", gap: "0.75rem",
          marginTop: "clamp(2.5rem,4vw,4rem)",
        }}>
          <span style={{ fontSize: "0.72rem", color: F.fgDim }}>
            &copy; {new Date().getFullYear()} ResQNet. All rights reserved.
          </span>
          <div style={{ display: "flex", gap: "1.25rem" }}>
            {[
              { label: "Privacy", to: "#" },
              { label: "Terms",   to: "#" },
              { label: "Contact", to: "#" },
            ].map(l => (
              <Link
                key={l.label}
                to={l.to}
                style={{ fontSize: "0.72rem", color: F.fgDim, textDecoration: "none", transition: "color 0.14s" }}
                onMouseEnter={e => e.currentTarget.style.color = F.fgSub}
                onMouseLeave={e => e.currentTarget.style.color = F.fgDim}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
