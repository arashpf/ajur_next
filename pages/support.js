import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Head from "next/head";

const Contact = (props) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('نظر شما با موفقیت ارسال شد!');
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="contact-page">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="max-image-preview:large" />
        <title>تماس با آجر | مشاور املاک هوشمند آجر</title>
        <meta name="description" content="صفحه تماس و ارتباط با مشاور املاک هوشمند آجر - اطلاعات تماس، فرم انتقادات و پیشنهادات و موقعیت مکانی" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta property="og:locale" content="fa_IR" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="تماس با ما | مشاور املاک هوشمند آجر" />
        <meta property="og:description" content="صفحه تماس و ارتباط با مشاور املاک هوشمند آجر" />
        <meta property="og:url" content="https://ajur.app/contact" />
        <meta property="og:site_name" content="مشاور املاک هوشمند آجر" />
        <meta property="article:published_time" content="2020-05-19T21:34:43+00:00" />
        <meta property="article:modified_time" content="2022-01-28T03:47:57+00:00" />
        <meta property="og:image" content="https://ajur.app/logo/ajour-meta-image.jpg" />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="533" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:label1" content="Written by" />
        <meta name="twitter:data1" content="آرش پیمانی فر" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://ajur.app/contact" />
      </Head>

      {/* Hero Section */}
      <div className="contact-hero">
        <div className="hero-content">
          <h1 className="hero-title">تماس با آجر</h1>
          <p className="hero-subtitle">ما اینجا هستیم تا به شما در خرید، فروش و اجاره ملک کمک کنیم</p>
          <div className="hero-divider"></div>
        </div>
      </div>

      <div className="contact-container">
        <div className="contact-grid">
          {/* Contact Information */}
          <div className="contact-info">
            <div className="info-section">
              <h2 className="section-title">اطلاعات تماس</h2>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M20 10.999H22C22 5.869 18.127 2 12.99 2V4C17.052 4 20 6.943 20 10.999Z" fill="#a92b21"/>
                    <path d="M13 8C15.103 8 16 8.897 16 11H18C18 7.774 16.225 6 13 6V8ZM13.001 12C13.001 12.247 12.906 12.449 12.731 12.64C12.556 12.831 12.293 13.012 11.956 13.17C11.292 13.48 10.456 13.67 9.544 13.788C9.193 13.834 8.828 13.866 8.458 13.886C8.312 13.894 8.156 13.9 8 13.9C7.844 13.9 7.688 13.894 7.542 13.886C7.172 13.866 6.807 13.834 6.456 13.788C5.544 13.67 4.708 13.48 4.044 13.17C3.707 13.012 3.444 12.831 3.269 12.64C3.094 12.449 3 12.247 3 12V9C3 8.754 3.094 8.551 3.269 8.36C3.444 8.169 3.707 7.988 4.044 7.83C4.708 7.52 5.544 7.33 6.456 7.212C6.807 7.166 7.172 7.134 7.542 7.114C7.688 7.106 7.844 7.1 8 7.1C8.156 7.1 8.312 7.106 8.458 7.114C8.828 7.134 9.193 7.166 9.544 7.212C10.456 7.33 11.292 7.52 11.956 7.83C12.293 7.988 12.556 8.169 12.731 8.36C12.906 8.551 13.001 8.754 13.001 9V12Z" fill="#a92b21"/>
                  </svg>
                </div>
                <div className="contact-details">
                  <h3>شماره تماس</h3>
                  <a href="tel:02140557301" className="contact-link">۰۲۱-۴۰۵۵۷۳۰۱</a>
                  <a href="tel:09382740488" className="contact-link">۰۹۳۸-۲۷۴-۰۴۸۸</a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z" fill="#a92b21"/>
                    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="#a92b21"/>
                  </svg>
                </div>
                <div className="contact-details">
                  <h3>آدرس</h3>
                  <p className="contact-link">تهران، رباط کریم، بلوار آزادگان، نبش آزادگان چهارم، دپارتمان ستاره شهر</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#a92b21"/>
                  </svg>
                </div>
                <div className="contact-details">
                  <h3>ایمیل</h3>
                  <a href="mailto:info@ajur.app" className="contact-link">info@ajur.app</a>
                  <a href="mailto:support@ajur.app" className="contact-link">support@ajur.app</a>
                </div>
              </div>
            </div>

            {/* Work Hours */}
            <div className="info-section">
              <h2 className="section-title">ساعات کاری شعبات</h2>
              <div className="work-hours">
                <div className="time-slot">
                  <span>شنبه تا پنجشنبه:</span>
                  <span>۲۱:۰۰ - ۹:۰۰</span>
                </div>
                <div className="time-slot">
                  <span>جمعه:</span>
                  <span>۲۰:۰۰ - ۱۶:۰۰</span>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="info-section">
              <h2 className="section-title">شبکه‌های اجتماعی</h2>
              <div className="social-links">
                <a href="https://instagram.com/ajur_app" className="social-link" aria-label="اینستاگرام" target="_blank" rel="noopener noreferrer">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://t.me/apAjorr" className="social-link" aria-label="تلگرام" target="_blank" rel="noopener noreferrer">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.14.141-.259.259-.374.261l.213-3.053 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.136-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form & Map Section */}
          <div className="form-map-section">
            {/* Feedback Form */}
            <div className="form-section">
              <h2 className="section-title">انتقادات و پیشنهادات</h2>
              <p className="form-description">
                نظرات و پیشنهادات شما برای بهبود خدمات ما بسیار ارزشمند است. 
                خوشحال می‌شویم نظرات خود را با ما در میان بگذارید.
              </p>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">نام و نام خانوادگی *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="نام خود را وارد کنید"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">ایمیل *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">شماره تماس</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">انتقادات و پیشنهادات شما *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="توضیحات..."
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn">
                  ثبت نظر
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ transform: 'scaleX(-1)' }}>
                    <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="white"/>
                  </svg>
                </button>
              </form>
            </div>

            {/* Map Section */}
            <div className="map-section">
              <h2 className="section-title">موقعیت ما روی نقشه</h2>
              <div className="map-container">
                <div className="map-wrapper">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3248.884058307922!2d51.07735107462606!3d35.48241234087211!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2s!5e0!3m2!1sen!2s!4v1762329466301!5m2!1sen!2s"
                    width="100%" 
                    height="400" 
                    style={{ border: 0, borderRadius: '8px' }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="دپارتمان ستاره شهر - رباط کریم، بلوار آزادگان"
                  ></iframe>
                  
                  {/* ناحیه قرمز رنگ ثابت */}
                  <div className="fixed-area-highlight">
                    <div className="highlight-border"></div>
                    <div className="highlight-fill"></div>
                    <div className="highlight-center"></div>
                    <div className="area-label">
                      <strong>📍 دپارتمان ستاره شهر</strong>
                      <span>مشاور املاک هوشمند آجر</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-page {
          direction: rtl;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f8f9fa;
        }
        
        .contact-hero {
          // background: linear-gradient(135deg, #577387 0%, #577387 100%);
          background: linear-gradient(135deg, #7fa5bbff 0%, #2c3e50 100%);
          color: white;
          padding: 80px 20px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .contact-hero::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        
        .hero-content {
          position: relative;
          z-index: 1;
        }
        
        .hero-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 16px;
          animation: fadeInUp 0.8s ease;
        }
        
        .hero-subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-bottom: 24px;
          animation: fadeInUp 0.8s ease 0.2s both;
        }
        
        .hero-divider {
          width: 80px;
          height: 4px;
          background: white;
          margin: 0 auto;
          border-radius: 2px;
          animation: fadeInUp 0.8s ease 0.4s both;
        }
        
        .contact-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 20px;
        }
        
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 60px;
          align-items: start;
        }
        
        @media (max-width: 968px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
        
        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 24px;
          padding-bottom: 12px;
          border-bottom: 2px solid #a92b21;
          position: relative;
        }
        
        .section-title::after {
          content: '';
          position: absolute;
          bottom: -2px;
          right: 0;
          width: 60px;
          height: 2px;
          background: #a92b21;
        }
        
        .info-section {
          margin-bottom: 40px;
        }
        
        .contact-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 24px;
          padding: 20px;
          background: white;
          border-radius: 12px;
          border-right: 4px solid #a92b21;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        
        .contact-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(169, 43, 33, 0.15);
        }
        
        .contact-icon {
          margin-left: 16px;
          flex-shrink: 0;
          background: #fef2f2;
          padding: 12px;
          border-radius: 8px;
        }
        
        .contact-details h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }
        
        .contact-details p {
          color: #666;
          margin: 4px 0;
          line-height: 1.5;
        }
        
        .contact-link {
          display: block;
          color: #444343ff;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
          margin: 4px 0;
          padding: 2px 0;
        }
        
        .contact-link:hover {
          color: #d32f2f;
          text-decoration: underline;
        }
        
        .work-hours {
          background: white;
          padding: 24px;
          border-radius: 12px;
          border-right: 4px solid #a92b21;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        
        .time-slot {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #e9ecef;
        }
        
        .time-slot:last-child {
          border-bottom: none;
        }
        
        .time-slot span:first-child {
          font-weight: 500;
          color: #333;
        }
        
        .time-slot span:last-child {
          color: #a92b21;
          font-weight: 600;
        }
        
        .social-links {
          display: flex;
          gap: 16px;
          background: white;
          padding: 24px;
          border-radius: 12px;
          border-right: 4px solid #a92b21;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        
        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: #f8f9fa;
          border-radius: 8px;
          color: #a92b21;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        
        .social-link:hover {
          background: #a92b21;
          color: white;
          transform: translateY(-2px);
        }
        
        .form-map-section {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }
        
        .form-section {
          background: white;
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .form-description {
          color: #666;
          line-height: 1.6;
          margin-bottom: 24px;
          text-align: center;
          font-size: 1rem;
          background: #f8f9fa;
          padding: 16px;
          border-radius: 8px;
          border-right: 3px solid #a92b21;
        }
        
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        
        @media (max-width: 480px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
        }
        
        .form-group label {
          font-weight: 500;
          color: #333;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }
        
        .form-group input,
        .form-group textarea {
          padding: 12px 16px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
          font-family: inherit;
        }
        
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #a92b21;
          box-shadow: 0 0 0 3px rgba(169, 43, 33, 0.1);
        }
        
        .form-group textarea {
          resize: vertical;
          min-height: 120px;
        }
        
        .submit-btn {
          background: linear-gradient(135deg, #a92b21 0%, #d32f2f 100%);
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 8px;
        }
        
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(169, 43, 33, 0.3);
        }
        
        .map-section {
          background: white;
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .map-container {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          position: relative;
        }
        
        .map-wrapper {
          position: relative;
          height: 400px;
          overflow: hidden;
          border-radius: 12px;
        }
        
        .fixed-area-highlight {
          position: absolute;
          top: 55%;
          left: 48%;
          width: 120px;
          height: 80px;
          transform: translate(-50%, -50%);
          z-index: 1000;
          pointer-events: none;
        }
        
        .highlight-border {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 3px solid #d32f2f;
          border-radius: 8px;
          animation: borderPulse 2s infinite;
          box-shadow: 0 0 0 2px rgba(255,255,255,0.8);
        }
        
        .highlight-fill {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(211, 47, 47, 0.15);
          border-radius: 8px;
          animation: fillPulse 3s infinite;
        }
        
        .highlight-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 8px;
          height: 8px;
          background: #d32f2f;
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(211, 47, 47, 0.8);
        }
        
        .area-label {
          position: absolute;
          top: -70px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          padding: 10px 14px;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.25);
          text-align: center;
          min-width: 180px;
          z-index: 1001;
          border-right: 4px solid #d32f2f;
          border-bottom: 2px solid #f5f5f5;
        }
        
        .area-label::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 10px solid white;
        }
        
        .area-label strong {
          color: #d32f2f;
          display: block;
          margin-bottom: 4px;
          font-size: 14px;
        }
        
        .area-label span {
          color: #666;
          font-size: 12px;
          display: block;
        }
        
        @keyframes borderPulse {
          0%, 100% {
            border-color: #d32f2f;
            box-shadow: 0 0 0 2px rgba(255,255,255,0.8);
          }
          50% {
            border-color: #ff5252;
            box-shadow: 0 0 0 3px rgba(255,255,255,0.9);
          }
        }
        
        @keyframes fillPulse {
          0%, 100% {
            background: rgba(211, 47, 47, 0.15);
          }
          50% {
            background: rgba(211, 47, 47, 0.25);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          .contact-hero {
            padding: 60px 20px;
          }
          
          .hero-title {
            font-size: 2rem;
          }
          
          .contact-container {
            padding: 40px 15px;
          }
          
          .contact-item {
            flex-direction: column;
            text-align: center;
          }
          
          .contact-icon {
            margin-left: 0;
            margin-bottom: 12px;
          }
          
          .form-section,
          .map-section {
            padding: 24px 20px;
          }
          
          .fixed-area-highlight {
            top: 50%;
            left: 45%;
            width: 100px;
            height: 60px;
          }
          
          .area-label {
            min-width: 150px;
            font-size: 12px;
            top: -60px;
          }
        }
      `}</style>
    </div>
  )
}

Contact.propTypes = {}

export default Contact