import { createContext, useCallback, useContext, useMemo, useState } from "react";

export const THEME = {
  light: {
    // Surfaces
    bg: "#F2F5F2",
    bgAlt: "#E8EDE9",
    bgCard: "#FFFFFF",
    bgCardHov: "#F6FAF7",
    bgGlass: "rgba(255,255,255,0.78)",
    bgNav: "rgba(242,245,242,0.92)",
    bgScanner: "#EDF2EE",
    bgFooter: "#DDE5DE",
    // Borders
    border: "rgba(0,0,0,0.07)",
    borderHov: "rgba(22,160,86,0.45)",
    borderGlass: "rgba(0,0,0,0.06)",
    // Text
    text: "#0C1710",
    textSub: "#4A6355",
    textMuted: "#8AA898",
    // Brand
    accent: "#16A056",
    accentDim: "#0F7A40",
    accentDeep: "#0A5C30",
    accentPale: "rgba(22,160,86,0.09)",
    accentGlow: "rgba(22,160,86,0.18)",
    // Effects
    shadow: "rgba(0,40,20,0.07)",
    shadowHov: "rgba(0,40,20,0.14)",
    shadowDeep: "rgba(0,40,20,0.22)",
    orb1: "rgba(22,160,86,0.10)",
    orb2: "rgba(22,160,86,0.06)",
    grid: "rgba(22,160,86,0.06)",
    heroImg: 0.05,
    scrollbar: "#C4D6C8",
    scrollThumb: "#8AA898",
    gradHero: "linear-gradient(160deg, #F2F5F2 0%, #E4EDE6 60%, #D8EAE0 100%)",
  },
  dark: {
    bg: "#080F18",
    bgAlt: "#0C1A2E",
    bgCard: "rgba(255,255,255,0.038)",
    bgCardHov: "#111E35",
    bgGlass: "rgba(8,15,24,0.82)",
    bgNav: "rgba(8,15,24,0.92)",
    bgScanner: "#0F1D35",
    bgFooter: "#060D16",
    border: "rgba(255,255,255,0.07)",
    borderHov: "rgba(46,210,130,0.40)",
    borderGlass: "rgba(255,255,255,0.06)",
    text: "#EDF5F0",
    textSub: "#7A9E8E",
    textMuted: "#425E52",
    accent: "#2ED282",
    accentDim: "#1FAF65",
    accentDeep: "#157845",
    accentPale: "rgba(46,210,130,0.10)",
    accentGlow: "rgba(46,210,130,0.18)",
    shadow: "rgba(0,0,0,0.28)",
    shadowHov: "rgba(0,0,0,0.48)",
    shadowDeep: "rgba(0,0,0,0.65)",
    orb1: "rgba(46,210,130,0.08)",
    orb2: "rgba(46,210,130,0.04)",
    grid: "rgba(46,210,130,0.04)",
    heroImg: 0.06,
    scrollbar: "#080F18",
    scrollThumb: "#1A2E45",
    gradHero: "linear-gradient(160deg, #080F18 0%, #0C1A2E 55%, #0A1E38 100%)",
  },
};

const ThemeContext = createContext({ mode: "light", T: THEME.light, toggle: () => {} });

export const useT = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState("light");

  const toggle = useCallback(() => {
    setMode((m) => (m === "light" ? "dark" : "light"));
  }, []);

  const value = useMemo(() => ({ mode, T: THEME[mode], toggle }), [mode, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
