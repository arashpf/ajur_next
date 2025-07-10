import React from 'react'
import PropTypes from 'prop-types'
import { MagicSpinner } from "react-spinners-kit"
import styles from "../styles/SpinnerModalLoader.module.css";

const SpinnerLoader = (props) => {
  return (
  <div className={styles["spinner-modal-wrapper"]}>
    <div className={styles["spinner-modal-single"]}>
    <MagicSpinner
       size={50} color="#686769" loading={true}
     />
     </div>
    </div>
  )
}

export default SpinnerLoader
