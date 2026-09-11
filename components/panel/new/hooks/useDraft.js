// components/panel/new/hooks/useDraft.js
// Ported from newworkerparts/hooks.js useDraft — 1:1
// Differences:
//   - AsyncStorage → js-cookie (via api.js helpers)
//   - Toast messages: passed to onToast callback instead of native-base
//   - Real cancel: axios.CancelToken wired through uploadVideoToDraft

import { useState, useCallback, useRef } from "react";
import axios from "axios";
import {
  getUserDraft,
  saveDraft,
  uploadImageToDraft,
  uploadVideoToDraft,
  deleteImageFromDraft,
  deleteVideoFromDraft,
  deleteDraft,
  finalizeDraft,
  getPropertyById,
  changeMainImage as changeMainImageApi,
} from "../api";

export const useDraft = ({ mode, propertyId, categoryId, onToast } = {}) => {
  const [draftId, setDraftId] = useState(null);
  const [draftData, setDraftData] = useState(null);
  const [isLoadingDraft, setIsLoadingDraft] = useState(true);
  const [isExistingDraft, setIsExistingDraft] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentUploadVideoUri, setCurrentUploadVideoUri] = useState(null);

  // cancel flag — ref so uploads see the latest value synchronously
  const cancelRef = useRef(false);
  // cancel token source — lets us actually abort the in-flight axios request
  const cancelTokenRef = useRef(null);

  const toast = useCallback(
    (message, type = "info") => {
      if (onToast) onToast(message, type);
    },
    [onToast]
  );

  // ============================================================
  // LOAD OR CREATE DRAFT
  // ============================================================
  const loadOrCreateDraft = useCallback(
    async (formData) => {
      setIsLoadingDraft(true);
      try {
        // ============ EDIT MODE ============
        if (mode === "edit" && propertyId) {
          setIsEditMode(true);
          try {
            const property = await getPropertyById(propertyId);
            if (property) {
              setDraftId(property.id);
              setDraftData(property);
              setIsExistingDraft(true);
              setIsLoadingDraft(false);
              return property;
            }
          } catch (fetchError) {
            console.error("edit mode fetch failed:", fetchError);
            toast("خطا در بارگذاری ملک برای ویرایش", "error");
          }
        }

        // ============ NEW MODE — check for existing user draft ============
        const draft = await getUserDraft();
        if (draft) {
          setDraftId(draft.id);
          setDraftData(draft);
          setIsExistingDraft(true);
          setIsLoadingDraft(false);
          return draft;
        }

        // ============ NO DRAFT → create one ============
        const newDraft = await saveDraft({
          category_id: categoryId || null,
          title: formData?.title || "",
          description: formData?.description || "",
          note: formData?.note || "",
          properties: formData?.properties || [],
        });

        if (newDraft) {
          setDraftId(newDraft.id);
          setDraftData(newDraft);
          setIsExistingDraft(false);
          setIsLoadingDraft(false);
          return newDraft;
        }

        setIsLoadingDraft(false);
        return null;
      } catch (error) {
        console.error("loadOrCreateDraft error:", error);
        toast(
          `خطا در بارگذاری پیش‌نویس: ${error.message || "خطای ناشناخته"}`,
          "error"
        );
        setIsLoadingDraft(false);
        return null;
      }
    },
    [mode, propertyId, categoryId, toast]
  );

  // ============================================================
  // UPDATE DRAFT DATA (fields, category, address, ...)
  // ============================================================
  const updateDraftData = useCallback(
    async (data) => {
      if (!draftId) return null;
      try {
        const updated = await saveDraft({ draft_id: draftId, ...data });
        setDraftData(updated);
        return updated;
      } catch (error) {
        console.error("updateDraftData error:", error);
        throw error;
      }
    },
    [draftId]
  );

  // ============================================================
  // CHANGE MAIN IMAGE
  // ============================================================
  const changeMainImage = useCallback(
    async (imageId) => {
      if (!draftId) {
        toast("خطا: شناسه پیش‌نویس یافت نشد", "error");
        return null;
      }
      if (!imageId) {
        toast("خطا: شناسه عکس یافت نشد", "error");
        return null;
      }
      try {
        const result = await changeMainImageApi(draftId, imageId);
        return result;
      } catch (error) {
        console.error("changeMainImage error:", error);
        throw error;
      }
    },
    [draftId, toast]
  );

  // ============================================================
  // UPLOAD IMAGE (single)
  // ============================================================
  const uploadImage = useCallback(
    async (imageFile, mimeType) => {
      if (!draftId) {
        toast("خطا: شناسه پیش‌نویس یافت نشد", "error");
        return null;
      }
      if (!imageFile) {
        toast("خطا: عکسی انتخاب نشده است", "error");
        return null;
      }
      try {
        const result = await uploadImageToDraft(draftId, imageFile, mimeType);

        if (!result) return null;

        // Normalize 3 possible response shapes (RN did the same)
        if (result.image && result.image.id) {
          return { image: result.image };
        }
        if (
          result.images &&
          Array.isArray(result.images) &&
          result.images.length > 0
        ) {
          const last = result.images[result.images.length - 1];
          return {
            image: {
              id: last.id,
              url: `https://api.ajur.app/public/workers/images/${last.filepath}`,
              filepath: last.filepath,
            },
          };
        }
        if (result.id && result.filepath) {
          return { image: result };
        }
        if (result.status === 200) {
          return {
            image: {
              id: Date.now(),
              url: "",
              filepath: `uploaded_${Date.now()}`,
            },
          };
        }
        return null;
      } catch (error) {
        console.error("uploadImage error:", error);
        throw error;
      }
    },
    [draftId, toast]
  );

  // ============================================================
  // UPLOAD VIDEO (single, with progress + real cancel)
  // ============================================================
  const uploadVideo = useCallback(
    async (videoFile, mimeType, displayUri) => {
      if (!draftId) {
        toast("خطا: شناسه پیش‌نویس یافت نشد", "error");
        return { ok: false, reason: "no-draft" };
      }
      if (!videoFile) {
        toast("خطا: ویدیویی انتخاب نشده است", "error");
        return { ok: false, reason: "no-file" };
      }
  
      setIsVideoUploading(true);
      setUploadProgress(0);
      setCurrentUploadVideoUri(displayUri || videoFile.name || "video");
      cancelRef.current = false;
  
      const source = axios.CancelToken.source();
      cancelTokenRef.current = source;
  
      try {
        const result = await uploadVideoToDraft(
          draftId,
          videoFile,
          mimeType,
          (progress) => {
            if (cancelRef.current) throw new Error("Upload cancelled");
            setUploadProgress(progress);
          },
          source
        );
  
        setIsVideoUploading(false);
        setUploadProgress(100);
        setCurrentUploadVideoUri(null);
        cancelTokenRef.current = null;
  
        toast("ویدیو با موفقیت آپلود شد", "success");
        return { ok: true, result };
      } catch (error) {
        setIsVideoUploading(false);
        setUploadProgress(0);
        setCurrentUploadVideoUri(null);
        cancelTokenRef.current = null;
  
        if (error.message === "Upload cancelled") {
          return { ok: false, reason: "cancelled" };
        }
  
        let msg = "خطا در آپلود ویدیو";
        if (error.message?.includes("timeout"))
          msg = "زمان آپلود به پایان رسید. لطفاً دوباره تلاش کنید.";
        else if (error.message?.includes("Network"))
          msg = "اتصال اینترنت خود را بررسی کنید.";
        else if (error.response?.data?.message)
          msg = error.response.data.message;
  
        toast(msg, "error");
        // Return a structured failure instead of throwing —
        // this avoids the Next.js dev-overlay treating it as an unhandled error.
        return {
          ok: false,
          reason: "failed",
          error,
          message: msg,
        };
      }
    },
    [draftId, toast]
  );

  const cancelUpload = useCallback(() => {
    cancelRef.current = true;

    // Actually abort the in-flight axios request
    if (cancelTokenRef.current) {
      try {
        cancelTokenRef.current.cancel("Upload cancelled by user");
      } catch (e) {
        // ignore
      }
      cancelTokenRef.current = null;
    }

    setIsVideoUploading(false);
    setUploadProgress(0);
    setCurrentUploadVideoUri(null);
  }, []);

  // ============================================================
  // DELETE IMAGE / VIDEO FROM DRAFT
  // ============================================================
  const deleteImage = useCallback(
    async (imageId) => {
      if (!draftId) return null;
      try {
        return await deleteImageFromDraft(imageId);
      } catch (error) {
        console.error("deleteImage error:", error);
        throw error;
      }
    },
    [draftId]
  );

  const deleteVideo = useCallback(
    async (videoId) => {
      if (!draftId) return null;
      try {
        return await deleteVideoFromDraft(videoId);
      } catch (error) {
        console.error("deleteVideo error:", error);
        throw error;
      }
    },
    [draftId]
  );

  // ============================================================
  // FINALIZE (publish)
  // ============================================================
  const finalize = useCallback(
    async (data) => {
      if (!draftId) return null;
      try {
        return await finalizeDraft(draftId, data);
      } catch (error) {
        console.error("finalize error:", error);
        throw error;
      }
    },
    [draftId]
  );

  // ============================================================
  // DELETE DRAFT ENTIRELY
  // ============================================================
  const deleteDraftData = useCallback(async () => {
    if (!draftId) return null;
    try {
      const result = await deleteDraft(draftId);
      setDraftId(null);
      setDraftData(null);
      setIsExistingDraft(false);
      return result;
    } catch (error) {
      console.error("deleteDraftData error:", error);
      throw error;
    }
  }, [draftId]);

  return {
    draftId,
    draftData,
    isLoadingDraft,
    isExistingDraft,
    isEditMode,
    isVideoUploading,
    uploadProgress,
    currentUploadVideoUri,
    loadOrCreateDraft,
    updateDraftData,
    uploadImage,
    uploadVideo,
    deleteImage,
    deleteVideo,
    cancelUpload,
    finalize,
    deleteDraftData,
    changeMainImage,
  };
};