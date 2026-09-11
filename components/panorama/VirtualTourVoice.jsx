import { useState, useEffect, useRef } from 'react';
import styles from '../styles/VirtualTourVoice.module.css';

const VirtualTourVoice = ({ 
  currentSection,
  currentPanorama,
  sections,
  panoramas
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechRef = useRef(null);

  // Text-to-speech function
  const speak = (text) => {
    if (isMuted || !text) return;
    
    // Cancel any ongoing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Changed to English for testing
    utterance.rate = 1; // Slightly slower for clarity
    utterance.pitch = 1; // Normal pitch
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Speak when section changes
  useEffect(() => {
    if (!currentSection) return;
    
    const section = sections.find(s => s.id === currentSection);
    if (section) {
      speak(` ${section.description || ''}`);
    }
  }, [currentSection]);

  // Speak when panorama changes
  useEffect(() => {
    if (!currentPanorama) return;
    
    const panorama = panoramas.find(p => p.id === currentPanorama);
    if (panorama) {
      speak(panorama.description || `Panorama ${panorama.name}`);
    }
  }, [currentPanorama]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleMute = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
    }
    setIsMuted(!isMuted);
  };

  return (
    <div className={styles.voiceControl}>
      <button 
        onClick={toggleMute}
        className={`${styles.voiceButton} ${isMuted ? styles.muted : ''}`}
        aria-label={isMuted ? "Unmute voice guidance" : "Mute voice guidance"}
      >
        <svg viewBox="0 0 24 24">
          {isMuted ? (
            <>
              <path d="M16 5L19 8M19 8L22 11M19 8L22 5M19 8L16 11"/>
              <path d="M14 9C14 9 14.5 10 14.5 12C14.5 14 14 15 14 15M12 6H8C6.89543 6 6 6.89543 6 8V16C6 17.1046 6.89543 18 8 18H12L17 21V3L12 6Z"/>
            </>
          ) : (
            <>
              <path d="M12 6H8C6.89543 6 6 6.89543 6 8V16C6 17.1046 6.89543 18 8 18H12L17 21V3L12 6Z"/>
              <path d="M17 9C17 5 19.5 3 22 3" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M17 15C20 11 22 12 22 15" strokeWidth="1.5" strokeLinecap="round"/>
            </>
          )}
        </svg>
        {isSpeaking && !isMuted && (
          <div className={styles.soundWave}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </button>
    </div>
  );
};

export default VirtualTourVoice;
