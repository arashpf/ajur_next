// components/panel/new/components/VideoUploader.js
// Ported from NewWorker.js <VideoUploader>
// Wraps the existing VideoGraber for picking.
// Then manages upload status + progress + cancel + retry.

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButtonMUI from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import VideocamIcon from "@mui/icons-material/Videocam";
import ReactPlayer from "react-player";
import VideoGraber from "../../grabers/VideoGraber";

const VideoUploader = ({
  videos,
  onAddVideo,
  onDeleteVideo,
  onOpenPreview,
  videoModalVisible,
  selectedVideo,
  onCloseVideoPreview,
  isVideoUploading,
  videoUploadProgress,
  currentUploadVideoUri,
  onCancelUpload,
  onRetryUpload,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [optionsForVideo, setOptionsForVideo] = useState(null);

  // Called by VideoGraber when user picks files
  const handleGrabbedVideos = (files) => {
    if (!files || files.length === 0) return;
    files.forEach((file) => {
      onAddVideo(file);
    });
    setShowPicker(false);
  };

  const renderVideo = (vd, index) => {
    const status = vd.uploadStatus || "uploaded";
    const uploading =
      status === "uploading" && currentUploadVideoUri === vd.uri;
    const errored = vd.error === true || status === "error";
    const percent = uploading
      ? Math.min(Math.round(videoUploadProgress || 0), 100)
      : 0;
    const hasThumbnail = vd.thumbnail && vd.thumbnail !== null;
    // Can we retry? Only if we still have the raw File in state.
    const canRetry =
      vd.file instanceof File || vd.file instanceof Blob;
  
    return (
      <Box
        key={vd.uri || vd.id || index}
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          width: { xs: 110, md: 120 },
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: 110, md: 120 },
            borderRadius: "10px",
            overflow: "hidden",
            backgroundColor: "#a92b31",
            cursor: uploading || errored ? "default" : "pointer",
          }}
          onClick={() => {
            if (!uploading && !errored) {
              setOptionsForVideo(vd);
            }
          }}
        >
          {/* thumbnail or placeholder */}
          {hasThumbnail ? (
            <img
              src={vd.thumbnail}
              alt={`video-${index}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <PlayCircleFilledIcon sx={{ fontSize: 50, color: "white" }} />
            </Box>
          )}
  
          {/* -------- uploading overlay -------- */}
          {uploading && (
            <>
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(0,0,0,0.55)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Box sx={{ position: "relative", display: "inline-flex" }}>
                  <CircularProgress
                    variant="determinate"
                    value={percent}
                    size={52}
                    thickness={3.6}
                    sx={{
                      color: "#fff",
                      "& .MuiCircularProgress-circle": {
                        strokeLinecap: "round",
                      },
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "white",
                        fontFamily: "iransans, Arial, sans-serif",
                        fontSize: 13,
                        fontWeight: "bold",
                      }}
                    >
                      {percent}%
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.85)",
                    fontFamily: "iransans, Arial, sans-serif",
                    fontSize: 10,
                  }}
                >
                  در حال آپلود
                </Typography>
              </Box>
  
              {/* ABORT button — top-right corner of thumbnail */}
              <Tooltip title="لغو آپلود">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onCancelUpload) onCancelUpload(vd);
                  }}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    width: 26,
                    height: 26,
                    backgroundColor: "rgba(255,255,255,0.95)",
                    color: "#c62828",
                    "&:hover": { backgroundColor: "white" },
                    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                    zIndex: 5,
                  }}
                >
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </>
          )}
  
          {/* -------- error overlay -------- */}
          {errored && !uploading && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.65)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
                p: 1,
              }}
            >
              {/* error title */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <ErrorOutlineIcon
                  sx={{ fontSize: 16, color: "#ff8a80" }}
                />
                <Typography
                  sx={{
                    color: "#ff8a80",
                    fontFamily: "iransans, Arial, sans-serif",
                    fontSize: 11,
                    fontWeight: "bold",
                  }}
                >
                  خطا در آپلود
                </Typography>
              </Box>
  
              {/* action buttons */}
              <Box sx={{ display: "flex", gap: 1 }}>
                {/* Retry — only if we still have the raw File */}
                {canRetry && (
                  <Tooltip title="تلاش مجدد">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        onRetryUpload(vd);
                      }}
                      sx={{
                        width: 36,
                        height: 36,
                        backgroundColor: "rgba(255,255,255,0.95)",
                        "&:hover": { backgroundColor: "white" },
                      }}
                    >
                      <RefreshIcon
                        sx={{ fontSize: 22, color: "#1976d2" }}
                      />
                    </IconButton>
                  </Tooltip>
                )}
  
                {/* Delete — always available */}
                <Tooltip title="حذف ویدیو">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteVideo(vd);
                    }}
                    sx={{
                      width: 36,
                      height: 36,
                      backgroundColor: "rgba(255,255,255,0.95)",
                      "&:hover": { backgroundColor: "white" },
                    }}
                  >
                    <DeleteOutlineIcon
                      sx={{ fontSize: 22, color: "#c62828" }}
                    />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          )}
        </Box>
  
        {/* linear progress bar under the thumbnail (only while uploading) */}
        {uploading && (
          <Box
            sx={{
              width: "100%",
              height: 4,
              backgroundColor: "#eee",
              borderRadius: "2px",
              mt: 0.5,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: `${percent}%`,
                backgroundColor: "#a92b31",
                transition: "width 0.3s ease",
              }}
            />
          </Box>
        )}
      </Box>
    );
  };

  const renderOptionsDialog = () => {
    if (!optionsForVideo) return null;
    const vd = optionsForVideo;
    const uploading =
      isVideoUploading && currentUploadVideoUri === vd.uri;
    const errored = vd.error || vd.uploadStatus === "error";
    const uploaded = !uploading && !errored;

    return (
      <Dialog
        open={!!optionsForVideo}
        onClose={() => setOptionsForVideo(null)}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            p: 1,
            minWidth: 280,
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {uploading && (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  py: 2,
                  borderBottom: "1px solid #f0f0f0",
                  mb: 1,
                }}
              >
                <CircularProgress size={20} sx={{ color: "#a92b31" }} />
                <Typography
                  sx={{
                    fontFamily: "iransans, Arial, sans-serif",
                    fontSize: 14,
                    color: "#333",
                  }}
                >
                  در حال آپلود... {videoUploadProgress || 0}%
                </Typography>
              </Box>
              <Box
                onClick={() => {
                  setOptionsForVideo(null);
                  onDeleteVideo(vd);
                  if (onCancelUpload) onCancelUpload();
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  py: 1.5,
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#fff5f5" },
                }}
              >
                <DeleteOutlineIcon sx={{ color: "#ff6b6b" }} />
                <Typography
                  sx={{
                    fontFamily: "iransans, Arial, sans-serif",
                    fontSize: 15,
                    color: "#ff6b6b",
                  }}
                >
                  لغو و حذف ویدیو
                </Typography>
              </Box>
            </>
          )}

          {uploaded && (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  py: 2,
                  borderBottom: "1px solid #f0f0f0",
                  mb: 1,
                }}
              >
                <CheckCircleOutlineIcon sx={{ color: "#4CAF50" }} />
                <Typography
                  sx={{
                    fontFamily: "iransans, Arial, sans-serif",
                    fontSize: 14,
                    color: "#333",
                  }}
                >
                  ویدیو با موفقیت آپلود شد
                </Typography>
              </Box>
              <Box
                onClick={() => {
                  setOptionsForVideo(null);
                  onOpenPreview(vd);
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  py: 1.5,
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                <PlayCircleFilledIcon sx={{ color: "#333" }} />
                <Typography
                  sx={{
                    fontFamily: "iransans, Arial, sans-serif",
                    fontSize: 15,
                    color: "#333",
                  }}
                >
                  مشاهده ویدیو
                </Typography>
              </Box>
              <Box
                onClick={() => {
                  setOptionsForVideo(null);
                  onDeleteVideo(vd);
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  py: 1.5,
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#fff5f5" },
                }}
              >
                <DeleteOutlineIcon sx={{ color: "#ff6b6b" }} />
                <Typography
                  sx={{
                    fontFamily: "iransans, Arial, sans-serif",
                    fontSize: 15,
                    color: "#ff6b6b",
                  }}
                >
                  حذف ویدیو
                </Typography>
              </Box>
            </>
          )}

          {errored && (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  py: 2,
                  borderBottom: "1px solid #f0f0f0",
                  mb: 1,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "iransans, Arial, sans-serif",
                    fontSize: 14,
                    color: "#ff6b6b",
                  }}
                >
                  خطا در آپلود ویدیو
                </Typography>
              </Box>
              <Box
                onClick={() => {
                  setOptionsForVideo(null);
                  onRetryUpload(vd);
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  py: 1.5,
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                <RefreshIcon sx={{ color: "#333" }} />
                <Typography
                  sx={{
                    fontFamily: "iransans, Arial, sans-serif",
                    fontSize: 15,
                    color: "#333",
                  }}
                >
                  تلاش مجدد برای بارگذاری
                </Typography>
              </Box>
              <Box
                onClick={() => {
                  setOptionsForVideo(null);
                  onDeleteVideo(vd);
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  py: 1.5,
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#fff5f5" },
                }}
              >
                <DeleteOutlineIcon sx={{ color: "#ff6b6b" }} />
                <Typography
                  sx={{
                    fontFamily: "iransans, Arial, sans-serif",
                    fontSize: 15,
                    color: "#ff6b6b",
                  }}
                >
                  حذف ویدیو
                </Typography>
              </Box>
            </>
          )}

          <Box
            onClick={() => setOptionsForVideo(null)}
            sx={{
              mt: 1,
              py: 1.25,
              textAlign: "center",
              backgroundColor: "#f5f5f5",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            <Typography
              sx={{
                fontFamily: "iransans, Arial, sans-serif",
                fontSize: 15,
                color: "#666",
                fontWeight: "bold",
              }}
            >
              انصراف
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  };

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
        ویدیوهای ملک
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          mx: { xs: 0.5, md: 1 },
          my: 1,
          p: 1,
          backgroundColor: "#f8f9fa",
          borderRadius: "12px",
          overflowX: "auto",
        }}
      >
        {videos.length === 0 && (
          <Box
            onClick={() => setShowPicker(true)}
            sx={{
              width: { xs: 110, md: 120 },
              height: { xs: 110, md: 120 },
              border: "2px dashed #a92b31",
              borderRadius: "10px",
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
              "&:hover": { backgroundColor: "#fef8f8" },
            }}
          >
            <VideocamIcon sx={{ fontSize: 40, color: "#a92b31", mb: 0.5 }} />
            <Typography
              sx={{
                fontFamily: "iransans, Arial, sans-serif",
                fontSize: 12,
                color: "#a92b31",
                fontWeight: 600,
              }}
            >
              افزودن ویدیو
            </Typography>
          </Box>
        )}

        {videos.map(renderVideo)}
      </Box>

      {/* picker — only mounted while open */}
      {showPicker && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 1400,
            backgroundColor: "white",
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              position: "sticky",
              top: 0,
              backgroundColor: "white",
              zIndex: 1,
              display: "flex",
              justifyContent: "flex-end",
              p: 1,
              borderBottom: "1px solid #eee",
            }}
          >
            <IconButton onClick={() => setShowPicker(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ p: 2 }}>
            <VideoGraber
              old_videos={[]}
              onVideosChangeFlag={() => {}}
              onGrabVideos={handleGrabbedVideos}
              onDeleteVideo={() => {}}
            />
          </Box>
        </Box>
      )}

      {renderOptionsDialog()}

      {/* full-screen video preview */}
      <Dialog
        open={videoModalVisible}
        onClose={onCloseVideoPreview}
        fullScreen
        PaperProps={{ sx: { backgroundColor: "black" } }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButtonMUI
            onClick={onCloseVideoPreview}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 10,
              color: "white",
              backgroundColor: "rgba(0,0,0,0.5)",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
            }}
          >
            <CloseIcon />
          </IconButtonMUI>

          {selectedVideo && (
            <ReactPlayer
              url={selectedVideo.uri}
              controls
              playing
              width="100%"
              height="100%"
              style={{ maxHeight: "100%" }}
            />
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

export default VideoUploader;