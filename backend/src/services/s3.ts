import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';

const isLocal = process.env.LOCAL === 'true';
const s3Client = new S3Client({});
const BUCKET_NAME = process.env.IMAGE_BUCKET || 'speckled-men-images';
const LOCAL_IMAGE_DIR = path.join(__dirname, '../../.local-images');

export async function uploadPlayerImage(
  playerId: string,
  imageBuffer: Buffer,
  contentType: string
): Promise<string> {
  const key = `images/players/${playerId}.jpg`;

  if (isLocal) {
    const filePath = path.join(LOCAL_IMAGE_DIR, key);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, imageBuffer);
    return key;
  }

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: imageBuffer,
      ContentType: contentType,
      CacheControl: 'max-age=86400',
    })
  );
  return key;
}

export async function deletePlayerImage(imageKey: string): Promise<void> {
  if (isLocal) {
    const filePath = path.join(LOCAL_IMAGE_DIR, imageKey);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return;
  }

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: imageKey,
    })
  );
}
