import React from 'react'
import PropTypes from 'prop-types'
import Styles from '../styles/SpinerView.css';

var Spinner = require('react-spinkit')

const SpinnerView = (props) => {

  return (
    <div className="spin-wrapper">

      
      <Spinner className="spinner" name="line-scale-pulse-out" color="orange"/>


     </div>
  )
}

export default SpinnerView
