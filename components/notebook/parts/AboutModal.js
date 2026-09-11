import React from 'react';
import { IoCloseOutline, IoBugOutline, IoBookOutline } from 'react-icons/io5';
import styles from './styles.module.css';

const AboutModal = ({ visible, onClose }) => {
  const handleReportBug = () => {
    if (typeof window !== 'undefined') {
      window.location.href = 'mailto:bug-report@ajur.app?subject=گزارش باگ اپلیکیشن دفترچه تلفن&body=لطفاً باگ پیدا شده را به طور کامل شرح دهید:';
    }
  };

  if (!visible) return null;

  return (
    <div className={styles.aboutOverlay}>
      <div className={styles.aboutContent}>
        <div className={styles.aboutHeader}>
          <div className={styles.aboutTitle}>درباره دفترچه تلفن</div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none' }}><IoCloseOutline size={20} /></button>
        </div>

        <div className={styles.appInfo}>
          <IoBookOutline size={40} color="#4CAF50" />
          <div className={styles.appName}>Ajur Phone Book</div>
          <div className={styles.versionText}>version : 0.8.beta</div>
          <div className={styles.copyrightText}>کلیه حقوق , طراحی ها و ایده ها برای مشاور املاک  هوشمند آجر محفوظ است</div>
          <div className={styles.copyrightText}>© 2025 Ajur Real Estate Corporation</div>
        </div>

        <div className={styles.reportSection}>
          <div className={styles.reportTitle}>گزارش باگ</div>
          <div className={styles.reportBox}>
            <div className={styles.reportText}>باگ پیدا کنید ، گزارش دهید و جایزه بهترین گزارش باگ را دریافت کنید!</div>
            <div className={styles.reportSubText}>هر گونه مشکل، خطا یا پیشنهاد را   با ما در میان بگذارید.</div>
          </div>

          <button className={styles.reportButton} onClick={handleReportBug}>
            <IoBugOutline size={18} color="white" />
            <div className={styles.reportButtonText}>گزارش باگ</div>
          </button>
        </div>

        <div className={styles.aboutFooter}>
          <div className={styles.footerText}>با ❤️ ساخته شده برای مشاوران املاک</div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;