import React from "react";
import { Link } from "react-router-dom";

export default class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#0A2218",
          color: T.textOnAccent,
          textAlign: "center",
          padding: "2rem"
        }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: T.danger }}>Something went wrong.</h1>
          <p style={{ fontSize: "1rem", marginBottom: "2rem", color: "#9CA3AF", maxWidth: "600px" }}>
            We encountered an unexpected error. The engineering team has been notified.
            <br/><br/>
            {this.state.error?.message}
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#16A056",
                border: "none",
                borderRadius: "8px",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Reload Page
            </button>
            <Link
              to="/"
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "transparent",
                border: "1px solid #16A056",
                borderRadius: "8px",
                color: "#16A056",
                fontWeight: "bold",
                textDecoration: "none"
              }}
            >
              Go to Home
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
