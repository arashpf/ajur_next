import React from "react";
import { Modal } from "react-bootstrap";
import styles from "./styles.module.css";

const ContactFormModal = ({
  visible = false,
  onClose = () => {},
  contactForm = { name: '', mobile: '', phone: '', description: '' },
  onFormChange = () => {},
  onSubmit = () => {},
  isEditing = false,
  onCancelEdit = () => {},
}) => {
  return (
    <Modal
      show={visible}
      onHide={onClose}
      centered
      backdrop="static"
      className={styles.modalOverlay}
    >
      <div className={styles.addModalContent}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h5 className={styles.formTitle}>
            {isEditing ? "ویرایش مخاطب" : "افزودن مخاطب جدید"}
          </h5>
          <button className={styles.closeIcon} onClick={onClose}>
            ×
          </button>
        </div>

        {/* Form */}
        <div className={styles.formBody}>
          <input
            className={styles.textInput}
            value={contactForm.name}
            onChange={(e) =>
              onFormChange({ ...contactForm, name: e.target.value })
            }
            placeholder="نام"
          />
          <input
            className={styles.textInput}
            value={contactForm.mobile}
            onChange={(e) =>
              onFormChange({ ...contactForm, mobile: e.target.value })
            }
            placeholder="شماره موبایل"
            type="tel"
          />
          <input
            className={styles.textInput}
            value={contactForm.phone}
            onChange={(e) =>
              onFormChange({ ...contactForm, phone: e.target.value })
            }
            placeholder="تلفن ثابت"
            type="tel"
          />
          <textarea
            className={styles.textArea}
            value={contactForm.description}
            onChange={(e) =>
              onFormChange({ ...contactForm, description: e.target.value })
            }
            placeholder="توضیحات تکمیلی"
            rows={4}
          />
        </div>

        {/* Buttons */}
        <div className={styles.buttonRow}>
          {isEditing ? (
            <>
              <button
                className={`${styles.actionButton} ${styles.cancelButton}`}
                onClick={onCancelEdit}
              >
                انصراف
              </button>
              <button
                className={`${styles.actionButton} ${styles.updateButton}`}
                onClick={onSubmit}
              >
                بروزرسانی
              </button>
            </>
          ) : (
            <button
              className={`${styles.actionButton} ${styles.addButton}`}
              onClick={onSubmit}
            >
              افزودن
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ContactFormModal;
