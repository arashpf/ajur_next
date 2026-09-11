import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";

import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import BurstModeIcon from '@mui/icons-material/BurstMode';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import SpeedDial from "@mui/material/SpeedDial";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useRouter } from "next/router";
import Badge from "@mui/material/Badge";
import EditIcon from "@mui/icons-material/Edit";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import ImgCropper from "./ImgCropper";

import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={20} ref={ref} variant="filled" {...props} />;
});

import Styles from "../../styles/panel/ImageGraber.module.css";

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: "12px",
  marginTop: "20px",
  padding: "10px",
  backgroundColor: "#f8f9fa",
  borderRadius: "12px",
  minHeight: "140px",
  alignItems: "center",
};

const thumb = {
  display: "inline-flex",
  borderRadius: "8px",
  border: "2px solid #eaeaea",
  marginBottom: "8px",
  width: "120px",
  height: "120px",
  padding: "4px",
  boxSizing: "border-box",
  position: "relative",
  transition: "all 0.2s ease",
  cursor: "pointer",
};

const activethumb = {
  display: "inline-flex",
  borderRadius: "8px",
  border: "3px solid #ff6b6b",
  marginBottom: "8px",
  width: "120px",
  height: "120px",
  padding: "4px",
  boxSizing: "border-box",
  position: "relative",
  boxShadow: "0 4px 12px rgba(255, 107, 107, 0.3)",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
  borderRadius: "4px",
  width: "100%",
  height: "100%",
};

const img = {
  display: "block",
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const addMoreCard = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "120px",
  height: "120px",
  border: "2px dashed #ff6b6b",
  borderRadius: "8px",
  backgroundColor: "#fff",
  cursor: "pointer",
  transition: "all 0.2s ease",
  marginBottom: "8px",
  '&:hover': {
    backgroundColor: "#fff5f5",
    borderColor: "#ff5252",
  },
};

