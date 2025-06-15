import cloudinary from "../config/cloudinary";

/**
 * Upload file buffer (dùng cho file upload từ FE)
 */
export const uploadFileBufferToCloudinary = async (
  fileBuffer: Buffer,
  folder: string = "products"
): Promise<{ url: string; publicId: string }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error || !result) {
          console.error("Cloudinary Upload Error:", error);
          return reject(error);
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    stream.end(fileBuffer);
  });
};

/**
 * Upload bằng URL (dùng cho link online, base64)
 */
export const uploadImageUrlToCloudinary = async (
  url: string,
  folder: string = "products"
): Promise<{ url: string; publicId: string } | null> => {
  try {
    const result = await cloudinary.uploader.upload(url, { folder });
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};
