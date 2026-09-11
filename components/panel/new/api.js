// components/panel/new/api.js
// Ported from newworkerparts/api.js (React Native) → Next.js
// Only difference: AsyncStorage → js-cookie

import axios from "axios";
import Cookies from "js-cookie";

const API_BASE = "https://api.ajur.app/api";

// ==================== Helpers ====================
const getToken = () => Cookies.get("id_token");
const getPhone = () => Cookies.get("user_phone") || "000";

// ==================== Get User's Draft ====================
// RN: AsyncStorage token → axios GET /get-user-draft
export const getUserDraft = async () => {
  try {
    const token = getToken();
    if (!token) return null;

    const response = await axios.get(`${API_BASE}/get-user-draft`, {
      params: { token },
    });

    if (response.data && response.data.worker) {
      return response.data.worker;
    }
    return null;
  } catch (error) {
    // 404 = no draft found → expected, return null
    if (error.response?.status === 404) return null;
    console.error("getUserDraft error:", error);
    return null;
  }
};

// ==================== Create / Update Draft ====================
// RN: saveDraft → POST /post-model-with-images with status: 3
export const saveDraft = async (data) => {
  try {
    const token = getToken();
    const cellphone = getPhone();

    const categoryId = data.category_id ? Number(data.category_id) : null;

    const params = {
      token,
      category_id: categoryId,
      title: data.title || "",
      description: data.description || "",
      note: data.note || "",
      properties: JSON.stringify(data.properties || []),
      address: data.address || null,
      status: 3,
      phone: cellphone || "000",
    };

    if (data.draft_id) {
      params.exid = data.draft_id;
    }

    const response = await axios.post(
      `${API_BASE}/post-model-with-images`,
      {},
      { params }
    );

    return response.data.worker;
  } catch (error) {
    console.error("saveDraft error:", error);
    throw error;
  }
};

// ==================== Upload Single Image to Draft ====================
// RN: uploadImageToDraft(draftId, uri, mime) → FormData with 'image'
// Web: same, but the 'image' is a File/Blob from ImageGraber (data URL → File)
export const uploadImageToDraft = async (draftId, imageFile, mimeType) => {
  try {
    const token = getToken();
    if (!token) throw new Error("توکن احراز هویت یافت نشد");
    if (!draftId) throw new Error("شناسه پیش‌نویس یافت نشد");

    const formData = new FormData();
    const fileName = `draft_${draftId}_image_${Date.now()}.jpg`;

    // imageFile may be a File, Blob, or data URL string.
    // Normalize to File for consistency.
    let fileToUpload = imageFile;

    if (typeof imageFile === "string" && imageFile.startsWith("data:")) {
      // data URL → Blob → File
      const arr = imageFile.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[arr.length - 1]);
      const n = bstr.length;
      const u8arr = new Uint8Array(n);
      let i = n;
      while (i--) u8arr[i] = bstr.charCodeAt(i);
      const blob = new Blob([u8arr], { type: mime });
      fileToUpload = new File([blob], fileName, { type: mime });
    }

    formData.append("image", fileToUpload, fileName);

    const response = await axios.post(
      `${API_BASE}/upload-single-image`,
      formData,
      {
        params: { token, worker_id: draftId },
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
        timeout: 30000,
      }
    );

    return response.data;
  } catch (error) {
    console.error("uploadImageToDraft error:", error);
    throw error;
  }
};

// ==================== Upload Single Video to Draft ====================
// RN: uploadVideoToDraft(draftId, uri, mime, onProgress) → FormData 'video[]'
export const uploadVideoToDraft = async (
    draftId,
    videoFile,
    mimeType,
    onProgress,
    cancelToken
  ) => {
    try {
      const token = getToken();
      if (!token) throw new Error("توکن احراز هویت یافت نشد");
      if (!draftId) throw new Error("شناسه پیش‌نویس یافت نشد");
  
      const fileName = `draft_${draftId}_video_${Date.now()}.mp4`;
  
      const formData = new FormData();
      formData.append("video[]", videoFile, fileName);
  
      const source = cancelToken || axios.CancelToken.source();
      const timeoutId = setTimeout(() => {
        source.cancel("Upload timeout - connection lost");
      }, 600000);
  
      const response = await axios.post(`${API_BASE}/upload-video`, formData, {
        params: { token, worker_id: draftId },
        headers: { "Content-Type": "multipart/form-data" },
        cancelToken: source.token,
        timeout: 600000,
        onUploadProgress: (progressEvent) => {
          let progress = 0;
          if (progressEvent.total) {
            progress = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
          } else if (videoFile.size) {
            progress = Math.floor((progressEvent.loaded * 100) / videoFile.size);
          } else {
            const estimatedTotal = 50 * 1024 * 1024;
            progress = Math.floor((progressEvent.loaded * 100) / estimatedTotal);
          }
          const finalProgress = Math.min(Math.max(progress, 0), 99);
          if (onProgress) onProgress(finalProgress);
        },
      });
  
      clearTimeout(timeoutId);
      if (onProgress) onProgress(100);
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        throw new Error("Upload cancelled");
      }
      if (error.code === "ECONNABORTED") {
        throw new Error("زمان آپلود به پایان رسید. لطفاً دوباره تلاش کنید.");
      }
      if (error.message === "Network Error") {
        throw new Error("اتصال اینترنت خود را بررسی کنید.");
      }
      console.error("uploadVideoToDraft error:", error);
      throw error;
    }
  };

