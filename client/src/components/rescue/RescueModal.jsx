import { motion, AnimatePresence } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import Button from "../ui/Button";

export default function RescueModal({ open, onClose, rescueId, onViewTimeline }) {
  const { T } = useT();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem",
          }}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 16 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: T.bgCard,
              borderRadius: "var(--radius-xl)",
              border: `1px solid ${T.border}`,
              boxShadow: T.shadowDeep,
              padding: "2.5rem 2rem 2rem",
              maxWidth: 480,
              width: "100%",
              textAlign: "center",
            }}
          >
            {/* Animated checkmark */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: `${T.success}12`,
                border: `3px solid ${T.success}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={T.success} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </motion.div>

            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.25rem 0.75rem",
              borderRadius: "var(--radius-full)",
              background: `${T.success}10`,
              border: `1px solid ${T.success}30`,
              marginBottom: "0.75rem",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.success }} />
              <span style={{ fontSize: "0.65rem", fontWeight: 700, color: T.success, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Request Dispatched
              </span>
            </div>

            <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: T.textHeading, letterSpacing: "-0.03em", margin: "0 0 0.5rem", lineHeight: 1.2 }}>
              Help Is On The Way
            </h2>
            <p style={{ fontSize: "0.9rem", color: T.textSub, lineHeight: 1.7, marginBottom: "1.75rem" }}>
              Your emergency has been logged and dispatched to the nearest verified rescue partners. A volunteer will contact you shortly.
            </p>

            {/* Rescue ID Card */}
            <div
              style={{
                padding: "1rem 1.25rem",
                borderRadius: "var(--radius-lg)",
                background: T.bgAlt,
                border: `1px solid ${T.border}`,
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: T.textMuted, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Case ID
                </div>
                <button
                  onClick={() => navigator.clipboard?.writeText(rescueId || "RQ-2026-0847")}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: T.accent,
                    cursor: "pointer",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    padding: "0.2rem 0.5rem",
                    borderRadius: "var(--radius-sm)",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = T.accentPale}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  Copy
                </button>
              </div>
              <div style={{
                fontSize: "1.1rem",
                fontWeight: 800,
                color: T.text,
                fontFamily: "ui-monospace, monospace",
                letterSpacing: "0.02em",
              }}>
                {rescueId || "RQ-2026-0847"}
              </div>
            </div>

            {/* Status Timeline */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.65rem",
              marginBottom: "1.75rem",
              textAlign: "left",
              padding: "1rem",
              borderRadius: "var(--radius-lg)",
              background: T.bg,
              border: `1px solid ${T.borderLight}`,
            }}>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, color: T.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                Dispatch Status
              </div>
              {[
                { icon: "✓", text: "Emergency validated & logged", done: true, color: T.success },
                { icon: "✓", text: "NGO partners notified", done: true, color: T.success },
                { icon: "⏳", text: "Volunteer assignment in progress", done: false, color: T.warning },
                { icon: "○", text: "Rescue team en route", done: false, color: T.textMuted },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                  <span style={{
                    color: s.color,
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    width: 18,
                    textAlign: "center",
                    flexShrink: 0,
                  }}>
                    {s.icon}
                  </span>
                  <span style={{
                    fontSize: "0.82rem",
                    color: s.done ? T.text : T.textSub,
                    fontWeight: s.done ? 500 : 400,
                  }}>
                    {s.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Next Steps */}
            <div style={{
              padding: "0.85rem 1rem",
              borderRadius: "var(--radius-md)",
              background: `${T.info}08`,
              border: `1px solid ${T.info}20`,
              marginBottom: "1.5rem",
              textAlign: "left",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.info} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4M12 8h.01"/>
                </svg>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: T.info, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  What's Next
                </span>
              </div>
              <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.8rem", color: T.textSub, lineHeight: 1.7 }}>
                <li>Keep your phone accessible for volunteer contact</li>
                <li>Stay near the location if safe to do so</li>
                <li>Track progress via the rescue timeline</li>
              </ul>
            </div>

            <Button variant="primary" onClick={onViewTimeline ?? onClose} style={{ width: "100%", justifyContent: "center" }}>
              View Rescue Timeline
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
