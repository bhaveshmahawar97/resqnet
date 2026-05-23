import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import Label from "../ui/Label";
import Button from "../ui/Button";
import { vFadeUp } from "../../animations/variants";

const STEPS = [
  { id: 0, icon: "📋", label: "Request Submitted", desc: "Emergency rescue request received by ResQNet AI dispatcher.", time: "00:00", detail: "Your request has been logged with a unique Rescue ID. AI is analyzing the case details." },
  { id: 1, icon: "🤖", label: "AI Analysis Completed", desc: "Injury severity assessed. Rescue priority classified as HIGH.", time: "00:42", detail: "Computer vision model identified species, estimated injury severity score of 78/100, and classified the case as High Priority." },
  { id: 2, icon: "🏥", label: "NGO Assigned", desc: "Animal Aid Unlimited dispatched. ETA: 8 minutes.", time: "01:15", detail: "Closest available NGO has been notified and accepted the case. Rescue team is preparing equipment." },
  { id: 3, icon: "🚑", label: "Volunteer Dispatched", desc: "2 field volunteers en route. Live tracking active.", time: "01:30", detail: "Rescue volunteers Rahul Sharma and Priya Mehta are en route with medical kit. GPS tracking enabled." },
  { id: 4, icon: "🐾", label: "Animal Reached Care Center", desc: "Animal safely transported. Initial treatment started.", time: "01:58", detail: "Animal received at the clinic. Wound cleaned, pain management administered, X-ray scheduled." },
  { id: 5, icon: "💚", label: "Recovery In Progress", desc: "Animal stable. Post-care monitoring underway.", time: "04:30", detail: "Animal is eating and responding well. Expected recovery time: 10-14 days. Adoption listing pending." },
];

export default function RescueTimeline() {
  const { T } = useT();
  const vp = useViewport();
  const [activeStep, setActiveStep] = useState(2);
  const [simulating, setSimulating] = useState(false);

  const handleSimulate = () => {
    if (simulating) return;
    setSimulating(true);
    setActiveStep(0);
    let i = 1;
    const interval = setInterval(() => {
      setActiveStep(i);
      i++;
      if (i > STEPS.length - 1) {
        clearInterval(interval);
        setSimulating(false);
      }
    }, 900);
  };

  return (
    <section id="rescue-timeline" style={{ width: "100%", padding: "clamp(3.5rem, 8vw, 6rem) 0", background: T.bg }}>
      <div style={{ width: "100%", maxWidth: "1240px", margin: "0 auto", padding: "0 clamp(1.25rem, 4vw, 3.5rem)" }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={vFadeUp} style={{ textAlign: "center", marginBottom: "clamp(2rem, 5vw, 3.5rem)" }}>
          <Label>Live Workflow</Label>
          <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.035em", color: T.text, margin: "0 0 0.75rem" }}>
            Rescue Timeline
          </h2>
          <p style={{ color: T.textSub, fontSize: "clamp(0.88rem, 2vw, 1rem)", maxWidth: 520, margin: "0 auto 1.5rem", lineHeight: 1.7 }}>
            Every rescue follows a structured, AI-monitored workflow from the first report to full recovery.
          </p>
          <Button
            variant={simulating ? "ghost" : "primary"}
            onClick={handleSimulate}
            style={{ opacity: simulating ? 0.6 : 1 }}
          >
            {simulating ? "⏳ Simulating…" : "▶ Simulate Rescue Progress"}
          </Button>
        </motion.div>

        {/* Timeline + detail layout */}
        <div style={{ display: "grid", gridTemplateColumns: vp.mobile ? "1fr" : "1fr 1.2fr", gap: "2.5rem", alignItems: "start" }}>
          {/* Timeline */}
          <div style={{ position: "relative" }}>
            {/* Vertical line */}
            <div style={{ position: "absolute", left: 19, top: 24, bottom: 24, width: 2, background: T.border, zIndex: 0 }} />

            {/* Progress line */}
            <motion.div
              style={{ position: "absolute", left: 19, top: 24, width: 2, zIndex: 1, background: `linear-gradient(to bottom, ${T.accent}, ${T.accentDim})`, transformOrigin: "top" }}
              animate={{ height: `${(activeStep / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {STEPS.map((step, i) => {
                const done = i <= activeStep;
                const current = i === activeStep;
                return (
                  <motion.div
                    key={step.id}
                    onClick={() => setActiveStep(i)}
                    whileHover={{ x: 3 }}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1rem",
                      padding: "0.75rem 0.75rem 0.75rem 0",
                      cursor: "pointer",
                      borderRadius: 10,
                      transition: "background 0.2s",
                      background: current ? T.accentPale : "transparent",
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    {/* Node */}
                    <div style={{ position: "relative", flexShrink: 0, zIndex: 2 }}>
                      <motion.div
                        animate={{ scale: current ? [1, 1.2, 1] : 1 }}
                        transition={{ duration: 1.5, repeat: current ? Infinity : 0 }}
                        style={{
                          width: 40, height: 40, borderRadius: "50%",
                          background: done ? T.accentPale : T.bgAlt,
                          border: `2px solid ${done ? T.accent : T.border}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "1rem",
                          boxShadow: "none",
                          transition: "all 0.3s",
                        }}
                      >
                        {done ? (i < activeStep ? "✓" : step.icon) : step.icon}
                      </motion.div>
                    </div>

                    <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: done ? T.text : T.textMuted, transition: "color 0.3s" }}>
                          {step.label}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: T.textMuted, fontFamily: "ui-monospace, monospace", flexShrink: 0 }}>{step.time}</div>
                      </div>
                      <div style={{ fontSize: "0.78rem", color: T.textMuted, lineHeight: 1.5, marginTop: 2 }}>{step.desc}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Detail panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.35 }}
              style={{
                borderRadius: 14,
                border: `1px solid ${T.border}`,
                padding: "1.75rem",
                boxShadow: T.shadow,
                position: "sticky",
                top: 90,
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>{STEPS[activeStep].icon}</div>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, color: T.accent, letterSpacing: "0.12em", marginBottom: "0.4rem" }}>
                STEP {activeStep + 1} OF {STEPS.length}
              </div>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, color: T.text, marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
                {STEPS[activeStep].label}
              </div>
              <p style={{ fontSize: "0.9rem", color: T.textSub, lineHeight: 1.75, marginBottom: "1.5rem" }}>
                {STEPS[activeStep].detail}
              </p>

              {/* Progress dots */}
              <div style={{ display: "flex", gap: "0.4rem" }}>
                {STEPS.map((_, i) => (
                  <motion.div
                    key={i}
                    onClick={() => setActiveStep(i)}
                    whileHover={{ scale: 1.3 }}
                    style={{
                      width: i === activeStep ? 20 : 8,
                      height: 8,
                      borderRadius: 4,
                      background: i <= activeStep ? T.accent : T.border,
                      cursor: "pointer",
                      transition: "all 0.3s",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
