import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import useViewport from "../../hooks/useViewport";
import Button from "../ui/Button";
import ThemeToggle from "../ui/ThemeToggle";
import logo from "../../assets/logos/logo-main.png";
import { ROUTE_LINKS } from "../../routes/routesConfig";
import { useNotification } from "../../context/NotificationContext";
import NotificationDropdown from "../notifications/NotificationDropdown";

export default function Navbar() {
  const { T } = useT();
  const { isAuthenticated, email, name, role, signOut } = useAuth();
  const vp = useViewport();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const { unreadCount } = useNotification();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname, location.hash]);

  // Close user menu when clicking outside
  useEffect(() => {
    if (!userMenuOpen) return;
    const fn = (e) => {
      if (!e.target.closest("[data-user-menu]")) setUserMenuOpen(false);
    };
    document.addEventListener("click", fn);
    return () => document.removeEventListener("click", fn);
  }, [userMenuOpen]);

  const handleLogout = () => {
    signOut();
    setUserMenuOpen(false);
    setMenuOpen(false);
    navigate("/", { replace: true });
  };

  const getDashboardLink = () => {
    const map = { user: "/dashboard/user", ngo: "/dashboard/ngo", volunteer: "/dashboard/volunteer", admin: "/dashboard/admin" };
    return map[role] || "/dashboard/user";
  };

  const navHeight = vp.mobile ? 56 : 64;

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 200,
          height: navHeight,
          background: scrolled ? T.bgNav : "transparent",
          backdropFilter: scrolled ? "blur(16px) saturate(1.2)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px) saturate(1.2)" : "none",
          borderBottom: scrolled ? `1px solid ${T.border}` : "1px solid transparent",
          transition: "background 0.3s ease, border-color 0.3s ease",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 clamp(1.25rem, 4vw, 3rem)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
            gap: "1rem",
          }}
        >
          {/* Logo */}
          <NavLink
            to="/"
            style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}
          >
            <img
              src={logo}
              alt="ResQNet"
              style={{
                height: vp.mobile ? 34 : 38,
                width: "auto",
                maxWidth: "11rem",
                objectFit: "contain",
                display: "block",
              }}
            />
          </NavLink>

          {/* Desktop nav links */}
          {vp.desktop && (
            <nav
              style={{
                display: "flex",
                gap: "clamp(1.75rem, 2.5vw, 2.5rem)",
                alignItems: "center",
                flex: "1 1 auto",
                marginLeft: "clamp(2rem, 4vw, 3.5rem)",
              }}
            >
              {ROUTE_LINKS.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.to === "/" || item.to.startsWith("/#")}
                  style={({ isActive }) => ({
                    fontSize: "0.8125rem",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? T.accent : T.textSub,
                    textDecoration: "none",
                    transition: "color 0.18s ease",
                    letterSpacing: "-0.01em",
                    position: "relative",
                    paddingBottom: "4px",
                  })}
                  onMouseEnter={(e) => { if (!e.currentTarget.classList.contains("active")) e.currentTarget.style.color = T.text; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = ""; }}
                >
                  {item.label}
                  {/* Active dot indicator */}
                </NavLink>
              ))}
            </nav>
          )}

          {/* Spacer on non-desktop */}
          {!vp.desktop && <div style={{ flex: 1 }} />}

          {/* Controls */}
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexShrink: 0 }}>
            <ThemeToggle />

            {isAuthenticated ? (
              <>
                {vp.desktop && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(getDashboardLink())}
                    >
                      Dashboard
                    </Button>

                    {/* Notification Bell */}
                    <div style={{ position: "relative" }}>
                      <button
                        onClick={() => {
                          setNotifOpen((o) => !o);
                          setUserMenuOpen(false);
                        }}
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          border: `1px solid ${T.border}`,
                          background: T.bgCard,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          color: T.text,
                          transition: "border-color 0.18s",
                          position: "relative",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = T.borderHov || T.accent}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = T.border}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                        {unreadCount > 0 && (
                          <span
                            style={{
                              position: "absolute",
                              top: -2,
                              right: -2,
                              background: T.accent,
                              color: "#fff",
                              fontSize: "0.6rem",
                              fontWeight: 700,
                              minWidth: 16,
                              height: 16,
                              borderRadius: 8,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "0 4px",
                            }}
                          >
                            {unreadCount}
                          </span>
                        )}
                      </button>
                      <NotificationDropdown isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
                    </div>

                    {/* User avatar menu */}
                    <div style={{ position: "relative" }} data-user-menu>
                      <button
                        onClick={() => {
                          setUserMenuOpen((o) => !o);
                          setNotifOpen(false);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.45rem",
                          padding: "0.35rem 0.6rem",
                          borderRadius: 8,
                          border: `1px solid ${T.border}`,
                          background: T.bgCard,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          fontSize: "0.8rem",
                          color: T.text,
                          transition: "border-color 0.18s",
                          height: 34,
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = T.borderHov || T.accent}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = T.border}
                      >
                        <div
                          style={{
                            width: 22, height: 22, borderRadius: "50%",
                            background: T.gradAccent || T.accent,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontSize: "0.65rem", fontWeight: 700, flexShrink: 0,
                          }}
                        >
                          {name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <span style={{ maxWidth: "7rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "0.78rem", fontWeight: 500 }}>
                          {name || email}
                        </span>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 3.5L5 6.5 8 3.5" stroke={T.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>

                      <AnimatePresence>
                        {userMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -4, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.98 }}
                            transition={{ duration: 0.12, ease: "easeOut" }}
                            style={{
                              position: "absolute",
                              top: "calc(100% + 6px)", right: 0,
                              minWidth: "12rem",
                              borderRadius: 12,
                              border: `1px solid ${T.border}`,
                              background: T.bgCard,
                              boxShadow: T.shadowLg,
                              zIndex: 300,
                              overflow: "hidden",
                            }}
                          >
                            {/* Header */}
                            <div style={{ padding: "0.75rem 0.875rem", borderBottom: `1px solid ${T.border}` }}>
                              <div style={{ fontSize: "0.65rem", fontWeight: 700, color: T.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                                Account
                              </div>
                              <div style={{ fontSize: "0.82rem", fontWeight: 600, color: T.text }}>{name || email}</div>
                              <div style={{ fontSize: "0.68rem", color: T.textMuted, marginTop: "0.1rem", textTransform: "capitalize" }}>{role}</div>
                            </div>
                            {/* Actions */}
                            <div style={{ padding: "0.3rem" }}>
                              <button
                                onClick={() => { navigate(getDashboardLink()); setUserMenuOpen(false); }}
                                style={{
                                  width: "100%", padding: "0.5rem 0.65rem", borderRadius: 6,
                                  border: "none", background: "transparent",
                                  color: T.textSub, fontSize: "0.8rem", fontWeight: 500,
                                  cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                                  transition: "background 0.12s",
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = T.bgAlt}
                                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                              >
                                My Dashboard
                              </button>
                              <button
                                onClick={handleLogout}
                                style={{
                                  width: "100%", padding: "0.5rem 0.65rem", borderRadius: 6,
                                  border: "none", background: "transparent",
                                  color: T.danger || "#DC2626", fontSize: "0.8rem", fontWeight: 600,
                                  cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                                  transition: "background 0.12s",
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = T.dangerPale || "rgba(220,38,38,0.06)"}
                                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                              >
                                Sign out
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                {!vp.mobile && (
                  <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                    Sign In
                  </Button>
                )}
                <Button variant="primary" size="sm" onClick={() => navigate("/register")}>
                  {vp.mobile ? "Join" : "Join Network"}
                </Button>
              </>
            )}

            {/* Mobile hamburger */}
            {!vp.desktop && (
              <button
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Toggle menu"
                style={{
                  width: 36, height: 36, borderRadius: 8,
                  border: `1px solid ${T.border}`,
                  background: T.bgCard,
                  cursor: "pointer",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 4.5,
                  padding: 0, flexShrink: 0,
                  transition: "border-color 0.18s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = T.borderHov || T.accent}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = T.border}
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={
                      menuOpen
                        ? { rotate: i === 0 ? 45 : i === 2 ? -45 : 0, y: i === 0 ? 6 : i === 2 ? -6 : 0, opacity: i === 1 ? 0 : 1 }
                        : { rotate: 0, y: 0, opacity: 1 }
                    }
                    transition={{ duration: 0.18 }}
                    style={{
                      display: "block", width: 15, height: 1.5,
                      background: T.textSub, borderRadius: 2, transformOrigin: "center",
                    }}
                  />
                ))}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && !vp.desktop && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              position: "fixed",
              top: navHeight, left: 0, right: 0,
              zIndex: 199,
              background: T.bgNav,
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderBottom: `1px solid ${T.border}`,
              padding: "0.75rem clamp(1.25rem, 4vw, 3rem) 1.25rem",
              boxShadow: T.shadowLg,
            }}
          >
            {/* Nav links */}
            <nav style={{ display: "flex", flexDirection: "column" }}>
              {ROUTE_LINKS.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.to === "/" || item.to.startsWith("/#")}
                  onClick={() => setMenuOpen(false)}
                  style={({ isActive }) => ({
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    fontSize: "0.9rem", fontWeight: isActive ? 600 : 500,
                    color: isActive ? T.accent : T.text,
                    textDecoration: "none",
                    padding: "0.75rem 0",
                    borderBottom: `1px solid ${T.borderLight || T.border}`,
                  })}
                >
                  {item.label}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M4 2l4 4-4 4" stroke={T.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </NavLink>
              ))}
            </nav>

            {/* Auth actions */}
            <div style={{ paddingTop: "0.875rem" }}>
              {isAuthenticated ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <div style={{ padding: "0.5rem 0", borderBottom: `1px solid ${T.borderLight || T.border}`, marginBottom: "0.4rem" }}>
                    <div style={{ fontSize: "0.65rem", color: T.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Account</div>
                    <div style={{ fontSize: "0.85rem", color: T.text, fontWeight: 600, marginTop: "0.25rem" }}>{name || email}</div>
                    <div style={{ fontSize: "0.68rem", color: T.textMuted, marginTop: "0.1rem", textTransform: "capitalize" }}>{role}</div>
                  </div>
                  <button
                    onClick={() => { setMenuOpen(false); navigate(getDashboardLink()); }}
                    style={{
                      width: "100%", padding: "0.65rem 0.875rem", borderRadius: 8,
                      border: `1px solid ${T.border}`, background: T.bgCard,
                      color: T.text, fontSize: "0.85rem", fontWeight: 600,
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%", padding: "0.65rem 0.875rem", borderRadius: 8,
                      border: "none", background: T.dangerPale || "rgba(220,38,38,0.06)",
                      color: T.danger || "#DC2626", fontSize: "0.85rem", fontWeight: 600,
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => { setMenuOpen(false); navigate("/login"); }}
                    style={{
                      flex: 1, padding: "0.65rem", borderRadius: 8,
                      border: `1px solid ${T.border}`, background: "transparent",
                      color: T.text, fontSize: "0.85rem", fontWeight: 600,
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); navigate("/register"); }}
                    style={{
                      flex: 1, padding: "0.65rem", borderRadius: 8,
                      border: "none", background: T.accent,
                      color: "#fff", fontSize: "0.85rem", fontWeight: 700,
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    Join Network
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
