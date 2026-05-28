
/**
 * ResQNet — Premium Button Component
 * Variants: primary | secondary | ghost | danger | outline
 * Sizes: sm | md | lg
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style: extraStyle = {},
}) {
  const classNames = [
    "rq-btn",
    `rq-btn-${variant}`,
    `rq-btn-${size}`,
  ].join(" ");

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classNames}
      style={{
        width: fullWidth ? "100%" : "auto",
        ...extraStyle,
      }}
    >
      {loading ? (
        <svg
          width={size === "sm" ? 12 : 14}
          height={size === "sm" ? 12 : 14}
          viewBox="0 0 16 16"
          fill="none"
          style={{ animation: "rq-spin 0.8s linear infinite", flexShrink: 0 }}
        >
          <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
          <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : leftIcon ? (
        <span style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>{leftIcon}</span>
      ) : null}
      {children}
      {!loading && rightIcon && (
        <span style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>{rightIcon}</span>
      )}
    </button>
  );
}
