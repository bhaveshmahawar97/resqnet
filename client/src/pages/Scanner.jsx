import { useState, useEffect, useRef, useCallback } from "react";
import { useT } from "../context/ThemeContext";
import useViewport from "../hooks/useViewport";
import { uploadToCloudinary, scanAnimal } from "../services/aiService";
import { getApiErrorMessage } from "../utils/apiErrors";
import ScannerUpload from "../components/scanner/ScannerUpload";
import ScannerResult from "../components/scanner/ScannerResult";
import ScannerRecommendations from "../components/scanner/ScannerRecommendations";
import ScannerHero from "../components/scanner/ScannerHero";
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
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const scrollToUpload = useCallback(() => {
    uploadSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    fileInputRef.current?.click();
  }, []);

  const setFileFromInput = (file) => {
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setScanError(validation.error);
      return;
    }

    setScanError("");
    setImageFile(file);
    setScanResult(null);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleInputChange = (event) => {
    setFileFromInput(event.target.files?.[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    setFileFromInput(event.dataTransfer.files?.[0]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const clearSelection = () => {
    setImageFile(null);
    setScanResult(null);
    setScanError("");
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");
  };

  const handleScan = async () => {
    if (!imageFile) {
      setScanError("Select an animal image before starting the scan.");
      return;
    }

    setScanError("");
    setUploading(true);
    setIsProcessing(true);
    setScanResult(null);

    try {
      const cloudUrl = await uploadToCloudinary(imageFile);
      const scanData = await scanAnimal(cloudUrl, imageFile.name);
      setScanResult({ ...scanData, imageUrl: cloudUrl });
    } catch (error) {
      setScanError(getApiErrorMessage(error, "Image analysis failed."));
    } finally {
      setUploading(false);
      setIsProcessing(false);
    }
  };

  const isBusy = uploading || isProcessing;

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: T.bg, color: T.text }}>
      <section
        style={{
          width: "100%",
          padding: "3rem clamp(1.25rem, 4vw, 3.5rem)",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <ScannerHero onStartScan={scrollToUpload} />

        <div ref={uploadSectionRef}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: vp.mobile ? "1fr" : "1.35fr 1fr",
              gap: "1.25rem",
              alignItems: "start",
            }}
          >
            <ScannerUpload
              imageFile={imageFile}
              previewUrl={previewUrl}
              dragging={dragging}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onInputChange={handleInputChange}
              onChooseImage={handleScan}
              onClear={clearSelection}
              isProcessing={isBusy}
              error={scanError}
              fileInputRef={fileInputRef}
            />

            <div style={{ display: "grid", gap: "1rem" }}>
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

        <ScannerHistory />
      </section>
    </div>
  );
}
