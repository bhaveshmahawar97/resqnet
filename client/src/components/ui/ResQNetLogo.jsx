/**
 * ResQNet — Official Logo Component
 * Matching the brand identity: gradient shield · animal silhouettes ·
 * network constellation · ECG line · medical cross
 *
 * Variants:
 *   "mark"  → shield icon only
 *   "full"  → shield + wordmark (adapts to light/dark via T)
 *   "dark"  → shield + wordmark forced light (footer)
 *
 * Props:
 *   size       = shield height in px (default 36)
 *   tagline    = show "Rescue · Heal · Connect · Adopt" (default false)
 *   T          = ThemeContext T object
 */

export default function ResQNetLogo({
  variant  = "full",
  size     = 36,
  tagline  = false,
  T        = {},
}) {
  const isDark   = variant === "dark";
  const textMain = isDark ? "#F8FAFC"              : (T.text     || "#0F172A");
  const textSub  = isDark ? "rgba(248,250,252,0.5)" : (T.textMuted|| "#6E7D90");

  // Shield aspect ratio 100:115
  const shW = size;
  const shH = Math.round(size * 1.15);

  /* ─────────────────────────────────────────── Shield SVG ── */
  const Shield = (
    <svg
      width={shW} height={shH}
      viewBox="0 0 100 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: "block", flexShrink: 0 }}
    >
      <defs>
        {/* Stroke + accent gradient: purple → blue → teal */}
        <linearGradient id="rqStroke" x1="5" y1="4" x2="95" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#A855F7"/>
          <stop offset="48%"  stopColor="#3B82F6"/>
          <stop offset="100%" stopColor="#06B6D4"/>
        </linearGradient>

        {/* Shield body fill: deep navy */}
        <linearGradient id="rqBg" x1="5" y1="4" x2="95" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#1A0B30"/>
          <stop offset="100%" stopColor="#0B1C38"/>
        </linearGradient>

        {/* ECG line gradient */}
        <linearGradient id="rqECG" x1="10" y1="90" x2="55" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#A855F7"/>
          <stop offset="100%" stopColor="#06B6D4"/>
        </linearGradient>

        {/* Clip to shield shape */}
        <clipPath id="rqClip">
          <path d="M50,4 L93,18 L93,60 C90,79 73,94 50,109 C27,94 10,79 7,60 L7,18 Z"/>
        </clipPath>
      </defs>

      {/* ── Shield fill ── */}
      <path
        d="M50,4 L93,18 L93,60 C90,79 73,94 50,109 C27,94 10,79 7,60 L7,18 Z"
        fill="url(#rqBg)"
      />

      {/* ── Clipped interior ── */}
      <g clipPath="url(#rqClip)">

        {/* Stars */}
        <circle cx="64" cy="13" r="1.2" fill="white" opacity="0.6"/>
        <circle cx="54" cy="10" r="0.8" fill="white" opacity="0.45"/>
        <circle cx="71" cy="20" r="1"   fill="white" opacity="0.5"/>
        <circle cx="60" cy="8"  r="0.6" fill="white" opacity="0.35"/>

        {/* Mountains (background silhouette) */}
        <path d="M24,66 L40,37 L56,66 Z" fill="#1C3557" opacity="0.45"/>
        <path d="M44,66 L61,29 L78,66 Z" fill="#172E4A" opacity="0.35"/>

        {/* Leaves — left */}
        <path d="M11,54 C5,46 7,36 13,33 C19,30 26,38 22,49 C19,56 11,54 11,54 Z"
          fill="#7C3AED" opacity="0.5"/>
        <path d="M11,54 L14,40" stroke="#A855F7" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4"/>

        {/* Leaves — right */}
        <path d="M89,54 C95,46 93,36 87,33 C81,30 74,38 78,49 C81,56 89,54 89,54 Z"
          fill="#06B6D4" opacity="0.5"/>
        <path d="M89,54 L86,40" stroke="#06B6D4" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4"/>

        {/* ── Deer (top-left) ── */}
        <g fill="#8B5CF6" opacity="0.88">
          <ellipse cx="22" cy="49" rx="8.5" ry="7"/>
          <rect x="27" y="42" width="4.5" height="7" rx="2"/>
          <ellipse cx="31" cy="38" rx="5" ry="4.5"/>
          {/* antlers */}
          <path d="M29,34 L26,24 L23,19 M26,24 L29,20"
            stroke="#A78BFA" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
          <path d="M31,34 L33,25 L37,20 M33,25 L37,22"
            stroke="#A78BFA" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
          {/* legs */}
          <rect x="15" y="54" width="2.5" height="9" rx="1.2"/>
          <rect x="20" y="54" width="2.5" height="9" rx="1.2"/>
          <rect x="26" y="54" width="2.5" height="9" rx="1.2"/>
          <rect x="31" y="54" width="2.5" height="9" rx="1.2"/>
        </g>

        {/* ── Flying dove (top-center) ── */}
        <g fill="#06B6D4" opacity="0.92">
          {/* left wing */}
          <path d="M44,22 C39,16 32,18 31,22 C36,20 42,22 45,26"/>
          {/* right wing */}
          <path d="M56,22 C61,16 68,18 69,22 C64,20 58,22 55,26"/>
          <ellipse cx="50" cy="24" rx="6" ry="3"/>
          <circle cx="57" cy="20" r="2.8"/>
          <path d="M59.5,20 L62.5,19 L59.5,21 Z" fill="#0891B2"/>
        </g>

        {/* ── Cow (top-right) ── */}
        <g fill="#14B8A6" opacity="0.88">
          <ellipse cx="76" cy="49" rx="12" ry="8.5"/>
          <ellipse cx="86" cy="39" rx="6.5" ry="6"/>
          {/* horns */}
          <path d="M82,34 L78,25 M90,34 L94,25"
            stroke="#14B8A6" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
          <ellipse cx="90" cy="42" rx="4" ry="3" fill="#0D9488"/>
          <circle cx="88.5" cy="43" r="0.8" fill="#115E59"/>
          <circle cx="91.5" cy="43" r="0.8" fill="#115E59"/>
          {/* legs */}
          <rect x="66" y="55" width="2.5" height="9" rx="1.2"/>
          <rect x="71" y="55" width="2.5" height="9" rx="1.2"/>
          <rect x="78" y="55" width="2.5" height="9" rx="1.2"/>
          <rect x="83" y="55" width="2.5" height="9" rx="1.2"/>
        </g>

        {/* ── Network constellation (center) ── */}
        <g opacity="0.75">
          <line x1="40" y1="39" x2="50" y2="32" stroke="#7C3AED" strokeWidth="0.8"/>
          <line x1="50" y1="32" x2="60" y2="39" stroke="#3B82F6" strokeWidth="0.8"/>
          <line x1="60" y1="39" x2="57" y2="50" stroke="#06B6D4" strokeWidth="0.8"/>
          <line x1="57" y1="50" x2="43" y2="50" stroke="#06B6D4" strokeWidth="0.8"/>
          <line x1="43" y1="50" x2="40" y2="39" stroke="#7C3AED" strokeWidth="0.8"/>
          <line x1="50" y1="32" x2="50" y2="50" stroke="#3B82F6" strokeWidth="0.7" opacity="0.5"/>
          <line x1="40" y1="39" x2="57" y2="50" stroke="#6366F1" strokeWidth="0.6" opacity="0.35"/>
          <circle cx="40" cy="39" r="2.3" fill="#A855F7"/>
          <circle cx="50" cy="32" r="2.3" fill="#818CF8"/>
          <circle cx="60" cy="39" r="2.3" fill="#3B82F6"/>
          <circle cx="57" cy="50" r="2.3" fill="#0891B2"/>
          <circle cx="43" cy="50" r="2.3" fill="#06B6D4"/>
          <circle cx="50" cy="42" r="1.8" fill="#3B82F6" opacity="0.7"/>
        </g>

        {/* ── Dog — seated, middle-left ── */}
        <g opacity="0.92">
          <ellipse cx="23" cy="69" rx="9"   ry="9.5" fill="#6D28D9"/>
          <circle  cx="32" cy="59" r="7"           fill="#7C3AED"/>
          {/* droopy ears */}
          <path d="M25,56 C20,55 17,60 18,67" stroke="#5B21B6" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
          <path d="M39,56 C44,55 46,60 45,67" stroke="#5B21B6" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
          <ellipse cx="37" cy="62" rx="4"   ry="3"   fill="#4C1D95"/>
          <ellipse cx="37" cy="60.5" rx="1.5" ry="1" fill="#1A0B2E"/>
          <ellipse cx="15" cy="77"  rx="4.5" ry="2.5" fill="#5B21B6"/>
          <ellipse cx="31" cy="77"  rx="4.5" ry="2.5" fill="#5B21B6"/>
        </g>

        {/* ── Rabbit — seated, bottom-center ── */}
        <g opacity="0.88">
          <ellipse cx="47" cy="81" rx="8.5" ry="9.5" fill="#4C1D95"/>
          <circle  cx="51" cy="69" r="6.5"           fill="#5B21B6"/>
          {/* ears */}
          <ellipse cx="47" cy="57" rx="2.8" ry="8"   fill="#6D28D9"/>
          <ellipse cx="55" cy="56" rx="2.8" ry="8"   fill="#6D28D9"/>
          <ellipse cx="47" cy="57" rx="1.4" ry="5.5" fill="#7C3AED" opacity="0.4"/>
          <ellipse cx="55" cy="56" rx="1.4" ry="5.5" fill="#7C3AED" opacity="0.4"/>
          {/* tail */}
          <circle  cx="39" cy="81" r="3.2"            fill="#5B21B6"/>
          <ellipse cx="41" cy="89" rx="3.5" ry="2"    fill="#4C1D95"/>
          <ellipse cx="55" cy="89" rx="3.5" ry="2"    fill="#4C1D95"/>
        </g>

        {/* ── Cat — seated, bottom-right ── */}
        <g opacity="0.92">
          <ellipse cx="73" cy="81" rx="8.5" ry="9.5" fill="#0E7490"/>
          <circle  cx="75" cy="67" r="7"              fill="#0891B2"/>
          {/* pointed ears */}
          <path d="M69,63 L65,52 L75,60 Z" fill="#0E7490"/>
          <path d="M81,63 L85,52 L75,60 Z" fill="#0E7490"/>
          <path d="M70,62 L67,54 L74,60 Z" fill="#06B6D4" opacity="0.3"/>
          <path d="M80,62 L83,54 L76,60 Z" fill="#06B6D4" opacity="0.3"/>
          <ellipse cx="78" cy="70" rx="3.5" ry="2.5" fill="#075985"/>
          {/* curling tail */}
          <path d="M82,87 C90,82 93,89 87,94"
            stroke="#0E7490" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <ellipse cx="66" cy="89" rx="3.5" ry="2"   fill="#0E7490"/>
          <ellipse cx="80" cy="89" rx="3.5" ry="2"   fill="#0E7490"/>
        </g>

        {/* ── ECG / heartbeat line ── */}
        <path
          d="M10,91 L20,91 L22,82 L26,100 L30,89 L34,91 L52,91"
          stroke="url(#rqECG)" strokeWidth="1.9" fill="none"
          strokeLinecap="round" strokeLinejoin="round"
        />
        {/* circuit branches — left */}
        <path d="M10,91 L7,91 L7,97"   stroke="#A855F7" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M10,91 L10,98"         stroke="#A855F7" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <circle cx="7"  cy="97" r="1.7" fill="#A855F7" opacity="0.8"/>
        <circle cx="10" cy="98" r="1.7" fill="#A855F7" opacity="0.8"/>
        {/* circuit branches — right */}
        <path d="M52,91 L55,91 L55,86" stroke="#06B6D4" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M52,91 L52,85"         stroke="#06B6D4" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <circle cx="55" cy="86" r="1.7" fill="#06B6D4" opacity="0.8"/>
        <circle cx="52" cy="85" r="1.7" fill="#06B6D4" opacity="0.8"/>

        {/* ── Medical cross ── */}
        <rect x="47"   y="101" width="5.5" height="13" rx="1.8" fill="#06B6D4"/>
        <rect x="43.5" y="104.5" width="12" height="5.5" rx="1.8" fill="#06B6D4"/>

      </g>{/* end clip */}

      {/* ── Shield outline stroke ── */}
      <path
        d="M50,4 L93,18 L93,60 C90,79 73,94 50,109 C27,94 10,79 7,60 L7,18 Z"
        fill="none" stroke="url(#rqStroke)" strokeWidth="2.3"
      />
    </svg>
  );

  /* ── mark only ── */
  if (variant === "mark") return Shield;

  /* ── wordmark ── */
  const nameSize = Math.round(size * 0.58);   // ~21px at size=36
  const tagSize  = Math.round(size * 0.31);   // ~11px at size=36
  const lineW    = nameSize * 5.2;

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: Math.round(size * 0.45) }}>
      {Shield}
      <span style={{ display: "flex", flexDirection: "column", gap: 3 }}>

        {/* ResQ + Net */}
        <span style={{
          display: "flex", alignItems: "baseline",
          fontFamily: "var(--font-heading,'Plus Jakarta Sans',sans-serif)",
          fontSize: nameSize,
          fontWeight: 800,
          letterSpacing: "-0.025em",
          lineHeight: 1,
        }}>
          <span style={{ color: textMain }}>ResQ</span>
          <span style={{
            background: "linear-gradient(90deg, #06B6D4 0%, #0891B2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Net</span>
        </span>

        {/* ECG separator line */}
        <svg width={lineW} height={13} viewBox={`0 0 ${lineW} 13`} fill="none" style={{ display: "block" }}>
          <defs>
            <linearGradient id="rqWLine" x1="0" y1="6" x2={lineW} y2="6" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#A855F7"/>
              <stop offset="100%" stopColor="#06B6D4"/>
            </linearGradient>
          </defs>
          <circle cx="3"        cy="6.5" r="2.5" fill="#A855F7"/>
          <line   x1="7"  y1="6.5" x2={lineW * 0.3}  y2="6.5" stroke="#A855F7" strokeWidth="1.2"/>
          <path
            d={`M${lineW*0.3},6.5 L${lineW*0.38},6.5 L${lineW*0.42},1.5 L${lineW*0.5},11.5 L${lineW*0.54},6.5 L${lineW*0.62},6.5`}
            stroke="url(#rqWLine)" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"
          />
          <line x1={lineW*0.62} y1="6.5" x2={lineW-7} y2="6.5" stroke="#06B6D4" strokeWidth="1.2"/>
          <circle cx={lineW-3}  cy="6.5" r="2.5" fill="#06B6D4"/>
        </svg>

        {/* Tagline — only when explicitly requested */}
        {tagline && (
          <span style={{
            fontSize: tagSize,
            fontWeight: 600,
            color: textSub,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}>
            Rescue · Heal · Connect · Adopt
          </span>
        )}

      </span>
    </span>
  );
}
