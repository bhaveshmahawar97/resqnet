import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useT } from "../context/ThemeContext";
import useViewport from "../hooks/useViewport";
import { uploadToCloudinary, scanAnimal } from "../services/aiService";
import { getApiErrorMessage } from "../utils/apiErrors";
import ScannerUpload from "../components/scanner/ScannerUpload";
import ScannerResult from "../components/scanner/ScannerResult";
import ScannerRecommendations from "../components/scanner/ScannerRecommendations";
import ScannerHistory from "../components/scanner/ScannerHistory";
import ScannerLoader from "../components/scanner/ScannerLoader";
import { validateImageFile } from "../components/scanner/scannerUtils";

export default function Scanner() {
  const { T } = useT();
  const vp = useViewport();
  const fileInputRef = useRef(null);
  const uploadSectionRef = useRef(null);

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState("");

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const scrollToUpload = useCallback(() => {
    uploadSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    fileInputRef.current?.click();
  }, []);

  const setFileFromInput = (file) => {
    if (!file) return;
    const validation = validateImageFile(file);
    if (!validation.valid) { setScanError(validation.error); return; }
    setScanError("");
    setImageFile(file);
    setScanResult(null);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrop = (e) => { e.preventDefault(); setDragging(false); setFileFromInput(e.dataTransfer.files?.[0]); };

  const clearSelection = () => {
    setImageFile(null); setScanResult(null); setScanError("");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
  };

  const handleScan = async () => {
    if (!imageFile) { setScanError("Select an animal image before starting the scan."); return; }
    setScanError(""); setUploading(true); setIsProcessing(true); setScanResult(null);
    try {
      const cloudUrl = await uploadToCloudinary(imageFile);
      const scanData = await scanAnimal(cloudUrl, imageFile.name);
      setScanResult({ ...scanData, imageUrl: cloudUrl });
    } catch (error) {
      setScanError(getApiErrorMessage(error, "Image analysis failed."));
    } finally {
      setUploading(false); setIsProcessing(false);
    }
  };

  const isBusy = uploading || isProcessing;

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: T.bg, color: T.text }}>
      {/* Professional Header */}
      <div style={{
        background: T.bgAlt,
        borderBottom: `1px solid ${T.border}`,
        paddingTop: vp.mobile ? 72 : 80,
      }}>
        <div style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: vp.mobile ? "1.5rem 1rem 1.25rem" : "2rem clamp(1.25rem, 4vw, 3.5rem) 1.5rem",
        }}>
          <div style={{
            display: "flex",
            alignItems: vp.mobile ? "flex-start" : "center",
            justifyContent: "space-between",
            flexDirection: vp.mobile ? "column" : "row",
            gap: "1rem",
          }}>
            {/* Left: Title + Badge */}
            <div>
              {/* AI Badge */}
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.25rem 0.75rem",
                borderRadius: "var(--radius-full)",
                background: `${T.accent}10`,
                border: `1px solid ${T.accent}30`,
                marginBottom: "0.75rem",
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <span style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: T.accent,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}>
                  AI-Powered Assessment
                </span>
              </div>

              <h1 style={{
                fontSize: vp.mobile ? "1.5rem" : "clamp(1.75rem, 3vw, 2.2rem)",
                fontWeight: 900,
                letterSpacing: "-0.035em",
                lineHeight: 1.1,
                color: T.textHeading,
                margin: "0 0 0.5rem",
              }}>
                Animal Health Assessment
              </h1>
              <p style={{
                fontSize: "0.9rem",
                color: T.textSub,
                margin: 0,
                lineHeight: 1.65,
                maxWidth: 560,
              }}>
                Upload an image to receive an AI-powered health assessment, injury detection, and rescue recommendations from our veterinary-trained model.
              </p>
            </div>

            {/* Right: Quick Action */}
            {!imageFile && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={scrollToUpload}
                style={{
                  padding: "0.65rem 1.25rem",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  background: T.accent,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  boxShadow: `0 2px 8px ${T.accent}40`,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
                Upload Image
              </motion.button>
            )}
          </div>

          {/* Disclaimer */}
          <div style={{
            marginTop: "1.25rem",
            padding: "0.65rem 0.85rem",
            borderRadius: "var(--radius-md)",
            background: `${T.info}08`,
            border: `1px solid ${T.info}20`,
            display: "flex",
            alignItems: "flex-start",
            gap: "0.5rem",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.info} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
            <span style={{ fontSize: "0.75rem", color: T.textSub, lineHeight: 1.6 }}>
              <strong style={{ fontWeight: 700, color: T.text }}>Diagnostic Aid:</strong> This AI assessment is a triage tool. Always consult a licensed veterinarian for medical decisions.
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: vp.mobile ? "1.5rem 1rem 3rem" : "2rem clamp(1.25rem, 4vw, 3.5rem) 3rem",
      }}>
        <div ref={uploadSectionRef}>
          <div style={{
            display: "grid",
            gridTemplateColumns: vp.mobile ? "1fr" : vp.tablet ? "1fr" : "1fr 1.1fr",
            gap: "1.5rem",
            alignItems: "start",
          }}>
            {/* Upload Panel */}
            <ScannerUpload
              imageFile={imageFile}
              previewUrl={previewUrl}
              dragging={dragging}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onInputChange={(e) => setFileFromInput(e.target.files?.[0])}
              onChooseImage={handleScan}
              onClear={clearSelection}
              isProcessing={isBusy}
              error={scanError}
              fileInputRef={fileInputRef}
            />

            {/* Results Panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {isBusy ? (
                <ScannerLoader label={uploading ? "Uploading image…" : "Analyzing with AI…"} />
              ) : (
                <>
                  <ScannerResult result={scanResult} />
                  <ScannerRecommendations result={scanResult} />
                </>
              )}
            </div>
          </div>
        </div>

        {/* History Section */}
        <div style={{ marginTop: "3rem" }}>
          <ScannerHistory />
        </div>
      </div>
    </div>
  );
}
