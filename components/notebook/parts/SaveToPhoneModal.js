import React from 'react';
import { IoPhonePortraitOutline, IoCheckmark, IoCloseOutline } from 'react-icons/io5';
import styles from './styles.module.css';

const SaveToPhoneModal = ({ visible, contact, onSave, onCancel, onSkip }) => {
  if (!contact) return null;

  if (!visible) return null;

  return (
    <div className={styles.savePhoneOverlay}>
      <div className={styles.savePhoneContent}>
        <div className={styles.savePhoneHeader}>
          <IoPhonePortraitOutline size={28} color="#2196F3" />
          <div className={styles.savePhoneTitle}>ذخیره در گوشی</div>
        </div>

        <div className={styles.savePhoneBody}>
          <div className={styles.savePhoneText}>
            آیا می‌خواهید "{contact.name || 'این مخاطب'}" در دفترچه تلفن گوشی نیز ذخیره شود؟
          </div>
          <div className={styles.savePhoneNote}>
            این کار باعث می‌شود مخاطب هم در اپلیکیشن و هم در دفترچه تلفن گوشی شما قابل دسترسی باشد.
          </div>
        </div>

        <div className={styles.savePhoneActions}>
          <button className={`${styles.savePhoneButton} ${styles.saveButton}`} onClick={() => onSave(contact)}>
            <IoCheckmark size={16} color="white" />
            <div className={styles.savePhoneButtonText}>بله، ذخیره شود</div>
          </button>

          <button className={`${styles.savePhoneButton} ${styles.skipButton}`} onClick={onSkip}>
            <IoCloseOutline size={16} color="gray" />
            <div className={styles.savePhoneButtonText}>خیر، فقط در اپ</div>
          </button>

          <button className={`${styles.savePhoneButton} ${styles.cancelButton}`} onClick={onCancel}>
            <div className={styles.savePhoneButtonText}>انصراف</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveToPhoneModal;