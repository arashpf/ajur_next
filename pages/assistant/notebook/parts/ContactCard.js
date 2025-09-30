import React, { useState } from "react";
import {
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { IoCallOutline } from "react-icons/io5";
import styles from "./styles.module.css";

const isDesktop = () => {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  const mobileRegex = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i;
  return !mobileRegex.test(ua);
};

const ContactCard = ({
  note = {},
  categories = [],
  onEdit = () => {},
  onSaveToContacts = () => {},
  onDelete = () => {},
  onCall = () => {},
  onViewDetails = () => {},
}) => {
  const categoryColor =
    (categories || []).find((c) => c?.id === note?.category)?.color || "#795548";

  const [showModal, setShowModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const phoneNumber = note.mobile || note.phone;

  const copyToClipboard = (number) => {
    if (!number) return;
    navigator.clipboard.writeText(number).then(() => {
      setSnackbarOpen(true);
    });
  };

  return (
    <div className={styles.noteCard}>
      <div className={styles.contactCardContent}>
        {isDesktop() ? (
          <>
            <button
              className={styles.callButton}
              onClick={() => setShowModal(true)}
              disabled={!phoneNumber}
            >
              <IoCallOutline size={18} color="white" />
            </button>

            {/* ✅ MUI Dialog */}
            <Dialog open={showModal} onClose={() => setShowModal(false)}>
              <DialogTitle>شماره تماس</DialogTitle>
              <DialogContent>
                <p style={{ fontSize: "1.1rem", direction: "ltr" }}>
                  {phoneNumber}
                </p>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => copyToClipboard(phoneNumber)}>کپی</Button>
                <Button onClick={() => setShowModal(false)}>بستن</Button>
              </DialogActions>
            </Dialog>

            {/* ✅ Snackbar */}
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={() => setSnackbarOpen(false)}
              message="شماره کپی شد ✅"
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            />
          </>
        ) : (
          <button
            className={styles.callButton}
            onClick={() => onCall(phoneNumber)}
            disabled={!phoneNumber}
          >
            <IoCallOutline size={18} color="white" />
          </button>
        )}

        <button
          className={styles.contactNameSection}
          style={{ background: "transparent", border: "none" }}
          onClick={() => onViewDetails(note)}
        >
          {note.name ? (
            <div className={styles.contactName}>{note.name}</div>
          ) : (
            <div className={styles.contactNamePlaceholder}>بدون نام</div>
          )}
        </button>
      </div>
    </div>
  );
};

export default ContactCard;
