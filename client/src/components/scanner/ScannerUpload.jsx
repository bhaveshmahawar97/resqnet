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
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDragEnd={onDragLeave}
      style={{
        borderRadius: 12,
        border: `1.5px dashed ${dragging ? T.accent : T.border}`,
        background: dragging ? T.accentPale : T.bgCard,
        transition: "border-color 0.2s, background 0.2s",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        overflow: "hidden",
      }}
    >
      {/* Drop zone / preview */}
      <div
        onClick={() => !imageFile && fileInputRef?.current?.click()}
        style={{
          cursor: imageFile ? "default" : "pointer",
          padding: imageFile ? 0 : "2.5rem 2rem",
          minHeight: imageFile ? 0 : 200,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
        }}
      >
        {imageFile ? (
          <ScannerPreview previewUrl={previewUrl} />
        ) : (
          <>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: T.accentPale,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: T.accent,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: T.text, marginBottom: "0.25rem" }}>
                Drop animal photo here
              </div>
              <div style={{ fontSize: "0.76rem", color: T.textMuted }}>
                JPEG · PNG · WebP · max 5 MB
              </div>
            </div>
          </>
        )}
      </div>

      {/* File info bar (when image selected) */}
      {imageFile && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.65rem 1rem",
            borderTop: `1px solid ${T.border}`,
            background: T.bgAlt,
            gap: "0.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.success} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" />
            </svg>
            <span style={{ fontSize: "0.76rem", color: T.text, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {imageFile.name}
            </span>
          </div>
          <span style={{ fontSize: "0.7rem", color: T.textMuted, flexShrink: 0 }}>
            {(imageFile.size / 1024).toFixed(0)} KB
          </span>
        </div>
      )}

      {/* Actions */}
      <div style={{ padding: "0 1rem 1rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          style={{ display: "none" }}
          onChange={onInputChange}
        />

        <div style={{ display: "flex", gap: "0.6rem" }}>
          <button
            type="button"
            onClick={() => fileInputRef?.current?.click()}
            style={{
              flex: 1,
              padding: "0.7rem 1rem",
              borderRadius: 8,
              border: `1px solid ${T.border}`,
              background: T.bgAlt,
              color: T.text,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "0.82rem",
            }}
          >
            {imageFile ? "Change Image" : "Select Image"}
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChooseImage?.(); }}
            disabled={!imageFile || isProcessing}
            style={{
              flex: 1,
              padding: "0.7rem 1rem",
              borderRadius: 8,
              border: "none",
              background: imageFile && !isProcessing ? T.accent : T.bgAlt,
              color: imageFile && !isProcessing ? "#fff" : T.textMuted,
              fontWeight: 700,
              cursor: imageFile && !isProcessing ? "pointer" : "not-allowed",
              fontFamily: "inherit",
              fontSize: "0.82rem",
              transition: "background 0.2s",
            }}
          >
            {isProcessing ? "Analyzing…" : "Scan Animal"}
          </button>
        </div>

        {imageFile && !isProcessing && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClear?.(); }}
            style={{
              padding: "0.55rem",
              borderRadius: 8,
              border: `1px solid ${T.border}`,
              background: "transparent",
              color: T.textMuted,
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "0.76rem",
            }}
          >
            Clear selection
          </button>
        )}

        {error && (
          <div
            style={{
              padding: "0.6rem 0.85rem",
              borderRadius: 8,
              border: `1px solid ${T.dangerBorder}`,
              background: T.dangerPale,
              color: T.danger,
              fontSize: "0.78rem",
            }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
