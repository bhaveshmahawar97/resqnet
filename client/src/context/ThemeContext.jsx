import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

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

    // ── Borders (strengthened for clarity) ──────────────────────────────────────
    border: "#E2E6EC",
    borderLight: "#ECEFF3",
    borderHov: "#1554A8",
    borderGlass: "rgba(0,0,0,0.05)",
    borderInput: "#C7CFD9",
    borderInputHov: "#9CA9B8",
    borderInputFocus: "#1554A8",

    // ── Text (deeper contrast) ──────────────────────────────────────────────────
    text: "#0F172A",
    textHeading: "#020617",
    textSub: "#475569",
    textMuted: "#94A3B8",
    textLabel: "#475569",
    textOnAccent: "#FFFFFF",
    textInverse: "#F7F8FA",

    // ── Brand / Accent (deeper, refined medical blue) ───────────────────────────
    accent: "#1554A8",
    accentDim: "#114898",
    accentDeep: "#0B3478",
    accentPale: "rgba(21,84,168,0.06)",
    accentGlow: "rgba(21,84,168,0.14)",
    accentSurface: "#EAF1F9",

    // ── Focus ring (NEW) ────────────────────────────────────────────────────────
    ring: "rgba(21,84,168,0.22)",
    ringSubtle: "rgba(21,84,168,0.10)",

    // ── Semantic Colors ─────────────────────────────────────────────────────────
    success: "#047857",
    successPale: "rgba(4,120,87,0.07)",
    successBorder: "rgba(4,120,87,0.22)",
    warning: "#B45309",
    warningPale: "rgba(180,83,9,0.07)",
    danger: "#DC2626",
    dangerPale: "rgba(220,38,38,0.06)",
    dangerBorder: "rgba(220,38,38,0.20)",
    info: "#0284C7",
    infoPale: "rgba(2,132,199,0.07)",

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
    heroImg: 0.04,
    gradHero: "linear-gradient(170deg, #F7F8FA 0%, #EEF1F5 50%, #E6ECF4 100%)",
    gradAccent: "linear-gradient(135deg, #1554A8 0%, #114898 100%)",
    gradSuccess: "linear-gradient(135deg, #047857 0%, #065F46 100%)",
    divider: "#E2E6EC",

    // ── Legacy compatibility ────────────────────────────────────────────────────
    orb1: "rgba(21,84,168,0.06)",
    orb2: "rgba(21,84,168,0.03)",
    grid: "rgba(21,84,168,0.04)",
    borderGlassColor: "rgba(0,0,0,0.05)",
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

    // ── Borders (strengthened for clarity) ──────────────────────────────────────
    border: "rgba(255,255,255,0.10)",
    borderLight: "rgba(255,255,255,0.06)",
    borderHov: "rgba(77,168,255,0.45)",
    borderGlass: "rgba(255,255,255,0.08)",
    borderInput: "rgba(255,255,255,0.16)",
    borderInputHov: "rgba(255,255,255,0.26)",
    borderInputFocus: "#4DA8FF",

    // ── Text (brighter for readability) ─────────────────────────────────────────
    text: "#E6EEFB",
    textHeading: "#F1F6FE",
    textSub: "#94A8C6",
    textMuted: "#5A6F8E",
    textLabel: "#94A8C6",
    textOnAccent: "#FFFFFF",
    textInverse: "#0F172A",

    // ── Brand / Accent ──────────────────────────────────────────────────────────
    accent: "#4DA8FF",
    accentDim: "#2D8FE8",
    accentDeep: "#1A77D0",
    accentPale: "rgba(77,168,255,0.10)",
    accentGlow: "rgba(77,168,255,0.18)",
    accentSurface: "#0F2740",

    // ── Focus ring (NEW) ────────────────────────────────────────────────────────
    ring: "rgba(77,168,255,0.30)",
    ringSubtle: "rgba(77,168,255,0.15)",

    // ── Semantic Colors ─────────────────────────────────────────────────────────
    success: "#10B981",
    successPale: "rgba(16,185,129,0.10)",
    successBorder: "rgba(16,185,129,0.28)",
    warning: "#F59E0B",
    warningPale: "rgba(245,158,11,0.10)",
    danger: "#F87171",
    dangerPale: "rgba(248,113,113,0.08)",
    dangerBorder: "rgba(248,113,113,0.28)",
    info: "#4DA8FF",
    infoPale: "rgba(77,168,255,0.10)",

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
    heroImg: 0.05,
    gradHero: "linear-gradient(170deg, #0A1018 0%, #0F1827 50%, #0C1D3A 100%)",
    gradAccent: "linear-gradient(135deg, #4DA8FF 0%, #2D8FE8 100%)",
    gradSuccess: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    divider: "rgba(255,255,255,0.08)",

    // ── Legacy compatibility ────────────────────────────────────────────────────
    orb1: "rgba(77,168,255,0.06)",
    orb2: "rgba(77,168,255,0.03)",
    grid: "rgba(77,168,255,0.03)",
    borderGlassColor: "rgba(255,255,255,0.08)",
  },
};

const ThemeContext = createContext({ mode: "light", T: THEME.light, toggle: () => {} });

export const useT = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState("light");

  const toggle = useCallback(() => {
    setMode((m) => {
      const next = m === "light" ? "dark" : "light";
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ mode, T: THEME[mode], toggle }), [mode, toggle]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, []);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
