import { useState, useEffect, useRef } from 'react';
import styles from '../styles/SectionNav.module.css';

const SectionNav = ({ 
  sections, 
  currentSectionId, 
  onSectionChange,
  panoramas,
  setCurrentPanoramaIndex
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Handle section click
  const handleSectionClick = (sectionId) => {
    if (!isDragging) {
      
      onSectionChange(sectionId);
      const firstInSection = panoramas.findIndex(p => p.section_id == sectionId);
      // if (firstInSection !== -1) {
      //   setCurrentPanoramaIndex(firstInSection);
      // }

       setCurrentPanoramaIndex(firstInSection);
    }
  };

  // Drag handling for slider
  const handleMouseDown = (e) => {
    setIsDragging(true);
    startXRef.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeftRef.current = sliderRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 2;
    sliderRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Minimize/maximize toggle
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`${styles.sectionNavContainer} ${isMinimized ? styles.minimized : ''}`}>
      <div 
        className={styles.grabHandle} 
        onClick={toggleMinimize}
        title={isMinimized ? "Show sections" : "Hide sections"}
      >
        {isMinimized ? '▶' : '▼'}
      </div>

      {!isMinimized && (
        <div 
          ref={sliderRef}
          className={styles.sectionsSlider}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {sections.map((section) => (
            <button
              key={section.id}
              className={`${styles.sectionButton} ${
                section.id == currentSectionId ? styles.active : ''
              }`}
              onClick={() => handleSectionClick(section.id)}
            >
              {section.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SectionNav;  