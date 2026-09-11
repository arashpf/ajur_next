// components/panel/new/components/ImageUploader.js
// v4 — freeform crop + rotate + aspect buttons + compression to <200 KB.

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Cropper from "react-easy-crop";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CheckIcon from "@mui/icons-material/Check";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

const MAX_IMAGES = 11;

// ------------------------------------------------------------------
// Crop + compress + rotate export
// ------------------------------------------------------------------
const getCroppedDataUrl = (
  imageSrc,
  crop,
  rotation = 0,
  targetKb = 190,
  maxLongSide = 1600
) => {
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;

    image.onload = () => {
      try {
        const rotRad = (rotation * Math.PI) / 180;

        const cos = Math.abs(Math.cos(rotRad));
        const sin = Math.abs(Math.sin(rotRad));
        const bw = image.width * cos + image.height * sin;
        const bh = image.width * sin + image.height * cos;

        // 1) bake rotation
        const workCanvas = document.createElement("canvas");
        workCanvas.width = Math.round(bw);
        workCanvas.height = Math.round(bh);
        const workCtx = workCanvas.getContext("2d");
        workCtx.imageSmoothingQuality = "high";
        workCtx.translate(bw / 2, bh / 2);
        workCtx.rotate(rotRad);
        workCtx.translate(-image.width / 2, -image.height / 2);
        workCtx.drawImage(image, 0, 0);

        // 2) crop coords in work-canvas space
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const cx = crop.x * scaleX;
        const cy = crop.y * scaleY;
        const cw = crop.width * scaleX;
        const ch = crop.height * scaleY;

        // 3) downscale long side
        const longSide = Math.max(cw, ch);
        const downscale = longSide > maxLongSide ? maxLongSide / longSide : 1;
        const outW = Math.max(1, Math.round(cw * downscale));
        const outH = Math.max(1, Math.round(ch * downscale));

        const outCanvas = document.createElement("canvas");
        outCanvas.width = outW;
        outCanvas.height = outH;
        const outCtx = outCanvas.getContext("2d");
        outCtx.imageSmoothingQuality = "high";
        outCtx.drawImage(workCanvas, cx, cy, cw, ch, 0, 0, outW, outH);

        // 4) iterative quality reduction
        let quality = 0.85;
        let dataUrl = outCanvas.toDataURL("image/jpeg", quality);

        for (let i = 0; i < 6; i++) {
          const approxBytes = Math.floor((dataUrl.length - 22) * 0.75);
          const approxKb = approxBytes / 1024;
          if (approxKb <= targetKb || quality <= 0.4) break;
          quality = Math.max(quality - 0.1, 0.4);
          dataUrl = outCanvas.toDataURL("image/jpeg", quality);
        }

        resolve(dataUrl);
      } catch (err) {
        console.error("getCroppedDataUrl error:", err);
        resolve(null);
      }
    };

    image.onerror = () => resolve(null);
  });
};

const convertHeicIfNeeded = async (file) => {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext !== "heic" && ext !== "heif") return file;
  try {
    const heic2any = (await import("heic2any")).default;
    const converted = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.7,
    });
    const newName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
    return new File([converted], newName, { type: "image/jpeg" });
  } catch (e) {
    console.warn("HEIC conversion failed:", e);
    return file;
  }
};

