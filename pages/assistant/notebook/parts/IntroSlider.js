import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import styles from './styles.module.css';

const AsyncStorage = {
  getItem: async (k) => typeof window !== 'undefined' ? localStorage.getItem(k) : null,
  setItem: async (k, v) => typeof window !== 'undefined' ? localStorage.setItem(k, v) : null,
};

const IntroSlider = ({ visible, onClose, slides }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    if (visible) setCurrentSlideIndex(0);
  }, [visible]);

  const closeIntroSlider = async () => {
    try { await AsyncStorage.setItem('hasSeenFileBankIntro', 'true'); } catch (e) {}
    onClose();
  };

  if (!visible) return null;

  return (
    <div className={styles.introContainer}>
      <div className={styles.slideContainer}>
        <div className={styles.lottieContainer}>
          <Lottie animationData={slides[currentSlideIndex].lottieSource} loop={true} autoplay={true} className={styles.lottieAnimation} />
        </div>
        <div className={styles.textContainer} style={{ backgroundColor: slides[currentSlideIndex].color }}>
          <div className={styles.slideTitle}>{slides[currentSlideIndex].title}</div>
          <div className={styles.slideDescription}>{slides[currentSlideIndex].description}</div>
          <div className={styles.pagination}>
            {slides.map((_, idx) => (
              <div key={idx} className={`${styles.paginationDot} ${idx === currentSlideIndex ? styles.paginationDotActive : ''}`} />
            ))}
          </div>
          <div className={styles.navigationButtons}>
            {currentSlideIndex === 0 && <button onClick={closeIntroSlider} className={styles.skipButton}>رد کردن</button>}
            {currentSlideIndex > 0 && <button onClick={() => setCurrentSlideIndex(i => Math.max(0, i-1))} className={styles.navButton}>قبلی</button>}
            <button onClick={() => currentSlideIndex < slides.length - 1 ? setCurrentSlideIndex(i => i+1) : closeIntroSlider()} className={`${styles.navButton} ${styles.primaryButton}`}>{currentSlideIndex === slides.length - 1 ? 'شروع' : 'بعدی'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroSlider;