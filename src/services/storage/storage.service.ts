// src/services/storage/storage.service.ts

import {
  v2 as cloudinary,
} from "cloudinary";

import {
  env,
  requireEnv,
} from "../../config/env.js";

import {
  IntegrationError,
} from "../../utils/integration-error.js";

export interface UploadDocumentInput {
  fileBuffer: Buffer;
  publicId?: string;
}

export interface StoredDocument {
  publicId: string;
  signedUrl: string;
  resourceType: string;
  format?: string;
  bytes?: number;
}

const VEHICLE_DOCUMENT_FOLDER =
  "vehicle-documents";

const USER_DOCUMENT_FOLDER =
  "user-documents";

const MAX_UPLOAD_BYTES =
  10 * 1024 * 1024;

const SIGNED_URL_TTL_SECONDS =
  60 * 60;

let cloudinaryConfigured = false;

export function uploadVehicleDocument(
  input: UploadDocumentInput,
): Promise<StoredDocument> {
  return uploadVerificationDocument(
    input,
    VEHICLE_DOCUMENT_FOLDER,
  );
}

export function uploadUserDocument(
  input: UploadDocumentInput,
): Promise<StoredDocument> {
  return uploadVerificationDocument(
    input,
    USER_DOCUMENT_FOLDER,
  );
}

async function uploadVerificationDocument(
  input: UploadDocumentInput,
  folder: string,
): Promise<StoredDocument> {
  validateUpload(input);

  configureCloudinary();

  const result =
    await uploadBufferToCloudinary(
      input.fileBuffer,
      folder,
      input.publicId,
    );

  return buildStoredDocument(result);
}

export function getSignedDocumentUrl(
  publicId: string,
  format: string,
  resourceType:
    | "image"
    | "raw"
    | "video" = "raw",
): string {
  configureCloudinary();

  return cloudinary.utils.private_download_url(
    publicId,
    format,
    {
      resource_type: resourceType,
      type: "authenticated",
      expires_at:
        Math.floor(Date.now() / 1000) +
        SIGNED_URL_TTL_SECONDS,
    },
  );
}

function validateUpload(
  input: UploadDocumentInput,
): void {
  if (
    !input ||
    !Buffer.isBuffer(input.fileBuffer)
  ) {
    throw new IntegrationError({
      provider: "cloudinary",
      code: "INVALID_INPUT",
      message:
        "A file buffer is required.",
      statusCode: 400,
    });
  }

  if (input.fileBuffer.length === 0) {
    throw new IntegrationError({
      provider: "cloudinary",
      code: "EMPTY_UPLOAD",
      message:
        "Upload buffer is empty.",
      statusCode: 400,
    });
  }

  if (
    input.fileBuffer.length >
    MAX_UPLOAD_BYTES
  ) {
    throw new IntegrationError({
      provider: "cloudinary",
      code: "INVALID_INPUT",
      message:
        "File exceeds the upload limit.",
      statusCode: 413,
    });
  }
}

function configureCloudinary(): void {
  if (cloudinaryConfigured) {
    return;
  }

  cloudinary.config({
    cloud_name: requireEnv(
      env.CLOUDINARY_CLOUD_NAME,
      "CLOUDINARY_CLOUD_NAME",
      "cloudinary",
    ),
    api_key: requireEnv(
      env.CLOUDINARY_API_KEY,
      "CLOUDINARY_API_KEY",
      "cloudinary",
    ),
    api_secret: requireEnv(
      env.CLOUDINARY_API_SECRET,
      "CLOUDINARY_API_SECRET",
      "cloudinary",
    ),
    secure: true,
  });

  cloudinaryConfigured = true;
}

function uploadBufferToCloudinary(
  fileBuffer: Buffer,
  folder: string,
  publicId?: string,
): Promise<any> {
  return new Promise(
    (resolve, reject) => {
      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            folder,
            public_id: publicId,
            resource_type: "auto",
            type: "authenticated",
            overwrite: false,
          },
          (error, result) => {
            if (error) {
              reject(
                new IntegrationError({
                  provider: "cloudinary",
                  code: "PROVIDER_REJECTED",
                  message:
                    "Cloudinary rejected the upload.",
                  statusCode: 502,
                  cause: error,
                }),
              );

              return;
            }

            if (!result?.public_id) {
              reject(
                new IntegrationError({
                  provider: "cloudinary",
                  code: "INVALID_RESPONSE",
                  message:
                    "Cloudinary returned an invalid response.",
                  statusCode: 502,
                  cause: result,
                }),
              );

              return;
            }

            resolve(result);
          },
        );

      uploadStream.end(fileBuffer);
    },
  );
}

function buildStoredDocument(
  result: any,
): StoredDocument {
  const resourceType =
    result.resource_type ?? "raw";

  const format =
    result.format ?? "bin";

  return {
    publicId: result.public_id,
    signedUrl:
      getSignedDocumentUrl(
        result.public_id,
        format,
        resourceType,
      ),
    resourceType,
    format: result.format,
    bytes: result.bytes,
  };
}