import { useState } from 'react';

const PrivacyPolicy = () => {
  const [language, setLanguage] = useState('en'); // Default language is English

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fa' : 'en');
  };

  // Persian Privacy Policy Text
  const persianPolicy = (
    <div style={{textAlign:'right',direction:'rtl'}}>
      <h1>سیاست حفظ حریم خصوصی</h1>
      <p><strong>تاریخ اجرا:</strong> ۱۴۰۳/۱۰/۸</p>
      <p>
        ما در Ajur.app به حریم خصوصی شما اهمیت می‌دهیم. این سند توضیح می‌دهد که چگونه اطلاعات شما
        جمع‌آوری، استفاده و محافظت می‌شود.
      </p>
      <h2>۱. اطلاعاتی که جمع‌آوری می‌کنیم</h2>
      <ul>
        <li><strong>نام:</strong> اگر در زمان ثبت‌نام ارائه شود.</li>
        <li><strong>شهر:</strong> اگر توسط کاربر انتخاب شود.</li>
        <li><strong>شماره تلفن:</strong> زمانی که کاربران وارد حساب کاربری خود می‌شوند.</li>
        <li><strong>بازدیدهای اخیر:</strong> برای شخصی‌سازی تجربه شما در وبسایت.</li>
        <li><strong>ملک‌های مورد علاقه:</strong> زمانی که کاربران روی دکمه قلب کلیک می‌کنند.</li>
      </ul>
      <h2>۲. چگونه از اطلاعات شما استفاده می‌کنیم؟</h2>
      <ul>
        <li>برای شخصی‌سازی تجربه شما در Ajur.app.</li>
        <li>برای دسترسی به حساب کاربری و املاک مورد علاقه شما.</li>
        <li>برای بهبود خدمات و پیشنهادها.</li>
        <li>برای تماس در صورت لزوم (مانند حساب کاربری یا سوالات).</li>
      </ul>
      <h2>۳. کوکی‌ها و ردیابی</h2>
      <ul>
        <li>ذخیره اطلاعات بازدیدهای اخیر شما.</li>
        <li>حفظ اطلاعات ورود کاربران به حساب کاربری.</li>
      </ul>
      <h2>۴. اشتراک‌گذاری اطلاعات</h2>
      <p>
        ما اطلاعات شخصی شما را به اشخاص ثالث نمی‌فروشیم یا اجاره نمی‌دهیم، مگر:
      </p>
      <ul>
        <li>زمانی که قانون نیاز داشته باشد.</li>
        <li>برای ارائه خدمات ضروری از طریق همکاران مورد اعتماد.</li>
      </ul>
      <h2>۵. حقوق کاربران</h2>
      <ul>
        <li>درخواست دسترسی به اطلاعات خود.</li>
        <li>درخواست حذف حساب کاربری و اطلاعات مربوطه.</li>
        <li>به‌روزرسانی یا تصحیح اطلاعات شخصی.</li>
      </ul>
      <h2>۶. امنیت اطلاعات شما</h2>
      <p>
        ما اقدامات مناسب برای امنیت اطلاعات شما انجام می‌دهیم. با این حال، هیچ سیستمی کاملاً امن نیست و ما نمی‌توانیم امنیت کامل را تضمین کنیم.
      </p>
      <h2>۷. تغییرات در سیاست حفظ حریم خصوصی</h2>
      <p>
        ممکن است این سیاست را گاهی به‌روزرسانی کنیم. هر تغییری در این صفحه با تاریخ جدید اعمال می‌شود.
      </p>
      <h2>۸. تماس با ما</h2>
      <ul>
        <li><strong>ایمیل:</strong> support@ajur.app </li>
        <li><strong>تلفن:</strong> +989382740488 </li>
      </ul>
    </div>
  );

  // English Privacy Policy Text
  const englishPolicy = (
    <div style={{fontFamily: 'serif', fontFeatureSettings: '"tnum" 1'}}>
      <h1>Privacy Policy</h1>
      <p><strong>Effective Date:</strong>12/28/2024</p>
      <p>
        At Ajur.app, your privacy is important to us. This Privacy Policy explains how we collect,
        use, and protect your information when you use our platform.
      </p>
      <h2 style={{ fontFamily: 'Arial, sans-serif' }}>1. Information We Collect</h2>
      <ul>
        <li><strong>Name:</strong> If provided during registration or account setup.</li>
        <li><strong>City:</strong> If selected by the user.</li>
        <li><strong>Phone Number:</strong> When users log in to their account.</li>
        <li><strong>Latest Property Visits:</strong> To personalize your experience by showing recently viewed properties.</li>
        <li><strong>Favorited Properties:</strong> When users click the heart button on a property.</li>
      </ul>
      <h2 style={{ fontFamily: 'Arial, sans-serif' }}>2. How We Use Your Information</h2>
      <ul>
        <li>To personalize your experience on Ajur.app.</li>
        <li>To provide access to your account and favorite properties.</li>
        <li>To improve our services and recommendations.</li>
        <li>To contact you if needed (e.g., regarding your account or inquiries).</li>
      </ul>
      <h2 style={{ fontFamily: 'Arial, sans-serif' }}>3. Cookies and Tracking</h2>
      <ul>
        <li>Store information about your latest property visits.</li>
        <li>Maintain session information for logged-in users.</li>
      </ul>
      <h2 style={{ fontFamily: 'Arial, sans-serif' }}>4. Data Sharing</h2>
      <p>
        We do <strong>not</strong> sell, rent, or share your personal information with third parties, except:
      </p>
      <ul>
        <li>When required by law.</li>
        <li>To provide essential services through trusted partners (e.g., hosting, analytics).</li>
      </ul>
      <h2 style={{ fontFamily: 'Arial, sans-serif' }}>5. User Rights</h2>
      <ul>
        <li>Access the information we store about you.</li>
        <li>Request the deletion of your account and associated data.</li>
        <li>Update or correct your personal information.</li>
      </ul>
      <h2 style={{ fontFamily: 'Arial, sans-serif' }}>6. Security of Your Information</h2>
      <p>
        We take appropriate measures to secure your data against unauthorized access, alteration, or deletion. However, no system is entirely secure, and we cannot guarantee absolute protection.
      </p>
      <h2 style={{ fontFamily: 'Arial, sans-serif' }}>7. Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.
      </p>
      <h2 style={{ fontFamily: 'Arial, sans-serif' }}>8. Contact Us</h2>
      <ul>
        <li><strong>Email:</strong>support@ajur.app</li>
        <li><strong>Phone:</strong> +989382740488</li>
      </ul>
    </div>
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
      <button 
        onClick={toggleLanguage} 
        style={{ 
          marginBottom: '20px', 
          padding: '10px 20px', 
          cursor: 'pointer', 
          border: '2px solid #007bff', 
          borderRadius: '5px', 
          backgroundColor: 'white', 
          color: '#007bff', 
          fontWeight: 'bold', 
          transition: 'all 0.3s ease' 
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = '#007bff';
          e.target.style.color = 'white';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = 'white';
          e.target.style.color = '#007bff';
        }}
      >
        {language === 'en' ? 'Switch to Persian' : 'تغییر به انگلیسی'}
      </button>
      {language === 'en' ? englishPolicy : persianPolicy}
    </div>
  );
};

export default PrivacyPolicy;