// ==================== Delete Single Image from Draft ====================
export const deleteImageFromDraft = async (imageId) => {
  try {
    const token = getToken();
    const response = await axios.delete(`${API_BASE}/delete-image`, {
      params: { token, image_id: imageId },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ==================== Delete Single Video from Draft ====================
export const deleteVideoFromDraft = async (videoId) => {
    try {
      const token = getToken();
      const response = await axios.delete(`${API_BASE}/delete-video`, {
        params: { token, video_id: videoId },
      });
  
      // TEST: confirm the call actually reached the server and succeeded
    //   alert(`✅ ویدیو با شناسه ${videoId} از سرور حذف شد`);
    //   console.log("[delete-video] success:", response.data);
  
      return response.data;
    } catch (error) {
      // TEST: confirm the failure path
    //   alert(`❌ خطا در حذف ویدیو از سرور\n${error?.message || "خطای ناشناخته"}`);
    //   console.error("[delete-video] error:", error);
    //   console.error("[delete-video] response:", error?.response?.data);
    //   console.error("[delete-video] status:", error?.response?.status);
  
      throw error;
    }
  };

// ==================== Delete Entire Draft ====================
export const deleteDraft = async (draftId) => {
  try {
    const token = getToken();
    const response = await axios.delete(`${API_BASE}/delete-property`, {
      params: { token, worker_id: draftId },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ==================== Finalize Draft (Publish) ====================
// status: 1 → published
export const finalizeDraft = async (draftId, data) => {
  try {
    const token = getToken();
    const response = await axios.post(
      `${API_BASE}/post-model-with-images`,
      {},
      {
        params: {
          token,
          exid: draftId,
          category_id: data.category_id,
          title: data.title || "",
          description: data.description || "",
          note: data.note || "",
          properties: JSON.stringify(data.properties || []),
          status: 1,
          phone: data.phone || "000",
        },
      }
    );
    return response.data.worker;
  } catch (error) {
    throw error;
  }
};

// ==================== Get Property for Edit ====================
export const getPropertyById = async (propertyId) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_BASE}/get-property`, {
      params: { token, worker_id: propertyId },
    });
    return response.data.worker;
  } catch (error) {
    console.error("getPropertyById error:", error);
    throw error;
  }
};

// ==================== Change Main Image ====================
// RN: DELETE /main-image-change?token=&worker_id=&image_id=
export const changeMainImage = async (workerId, imageId) => {
  try {
    const token = getToken();
    if (!token) throw new Error("توکن احراز هویت یافت نشد");

    const response = await axios({
      method: "delete",
      url: `${API_BASE}/main-image-change`,
      params: { token, worker_id: workerId, image_id: imageId },
      headers: { Accept: "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("changeMainImage error:", error);
    throw error;
  }
};

// ==================== Submit Location ====================
// RN: submitLocation(token, workerId, address) with hardcoded lat/lng
// Web: same, hardcoded lat: 35.6995, long: 51.3379 (Tehran, Azadi area)
export const submitLocation = async (workerId, address) => {
  try {
    const token = getToken();
    const response = await axios({
      method: "post",
      url: `${API_BASE}/post-model-location`,
      timeout: 1000 * 35,
      params: {
        token,
        lat: 35.6995,
        long: 51.3379,
        worker_id: workerId,
        region: address?.region || "",
        neighbourhood: address?.neighbourhood || "",
        city: address?.city || "",
        municipality_zone: address?.municipality_zone || "",
        state: address?.state || "",
        formatted: address?.formatted || "",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

