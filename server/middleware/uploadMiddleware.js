import multer from "multer";
import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary.js";

const UPLOAD_FOLDER = "resqnet/rescues";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 6;

const allowedMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

/**
 * Buffers the incoming multer stream and uploads to Cloudinary.
 * More reliable than piping directly when busboy/multer stream edges occur.
 */
class CloudinaryStorage {
  constructor(options = {}) {
    this.cloudinary = options.cloudinary;
    this.params = options.params || {};
  }

  _handleFile(req, file, cb) {
    if (!isCloudinaryConfigured()) {
      return cb(
        new Error(
          "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
        )
      );
    }

    if (!file?.stream) {
      return cb(new Error("Upload stream unavailable"));
    }

    const chunks = [];

    file.stream.on("data", (chunk) => chunks.push(chunk));
    file.stream.on("error", (err) => {
      console.error("MULTER STREAM ERROR:", err);
      cb(err);
    });
    file.stream.on("end", () => {
      const buffer = Buffer.concat(chunks);

      if (!buffer.length) {
        return cb(new Error("Empty image file"));
      }

      const uploadOptions = {
        folder: this.params.folder || UPLOAD_FOLDER,
        resource_type: "image",
      };

      const uploadStream = this.cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error("CLOUDINARY UPLOAD ERROR:", error);
            return cb(error);
          }

          if (process.env.NODE_ENV !== "production") {
            console.log("CLOUDINARY UPLOAD OK:", result.public_id, result.secure_url);
          }

          cb(null, {
            path: result.secure_url || result.url,
            filename: result.public_id,
            bytes: result.bytes,
            originalname: file.originalname,
          });
        }
      );

      uploadStream.end(buffer);
    });
  }

  _removeFile(req, file, cb) {
    if (!file?.filename) {
      return cb(null);
    }

    this.cloudinary.uploader.destroy(file.filename, { resource_type: "image" }, cb);
  }
}

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: UPLOAD_FOLDER },
});

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WebP images are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES,
  },
});

/**
 * Wraps multer so upload errors return 400 JSON instead of unhandled 500s.
 */
export const handleRescueUpload = (req, res, next) => {
  upload.array("images", MAX_FILES)(req, res, (err) => {
    if (!err) {
      if (process.env.NODE_ENV !== "production") {
        console.log("UPLOAD PARSE:", {
          bodyKeys: Object.keys(req.body || {}),
          fileCount: Array.isArray(req.files) ? req.files.length : 0,
        });
      }
      return next();
    }

    console.error("RESCUE UPLOAD MIDDLEWARE ERROR:", err);

    if (err instanceof multer.MulterError) {
      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? "Image too large. Maximum size is 5MB per file."
          : err.code === "LIMIT_FILE_COUNT"
            ? `Maximum ${MAX_FILES} images allowed.`
            : err.message;

      return res.status(400).json({ success: false, message });
    }

    return res.status(400).json({
      success: false,
      message: err.message || "Image upload failed",
    });
  });
};

/**
 * Single-image upload wrapper for AI scan endpoint.
 * Exposes `req.file` with Cloudinary upload result (path, filename, bytes).
 */
export const handleAiUpload = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (!err) {
      if (process.env.NODE_ENV !== "production") {
        console.log("AI UPLOAD PARSE:", {
          bodyKeys: Object.keys(req.body || {}),
          filePresent: Boolean(req.file),
        });
      }
      return next();
    }

    console.error("AI UPLOAD MIDDLEWARE ERROR:", err);

    if (err instanceof multer.MulterError) {
      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? "Image too large. Maximum size is 5MB."
          : err.code === "LIMIT_FILE_COUNT"
          ? `Maximum ${MAX_FILES} images allowed.`
          : err.message;

      return res.status(400).json({ success: false, message });
    }

    return res.status(400).json({
      success: false,
      message: err.message || "Image upload failed",
    });
  });
};

export default upload;
