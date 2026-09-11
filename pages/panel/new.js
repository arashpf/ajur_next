// pages/panel/new.js
// Ported from NewWorker.js (React Native) → Next.js
// Same page for: new property, draft resume, edit mode.

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Button from "@mui/material/Button";

import NewWorkerLayout from "../../components/layouts/NewWorkerLayout";

// hooks
import { useCategories } from "../../components/panel/new/hooks/useCategories";
import { useFields } from "../../components/panel/new/hooks/useFields";
import { usePropertyForm } from "../../components/panel/new/hooks/usePropertyForm";
import { useImageManager } from "../../components/panel/new/hooks/useImageManager";
import { useVideoManager } from "../../components/panel/new/hooks/useVideoManager";
import { useUpload } from "../../components/panel/new/hooks/useUpload";
import { useDraft } from "../../components/panel/new/hooks/useDraft";

// components
import StepIndicator from "../../components/panel/new/components/StepIndicator";
import CategorySelector from "../../components/panel/new/components/CategorySelector";
import LocationSelector from "../../components/panel/new/components/LocationSelector";
import TitleInput from "../../components/panel/new/components/TitleInput";
import ImageUploader from "../../components/panel/new/components/ImageUploader";
import VideoUploader from "../../components/panel/new/components/VideoUploader";
import PropertyFields from "../../components/panel/new/components/PropertyFields";
import DescriptionInput from "../../components/panel/new/components/DescriptionInput";
import SubmitButton from "../../components/panel/new/components/SubmitButton";
import NextStepButton from "../../components/panel/new/components/NextStepButton";

// modals
import CategoryModal from "../../components/panel/new/modals/CategoryModal";
import ImagePreviewModal from "../../components/panel/new/modals/ImagePreviewModal";
import AlertModal from "../../components/panel/new/modals/AlertModal";
import NoImageAlertModal from "../../components/panel/new/modals/NoImageAlertModal";
import AddressModal from "../../components/panel/new/modals/AddressModal";
import CloseModal from "../../components/panel/new/modals/CloseModal";

