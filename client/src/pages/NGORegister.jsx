import { useT } from "../context/ThemeContext";
import NGOOnboarding from "../components/ngo/NGOOnboarding";

/**
 * NGO Registration Page — dedicated page for NGO registration
 */
export default function NGORegister() {
  const { T } = useT();

  return (
    <main style={{ width: "100%", overflowX: "hidden", background: T.bg, minHeight: "100vh" }}>
      {/* Hero Section */}
      <section style={{ width: "100%", padding: "clamp(3rem, 8vw, 5rem) 0", background: `linear-gradient(135deg, ${T.accent}15, ${T.accentPale})` }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "0 clamp(1.25rem, 4vw, 3.5rem)" }}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, letterSpacing: "-0.03em", color: T.text, margin: "0 0 0.75rem" }}>
              NGO Onboarding
            </h1>
            <p style={{ fontSize: "1.1rem", color: T.textSub, maxWidth: "600px", margin: "0 auto", lineHeight: 1.7 }}>
              Complete your verification profile to access the ResQNet dashboard and coordinate rescue operations.
            </p>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section style={{ width: "100%", padding: "clamp(3rem, 8vw, 5rem) 0" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 clamp(1.25rem, 4vw, 3.5rem)" }}>
          <NGOOnboarding />
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ width: "100%", padding: "clamp(3rem, 8vw, 5rem) 0", background: T.bgAlt }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 clamp(1.25rem, 4vw, 3.5rem)" }}>
          <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800, color: T.text, textAlign: "center", marginBottom: "2.5rem" }}>
            Frequently Asked Questions
          </h2>

          <div style={{ display: "grid", gap: "1.5rem" }}>
            {[
              {
                q: "What information do I need to register?",
                a: "You'll need your organization's name, contact details, address, area of operation, and NGO registration number (if available).",
              },
              {
                q: "How long does verification take?",
                a: "Our team reviews applications within 48 hours. We verify your documents, rescue history, and references before approving.",
              },
              {
                q: "What benefits do verified NGOs get?",
                a: "Access to rescue alerts in your zone, AI-powered mission coordination, adoption network integration, and donor connections.",
              },
              {
                q: "Can I update my profile after registration?",
                a: "Yes, you can update your organization details anytime through your ResQNet dashboard.",
              },
              {
                q: "Is there a registration fee?",
                a: "No, ResQNet is completely free for NGOs. We believe in supporting animal welfare organizations.",
              },
              {
                q: "How do I get support after registering?",
                a: "Our support team is available 24/7 via email, chat, and phone to help you get started.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: T.bgCard,
                  border: `1px solid ${T.border}`,
                  borderRadius: 12,
                  padding: "1.5rem",
                  boxShadow: T.shadow,
                }}
              >
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: T.text, margin: "0 0 0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.2rem", color: T.accent }}>❓</span>
                  {item.q}
                </h3>
                <p style={{ fontSize: "0.9rem", color: T.textSub, margin: 0, lineHeight: 1.6 }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
