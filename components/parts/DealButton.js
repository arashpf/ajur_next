import React from 'react'
import styles from '../styles/DealButton.module.css'

const DealButton = ({ title, src, onClick, style = {} }) => {
  return (
    <button type="button" className={`${styles.button} ${styles.popIn}`} onClick={onClick} style={style}>
      <div className={styles.content}>
        <div className={styles.icon}>
          <img src={src} alt={title} />
        </div>
        <div className={styles.title}>{title}</div>
      </div>
    </button>
  )
}

export default DealButton
