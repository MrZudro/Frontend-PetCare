import axios from 'axios';

const CLOUD_NAME = 'drno3xmuy';
const UPLOAD_PRESET = 'my_unsigned_preset';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/**
 * Uploads an image file to Cloudinary.
 * @param {File} file - The image file to upload.
 * @returns {Promise<string>} - The URL of the uploaded image.
 */
export const uploadImageToCloudinary = async (file) => {
  if (!file) {
    throw new Error('No file provided');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const response = await axios.post(CLOUDINARY_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};
