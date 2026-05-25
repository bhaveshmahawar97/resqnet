const fs = require('fs');
const path = require('path');

const THEME = {
  light: {
    bg: "#F8FAFB",
    bgAlt: "#F1F4F8",
    bgPage: "#F8FAFB",
    bgCard: "#FFFFFF",
    bgCardHov: "#FAFBFD",
    bgGlass: "rgba(255,255,255,0.88)",
    bgNav: "rgba(255,255,255,0.92)",
    bgScanner: "#F1F6FB",
    bgFooter: "#111827",
    bgInput: "#FFFFFF",
    bgMuted: "#F3F6F9",
    border: "#E8ECF1",
    borderLight: "#F1F4F8",
    borderHov: "#1D6FA4",
    borderGlass: "rgba(0,0,0,0.04)",
    borderInput: "#D5DCE5",
    borderInputFocus: "#1D6FA4",
    text: "#1A2332",
    textHeading: "#111827",
    textSub: "#475569",
    textMuted: "#94A3B8",
    textLabel: "#5A6A7E",
    textOnAccent: "#FFFFFF",
    textInverse: "#F8FAFC",
    accent: "#1D6FA4",
    accentDim: "#185E8E",
    accentDeep: "#0D4478",
    accentPale: "rgba(29,111,164,0.06)",
    accentGlow: "rgba(29,111,164,0.14)",
    accentSurface: "#EDF4FA",
    success: "#059669",
    successPale: "rgba(5,150,105,0.07)",
    successBorder: "rgba(5,150,105,0.2)",
    warning: "#D97706",
    warningPale: "rgba(217,119,6,0.07)",
    danger: "#DC2626",
    dangerPale: "rgba(220,38,38,0.06)",
    dangerBorder: "rgba(220,38,38,0.18)",
    info: "#0EA5E9",
    infoPale: "rgba(14,165,233,0.07)",
    shadow: "0 1px 2px rgba(15,23,42,0.04)",
    shadowSm: "0 1px 2px rgba(15,23,42,0.03)",
    shadowMd: "0 2px 8px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.03)",
    shadowLg: "0 8px 24px rgba(15,23,42,0.08), 0 2px 6px rgba(15,23,42,0.04)",
    shadowHov: "0 4px 16px rgba(15,23,42,0.07)",
    shadowDeep: "0 16px 48px rgba(15,23,42,0.12), 0 4px 12px rgba(15,23,42,0.04)",
    shadowCard: "0 1px 3px rgba(15,23,42,0.04), 0 0 0 1px rgba(15,23,42,0.02)",
    scrollbar: "#CBD5E1",
    scrollThumb: "#94A3B8",
    heroImg: "0.04",
    gradHero: "linear-gradient(170deg, #F8FAFB 0%, #F1F4F8 50%, #EAF0F7 100%)",
    gradAccent: "linear-gradient(135deg, #1D6FA4 0%, #185E8E 100%)",
    gradSuccess: "linear-gradient(135deg, #059669 0%, #047857 100%)",
    divider: "#E8ECF1",
    orb1: "rgba(29,111,164,0.06)",
    orb2: "rgba(29,111,164,0.03)",
    grid: "rgba(29,111,164,0.04)",
    borderGlassColor: "rgba(0,0,0,0.04)",
  },
  dark: {
    bg: "#0B1524",
    bgAlt: "#101D30",
    bgPage: "#0B1524",
    bgCard: "#13202F",
    bgCardHov: "#182840",
    bgGlass: "rgba(11,21,36,0.9)",
    bgNav: "rgba(11,21,36,0.94)",
    bgScanner: "#101D30",
    bgFooter: "#070D18",
    bgInput: "#0F1A2A",
    bgMuted: "#101D30",
    border: "rgba(255,255,255,0.06)",
    borderLight: "rgba(255,255,255,0.04)",
    borderHov: "rgba(56,189,248,0.35)",
    borderGlass: "rgba(255,255,255,0.05)",
    borderInput: "rgba(255,255,255,0.1)",
    borderInputFocus: "#38BDF8",
    text: "#DCE4F0",
    textHeading: "#EDF2FB",
    textSub: "#7B92B2",
    textMuted: "#4A6080",
    textLabel: "#6B84A3",
    textOnAccent: "#FFFFFF",
    textInverse: "#1A2332",
    accent: "#38BDF8",
    accentDim: "#0EA5E9",
    accentDeep: "#0284C7",
    accentPale: "rgba(56,189,248,0.08)",
    accentGlow: "rgba(56,189,248,0.15)",
    accentSurface: "#0C2640",
    success: "#10B981",
    successPale: "rgba(16,185,129,0.1)",
    successBorder: "rgba(16,185,129,0.25)",
    warning: "#F59E0B",
    warningPale: "rgba(245,158,11,0.1)",
    danger: "#F87171",
    dangerPale: "rgba(248,113,113,0.08)",
    dangerBorder: "rgba(248,113,113,0.25)",
    info: "#38BDF8",
    infoPale: "rgba(56,189,248,0.08)",
    shadow: "0 1px 2px rgba(0,0,0,0.25)",
    shadowSm: "0 1px 2px rgba(0,0,0,0.2)",
    shadowMd: "0 2px 8px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.15)",
    shadowLg: "0 8px 24px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.2)",
    shadowHov: "0 4px 16px rgba(56,189,248,0.08)",
    shadowDeep: "0 16px 48px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.25)",
    shadowCard: "0 1px 3px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.04)",
    scrollbar: "#1A2D45",
    scrollThumb: "#2D4060",
    heroImg: "0.05",
    gradHero: "linear-gradient(170deg, #0B1524 0%, #101D30 50%, #0C1D3A 100%)",
    gradAccent: "linear-gradient(135deg, #38BDF8 0%, #0EA5E9 100%)",
    gradSuccess: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    divider: "rgba(255,255,255,0.06)",
    orb1: "rgba(56,189,248,0.06)",
    orb2: "rgba(56,189,248,0.03)",
    grid: "rgba(56,189,248,0.03)",
    borderGlassColor: "rgba(255,255,255,0.05)",
  }
};

