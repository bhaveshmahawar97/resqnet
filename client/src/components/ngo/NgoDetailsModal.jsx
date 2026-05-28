import { motion, AnimatePresence } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import Button from "../ui/Button";

export default function NgoDetailsModal({ ngo, onClose }) {
  const { T } = useT();
  if (!ngo) return null;

  const name = ngo.organizationName || ngo.name || "Unknown NGO";
  const city = ngo.city || ngo.location || "India";
  const address = ngo.address || "Address not provided";
  const phone = ngo.phone || "+91 00000 00000";
  const email = ngo.email || "contact@ngo.org";
  const type = (ngo.specialties || ["Partner"])[0];
  const specialties = ngo.specialties?.join(", ") || "General Rescue Support";
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: T.bgCard,
            borderRadius: 20,
            width: "100%",
            maxWidth: 550,
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: T.shadowLg,
            border: `1px solid ${T.border}`,
            position: "relative",
          }}
        >
          {/* Header Image Area */}
          <div style={{ height: 120, background: T.accentPale, borderTopLeftRadius: 20, borderTopRightRadius: 20, position: "relative" }}>
            <button
              onClick={onClose}
              style={{
                position: "absolute", top: 16, right: 16,
                width: 32, height: 32, borderRadius: "50%",
                background: T.bgCard, border: `1px solid ${T.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: T.text,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <div style={{
              position: "absolute", bottom: -32, left: 24,
              width: 80, height: 80, borderRadius: 16,
              background: T.bgCard, border: `4px solid ${T.bgCard}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: T.shadowSm
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
          </div>

          <div style={{ padding: "3rem 1.5rem 1.5rem 1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <div>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: T.textHeading, margin: "0 0 0.25rem 0", letterSpacing: "-0.02em" }}>{name}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.85rem", color: T.textSub }}>{city}</span>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.border }} />
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: T.accent, background: T.accentPale, padding: "0.15rem 0.6rem", borderRadius: 12 }}>{type}</span>
                </div>
              </div>
              {ngo.verified && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", background: `${T.success}15`, padding: "0.3rem 0.6rem", borderRadius: 12 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
                  <span style={{ fontSize: "0.7rem", color: T.success, fontWeight: 700 }}>Verified</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p style={{ fontSize: "0.9rem", color: T.text, lineHeight: 1.6, marginBottom: "1.5rem" }}>
              {ngo.description || "An organization dedicated to rescuing and rehabilitating animals in need. Reach out to them directly for assistance or to learn more about their mission."}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ padding: "1rem", borderRadius: 12, border: `1px solid ${T.border}`, background: T.bgAlt }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, color: T.textMuted, textTransform: "uppercase", marginBottom: "0.25rem" }}>Specialties</div>
                <div style={{ fontSize: "0.85rem", color: T.text, fontWeight: 500 }}>{specialties}</div>
              </div>
              <div style={{ padding: "1rem", borderRadius: 12, border: `1px solid ${T.border}`, background: T.bgAlt }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, color: T.textMuted, textTransform: "uppercase", marginBottom: "0.25rem" }}>Avg Response</div>
                <div style={{ fontSize: "0.85rem", color: T.text, fontWeight: 500 }}>{ngo.responseTime || "~20 minutes"}</div>
              </div>
            </div>

            {/* Contact Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: T.textHeading, margin: "0 0 0.25rem 0" }}>Contact Information</h3>
              
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: T.bgAlt, display: "flex", alignItems: "center", justifyContent: "center", color: T.textSub }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: T.textMuted }}>Phone</div>
                  <a href={`tel:${phone}`} style={{ fontSize: "0.9rem", color: T.text, textDecoration: "none", fontWeight: 500 }}>{phone}</a>
                </div>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: T.bgAlt, display: "flex", alignItems: "center", justifyContent: "center", color: T.textSub }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: T.textMuted }}>Email</div>
                  <a href={`mailto:${email}`} style={{ fontSize: "0.9rem", color: T.text, textDecoration: "none", fontWeight: 500 }}>{email}</a>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: T.bgAlt, display: "flex", alignItems: "center", justifyContent: "center", color: T.textSub }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: T.textMuted }}>Address</div>
                  <div style={{ fontSize: "0.9rem", color: T.text, fontWeight: 500 }}>{address}</div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <Button variant="primary" style={{ flex: 1 }} onClick={() => window.location.href = `tel:${phone}`}>
                Call Now
              </Button>
              <Button variant="ghost" style={{ flex: 1 }} onClick={() => window.location.href = `mailto:${email}`}>
                Email NGO
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
