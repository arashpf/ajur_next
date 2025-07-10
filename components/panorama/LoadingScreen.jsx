import styles from '../styles/LoadingScreen.module.css';

const LoadingScreen = ({ message = "در حال بارگذاری تور مجازی..." }) => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loader}>
        <div className={styles.orbit}></div>
        <div className={styles.orbit}></div>
        <div className={styles.orbit}></div>
        <div className={styles.planet}></div>
      </div>
      <div className={styles.progressBar}>
        <div className={styles.progress}></div>
      </div>
      <p className={styles.message}>{message}</p>
    </div>
  );
};

export const NoDataScreen = () => {
  return (
    <div className={styles.noDataContainer}>
      <div className={styles.noDataIllustration}>
        <div className={styles.magnifyingGlass}></div>
        <div className={styles.exclamation}>!</div>
      </div>
      <h3 className={styles.noDataTitle}>داده ای برای نمایش وجود ندارد</h3>
      <p className={styles.noDataSubtitle}>لطفاً بعداً مجدداً بررسی کنید</p>
    </div>
  );
};

export default LoadingScreen;