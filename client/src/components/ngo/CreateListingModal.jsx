import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAdoptionListingSchema } from "../../utils/validators";
import { createAdoptionListing } from "../../services/adoptionService";
import { uploadToCloudinary } from "../../services/aiService";
import { useT } from "../../context/ThemeContext";
import { DashboardModal } from "../dashboard/DashboardShared";
import Button from "../ui/Button";

function Field({ label, error, children }) {
  const { T } = useT();
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <label style={{ fontSize: "0.76rem", fontWeight: 700, color: T.textMuted }}>{label}</label>
      {children}
      {error && <div style={{ color: T.danger, fontSize: "0.72rem" }}>{error}</div>}
    </div>
  );
}

export default function CreateListingModal({ isOpen, onClose, initialData, onSuccess }) {
  const { T } = useT();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageError, setImageError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createAdoptionListingSchema),
    defaultValues: {
      animalName: "",
      animalType: initialData?.animalType || "",
      age: "",
      healthStatus: initialData?.condition || "",
      city: "",
      description: initialData?.description || "",
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowed.includes(file.type)) {
      setImageError("PNG, JPG, WEBP only.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setImageError("Max 8MB.");
      return;
    }
    setImageError("");
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleClose = () => {
    reset();
    setSelectedFile(null);
    setImagePreview(null);
    setImageError("");
    onClose();
  };

  const onSubmit = async (data) => {
    if (!selectedFile) {
      setImageError("Image is required");
      return;
    }
    setLoading(true);
    try {
      const imageUrl = await uploadToCloudinary(selectedFile);
      const payload = {
        sourceRescue: initialData?.sourceRescue || null,
        animalName: data.animalName,
        animalType: data.animalType,
        healthStatus: data.healthStatus,
        city: data.city,
        description: data.description,
        images: [imageUrl],
        metadata: { age: data.age },
      };
      const result = await createAdoptionListing(payload);
      if (!result.success) throw new Error(result.message || "Failed to create listing");
      
      onSuccess?.();
      handleClose();
    } catch (err) {
      alert(err.message || "Unable to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardModal isOpen={isOpen} title="Create Adoption Listing" onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: 14 }}>
        <Field label="Animal Name" error={errors.animalName?.message}>
          <input {...register("animalName")} disabled={loading} placeholder="e.g. Luna" className="rq-input" style={{ borderColor: errors.animalName ? "#EF4444" : undefined }} />
        </Field>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Species" error={errors.animalType?.message}>
            <input {...register("animalType")} disabled={loading} placeholder="Dog, Cat…" className="rq-input" style={{ borderColor: errors.animalType ? "#EF4444" : undefined }} />
          </Field>
          <Field label="Age" error={errors.age?.message}>
            <input {...register("age")} disabled={loading} placeholder="2 years" className="rq-input" style={{ borderColor: errors.age ? "#EF4444" : undefined }} />
          </Field>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Health Status" error={errors.healthStatus?.message}>
            <input {...register("healthStatus")} disabled={loading} placeholder="Healthy, Recovering…" className="rq-input" style={{ borderColor: errors.healthStatus ? "#EF4444" : undefined }} />
          </Field>
          <Field label="City" error={errors.city?.message}>
            <input {...register("city")} disabled={loading} placeholder="Location of animal" className="rq-input" style={{ borderColor: errors.city ? "#EF4444" : undefined }} />
          </Field>
        </div>
        
        <Field label="Description" error={errors.description?.message}>
          <textarea {...register("description")} disabled={loading} placeholder="Background or care notes" className="rq-textarea" style={{ borderColor: errors.description ? "#EF4444" : undefined }} />
        </Field>
        
        <Field label="Image" error={imageError}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <label htmlFor="listing-image" className="rq-btn rq-btn-outline" style={{ cursor: loading ? "not-allowed" : "pointer" }}>
              {selectedFile ? "Change" : "Upload"}
            </label>
            <span style={{ color: T.textMuted, fontSize: "0.72rem" }}>PNG, JPG, WEBP</span>
          </div>
          <input id="listing-image" type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleImageChange} disabled={loading} style={{ display: "none" }} />
          {imagePreview && (
            <div style={{ width: "100%", maxWidth: 280, borderRadius: 10, overflow: "hidden", border: `1px solid ${T.border}`, marginTop: 6 }}>
              <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
          )}
        </Field>
        
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
          <Button type="button" variant="ghost" disabled={loading} onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={loading}>{loading ? "Creating…" : "Create Listing"}</Button>
        </div>
      </form>
    </DashboardModal>
  );
}
