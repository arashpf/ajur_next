import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import "video.js/dist/video-js.css";
import Styles from "../styles/WorkerMedia.module.css";
import dynamic from "next/dynamic";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Link from "next/link";
import { useRouter } from "next/router";

// Dynamically import Swiper (kept for compatibility but not used)
const Swiper = dynamic(
  () => import("swiper/react").then((mod) => mod.Swiper),
  { ssr: false, loading: () => null }
);

const SwiperSlide = dynamic(
  () => import("swiper/react").then((mod) => mod.SwiperSlide),
  { ssr: false, loading: () => null }
);

// Zoom constraints
const MIN_SCALE = 1;
const MAX_SCALE = 4;
const DOUBLE_TAP_SCALE = 2;

// Window (ms) during which clicks on the grid are treated as synthetic
// clicks from the tap that opened the grid, and ignored.
const SYNTHETIC_CLICK_WINDOW = 450;

// Distance between two touches
const touchDistance = (t1, t2) =>
  Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

// Midpoint between two touches
const touchMidpoint = (t1, t2) => ({
  x: (t1.clientX + t2.clientX) / 2,
  y: (t1.clientY + t2.clientY) / 2,
});

export default function WorkerMedia({
  details = {},
  images = [],
  virtual_tours = [],
  videos = [],
}) {
  const router = useRouter();

  // -------- Memoized, safe arrays --------
  const memoizedImages = useMemo(
    () => (Array.isArray(images) ? images.filter(Boolean) : []),
    [images]
  );
  const memoizedVideos = useMemo(
    () => (Array.isArray(videos) ? videos.filter(Boolean) : []),
    [videos]
  );
  const memoizedTours = useMemo(
    () => (Array.isArray(virtual_tours) ? virtual_tours.filter(Boolean) : []),
    [virtual_tours]
  );

  // -------- Media presence flags --------
  const hasImages = memoizedImages.length > 0;
  const hasVideos = memoizedVideos.length > 0;
  const hasTours = memoizedTours.length > 0;
  const hasAnyMedia = hasImages || hasVideos || hasTours;

  const mediaTypeCount = [hasImages, hasVideos, hasTours].filter(Boolean).length;
  const showThumbRow = mediaTypeCount > 1;

  // -------- Default tab: video > images > virtual_tours --------
  const [activeTab, setActiveTab] = useState(() => {
    if (hasVideos) return "videos";
    if (hasImages) return "images";
    if (hasTours) return "virtual_tours";
    return "images";
  });

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Movement (main carousel)
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragThreshold, setDragThreshold] = useState(0);

  // -------- Fullscreen zoom state --------
  const [zoomScale, setZoomScale] = useState(1);
  const [zoomTranslate, setZoomTranslate] = useState({ x: 0, y: 0 });
  const [isPinching, setIsPinching] = useState(false);

  // Animation
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageOrientations, setImageOrientations] = useState({});
  const animationRef = useRef(null);
  const animationStartTimeRef = useRef(null);

  const mediaContainerRef = useRef(null);
  const cleanupRef = useRef([]);
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const dragImageRef = useRef(null);
  const isClickRef = useRef(true);
  const imageRefs = useRef({});
  const isSwipingRef = useRef(false);

  // -------- Zoom gesture refs --------
  const pinchStartRef = useRef({
    distance: 0,
    scale: 1,
    midpoint: { x: 0, y: 0 },
    translate: { x: 0, y: 0 },
  });
  const lastTapRef = useRef({ time: 0, x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0, translate: { x: 0, y: 0 } });
  const gestureActiveRef = useRef(false);
  const justDoubleTappedRef = useRef(false);

  // -------- Guards for mobile synthetic clicks --------
  // Blocks a second openLightbox call triggered by a synthetic mouse event
  // that follows a real touchend.
  const openingLightboxRef = useRef(false);
  // Records when the grid was rendered. Grid item clicks arriving too soon
  // after this timestamp are the synthetic click from the tap that opened the
  // grid — we ignore them.
  const gridOpenedAtRef = useRef(0);

  // -------- Video.js refs --------
  const videoJsContainerRef = useRef(null);
  const videoJsPlayerRef = useRef(null);
  const videoJsVideoElRef = useRef(null);

  // -------- Mount --------
  useEffect(() => {
    setHasMounted(true);

    return () => {
      cleanupRef.current.forEach((cleanup) => cleanup?.());
      cleanupRef.current = [];
      if (hasMounted) {
        document.body.style.overflow = "";
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // -------- Reset zoom when image changes or lightbox closes --------
  useEffect(() => {
    setZoomScale(1);
    setZoomTranslate({ x: 0, y: 0 });
    setIsPinching(false);
  }, [lightboxIndex, isFullscreen, lightboxOpen]);

  // -------- Video.js initialization --------
  useEffect(() => {
    if (activeTab !== "videos") return;
    if (!hasVideos) return;
    if (!videoJsContainerRef.current) return;
    if (videoJsPlayerRef.current) return;

    let disposed = false;

    const initPlayer = async () => {
      const videojsModule = await import("video.js");
      const videojs = videojsModule.default;

      if (disposed) return;
      if (!videoJsContainerRef.current) return;

      const videoEl = document.createElement("video-js");
      videoEl.classList.add("vjs-big-play-centered");
      videoEl.classList.add("ajur-videojs");
      videoEl.setAttribute("playsinline", "");
      videoEl.setAttribute("muted", "");
      videoJsVideoElRef.current = videoEl;

      videoJsContainerRef.current.appendChild(videoEl);

      const videoSrc = memoizedVideos[0]?.absolute_path;
      if (!videoSrc) return;

      const posterUrl = details?.thumb || memoizedImages[0]?.url || "";

      const player = videojs(videoEl, {
        controls: true,
        autoplay: false,
        muted: true,
        loop: false,
        preload: "none",
        fluid: false,
        responsive: true,
        playsinline: true,
        fill: true,
        poster: posterUrl,
        html5: {
          vhs: { overrideNative: false },
        },
        sources: [
          {
            src: videoSrc,
            type: "video/mp4",
          },
        ],
      });

      videoJsPlayerRef.current = player;

      player.ready(() => {
        const techEl = player.el().querySelector("video");
        if (techEl) {
          techEl.style.objectFit = "contain";
          techEl.style.width = "100%";
          techEl.style.height = "100%";
          techEl.style.backgroundColor = "#000";
        }

        player.on("play", () => setIsVideoPlaying(true));
        player.on("pause", () => setIsVideoPlaying(false));
        player.on("ended", () => setIsVideoPlaying(false));
      });
    };

    initPlayer();

    return () => {
      disposed = true;
      if (videoJsPlayerRef.current) {
        try {
          videoJsPlayerRef.current.dispose();
        } catch (e) {}
        videoJsPlayerRef.current = null;
      }
      if (videoJsVideoElRef.current && videoJsVideoElRef.current.parentNode) {
        videoJsVideoElRef.current.parentNode.removeChild(videoJsVideoElRef.current);
      }
      videoJsVideoElRef.current = null;
      setIsVideoPlaying(false);
    };
  }, [activeTab, hasVideos, memoizedVideos, memoizedImages, details]);

  // -------- Scroll to media container when switching to videos --------
  useEffect(() => {
    if (activeTab === "videos" && mediaContainerRef.current) {
      const yOffset = -20;
      const y =
        mediaContainerRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [activeTab]);

  // -------- Detect image orientation --------
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
              height: img.height || 0,
            };
            resolve();
          };
          img.onerror = () => {
            orientations[i] = { isLandscape: true, width: 0, height: 0 };
            resolve();
          };
        });
      }

      setImageOrientations(orientations);
    };

    checkImageOrientations();
  }, [memoizedImages]);

  // -------- Android back button (lightbox) --------
  useEffect(() => {
    if (!lightboxOpen || !hasMounted) return;

    const handlePopState = (e) => {
      e.preventDefault();
      closeLightbox();
      window.history.pushState(null, "", window.location.pathname);
    };

    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [lightboxOpen, hasMounted]);

  // -------- Image URL optimizer --------
  const getOptimizedImageUrl = useCallback((url, size = "medium") => {
    if (!url || typeof url !== "string") return "";

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
      return url.includes("?")
        ? `${url}&${params.toString()}`
        : `${url}?${params.toString()}`;
    } catch (error) {
      console.error("Error optimizing image URL:", error);
      return url;
    }
  }, []);

  // -------- Main carousel image animation --------
  const startImageAnimation = useCallback(
    (index) => {
      if (isDragging || isSwipingRef.current || !imageOrientations || !imageRefs.current)
        return;

      const orientation = imageOrientations[index];
      const imgElement = imageRefs.current[index];
      if (!orientation || !imgElement) return;

      if (animationRef.current) cancelAnimationFrame(animationRef.current);

      setIsAnimating(true);
      const startTime = performance.now();

      imgElement.style.transition = "none";
      imgElement.style.willChange = "transform, object-position";

      const animate = (currentTime) => {
        if (!imgElement || isDragging || isSwipingRef.current) {
          cancelAnimationFrame(animationRef.current);
          return;
        }

        const elapsed = (currentTime - startTime) / 1000;

        if (orientation.isLandscape) {
          const cycleDuration = 15;
          const t = (elapsed % cycleDuration) / cycleDuration;
          const smoothProgress = (Math.cos(t * Math.PI * 2) + 1) / 2;
          const scale = 1.12 - smoothProgress * 0.08;
          const posX = 60 - smoothProgress * 20;
          imgElement.style.transform = `scale(${scale})`;
          imgElement.style.objectPosition = `${posX}% 50%`;
        } else {
          const cycleDuration = 28;
          const t = (elapsed % cycleDuration) / cycleDuration;
          const smoothProgress = (Math.sin(t * Math.PI * 2) + 1) / 2;
          const posY = 20 + smoothProgress * 60;
          imgElement.style.transform = "scale(1)";
          imgElement.style.objectPosition = `50% ${posY}%`;
        }

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    },
    [isDragging, imageOrientations]
  );

  const stopImageAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsAnimating(false);

    if (dragImageRef.current) {
      dragImageRef.current.style.transition = "none";
      dragImageRef.current.style.transform = "scale(1)";
      dragImageRef.current.style.objectPosition = "50% 50%";
      dragImageRef.current.style.willChange = "auto";
    }

    if (imageRefs.current) {
      Object.values(imageRefs.current).forEach((img) => {
        if (img && typeof img.style !== "undefined") {
          img.style.transition = "none";
          img.style.transform = "scale(1)";
          img.style.objectPosition = "50% 50%";
          img.style.willChange = "auto";
        }
      });
    }

    setImagePosition({ x: 50, y: 50 });
  }, []);

  // -------- Lightbox --------
  // ALWAYS opens in grid view (isFullscreen = false).
  // Guard against double-firing (touch + synthetic mouse events on some browsers).
  const openLightbox = useCallback(
    (index) => {
      if (openingLightboxRef.current) return;
      if (lightboxOpen) return;

      openingLightboxRef.current = true;

      // Record the moment we open. Grid clicks inside the window below are
      // treated as the synthetic click from the original tap and ignored.
      gridOpenedAtRef.current = Date.now();

      stopImageAnimation();
      const safeIndex = Math.min(Math.max(0, index), memoizedImages.length - 1);

      // Batch: reset fullscreen FIRST so a stale `true` can't win
      setIsFullscreen(false);
      setLightboxIndex(safeIndex);
      setLightboxOpen(true);

      if (hasMounted) document.body.style.overflow = "hidden";

      // Release the guard after the synthetic-click window closes
      setTimeout(() => {
        openingLightboxRef.current = false;
      }, SYNTHETIC_CLICK_WINDOW + 50);
    },
    [hasMounted, stopImageAnimation, memoizedImages.length, lightboxOpen]
  );

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setIsFullscreen(false);
    if (hasMounted) document.body.style.overflow = "";
  }, [hasMounted]);

  const showPrev = useCallback(() => {
    stopImageAnimation();
    if (memoizedImages.length > 0) {
      setMainImageIndex(
        (prev) => (prev - 1 + memoizedImages.length) % memoizedImages.length
      );
      setImagePosition({ x: 50, y: 50 });
    }
  }, [memoizedImages.length, stopImageAnimation]);

  const showNext = useCallback(() => {
    stopImageAnimation();
    if (memoizedImages.length > 0) {
      setMainImageIndex((prev) => (prev + 1) % memoizedImages.length);
      setImagePosition({ x: 50, y: 50 });
    }
  }, [memoizedImages.length, stopImageAnimation]);

  const handleVideoThumbClick = useCallback(() => {
    setActiveTab("videos");

    if (mediaContainerRef.current) {
      const yOffset = -20;
      const y =
        mediaContainerRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  // -------- Keyboard navigation --------
  useEffect(() => {
    if (!lightboxOpen || !hasMounted || !memoizedImages.length) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft" && isFullscreen) {
        setLightboxIndex(
          (prev) => (prev - 1 + memoizedImages.length) % memoizedImages.length
        );
      } else if (e.key === "ArrowRight" && isFullscreen) {
        setLightboxIndex((prev) => (prev + 1) % memoizedImages.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, hasMounted, closeLightbox, memoizedImages.length, isFullscreen]);

  // -------- Main carousel touch handlers --------
  const handleTouchStart = useCallback(
    (e) => {
      stopImageAnimation();
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch?.clientX || 0,
        y: touch?.clientY || 0,
        time: Date.now(),
      };
      isClickRef.current = true;
      isSwipingRef.current = false;
      setDragThreshold(0);
    },
    [stopImageAnimation]
  );

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

  const handleTouchEnd = useCallback(
    (e) => {
      if (!dragImageRef.current) return;

      const touchEndTime = Date.now();
      const touchDuration = touchEndTime - touchStartRef.current.time;
      const touch = e.changedTouches[0];

      if (touch) {
        const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
        const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

        if (isClickRef.current && touchDuration < 300 && deltaX < 10 && deltaY < 10) {
          // Suppress the synthetic click that would otherwise land on the
          // grid that is about to render underneath this tap point.
          if (e.cancelable) {
            e.preventDefault();
          }
          openLightbox(mainImageIndex);
          return;
        }

        if (touchDuration < 300 && deltaX > deltaY && deltaX > 30) {
          if (touch.clientX > touchStartRef.current.x) showPrev();
          else showNext();
        }
      }

      setIsDragging(false);
      isClickRef.current = true;
      isSwipingRef.current = false;
    },
    [mainImageIndex, openLightbox, showPrev, showNext]
  );

  const handleMouseDown = useCallback(
    (e) => {
      stopImageAnimation();
      e.preventDefault();
      touchStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
      isClickRef.current = true;
      isSwipingRef.current = false;
      setDragThreshold(0);
    },
    [stopImageAnimation]
  );

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

  const handleMouseUp = useCallback(
    (e) => {
      if (isClickRef.current && dragThreshold < 10) openLightbox(mainImageIndex);
      setIsDragging(false);
      isClickRef.current = true;
      isSwipingRef.current = false;
    },
    [dragThreshold, mainImageIndex, openLightbox]
  );

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    isClickRef.current = true;
    isSwipingRef.current = false;
  }, []);

  // -------- Start animation when idle --------
  useEffect(() => {
    if (
      memoizedImages.length > 0 &&
      !isDragging &&
      !isSwipingRef.current &&
      !lightboxOpen
    ) {
      startImageAnimation(mainImageIndex);
    }
  }, [mainImageIndex, memoizedImages, isDragging, lightboxOpen, startImageAnimation]);

  useEffect(() => {
    stopImageAnimation();
    setImagePosition({ x: 50, y: 50 });

    if (dragImageRef.current) {
      dragImageRef.current.style.transition = "none";
      dragImageRef.current.style.transform = "scale(1)";
      dragImageRef.current.style.objectPosition = "50% 50%";
    }

    if (!isDragging && !isSwipingRef.current && !lightboxOpen) {
      startImageAnimation(mainImageIndex);
    }

    return () => stopImageAnimation();
  }, [mainImageIndex, isDragging, lightboxOpen, startImageAnimation, stopImageAnimation]);

  // ================================================================
  // FULLSCREEN LIGHTBOX GESTURES — pinch zoom, pan, double-tap
  // ================================================================

  const clampTranslate = useCallback((translate, scale) => {
    if (scale <= 1) return { x: 0, y: 0 };
    const maxX = (scale - 1) * (window.innerWidth / 2);
    const maxY = (scale - 1) * (window.innerHeight / 2);
    return {
      x: Math.max(-maxX, Math.min(maxX, translate.x)),
      y: Math.max(-maxY, Math.min(maxY, translate.y)),
    };
  }, []);

  const handleLightboxTouchStart = useCallback(
    (e) => {
      const touches = e.touches;

      if (touches.length === 2) {
        setIsPinching(true);
        gestureActiveRef.current = true;
        isClickRef.current = false;

        const dist = touchDistance(touches[0], touches[1]);
        const mid = touchMidpoint(touches[0], touches[1]);

        pinchStartRef.current = {
          distance: dist,
          scale: zoomScale,
          midpoint: mid,
          translate: { ...zoomTranslate },
        };
        return;
      }

      if (touches.length === 1) {
        const touch = touches[0];
        touchStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now(),
        };
        panStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          translate: { ...zoomTranslate },
        };
        isClickRef.current = true;
        gestureActiveRef.current = false;
      }
    },
    [zoomScale, zoomTranslate]
  );

  const handleLightboxTouchMove = useCallback(
    (e) => {
      const touches = e.touches;

      if (touches.length === 2 && pinchStartRef.current.distance > 0) {
        e.preventDefault();
        const dist = touchDistance(touches[0], touches[1]);
        const mid = touchMidpoint(touches[0], touches[1]);

        const ratio = dist / pinchStartRef.current.distance;
        let newScale = pinchStartRef.current.scale * ratio;
        newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

        const midDelta = {
          x: mid.x - pinchStartRef.current.midpoint.x,
          y: mid.y - pinchStartRef.current.midpoint.y,
        };

        const newTranslate = {
          x: pinchStartRef.current.translate.x + midDelta.x,
          y: pinchStartRef.current.translate.y + midDelta.y,
        };

        setZoomScale(newScale);
        setZoomTranslate(clampTranslate(newTranslate, newScale));
        return;
      }

      if (touches.length === 1 && !isPinching) {
        const touch = touches[0];
        const dx = touch.clientX - panStartRef.current.x;
        const dy = touch.clientY - panStartRef.current.y;

        if (zoomScale > 1) {
          e.preventDefault();
          gestureActiveRef.current = true;
          const newTranslate = {
            x: panStartRef.current.translate.x + dx,
            y: panStartRef.current.translate.y + dy,
          };
          setZoomTranslate(clampTranslate(newTranslate, zoomScale));
        } else {
          const deltaX = Math.abs(dx);
          const deltaY = Math.abs(dy);
          if (deltaX > 10 || deltaY > 10) {
            isClickRef.current = false;
          }
          setDragThreshold(Math.max(deltaX, deltaY));
        }
      }
    },
    [isPinching, zoomScale, clampTranslate]
  );

  const handleLightboxTouchEnd = useCallback(
    (e) => {
      const touches = e.touches;

      if (isPinching && touches.length < 2) {
        setIsPinching(false);

        if (zoomScale < 1) {
          setZoomScale(1);
          setZoomTranslate({ x: 0, y: 0 });
        } else if (zoomScale <= 1.05) {
          setZoomScale(1);
          setZoomTranslate({ x: 0, y: 0 });
        }
        return;
      }

      if (touches.length === 0 && zoomScale > 1 && gestureActiveRef.current) {
        setZoomTranslate((prev) => clampTranslate(prev, zoomScale));
        return;
      }

      const touch = e.changedTouches[0];
      if (touch) {
        const now = Date.now();
        const duration = now - touchStartRef.current.time;
        const dx = Math.abs(touch.clientX - touchStartRef.current.x);
        const dy = Math.abs(touch.clientY - touchStartRef.current.y);

        const last = lastTapRef.current;
        const isDoubleTap =
          now - last.time < 300 &&
          Math.abs(touch.clientX - last.x) < 30 &&
          Math.abs(touch.clientY - last.y) < 30;

        if (isDoubleTap) {
          justDoubleTappedRef.current = true;
          if (zoomScale > 1) {
            setZoomScale(1);
            setZoomTranslate({ x: 0, y: 0 });
          } else {
            const targetScale = DOUBLE_TAP_SCALE;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const tapOffsetX = touch.clientX - centerX;
            const tapOffsetY = touch.clientY - centerY;

            const newTranslate = {
              x: -tapOffsetX * (targetScale - 1),
              y: -tapOffsetY * (targetScale - 1),
            };

            setZoomScale(targetScale);
            setZoomTranslate(clampTranslate(newTranslate, targetScale));
          }
          lastTapRef.current = { time: 0, x: 0, y: 0 };
          return;
        }

        lastTapRef.current = { time: now, x: touch.clientX, y: touch.clientY };

        if (zoomScale > 1) {
          isClickRef.current = false;
          return;
        }

        if (
          duration < 400 &&
          dx > dy &&
          dx > 40 &&
          !gestureActiveRef.current
        ) {
          if (touch.clientX > touchStartRef.current.x) {
            setLightboxIndex(
              (prev) => (prev - 1 + memoizedImages.length) % memoizedImages.length
            );
          } else {
            setLightboxIndex((prev) => (prev + 1) % memoizedImages.length);
          }
        }
      }

      isClickRef.current = true;
      gestureActiveRef.current = false;
    },
    [isPinching, zoomScale, clampTranslate, memoizedImages.length]
  );

  const handleLightboxMouseDown = useCallback(
    (e) => {
      if (zoomScale > 1) {
        panStartRef.current = {
          x: e.clientX,
          y: e.clientY,
          translate: { ...zoomTranslate },
        };
        isClickRef.current = true;
        gestureActiveRef.current = false;
      } else {
        touchStartRef.current = {
          x: e.clientX,
          y: e.clientY,
          time: Date.now(),
        };
        isClickRef.current = true;
      }
    },
    [zoomScale, zoomTranslate]
  );

  const handleLightboxMouseMove = useCallback(
    (e) => {
      if (zoomScale > 1 && e.buttons === 1) {
        gestureActiveRef.current = true;
        const dx = e.clientX - panStartRef.current.x;
        const dy = e.clientY - panStartRef.current.y;
        const newTranslate = {
          x: panStartRef.current.translate.x + dx,
          y: panStartRef.current.translate.y + dy,
        };
        setZoomTranslate(clampTranslate(newTranslate, zoomScale));
      }
    },
    [zoomScale, clampTranslate]
  );

  const handleLightboxMouseUp = useCallback(() => {
    isClickRef.current = true;
    gestureActiveRef.current = false;
  }, []);

  // -------- Render image slide --------
  const renderImageSlide = useCallback(
    (item, index) => {
      if (!item || !item.url) return null;

      return (
        <div
          className={`${Styles.imageContainer} ${isDragging ? Styles.dragging : ""}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <img
            ref={(el) => {
              if (el && index === mainImageIndex) {
                dragImageRef.current = el;
                imageRefs.current[index] = el;
              }
            }}
            src={getOptimizedImageUrl(item.url, "medium")}
            alt={`${details.name} در ${details.category_name} ${details.neighbourhood} ${details.city} عکس شماره ${index + 1}`}
            className={`${Styles.mainImage} ${isDragging ? Styles.dragging : ""} ${isAnimating ? Styles.animating : ""}`}
            style={{
              objectPosition: `${imagePosition.x}% ${imagePosition.y}%`,
              transform: "scale(1)",
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
    },
    [
      getOptimizedImageUrl,
      imagePosition,
      isDragging,
      isAnimating,
      mainImageIndex,
      lightboxOpen,
      details,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      handleMouseLeave,
      startImageAnimation,
    ]
  );

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

  const renderVideoSlide = useCallback(() => {
    if (!hasVideos) return null;

    return (
      <div className={Styles.videoWrapper}>
        <div
          ref={videoJsContainerRef}
          className={Styles.videoJsContainer}
          data-vjs-player
        />
        {!isVideoPlaying && (
          <div className={Styles.videoHint}>ویدیو ملک</div>
        )}
      </div>
    );
  }, [hasVideos, isVideoPlaying]);

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
                  display: index === mainImageIndex ? "block" : "none",
                  width: "100%",
                  height: "100%",
                  position: index === mainImageIndex ? "relative" : "absolute",
                  top: 0,
                  left: 0,
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

  const renderStaticContent = useCallback(
    (mediaList, type) => {
      if (!mediaList || mediaList.length === 0) return null;
      const firstItem = mediaList[0];
      if (!firstItem) return null;

      let content;
      if (type === "virtual_tours") {
        content = renderVirtualTourSlide(firstItem, 0);
      } else if (type === "videos") {
        content = renderVideoSlide();
      }

      return (
        <div className={Styles.swiperContainer}>
          <div className={Styles.mainImageWrapper}>{content}</div>
        </div>
      );
    },
    [renderVirtualTourSlide, renderVideoSlide]
  );

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

  if (!hasAnyMedia) {
    return null;
  }

  const fullscreenTransform = `translate(${zoomTranslate.x}px, ${zoomTranslate.y}px) scale(${zoomScale})`;
  const fullscreenTransition = isPinching
    ? "none"
    : "transform 0.2s ease-out";

  // -------- MAIN RENDER --------
  return (
    <div className={Styles.wrapper}>
      <div className={Styles.mediaContainer} ref={mediaContainerRef}>
        {/* Images Tab */}
        {activeTab === "images" && hasImages && (
          <div className={Styles.mainImageWrapper}>
            {renderImageContent()}
            {hasMounted && paginationIndicators}

            {hasMounted && memoizedImages.length > 1 && (
              <>
                <button
                  aria-label="Previous image"
                  onClick={() => {
                    stopImageAnimation();
                    setMainImageIndex((prev) =>
                      prev === 0 ? memoizedImages.length - 1 : prev - 1
                    );
                    setImagePosition({ x: 50, y: 50 });
                    startImageAnimation(
                      mainImageIndex === 0 ? memoizedImages.length - 1 : mainImageIndex - 1
                    );
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
                    setMainImageIndex((prev) => (prev + 1) % memoizedImages.length);
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
        {activeTab === "virtual_tours" && hasTours && (
          <div className={Styles.mainImageWrapper}>
            {renderStaticContent(memoizedTours, "virtual_tours")}
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === "videos" && hasVideos && (
          <div className={Styles.mainImageWrapper}>
            {renderStaticContent(memoizedVideos, "videos")}
          </div>
        )}
      </div>

      {/* Media Box Row */}
      {showThumbRow && (
        <div className={Styles.mediaBoxRow}>
          {hasImages && memoizedImages[0] && (
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

          {hasTours && memoizedTours[0] && (
            <div className={Styles.mediaBox}>
              <Link
                href={`/virtual-tour/${memoizedTours[0]?.worker_id || ""}/`}
                as={`/virtual-tour/${memoizedTours[0]?.worker_id || ""}/`}
                passHref
                legacyBehavior
              >
                <a style={{ textDecoration: "none", color: "inherit", display: "block" }}>
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

          {hasVideos && (
            <div className={Styles.mediaBox} onClick={handleVideoThumbClick}>
              <div className={Styles.thumbnailContainer}>
                <img
                  src={getOptimizedImageUrl(
                    memoizedImages[0]?.url || memoizedTours[0]?.thumbnail_url,
                    "thumbnail"
                  )}
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
        </div>
      )}

      {/* Lightbox */}
      {hasMounted && lightboxOpen && memoizedImages.length > 0 && memoizedImages[lightboxIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          className={`${Styles.lightboxOverlay} ${isFullscreen ? Styles.fullscreen : ""}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          {isFullscreen ? (
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

              <div className={Styles.zoomHint}>
                برای بزرگنمایی دو انگشت خود را باز کنید
              </div>

              <div
                className={`${Styles.lightboxImageContainer} ${
                  zoomScale > 1 ? Styles.zoomed : ""
                } ${isPinching ? Styles.pinching : ""}`}
                onTouchStart={handleLightboxTouchStart}
                onTouchMove={handleLightboxTouchMove}
                onTouchEnd={handleLightboxTouchEnd}
                onMouseDown={handleLightboxMouseDown}
                onMouseMove={handleLightboxMouseMove}
                onMouseUp={handleLightboxMouseUp}
                onMouseLeave={handleLightboxMouseUp}
              >
                <img
                  src={getOptimizedImageUrl(memoizedImages[lightboxIndex]?.url, "large")}
                  alt={`${details.name} در ${details.category_name} ${details.neighbourhood} ${details.city} عکس شماره ${lightboxIndex + 1}`}
                  className={`${Styles.lightboxImage} ${zoomScale > 1 ? Styles.zoomed : ""}`}
                  style={{
                    transform: fullscreenTransform,
                    transition: fullscreenTransition,
                  }}
                  loading="eager"
                  draggable="false"
                />
              </div>

              {memoizedImages.length > 1 && zoomScale <= 1 && (
                <>
                  <button
                    aria-label="Previous"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(
                        (prev) => (prev - 1 + memoizedImages.length) % memoizedImages.length
                      );
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
                      setLightboxIndex((prev) => (prev + 1) % memoizedImages.length);
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

                        // Ignore the synthetic click that follows the tap
                        // that just opened the grid.
                        if (Date.now() - gridOpenedAtRef.current < SYNTHETIC_CLICK_WINDOW) {
                          return;
                        }

                        setLightboxIndex(idx);
                        setIsFullscreen(true);
                        setImagePosition({ x: 50, y: 50 });
                      }}
                    >
                      <img
                        src={getOptimizedImageUrl(img.url, "medium")}
                        alt={`${details.name} در ${details.category_name} ${details.neighbourhood} ${details.city} عکس شماره ${idx + 1}`}
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