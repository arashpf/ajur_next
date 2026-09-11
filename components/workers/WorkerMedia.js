import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Styles from "../styles/WorkerMedia.module.css";
import dynamic from "next/dynamic";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Link from "next/link";
import { useRouter } from "next/router";

// Dynamically import Swiper (keep for compatibility but won't use for now)
const Swiper = dynamic(
  () => import("swiper/react").then(mod => mod.Swiper),
  { 
    ssr: false,
    loading: () => null
  }
);

const SwiperSlide = dynamic(
  () => import("swiper/react").then(mod => mod.SwiperSlide),
  { 
    ssr: false,
    loading: () => null
  }
);

export default function WorkerMedia({details = [] , images = [], virtual_tours = [], videos = [] }) {
  const router = useRouter();
  // const [activeTab, setActiveTab] = useState("images");

  const [activeTab, setActiveTab] = useState(
    videos && videos.length > 0 ? "videos" : "images"
  );
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);


  
  // Movement effect states
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragThreshold, setDragThreshold] = useState(0);

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  
  // Animation states
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageOrientations, setImageOrientations] = useState({});
  const animationRef = useRef(null);
  const animationStartTimeRef = useRef(null);
  
  const mediaContainerRef = useRef(null);
  const videoRef = useRef(null); // Add video ref
  const cleanupRef = useRef([]);
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const dragImageRef = useRef(null);
  const isClickRef = useRef(true);
  const imageRefs = useRef({});
  const isSwipingRef = useRef(false);

  // Simple memoization with safe defaults
  const memoizedImages = useMemo(() => {
    return Array.isArray(images) ? images : [];
  }, [images]);
  
  const memoizedVideos = useMemo(() => {
    return Array.isArray(videos) ? videos : [];
  }, [videos]);
  
  const memoizedTours = useMemo(() => {
    return Array.isArray(virtual_tours) ? virtual_tours : [];
  }, [virtual_tours]);

  // Handle video playback when tab changes
  useEffect(() => {
    if (activeTab === "videos" && videoRef.current) {
      // Scroll to top of media container smoothly
      if (mediaContainerRef.current) {
        const yOffset = -20;
        const y = mediaContainerRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
      
      // Play the video with a small delay to ensure it's ready
      // setTimeout(() => {
      //   if (videoRef.current) {
      //     videoRef.current.play().catch(error => {
      //       console.log("Autoplay prevented:", error);
      //     });
      //   }
      // }, 100);
    }
  }, [activeTab]);

  // Initialize
  useEffect(() => {
    setHasMounted(true);
    
    return () => {
      cleanupRef.current.forEach(cleanup => cleanup?.());
      cleanupRef.current = [];
      if (hasMounted) {
        document.body.style.overflow = "";
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Detect image orientation with safe checks
  useEffect(() => {
    if (!memoizedImages.length) return;

    const checkImageOrientations = async () => {
      const orientations = {};
      
      for (let i = 0; i < memoizedImages.length; i++) {
        const imageItem = memoizedImages[i];
        if (!imageItem || !imageItem.url) continue;
        
        const img = new Image();
        img.src = imageItem.url;
        
        await new Promise((resolve) => {
          img.onload = () => {
            orientations[i] = {
              isLandscape: img.width > img.height,
              width: img.width || 0,
              height: img.height || 0
            };
            resolve();
          };
          img.onerror = () => {
            orientations[i] = {
              isLandscape: true,
              width: 0,
              height: 0
            };
            resolve();
          };
        });
      }
      
      setImageOrientations(orientations);
    };

    checkImageOrientations();
  }, [memoizedImages]);

  // Handle Android back button
  useEffect(() => {
    if (!lightboxOpen || !hasMounted) return;

    const handlePopState = (e) => {
      e.preventDefault();
      closeLightbox();
      window.history.pushState(null, '', window.location.pathname);
    };

    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [lightboxOpen, hasMounted]);

  // Image URL optimization with safe check
  const getOptimizedImageUrl = useCallback((url, size = "medium") => {
    if (!url || typeof url !== 'string') return '';
    
    try {
      const params = new URLSearchParams();
      
      if (size === "thumbnail") {
        params.set("w", "300");
        params.set("h", "200");
      } else if (size === "medium") {
        params.set("w", "800");
        params.set("h", "600");
      } else if (size === "large") {
        params.set("w", "1200");
        params.set("h", "900");
      }
      
      params.set("fm", "webp");
      params.set("auto", "format");
      
      if (url.includes("?")) {
        return `${url}&${params.toString()}`;
      }
      
      return `${url}?${params.toString()}`;
    } catch (error) {
      console.error("Error optimizing image URL:", error);
      return url;
    }
  }, []);

  // Smooth animation using requestAnimationFrame
  const startImageAnimation = useCallback((index) => {
    // Safe checks - only animate if not dragging and not swiping
    if (isDragging || isSwipingRef.current || !imageOrientations || !imageRefs.current) return;
    
    const orientation = imageOrientations[index];
    const imgElement = imageRefs.current[index];
    
    if (!orientation || !imgElement) return;

    // Stop any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    setIsAnimating(true);
    const startTime = performance.now();
    
    // Set initial state
    imgElement.style.transition = 'none';
    imgElement.style.willChange = 'transform, object-position';
    
    const animate = (currentTime) => {
      if (!imgElement || isDragging || isSwipingRef.current) {
        cancelAnimationFrame(animationRef.current);
        return;
      }
      
      const elapsed = (currentTime - startTime) / 1000; // seconds
      
      if (orientation.isLandscape) {
        // Landscape animation
        const cycleDuration = 15;
        const t = (elapsed % cycleDuration) / cycleDuration;
        const smoothProgress = (Math.cos(t * Math.PI * 2) + 1) / 2;
        const scale = 1.12 - (smoothProgress * 0.08);
        const posX = 60 - (smoothProgress * 20);
        
        imgElement.style.transform = `scale(${scale})`;
        imgElement.style.objectPosition = `${posX}% 50%`;
      } else {
        // Portrait animation - starts from middle (50%)
        const cycleDuration = 28;
        const t = (elapsed % cycleDuration) / cycleDuration;
        const smoothProgress = (Math.sin(t * Math.PI * 2) + 1) / 2;
        const posY = 20 + (smoothProgress * 60);
        
        imgElement.style.transform = 'scale(1)';
        imgElement.style.objectPosition = `50% ${posY}%`; // Fixed: Changed from 100% to 50% for X position
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
  }, [isDragging, imageOrientations]);

  const stopImageAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    setIsAnimating(false);
    
    // Reset current image
    if (dragImageRef.current) {
      dragImageRef.current.style.transition = 'none';
      dragImageRef.current.style.transform = 'scale(1)';
      dragImageRef.current.style.objectPosition = '50% 50%';
      dragImageRef.current.style.willChange = 'auto';
    }
    
    // Reset all images
    if (imageRefs.current) {
      Object.values(imageRefs.current).forEach(img => {
        if (img && typeof img.style !== 'undefined') {
          img.style.transition = 'none';
          img.style.transform = 'scale(1)';
          img.style.objectPosition = '50% 50%';
          img.style.willChange = 'auto';
        }
      });
    }
    
    setImagePosition({ x: 50, y: 50 });
  }, []);

  // Lightbox functions - Opens grid view first (like thumbnails)
  const openLightbox = useCallback((index) => {
    stopImageAnimation();
    const safeIndex = Math.min(Math.max(0, index), memoizedImages.length - 1);
    setLightboxIndex(safeIndex);
    setLightboxOpen(true);
    setIsFullscreen(false);
    if (hasMounted) {
      document.body.style.overflow = "hidden";
    }
  }, [hasMounted, stopImageAnimation, memoizedImages.length]);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setIsFullscreen(false);
    if (hasMounted) {
      document.body.style.overflow = "";
    }
  }, [hasMounted]);

  const showPrev = useCallback(() => {
    stopImageAnimation();
    if (memoizedImages.length > 0) {
      setMainImageIndex(prev => (prev - 1 + memoizedImages.length) % memoizedImages.length);
      setImagePosition({ x: 50, y: 50 });
    }
  }, [memoizedImages.length, stopImageAnimation]);

  const showNext = useCallback(() => {
    stopImageAnimation();
    if (memoizedImages.length > 0) {
      setMainImageIndex(prev => (prev + 1) % memoizedImages.length);
      setImagePosition({ x: 50, y: 50 });
    }
  }, [memoizedImages.length, stopImageAnimation]);

  // Handle video thumbnail click
  // const handleVideoThumbClick = useCallback(() => {
  //   setActiveTab("videos");
  //   // The useEffect above will handle scrolling and playing
  // }, []);


    // Handle video thumbnail click
    const handleVideoThumbClick = useCallback(() => {
      setActiveTab("videos");
  
      // Scroll to top of media container smoothly
      if (mediaContainerRef.current) {
        const yOffset = -20;
        const y = mediaContainerRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
  
      // Play the video with a small delay to ensure it's ready after the tab switch and scroll
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(error => {
            console.log("Autoplay prevented:", error);
            // Optionally, you could inform the user here if playback is prevented
          });
        }
      }, 100); // A small delay might still be helpful after the tab switch
  
    }, []); // Dependencies remain the same
  

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen || !hasMounted || !memoizedImages.length) return;
    
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        if (isFullscreen) {
          setLightboxIndex(prev => (prev - 1 + memoizedImages.length) % memoizedImages.length);
        }
      } else if (e.key === "ArrowRight") {
        if (isFullscreen) {
          setLightboxIndex(prev => (prev + 1) % memoizedImages.length);
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, hasMounted, closeLightbox, memoizedImages.length, isFullscreen]);

  // Touch handlers
  const handleTouchStart = useCallback((e) => {
    stopImageAnimation();
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch?.clientX || 0,
      y: touch?.clientY || 0,
      time: Date.now()
    };
    isClickRef.current = true;
    isSwipingRef.current = false;
    setDragThreshold(0);
  }, [stopImageAnimation]);

  const handleTouchMove = useCallback((e) => {
    if (!dragImageRef.current) return;
    
    const touch = e.touches[0];
    if (!touch) return;
    
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
    
    if (deltaX > deltaY && deltaX > 10) {
      isSwipingRef.current = true;
      isClickRef.current = false;
      e.preventDefault();
    } else if (deltaY > 10) {
      isClickRef.current = false;
    }
    
    setDragThreshold(Math.max(deltaX, deltaY));
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (!dragImageRef.current) return;
    
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - touchStartRef.current.time;
    const touch = e.changedTouches[0];
    
    if (touch) {
      const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
      const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
      
      if (isClickRef.current && touchDuration < 300 && deltaX < 10 && deltaY < 10) {
        openLightbox(mainImageIndex);
        return;
      }
      
      if (touchDuration < 300 && deltaX > deltaY && deltaX > 30) {
        if (touch.clientX > touchStartRef.current.x) {
          showPrev();
        } else {
          showNext();
        }
      }
    }
    
    setIsDragging(false);
    isClickRef.current = true;
    isSwipingRef.current = false;
  }, [mainImageIndex, openLightbox, showPrev, showNext]);

  // Mouse handlers
  const handleMouseDown = useCallback((e) => {
    stopImageAnimation();
    e.preventDefault();
    touchStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now()
    };
    isClickRef.current = true;
    isSwipingRef.current = false;
    setDragThreshold(0);
  }, [stopImageAnimation]);

  const handleMouseMove = useCallback((e) => {
    if (!dragImageRef.current || isClickRef.current === false) return;
    
    const deltaX = Math.abs(e.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(e.clientY - touchStartRef.current.y);
    
    if (deltaX > deltaY && deltaX > 5) {
      isSwipingRef.current = true;
      isClickRef.current = false;
    } else if (deltaY > 5) {
      isClickRef.current = false;
    }
    
    setDragThreshold(Math.max(deltaX, deltaY));
  }, []);

  const handleMouseUp = useCallback((e) => {
    if (isClickRef.current && dragThreshold < 10) {
      openLightbox(mainImageIndex);
    }
    
    setIsDragging(false);
    isClickRef.current = true;
    isSwipingRef.current = false;
  }, [dragThreshold, mainImageIndex, openLightbox]);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    isClickRef.current = true;
    isSwipingRef.current = false;
  }, []);

  // Start animation when idle
  useEffect(() => {
    if (memoizedImages.length > 0 && !isDragging && !isSwipingRef.current && !lightboxOpen) {
      startImageAnimation(mainImageIndex);
    }
  }, [mainImageIndex, memoizedImages, isDragging, lightboxOpen, startImageAnimation]);

  // Reset animation when changing images
  useEffect(() => {
    stopImageAnimation();
    setImagePosition({ x: 50, y: 50 });
    
    if (dragImageRef.current) {
      dragImageRef.current.style.transition = 'none';
      dragImageRef.current.style.transform = 'scale(1)';
      dragImageRef.current.style.objectPosition = '50% 50%';
    }
    
    if (!isDragging && !isSwipingRef.current && !lightboxOpen) {
      startImageAnimation(mainImageIndex);
    }
    
    return () => stopImageAnimation();
  }, [mainImageIndex, isDragging, lightboxOpen, startImageAnimation, stopImageAnimation]);

  // Lightbox handlers
  const handleLightboxTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch?.clientX || 0,
      y: touch?.clientY || 0,
      time: Date.now()
    };
    isClickRef.current = true;
  }, []);

  const handleLightboxTouchMove = useCallback((e) => {
    if (!dragImageRef.current) return;
    
    const touch = e.touches[0];
    if (!touch) return;
    
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
    
    if (deltaX > 10 || deltaY > 10) {
      isClickRef.current = false;
      e.preventDefault();
    }
    
    if (!isClickRef.current) {
      setIsDragging(true);
      
      const moveX = touch.clientX - touchStartRef.current.x;
      const moveY = touch.clientY - touchStartRef.current.y;
      
      const moveSensitivity = 0.2;
      const newX = Math.max(0, Math.min(100, imagePosition.x + (moveX * moveSensitivity)));
      const newY = Math.max(0, Math.min(100, imagePosition.y + (moveY * moveSensitivity)));
      
      setImagePosition({ x: newX, y: newY });
      
      if (dragImageRef.current) {
        dragImageRef.current.style.transition = 'none';
        dragImageRef.current.style.objectPosition = `${newX}% ${newY}%`;
      }
    }
  }, [imagePosition]);

  const handleLightboxTouchEnd = useCallback((e) => {
    if (!dragImageRef.current) return;
    
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - touchStartRef.current.time;
    const touch = e.changedTouches[0];
    
    if (touch && memoizedImages.length > 0 && isFullscreen) {
      const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
      const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
      
      if (touchDuration < 300 && deltaX > deltaY && deltaX > 30) {
        if (touch.clientX > touchStartRef.current.x) {
          setLightboxIndex(prev => (prev - 1 + memoizedImages.length) % memoizedImages.length);
        } else {
          setLightboxIndex(prev => (prev + 1) % memoizedImages.length);
        }
        setImagePosition({ x: 50, y: 50 });
      }
    }
    
    setIsDragging(false);
    isClickRef.current = true;
  }, [memoizedImages.length, isFullscreen]);

  const handleLightboxMouseDown = useCallback((e) => {
    e.preventDefault();
    touchStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now()
    };
    isClickRef.current = true;
  }, []);

  const handleLightboxMouseMove = useCallback((e) => {
    if (!dragImageRef.current || !isClickRef.current === false) return;
    
    const deltaX = Math.abs(e.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(e.clientY - touchStartRef.current.y);
    
    if (deltaX > 5 || deltaY > 5) {
      isClickRef.current = false;
    }
    
    if (!isClickRef.current) {
      setIsDragging(true);
      
      const moveX = e.clientX - touchStartRef.current.x;
      const moveY = e.clientY - touchStartRef.current.y;
      
      const moveSensitivity = 0.2;
      const newX = Math.max(0, Math.min(100, imagePosition.x + (moveX * moveSensitivity)));
      const newY = Math.max(0, Math.min(100, imagePosition.y + (moveY * moveSensitivity)));
      
      setImagePosition({ x: newX, y: newY });
      
      if (dragImageRef.current) {
        dragImageRef.current.style.transition = 'none';
        dragImageRef.current.style.objectPosition = `${newX}% ${newY}%`;
      }
    }
  }, [imagePosition]);

  const handleLightboxMouseUp = useCallback(() => {
    setIsDragging(false);
    isClickRef.current = true;
  }, []);

  // Render functions
  const renderImageSlide = useCallback((item, index) => {
    if (!item || !item.url) return null;
    
    return (
      <div 
        className={`${Styles.imageContainer} ${isDragging ? Styles.dragging : ''}`}
        style={{ 
          width: '100%', 
          height: '100%',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <img
          ref={el => {
            if (el && index === mainImageIndex) {
              dragImageRef.current = el;
              imageRefs.current[index] = el;
            }
          }}
          src={getOptimizedImageUrl(item.url, "medium")}
          // alt={`Image ${index + 1}`}
         
          alt={` ${details.name} در ${details.category_name} ${details.neighbourhood} ${details.city} عکس شماره ${index + 1}  `} 
          className={`${Styles.mainImage} ${isDragging ? Styles.dragging : ''} ${isAnimating ? Styles.animating : ''}`}
          style={{ 
            objectPosition: `${imagePosition.x}% ${imagePosition.y}%`,
            transform: 'scale(1)',
          }}
          loading={index === 0 ? "eager" : "lazy"}
          width="800"
          height="600"
          draggable="false"
          onLoad={() => {
            if (index === mainImageIndex && !isDragging && !isSwipingRef.current && !lightboxOpen) {
              startImageAnimation(index);
            }
          }}
        />
      </div>
    );
  }, [getOptimizedImageUrl, imagePosition, isDragging, isAnimating, mainImageIndex, lightboxOpen, handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave, startImageAnimation]);

  const renderVirtualTourSlide = useCallback((item, index) => {
    if (!item || !item.url) return null;
    
    return (
      <iframe
        src={item.url}
        title={`Virtual Tour ${index + 1}`}
        className={Styles.iframe}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    );
  }, []);

  const renderVideoSlide = useCallback((item, index) => {
    if (!item || !item.absolute_path) return null;
  
    const playVideo = () => {
      if (videoRef.current) {
        videoRef.current.play().catch((error) => {
          console.log("Video playback failed:", error);
        });
      }
    };
  
    return (
      <div className={Styles.videoWrapper}>
        <video
          ref={videoRef}
          controls
          muted
          className={Styles.video}
          playsInline
          preload="metadata"
          onPlay={() => setIsVideoPlaying(true)}
          onPause={() => setIsVideoPlaying(false)}
          onEnded={() => setIsVideoPlaying(false)}
        >
          <source src={item.absolute_path} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
  
        {!isVideoPlaying && (
          <button
            type="button"
            className={Styles.bigPlayButton}
            onClick={playVideo}
            aria-label="Play video"
          >
            <PlayArrowIcon className={Styles.bigPlayIcon} />
          </button>
        )}
  
        {!isVideoPlaying && (
          <div className={Styles.videoHint}>
            ویدیو ملک
          </div>
        )}
      </div>
    );
  }, [isVideoPlaying]);
  

  const renderImageContent = useCallback(() => {
    if (!memoizedImages || memoizedImages.length === 0) return null;
    
    return (
      <div className={Styles.swiperContainer}>
        <div className={Styles.mainImageWrapper}>
          {memoizedImages.map((item, index) => {
            if (!item) return null;
            
            return (
              <div
                key={index}
                style={{
                  display: index === mainImageIndex ? 'block' : 'none',
                  width: '100%',
                  height: '100%',
                  position: index === mainImageIndex ? 'relative' : 'absolute',
                  top: 0,
                  left: 0
                }}
              >
                {renderImageSlide(item, index)}
              </div>
            );
          })}
        </div>
      </div>
    );
  }, [memoizedImages, mainImageIndex, renderImageSlide]);

  const renderStaticContent = useCallback((mediaList, type) => {
    if (!mediaList || mediaList.length === 0) return null;
    
    const firstItem = mediaList[0];
    if (!firstItem) return null;
    
    let content;
    
    if (type === "virtual_tours") {
      content = renderVirtualTourSlide(firstItem, 0);
    } else if (type === "videos") {
      content = renderVideoSlide(firstItem, 0);
    }
    
    return (
      <div className={Styles.swiperContainer}>
        <div className={Styles.mainImageWrapper}>
          {content}
        </div>
      </div>
    );
  }, [renderVirtualTourSlide, renderVideoSlide]);

  const paginationIndicators = useMemo(() => {
    if (memoizedImages.length <= 1 || !hasMounted) return null;
    
    return (
      <div className={Styles.paginationIndicators}>
        {memoizedImages.map((_, index) => (
          <button
            key={index}
            className={`${Styles.indicator} ${mainImageIndex === index ? Styles.active : ""}`}
            onClick={() => {
              stopImageAnimation();
              setMainImageIndex(index);
              setImagePosition({ x: 50, y: 50 });
              startImageAnimation(index);
            }}
            aria-label={`Go to image ${index + 1}`}
            type="button"
          />
        ))}
      </div>
    );
  }, [memoizedImages, mainImageIndex, hasMounted, startImageAnimation, stopImageAnimation]);

  // MAIN RENDER
  return (
    <div className={Styles.wrapper}>
      <div className={Styles.mediaContainer} ref={mediaContainerRef}>
        {/* Images Tab */}
        {activeTab === "images" && memoizedImages.length > 0 && (
          <div className={Styles.mainImageWrapper}>
            {renderImageContent()}
            {hasMounted && paginationIndicators}
            
            {/* Manual navigation arrows */}
            {hasMounted && memoizedImages.length > 1 && (
              <>
                <button
                  aria-label="Previous image"
                  onClick={() => {
                    stopImageAnimation();
                    setMainImageIndex(prev => 
                      prev === 0 ? memoizedImages.length - 1 : prev - 1
                    );
                    setImagePosition({ x: 50, y: 50 });
                    startImageAnimation(mainImageIndex === 0 ? memoizedImages.length - 1 : mainImageIndex - 1);
                  }}
                  className={Styles.navArrow}
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                  }}
                >
                  ‹
                </button>
                <button
                  aria-label="Next image"
                  onClick={() => {
                    stopImageAnimation();
                    setMainImageIndex(prev => 
                      (prev + 1) % memoizedImages.length
                    );
                    setImagePosition({ x: 50, y: 50 });
                    startImageAnimation((mainImageIndex + 1) % memoizedImages.length);
                  }}
                  className={Styles.navArrow}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                  }}
                >
                  ›
                </button>
              </>
            )}
          </div>
        )}
        
        {/* Virtual Tours Tab */}
        {activeTab === "virtual_tours" && memoizedTours.length > 0 && (
          <div className={Styles.mainImageWrapper}>
            {renderStaticContent(memoizedTours, "virtual_tours")}
          </div>
        )}
        
        {/* Videos Tab */}
        {activeTab === "videos" && memoizedVideos.length > 0 && (
          <div className={Styles.mainImageWrapper}>
            {renderStaticContent(memoizedVideos, "videos")}
          </div>
        )}
        
        {/* No Media Fallback */}
        {memoizedImages.length === 0 && 
         memoizedTours.length === 0 && 
         memoizedVideos.length === 0 && (
          <div className={Styles.swiperContainer}>
            <div className={Styles.mainImageWrapper}>
              <div className={Styles.noMedia}>
                <span>No media available</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Media Box Row */}
      <div className={Styles.mediaBoxRow}>
        {memoizedImages.length > 0 && memoizedImages[0] && (
          <div
            className={Styles.mediaBox}
            onClick={() => {
              setActiveTab("images");
              openLightbox(0);
            }}
          >
            <div className={Styles.thumbnailContainer}>
              <img
                src={getOptimizedImageUrl(memoizedImages[0]?.url, "thumbnail")}
                // alt="Preview"
                alt={`${details.name} در ${details.category_name} ${details.neighbourhood} ${details.city}`} 
                className={Styles.thumbnail}
                loading="eager"
                width="300"
                height="200"
              />
              <div className={Styles.mediaCounter}>{memoizedImages.length} عکس</div>
            </div>
          </div>
        )}

        {memoizedTours.length > 0 && memoizedTours[0] && (
          <div 
            className={Styles.mediaBox}
            onClick={() => setActiveTab("virtual_tours")}
          >
            <Link
              href={`/virtual-tour/${memoizedTours[0]?.worker_id || ''}/`}
              as={`/virtual-tour/${memoizedTours[0]?.worker_id || ''}/`}
              passHref
              legacyBehavior
            >
              <a style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div className={Styles.thumbnailContainer}>
                  <img 
                    src={getOptimizedImageUrl(memoizedTours[0]?.thumbnail_url, "thumbnail")} 
                    alt="بازدید مجازی آجر" 
                    className={Styles.thumbnail}
                    loading="lazy"
                    width="300"
                    height="200"
                  />
                  <div className={Styles.mediaCounter}>بازدید مجازی</div>
                </div>
              </a>
            </Link>
          </div>
        )}

        {memoizedVideos.length > 0 && (
          <div 
            className={Styles.mediaBox}
            onClick={handleVideoThumbClick}
          >
            <div className={Styles.thumbnailContainer}>
              <img 
                src={getOptimizedImageUrl(memoizedImages[0]?.url || memoizedTours[0]?.thumbnail_url, "thumbnail")} 
                alt="Preview" 
                className={Styles.thumbnail}
                loading="lazy"
                width="300"
                height="200"
              />
              <div className={Styles.mediaCounterVideo}>
                <PlayArrowIcon className={Styles.playIcon} />
              </div>
            </div>
          </div>
        )}

        {/* Empty slots for consistent layout */}
        {Array.from({ length: 3 - [
          memoizedImages.length > 0,
          memoizedTours.length > 0,
          memoizedVideos.length > 0
        ].filter(Boolean).length }).map((_, i) => (
          <div 
            key={`empty-${i}`} 
            className={Styles.mediaBox} 
            style={{ visibility: "hidden" }}
          />
        ))}
      </div>

      {/* Lightbox - Opens in grid view first (like thumbnails) */}
      {hasMounted && lightboxOpen && memoizedImages.length > 0 && memoizedImages[lightboxIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          className={`${Styles.lightboxOverlay} ${isFullscreen ? Styles.fullscreen : ''}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeLightbox();
            }
          }}
        >
          {isFullscreen ? (
            // Fullscreen single image view
            <>
              <button
                aria-label="Exit fullscreen"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullscreen(false);
                }}
                className={Styles.lightboxCloseBtn}
              >
                ×
              </button>

              <div
                className={`${Styles.lightboxImageContainer} ${isDragging ? Styles.dragging : ''}`}
                onTouchStart={handleLightboxTouchStart}
                onTouchMove={handleLightboxTouchMove}
                onTouchEnd={handleLightboxTouchEnd}
                onMouseDown={handleLightboxMouseDown}
                onMouseMove={handleLightboxMouseMove}
                onMouseUp={handleLightboxMouseUp}
                onMouseLeave={handleLightboxMouseUp}
              >
                <img
                  ref={dragImageRef}
                  src={getOptimizedImageUrl(memoizedImages[lightboxIndex]?.url, "large")}
                  // alt={`Fullscreen ${lightboxIndex + 1}`}
                  alt={` ${details.name} در ${details.category_name} ${details.neighbourhood} ${details.city} عکس شماره ${lightboxIndex + 1}  `} 
                  className={`${Styles.lightboxImage} ${isDragging ? Styles.dragging : ''}`}
                  style={{
                    objectPosition: `${imagePosition.x}% ${imagePosition.y}%`,
                  }}
                  loading="eager"
                  draggable="false"
                />
              </div>

              {memoizedImages.length > 1 && (
                <>
                  <button
                    aria-label="Previous"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(prev => (prev - 1 + memoizedImages.length) % memoizedImages.length);
                      setImagePosition({ x: 50, y: 50 });
                    }}
                    className={Styles.lightboxNavLeft}
                  >
                    ‹
                  </button>
                  <button
                    aria-label="Next"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(prev => (prev + 1) % memoizedImages.length);
                      setImagePosition({ x: 50, y: 50 });
                    }}
                    className={Styles.lightboxNavRight}
                  >
                    ›
                  </button>
                </>
              )}

              <div className={Styles.lightboxCounter}>
                {lightboxIndex + 1} / {memoizedImages.length}
              </div>
            </>
          ) : (
            // Grid view (like thumbnails)
            <>
              <button
                aria-label="Close"
                onClick={closeLightbox}
                className={Styles.lightboxCloseBtn}
              >
                ×
              </button>

              <div className={Styles.gridGallery} onClick={(e) => e.stopPropagation()}>
                {memoizedImages.map((img, idx) => {
                  if (!img || !img.url) return null;
                  
                  return (
                    <div
                      key={idx}
                      className={Styles.gridItem}
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxIndex(idx);
                        setIsFullscreen(true);
                        setImagePosition({ x: 50, y: 50 });
                      }}
                    >
                      <img 
                        src={getOptimizedImageUrl(img.url, "medium")} 
                        // alt={`details`} 
                        alt={` ${details.name} در ${details.category_name} ${details.neighbourhood} ${details.city} عکس شماره ${idx + 1}  `} 
                        className={Styles.gridImage}
                        loading="lazy"
                        width="400"
                        height="300"
                      />
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}