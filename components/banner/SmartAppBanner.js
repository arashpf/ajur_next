import { useState, useEffect } from "react";
import { isMobile } from "react-device-detect";
import Cookies from "js-cookie";
import styles from "../styles/SmartAppBanner.module.css"; // Import the module CSS
import { useRouter } from "next/router"; // Import Next.js router

const SmartAppBanner = () => {
  const router = useRouter(); // Initialize the router
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const checkIfInstalled = () => {
      const timeout = setTimeout(() => {
        // Show banner only if the app is NOT installed
        if (!Cookies.get("hideAppBanner")) {
          setShowBanner(true);
        }
      }, 1000);

      // Try opening the app using deep linking
      window.location.href = "ajour://"; // Replace with your actual deep link scheme

      return () => clearTimeout(timeout);
    };

    if (isMobile) {
      checkIfInstalled();
    }
  }, []);

  const closeBanner = () => {
    setShowBanner(false);
    Cookies.set("hideAppBanner", "true", { expires: 7 }); // Remember user choice for 7 days
  };

  const handleDownloadClick = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    router.push('/download'); // Navigate to your download page
    closeBanner(); // Close the banner after navigation
  };

  if (!showBanner) return null;

  return (
    <div className={styles.appBanner}>
      <button className={styles.closeBtn} onClick={closeBanner}>✖</button>
      <div className={styles.bannerContent}>
        <h3>دانلود اپلیکیشن آجر</h3>
        <p>برای بهترین تجربه، نصب کنید.</p>
      </div>
      <a
        // href="https://cafebazaar.ir/app/com.Ajour"
        href="/download"
        onClick={handleDownloadClick} // Added click handler

        className={styles.downloadBtn}
      >
        نصب میکنم
      </a>
    </div>
  );
};

export default SmartAppBanner;
