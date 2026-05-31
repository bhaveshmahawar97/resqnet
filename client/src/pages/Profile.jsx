import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useT } from "../context/ThemeContext";
import PageHeader from "../components/ui/PageHeader";

export default function Profile() {
  const { name, email, role, avatar, age, phone, updateProfile } = useAuth();
  const { T } = useT();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: name || "",
    age: age || "",
    phone: phone || "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(avatar);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const fileInputRef = useRef(null);

  // Sync state if context changes (e.g. after refresh)
  useEffect(() => {
    setFormData({
      fullName: name || "",
      age: age || "",
      phone: phone || "",
    });
    setPreview(avatar);
  }, [name, age, phone, avatar]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const data = new FormData();
    data.append("fullName", formData.fullName);
    if (formData.age) data.append("age", formData.age);
    if (formData.phone) data.append("phone", formData.phone);
    if (selectedFile) data.append("avatar", selectedFile);

    const res = await updateProfile(data);
    if (res.success) {
      setMessage("Profile updated successfully!");
      setIsEditing(false);
    } else {
      setMessage(res.message || "Failed to update profile.");
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "8px",
    border: `1px solid ${T.borderInput}`,
    background: T.bgInput,
    color: T.text,
    fontSize: "0.95rem",
    marginTop: "0.5rem"
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
      <PageHeader 
        title="My Profile" 
        subtitle="Manage your personal information and account settings" 
      />
      <div style={{
        background: T.bgCard,
        borderRadius: 16,
        padding: "2rem",
        border: `1px solid ${T.border}`,
        marginTop: "2rem"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h3 style={{ color: T.textHeading, margin: 0 }}>Profile Details</h3>
          {!isEditing && (
            <button 
              onClick={() => {
                setIsEditing(true);
                setMessage("");
              }}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                background: T.accent,
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Edit Profile
            </button>
          )}
        </div>
        
        {message && (
          <div style={{
            padding: "1rem", 
            marginBottom: "1.5rem", 
            borderRadius: "8px",
            background: message.includes("success") ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
            color: message.includes("success") ? "#10B981" : "#EF4444",
            border: `1px solid ${message.includes("success") ? "#10B981" : "#EF4444"}`
          }}>
            {message}
          </div>
        )}

        {!isEditing ? (
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            <div style={{ flexShrink: 0 }}>
              {preview ? (
                <img 
                  src={preview} 
                  alt="Avatar" 
                  style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", border: `2px solid ${T.border}` }}
                />
              ) : (
                <div style={{ 
                  width: 120, height: 120, borderRadius: "50%", background: T.bgInput, 
                  display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${T.border}`, color: T.textSub
                }}>
                  No Image
                </div>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", flex: 1 }}>
              <div>
                <strong style={{ color: T.textSub, fontSize: "0.85rem" }}>Name:</strong>
                <div style={{ color: T.text, fontSize: "1.1rem", fontWeight: "600", marginTop: "0.25rem" }}>{name}</div>
              </div>
              <div>
                <strong style={{ color: T.textSub, fontSize: "0.85rem" }}>Email:</strong>
                <div style={{ color: T.text, marginTop: "0.25rem" }}>{email}</div>
              </div>
              <div>
                <strong style={{ color: T.textSub, fontSize: "0.85rem" }}>Role:</strong>
                <div style={{ color: T.text, marginTop: "0.25rem", textTransform: "capitalize" }}>{role}</div>
              </div>
              <div>
                <strong style={{ color: T.textSub, fontSize: "0.85rem" }}>Phone:</strong>
                <div style={{ color: T.text, marginTop: "0.25rem" }}>{phone || "Not provided"}</div>
              </div>
              <div>
                <strong style={{ color: T.textSub, fontSize: "0.85rem" }}>Age:</strong>
                <div style={{ color: T.text, marginTop: "0.25rem" }}>{age || "Not provided"}</div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <div style={{ position: "relative", cursor: "pointer" }} onClick={() => fileInputRef.current.click()}>
                {preview ? (
                  <img 
                    src={preview} 
                    alt="Avatar" 
                    style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: `2px solid ${T.accent}` }}
                  />
                ) : (
                  <div style={{ 
                    width: 100, height: 100, borderRadius: "50%", background: T.bgInput, 
                    display: "flex", alignItems: "center", justifyContent: "center", border: `2px dashed ${T.border}`, color: T.textSub
                  }}>
                    Upload
                  </div>
                )}
                <div style={{
                  position: "absolute", bottom: 0, right: 0, background: T.accent, color: "white", 
                  borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                </div>
              </div>
              <div style={{ color: T.textSub, fontSize: "0.9rem" }}>
                Click the image to upload a new avatar.<br/>Max size: 5MB (JPG, PNG).
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/jpeg, image/png"
                style={{ display: "none" }}
              />
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ color: T.textSub, fontWeight: "bold", fontSize: "0.85rem" }}>Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} style={inputStyle} required />
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: T.textSub, fontWeight: "bold", fontSize: "0.85rem" }}>Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} style={inputStyle} placeholder="e.g. +1 234 567 890" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: T.textSub, fontWeight: "bold", fontSize: "0.85rem" }}>Age</label>
                  <input type="number" name="age" value={formData.age} onChange={handleInputChange} style={inputStyle} min="0" placeholder="e.g. 30" />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1rem" }}>
              <button 
                type="button" 
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ fullName: name || "", age: age || "", phone: phone || "" });
                  setPreview(avatar);
                  setSelectedFile(null);
                  setMessage("");
                }}
                style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", background: "transparent", color: T.text, border: `1px solid ${T.border}`, cursor: "pointer", fontWeight: "bold" }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", background: T.accent, color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer", fontWeight: "bold", opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
