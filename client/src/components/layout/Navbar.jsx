import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import Button from "../ui/Button";
import ThemeToggle from "../ui/ThemeToggle";
import logo from "../../assets/logos/logo-main.png";



export default function Navbar() {
  const { T, mode } = useT();
  const vp = useViewport();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (vp.desktop) setMenuOpen(false);
  }, [vp.desktop]);

  const links = ["Mission", "For NGOs", "Adopt", "AI Health", "Emergency"];

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
        {/* Full-width inner — padded, but no max-width clamp on the bar itself */}
        <div
          style={{
            width: "100%",
            maxWidth: "100vw",
            padding: "0 clamp(1.25rem, 4vw, 3.5rem)",
            display: "flex",
            alignItems: "center",
            height: vp.mobile ? 58 : 68,
          }}
        >
        
        {/* Logo */}
        <div
  style={{
    display: "flex",
    alignItems: "center",
    minWidth: "170px",
  }}
>
  <img
    src={logo}
    alt="ResQNet"
    style={{
      height: vp.mobile ? "52px" : "120px",
      width: "auto",
      objectFit: "contain",
      display: "block",
    }}
  />
</div>

        {/* Desktop nav */}
          {vp.desktop && (
            <nav
              style={{
                display: "flex",
                gap: "clamp(1.4rem, 2.5vw, 2.5rem)",
                alignItems: "center",
                marginLeft: "clamp(2rem, 5vw, 5rem)",
                flex: 1,
              }}
            >
              {links.map((l) => (
                <a
                  key={l}
                  href={`#${l.toLowerCase().replace(/ /g, "-")}`}
                  style={{
                    fontSize: "0.86rem",
                    fontWeight: 500,
                    color: T.textSub,
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = T.accent)}
                  onMouseLeave={(e) => (e.target.style.color = T.textSub)}
                >
                  {l}
                </a>
              ))}
            </nav>
          )}

          {/* Spacer */}
          {!vp.desktop && <div style={{ flex: 1 }} />}

          {/* Controls */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              marginLeft: vp.desktop ? "auto" : 0,
            }}
          >
            <ThemeToggle />
            {!vp.mobile && <Button variant="ghost" size="sm">Sign In</Button>}
            <Button variant="primary" size="sm">
              {vp.mobile ? "Join" : "Join Network"}
            </Button>
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
            }}
          >
            {links.map((l, i) => (
              <motion.a
                key={l}
                href={`#${l.toLowerCase().replace(/ /g, "-")}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  color: T.text,
                  textDecoration: "none",
                  padding: "0.85rem 0",
                  borderBottom: `1px solid ${T.border}`,
                }}
              >
                {l}
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
              </motion.a>
            ))}
            <div style={{ paddingTop: "1.1rem", display: "flex", gap: "0.6rem" }}>
              <button
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

