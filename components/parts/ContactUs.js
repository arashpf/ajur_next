import React from 'react'
import PropTypes from 'prop-types';
import styles from '../styles/ContactUs.module.css';
import 'font-awesome/css/font-awesome.min.css';
import WorkTime from '../../components/parts/WorkTime';
import Image from 'next/image'


const ContactUs = (props) => {
  return (
    <div className={styles['about-wrapper']}>
    <div className={styles['about-image-wrapper']}>
    <Image
      src="/img/customers-service.png"
      alt='درباره مشاور املاک هوشمند آجر'
      width={800}
      height={800}
    />
    </div>
    <div className={styles['about-text-wrapper']}>
    <h2>راه های ارتباطی با مشاور املاک هوشمند آجر</h2>
    <div className={styles["contact-wrapper"]}>

       <h3> تهران ، رباط کریم
 فرهنگیان
  ،
  نبش نارون سوم  <i className="fa fa-map-marker"></i></h3>
       <h3>
 09382740488   <i className="fa fa-volume-control-phone"></i></h3>
       <h3>support@ajur.app <i className="fa fa-envelope"></i></h3>

    </div>

    </div>


    </div>

  )
}

export default ContactUs
