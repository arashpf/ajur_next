import React from 'react'
import PropTypes from 'prop-types';
import styles from '../styles/AboutUs.module.css';
import 'font-awesome/css/font-awesome.min.css';
import Image from 'next/image'


const AboutUs = (props) => {
  return (
    <div className={styles['about-wrapper']}>
    <div className={styles['about-image-wrapper']}>
    <Image
      // src="https://ajur.app/logo/ajour-meta-image.jpg"
      // src="/img/ajur-1200.png"
      src="/img/us.jpg"
      alt='درباره مشاور املاک هوشمند آجر'
      width={1280}
      height={752}
    />
    </div>
    <div className={styles['about-text-wrapper']}>
    <h2>درباره مشاور املاک هوشمند آجر</h2>
    <p>آجر مشاور املاکی به وسعت ایران است . هدف ما فعالیتی گسترده در زمینه املاک است </p>
    <p>وجود پلتفرمی یک پارچه برای مشاورین املاک و بهره گیری از جدیدترین فناوری های تولید
    محتوا در تیم آجر میتواند روند معرفی و معامله را برای دو طرف آن آسان تر کند</p>
  <p>آجر تنها یک مشاور املاک اینترنتی نیست، بلکه هدف ما ایجاد بستری مناسب
  و استفاده از جدیدترین دستاورد های نرم افزاری و سخت افزاری در کنار تیم های
تخصصی مشاوره در زمینه املاک است </p>
    </div>
    </div>

  )
}

export default AboutUs
