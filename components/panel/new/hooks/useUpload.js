// components/panel/new/hooks/useUpload.js
// Ported from newworkerparts/hooks.js useUpload — 1:1

import { useState, useCallback } from "react";

export const useUpload = () => {
  const [beginUpload, setBeginUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const startUpload = useCallback(() => {
    setBeginUpload(true);
    setUploadProgress(0);
  }, []);

  const updateProgress = useCallback((progress) => {
    setUploadProgress(progress);
  }, []);

  const finishUpload = useCallback(() => {
    setBeginUpload(false);
    setUploadProgress(0);
  }, []);

  return {
    beginUpload,
    uploadProgress,
    startUpload,
    updateProgress,
    finishUpload,
  };
};