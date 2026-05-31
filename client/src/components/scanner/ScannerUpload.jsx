import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import ScannerPreview from "./ScannerPreview";

export default function ScannerUpload({
  imageFile,
  previewUrl,
  dragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onInputChange,
  onChooseImage,
  onClear,
  isProcessing,
  error,
  fileInputRef,
}) {
  const { T } = useT();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: "var(--radius-xl)",
        boxShadow: T.shadowCard,
        overflow: "hidden",
      }}
    >
      {/* Upload Zone */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDragEnd={onDragLeave}
        onClick={() => !imageFile && fileInputRef?.current?.click()}
        style={{
          cursor: imageFile ? "default" : "pointer",
          padding: imageFile ? 0 : "3rem 2rem",
          minHeight: imageFile ? 0 : 280,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          background: dragging ? T.accentPale : imageFile ? "transparent" : T.bgAlt,
          border: imageFile ? "none" : `2px dashed ${dragging ? T.accent : T.border}`,
          borderRadius: imageFile ? 0 : "var(--radius-xl)",
          transition: "all 0.25s ease",
          position: "relative",
        }}
      >
        {imageFile ? (
          <ScannerPreview previewUrl={previewUrl} isProcessing={isProcessing} />
        ) : (
          <>
            {/* Upload Icon */}
            <motion.div
              animate={dragging ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.6, repeat: dragging ? Infinity : 0 }}
              style={{
                width: 72,
                height: 72,
                borderRadius: "var(--radius-lg)",
                background: `linear-gradient(135deg, ${T.accentPale}, ${T.accentSurface})`,
                border: `2px solid ${dragging ? T.accent : `${T.accent}30`}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: T.accent,
                transition: "border-color 0.25s ease",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </motion.div>

            {/* Instructions */}
            <div style={{ textAlign: "center", maxWidth: 320 }}>
              <div style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: T.text,
                marginBottom: "0.35rem",
                letterSpacing: "-0.01em",
              }}>
                {dragging ? "Drop image here" : "Upload Animal Photo"}
              </div>
              <div style={{
                fontSize: "0.8rem",
                color: T.textMuted,
                lineHeight: 1.6,
              }}>
                {dragging ? "Release to upload" : "Drag and drop or click to browse"}
              </div>
            </div>

            {/* Supported Formats */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.4rem 0.85rem",
              borderRadius: "var(--radius-full)",
              background: T.bgCard,
              border: `1px solid ${T.borderLight}`,
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4M12 8h.01"/>
              </svg>
              <span style={{ fontSize: "0.7rem", color: T.textMuted, fontWeight: 600 }}>
                JPEG, PNG, WebP · Max 10 MB
              </span>
            </div>
          </>
        )}
      </div>

      {/* File Info Bar (when image selected) */}
      {imageFile && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.75rem 1.25rem",
            borderTop: `1px solid ${T.border}`,
            background: T.bgAlt,
            gap: "0.75rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", minWidth: 0, flex: 1 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: "var(--radius-sm)",
              background: `${T.success}12`,
              border: `1px solid ${T.success}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12l2 2 4-4"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{
                fontSize: "0.8rem",
                color: T.text,
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {imageFile.name}
              </div>
              <div style={{ fontSize: "0.7rem", color: T.textMuted, marginTop: 1 }}>
                {(imageFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          </div>
          <div style={{
            padding: "0.25rem 0.65rem",
            borderRadius: "var(--radius-full)",
            background: `${T.success}10`,
            border: `1px solid ${T.success}25`,
            fontSize: "0.68rem",
            fontWeight: 700,
            color: T.success,
            letterSpacing: "0.03em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}>
            Ready
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          style={{ display: "none" }}
          onChange={onInputChange}
        />

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            onClick={() => fileInputRef?.current?.click()}
            style={{
              flex: 1,
              padding: "0.75rem 1.25rem",
              borderRadius: "var(--radius-md)",
              border: `1px solid ${T.border}`,
              background: T.bgAlt,
              color: T.text,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "0.85rem",
              transition: "all 0.2s ease",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = T.bgCard;
              e.currentTarget.style.borderColor = T.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = T.bgAlt;
              e.currentTarget.style.borderColor = T.border;
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
            {imageFile ? "Change Image" : "Select Image"}
          </motion.button>

          <motion.button
            whileHover={imageFile && !isProcessing ? { scale: 1.01, boxShadow: `0 4px 16px ${T.accent}40` } : {}}
            whileTap={imageFile && !isProcessing ? { scale: 0.99 } : {}}
            type="button"
            onClick={(e) => { e.stopPropagation(); onChooseImage?.(); }}
            disabled={!imageFile || isProcessing}
            style={{
              flex: 1,
              padding: "0.75rem 1.25rem",
              borderRadius: "var(--radius-md)",
              border: "none",
              background: imageFile && !isProcessing ? T.accent : T.bgAlt,
              color: imageFile && !isProcessing ? "#fff" : T.textMuted,
              fontWeight: 700,
              cursor: imageFile && !isProcessing ? "pointer" : "not-allowed",
              fontFamily: "inherit",
              fontSize: "0.85rem",
              transition: "all 0.2s ease",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              opacity: imageFile && !isProcessing ? 1 : 0.6,
            }}
          >
            {isProcessing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{
                    width: 14,
                    height: 14,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTop: "2px solid #fff",
                    borderRadius: "50%",
                  }}
                />
                Analyzing…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                Analyze Health
              </>
            )}
          </motion.button>
        </div>

        {imageFile && !isProcessing && (
          <motion.button
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            whileHover={{ background: T.bgAlt }}
            type="button"
            onClick={(e) => { e.stopPropagation(); onClear?.(); }}
            style={{
              padding: "0.6rem",
              borderRadius: "var(--radius-md)",
              border: `1px solid ${T.borderLight}`,
              background: "transparent",
              color: T.textMuted,
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "0.78rem",
              fontWeight: 600,
              transition: "all 0.2s ease",
            }}
          >
            Clear Selection
          </motion.button>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius-md)",
              border: `1px solid ${T.dangerBorder}`,
              background: T.dangerPale,
              color: T.danger,
              fontSize: "0.8rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.5rem",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span style={{ flex: 1 }}>{error}</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
