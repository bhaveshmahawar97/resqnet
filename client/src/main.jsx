import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { RescueProvider } from "./context/RescueContext.jsx";
import { AdoptionProvider } from "./context/AdoptionContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import "./index.css";
import App from "./App.jsx";

// Fix default Leaflet marker icons when used with Vite and React.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RescueProvider>
          <AdoptionProvider>
            <NotificationProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </NotificationProvider>
          </AdoptionProvider>
        </RescueProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