const toKebab = str => str.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);

let cssVariables = `/* ── Theme CSS Variables (Auto-generated) ── */\n:root {\n`;
const varMap = {};

for (const [key, value] of Object.entries(THEME.light)) {
  const kebab = toKebab(key);
  cssVariables += `  --${kebab}: ${value};\n`;
  varMap[key] = `var(--${kebab})`;
}
cssVariables += `}\n\nhtml[data-theme="dark"] {\n`;
for (const [key, value] of Object.entries(THEME.dark)) {
  const kebab = toKebab(key);
  cssVariables += `  --${kebab}: ${value};\n`;
}
cssVariables += `}\n`;

fs.writeFileSync('src/theme-vars.css', cssVariables);
console.log('Created src/theme-vars.css');

// Now rewrite ThemeContext.jsx
let tc = fs.readFileSync('src/context/ThemeContext.jsx', 'utf8');

// Replace the THEME object entirely with our varMap
tc = tc.replace(/export const THEME = \{[\s\S]*?\};\n\n/, `export const THEME = {\n  light: ${JSON.stringify(varMap, null, 4)},\n  dark: ${JSON.stringify(varMap, null, 4)},\n};\n\n`);

// Update toggle to also set data-theme
tc = tc.replace(/const toggle = useCallback\(\(\) => \{[\s\S]*?\}, \[\]\);/, `const toggle = useCallback(() => {
    setMode((m) => {
      const next = m === "light" ? "dark" : "light";
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  }, []);`);

// Also add a useEffect to set the initial theme
tc = tc.replace(/return <ThemeContext.Provider/, `  import React, { useEffect } from 'react';
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, []);

  return <ThemeContext.Provider`);

fs.writeFileSync('src/context/ThemeContext.jsx', tc);
console.log('Updated src/context/ThemeContext.jsx');

