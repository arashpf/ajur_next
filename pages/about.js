import React, { useState } from 'react';

const About = () => {
  const [language, setLanguage] = useState('persian');

  // Translations
  const translations = {
    persian: {
      headerAbout: 'آجر از گروه نرم‌افزارهای آرمن',
      aboutText: 'آجر یک اپلیکیشن و فعال مجازی در زمینه خدمات املاک در سرتاسر ایران است. ما میکوشیم با فراهم کردن بستری مناسب، معاملات ملک در کشورمان را متحول کنیم و هر روز خدمات جدیدی به پلتفرم خود اضافه نماییم.',
      historyHeader: 'نحوه شکل‌گیری آجر',
      historyText: 'آجر در سال ۱۴۰۰ توسط آرش پیمانی‌فر ایده‌پردازی و اجرا شد. با همکاری، ایده‌پردازی و شراکت علی محمدی و علیرضا دهقان در سال ۱۴۰۲، توسعه آجر رشد چشم‌گیری را تجربه کرد. اولین معاملات ملکی آجر شکل گرفت و بیش از ۵۰۰ مشاور املاک حرفه‌ای شروع به همکاری با آجر کردند. در سال ۱۴۰۳ اپلیکیشن آجر در مارکت‌های رسمی منتشر شد و امکانات زیادی مثل تور مجازی، سیستم یکپارچه مشاورین، نقشه قدرتمند و تعاملی، تبلیغات اختصاصی برای مشاورین و امکانات دیگری توسعه داده شد.',
      teamNames: 'آرش پیمانی‌فر، علی محمدی و علیرضا دهقان',
      footerText: 'نسخه 12.0.0 - تمام حقوق محفوظ است © 1404'
    },
    english: {
      headerAbout: 'Ajur from Arman Software Group',
      aboutText: 'Ajur is a leading virtual application in real estate services across Iran. We strive to transform property transactions in our country by providing a suitable platform and adding new services to our platform every day.',
      historyHeader: 'How Ajur Was Formed',
      historyText: 'Ajur was conceived and implemented by Arsh Peymani in 2021. With the collaboration, ideation, and partnership of Ali Mohammadi and Alireza Dehghan in 2023, Ajur experienced significant growth. The first real estate transactions took place on Ajur, and over 500 professional real estate consultants began working with Ajur. In 2024, the Ajur app was officially released in markets with many features such as virtual tours, an integrated consultant system, a powerful interactive map, exclusive advertising for consultants, and other features developed.',
      teamNames: 'Arsh Peymani, Ali Mohammadi and Alireza Dehghan',
      footerText: 'Version 12.0.0 - All rights reserved © 2025'
    },
    arabic: {
      headerAbout: 'آجر من مجموعة أرمين للبرمجيات',
      aboutText: 'آجر هو تطبيق افتراضي رائد في خدمات العقارات في جميع أنحاء إيران. نحن نسعى جاهدين لتحويل المعاملات العقارية في بلدنا من خلال توفير منصة مناسبة وإضافة خدمات جديدة إلى منصتنا كل يوم.',
      historyHeader: 'كيف تم تشكيل آجر',
      historyText: 'تم تصور آجر وتنفيذه من قبل آرش بيماني في عام 2021. مع التعاون ووضع الأفكار والشراكة مع علي محمدي وعليرضا دهقان في عام 2023، شهد آجر نموًا كبيرًا. تمت أولى المعاملات العقارية على آجر، وبدأ أكثر من 500 مستشار عقاري محترف العمل مع آجر. في عام 2024، تم إطلاق تطبيق آجر رسميًا في الأسواق مع العديد من الميزات مثل الجولات الافتراضية، ونظام استشاري متكامل، وخريطة تفاعلية قوية، وإعلانات حصرية للمستشارين، وميزات أخرى تم تطويرها.',
      teamNames: 'آرش بيماني، علي محمدي وعليرضا دهقان',
      footerText: 'الإصدار 12.0.0 - جميع الحقوق محفوظة © 2025'
    },
    french: {
      headerAbout: 'Ajur du groupe Arman Software',
      aboutText: 'Ajur est une application virtuelle leader dans les services immobiliers à travers l\'Iran. Nous nous efforçons de transformer les transactions immobilières dans notre pays en fournissant une plateforme adaptée et en ajoutant de nouveaux services à notre plateforme chaque jour.',
      historyHeader: 'Comment Ajur a été créé',
      historyText: 'Ajur a été conçu et mis en œuvre par Arsh Peymani en 2021. Avec la collaboration, l\'idéation et le partenariat d\'Ali Mohammadi et Alireza Dehghan en 2023, Ajur a connu une croissance significative. Les premières transactions immobilières ont eu lieu sur Ajur, et plus de 500 consultants immobiliers professionnels ont commencé à travailler avec Ajur. En 2024, l\'application Ajur a été officiellement lancée sur les marchés avec de nombreuses fonctionnalités telles que des visites virtuelles, un système intégré de consultants, une carte interactive puissante, de la publicité exclusive pour les consultants et d\'autres fonctionnalités développées.',
      teamNames: 'Arsh Peymani, Ali Mohammadi et Alireza Dehghan',
      footerText: 'Version 12.0.0 - Tous droits réservés © 2025'
    },
    chinese: {
      headerAbout: 'Ajur 来自 Arman 软件集团',
      aboutText: 'Ajur 是伊朗领先的虚拟房地产服务应用程序。我们致力于通过提供合适的平台并每天向我们的平台添加新服务来改变我们国家的房地产交易。',
      historyHeader: 'Ajur 的形成方式',
      historyText: 'Ajur 由 Arsh Peymani 于 2021 年构思并实施。随着 Ali Mohammadi 和 Alireza Dehghan 在 2023 年的合作、构思和伙伴关系，Ajur 经历了显著增长。第一批房地产交易在 Ajur 上完成，超过 500 名专业房地产顾问开始与 Ajur 合作。2024 年，Ajur 应用程序正式发布，具有许多功能，如虚拟看房、集成顾问系统、强大的交互式地图、顾问专属广告以及其他开发的功能。',
      teamNames: 'Arsh Peymani, Ali Mohammadi 和 Alireza Dehghan',
      footerText: '版本 12.0.0 - 版权所有 © 2025'
    }
  };

  const t = translations[language];

  const getTextAlignment = () => {
    if (language === 'english' || language === 'french') {
      return 'left';
    }
    return 'right';
  };

  const getDirection = () => {
    if (language === 'english' || language === 'french') {
      return 'ltr';
    }
    return 'rtl';
  };

  return (
    <div style={styles.container}>
      <div style={styles.contentContainer}>
        
        {/* هدر با لوگو و انتخابگر زبان */}
        <div style={styles.headerSection}>
          <div style={styles.logoLanguageRow}>
            <div style={styles.logoContainer}>
              <img
                src="\logo\ajur.png"
              
                alt="/logo/ajur.png"
                style={styles.mainLogo}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjQTkyQjIxIiByeD0iOCIvPgo8dGV4dCB4PSI0MCIgeT0iNDUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFqdXI8L3RleHQ+Cjwvc3ZnPgo=";
                }}
              />
              <div style={styles.logoText}>
                <span style={styles.logoTitle}>Ajur</span>
                <span style={styles.logoSubtitle}>Real Estate</span>
              </div>
            </div>
            
            <div style={styles.languageContainer}>
              <div style={styles.languageContentContainer}>
                {Object.keys(translations).map((lang) => (
                  <button 
                    key={lang}
                    style={{
                      ...styles.languageButton, 
                      ...(language === lang ? styles.activeLanguage : {})
                    }}
                    onClick={() => setLanguage(lang)}
                  >
                    <span style={styles.languageText}>
                      {lang === 'persian' ? 'فارسی' : 
                       lang === 'english' ? 'English' : 
                       lang === 'arabic' ? 'العربية' : 
                       lang === 'french' ? 'Français' : '中文'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* بخش درباره ما */}
        <div style={styles.section}>
          <h1 style={{...styles.headerAbout, direction: getDirection(), textAlign: getTextAlignment()}}>
            {t.headerAbout}
          </h1>
          <div style={styles.textContainer}>
            <p style={{...styles.aboutText, direction: getDirection(), textAlign: getTextAlignment()}}>
              {t.aboutText}
            </p>
          </div>
        </div>

        {/* بخش تاریخچه */}
        <div style={styles.section}>
          <h2 style={{...styles.historyHeader, direction: getDirection(), textAlign: getTextAlignment()}}>
            {t.historyHeader}
          </h2>
          <div style={styles.textContainer}>
            <p style={{...styles.historyText, direction: getDirection(), textAlign: getTextAlignment()}}>
              {t.historyText}
            </p>
          </div>
        </div>

        {/* بخش شرکا */}
        <div style={styles.section}>
          <div style={styles.partnersContainer}>
            <div style={styles.imageWrapper}>
              <img 
                src="/img/about.jpg" 
                alt="Partners"
                style={styles.partnersImage}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjhGOUZBIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2Qzc1N0QiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlBhcnRuZXJzIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";
                }}
              />
            </div>
            <p style={{...styles.teamNames, direction: getDirection(), textAlign: getTextAlignment()}}>
              {t.teamNames}
            </p>
          </div>
        </div>

        {/* فوتر */}
        <div style={styles.footer}>
          <div style={styles.footerContent}>
            <div style={styles.footerLogoContainer}>
              <img
                src="/logo/ajur.png"
                alt="Ajur Logo"
                style={styles.footerLogo}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjQTkyQjIxIiByeD0iNiIvPgo8dGV4dCB4PSIzMCIgeT0iMzUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFqdXI8L3RleHQ+Cjwvc3ZnPgo=";
                }}
              />
            </div>
            <p style={{...styles.footerText, direction: getDirection(), textAlign: getTextAlignment()}}>
              {t.footerText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '0',
  },
  contentContainer: {
    padding: '28px 24px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  headerSection: {
    marginBottom: '36px',
  },
  logoLanguageRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
    marginBottom: '8px',
    flexWrap: 'wrap',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    flexShrink: 0,
  },
  mainLogo: {
    width: '70px',
    height: '70px',
    objectFit: 'contain',
    borderRadius: '10px',
    boxShadow: '0 3px 10px rgba(0,0,0,0.12)',
  },
  logoText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  logoTitle: {
    fontSize: '30px', // بزرگتر شده
    fontWeight: 'bold',
    color: '#a92b21',
    fontFamily: "'Avenir', 'Tahoma', sans-serif",
    lineHeight: '1.2',
  },
  logoSubtitle: {
    fontSize: '17px', // بزرگتر شده
    color: '#6c757d',
    fontWeight: '500',
  },
  languageContainer: {
    flex: '1',
    minWidth: '220px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  languageContentContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'flex-end',
  },
  languageButton: {
    padding: '10px 18px', // بزرگتر شده
    borderRadius: '20px',
    backgroundColor: '#e9ecef',
    border: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    fontSize: '16px', // بزرگتر شده
  },
  activeLanguage: {
    backgroundColor: '#a92b21',
    color: 'white',
    boxShadow: '0 3px 8px rgba(169, 43, 33, 0.4)',
  },
  languageText: {
    fontSize: '16px', // بزرگتر شده
    fontWeight: '500',
  },
  section: {
    marginBottom: '36px',
  },
  headerAbout: {
    fontSize: '30px', // بزرگتر شده
    color: '#2c3e50',
    marginBottom: '20px',
    fontWeight: '700',
    lineHeight: '1.4',
  },
  historyHeader: {
    fontSize: '26px', // بزرگتر شده
    color: '#2c3e50',
    marginBottom: '20px',
    fontWeight: '600',
  },
  textContainer: {
    backgroundColor: 'white',
    padding: '28px',
    borderRadius: '12px',
    boxShadow: '0 3px 12px rgba(0,0,0,0.08)',
    border: '1px solid #f1f3f4',
  },
  aboutText: {
    fontSize: '18px', // بزرگتر شده
    color: '#555',
    lineHeight: '1.8',
    margin: 0,
    fontWeight: '400',
  },
  historyText: {
    fontSize: '18px', // بزرگتر شده
    color: '#555',
    lineHeight: '1.8',
    margin: 0,
    fontWeight: '400',
  },
  partnersContainer: {
    backgroundColor: 'white',
    padding: '28px',
    borderRadius: '12px',
    boxShadow: '0 3px 12px rgba(0,0,0,0.08)',
    border: '1px solid #f1f3f4',
  },
  imageWrapper: {
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '20px',
    boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
  },
  partnersImage: {
    width: '100%',
    maxWidth: '100%',
    height: '550px',
    objectFit: 'cover',
    display: 'block',
  },
  teamNames: {
    fontSize: '20px', // بزرگتر شده
    color: '#2c3e50',
    lineHeight: '1.6',
    margin: 0,
    fontWeight: '600',
  },
  footer: {
    marginTop: '36px',
    paddingTop: '24px',
    borderTop: '1px solid #e9ecef',
  },
  footerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '18px',
    flexWrap: 'wrap',
  },
  footerLogoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  footerLogo: {
    width: '50px',
    height: '50px',
    objectFit: 'contain',
  },
  footerText: {
    fontSize: '16px', // بزرگتر شده
    color: '#6c757d',
    margin: 0,
    fontWeight: '500',
  },
};

export default About;