import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import { ApiError } from "./ApiError.js";

let client;

function getStorageConfig() {
  const bucket = process.env.AWS_S3_BUCKET;
  const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
  if (!bucket || !region) return null;
  return { bucket, region };
}

function getS3Client(region) {
  if (!client) client = new S3Client({ region });
  return client;
}

export async function saveProfilePhoto(userId, photo) {
  const config = getStorageConfig();
  if (!config) {
    return { user_id: userId, mime_type: photo.mime_type, image_data: photo.image_data, object_key: null };
  }

  const extension = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }[photo.mime_type];
  const objectKey = `customer-profile-photos/${userId}/${randomUUID()}.${extension}`;
  await getS3Client(config.region).send(new PutObjectCommand({
    Bucket: config.bucket,
    Key: objectKey,
    Body: photo.image_data,
    ContentType: photo.mime_type,
    CacheControl: "private, max-age=0, no-store",
    ServerSideEncryption: "AES256",
  }));
  return { user_id: userId, mime_type: photo.mime_type, image_data: null, object_key: objectKey };
}

export async function removeProfilePhotoObject(objectKey) {
  if (!objectKey) return;
  const config = getStorageConfig();
  if (!config) throw new ApiError(503, "S3 profile photo storage is not configured.");
  await getS3Client(config.region).send(new DeleteObjectCommand({ Bucket: config.bucket, Key: objectKey }));
}

export async function readProfilePhotoBytes(photo) {
  if (photo?.object_key) {
    const config = getStorageConfig();
    if (!config) throw new ApiError(503, "S3 profile photo storage is not configured.");
    const result = await getS3Client(config.region).send(new GetObjectCommand({ Bucket: config.bucket, Key: photo.object_key }));
    return Buffer.from(await result.Body.transformToByteArray());
  }
  if (photo?.image_data) return Buffer.from(photo.image_data);
  return null;
}
