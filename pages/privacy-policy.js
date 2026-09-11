import { useState } from 'react';

export default function PrivacyPolicy() {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => setLanguage(language === 'en' ? 'fa' : 'en');

  const Section = ({ title, children }) => (
    <>
      <hr style={{ borderTop: '1px solid #92231b', margin: '2rem 2rem', opacity: 0.6 }} />
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-black font-peyda">{title}</h2>
        <div className="text-gray-700 leading-relaxed">{children}</div>
      </section>
    </>
  );

  const persianPolicy = (
    <div className="text-right" style={{ direction: 'rtl' }}>
      <h1 className="text-3xl font-bold mb-4 text-gray-900">سیاست حفظ حریم خصوصی</h1>
      <p className="mb-6"><strong>تاریخ اجرا:</strong> ۱۴۰۳/۱۰/۸</p>

      <Section title="۱. اطلاعاتی که جمع‌آوری می‌کنیم">
        <ul className="list-disc pr-6 space-y-1">
          <li><strong>نام:</strong> اگر در زمان ثبت‌نام ارائه شود.</li>
          <li><strong>شهر:</strong> اگر توسط کاربر انتخاب شود.</li>
          <li><strong>شماره تلفن:</strong> هنگام ورود کاربر.</li>
          <li><strong>بازدیدهای اخیر:</strong> برای شخصی‌سازی تجربه.</li>
          <li><strong>ملک‌های مورد علاقه:</strong> هنگامی که کاربران روی دکمه قلب کلیک می‌کنند.</li>
        </ul>
      </Section>

      <Section title="۲. چگونه از اطلاعات شما استفاده می‌کنیم؟">
        <ul className="list-disc pr-6 space-y-1">
          <li>برای شخصی‌سازی تجربه شما.</li>
          <li>برای دسترسی به حساب کاربری و املاک مورد علاقه.</li>
          <li>برای بهبود خدمات.</li>
          <li>برای تماس در صورت نیاز.</li>
        </ul>
      </Section>

      <Section title="۳. کوکی‌ها و ردیابی">
        <ul className="list-disc pr-6 space-y-1">
          <li>ذخیره بازدیدهای اخیر.</li>
          <li>حفظ اطلاعات ورود.</li>
        </ul>
      </Section>

      <Section title="۴. اشتراک‌گذاری اطلاعات">
        <p>ما اطلاعات شما را نمی‌فروشیم یا اجاره نمی‌دهیم، مگر:</p>
        <ul className="list-disc pr-6 space-y-1 mt-2">
          <li>زمانی که قانون نیاز داشته باشد.</li>
          <li>از طریق همکاران مورد اعتماد برای خدمات ضروری.</li>
        </ul>
      </Section>

      <Section title="۵. حقوق کاربران">
        <ul className="list-disc pr-6 space-y-1">
          <li>درخواست دسترسی به اطلاعات.</li>
          <li>درخواست حذف حساب.</li>
          <li>به‌روزرسانی اطلاعات شخصی.</li>
        </ul>
      </Section>

      <Section title="۶. امنیت اطلاعات">
        <p>ما اقدامات لازم را برای حفاظت از داده‌های شما انجام می‌دهیم، اما هیچ سیستمی کاملاً امن نیست.</p>
      </Section>

      <Section title="۷. تغییرات این سیاست">
        <p>تغییرات در این صفحه با تاریخ جدید اطلاع‌رسانی می‌شود.</p>
      </Section>

      <Section title="۸. تماس با ما">
        <ul className="list-disc pr-6 space-y-1">
          <li><strong>ایمیل:</strong> support@ajur.app</li>
          <li><strong>تلفن:</strong> +989382740488</li>
        </ul>
      </Section>
    </div>
  );

  const englishPolicy = (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Privacy Policy</h1>
      <p className="mb-6"><strong>Effective Date:</strong> 12/28/2024</p>

      <Section title="1. Information We Collect">
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Name:</strong> If provided during registration.</li>
          <li><strong>City:</strong> When selected by the user.</li>
          <li><strong>Phone Number:</strong> Used for login.</li>
          <li><strong>Latest Property Visits:</strong> For personalization.</li>
          <li><strong>Favorited Properties:</strong> When the heart button is clicked.</li>
        </ul>
      </Section>

      <Section title="2. How We Use Your Information">
        <ul className="list-disc pl-6 space-y-1">
          <li>To personalize your experience.</li>
          <li>To access your account and favorites.</li>
          <li>To improve our services.</li>
          <li>To contact you when needed.</li>
        </ul>
      </Section>

      <Section title="3. Cookies & Tracking">
        <ul className="list-disc pl-6 space-y-1">
          <li>Save recent property visits.</li>
          <li>Maintain login session.</li>
        </ul>
      </Section>

      <Section title="4. Data Sharing">
        <p>We do not sell or share your data except:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>When required by law.</li>
          <li>Through trusted partners for essential services.</li>
        </ul>
      </Section>

      <Section title="5. User Rights">
        <ul className="list-disc pl-6 space-y-1">
          <li>Request access to data.</li>
          <li>Delete account and data.</li>
          <li>Update personal information.</li>
        </ul>
      </Section>

      <Section title="6. Security of Your Data">
        <p>We take steps to protect your information, but no system is 100% secure.</p>
      </Section>

      <Section title="7. Changes to Policy">
        <p>Updates will be posted with a revised effective date.</p>
      </Section>

      <Section title="8. Contact Us">
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Email:</strong> support@ajur.app</li>
          <li><strong>Phone:</strong> +989382740488</li>
        </ul>
      </Section>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-6">
      <button
        onClick={toggleLanguage}
        style={{
          marginBottom: '1.5rem',
          padding: '0.5rem 1.5rem',
          border: '2px solid #a92b21',
          color: '#a92b21',
          fontWeight: '600',
          borderRadius: '0.75rem',
          transition: '0.3s',
          background: 'white'
        }}
        onMouseOver={(e) => {
          e.target.style.background = '#a92b21';
          e.target.style.color = 'white';
        }}
        onMouseOut={(e) => {
          e.target.style.background = 'white';
          e.target.style.color = '#a92b21';
        }}
      >
        {language === 'en' ? 'Switch to Persian' : 'تغییر به انگلیسی'}
      </button>

      {language === 'en' ? englishPolicy : persianPolicy}
    </div>
  );
}