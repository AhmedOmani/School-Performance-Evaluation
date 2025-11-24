import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

const s3Client = new S3Client({
    region: process.env.AWS_REGION || "eu-north-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    }
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "";

export async function uploadFileToS3(file: File, folder: string): Promise<string> {
    if (!BUCKET_NAME) {
        throw new Error("S3 bucket name is not configured.");
    }

    const fileExtension = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const s3Key = `${folder}/${fileName}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: buffer,
        ContentType: file.type,
        ACL: "private",
    });
    await s3Client.send(command);
    return s3Key;
}

export async function getPresignedUrl(s3Key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
    });
    return await getSignedUrl(s3Client, command, { expiresIn });
}

export async function getPresignedUploadUrl(
    folder: string,
    filename: string,
    contentType: string,
    expiresIn: number = 3600
): Promise<{ uploadUrl: string; key: string }> {
    if (!BUCKET_NAME) {
        throw new Error("S3 bucket name is not configured.");
    }

    const fileExtension = filename.split(".").pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const key = `${folder}/${uniqueFileName}`;

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: contentType,
        ACL: "private",
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return { uploadUrl, key };
}

export async function deleteFileFromS3(key: string): Promise<void> {
    if (!BUCKET_NAME) {
        throw new Error("S3 bucket name is not configured.");
    }

    const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });

    await s3Client.send(command);
}

export function isS3Configured(): boolean {
    return !!(process.env.AWS_ACCESS_KEY_ID &&
        process.env.AWS_SECRET_ACCESS_KEY &&
        process.env.AWS_REGION &&
        process.env.S3_BUCKET_NAME
    );
}