function Previews(props) {
  const heic2any = require("heic2any");
  const old_images = props.old_images;
  const [files, setFiles] = useState([]);
  const [images, set_images] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [open_modal, set_open_modal] = React.useState(false);
  const [open_drawer, set_open_drawer] = React.useState(false);
  const [problem, setProblem] = useState("test_problem");
  const [vertical, set_vertical] = useState("top");
  const [horizontal, set_horizontal] = useState("center");
  const [alert_type, set_alert_type] = useState("success");
  const [total_selection, set_total_selection] = useState(0);
  const [current_selection, set_current_selection] = useState(0);
  const [selected_file, set_selected_file] = useState(null);
  const [selected_final_thumb, set_selected_final_thumb] = useState();
  const [processingHeic, setProcessingHeic] = useState(false);
  const [cropperKey, setCropperKey] = useState(0);
  
  // Create a ref for the file input
  const fileInputRef = useRef(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
      "image/heic": [".heic"],
    },
    noClick: false,
    onDrop: (acceptedFiles) => {
      handleNewFiles(acceptedFiles);
    },
  });

  const handleNewFiles = async (acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    
    props.onImageChangeFlag(true);
    setProcessingHeic(true);

    try {
      const processedFiles = await Promise.all(
        acceptedFiles.map(async (file) => {
          const ext = file.name.split(".").pop().toLowerCase();
          
          if (ext === "heic" || ext === "heif") {
            try {
              const convertedBlob = await heic2any({ 
                blob: file, 
                toType: "image/jpeg",
                quality: 0.7
              });
              
              const newFile = new File([convertedBlob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                type: "image/jpeg",
              });

              const preview = URL.createObjectURL(newFile);
              
              return Object.assign(newFile, {
                preview: preview,
                originalName: file.name,
                id: `file-${Date.now()}-${Math.random()}`,
                originalSize: file.size
              });
            } catch (error) {
              console.error("Error converting HEIC:", error);
              return null;
            }
          } else {
            const preview = URL.createObjectURL(file);
            return Object.assign(file, {
              preview: preview,
              id: `file-${Date.now()}-${Math.random()}`,
              originalSize: file.size
            });
          }
        })
      );

      const validFiles = processedFiles.filter(f => f !== null);
      
      if (validFiles.length > 0) {
        const filesWithDimensions = await Promise.all(
          validFiles.map((file) => {
            return new Promise((resolve) => {
              const img = new Image();
              img.src = file.preview;
              img.onload = () => {
                file.height = img.height;
                file.width = img.width;
                file.orientation = file.width > file.height ? "landscape" : "portrait";
                file.aspectRatio = file.width / file.height;
                resolve(file);
              };
              img.onerror = () => {
                console.error("Failed to load image:", file.name);
                resolve(file);
              };
            });
          })
        );

        setFiles(prevFiles => [...prevFiles, ...filesWithDimensions]);
        set_total_selection(prev => prev + filesWithDimensions.length);
        
        if (!open_modal && filesWithDimensions.length > 0) {
          set_selected_file(filesWithDimensions[0]);
          set_current_selection(0);
          set_open_modal(true);
          setCropperKey(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error("Error processing files:", error);
    } finally {
      setProcessingHeic(false);
    }
  };

  function toDataUrl(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  }

  // Function to get image dimensions from data URL
  const getImageDimensions = (dataUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.src = dataUrl;
    });
  };

  const convertUrltoDataurl = (url) => {
    toDataUrl(url, function (myBase64) {
      set_images((images) => [...images, myBase64]);
      props.onGrabImages(myBase64); 
    });
  };

  useEffect(() => {
    if (old_images && old_images.length > 0) {
      set_images([]);
      old_images.forEach((fl) => {
        convertUrltoDataurl(fl.url);
      });
    }
  }, [old_images]); 

  function handleClose() {
    setOpen(false);
  }

  function handleCloseModal() {
    if (files.length > 0) {
      moveToNextImage();
    } else {
      set_open_modal(false);
    }
  }

  const handleClickCancelCrop = () => {
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setFiles([]);
    set_open_modal(false);
    set_current_selection(0);
    set_selected_file(null);
  };

  const onClickSingleThumb = (file, index) => {
    set_current_selection(index);
    set_selected_file(file);
    set_open_modal(true);
    setCropperKey(prev => prev + 1);
  };

  const onClickDeletImage = (imager) => {
    toDataUrl(imager, function (myBase64) {
      props.onDeleteImage(myBase64);
    });
    set_images(images.filter((item) => item !== imager));
  };

  const onClickDeletImageFromDrawer = () => {
    const imager = selected_final_thumb;
    toDataUrl(imager, function (myBase64) {
      props.onDeleteImage(myBase64);
    });
    set_images(images.filter((item) => item !== imager));
  };

  const onClickChangeFirstImageFromDrawer = () => {
    const imager = selected_final_thumb;
    const allImagesExceptThisOne = images.filter((item) => item !== imager);
    set_images([imager, ...allImagesExceptThisOne]);
    props.onChaneImagesOrders(imager, images);
  };

  const onClickSingleFinalThumb = (imager, index) => {
    set_selected_final_thumb(imager);
    toggleDrawer(true);
  };

  const handleAddMoreClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const moveToNextImage = () => {
    setFiles(prevFiles => {
      const currentIndex = current_selection;
      const nextIndex = currentIndex + 1;
      
      if (nextIndex < prevFiles.length) {
        const nextFile = prevFiles[nextIndex];
        
        setTimeout(() => {
          set_selected_file(nextFile);
          set_current_selection(nextIndex);
          setCropperKey(prev => prev + 1);
        }, 100);
        
        return prevFiles;
      } else {
        const newFiles = prevFiles.filter((_, idx) => idx !== currentIndex);
        
        if (newFiles.length === 0) {
          setTimeout(() => {
            set_open_modal(false);
            set_selected_file(null);
            set_current_selection(0);
          }, 100);
        }
        
        return newFiles;
      }
    });
  };

  function updateAvatar(dataUrl, currentSelection) {
    if (dataUrl) {
      // Get dimensions of the cropped image
      getImageDimensions(dataUrl).then(dimensions => {
        console.log("Cropped image dimensions:", dimensions);
        
        toDataUrl(dataUrl, function (myBase64) {
          set_images((prevImages) => [...prevImages, myBase64]);
          
          // Pass just the string to parent
          props.onGrabImages(myBase64); 
          
          setFiles(prevFiles => { 
            const newFiles = prevFiles.filter((_, idx) => idx !== currentSelection);
            
            if (newFiles.length > 0) {
              setTimeout(() => {
                set_selected_file(newFiles[0]);
                set_current_selection(0);
                setCropperKey(prev => prev + 1);
              }, 100);
            } else {
              setTimeout(() => {
                set_open_modal(false);
                set_selected_file(null);
                set_current_selection(0);
              }, 100);
            }
            
            return newFiles;
          });
        });
      });
    } else {
      // Skip this image without saving
      setFiles(prevFiles => {
        const newFiles = prevFiles.filter((_, idx) => idx !== currentSelection);
        
        if (newFiles.length > 0) {
          setTimeout(() => {
            set_selected_file(newFiles[0]);
            set_current_selection(0);
            setCropperKey(prev => prev + 1);
          }, 100);
        } else {
          setTimeout(() => {
            set_open_modal(false);
            set_selected_file(null);
            set_current_selection(0);
          }, 100);
        }
        
        return newFiles;
      });
    }
  }

  const onClickDeleteFile = (file, index) => {
    if (file.preview) {
      URL.revokeObjectURL(file.preview);
    }
    
    setFiles(prevFiles => {
      const newFiles = prevFiles.filter((_, i) => i !== index);
      
      if (current_selection === index) {
        if (newFiles.length > 0) {
          const nextIndex = index === prevFiles.length - 1 ? index - 1 : index;
          setTimeout(() => {
            set_selected_file(newFiles[nextIndex]);
            set_current_selection(nextIndex);
            setCropperKey(prev => prev + 1);
          }, 100);
        } else {
          setTimeout(() => {
            set_selected_file(null);
            set_current_selection(0);
            set_open_modal(false);
          }, 100);
        }
      }
      
      return newFiles;
    });
  };

  const renderCurrentImagesForcrop = () => {
    if (files.length === 0) return null;

    return (
      <>
        <div style={{ marginBottom: '20px' }}>
          <Swiper
            slidesPerView={3}
            spaceBetween={3}
            navigation
            breakpoints={{
              200: { slidesPerView: 2, spaceBetween: 2 },
              640: { slidesPerView: 3, spaceBetween: 2 },
              768: { slidesPerView: 4, spaceBetween: 3 },
              1024: { slidesPerView: 6, spaceBetween: 3 },
            }}
            modules={[Pagination, Navigation]}
            className={Styles["cat-swiper"]}
          >
            {files.map((file, index) => (
              <SwiperSlide key={file.id || `file-${index}`}>
                <div
                  style={index === current_selection ? activethumb : thumb}
                  onClick={() => {
                    set_current_selection(index);
                    set_selected_file(file);
                    setCropperKey(prev => prev + 1);
                  }}
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onClickDeleteFile(file, index);
                    }}
                    style={{
                      position: "absolute",
                      top: -5,
                      left: -5,
                      zIndex: 10,
                      cursor: 'pointer'
                    }}
                  >
                    <CancelIcon style={{ color: "red", fontSize: 20 }} />
                  </div>

                  <div style={thumbInner}>
                    <img
                      src={file.preview}
                      style={img}
                      alt={`thumbnail-${index}`}
                      onError={(e) => {
                        console.error("Error loading thumbnail:", file.name);
                      }}
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {selected_file && (
          <Grid item xs={12} md={12} lg={12}>
            <div key={`cropper-wrapper-${cropperKey}`}>
              <ImgCropper
                key={`cropper-${selected_file.id || cropperKey}`}
                updateAvatar={updateAvatar}
                closeModal={handleCloseModal}
                current_selection={current_selection}
                selected_file={selected_file}
              />
            </div>
          </Grid>
        )}
      </>
    );
  };

  const renderModalContent = () => {
    return (
      <Box sx={{ height: '100%', overflow: 'auto', p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {renderCurrentImagesForcrop()}
          </Grid>

          <SpeedDial
            ariaLabel="انصراف"
            sx={{ position: "fixed", top: 10, right: 10 }}
            icon={<CancelIcon fontSize="large" />}
            onClick={handleClickCancelCrop}
            FabProps={{
              sx: {
                bgcolor: "secondary.main",
                "&:hover": {
                  bgcolor: "primary.main",
                },
              },
            }}
          />
        </Grid>
      </Box>
    );
  };

  const toggleDrawer = (newOpen) => {
    set_open_drawer(newOpen);
  };

  const DrawerList = (
    <Box
      sx={{ width: 'auto', direction: 'rtl' }}
      role="presentation"
      onClick={() => toggleDrawer(false)}
    >
      <Divider />
      <List>
        <ListItem onClick={() => onClickDeletImageFromDrawer()}>
          <ListItemButton>
            <ListItemIcon>
              <DeleteIcon style={{ color: "red" }} />
            </ListItemIcon>
            <ListItemText primary={"حذف عکس"} />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem onClick={() => onClickChangeFirstImageFromDrawer()}>
          <ListItemButton>
            <ListItemIcon>
              <BurstModeIcon style={{ color: "green" }} />
            </ListItemIcon>
            <ListItemText primary={"انتخاب برای عکس اصلی"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, []);

  return (
    <section className="container">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: '16px',
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
          عکس‌های ملک
        </Typography>
        
        <div style={thumbsContainer}>
          <input
            {...getInputProps()}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          
          <div 
            style={addMoreCard}
            onClick={handleAddMoreClick}
          >
            {processingHeic ? (
              <CircularProgress size={30} sx={{ color: '#ff6b6b' }} />
            ) : (
              <>
                <AddPhotoAlternateIcon sx={{ fontSize: 40, color: '#ff6b6b', mb: 1 }} />
                <Typography variant="body2" sx={{ color: '#ff6b6b', fontWeight: 600 }}>
                  افزودن عکس
                </Typography>
              </>
            )}
          </div>

          {files.map((file, index) => (
            <div key={file.id || `temp-${index}`}>
              <div
                style={thumb}
                onClick={() => onClickSingleThumb(file, index)}
              >
                <div style={thumbInner}>
                  <img
                    src={file.preview}
                    style={img}
                    alt={`temp-${index}`}
                    onError={(e) => {
                      console.error("Error loading temp image:", file.name);
                    }}
                  />
                </div>
                <Tooltip title="حذف">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClickDeleteFile(file, index);
                    }}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      backgroundColor: '#ff4444',
                      color: 'white',
                      '&:hover': { backgroundColor: '#cc0000' },
                      width: 24,
                      height: 24,
                    }}
                  >
                    ✕
                  </IconButton>
                </Tooltip>
                <Badge
                  badgeContent="جدید"
                  color="warning"
                  sx={{
                    position: 'absolute',
                    top: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                />
                {file.width && file.height && (
                  <Tooltip title={`${file.width} x ${file.height}`}>
                    <Typography
                      variant="caption"
                      sx={{
                        position: 'absolute',
                        bottom: -20,
                        left: 0,
                        right: 0,
                        textAlign: 'center',
                        fontSize: '10px',
                        color: '#666'
                      }}
                    >
                      {file.width} x {file.height}
                    </Typography>
                  </Tooltip>
                )}
              </div>
            </div>
          ))}

          {images.map((im, index) => (
            <div key={`final-${im}-${index}`} style={{ position: 'relative', display: 'inline-block' }}>
              {index === 0 && (
                <Badge
                  badgeContent="اصلی"
                  color="primary"
                  sx={{
                    position: 'absolute',
                    top: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 2,
                    '& .MuiBadge-badge': {
                      fontSize: '10px',
                      backgroundColor: '#ff6b6b',
                    }
                  }}
                />
              )}
              <div
                style={index === 0 ? activethumb : thumb}
                onClick={() => onClickSingleFinalThumb(im, index)}
              >
                <div style={thumbInner}>
                  <img 
                    src={im} 
                    style={img} 
                    alt={`final-${index}`}
                    onError={(e) => {
                      console.error("Error loading final image:", index);
                    }}
                  />
                </div>
                <Tooltip title="حذف">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      set_selected_final_thumb(im);
                      onClickDeletImageFromDrawer();
                    }}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      backgroundColor: '#ff4444',
                      color: 'white',
                      '&:hover': { backgroundColor: '#cc0000' },
                      width: 24,
                      height: 24,
                    }}
                  >
                    ✕
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>

        {images.length === 0 && files.length === 0 && (
          <Typography 
            variant="body2" 
            sx={{ 
              textAlign: 'center', 
              color: '#999',
              mt: 2,
              p: 3,
              border: '2px dashed #eaeaea',
              borderRadius: '12px'
            }}
          >
            هنوز عکسی انتخاب نکرده‌اید. برای شروع روی دکمه "افزودن عکس" کلیک کنید.
          </Typography>
        )}
      </Paper>

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={10000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={alert_type} sx={{ width: "100%" }}>
          {problem}
        </Alert>
      </Snackbar>

      <Modal
        open={open_modal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>{renderModalContent()}</Box>
      </Modal>

      <Drawer
        anchor="bottom"
        open={open_drawer}
        onClose={() => toggleDrawer(false)}
      >
        {DrawerList}
      </Drawer>
    </section>
  );
}

const style = {
  position: "absolute",
  width: "100%",
  height: "100%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflow: 'auto'
};

export default Previews;