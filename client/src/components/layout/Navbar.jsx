/**
 * ResQNet — Premium Navbar
 * Phase 3: Global Navigation System
 *
 * All existing functionality preserved:
 *   auth / notifications / user menu / theme toggle / feedback / mobile drawer
 * Design upgrades:
 *   animated active underline + pill · glassmorphism scroll · motion hamburger ·
 *   mobile drawer with backdrop · accessible ARIA · hover pill backgrounds ·
 *   search placeholder · emergency CTA for all users · zero hardcoded hex
 */

import { useEffect, useRef, useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import useViewport from "../../hooks/useViewport";
import ThemeToggle from "../ui/ThemeToggle";
import FeedbackModal from "../system/FeedbackModal";
import ResQNetLogo from "../ui/ResQNetLogo";
import { ROUTE_LINKS } from "../../routes/routesConfig";
import { useNotification } from "../../context/NotificationContext";
import NotificationDropdown from "../notifications/NotificationDropdown";

/* ─── role → dashboard map ────────────────────────────────────────────────── */
const DASH = {
  user:      "/dashboard/user",
  ngo:       "/dashboard/ngo",
  volunteer: "/dashboard/volunteer",
  admin:     "/dashboard/admin",
};

/* ─── SVG icon helpers ────────────────────────────────────────────────────── */
function IcoBell() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}

function IcoEmergency() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  );
}

function IcoChevronDown({ color }) {
  return (
    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M2 3.5L5 6.5 8 3.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IcoArrowRight() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 2l4 3-4 3"/>
    </svg>
  );
}

function IcoSearch() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

function IcoFeedback() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}

/* ─── reusable icon button ────────────────────────────────────────────────── */
function NavIconBtn({ onClick, label, children, badge, tooltip, T }) {
  const [showTip, setShowTip] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        title={tooltip || label}
        onMouseEnter={() => { setHovered(true); if (tooltip) setShowTip(true); }}
        onMouseLeave={() => { setHovered(false); setShowTip(false); }}
        style={{
          width: 34, height: 34, borderRadius: "var(--radius-sm)",
          border: `1px solid ${hovered ? T.border : "transparent"}`,
          background: hovered ? T.bgAlt : "transparent",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          color: hovered ? T.text : T.textMuted,
          transition: "background 0.14s, color 0.14s, border-color 0.14s",
          position: "relative",
        }}
      >
        {children}
        {badge > 0 && (
          <span aria-hidden="true" style={{
            position: "absolute", top: 4, right: 4,
            width: 7, height: 7, borderRadius: "50%",
            background: T.danger,
            border: `1.5px solid ${T.bgNav || T.bgCard}`,
          }} />
        )}
      </button>

      {/* Tooltip */}
      {tooltip && showTip && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", left: "50%",
          transform: "translateX(-50%)",
          background: T.bgCard, border: `1px solid ${T.border}`,
          borderRadius: "var(--radius-sm)", boxShadow: T.shadowMd,
          padding: "0.3rem 0.65rem", whiteSpace: "nowrap",
          fontSize: "0.7rem", fontWeight: 500, color: T.textSub,
          zIndex: 400, pointerEvents: "none",
        }}>
          {tooltip}
          <div style={{
            position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
            borderBottom: `5px solid ${T.border}`,
          }} />
        </div>
      )}
    </div>
  );
}

