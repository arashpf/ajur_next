import React from 'react'
import PropTypes from 'prop-types'
import { MagicSpinner,DominoSpinner } from "react-spinners-kit"
import styles from "../styles/SpinnerLoader.module.css";

const SpinnerLoader = (props) => {
  return (
  <div className={styles["spinner-wrapper"]}>
    <div className={styles["spinner-single"]}>
    <DominoSpinner
       size={130} color='coral' loading={true}
     />
     </div>
    </div>
  )
}

export default SpinnerLoader
