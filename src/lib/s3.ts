import AWS from "aws-sdk";
import sharp from "sharp";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

/**
 * Uploads an image file to S3 after optimization using sharp.
 */
export const uploadImageToS3 = async (
  file: File,
  folderPath: string,
  bucketName: string = process.env.AWS_S3_BUCKET_NAME!
): Promise<{ url: string }> => {
  if (!bucketName) {
    throw new Error("S3 bucket name is not configured.");
  }

  try {
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;

    // Optimize the image using sharp
    const optimizedBuffer = await sharp(imageBuffer)
      .resize({ width: 800, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Prepare upload parameters
    const uploadParams = {
      Bucket: bucketName,
      Key: `${folderPath}/${filename}`,
      Body: optimizedBuffer,
      ContentType: file.type || "image/jpeg",
    };

    // Upload to S3
    const uploadResult = await s3.upload(uploadParams).promise();

    return { url: uploadResult.Location };
  } catch (error) {
    console.error("Failed to upload image to S3:", error);
    throw new Error("Image upload failed.");
  }
};

export default s3;
