import axios from "axios";
// import { config } from "../config/envConfig";
import { showToast, ToastType } from "../shared/toast";

// const { cloudName, uploadPreset } = config.cloudinary;

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/dzyusd4at/upload`;


/**
 * Upload 1 ảnh lên Cloudinary
 * @param {File} file - File ảnh cần upload
 * @returns {Promise<string>} - Trả về URL ảnh đã upload
 */
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
formData.append("upload_preset", 'zsg26eg4');


  try {
    const response = await axios.post(CLOUDINARY_URL, formData);
    return response.data.secure_url;
  } catch (error) {
    showToast(ToastType.ERROR, "Lỗi khi upload ảnh cloudinary");
    throw error;
  }
};

/**
 * Upload nhiều ảnh lên Cloudinary
 * @param {File[]} files - Danh sách file ảnh cần upload
 * @returns {Promise<string[]>} - Trả về danh sách URL ảnh đã upload
 */
export const uploadMultipleImages = async (
  files: File[]
): Promise<string[]> => {
  const uploadPromises = files.map((file) => uploadImage(file));
  return Promise.all(uploadPromises);
};