// utils
import { numToPersian } from "../../components/panel/new/numToPersian";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const NewWorkerPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // mode/propertyId from query — matches RN route.params
  const mode = router.query.edit_id ? "edit" : "new";
  const propertyId = router.query.edit_id ? Number(router.query.edit_id) : null;

  // ============ Toast (replaces native-base useToast) ============
  const [toastState, setToastState] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showToast = useCallback((message, type = "info") => {
    const severityMap = {
      info: "info",
      success: "success",
      error: "error",
      warning: "warning",
    };
    setToastState({
      open: true,
      message,
      severity: severityMap[type] || "info",
    });
  }, []);

  const handleToastClose = (event, reason) => {
    if (reason === "clickaway") return;
    setToastState((s) => ({ ...s, open: false }));
  };

  // ============ Initial loading flags ============
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // ============ UI state ============
  const [currentStep, setCurrentStep] = useState(1);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryModalOpened, setCategoryModalOpened] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showNoImageAlert, setShowNoImageAlert] = useState(false);
  const [noImageVerified, setNoImageVerified] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressData, setAddressData] = useState(null);
  const [isImagePickerLoading, setIsImagePickerLoading] = useState(false);
  const [cellphone, setCellphone] = useState("000");

  // ============ Refs (synchronous, survive re-renders) ============
  const hasHydratedRef = useRef(false);
  const submittingRef = useRef(false);
  const leavingRef = useRef(false);

  // ============ Hooks ============
  const {
    allCategories,
    selectedCategory,
    loadingCategories,
    catId,
    selectCategory,
  } = useCategories({ onError: (m) => showToast(m, "error") });

  const { normalFields, predefineFields, tickFields, loadingFields } =
    useFields(catId);

  const {
    properties,
    title,
    setTitle,
    description,
    setDescription,
    note,
    setNote,
    addProperty,
    removeProperty,
    updateProperty,
    upsertProperty,
    calculateAutomatic,
  } = usePropertyForm();

  const {
    images,
    selectedImage,
    isImageModalVisible,
    addImages,
    deleteImage,
    setMainImage,
    openImagePreview,
    closeImagePreview,
    updateImage,
    updateImageStatus,
  } = useImageManager();

  const {
    videos,
    getDisplayVideos,
    selectedVideo,
    videoModalVisible,
    addVideo,
    deleteVideo,
    openVideoPreview,
    closeVideoPreview,
    handleVideoSelected,
    updateVideoStatus,
    updateVideoFields,
    markVideoError,
  } = useVideoManager();

  const {
    beginUpload,
    uploadProgress,
    startUpload,
    updateProgress,
    finishUpload,
  } = useUpload();

  const {
    draftId,
    draftData,
    isLoadingDraft,
    isExistingDraft,
    isEditMode,
    isVideoUploading,
    uploadProgress: videoUploadProgress,
    currentUploadVideoUri,
    loadOrCreateDraft,
    updateDraftData,
    uploadImage,
    uploadVideo,
    deleteImage: deleteImageFromDraftAPI,
    deleteVideo: deleteVideoFromDraftAPI,
    cancelUpload,
    finalize,
    deleteDraftData,
    changeMainImage,
  } = useDraft({ mode, propertyId, categoryId: catId, onToast: showToast });

  // ============ Get cellphone from cookie on mount ============
  useEffect(() => {
    if (typeof document === "undefined") return;
    const match = document.cookie.match(/(?:^|;\s*)user_phone=([^;]+)/);
    if (match) setCellphone(decodeURIComponent(match[1]));
  }, []);

  // ============ Initial load ============
  useEffect(() => {
    if (!router.isReady) return;

    const initialize = async () => {
      setIsInitialLoading(true);
      try {
        const formData = {
          title: "",
          description: "",
          note: "",
          properties: [],
        };
        await loadOrCreateDraft(formData);
        setIsDataLoaded(true);
      } catch (error) {
        console.error("init error:", error);
        showToast("خطا در بارگذاری اطلاعات", "error");
      } finally {
        setIsInitialLoading(false);
      }
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  // ============ Fill form with draft data (ONCE per mount) ============
  useEffect(() => {
    if (!draftData || !isExistingDraft || !isDataLoaded) return;

    // Hydrate only once. Without this guard, every auto-save response
    // returns a fresh draftData object → this effect re-fires →
    // addImages/addVideo append the same items again → duplicates.
    if (hasHydratedRef.current) return;
    hasHydratedRef.current = true;

    if (draftData.name) setTitle(draftData.name);
    if (draftData.description) setDescription(draftData.description);
    if (draftData.note) setNote(draftData.note);

    if (draftData.json_properties) {
      try {
        const parsed =
          typeof draftData.json_properties === "string"
            ? JSON.parse(draftData.json_properties)
            : draftData.json_properties;
        parsed.forEach((prop) => upsertProperty(prop));
      } catch (e) {
        console.warn("could not parse json_properties:", e);
      }
    }

    if (draftData.images?.length) {
      draftData.images.forEach((img) => {
        let url = img.url;
        if (!url || !url.startsWith("http")) {
          url = `https://api.ajur.app/public/workers/images/${img.filepath}`;
        }
        url = url.replace(
          "https://api.ajur.app/storage/workers/images/",
          "https://api.ajur.app/public/workers/images/"
        );
        addImages([
          {
            uri: url,
            mime: "image/jpeg",
            id: img.id,
            uploadStatus: "uploaded",
          },
        ]);
      });
    }

    if (draftData.videos?.length) {
      draftData.videos.forEach((video) => {
        let url =
          video.url ||
          `https://api.ajur.app/public/workers/videos/${video.filepath}`;
        url = url.replace(
          "https://api.ajur.app/storage/workers/videos/",
          "https://api.ajur.app/public/workers/videos/"
        );
        addVideo({
          uri: url,
          thumbnail: video.thumbnail || null,
          mime: "video/mp4",
          id: video.id,
          isFromDraft: true,
          duration: video.duration || "00:00",
          error: false,
          uploadStatus: "uploaded",
        });
      });
    }

    if (draftData.address) {
      let addr = draftData.address;
      if (typeof addr === "string") {
        try {
          addr = JSON.parse(addr);
        } catch (e) {
          console.warn("could not parse address:", e);
        }
      }
      if (addr && typeof addr === "object") setAddressData(addr);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftData, isExistingDraft, isDataLoaded]);

  // ============ Restore category from draft (ONCE) ============
  useEffect(() => {
    if (
      draftData &&
      isExistingDraft &&
      allCategories.length > 0 &&
      draftData.category_id &&
      isDataLoaded
    ) {
      const id = Number(draftData.category_id);
      const cat = allCategories.find((c) => c.id === id);
      if (cat) selectCategory(cat);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftData, isExistingDraft, allCategories, isDataLoaded]);

  // ============ Auto-save (debounced 1s, NOT in edit mode) ============
  useEffect(() => {
    if (!draftId || isEditMode || !isDataLoaded) return;

    const timer = setTimeout(() => {
      updateDraftData({
        title,
        description,
        note,
        properties,
        category_id: catId,
      }).catch((e) => console.warn("autosave failed:", e));
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, note, properties, catId, draftId, isEditMode, isDataLoaded]);

  // ============ Open category modal when entering step 2 ============
  useEffect(() => {
    if (
      currentStep === 2 &&
      !selectedCategory &&
      !categoryModalOpened &&
      !loadingCategories
    ) {
      setCategoryModalOpened(true);
      setShowCategoryModal(true);
    }
  }, [currentStep, selectedCategory, loadingCategories, categoryModalOpened]);

  // ============ No-image verified → auto-submit ============
  useEffect(() => {
    if (noImageVerified) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noImageVerified]);

  // ============ beforeunload guard ============
  useEffect(() => {
    const handler = (e) => {
      if (isEditMode) return;
      e.preventDefault();
      e.returnValue = "";
      return "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isEditMode]);

  // ============ Router back guard (refs, not state) ============
  useEffect(() => {
    if (isEditMode) return;

    const onRouteChange = (url) => {
      if (submittingRef.current || leavingRef.current) return;

      const leavingThisPage = !url.startsWith("/panel/new");
      if (leavingThisPage && !beginUpload) {
        setShowCloseModal(true);
        router.events.emit("routeChangeError");
        throw "routeChange aborted";
      }
    };

    router.events.on("routeChangeStart", onRouteChange);
    return () => router.events.off("routeChangeStart", onRouteChange);
  }, [isEditMode, beginUpload]);

  // ============================================================
  // ACTIONS
  // ============================================================

  // ---------- delete image (server + local) ----------
  const deleteImageFromDraft = useCallback(
    async (imageToDelete) => {
      if (!draftId || !imageToDelete) return;
      try {
        if (imageToDelete.id) {
          await deleteImageFromDraftAPI(imageToDelete.id);
        }
        deleteImage(imageToDelete);

        if (draftData) {
          const currentImages = draftData.images || [];
          const updated = currentImages.filter(
            (img) =>
              img.uri !== imageToDelete.uri && img.id !== imageToDelete.id
          );
          await updateDraftData({ images: updated });
        }

        showToast("عکس با موفقیت حذف شد", "success");
      } catch (error) {
        console.error("deleteImageFromDraft error:", error);
        showToast(
          `خطا در حذف عکس: ${error.message || "خطای ناشناخته"}`,
          "error"
        );
      }
    },
    [
      draftId,
      draftData,
      deleteImage,
      deleteImageFromDraftAPI,
      updateDraftData,
      showToast,
    ]
  );

  // ---------- set main image ----------
  const handleSetMainImage = useCallback(
    async (image) => {
      if (!image) return;
      if (image.id && draftId) {
        try {
          showToast("در حال تغییر عکس اصلی...", "info");
          await changeMainImage(image.id);
          setMainImage(image);
        } catch (error) {
          showToast(
            `خطا در تغییر عکس اصلی: ${error.message || "خطای ناخواسته"}`,
            "error"
          );
        }
      } else {
        setMainImage(image);
      }
    },
    [draftId, changeMainImage, setMainImage, showToast]
  );

  // ---------- retry image upload ----------
  const retryImageUpload = useCallback(
    async (image) => {
      if (!image) return;
      updateImageStatus(image.uri, "uploading");
      try {
        const result = await uploadImage(image.file || image.uri, image.mime);
        if (result?.image) {
          updateImage(image.uri, {
            id: result.image.id,
            url: result.image.url,
            filepath: result.image.filepath,
            uploadStatus: "uploaded",
          });
        } else {
          throw new Error("no result");
        }
      } catch (error) {
        updateImageStatus(image.uri, "error");
        showToast(error.message || "خطا در آپلود مجدد عکس", "error");
      }
    },
    [uploadImage, updateImage, updateImageStatus, showToast]
  );

  // ---------- upload video (MUST be declared before retryVideoUpload
  //             and handleVideoPicked, both of which depend on it) ----------
  const handleUploadVideo = useCallback(
    async (videoFile, mimeType, displayUri) => {
      const rawFile =
        videoFile instanceof File || videoFile instanceof Blob
          ? videoFile
          : videoFile?.file;
  
      if (!rawFile) {
        console.error("[video] handleUploadVideo: no raw file", videoFile);
        showToast("خطا: فایل ویدیو یافت نشد", "error");
        return;
      }
  
      const uriKey =
        displayUri || videoFile?.uri || videoFile?.name || rawFile.name;
  
      try {
        updateVideoStatus(uriKey, "uploading");
  
        const response = await uploadVideo(rawFile, mimeType, uriKey);
  
        // Full response so we can see the exact shape (keep during debugging)
        console.log("[video upload] full response:", response);
  
        if (response?.ok) {
          // ---- Extract the server-side video id ----
          const r = response.result;
          let serverId = null;
          let serverPath = null;
          let serverUrl = null;
  
          if (r?.video?.id) {
            serverId = r.video.id;
            serverPath = r.video.filepath;
            serverUrl = r.video.url;
          } else if (r?.videos && Array.isArray(r.videos) && r.videos.length > 0) {
            const last = r.videos[r.videos.length - 1];
            serverId = last.id;
            serverPath = last.filepath;
            serverUrl = last.url;
          } else if (r?.id) {
            serverId = r.id;
            serverPath = r.filepath;
            serverUrl = r.url;
          }
  
          console.log("[video upload] captured server id:", serverId);
  
          // Attach id + path + url to the state entry (same uriKey)
          updateVideoFields(uriKey, {
            id: serverId ?? undefined,
            filepath: serverPath ?? undefined,
            url: serverUrl ?? undefined,
            uploadStatus: "uploaded",
            error: false,
            isProcessing: false,
          });
        } else if (response?.reason === "cancelled") {
          console.log("[video] upload cancelled by user");
        } else {
          console.error("[video] upload failed:", response?.message);
          console.error("[video] underlying error:", response?.error);
          markVideoError(uriKey);
        }
      } catch (error) {
        console.error("[video upload] unexpected throw:", error);
        markVideoError(uriKey);
      }
    },
    [
      uploadVideo,
      updateVideoStatus,
      updateVideoFields,
      markVideoError,
      showToast,
    ]
  );

  // ---------- retry video upload (uses handleUploadVideo) ----------
  const retryVideoUpload = useCallback(
    async (video) => {

      console.log("[retry] video entry:", video);
    console.log("[retry] video.file:", video?.file);
    console.log("[retry] isFile:", video?.file instanceof File);
    console.log("[retry] isBlob:", video?.file instanceof Blob);
      if (!video) return;


  
      const rawFile = video.file;
  
      if (!rawFile || (!(rawFile instanceof File) && !(rawFile instanceof Blob))) {
        showToast("امکان تلاش مجدد وجود ندارد. لطفا ویدیو را حذف و دوباره اضافه کنید", "warning");
        // Optionally: mark the entry as error but not "uploading"
        markVideoError(video.uri);
        return;
      }
  
      await handleUploadVideo(rawFile, video.mime || "video/mp4", video.uri);
    },
    [handleUploadVideo, showToast, markVideoError]
  );

  // ---------- handle video picked by VideoGraber ----------
  const handleVideoPicked = useCallback(
    (videoFile) => {
      const objectUrl = URL.createObjectURL(videoFile);

      handleVideoSelected({
        uri: objectUrl,
        file: videoFile, // keep raw File for retry
        mime: videoFile.type || "video/mp4",
        width: 1080,
        height: 1080,
      });

      handleUploadVideo(videoFile, videoFile.type || "video/mp4", objectUrl);
    },
    [handleVideoSelected, handleUploadVideo]
  );

  // ---------- category selection ----------
  const handleSelectCategory = useCallback(
    (category) => {
      selectCategory(category);
      setCategoryModalOpened(true);
      setShowCategoryModal(false);
      if (draftId) {
        updateDraftData({ category_id: category.id }).catch((e) =>
          console.warn("category save failed:", e)
        );
      }
    },
    [draftId, selectCategory, updateDraftData]
  );

  // ---------- address confirm ----------
  const handleAddressConfirm = useCallback(
    (address) => {
      setAddressData(address);
      setShowAddressModal(false);
      if (draftId) {
        updateDraftData({ address }).catch((e) =>
          console.warn("address save failed:", e)
        );
      }
    },
    [draftId, updateDraftData]
  );

  // ---------- close / leave ----------
  const handleClose = useCallback(() => {
    if (isEditMode) {
      leavingRef.current = true;
      router.push("/panel");
      return;
    }
    setShowCloseModal(true);
  }, [isEditMode, router]);

  const handleCloseSave = useCallback(async () => {
    try {
      leavingRef.current = true;
      setShowCloseModal(false);

      if (draftId) {
        await updateDraftData({
          title,
          description,
          note,
          properties,
          category_id: catId,
          address: addressData,
        });
      }

      router.push("/panel");
    } catch (error) {
      leavingRef.current = false;
      console.error("handleCloseSave error:", error);
      showToast("خطا در ذخیره پیش‌نویس", "error");
    }
  }, [
    draftId,
    title,
    description,
    note,
    properties,
    catId,
    addressData,
    updateDraftData,
    router,
    showToast,
  ]);

  const handleCloseDelete = useCallback(async () => {
    try {
      leavingRef.current = true;
      setShowCloseModal(false);

      if (draftId) {
        await deleteDraftData();
      }

      router.push("/panel");
    } catch (error) {
      leavingRef.current = false;
      console.error("handleCloseDelete error:", error);
      showToast("خطا در حذف پیش‌نویس", "error");
    }
  }, [draftId, deleteDraftData, router, showToast]);

  const handleCloseCancel = useCallback(() => setShowCloseModal(false), []);

  const handleBackConfirm = useCallback(() => {
    leavingRef.current = true;
    setShowAlert(false);
    router.push("/panel");
  }, [router]);

  const handleNoImageConfirm = useCallback(() => {
    setShowNoImageAlert(false);
    setNoImageVerified(true);
  }, []);

  // ---------- step nav ----------
  const goToStep2 = useCallback(() => {
    if (!title || title.length < 3) {
      showToast("عنوان باید حداقل ۳ حرف باشد", "warning");
      return;
    }
    if (!description || description.length < 10) {
      showToast("لطفا توضیحات کامل‌تری وارد کنید (حداقل ۱۰ حرف)", "warning");
      return;
    }
    setCurrentStep(2);
  }, [title, description, showToast]);

  const goToStep1 = useCallback(() => setCurrentStep(1), []);

  // ---------- submit ----------
  const handleSubmit = useCallback(async () => {
    if (!selectedCategory) {
      setShowCategoryModal(true);
      showToast("لطفا دسته بندی را انتخاب کنید", "warning");
      return;
    }
    if (!addressData) {
      showToast("لطفا موقعیت ملک را انتخاب کنید", "warning");
      return;
    }
    if (isVideoUploading) {
      showToast("لطفا تا پایان آپلود ویدیو صبر کنید", "warning");
      return;
    }
    if (!normalFields || normalFields.length === 0) {
      showToast(
        "لطفا ابتدا دسته بندی را انتخاب کنید تا فیلدها بارگذاری شوند",
        "warning"
      );
      return;
    }

    const required = normalFields.filter((f) => f.special === "1");
    const missing = required.filter(
      (f) =>
        !properties.some(
          (p) => p.name === f.value && p.value && p.value !== ""
        )
    );
    if (missing.length > 0) {
      showToast(
        `لطفا فیلدهای ستاره دار را پر کنید: ${missing
          .map((f) => f.value)
          .join("، ")}`,
        "warning"
      );
      return;
    }

    const requiredTicks = tickFields.filter((f) => f.special === "1");
    const missingTicks = requiredTicks.filter(
      (f) =>
        !properties.some(
          (p) => p.name === f.value && (p.value === 1 || p.value === 0)
        )
    );
    if (missingTicks.length > 0) {
      showToast(
        `لطفا وضعیت موارد زیر را مشخص کنید: ${missingTicks
          .map((f) => f.value)
          .join("، ")}`,
        "warning"
      );
      return;
    }

    if (draftId) {
      try {
        await updateDraftData({
          title,
          description,
          note,
          properties,
          category_id: catId,
          address: addressData,
        });
      } catch (error) {
        showToast("خطا در ذخیره پیش‌نویس", "error");
        return;
      }
    } else {
      showToast("خطا: شناسه پیش‌نویس یافت نشد", "error");
      return;
    }

    await submitPropertyWithAddress(addressData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedCategory,
    addressData,
    isVideoUploading,
    normalFields,
    tickFields,
    properties,
    draftId,
    title,
    description,
    note,
    catId,
    updateDraftData,
    showToast,
  ]);

  const submitPropertyWithAddress = useCallback(
    async (address) => {
      try {
        submittingRef.current = true;
        startUpload();

        const imagesWithOrder = images.map((img, index) => ({
          ...img,
          order: img.order !== undefined ? img.order : index,
        }));
        const sortedImages = [...imagesWithOrder].sort(
          (a, b) => (a.order || 0) - (b.order || 0)
        );

        await updateDraftData({
          images: sortedImages.map((img, index) => ({ ...img, order: index })),
        });

        const finalized = await finalize({
          category_id: catId,
          title,
          description,
          note,
          properties,
          phone: cellphone,
        });
        const workerId = finalized?.id || draftId;

        const token = (await import("js-cookie")).default.get("id_token");
        await import("axios").then(({ default: axios }) =>
          axios({
            method: "post",
            url: "https://api.ajur.app/api/post-model-location",
            timeout: 1000 * 35,
            params: {
              token,
              lat: 35.6995,
              long: 51.3379,
              worker_id: workerId,
              region: address.region || "",
              neighbourhood: address.neighbourhood,
              city: address.city,
              municipality_zone: address.municipality_zone || "",
              state: address.state || "",
              formatted: address.formatted,
            },
          })
        );

        finishUpload();

        if (isEditMode) {
          showToast("ملک شما با موفقیت ویرایش شد", "success");
        } else {
          showToast("ملک شما با موفقیت ثبت شد", "success");
        }

        router.push(`/panel/upgrade/${workerId}`);
      } catch (error) {
        submittingRef.current = false;
        finishUpload();
        console.error("submit error:", error);
        showToast(
          error.response?.data?.message || "خطا در ارسال اطلاعات",
          "error"
        );
      }
    },
    [
      images,
      catId,
      title,
      description,
      note,
      properties,
      cellphone,
      draftId,
      updateDraftData,
      finalize,
      finishUpload,
      startUpload,
      isEditMode,
      router,
      showToast,
    ]
  );

  // ---------- helpers ----------
  const formatCategoryName = useCallback((name) => {
    if (!name) return "";
    return name.replace(/خرید/g, "فروش");
  }, []);

  const formatLocationDisplay = useCallback((address) => {
    if (!address) return null;
    return {
      city: address.city,
      neighbourhood: address.neighbourhood,
      formatted: address.formatted,
    };
  }, []);

  // ============ RENDER ============
  if (isInitialLoading || isLoadingDraft || !isDataLoaded) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: "#a92b31" }} />
        {isLoadingDraft && (
          <Typography variant="body2" sx={{ color: "#888" }}>
            لطفاً صبر کنید
          </Typography>
        )}
      </Box>
    );
  }

  if (beginUpload) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress sx={{ color: "#a92b31" }} />
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>
          {isEditMode
            ? "ویرایش ملک | آجر"
            : isExistingDraft
            ? "ادامه پیش‌نویس | آجر"
            : "ثبت ملک جدید | آجر"}
        </title>
      </Head>

      <Box sx={{ pb: { xs: 12, md: 14 }, position: "relative" }}>
        <StepIndicator
          currentStep={currentStep}
          onClose={handleClose}
          onBack={currentStep === 2 ? goToStep1 : undefined}
          isEditMode={isEditMode}
          isDraft={isExistingDraft}
        />

        <Box
          sx={{
            px: { xs: 1, sm: 2, md: 3 },
            pt: 2,
            mx: "auto",
            width: "100%",
            maxWidth: { xs: "100%", md: 640 },
          }}
        >
          {currentStep === 1 && (
            <>
              <TitleInput value={title} onChangeText={setTitle} />
              <ImageUploader
                images={images}
                onAddImages={addImages}
                onDeleteImage={deleteImageFromDraft}
                onSetMainImage={handleSetMainImage}
                onOpenPreview={openImagePreview}
                onRetryUpload={retryImageUpload}
                uploadImage={uploadImage}
                updateImage={updateImage}
                updateImageStatus={updateImageStatus}
                showToast={showToast}
                setIsImagePickerLoading={setIsImagePickerLoading}
              />
              <DescriptionInput
                description={description}
                setDescription={setDescription}
                note={note}
                setNote={setNote}
                showNote={false}
              />
            </>
          )}

          {currentStep === 2 && (
            <>
              <Box sx={{ mb: 1 }}>
                <Button
                  onClick={goToStep1}
                  startIcon={<ChevronLeftIcon sx={{ fontSize: 20 }} />}
                  sx={{
                    color: "#a92b31",
                    backgroundColor: "transparent",
                    border: "1px solid #a92b31",
                    borderRadius: "10px",
                    fontFamily: "iransans, Arial, sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    textTransform: "none",
                    px: 2,
                    py: 0.75,
                    "&:hover": {
                      backgroundColor: "#fef0f1",
                    },
                  }}
                >
                  مرحله قبل
                </Button>
              </Box>

              <Box sx={{ mb: 1 }}>
                <CategorySelector
                  selectedCategory={selectedCategory}
                  onPress={() => {
                    setCategoryModalOpened(true);
                    setShowCategoryModal(true);
                  }}
                  formatCategoryName={formatCategoryName}
                />
              </Box>

              <VideoUploader
  videos={getDisplayVideos()}
  onAddVideo={(videoFile) => handleVideoPicked(videoFile)}
  onDeleteVideo={async (video) => {
    console.log("=== onDeleteVideo fired ===");
    console.log("video entry:", video);
    console.log("video.id:", video.id);
    console.log("about to check id...");
  
    if (video.id) {
      console.log("calling deleteVideoFromDraftAPI with id:", video.id);
      try {
        await deleteVideoFromDraftAPI(video.id);
        console.log("deleteVideoFromDraftAPI resolved");
      } catch (e) {
        console.warn("server delete failed:", e);
      }
    } else {
      console.warn("SKIPPED: video.id is undefined");
    }
    deleteVideo(video);
  }}
  onOpenPreview={openVideoPreview}
  videoModalVisible={videoModalVisible}
  selectedVideo={selectedVideo}
  onCloseVideoPreview={closeVideoPreview}
  isVideoUploading={isVideoUploading}
  videoUploadProgress={videoUploadProgress}
  currentUploadVideoUri={currentUploadVideoUri}
  onCancelUpload={async (video) => {
    // abort the network request
    cancelUpload();
    // remove the local entry
    deleteVideo(video);
  }}
  onRetryUpload={retryVideoUpload}
/>

              <LocationSelector
                selectedLocation={formatLocationDisplay(addressData)}
                onPress={() => setShowAddressModal(true)}
              />

              <Typography
                sx={{
                  color: "gray",
                  mt: 3,
                  mb: 1,
                  fontFamily: "iransans, Arial, sans-serif",
                  fontSize: 18,
                }}
              >
                مشخصات ملک
              </Typography>
              <Typography
                sx={{
                  color: "gray",
                  mb: 2,
                  fontFamily: "iransans, Arial, sans-serif",
                  fontSize: 14,
                }}
              >
                فقط فیلدهایی که ستاره دارند اجباری می‌باشند، ولی با پر کردن هرچه
                بیشتر اطلاعات ملکی شانس نمایش ملک خود به مشتری را بالا می‌برید
              </Typography>

              <PropertyFields
                normalFields={normalFields}
                tickFields={tickFields}
                predefineFields={predefineFields}
                properties={properties}
                loading={loadingFields}
                onAddProperty={addProperty}
                onRemoveProperty={removeProperty}
                onUpdateProperty={updateProperty}
                onUpsertProperty={upsertProperty}
                calculateAutomatic={calculateAutomatic}
                numToPersian={numToPersian}
              />

              <DescriptionInput
                description={description}
                setDescription={setDescription}
                note={note}
                setNote={setNote}
                showDescription={false}
              />
            </>
          )}
        </Box>
      </Box>

      {currentStep === 1 && (
        <NextStepButton onPress={goToStep2} loading={false} />
      )}
      {currentStep === 2 && (
        <SubmitButton
        onPress={handleSubmit}
        loading={beginUpload}
        isVideoProcessing={isVideoUploading}
        isEditMode={isEditMode}
        showToast={showToast}
        />
      )}

      <CategoryModal
        isVisible={showCategoryModal}
        categories={allCategories}
        loading={loadingCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onClose={() => {
          if (selectedCategory) setShowCategoryModal(false);
        }}
        formatCategoryName={formatCategoryName}
      />

      <ImagePreviewModal
        isVisible={isImageModalVisible}
        image={selectedImage}
        onClose={closeImagePreview}
        onDelete={() => {
          deleteImageFromDraft(selectedImage);
          closeImagePreview();
        }}
        onSetMain={() => {
          handleSetMainImage(selectedImage);
          closeImagePreview();
        }}
      />

      <AlertModal
        isVisible={showAlert}
        onCancel={() => setShowAlert(false)}
        onConfirm={handleBackConfirm}
      />

      <CloseModal
        isVisible={showCloseModal}
        onCancel={handleCloseCancel}
        onSave={handleCloseSave}
        onDelete={handleCloseDelete}
      />

      <NoImageAlertModal
        isVisible={showNoImageAlert}
        onCancel={() => setShowNoImageAlert(false)}
        onConfirm={handleNoImageConfirm}
      />

      <AddressModal
        isVisible={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onConfirm={handleAddressConfirm}
        isLoading={beginUpload}
      />

      <Snackbar
        open={toastState.open}
        autoHideDuration={4000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleToastClose} severity={toastState.severity}>
          {toastState.message}
        </Alert>
      </Snackbar>
    </>
  );
};

NewWorkerPage.getLayout = function (page) {
  return <NewWorkerLayout>{page}</NewWorkerLayout>;
};

export default NewWorkerPage;