import express from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const router = express.Router();
const upload = multer();

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Get presigned URL for uploading
router.post('/presigned-url', async (req, res) => {
  try {
    const userId = req.auth?.payload.sub;
    const { fileName, fileType } = req.body;
    const key = `${userId}/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      ContentType: fileType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    res.json({ presignedUrl, key });
  } catch (error) {
    res.status(500).json({ message: 'Error generating upload URL' });
  }
});

export default router;