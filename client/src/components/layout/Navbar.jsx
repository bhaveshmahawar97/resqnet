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

const MotionLink = motion.create ? motion.create(NavLink) : motion(NavLink);

export default function Navbar() {
  const { T, mode } = useT();
  const { isAuthenticated, email, name, role, signOut } = useAuth();
  const vp = useViewport();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      setMenuOpen(false);
    }
  }, [location.pathname, location.hash]);

  const handleLogout = () => {
    signOut();
    setUserMenuOpen(false);
    setMenuOpen(false);
    navigate("/", { replace: true });
  };

  const getDashboardLink = () => {
    const dashboardMap = {
      user: "/dashboard/user",
      ngo: "/dashboard/ngo",
      volunteer: "/dashboard/volunteer",
      admin: "/dashboard/admin",
    };
    return dashboardMap[role] || "/dashboard/user";
  };

  return (
    <>
      <motion.header
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          background: scrolled ? T.bgNav : "transparent",
          backdropFilter: scrolled ? "blur(22px) saturate(1.4)" : "none",
          borderBottom: scrolled ? `1px solid ${T.border}` : "none",
          transition: "background 0.4s, border-color 0.4s, backdrop-filter 0.4s",
        }}
      >
        {/* Full-width inner — padded */}
        <div
          style={{
            width: "100%",
            padding: "0 clamp(1.25rem, 4vw, 3.5rem)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "clamp(0.75rem, 2vw, 1.25rem)",
            flexWrap: "wrap",
            minHeight: vp.mobile ? 58 : 68,
            boxSizing: "border-box",
          }}
        >
        
          {/* Logo */}
          <NavLink
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              minWidth: 0,
              maxWidth: "15rem",
              textDecoration: "none",
            }}
          >
            <img
              src={logo}
              alt="ResQNet"
              style={{
                height: vp.mobile ? 42 : 48,
                width: "auto",
                maxWidth: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
          </NavLink>

          {/* Desktop nav */}
          {vp.desktop && (
            <nav
              style={{
                display: "flex",
                gap: "clamp(1.4rem, 2.5vw, 2.5rem)",
                alignItems: "center",
                marginLeft: "clamp(2rem, 5vw, 5rem)",
                flex: "1 1 auto",
                minWidth: 0,
              }}
            >
              {ROUTE_LINKS.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.to === "/" || item.to.startsWith("/#")}
                  style={({ isActive }) => ({
                    fontSize: "0.86rem",
                    fontWeight: 500,
                    color: isActive ? T.accent : T.textSub,
                    textDecoration: "none",
                    transition: "color 0.2s",
                  })}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          )}

          {/* Spacer */}
          {!vp.desktop && <div style={{ flex: 1, minWidth: 0 }} />}

          {/* Controls */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              flexWrap: "wrap",
              marginLeft: vp.desktop ? "auto" : 0,
              minWidth: 0,
            }}
          >
            <ThemeToggle />
            
            {/* Authenticated User Menu */}
            {isAuthenticated ? (
              <>
                {/* Desktop: Dashboard link + User menu */}
                {vp.desktop && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(getDashboardLink())}
                    >
                      Dashboard
                    </Button>
                    <div style={{ position: "relative" }}>
                      <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.5rem 0.75rem",
                          borderRadius: 8,
                          border: `1px solid ${T.border}`,
                          background: T.bgCard,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          fontSize: "0.85rem",
                          color: T.text,
                          transition: "all 0.2s",
                        }}
                      >
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            background: T.accent,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                          }}
                        >
                          {name?.[0]?.toUpperCase() || "U"}
                        </div>
                        {!vp.mobile && <span style={{ maxWidth: "8rem", overflow: "hidden", textOverflow: "ellipsis", fontSize: "0.8rem" }}>{name || email}</span>}
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <AnimatePresence>
                        {userMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.15 }}
                            style={{
                              position: "absolute",
                              top: "calc(100% + 0.5rem)",
                              right: 0,
                              minWidth: "12rem",
                              borderRadius: 10,
                              border: `1px solid ${T.border}`,
                              background: T.bgCard,
                              boxShadow: `0 8px 24px rgba(0,0,0,0.12)`,
                              zIndex: 300,
                              overflow: "hidden",
                            }}
                          >
                            <div style={{ padding: "0.75rem" }}>
                              <div style={{ padding: "0.65rem 0.75rem", borderBottom: `1px solid ${T.border}`, marginBottom: "0.5rem" }}>
                                <div style={{ fontSize: "0.75rem", color: T.textMuted, fontWeight: 600 }}>ACCOUNT</div>
                                <div style={{ fontSize: "0.9rem", color: T.text, fontWeight: 600, marginTop: "0.3rem" }}>{name || email}</div>
                                <div style={{ fontSize: "0.7rem", color: T.textMuted, marginTop: "0.15rem", textTransform: "capitalize" }}>{role}</div>
                              </div>
                              <button
                                onClick={handleLogout}
                                style={{
                                  width: "100%",
                                  padding: "0.65rem 0.75rem",
                                  borderRadius: 8,
                                  border: "none",
                                  background: "transparent",
                                  color: "#DC2626",
                                  fontSize: "0.85rem",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  fontFamily: "inherit",
                                  textAlign: "left",
                                  transition: "background 0.2s",
                                }}
                                onMouseEnter={(e) => e.target.style.background = "rgba(220,38,38,0.08)"}
                                onMouseLeave={(e) => e.target.style.background = "transparent"}
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
                
                {/* Mobile: Hamburger menu will include dashboard and logout */}
              </>
            ) : (
              <>
                {/* Unauthenticated: Sign In and Join buttons */}
                {!vp.mobile && <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>Sign In</Button>}
                <Button variant="primary" size="sm" onClick={() => navigate("/register")}>{vp.mobile ? "Join" : "Join Network"}</Button>
              </>
            )}

            {/* Mobile menu toggle */}
            {!vp.desktop && (
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => setMenuOpen((o) => !o)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  border: `1px solid ${T.border}`,
                  background: T.bgCard,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4.5px",
                  padding: 0,
                  flexShrink: 0,
                }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={
                      menuOpen
                        ? {
                            rotate: i === 0 ? 45 : i === 2 ? -45 : 0,
                            y: i === 0 ? 5.5 : i === 2 ? -5.5 : 0,
                            opacity: i === 1 ? 0 : 1,
                          }
                        : { rotate: 0, y: 0, opacity: 1 }
                    }
                    style={{
                      display: "block",
                      width: 17,
                      height: 1.5,
                      background: T.textSub,
                      borderRadius: 2,
                      transformOrigin: "center",
                    }}
                  />
                ))}
              </motion.button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Mobile menu — full width slide */}
      <AnimatePresence>
        {menuOpen && !vp.desktop && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position: "fixed",
              top: vp.mobile ? 58 : 68,
              left: 0,
              right: 0,
              zIndex: 199,
              background:
                mode === "light"
                  ? "rgba(242,245,242,0.97)"
                  : "rgba(8,15,24,0.97)",
              backdropFilter: "blur(24px)",
              borderBottom: `1px solid ${T.border}`,
              padding: "1.25rem clamp(1.25rem, 4vw, 3.5rem) 1.5rem",
              boxSizing: "border-box",
            }}
          >
            {ROUTE_LINKS.map((item, i) => (
              <MotionLink
                key={item.label}
                to={item.to}
                end={item.to === "/" || item.to.startsWith("/#")}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setMenuOpen(false)}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  color: isActive ? T.accent : T.text,
                  textDecoration: "none",
                  padding: "0.85rem 0",
                  borderBottom: `1px solid ${T.border}`,
                })}
              >
                {item.label}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={T.textMuted}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </MotionLink>
            ))}
            
            <div style={{ paddingTop: "1.1rem" }}>
              {isAuthenticated ? (
                <>
                  <div style={{ padding: "0.75rem 0", borderBottom: `1px solid ${T.border}`, marginBottom: "0.75rem" }}>
                    <div style={{ fontSize: "0.75rem", color: T.textMuted, fontWeight: 600 }}>ACCOUNT</div>
                    <div style={{ fontSize: "0.9rem", color: T.text, fontWeight: 600, marginTop: "0.3rem" }}>{name || email}</div>
                    <div style={{ fontSize: "0.7rem", color: T.textMuted, marginTop: "0.15rem", textTransform: "capitalize" }}>{role}</div>
                  </div>
                  <div style={{ display: "flex", gap: "0.6rem", flexDirection: "column" }}>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate(getDashboardLink());
                      }}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: 10,
                        border: `1px solid ${T.border}`,
                        background: T.bgCard,
                        color: T.text,
                        fontSize: "0.92rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Go to Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: 10,
                        border: "none",
                        background: "rgba(220,38,38,0.1)",
                        color: "#DC2626",
                        fontSize: "0.92rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", gap: "0.6rem" }}>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/login");
                    }}
                    style={{
                      flex: 1,
                      padding: "0.75rem",
                      borderRadius: 10,
                      border: `1px solid ${T.border}`,
                      background: "transparent",
                      color: T.text,
                      fontSize: "0.92rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/register");
                    }}
                    style={{
                      flex: 1,
                      padding: "0.75rem",
                      borderRadius: 10,
                      border: "none",
                      background: T.accent,
                      color: "#fff",
                      fontSize: "0.92rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "inherit",
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

