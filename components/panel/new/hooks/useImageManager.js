// components/panel/new/hooks/useImageManager.js
// Ported from newworkerparts/hooks.js useImageManager — 1:1

import { useState, useCallback } from "react";

export const useImageManager = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

  const addImages = useCallback((newImages) => {
    setImages((prev) => {
      const startOrder = prev.length;
      const withOrder = newImages.map((img, idx) => ({
        ...img,
        order: img.order !== undefined ? img.order : startOrder + idx,
        uploadStatus: img.uploadStatus || "uploading",
      }));
      return [...prev, ...withOrder];
    });
  }, []);

  const deleteImage = useCallback((image) => {
    setImages((prev) => prev.filter((img) => img.uri !== image.uri));
  }, []);

  const setMainImage = useCallback((image) => {
    if (!image) return;
    setImages((prev) => {
      const rest = prev.filter(
        (img) => img.uri !== image.uri && img.id !== image.id
      );
      return [
        { ...image, order: 0, isMain: true },
        ...rest.map((img, i) => ({
          ...img,
          order: i + 1,
          isMain: false,
        })),
      ];
    });
  }, []);

  const openImagePreview = useCallback((image) => {
    setSelectedImage(image);
    setIsImageModalVisible(true);
  }, []);

  const closeImagePreview = useCallback(() => {
    setSelectedImage(null);
    setIsImageModalVisible(false);
  }, []);

  const updateImage = useCallback((oldUri, newData) => {
    setImages((prev) =>
      prev.map((img) =>
        img.uri === oldUri ? { ...img, ...newData } : img
      )
    );
  }, []);

  const updateImageStatus = useCallback((uri, status) => {
    setImages((prev) =>
      prev.map((img) =>
        img.uri === uri ? { ...img, uploadStatus: status } : img
      )
    );
  }, []);

  const updateImageById = useCallback((id, newData) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, ...newData } : img))
    );
  }, []);

  const getImageByUri = useCallback(
    (uri) => images.find((img) => img.uri === uri),
    [images]
  );

  const getImageById = useCallback(
    (id) => images.find((img) => img.id === id),
    [images]
  );

  return {
    images,
    selectedImage,
    isImageModalVisible,
    addImages,
    deleteImage,
    setMainImage,
    openImagePreview,
    closeImagePreview,
    updateImage,
    updateImageStatus,
    updateImageById,
    getImageByUri,
    getImageById,
  };
};