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
          className="rq-modal-overlay"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 16 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="rq-modal"
            style={{
              padding: "2.5rem 2rem",
              maxWidth: 440,
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
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "rgba(34,197,94,0.12)",
                border: "2px solid rgba(34,197,94,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                margin: "0 auto 1.5rem",
              }}
            >
              ✅
            </motion.div>

            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#22C55E", letterSpacing: "0.12em", marginBottom: "0.5rem" }}>
              RESCUE REQUEST CONFIRMED
            </div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 900, color: T.text, letterSpacing: "-0.03em", margin: "0 0 0.75rem" }}>
              Help Is On The Way
            </h2>
            <p style={{ fontSize: "0.88rem", color: T.textSub, lineHeight: 1.75, marginBottom: "1.5rem" }}>
              Your emergency rescue request has been received and dispatched to the nearest available NGO. A rescue volunteer will reach you shortly.
            </p>

            {/* Rescue ID */}
            <div
              style={{
                padding: "0.75rem 1rem",
                borderRadius: 10,
                background: T.bgAlt,
                border: `1px solid ${T.border}`,
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: T.textMuted, letterSpacing: "0.1em", marginBottom: 3 }}>RESCUE ID</div>
                <div style={{ fontSize: "0.95rem", fontWeight: 800, color: T.text, fontFamily: "ui-monospace, monospace" }}>
                  {rescueId || "#RQ-2026-0847"}
                </div>
              </div>
              <div style={{ fontSize: "1.2rem" }}>📋</div>
            </div>

            {/* Status steps */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.75rem", textAlign: "left" }}>
              {[
                { icon: "✓", text: "Request logged & triage complete", done: true },
                { icon: "✓", text: "NGO notified — Animal Aid Unlimited", done: true },
                { icon: "⏳", text: "Volunteer en route — ETA ~8 minutes", done: false },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ color: s.done ? "#22C55E" : T.accent, fontWeight: 700, fontSize: "0.85rem", width: 16, textAlign: "center" }}>{s.icon}</span>
                  <span style={{ fontSize: "0.82rem", color: s.done ? T.text : T.textSub }}>{s.text}</span>
                </div>
              ))}
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
