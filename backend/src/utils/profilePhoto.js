import { ApiError } from "./ApiError.js";

const MAX_PHOTO_BYTES = 900 * 1024;
const signatures = {
  "image/jpeg": (b) => b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[b.length - 2] === 0xff && b[b.length - 1] === 0xd9,
  "image/png": (b) => b.length > 8 && b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
  "image/webp": (b) => b.length > 12 && b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP",
};

export function parseProfilePhoto(value) {
  if (typeof value !== "string" || value.length > 1_300_000) throw new ApiError(400, "Choose a profile photo under 900 KB.");
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  if (!match) throw new ApiError(400, "Upload a JPEG, PNG, or WebP image.");
  const [, mimeType, encoded] = match;
  const bytes = Buffer.from(encoded, "base64");
  if (!bytes.length || bytes.length > MAX_PHOTO_BYTES || !signatures[mimeType](bytes)) throw new ApiError(400, "That image is invalid or larger than 900 KB.");
  return { mime_type: mimeType, image_data: bytes };
}

export function profilePhotoDataUrl(photo) {
  if (!photo) return null;
  return `data:${photo.mime_type};base64,${Buffer.from(photo.image_data).toString("base64")}`;
}
