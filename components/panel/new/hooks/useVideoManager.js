// components/panel/new/hooks/useVideoManager.js
// Ported from newworkerparts/hooks.js useVideoManager — 1:1
// Note: no trimmer / compressor on web (per decision). Trimmer state kept
// for API compatibility but unused.

import { useState, useCallback } from "react";

export const useVideoManager = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideoUri, setSelectedVideoUri] = useState(null);
  const [showTrimmer, setShowTrimmer] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressingVideoUri, setCompressingVideoUri] = useState(null);
  const [tempProcessingVideo, setTempProcessingVideo] = useState(null);

  const addVideo = useCallback((video) => {
    setVideos((prev) => [...prev, video]);
  }, []);

  const deleteVideo = useCallback(
    (video) => {
      setVideos((prev) => prev.filter((v) => v.uri !== video.uri));
      if (tempProcessingVideo && tempProcessingVideo.uri === video.uri) {
        setTempProcessingVideo(null);
      }
    },
    [tempProcessingVideo]
  );

  const openVideoPreview = useCallback((video) => {
    setSelectedVideo(video);
    setVideoModalVisible(true);
  }, []);

  const closeVideoPreview = useCallback(() => {
    setSelectedVideo(null);
    setVideoModalVisible(false);
  }, []);

  // On web, "video selected" = raw File added directly. No trimmer.
  const handleVideoSelected = useCallback((video) => {
    setSelectedVideo(video);
    setSelectedVideoUri(video.uri);
    const newVideo = {
      uri: video.uri,
      file: video.file, // ← MUST be present
      mime: video.mime || "video/mp4",
      width: video.width || 1080,
      height: video.height || 1080,
      isFromDraft: false,
      isProcessing: false,
      error: false,
      uploadStatus: "uploading",
    };
    setVideos((prev) => [...prev, newVideo]);
    setSelectedVideo(null);
    setSelectedVideoUri(null);
  }, []);

  // Kept for API parity — no-op on web
  const handleTrimmedAndCompressed = useCallback((compressedVideoUri) => {
    setShowTrimmer(false);
    setSelectedVideo(null);
    setSelectedVideoUri(null);
    setCompressingVideoUri(null);
    setIsCompressing(false);
  }, []);

  const startCompressing = useCallback(() => setIsCompressing(true), []);
  const endCompressing = useCallback(() => setIsCompressing(false), []);

  const closeTrimmer = useCallback(() => {
    setTempProcessingVideo(null);
    setShowTrimmer(false);
    setSelectedVideo(null);
    setSelectedVideoUri(null);
    setCompressingVideoUri(null);
    setIsCompressing(false);
  }, []);

  const closeTrimmer2 = useCallback(() => setShowTrimmer(false), []);

  const updateVideoFields = useCallback((uri, fields) => {
    setVideos((prev) =>
      prev.map((v) => (v.uri === uri ? { ...v, ...fields } : v))
    );
  }, []);

  const updateVideoStatus = useCallback((uri, status) => {
    setVideos((prev) =>
      prev.map((v) =>
        v.uri === uri
          ? {
              ...v,                        // ← spreads existing fields, including file
              uploadStatus: status,
              isProcessing: status === "uploading",
              error: status === "error",
            }
          : v
      )
    );
  }, []);

  const markVideoError = useCallback((uri) => {
    setVideos((prev) =>
      prev.map((v) =>
        v.uri === uri
          ? { ...v, uploadStatus: "error", isProcessing: false, error: true }
          : v
      )
    );
  }, []);

  const getDisplayVideos = useCallback(() => {
    const result = [...videos];
    if (tempProcessingVideo) result.push(tempProcessingVideo);
    return result;
  }, [videos, tempProcessingVideo]);

  return {
    videos,
    getDisplayVideos,
    selectedVideo,
    videoModalVisible,
    selectedVideoUri,
    setSelectedVideoUri,
    showTrimmer,
    setShowTrimmer,
    isCompressing,
    compressingVideoUri,
    addVideo,
    deleteVideo,
    openVideoPreview,
    closeVideoPreview,
    handleVideoSelected,
    handleTrimmedAndCompressed,
    closeTrimmer,
    closeTrimmer2,
    startCompressing,
    endCompressing,
    updateVideoStatus,
    updateVideoFields,
    markVideoError,
  };
};