// ------------------------------------------------------------------
// Aspect options
// ------------------------------------------------------------------
const ASPECTS = [
  { key: "free", label: "آزاد", value: undefined },
  { key: "1:1", label: "۱:۱", value: 1 },
  { key: "4:3", label: "۴:۳", value: 4 / 3 },
  { key: "3:4", label: "۳:۴", value: 3 / 4 },
  { key: "16:9", label: "۱۶:۹", value: 16 / 9 },
];

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
const ImageUploader = ({
  images,
  onAddImages,
  onDeleteImage,
  onSetMainImage,
  onOpenPreview,
  onRetryUpload,
  uploadImage,
  updateImage,
  updateImageStatus,
  showToast,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const [pendingQueue, setPendingQueue] = useState([]);
  const [currentPending, setCurrentPending] = useState(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState(undefined); // freeform by default
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [processing, setProcessing] = useState(false);

  const resetCropState = useCallback(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
    // keep current aspect selection
  }, []);

  // ---------- file select ----------
  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (!acceptedFiles || acceptedFiles.length === 0) return;

      const slotsLeft = MAX_IMAGES - images.length - pendingQueue.length;
      if (slotsLeft <= 0) {
        showToast(`حداکثر ${MAX_IMAGES} عکس می‌توانید انتخاب کنید`, "warning");
        return;
      }

      const take = acceptedFiles.slice(0, slotsLeft);
      const converted = await Promise.all(take.map(convertHeicIfNeeded));

      const newQueue = converted.map((file, idx) => ({
        id: `pending-${Date.now()}-${idx}`,
        url: URL.createObjectURL(file),
        name: file.name,
      }));

      setPendingQueue((prev) => {
        const merged = [...prev, ...newQueue];
        if (!currentPending && merged.length > 0) {
          setCurrentPending(merged[0]);
          resetCropState();
        }
        return merged;
      });
    },
    [images.length, pendingQueue.length, currentPending, showToast, resetCropState]
  );

  const { getRootProps, getInputProps, open: openFileDialog } = useDropzone({
    accept: { "image/*": [], "image/heic": [".heic", ".heif"] },
    multiple: true,
    noClick: true,
    noKeyboard: true,
    onDrop,
  });

  // ---------- crop callbacks ----------
  const onCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const advanceQueue = useCallback(() => {
    setPendingQueue((prev) => {
      const remaining = prev.filter((p) => p.id !== currentPending?.id);
      if (remaining.length > 0) {
        setCurrentPending(remaining[0]);
        resetCropState();
      } else {
        setCurrentPending(null);
        setShowPicker(false);
      }
      return remaining;
    });
  }, [currentPending, resetCropState]);

  const handleConfirmCrop = useCallback(async () => {
    if (!currentPending || !croppedAreaPixels) return;

    setProcessing(true);
    try {
      const dataUrl = await getCroppedDataUrl(
        currentPending.url,
        croppedAreaPixels,
        rotation,
        190,   // target KB
        1600   // max long side px
      );

      console.log("[ImageUploader] cropped length:", dataUrl?.length);
      console.log(
        "[ImageUploader] approx KB:",
        dataUrl ? Math.round(((dataUrl.length - 22) * 0.75) / 1024) : 0
      );

      if (!dataUrl) throw new Error("crop failed");

      const tempUri = `temp-${Date.now()}-${Math.random()}`;

      onAddImages([
        {
          uri: tempUri,
          dataUrl,
          mime: "image/jpeg",
          uploadStatus: "uploading",
        },
      ]);

      uploadImage(dataUrl, "image/jpeg")
        .then((result) => {
          if (result?.image) {
            let realUrl =
              result.image.url ||
              (result.image.filepath
                ? `https://api.ajur.app/public/workers/images/${result.image.filepath}`
                : dataUrl);
            realUrl = realUrl.replace(
              "https://api.ajur.app/storage/workers/images/",
              "https://api.ajur.app/public/workers/images/"
            );
            updateImage(tempUri, {
              id: result.image.id,
              url: realUrl,
              uri: realUrl,
              filepath: result.image.filepath,
              uploadStatus: "uploaded",
            });
          } else {
            updateImageStatus(tempUri, "error");
            showToast("خطا در آپلود عکس: پاسخ نامعتبر", "error");
          }
        })
        .catch((error) => {
          console.error("image upload error:", error);
          updateImageStatus(tempUri, "error");
          const msg =
            error?.response?.data?.message ||
            error?.message ||
            "خطا در آپلود عکس";
          showToast(msg, "error");
        });

      URL.revokeObjectURL(currentPending.url);
      advanceQueue();
    } catch (e) {
      console.error("crop confirm error:", e);
      showToast("خطا در برش عکس", "error");
    } finally {
      setProcessing(false);
    }
  }, [
    currentPending,
    croppedAreaPixels,
    rotation,
    onAddImages,
    uploadImage,
    updateImage,
    updateImageStatus,
    showToast,
    advanceQueue,
  ]);

  const handleSkipCrop = useCallback(() => {
    if (currentPending) URL.revokeObjectURL(currentPending.url);
    advanceQueue();
  }, [currentPending, advanceQueue]);

  const handleClosePicker = useCallback(() => {
    pendingQueue.forEach((p) => URL.revokeObjectURL(p.url));
    setPendingQueue([]);
    setCurrentPending(null);
    setShowPicker(false);
  }, [pendingQueue]);

  useEffect(() => {
    return () => {
      pendingQueue.forEach((p) => URL.revokeObjectURL(p.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- grid ----------
  const handleDelete = async (img) => {
    if (img.id) await onDeleteImage(img);
    else onDeleteImage(img);
  };

  const renderImage = (img, index) => {
    const status = img.uploadStatus || "uploaded";
    const uploading = status === "uploading";
    const errored = status === "error";
    const isMain = index === 0;

    const imageSrc =
      img.dataUrl ||
      img.url ||
      (img.uri?.startsWith("http") || img.uri?.startsWith("blob:")
        ? img.uri
        : "");

    return (
      <Box
        key={img.id || img.uri || index}
        sx={{
          position: "relative",
          width: { xs: 100, md: 110 },
          height: { xs: 100, md: 110 },
          borderRadius: "10px",
          overflow: "hidden",
          backgroundColor: "#eee",
          flexShrink: 0,
          cursor: uploading ? "default" : "pointer",
        }}
        onClick={() => {
          if (!uploading && !errored) onOpenPreview(img);
        }}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`image-${index}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : null}

        {isMain && !uploading && !errored && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              backgroundColor: "rgba(0,0,0,0.7)",
              py: 0.4,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                color: "white",
                fontSize: 10,
                fontFamily: "iransans, Arial, sans-serif",
              }}
            >
              عکس اصلی
            </Typography>
          </Box>
        )}

        <Tooltip title="حذف">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(img);
            }}
            sx={{
              position: "absolute",
              top: 3,
              right: 3,
              backgroundColor: "white",
              width: 22,
              height: 22,
              "&:hover": { backgroundColor: "#ffe0e0" },
            }}
          >
            <CloseIcon sx={{ fontSize: 16, color: "red" }} />
          </IconButton>
        </Tooltip>

        {uploading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress size={30} sx={{ color: "white" }} />
          </Box>
        )}

        {errored && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onRetryUpload(img);
              }}
              sx={{
                backgroundColor: "rgba(255,255,255,0.9)",
                "&:hover": { backgroundColor: "white" },
              }}
            >
              <RefreshIcon sx={{ fontSize: 32, color: "#ff6b6b" }} />
            </IconButton>
          </Box>
        )}
      </Box>
    );
  };

  // ---------- render ----------
  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        sx={{
          color: "gray",
          mx: { xs: 1, md: 1.5 },
          fontFamily: "iransans, Arial, sans-serif",
          fontSize: 17,
          fontWeight: 500,
        }}
      >
        عکس های ملک
      </Typography>
      <Typography
        sx={{
          color: "gray",
          mx: { xs: 1, md: 1.5 },
          mb: 1,
          fontFamily: "iransans, Arial, sans-serif",
          fontSize: 13,
        }}
      >
        ملک هایی که عکس های با کیفیتی دارند در آجر تا ۵ برابر بیشتر دیده میشوند
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          mx: { xs: 0.5, md: 1 },
          p: 1,
          backgroundColor: "#f8f9fa",
          borderRadius: "12px",
          minHeight: 120,
        }}
      >
        {images.length < MAX_IMAGES && (
          <Box
            onClick={() => setShowPicker(true)}
            sx={{
              width: { xs: 100, md: 110 },
              height: { xs: 100, md: 110 },
              border: "2px dashed #a92b31",
              borderRadius: "10px",
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
              transition: "all 0.2s",
              "&:hover": { backgroundColor: "#fef8f8", borderColor: "#8a2228" },
            }}
          >
            <AddPhotoAlternateIcon sx={{ fontSize: 40, color: "#a92b31", mb: 0.5 }} />
            <Typography
              sx={{
                fontFamily: "iransans, Arial, sans-serif",
                fontSize: 11,
                color: "#a92b31",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              انتخاب عکس جدید
            </Typography>
          </Box>
        )}

        {images.map(renderImage)}
      </Box>

      {showPicker && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 1400,
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1.5,
              borderBottom: "1px solid #eee",
            }}
          >
            <Typography
              sx={{
                fontFamily: "iransans, Arial, sans-serif",
                fontSize: 16,
                fontWeight: "bold",
                color: "#333",
              }}
            >
              {currentPending
                ? `برش عکس (${pendingQueue.length} در صف)`
                : "انتخاب عکس"}
            </Typography>
            <IconButton onClick={handleClosePicker} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {currentPending ? (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#111",
              }}
            >
              {/* Aspect buttons */}
              <Box
                sx={{
                  display: "flex",
                  gap: 0.5,
                  px: 2,
                  py: 1,
                  backgroundColor: "#000",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {ASPECTS.map((a) => (
                  <Button
                    key={a.key}
                    size="small"
                    onClick={() => setAspect(a.value)}
                    sx={{
                      minWidth: 44,
                      px: 1.5,
                      py: 0.5,
                      color: aspect === a.value ? "#fff" : "#aaa",
                      backgroundColor:
                        aspect === a.value ? "#a92b31" : "transparent",
                      border: "1px solid",
                      borderColor:
                        aspect === a.value ? "#a92b31" : "#444",
                      borderRadius: "20px",
                      fontFamily: "iransans, Arial, sans-serif",
                      fontSize: 12,
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor:
                          aspect === a.value ? "#8a2228" : "#222",
                      },
                    }}
                  >
                    {a.label}
                  </Button>
                ))}
                <Button
                  size="small"
                  onClick={resetCropState}
                  startIcon={<RestartAltIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    minWidth: 44,
                    px: 1.5,
                    py: 0.5,
                    color: "#ccc",
                    border: "1px solid #444",
                    borderRadius: "20px",
                    fontFamily: "iransans, Arial, sans-serif",
                    fontSize: 12,
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#222" },
                  }}
                >
                  بازنشانی
                </Button>
              </Box>

              {/* Cropper area */}
              <Box sx={{ position: "relative", flex: 1, overflow: "hidden" }}>
                <Cropper
                  image={currentPending.url}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={aspect}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                  objectFit="contain"
                  showGrid={true}
                  restrictPosition={true}
                />
              </Box>

              {/* Sliders */}
              <Box
                sx={{
                  px: 3,
                  py: 1.5,
                  backgroundColor: "#000",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                {/* Zoom */}
                <Box>
                  <Typography
                    sx={{
                      color: "#888",
                      fontSize: 11,
                      fontFamily: "iransans, Arial, sans-serif",
                      mb: 0.5,
                    }}
                  >
                    بزرگنمایی
                  </Typography>
                  <Slider
                    value={zoom}
                    min={1}
                    max={5}
                    step={0.05}
                    onChange={(e, val) => setZoom(val)}
                    sx={{
                      color: "#a92b31",
                      "& .MuiSlider-thumb": { backgroundColor: "white" },
                    }}
                  />
                </Box>

                {/* Rotation */}
                <Box>
                  <Typography
                    sx={{
                      color: "#888",
                      fontSize: 11,
                      fontFamily: "iransans, Arial, sans-serif",
                      mb: 0.5,
                    }}
                  >
                    چرخش ({Math.round(rotation)}°)
                  </Typography>
                  <Slider
                    value={rotation}
                    min={0}
                    max={360}
                    step={1}
                    onChange={(e, val) => setRotation(val)}
                    sx={{
                      color: "#a92b31",
                      "& .MuiSlider-thumb": { backgroundColor: "white" },
                    }}
                  />
                </Box>
              </Box>

              {/* Actions */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  px: 2,
                  py: 2,
                  pb: 3,
                  backgroundColor: "#000",
                }}
              >
                <Button
                  onClick={handleSkipCrop}
                  disabled={processing}
                  startIcon={<SkipNextIcon />}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    backgroundColor: "#444",
                    color: "white",
                    fontFamily: "iransans, Arial, sans-serif",
                    fontSize: 15,
                    textTransform: "none",
                    borderRadius: "10px",
                    "&:hover": { backgroundColor: "#555" },
                  }}
                >
                  رد کردن
                </Button>

                <Button
                  onClick={handleConfirmCrop}
                  disabled={processing}
                  startIcon={
                    processing ? (
                      <CircularProgress size={18} sx={{ color: "white" }} />
                    ) : (
                      <CheckIcon />
                    )
                  }
                  sx={{
                    flex: 2,
                    py: 1.5,
                    backgroundColor: "#4CAF50",
                    color: "white",
                    fontFamily: "iransans, Arial, sans-serif",
                    fontSize: 15,
                    fontWeight: "bold",
                    textTransform: "none",
                    borderRadius: "10px",
                    "&:hover": { backgroundColor: "#43a047" },
                    "&:disabled": { backgroundColor: "#666", color: "#ccc" },
                  }}
                >
                  {processing ? "در حال پردازش..." : "تایید عکس"}
                </Button>
              </Box>
            </Box>
          ) : (
            <Box
              {...getRootProps()}
              sx={{
                flex: 1,
                m: 2,
                border: "2px dashed #a92b31",
                borderRadius: "16px",
                backgroundColor: "#fdf7f8",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 4,
                textAlign: "center",
                cursor: "pointer",
                "&:hover": { backgroundColor: "#fcecee" },
              }}
              onClick={openFileDialog}
            >
              <input {...getInputProps()} />
              <AddPhotoAlternateIcon sx={{ fontSize: 70, color: "#a92b31", mb: 2 }} />
              <Typography
                sx={{
                  fontFamily: "iransans, Arial, sans-serif",
                  fontSize: 17,
                  color: "#333",
                  mb: 1,
                }}
              >
                عکس ها را اینجا بکشید و رها کنید
              </Typography>
              <Typography
                sx={{
                  fontFamily: "iransans, Arial, sans-serif",
                  fontSize: 14,
                  color: "#666",
                  mb: 3,
                }}
              >
                یا
              </Typography>
              <Button
                variant="contained"
                sx={{
                  px: 4,
                  py: 1.5,
                  background: "linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)",
                  color: "white",
                  fontFamily: "iransans, Arial, sans-serif",
                  fontSize: 15,
                  fontWeight: "bold",
                  textTransform: "none",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(255, 107, 107, 0.3)",
                }}
              >
                انتخاب کنید
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ImageUploader;