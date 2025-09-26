import React from "react";
import styles from "./styles/ActionButton.module.css";

export default function ActionButton({
  type,
  label,
  description,
  selected = false,
  hideDir = null, // 'left' | 'right' | null
  animate = null, // 'exitSelected' | 'exitOther' | 'show'
  onClick,
  onClose,
  onHidden, // called after hide animation finishes
}) {
  let cls = styles.container;
  if (selected) cls = `${cls} ${styles.selected}`;
  if (hideDir === "right") cls = `${cls} ${styles.hideRight}`;
  if (hideDir === "left") cls = `${cls} ${styles.hideLeft}`;
  if (animate === "exitSelected") cls = `${cls} ${styles.exitSelected}`;
  if (animate === "exitOther") cls = `${cls} ${styles.pop}`;
  if (animate === "show") cls = `${cls} ${styles.show}`;

  function handleClick(e) {
    // If already selected, treat a click on the whole button as close
    if (selected) {
      if (onClose) onClose();
      return;
    }

    if (onClick) onClick(type);
  }

  return (
    <div
      className={cls}
      onClick={handleClick}
      onAnimationEnd={(e) => {
        const name = e.animationName || "";
        // common case: keyframe name matches
        if ((name === "hideRight" || name === "hideLeft" || name === "pop") && onHidden) {
          onHidden(type);
          return;
        }
        // fallback: if a hide direction was requested but animationName isn't available, still notify parent
        if (!name && hideDir && onHidden) {
          onHidden(type);
        }
      }}
    >
      <div className={styles.card}>
        {selected && (
          <button
            aria-label="بستن"
            className={styles.closeButton}
            onClick={(e) => {
              e.stopPropagation();
              if (onClose) onClose();
            }}
          >
            ×
          </button>
        )}
        <div className={styles.label}>{label}</div>
        <div className={styles.description}>{description}</div>
      </div>
    </div>
  );
}
