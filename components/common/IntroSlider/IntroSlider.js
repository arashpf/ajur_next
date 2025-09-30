import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import styles from './styles.module.css';

const AsyncStorage = {
  getItem: async (k) => typeof window !== 'undefined' ? localStorage.getItem(k) : null,
  setItem: async (k, v) => typeof window !== 'undefined' ? localStorage.setItem(k, v) : null,
};

const IntroSlider = ({ visible, onClose, slides, lastButtonLabel, onLastButtonClick, hasSkip }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [imageAnimKey, setImageAnimKey] = useState(0);

  useEffect(() => {
    if (visible) setCurrentSlideIndex(0);
  }, [visible]);

  useEffect(() => {
    setImageAnimKey(k => k + 1);
  }, [currentSlideIndex]);

  const closeIntroSlider = async () => {
    try { await AsyncStorage.setItem('hasSeenFileBankIntro', 'true'); } catch (e) {}
    if (typeof onClose === 'function') onClose();
  };

  const SkipToLastSlide =  () => {
    setCurrentSlideIndex(slides.length - 1);
  }

  if (!visible) return null;

  const isLastSlide = currentSlideIndex === slides.length - 1;

  const handleNext = () => {
  if (isLastSlide) {
    // Always close the slider first
    if (onClose) onClose(); 

    // Then run your custom last-button action
    if (onLastButtonClick) onLastButtonClick();
  } else {
    setCurrentSlideIndex(i => i + 1);
  }
};


  return (
    <div className={styles.introContainer}>
      <div className={styles.slideContainer}>
        <div className={styles.lottieContainer}>
          {slides[currentSlideIndex].image ? (
            <img
              key={imageAnimKey}
              src={slides[currentSlideIndex].image}
              alt={slides[currentSlideIndex].title || 'slide image'}
              className={`${styles.slideImage} ${styles.animateFlip}`}
            />
          ) : (
            <Lottie
              animationData={slides[currentSlideIndex].lottieSource}
              loop={true}
              autoplay={true}
              className={styles.lottieAnimation}
            />
          )}
        </div>
        <div
          className={styles.textContainer}
          style={{ backgroundColor: slides[currentSlideIndex].color }}
        >
          <div className={styles.slideTitle}>{slides[currentSlideIndex].title}</div>
          <div className={styles.slideDescription}>{slides[currentSlideIndex].description}</div>
          <div className={styles.pagination}>
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`${styles.paginationDot} ${
                  idx === currentSlideIndex ? styles.paginationDotActive : ''
                }`}
              />
            ))}
          </div>
          <div className={styles.navigationButtons}>
  {/* Skip button only on first slide */}
  {currentSlideIndex === 0 && !hasSkip && (
    <button onClick={SkipToLastSlide} className={styles.skipButton}>
      رد کردن
    </button>
  )}
  {currentSlideIndex === 0 && hasSkip && (
    <button onClick={closeIntroSlider} className={styles.skipButton}>
      رد کردن
    </button>
  )}

  {/* Back button on every slide except first */}
  {currentSlideIndex > 0 && (
    <button
      onClick={() => setCurrentSlideIndex(i => Math.max(0, i - 1))}
      className={styles.navButton}
    >
      قبلی
    </button>
  )}

  {/* Next / Start button */}
  <button
    onClick={handleNext}
    className={`${styles.navButton} ${styles.primaryButton}`}
  >
    {isLastSlide ? lastButtonLabel || 'شروع' : 'بعدی'}
  </button>
</div>
        </div>
      </div>
    </div>
  );
};


export default IntroSlider;
