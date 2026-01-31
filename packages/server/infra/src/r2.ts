import { S3Client } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

if (!process.env.R2_ACCOUNT_ID) {
  throw new Error("R2_ACCOUNT_ID environment variable is not set");
}

if (!process.env.R2_ACCESS_KEY_ID) {
  throw new Error("R2_ACCESS_KEY_ID environment variable is not set");
}

if (!process.env.R2_SECRET_ACCESS_KEY) {
  throw new Error("R2_SECRET_ACCESS_KEY environment variable is not set");
}

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: accessKeyId || "",
    secretAccessKey: secretAccessKey || "",
  },
});
