import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Styles from "../styles/WorkerMedia.module.css";
import dynamic from "next/dynamic";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Link from "next/link";

// Dynamically import Swiper
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

export default function WorkerMedia({ images = [], virtual_tours = [], videos = [] }) {
  const [activeTab, setActiveTab] = useState("images");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  const [isSwiperLoaded, setIsSwiperLoaded] = useState(false);
  
  const thumbnailSwiperRef = useRef(null);
  const mainImageSwiperRef = useRef(null);
  const cleanupRef = useRef([]);
  const mediaContainerRef = useRef(null);

  // Simple memoization
  const memoizedImages = useMemo(() => images || [], [images?.length || 0]);
  const memoizedVideos = useMemo(() => videos || [], [videos?.length || 0]);
  const memoizedTours = useMemo(() => virtual_tours || [], [virtual_tours?.length || 0]);

  // Initialize
  useEffect(() => {
    setHasMounted(true);
    
    // Preload swiper
    const loadSwiper = async () => {
      try {
        await import("swiper/react");
        setIsSwiperLoaded(true);
      } catch (error) {
        console.error("Failed to load Swiper:", error);
      }
    };
    
    loadSwiper();
    
    return () => {
      cleanupRef.current.forEach(cleanup => cleanup?.());
      cleanupRef.current = [];
      if (hasMounted) {
        document.body.style.overflow = "";
      }
    };
  }, []);

  // Image URL optimization
  const getOptimizedImageUrl = useCallback((url, size = "medium") => {
    if (!url) return url;
    
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
  }, []);

  // Lightbox functions
  const openLightbox = useCallback((index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    if (hasMounted) {
      document.body.style.overflow = "hidden";
    }
  }, [hasMounted]);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    if (hasMounted) {
      document.body.style.overflow = "";
    }
  }, [hasMounted]);

  const showPrev = useCallback(() => {
    if (memoizedImages.length > 0) {
      setLightboxIndex(prev => (prev - 1 + memoizedImages.length) % memoizedImages.length);
    }
  }, [memoizedImages.length]);

  const showNext = useCallback(() => {
    if (memoizedImages.length > 0) {
      setLightboxIndex(prev => (prev + 1) % memoizedImages.length);
    }
  }, [memoizedImages.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen || !hasMounted) return;
    
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        showPrev();
      } else if (e.key === "ArrowRight") {
        showNext();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, showPrev, showNext, hasMounted, closeLightbox]);

  // Render functions
  const renderImageSlide = useCallback((item, index, isStatic = false) => (
    <img
      src={getOptimizedImageUrl(item.url, "medium")}
      alt={`Image ${index + 1}`}
      className={Styles.mainImage}
      onClick={hasMounted ? () => openLightbox(index) : undefined}
      style={{ cursor: hasMounted ? "pointer" : "default" }}
      loading={index === 0 ? "eager" : "lazy"}
      width="800"
      height="600"
    />
  ), [getOptimizedImageUrl, hasMounted, openLightbox]);

  const renderVirtualTourSlide = useCallback((item, index) => (
    <iframe
      src={item.url}
      title={`Virtual Tour ${index + 1}`}
      className={Styles.iframe}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  ), []);

  const renderVideoSlide = useCallback((item, index) => (
    <video 
      controls 
      className={Styles.video}
      playsInline
      preload="metadata"
    >
      <source src={item.absolute_path} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  ), []);

  // CRITICAL FIX: Simple, consistent render function
  const renderMediaContent = useCallback((mediaList, type) => {
    if (!mediaList || mediaList.length === 0) return null;

    // Always render the first item as static content for hydration
    const firstItem = mediaList[0];
    
    let content;
    if (type === "images") {
      content = renderImageSlide(firstItem, 0, true);
    } else if (type === "virtual_tours") {
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
  }, [renderImageSlide, renderVirtualTourSlide, renderVideoSlide]);

  // Pagination indicators
  const paginationIndicators = useMemo(() => {
    if (memoizedImages.length <= 1 || !hasMounted) return null;
    
    return (
      <div className={Styles.paginationIndicators}>
        {memoizedImages.map((_, index) => (
          <div
            key={index}
            className={`${Styles.indicator} ${mainImageIndex === index ? Styles.active : ""}`}
            onClick={() => {
              if (hasMounted && mainImageSwiperRef.current?.slideTo) {
                mainImageSwiperRef.current.slideTo(index);
              }
            }}
          />
        ))}
      </div>
    );
  }, [memoizedImages, mainImageIndex, hasMounted]);

  // MAIN RENDER - Always consistent structure
  return (
    <div className={Styles.wrapper}>
      <div className={Styles.mediaContainer} ref={mediaContainerRef}>
        {/* Images Tab */}
        {activeTab === "images" && memoizedImages.length > 0 && (
          <div className={Styles.mainImageWrapper}>
            {renderMediaContent(memoizedImages, "images")}
            {hasMounted && paginationIndicators}
          </div>
        )}
        
        {/* Virtual Tours Tab */}
        {activeTab === "virtual_tours" && memoizedTours.length > 0 && (
          <div className={Styles.mainImageWrapper}>
            {renderMediaContent(memoizedTours, "virtual_tours")}
          </div>
        )}
        
        {/* Videos Tab */}
        {activeTab === "videos" && memoizedVideos.length > 0 && (
          <div className={Styles.mainImageWrapper}>
            {renderMediaContent(memoizedVideos, "videos")}
          </div>
        )}
        
        {/* No Media Fallback */}
        {memoizedImages.length === 0 && 
         memoizedTours.length === 0 && 
         memoizedVideos.length === 0 && (
          <div className={Styles.swiperContainer}>
            <div className={Styles.mainImageWrapper}>
              <div style={{
                width: '100%',
                height: '400px',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px'
              }}>
                <span>No media available</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Media Box Row - Always visible */}
      <div className={Styles.mediaBoxRow}>
        {memoizedImages.length > 0 && (
          <div
            className={Styles.mediaBox}
            onClick={hasMounted ? () => {
              setActiveTab("images");
              if (memoizedImages.length > 0) {
                openLightbox(0);
              }
            } : undefined}
            style={{ cursor: hasMounted ? "pointer" : "default" }}
          >
            <div className={Styles.thumbnailContainer}>
              <img
                src={getOptimizedImageUrl(memoizedImages[0]?.url, "thumbnail")}
                alt="Preview"
                className={Styles.thumbnail}
                loading="eager"
                width="300"
                height="200"
              />
              <div className={Styles.mediaCounter}>{memoizedImages.length} عکس</div>
            </div>
          </div>
        )}

        {memoizedTours.length > 0 && (
          <div 
            className={Styles.mediaBox}
            onClick={hasMounted ? () => setActiveTab("virtual_tours") : undefined}
            style={{ cursor: hasMounted ? "pointer" : "default" }}
          >
            <Link
              href={`/virtual-tour/${memoizedTours[0].worker_id}/`}
              as={`/virtual-tour/${memoizedTours[0].worker_id}/`}
              passHref
              legacyBehavior
            >
              <a style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div className={Styles.thumbnailContainer}>
                  <img 
                    src={getOptimizedImageUrl(memoizedTours[0]?.thumbnail_url, "thumbnail")} 
                    alt="Preview" 
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
            onClick={hasMounted ? () => setActiveTab("videos") : undefined}
            style={{ cursor: hasMounted ? "pointer" : "default" }}
          >
            <div className={Styles.thumbnailContainer}>
              <img 
                src={getOptimizedImageUrl(memoizedImages[0]?.url, "thumbnail")} 
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
          memoizedImages.length > 0 ? 1 : 0,
          memoizedTours.length > 0 ? 1 : 0,
          memoizedVideos.length > 0 ? 1 : 0
        ].filter(Boolean).length }).map((_, i) => (
          <div 
            key={`empty-${i}`} 
            className={Styles.mediaBox} 
            style={{ visibility: "hidden" }}
          />
        ))}
      </div>

      {/* Lightbox - Only render on client */}
      {hasMounted && lightboxOpen && memoizedImages.length > 0 && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            zIndex: 4000,
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            background: isFullscreen ? "#000" : "#f5f5f5",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: isFullscreen ? "center" : "flex-start",
            padding: isFullscreen ? 0 : "20px",
            overflow: isFullscreen ? "hidden" : "auto",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeLightbox();
            }
          }}
        >
          {/* Your existing lightbox UI - unchanged */}
          {isFullscreen ? (
            <>
              <button
                aria-label="Exit fullscreen"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullscreen(false);
                }}
                style={{
                  position: "fixed",
                  top: 20,
                  right: 20,
                  zIndex: 4002,
                  background: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: 44,
                  height: 44,
                  cursor: "pointer",
                  fontSize: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
                }}
              >
                ×
              </button>

              <img
                src={getOptimizedImageUrl(memoizedImages[lightboxIndex]?.url, "large")}
                alt={`Fullscreen ${lightboxIndex}`}
                style={{
                  maxWidth: "95vw",
                  maxHeight: "95vh",
                  objectFit: "contain",
                }}
                loading="eager"
              />

              {memoizedImages.length > 1 && (
                <>
                  <button
                    aria-label="Previous"
                    onClick={(e) => {
                      e.stopPropagation();
                      showPrev();
                    }}
                    style={{
                      position: "fixed",
                      left: 20,
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 4002,
                      background: "rgba(255,255,255,0.9)",
                      border: "none",
                      borderRadius: 4,
                      width: 50,
                      height: 50,
                      cursor: "pointer",
                      fontSize: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ‹
                  </button>
                  <button
                    aria-label="Next"
                    onClick={(e) => {
                      e.stopPropagation();
                      showNext();
                    }}
                    style={{
                      position: "fixed",
                      right: 20,
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 4002,
                      background: "rgba(255,255,255,0.9)",
                      border: "none",
                      borderRadius: 4,
                      width: 50,
                      height: 50,
                      cursor: "pointer",
                      fontSize: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ›
                  </button>
                </>
              )}

              <div
                style={{
                  position: "fixed",
                  bottom: 20,
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 4002,
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: 4,
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {lightboxIndex + 1} / {memoizedImages.length}
              </div>
            </>
          ) : (
            <>
              <button
                aria-label="Close"
                onClick={closeLightbox}
                style={{
                  position: "fixed",
                  top: 20,
                  right: 20,
                  zIndex: 4001,
                  background: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: 44,
                  height: 44,
                  cursor: "pointer",
                  fontSize: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
                }}
              >
                ×
              </button>

              <div className={Styles.gridGallery} onClick={(e) => e.stopPropagation()}>
                {memoizedImages.map((img, idx) => (
                  <div
                    key={idx}
                    className={Styles.gridItem}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(idx);
                      setIsFullscreen(true);
                    }}
                  >
                    <img 
                      src={getOptimizedImageUrl(img.url, "medium")} 
                      alt={`Image ${idx}`} 
                      className={Styles.gridImage}
                      loading="lazy"
                      width="400"
                      height="300"
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}