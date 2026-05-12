import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";

export default function Button({
  children,
  variant = "primary",
  onClick,
  style: s = {},
  size = "md",
}) {
  const { T } = useT();
  const pad =
    size === "sm"
      ? "0.42rem 1rem"
      : size === "lg"
        ? "0.9rem 2.2rem"
        : "0.68rem 1.6rem";
  const base = {
    padding: pad,
    borderRadius: 10,
    fontFamily: "inherit",
    fontSize: size === "lg" ? "0.97rem" : "0.84rem",
    fontWeight: 700,
    cursor: "pointer",
    border: "none",
    letterSpacing: "-0.01em",
    whiteSpace: "nowrap",
    transition: "all 0.2s",
  };
  const styles = {
    primary: { ...base, background: T.accent, color: "#fff" },
    ghost: {
      ...base,
      background: "transparent",
      border: `1px solid ${T.border}`,
      color: T.text,
    },
    danger: { ...base, background: "#E53935", color: "#fff" },
    outline: {
      ...base,
      background: "transparent",
      border: `1px solid ${T.accent}`,
      color: T.accent,
    },
  };
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03, opacity: 0.92 }}
      whileTap={{ scale: 0.96 }}
      style={{ ...styles[variant], ...s }}
    >
      {children}
    </motion.button>
  );
}

