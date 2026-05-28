import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import Button from "../ui/Button";

export default function FeedbackModal({ onClose }) {
  const { T } = useT();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.fullName || user?.name || "",
    email: user?.email || "",
    type: "suggestion",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await api.post("/feedback", formData);
      if (res.data.success) {
        setSuccess(true);
        setTimeout(onClose, 2500);
      } else {
        setError(res.data.message || "Failed to submit feedback.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while submitting feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center",
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
            maxWidth: 500,
            boxShadow: T.shadowLg,
            border: `1px solid ${T.border}`,
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Header */}
          <div style={{ padding: "1.5rem", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: T.bgAlt }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: T.accentPale, display: "flex", alignItems: "center", justifyContent: "center", color: T.accent }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              </div>
              <div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: T.textHeading }}>Send Feedback</h2>
                <span style={{ fontSize: "0.75rem", color: T.textMuted }}>Help us improve ResQNet</span>
              </div>
            </div>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", background: T.bgCard, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.text }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div style={{ padding: "1.5rem" }}>
            {success ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", padding: "2rem 0" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${T.success}20`, color: T.success, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem auto" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: T.textHeading, marginBottom: "0.5rem" }}>Thank you!</h3>
                <p style={{ fontSize: "0.9rem", color: T.textSub, lineHeight: 1.5 }}>Your feedback has been submitted successfully and will help us improve the platform.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {!user && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 600, color: T.text, marginBottom: 4, display: "block" }}>Name</label>
                      <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="rq-input" style={{ width: "100%" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 600, color: T.text, marginBottom: 4, display: "block" }}>Email</label>
                      <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="rq-input" style={{ width: "100%" }} />
                    </div>
                  </div>
                )}
                
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600, color: T.text, marginBottom: 4, display: "block" }}>Feedback Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="rq-input" style={{ width: "100%", padding: "0.6rem" }}>
                    <option value="suggestion">Suggestion / Idea</option>
                    <option value="bug">Bug Report / Issue</option>
                    <option value="praise">Compliment</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600, color: T.text, marginBottom: 4, display: "block" }}>Message</label>
                  <textarea 
                    required 
                    rows={4} 
                    value={formData.message} 
                    onChange={e => setFormData({...formData, message: e.target.value})} 
                    placeholder="Tell us what's on your mind..."
                    className="rq-textarea" 
                    style={{ width: "100%" }} 
                  />
                </div>

                {error && <div style={{ fontSize: "0.8rem", color: T.danger, background: `${T.danger}15`, padding: "0.6rem", borderRadius: 8 }}>{error}</div>}

                <div style={{ display: "flex", gap: "0.8rem", marginTop: "0.5rem" }}>
                  <Button variant="primary" style={{ flex: 1 }} disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Feedback"}
                  </Button>
                  <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
