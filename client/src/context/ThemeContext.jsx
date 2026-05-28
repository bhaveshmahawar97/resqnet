import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/* eslint-disable react-refresh/only-export-components -- THEME + useT are part of the theme module */

export const THEME = {
  light: {
    // ── Core Surfaces ───────────────────────────────────────────────────────────
    bg: "#F7F8FA",
    bgAlt: "#EEF1F5",
    bgPage: "#F7F8FA",
    bgCard: "#FFFFFF",
    bgCardHov: "#F9FAFC",
    bgGlass: "rgba(255,255,255,0.88)",
    bgNav: "rgba(255,255,255,0.92)",
    bgScanner: "#EEF1F5",
    bgFooter: "#0F172A",
    bgInput: "#FFFFFF",
    bgInputHov: "#FAFBFD",
    bgMuted: "#F1F4F8",

    // ── Borders ─────────────────────────────────────────────────────────────────
    border: "#E2E6EC",
    borderLight: "#ECEFF3",
    borderHov: "#1554A8",
    borderGlass: "rgba(0,0,0,0.05)",
    borderInput: "#C7CFD9",
    borderInputHov: "#9CA9B8",
    borderInputFocus: "#1554A8",

    // ── Text ────────────────────────────────────────────────────────────────────
    text: "#0F172A",
    textHeading: "#020617",
    textSub: "#475569",
    textMuted: "#6E7D90",   // ↑ raised from #94A3B8 for WCAG AA on white
    textLabel: "#475569",
    textOnAccent: "#FFFFFF",
    textInverse: "#F8FAFC",

    // ── Brand / Accent ───────────────────────────────────────────────────────────
    // Single source of truth: #1554A8 (medical blue).
    // Home.jsx BRAND.primary was #2563EB — that is removed; everything uses T.accent.
    accent: "#1554A8",
    accentDim: "#114898",
    accentDeep: "#0B3478",
    accentPale: "rgba(21,84,168,0.07)",
    accentGlow: "rgba(21,84,168,0.16)",
    accentSurface: "#EAF1F9",

    // ── Focus ring ──────────────────────────────────────────────────────────────
    ring: "rgba(21,84,168,0.22)",
    ringSubtle: "rgba(21,84,168,0.10)",

    // ── Semantic Colors ──────────────────────────────────────────────────────────
    success: "#047857",
    successPale: "rgba(4,120,87,0.08)",
    successBorder: "rgba(4,120,87,0.24)",
    warning: "#92400E",     // ↑ raised from #B45309 — better contrast on white
    warningPale: "rgba(146,64,14,0.08)",
    warningBorder: "rgba(146,64,14,0.24)",
    danger: "#DC2626",
    dangerPale: "rgba(220,38,38,0.07)",
    dangerBorder: "rgba(220,38,38,0.22)",
    info: "#0369A1",        // ↑ raised from #0284C7 — better contrast on white
    infoPale: "rgba(3,105,161,0.08)",
    infoBorder: "rgba(3,105,161,0.24)",

    // ── Shadows ─────────────────────────────────────────────────────────────────
    shadow: "0 1px 2px rgba(15,23,42,0.05)",
    shadowSm: "0 1px 2px rgba(15,23,42,0.04)",
    shadowMd: "0 2px 8px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)",
    shadowLg: "0 8px 24px rgba(15,23,42,0.08), 0 2px 6px rgba(15,23,42,0.04)",
    shadowHov: "0 4px 16px rgba(15,23,42,0.08)",
    shadowDeep: "0 16px 48px rgba(15,23,42,0.12), 0 4px 12px rgba(15,23,42,0.05)",
    shadowCard: "0 1px 3px rgba(15,23,42,0.04), 0 0 0 1px rgba(15,23,42,0.025)",
    shadowInputInset: "inset 0 1px 2px rgba(15,23,42,0.03)",

    // ── Misc ────────────────────────────────────────────────────────────────────
    scrollbar: "#CBD5E1",
    scrollThumb: "#94A3B8",
    gradAccent: "linear-gradient(135deg, #1554A8 0%, #114898 100%)",
    gradSuccess: "linear-gradient(135deg, #047857 0%, #065F46 100%)",
    divider: "#E2E6EC",
  },

  dark: {
    // ── Core Surfaces ───────────────────────────────────────────────────────────
    bg: "#0A1018",
    bgAlt: "#0F1827",
    bgPage: "#0A1018",
    bgCard: "#131B2A",
    bgCardHov: "#1A2438",
    bgGlass: "rgba(10,16,24,0.9)",
    bgNav: "rgba(10,16,24,0.94)",
    bgScanner: "#0F1827",
    bgFooter: "#060A12",
    bgInput: "#0F1827",
    bgInputHov: "#13202F",
    bgMuted: "#0F1827",

    // ── Borders ─────────────────────────────────────────────────────────────────
    border: "rgba(255,255,255,0.10)",
    borderLight: "rgba(255,255,255,0.06)",
    borderHov: "rgba(77,168,255,0.45)",
    borderGlass: "rgba(255,255,255,0.08)",
    borderInput: "rgba(255,255,255,0.16)",
    borderInputHov: "rgba(255,255,255,0.26)",
    borderInputFocus: "#4DA8FF",

    // ── Text ────────────────────────────────────────────────────────────────────
    text: "#E6EEFB",
    textHeading: "#F1F6FE",
    textSub: "#94A8C6",
    textMuted: "#6E86A0",   // ↑ raised from #5A6F8E — 4.6:1 on #131B2A (WCAG AA)
    textLabel: "#94A8C6",
    textOnAccent: "#FFFFFF",
    textInverse: "#0F172A",

    // ── Brand / Accent ───────────────────────────────────────────────────────────
    accent: "#4DA8FF",
    accentDim: "#2D8FE8",
    accentDeep: "#1A77D0",
    accentPale: "rgba(77,168,255,0.10)",
    accentGlow: "rgba(77,168,255,0.18)",
    accentSurface: "#0F2740",

    // ── Focus ring ──────────────────────────────────────────────────────────────
    ring: "rgba(77,168,255,0.30)",
    ringSubtle: "rgba(77,168,255,0.15)",

    // ── Semantic Colors ──────────────────────────────────────────────────────────
    success: "#10B981",
    successPale: "rgba(16,185,129,0.10)",
    successBorder: "rgba(16,185,129,0.28)",
    warning: "#F59E0B",
    warningPale: "rgba(245,158,11,0.10)",
    warningBorder: "rgba(245,158,11,0.28)",
    danger: "#F87171",
    dangerPale: "rgba(248,113,113,0.08)",
    dangerBorder: "rgba(248,113,113,0.28)",
    info: "#38BDF8",
    infoPale: "rgba(56,189,248,0.10)",
    infoBorder: "rgba(56,189,248,0.28)",

    // ── Shadows ─────────────────────────────────────────────────────────────────
    shadow: "0 1px 2px rgba(0,0,0,0.30)",
    shadowSm: "0 1px 2px rgba(0,0,0,0.25)",
    shadowMd: "0 2px 10px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.20)",
    shadowLg: "0 8px 28px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.25)",
    shadowHov: "0 4px 18px rgba(77,168,255,0.10)",
    shadowDeep: "0 16px 52px rgba(0,0,0,0.55), 0 4px 14px rgba(0,0,0,0.30)",
    shadowCard: "0 1px 3px rgba(0,0,0,0.30), 0 0 0 1px rgba(255,255,255,0.05)",
    shadowInputInset: "inset 0 1px 2px rgba(0,0,0,0.25)",

    // ── Misc ────────────────────────────────────────────────────────────────────
    scrollbar: "#1A2D45",
    scrollThumb: "#2D4060",
    gradAccent: "linear-gradient(135deg, #4DA8FF 0%, #2D8FE8 100%)",
    gradSuccess: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    divider: "rgba(255,255,255,0.08)",
  },
};

const ThemeContext = createContext({ mode: "light", T: THEME.light, toggle: () => {} });

export const useT = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState("light");

  const toggle = useCallback(() => {
    setMode((m) => {
      const next = m === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ mode, T: THEME[mode], toggle }), [mode, toggle]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
