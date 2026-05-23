import { useState } from "react";
import { useT } from "../../context/ThemeContext";

/**
 * ResQNet — FormField Component
 * Healthcare-grade standardized form fields
 * Supports: input | textarea | select
 */
export default function FormField({
  label,
  type = "text",
  as = "input",       // "input" | "textarea" | "select"
  value,
  onChange,
  onBlur,
  placeholder,
  autoComplete,
  disabled = false,
  required = false,
  error,
  hint,
  rows = 4,
  children,           // for select options
  leftIcon,
  style: extraStyle = {},
  inputStyle: extraInputStyle = {},
  id,
}) {
  const { T } = useT();
  const [focused, setFocused] = useState(false);

  const fieldId = id || label?.toLowerCase().replace(/\s+/g, "-");
  const hasError = Boolean(error);

  const inputBase = {
    width: "100%",
    padding: leftIcon ? "0.75rem 1rem 0.75rem 2.75rem" : "0.75rem 1rem",
    borderRadius: 10,
    border: `1.5px solid ${hasError ? T.danger || "#DC2626" : focused ? T.borderInputFocus || T.accent : T.borderInput || T.border}`,
    background: disabled ? T.bgMuted || T.bgAlt : T.bgInput || T.bgCard,
    color: T.text,
    fontSize: "0.9rem",
    fontFamily: "inherit",
    lineHeight: 1.5,
    outline: "none",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    boxShadow: focused && !hasError
      ? `0 0 0 2px ${T.accentPale}`
      : hasError
        ? `0 0 0 2px ${T.dangerPale}`
        : "none",
    opacity: disabled ? 0.65 : 1,
    cursor: disabled ? "not-allowed" : "auto",
    boxSizing: "border-box",
    ...extraInputStyle,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", ...extraStyle }}>
      {label && (
        <label
          htmlFor={fieldId}
          style={{
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: hasError ? T.danger || "#DC2626" : T.textSub,
            letterSpacing: "-0.005em",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          {label}
          {required && (
            <span style={{ color: T.danger || "#DC2626", fontSize: "0.85em" }}>*</span>
          )}
        </label>
      )}

      <div style={{ position: "relative" }}>
        {leftIcon && (
          <div
            style={{
              position: "absolute",
              left: "0.85rem",
              top: "50%",
              transform: as === "textarea" ? "none" : "translateY(-50%)",
              marginTop: as === "textarea" ? "0.875rem" : 0,
              color: T.textMuted,
              display: "flex",
              alignItems: "center",
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            {leftIcon}
          </div>
        )}

        {as === "textarea" ? (
          <textarea
            id={fieldId}
            value={value}
            onChange={onChange}
            onBlur={(e) => { setFocused(false); onBlur?.(e); }}
            onFocus={() => setFocused(true)}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            rows={rows}
            style={{ ...inputBase, resize: "vertical", minHeight: `${rows * 1.5}rem` }}
          />
        ) : as === "select" ? (
          <select
            id={fieldId}
            value={value}
            onChange={onChange}
            onBlur={(e) => { setFocused(false); onBlur?.(e); }}
            onFocus={() => setFocused(true)}
            disabled={disabled}
            required={required}
            style={{
              ...inputBase,
              appearance: "none",
              WebkitAppearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%2394A3B8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              paddingRight: "2.5rem",
              cursor: "pointer",
            }}
          >
            {children}
          </select>
        ) : (
          <input
            id={fieldId}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={(e) => { setFocused(false); onBlur?.(e); }}
            onFocus={() => setFocused(true)}
            placeholder={placeholder}
            autoComplete={autoComplete}
            disabled={disabled}
            required={required}
            style={inputBase}
          />
        )}
      </div>

      {hint && !error && (
        <p style={{ fontSize: "0.74rem", color: T.textMuted, lineHeight: 1.45 }}>
          {hint}
        </p>
      )}
      {error && (
        <p style={{
          fontSize: "0.74rem",
          color: T.danger || "#DC2626",
          lineHeight: 1.45,
          display: "flex",
          alignItems: "center",
          gap: "0.3rem",
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5.25" stroke="currentColor" strokeWidth="1.25"/>
            <path d="M6 3.5v3M6 8.5v.25" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
