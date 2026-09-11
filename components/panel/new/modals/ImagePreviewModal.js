// components/panel/new/modals/ImagePreviewModal.js
// Ported from NewWorker.js <ImagePreviewModal>
// imageSrc priority: real URL > data URL > live blob/http URL

import React from "react";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const ImagePreviewModal = ({
  isVisible,
  image,
  onClose,
  onDelete,
  onSetMain,
}) => {
  const imageSrc = image?.url || image?.dataUrl || image?.uri;

  return (
    <Dialog
      open={isVisible}
      onClose={onClose}
      fullScreen
      PaperProps={{ sx: { backgroundColor: "black" } }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 10,
            color: "white",
            backgroundColor: "rgba(0,0,0,0.5)",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
          }}
        >
          <CloseIcon />
        </IconButton>

        {imageSrc && (
          <img
            src={imageSrc}
            alt="preview"
            style={{
              maxWidth: "100%",
              maxHeight: "80%",
              objectFit: "contain",
              display: "block",
            }}
            onError={(e) => {
              console.warn(
                "[ImagePreviewModal] <img> onError:",
                imageSrc?.slice(0, 60)
              );
            }}
          />
        )}

        <Box
          sx={{
            position: "absolute",
            bottom: 40,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            gap: 2,
            px: 2,
          }}
        >
          <Button
            onClick={onDelete}
            sx={{
              backgroundColor: "#e53935",
              color: "white",
              fontFamily: "iransans, Arial, sans-serif",
              fontSize: 15,
              textTransform: "none",
              borderRadius: "10px",
              px: 3,
              py: 1.25,
              "&:hover": { backgroundColor: "#c62828" },
            }}
          >
            حذف این عکس
          </Button>
          <Button
            onClick={onSetMain}
            sx={{
              backgroundColor: "#1976d2",
              color: "white",
              fontFamily: "iransans, Arial, sans-serif",
              fontSize: 15,
              textTransform: "none",
              borderRadius: "10px",
              px: 3,
              py: 1.25,
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            انتخاب برای عکس اصلی
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ImagePreviewModal;