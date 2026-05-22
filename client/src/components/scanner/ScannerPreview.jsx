import { useT } from "../../context/ThemeContext";
import ScannerEmpty from "./ScannerEmpty";

/**
 * ScannerPreview — image preview before/after selection
 */
export default function ScannerPreview({ previewUrl }) {
  const { T } = useT();

  if (!previewUrl) {
    return <ScannerEmpty />;
  }

  return (
    <img
      src={previewUrl}
      alt="Animal preview"
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
      style={{
        width: "100%",
        maxHeight: 360,
        objectFit: "cover",
        borderRadius: 20,
        border: `1px solid ${T.border}`,
      }}
    />
  );
}