/* ─── reusable dropdown item ──────────────────────────────────────────────── */
function DropItem({ children, onClick, danger, T }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%", padding: "0.5rem 0.75rem",
        borderRadius: "var(--radius-sm)",
        border: "none", background: "transparent",
        color: danger ? T.danger : T.textSub,
        fontSize: "0.8rem", fontWeight: danger ? 600 : 400,
        cursor: "pointer", fontFamily: "inherit", textAlign: "left",
        transition: "background 0.12s",
      }}
      onMouseEnter={e => e.currentTarget.style.background = danger ? T.dangerPale : T.bgAlt}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function Navbar() {
  const { T } = useT();
  const { isAuthenticated, email, name, role, avatar, signOut } = useAuth();
  const vp = useViewport();
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useNotification();

  const [scrolled,     setScrolled]     = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen,    setNotifOpen]    = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const navH     = vp.mobile ? 56 : 64;
  const initials = (name?.[0] || email?.[0] || "U").toUpperCase();
  const dashPath = DASH[role] || DASH.user;

  /* glass on scroll */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* close drawer on route change */
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  /* close user menu on outside click */
  useEffect(() => {
    if (!userMenuOpen) return;
    const fn = e => { if (!e.target.closest("[data-umenu]")) setUserMenuOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [userMenuOpen]);

  /* lock body scroll when mobile drawer is open */
  useEffect(() => {
    document.body.style.overflow = (menuOpen && !vp.desktop) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, vp.desktop]);

  const logout = () => {
    signOut();
    setUserMenuOpen(false);
    setMenuOpen(false);
    navigate("/", { replace: true });
  };

  /* ── shared icon-button style helpers ──────────────────────────────────── */
  const iconBtnBase = {
    width: 34, height: 34, borderRadius: "var(--radius-sm)",
    border: "1px solid transparent", background: "transparent",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    color: T.textMuted, transition: "background 0.14s, color 0.14s, border-color 0.14s",
  };
  const iconBtnHover = e => {
    e.currentTarget.style.background    = T.bgAlt;
    e.currentTarget.style.borderColor   = T.border;
    e.currentTarget.style.color         = T.text;
  };
  const iconBtnLeave = e => {
    e.currentTarget.style.background    = "transparent";
    e.currentTarget.style.borderColor   = "transparent";
    e.currentTarget.style.color         = T.textMuted;
  };

  return (
    <>
      {/* ════════════════════ HEADER ════════════════════ */}
      <header
        role="banner"
        style={{
          position: "fixed", inset: "0 0 auto 0",
          zIndex: 200, height: navH,
          background: scrolled ? T.bgNav : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none",
          borderBottom: scrolled ? `1px solid ${T.border}` : "1px solid transparent",
          boxShadow: scrolled ? `0 1px 0 ${T.border}` : "none",
          transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
        }}
      >
        <div style={{
          maxWidth: 1200, width: "100%", margin: "0 auto",
          padding: "0 clamp(1.25rem, 4vw, 3rem)",
          height: "100%",
          display: "flex", alignItems: "center", gap: "0.75rem",
        }}>

          {/* ── LOGO ──────────────────────────────────────────────── */}
          <NavLink
            to="/"
            aria-label="ResQNet — go to homepage"
            style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}
          >
            <ResQNetLogo
              variant={vp.desktop ? "full" : "mark"}
              size={navH === 56 ? 30 : 32}
              T={T}
            />
          </NavLink>

          {/* ── DESKTOP NAV LINKS ─────────────────────────────────── */}
          {vp.desktop && (
            <nav
              aria-label="Primary navigation"
              style={{
                display: "flex", alignItems: "center", gap: "0.1rem",
                flex: 1, marginLeft: "clamp(1rem, 2.5vw, 2rem)",
              }}
            >
              {ROUTE_LINKS.map(item => {
                const active = item.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.to);

                const isEmergency = item.to === "/rescue";

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    style={{
                      position: "relative",
                      display: "inline-flex", alignItems: "center",
                      padding: "0.4rem 0.65rem",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.8rem",
                      fontWeight: active ? 600 : 450,
                      color: active
                        ? (isEmergency ? T.danger : T.text)
                        : (isEmergency ? T.danger : T.textSub),
                      background: active && !isEmergency ? T.accentPale : "transparent",
                      textDecoration: "none",
                      letterSpacing: "-0.01em",
                      whiteSpace: "nowrap",
                      transition: "color 0.15s, background 0.15s",
                    }}
                    onMouseEnter={e => {
                      if (!active) {
                        e.currentTarget.style.background = isEmergency ? T.dangerPale : T.bgAlt;
                        e.currentTarget.style.color      = isEmergency ? T.danger : T.text;
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color      = isEmergency ? T.danger : T.textSub;
                      }
                    }}
                  >
                    {item.label}

                    {/* animated underline — only on non-emergency active links */}
                    {active && !isEmergency && (
                      <motion.span
                        layoutId="nav-underline"
                        style={{
                          position: "absolute",
                          bottom: 2, left: "0.65rem", right: "0.65rem",
                          height: 2, borderRadius: 2,
                          background: T.accent,
                        }}
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}

                    {/* emergency active dot */}
                    {active && isEmergency && (
                      <span style={{
                        position: "absolute", top: 5, right: 5,
                        width: 5, height: 5, borderRadius: "50%",
                        background: T.danger,
                      }} />
                    )}
                  </NavLink>
                );
              })}
            </nav>
          )}

          {/* flex spacer on non-desktop */}
          {!vp.desktop && <div style={{ flex: 1 }} />}

          {/* ── RIGHT CLUSTER ─────────────────────────────────────── */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", flexShrink: 0 }}>

            {/* Emergency rescue pill — desktop, always visible */}
            {vp.desktop && (
              <Link
                to="/rescue"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.35rem",
                  padding: "0.35rem 0.8rem",
                  borderRadius: "var(--radius-full)",
                  background: T.dangerPale,
                  border: `1px solid ${T.dangerBorder}`,
                  color: T.danger,
                  fontSize: "0.73rem", fontWeight: 700,
                  textDecoration: "none",
                  marginRight: "0.25rem",
                  transition: "background 0.15s, border-color 0.15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background   = `${T.danger}14`;
                  e.currentTarget.style.borderColor  = `${T.danger}50`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background   = T.dangerPale;
                  e.currentTarget.style.borderColor  = T.dangerBorder;
                }}
              >
                <IcoEmergency />
                Emergency
              </Link>
            )}

            {/* Search placeholder */}
            <NavIconBtn
              label="Search"
              tooltip="Global search — coming soon"
              T={T}
            >
              <IcoSearch />
            </NavIconBtn>

            {/* Feedback */}
            <NavIconBtn
              label="Send feedback"
              onClick={() => setShowFeedback(true)}
              T={T}
            >
              <IcoFeedback />
            </NavIconBtn>

            {/* Theme toggle */}
            <ThemeToggle />

            {isAuthenticated ? (
              <>
                {/* Notification bell — desktop */}
                {vp.desktop && (
                  <div style={{ position: "relative" }}>
                    <button
                      type="button"
                      onClick={() => { setNotifOpen(o => !o); setUserMenuOpen(false); }}
                      aria-label={`Notifications${unreadCount > 0 ? ` — ${unreadCount} unread` : ""}`}
                      style={{ ...iconBtnBase, position: "relative" }}
                      onMouseEnter={iconBtnHover}
                      onMouseLeave={iconBtnLeave}
                    >
                      <IcoBell />
                      {unreadCount > 0 && (
                        <span aria-hidden="true" style={{
                          position: "absolute", top: 4, right: 4,
                          width: 7, height: 7, borderRadius: "50%",
                          background: T.danger,
                          border: `1.5px solid ${T.bgNav || T.bgCard}`,
                        }} />
                      )}
                    </button>
                    <NotificationDropdown isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
                  </div>
                )}

                {/* User avatar menu — desktop */}
                {vp.desktop && (
                  <div style={{ position: "relative", marginLeft: "0.1rem" }} data-umenu>
                    <button
                      type="button"
                      onClick={() => { setUserMenuOpen(o => !o); setNotifOpen(false); }}
                      aria-expanded={userMenuOpen}
                      aria-haspopup="true"
                      aria-label="Account menu"
                      style={{
                        display: "flex", alignItems: "center", gap: "0.4rem",
                        padding: "0.28rem 0.5rem 0.28rem 0.28rem",
                        borderRadius: "var(--radius-sm)",
                        border: `1px solid ${userMenuOpen ? T.border : "transparent"}`,
                        background: userMenuOpen ? T.bgAlt : "transparent",
                        cursor: "pointer", fontFamily: "inherit", height: 34,
                        transition: "background 0.14s, border-color 0.14s",
                      }}
                      onMouseEnter={e => {
                        if (!userMenuOpen) {
                          e.currentTarget.style.background  = T.bgAlt;
                          e.currentTarget.style.borderColor = T.border;
                        }
                      }}
                      onMouseLeave={e => {
                        if (!userMenuOpen) {
                          e.currentTarget.style.background  = "transparent";
                          e.currentTarget.style.borderColor = "transparent";
                        }
                      }}
                    >
                      {avatar ? (
                        <img src={avatar} alt="Avatar" style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                      ) : (
                        <div style={{
                          width: 24, height: 24, borderRadius: "50%",
                          background: T.accent,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#fff", fontSize: "0.62rem", fontWeight: 800, flexShrink: 0,
                        }}>
                          {initials}
                        </div>
                      )}
                      <span style={{
                        maxWidth: "6rem", overflow: "hidden", textOverflow: "ellipsis",
                        whiteSpace: "nowrap", fontSize: "0.8rem", fontWeight: 500, color: T.text,
                      }}>
                        {name || email}
                      </span>
                      <IcoChevronDown color={T.textMuted} />
                    </button>

                    {/* User dropdown */}
                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -5, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -5, scale: 0.97 }}
                          transition={{ duration: 0.13, ease: "easeOut" }}
                          style={{
                            position: "absolute", top: "calc(100% + 7px)", right: 0,
                            minWidth: "13.5rem",
                            borderRadius: "var(--radius-lg)",
                            border: `1px solid ${T.border}`,
                            background: T.bgCard,
                            boxShadow: T.shadowLg,
                            zIndex: 300, overflow: "hidden",
                          }}
                        >
                          {/* Identity header */}
                          <div style={{ padding: "0.75rem 0.95rem", borderBottom: `1px solid ${T.border}` }}>
                            <div style={{
                              fontSize: "0.68rem", color: T.textMuted, fontWeight: 700,
                              textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.3rem",
                            }}>
                              Signed in as
                            </div>
                            <div style={{
                              fontSize: "0.85rem", fontWeight: 600, color: T.text,
                              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                            }}>
                              {name || email}
                            </div>
                            <span style={{
                              display: "inline-block", marginTop: "0.35rem",
                              fontSize: "0.62rem", fontWeight: 700, textTransform: "capitalize",
                              letterSpacing: "0.05em", color: T.accent,
                              background: T.accentPale, padding: "0.1rem 0.55rem",
                              borderRadius: "var(--radius-full)", border: `1px solid ${T.accent}30`,
                            }}>
                              {role}
                            </span>
                          </div>
                          {/* Actions */}
                          <div style={{ padding: "0.3rem" }}>
                            <DropItem T={T} onClick={() => { navigate(dashPath); setUserMenuOpen(false); }}>My Dashboard</DropItem>
                            <DropItem T={T} onClick={() => { navigate("/profile"); setUserMenuOpen(false); }}>My Profile</DropItem>
                            <DropItem T={T} onClick={() => { setShowFeedback(true); setUserMenuOpen(false); }}>Send Feedback</DropItem>
                          </div>
                          <div style={{ padding: "0.3rem", borderTop: `1px solid ${T.border}` }}>
                            <DropItem T={T} onClick={logout} danger>Sign out</DropItem>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </>
            ) : (
              /* Unauthenticated */
              <>
                {!vp.mobile && (
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    style={{
                      padding: "0.4rem 0.9rem", borderRadius: "var(--radius-sm)",
                      border: `1px solid ${T.border}`, background: "transparent",
                      color: T.textSub, fontSize: "0.8rem", fontWeight: 500,
                      cursor: "pointer", fontFamily: "inherit",
                      transition: "border-color 0.14s, color 0.14s, background 0.14s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHov; e.currentTarget.style.color = T.text; e.currentTarget.style.background = T.bgAlt; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSub; e.currentTarget.style.background = "transparent"; }}
                  >
                    Sign In
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  style={{
                    padding: "0.4rem 0.9rem", borderRadius: "var(--radius-sm)",
                    border: "none", background: T.accent,
                    color: "#fff", fontSize: "0.8rem", fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit",
                    transition: "background 0.14s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = T.accentDim}
                  onMouseLeave={e => e.currentTarget.style.background = T.accent}
                >
                  {vp.mobile ? "Join" : "Join Network"}
                </button>
              </>
            )}

            {/* Hamburger — mobile/tablet */}
            {!vp.desktop && (
              <button
                type="button"
                onClick={() => setMenuOpen(o => !o)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="mobile-drawer"
                style={{
                  width: 34, height: 34, borderRadius: "var(--radius-sm)",
                  border: `1px solid ${T.border}`,
                  background: menuOpen ? T.bgAlt : "transparent",
                  cursor: "pointer", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 4,
                  padding: 0, flexShrink: 0,
                  transition: "background 0.14s, border-color 0.14s",
                }}
              >
                {[0, 1, 2].map(i => (
                  <motion.span
                    key={i}
                    animate={
                      menuOpen
                        ? { rotate: i === 0 ? 45 : i === 2 ? -45 : 0, y: i === 0 ? 5 : i === 2 ? -5 : 0, opacity: i === 1 ? 0 : 1 }
                        : { rotate: 0, y: 0, opacity: 1 }
                    }
                    transition={{ duration: 0.18, ease: "easeInOut" }}
                    style={{ display: "block", width: 14, height: 1.5, background: T.textSub, borderRadius: 99, transformOrigin: "center" }}
                  />
                ))}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ════════════════════ MOBILE DRAWER ════════════════════ */}
      <AnimatePresence>
        {menuOpen && !vp.desktop && (
          <>
            {/* Backdrop dimmer */}
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: "fixed", inset: 0, top: navH,
                zIndex: 196, background: "rgba(0,0,0,0.45)",
                backdropFilter: "blur(3px)",
              }}
            />

            {/* Drawer panel */}
            <motion.div
              id="mobile-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "fixed", top: navH, left: 0, right: 0,
                zIndex: 197,
                background: T.bgNav,
                backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)",
                borderBottom: `1px solid ${T.border}`,
                boxShadow: T.shadowLg,
                maxHeight: `calc(100svh - ${navH}px)`,
                overflowY: "auto",
              }}
            >
              <div style={{ padding: "0.85rem clamp(1.25rem, 4vw, 2.5rem) 1.75rem" }}>

                {/* Emergency hero row — always prominent at top */}
                <Link
                  to="/rescue"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    padding: "0.9rem 1rem", borderRadius: "var(--radius-md)",
                    background: T.dangerPale, border: `1px solid ${T.dangerBorder}`,
                    textDecoration: "none", marginBottom: "1rem",
                  }}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: "var(--radius-sm)",
                    background: T.danger, display: "flex", alignItems: "center",
                    justifyContent: "center", flexShrink: 0,
                  }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff"
                      strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: T.danger, letterSpacing: "-0.01em" }}>
                      Request Emergency Rescue
                    </div>
                    <div style={{ fontSize: "0.7rem", color: T.textMuted, marginTop: 2 }}>
                      Report an animal in distress right now
                    </div>
                  </div>
                </Link>

                {/* Nav links */}
                <nav aria-label="Mobile navigation">
                  {ROUTE_LINKS.map(item => {
                    const active = item.to === "/"
                      ? location.pathname === "/"
                      : location.pathname.startsWith(item.to);
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === "/"}
                        onClick={() => setMenuOpen(false)}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "0.8rem 0",
                          borderBottom: `1px solid ${T.borderLight}`,
                          textDecoration: "none",
                          fontSize: "0.94rem", fontWeight: active ? 700 : 450,
                          color: active ? T.accent : T.text,
                        }}
                      >
                        {item.label}
                        <span style={{ color: T.textMuted, opacity: 0.55 }}><IcoArrowRight /></span>
                      </NavLink>
                    );
                  })}
                </nav>

                {/* Auth / user area */}
                <div style={{ marginTop: "1.1rem" }}>
                  {isAuthenticated ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                      {/* Account card */}
                      <div style={{
                        display: "flex", alignItems: "center", gap: "0.75rem",
                        padding: "0.85rem 1rem", borderRadius: "var(--radius-md)",
                        border: `1px solid ${T.border}`, background: T.bgAlt,
                        marginBottom: "0.25rem",
                      }}>
                        {avatar ? (
                          <img src={avatar} alt="Avatar" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                        ) : (
                          <div style={{
                            width: 36, height: 36, borderRadius: "50%",
                            background: T.accent, display: "flex", alignItems: "center",
                            justifyContent: "center", color: "#fff",
                            fontSize: "0.85rem", fontWeight: 800, flexShrink: 0,
                          }}>
                            {initials}
                          </div>
                        )}
                        <div style={{ minWidth: 0 }}>
                          <div style={{
                            fontSize: "0.88rem", fontWeight: 600, color: T.text,
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}>
                            {name || email}
                          </div>
                          <div style={{ fontSize: "0.7rem", color: T.textMuted, textTransform: "capitalize", marginTop: 2 }}>
                            {role}
                          </div>
                        </div>
                      </div>

                      {[
                        ["Go to Dashboard",  () => { setMenuOpen(false); navigate(dashPath); }],
                        ["My Profile",       () => { setMenuOpen(false); navigate("/profile"); }],
                        ["Send Feedback",    () => { setMenuOpen(false); setShowFeedback(true); }],
                      ].map(([label, fn]) => (
                        <button
                          key={label}
                          type="button"
                          onClick={fn}
                          style={{
                            width: "100%", padding: "0.72rem 1rem",
                            borderRadius: "var(--radius-md)",
                            border: `1px solid ${T.border}`, background: "transparent",
                            color: T.text, fontSize: "0.88rem", fontWeight: 500,
                            cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                            transition: "background 0.12s",
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = T.bgAlt}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          {label}
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={logout}
                        style={{
                          width: "100%", padding: "0.72rem 1rem",
                          borderRadius: "var(--radius-md)",
                          border: `1px solid ${T.dangerBorder}`, background: T.dangerPale,
                          color: T.danger, fontSize: "0.88rem", fontWeight: 700,
                          cursor: "pointer", fontFamily: "inherit", marginTop: "0.15rem",
                        }}
                      >
                        Sign out
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        type="button"
                        onClick={() => { setMenuOpen(false); navigate("/login"); }}
                        style={{
                          flex: 1, padding: "0.72rem", borderRadius: "var(--radius-md)",
                          border: `1px solid ${T.border}`, background: "transparent",
                          color: T.text, fontSize: "0.9rem", fontWeight: 600,
                          cursor: "pointer", fontFamily: "inherit",
                        }}
                      >
                        Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => { setMenuOpen(false); navigate("/register"); }}
                        style={{
                          flex: 1, padding: "0.72rem", borderRadius: "var(--radius-md)",
                          border: "none", background: T.accent,
                          color: "#fff", fontSize: "0.9rem", fontWeight: 700,
                          cursor: "pointer", fontFamily: "inherit",
                          transition: "background 0.14s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = T.accentDim}
                        onMouseLeave={e => e.currentTarget.style.background = T.accent}
                      >
                        Join Network
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Feedback modal */}
      <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />
    </>
  );
}
