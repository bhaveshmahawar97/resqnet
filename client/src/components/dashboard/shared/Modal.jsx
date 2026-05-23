import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "../../../context/ThemeContext";

// ─── MODAL ────────────────────────────────────────────────────────────────────
export function DashboardModal({ isOpen, title, onClose, children, width = 480 }) {
  const { T } = useT();
  useEffect(() => {
    if (!isOpen) return;
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="rq-modal-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="rq-modal"
            style={{ 
              width: `min(${width}px, calc(100vw - 32px))`,
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="rq-modal-header" style={{ flexShrink: 0 }}>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: T.textHeading || T.text, letterSpacing: "-0.025em" }}>{title}</div>
              <button
                onClick={onClose}
                style={{
                  width: 28, height: 28, borderRadius: 8,
                  border: `1px solid ${T.border}`, background: T.bgAlt,
                  cursor: "pointer", color: T.textMuted,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.85rem", transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = T.dangerPale || "rgba(220,38,38,0.07)"; e.currentTarget.style.color = T.danger || "#DC2626"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = T.bgAlt; e.currentTarget.style.color = T.textMuted; }}
              >
                ✕
              </button>
            </div>
            <div className="rq-modal-body" style={{ overflowY: "auto", flex: 1, paddingBottom: 20 }}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

