export const config = {
  server: {
    baseURL: import.meta.env.VITE_API_BASE_URL,
    socketURL: import.meta.env.VITE_WSS_BASE_URL,
  },
  cloudinary: {
    cloudName: import.meta.env.VITE_CLOUD_NAME,
    uploadPreset: import.meta.env.VITE_UPLOAD_PRESET,
  },
  vietQR: {
    clientId: import.meta.env.VITE_VIETQR_CLIENT_ID,
    apiKey: import.meta.env.VITE_VIETQR_API_KEY,
    baseUrl: import.meta.env.VITE_VIETQR_BASE_URL ?? "https://api.vietqr.io/v2",
  },
};
