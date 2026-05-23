import { Component } from "react";

// ─── ERROR BOUNDARY ──────────────────────────────────────────────────────────
export class DashboardErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error("Dashboard error:", error, info); }
  render() {
    const { T } = this.props;
    if (this.state.hasError) {
      return (
        <div style={{ padding: 28, borderRadius: 16, border: `1px solid ${T?.border || "#E2E8F0"}`, background: T?.bgCard || "#fff" }}>
          <div style={{ fontSize: "0.95rem", fontWeight: 700, color: T?.text || "#0F172A", marginBottom: 8 }}>
            Dashboard temporarily unavailable
          </div>
          <div style={{ fontSize: "0.85rem", color: T?.textSub || "#475569", lineHeight: 1.6 }}>
            An unexpected error occurred. Please refresh the page.
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

