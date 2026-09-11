import { useState, useEffect } from "react";
import styles from "../styles/AppPromotion.module.css";

const AppPromotion = ({ triggerElements }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleUserClick = (event) => {
      if (triggerElements.includes(event.target.id)) {
        setShowModal(true);
      }
    };

    document.addEventListener("click", handleUserClick);
    return () => document.removeEventListener("click", handleUserClick);
  }, [triggerElements]);

  const closeModal = () => setShowModal(false);

  if (!showModal) return null;

  return (
    <div className={styles.modalOverlay} onClick={closeModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={closeModal}>✖</button>
        <h3>پین کردن آسان ملک شما</h3>
        <p>از طریق اپلیکیشن ما، به راحتی ملک خود را در تمامی مناطق ثبت کنید.</p>
        <img src="/promo.gif" alt="App Promotion" className={styles.promoGif} />
        <a href="https://cafebazaar.ir/app/com.Ajour" className={styles.downloadBtn}>
          نصب اپلیکیشن
        </a>
      </div>
    </div>
  );
};

export default AppPromotion;
