import React from "react";
import styles from "./DealButton.module.css";

export default function DealButton({ title, src, onClick, style = {}, subtitle }) {
  return (
    <button
      type="button"
      className={styles.card}
      onClick={onClick}
      style={style}
      aria-label={title}
    >
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.content}>
        <div className={styles.media}>
          <img 
            src={src || "/placeholder.svg"} 
            alt={title} 
            className={styles.image}
            loading="lazy"
          />
        </div>

        <div className={styles.text}>
          <h3 className={styles.title}>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </div>
    </button>
  );
}