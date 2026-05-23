import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import ScannerPreview from "./ScannerPreview";

/**
 * ScannerUpload - Upload and preview area
 * Handles file selection, preview, and drag-drop
 */
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
      onClick={() => fileInputRef?.current?.click()}
      style={{
        cursor: "pointer",
        borderRadius: 14,
        border: `1px solid ${dragging ? T.accent : T.border}`,
        background: dragging ? T.accentPale : T.bgCard,
        padding: "2rem",
        minHeight: 320,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "1rem",
        transition: "border-color 0.2s ease, background 0.2s ease",
      }}
    >
      <div style={{ display: "grid", gap: "0.85rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: T.accentPale,
              display: "grid",
              placeItems: "center",
              fontSize: "1.35rem",
            }}
          >
            📷
          </div>
          <div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: T.text }}>
              Upload or drop an animal photo
            </div>
            <div style={{ fontSize: "0.86rem", color: T.textMuted }}>
              JPEG, PNG, WebP · max 5 MB
            </div>
          </div>
        </div>

        <ScannerPreview previewUrl={previewUrl} />
        <div style={{ fontSize: "0.82rem", color: T.textMuted, marginTop: "0.5rem" }}>
          <strong style={{ color: T.text }}>Supported animals:</strong> dog, cat, cow, bird, horse, puppy, kitten
          <div style={{ marginTop: 6 }}>
            <strong style={{ color: T.text }}>Example filenames:</strong> dog_injury.jpg, cow_rescue.png, cat_wound.jpeg
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: "0.85rem" }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          style={{ display: "none" }}
          onChange={onInputChange}
        />

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef?.current?.click();
            }}
            type="button"
            style={{
              flex: 1,
              minWidth: 140,
              padding: "0.95rem 1rem",
              borderRadius: 10,
              border: "none",
              background: T.accent,
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Choose Image
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              onChooseImage?.();
            }}
            type="button"
            disabled={!imageFile || isProcessing}
            style={{
              flex: 1,
              minWidth: 140,
              padding: "0.95rem 1rem",
              borderRadius: 10,
              border: `1px solid ${imageFile ? T.accent : T.border}`,
              background: imageFile ? T.accent : T.bgAlt,
              color: imageFile ? "#fff" : T.textMuted,
              fontWeight: 700,
              cursor: imageFile ? "pointer" : "not-allowed",
              fontFamily: "inherit",
            }}
          >
            {isProcessing ? "Analyzing…" : "Run AI Scan"}
          </motion.button>
        </div>

        {imageFile && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear?.();
            }}
            style={{
              padding: "0.85rem 1rem",
              borderRadius: 10,
              border: `1px solid ${T.border}`,
              background: T.bgAlt,
              color: T.text,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Clear selection
          </button>
        )}

        {error && (
          <div style={{ color: "#DC2626", fontSize: "0.92rem", marginTop: "0.25rem" }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
