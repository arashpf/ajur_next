import React, { useState, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Button from "@mui/material/Button";
import Paper from '@mui/material/Paper';

const ImageCropper = ({
  selected_file,
  closeModal,
  updateAvatar,
  current_selection,
}) => {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [imgSrc, setImgSrc] = useState();
  const [loading, set_loading] = useState(false);
  const [imageOrientation, setImageOrientation] = useState(null); // 'landscape' or 'portrait'
  const [minDimensions, setMinDimensions] = useState({ width: 200, height: 200 });
  const imgRef = useRef(null);

  // Target dimensions based on orientation
  const LANDSCAPE_WIDTH = 1200;
  const LANDSCAPE_HEIGHT = 900;
  const PORTRAIT_WIDTH = 900;
  const PORTRAIT_HEIGHT = 1200;

  // Aspect ratio constants - FIXED: 8/6 for landscape, 6/8 for portrait
  const LANDSCAPE_ASPECT = 8/6; // 1.3333
  const PORTRAIT_ASPECT = 6/8; // 0.75

  useEffect(() => {
    if (selected_file) {
      setImgSrc(selected_file.preview);
    } else {
      closeModal();
    }
  }, [selected_file]);

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    
    // Determine if image is portrait or landscape
    const isPortrait = height > width;
    setImageOrientation(isPortrait ? 'portrait' : 'landscape');
    
    // Set initial crop based on orientation
    let cropObj;
    if (isPortrait) {
      // For portrait, use 6:8 aspect ratio
      cropObj = {
        unit: '%',
        x: 5,
        y: 5,
        width: 60, // 60% width
        height: 80, // 80% height to maintain 6:8 ratio
        aspect: PORTRAIT_ASPECT
      };
      
      // Calculate min dimensions based on original image size
      const minCropWidth = Math.min(200, width * 0.2); // At least 200px or 20% of original
      const minCropHeight = minCropWidth / PORTRAIT_ASPECT;
      setMinDimensions({ width: minCropWidth, height: minCropHeight });
    } else {
      // For landscape, use 8:6 aspect ratio
      cropObj = {
        unit: '%',
        x: 5,
        y: 5,
        width: 80, // 80% width
        height: 60, // 60% height to maintain 8:6 ratio
        aspect: LANDSCAPE_ASPECT
      };
      
      // Calculate min dimensions based on original image size
      const minCropHeight = Math.min(200, height * 0.2); // At least 200px or 20% of original
      const minCropWidth = minCropHeight * LANDSCAPE_ASPECT;
      setMinDimensions({ width: minCropWidth, height: minCropHeight });
    }
    
    setCrop(cropObj);
  };

  const handleCropChange = (newCrop) => {
    // Ensure aspect ratio is maintained based on orientation
    if (imageOrientation === 'portrait') {
      newCrop.aspect = PORTRAIT_ASPECT;
    } else if (imageOrientation === 'landscape') {
      newCrop.aspect = LANDSCAPE_ASPECT;
    }
    
    // Enforce minimum dimensions
    if (imgRef.current) {
      const image = imgRef.current;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      
      // Convert pixel dimensions to percentage if needed
      let widthInPixels, heightInPixels;
      
      if (newCrop.unit === '%') {
        widthInPixels = (newCrop.width / 100) * image.width;
        heightInPixels = (newCrop.height / 100) * image.height;
      } else {
        widthInPixels = newCrop.width;
        heightInPixels = newCrop.height;
      }
      
      // Check if dimensions are below minimum
      if (widthInPixels < minDimensions.width || heightInPixels < minDimensions.height) {
        // Calculate the limiting factor
        const widthRatio = minDimensions.width / widthInPixels;
        const heightRatio = minDimensions.height / heightInPixels;
        const scaleFactor = Math.max(widthRatio, heightRatio);
        
        // Scale up to minimum dimensions
        if (newCrop.unit === '%') {
          newCrop.width = Math.min(100, (widthInPixels * scaleFactor / image.width) * 100);
          newCrop.height = Math.min(100, (heightInPixels * scaleFactor / image.height) * 100);
        } else {
          newCrop.width = Math.min(image.width, widthInPixels * scaleFactor);
          newCrop.height = Math.min(image.height, heightInPixels * scaleFactor);
        }
        
        // Adjust x and y to keep crop within bounds
        if (newCrop.x + newCrop.width > 100 && newCrop.unit === '%') {
          newCrop.x = 100 - newCrop.width;
        }
        if (newCrop.y + newCrop.height > 100 && newCrop.unit === '%') {
          newCrop.y = 100 - newCrop.height;
        }
      }
    }
    
    setCrop(newCrop);
  };

  const handleCropComplete = (c) => {
    // Ensure the completed crop maintains the correct aspect ratio
    if (imageOrientation === 'portrait') {
      c.aspect = PORTRAIT_ASPECT;
    } else if (imageOrientation === 'landscape') {
      c.aspect = LANDSCAPE_ASPECT;
    }
    setCompletedCrop(c);
  };

  const showCroppedImage = async () => {
    if (!imgRef.current || !completedCrop) return;

    set_loading(true);
    
    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Calculate actual pixel dimensions of the crop
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    // Determine if cropped area is portrait or landscape
    const isCroppedPortrait = cropHeight > cropWidth;

    // Set target dimensions based on orientation
    let targetWidth, targetHeight;
    
    if (isCroppedPortrait) {
      targetWidth = PORTRAIT_WIDTH;
      targetHeight = PORTRAIT_HEIGHT;
    } else {
      targetWidth = LANDSCAPE_WIDTH;
      targetHeight = LANDSCAPE_HEIGHT;
    }

    // Create canvas with target dimensions
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Draw the cropped area and resize to target dimensions
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      cropWidth,
      cropHeight,
      0,
      0,
      targetWidth,
      targetHeight
    );

    // Convert to blob with good quality
    canvas.toBlob((blob) => {
      if (!blob) return;
      
      // Create object URL from blob
      const fileUrl = URL.createObjectURL(blob);
      
      // Pass to parent and let it handle the next image
      updateAvatar(fileUrl, current_selection);
      set_loading(false);
      
      // Don't close modal here - parent will handle advancing to next image
    }, 'image/jpeg', 0.8); // good quality
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {imgSrc && (
        <ReactCrop
          crop={crop}
          onChange={handleCropChange}
          onComplete={handleCropComplete}
          aspect={imageOrientation === 'portrait' ? PORTRAIT_ASPECT : LANDSCAPE_ASPECT}
          minWidth={minDimensions.width}
          minHeight={minDimensions.height}
          keepSelection={true}
          ruleOfThirds={true}
        >
          <img
            ref={imgRef}
            src={imgSrc}
            style={{ 
              maxHeight: '70vh', 
              maxWidth: '100%',
              display: 'block'
            }}
            onLoad={onImageLoad}
            alt="Crop me"
          />
        </ReactCrop>
      )}
      
      {/* Instructions */}
      <div style={{
        position: 'fixed',
        top: 10,
        left: 10,
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '14px',
        zIndex: 10
      }}>
        محدوده مورد نظر را انتخاب کنید
        {imageOrientation && (
          <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.8 }}>
            نسبت ابعاد: {imageOrientation === 'portrait' ? '۶ به ۸' : '۸ به ۶'}
          </div>
        )}
      </div>
      
      <div className="controls">
        {!loading ? (
          <Paper sx={{ 
            position: 'fixed', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            zIndex: 11, 
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)',
            borderRadius: 0
          }} elevation={9}>
            <Button 
              onClick={showCroppedImage} 
              fullWidth 
              size="large"
              sx={{ 
                color: 'white', 
                fontSize: '1.2rem',
                fontWeight: 'bold',
                py: 2
              }}
            >
              انتخاب
            </Button>
          </Paper>
        ) : (
          <Paper sx={{ 
            position: 'fixed', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            zIndex: 11, 
            background: 'linear-gradient(135deg, #b71c1c 0%, #8b0000 100%)',
            borderRadius: 0
          }} elevation={9}>
            <Button 
              fullWidth 
              size="large"
              sx={{ 
                color: 'white', 
                fontSize: '1.2rem',
                fontWeight: 'bold',
                py: 2
              }}
              disabled
            >
              در حال پردازش...
            </Button>
          </Paper>
        )}
      </div>
    </div>
  );
};

export default ImageCropper;