import React, { useState } from 'react';
import Head from "next/head";
import Script from "next/script";

const About = () => {
  const [language, setLanguage] = useState('persian');

  const pageUrl = "https://ajur.app/employees/arash-peymanifar";
  const imageUrl = "https://ajur.app/img/arash.jpg";

  const translations = {
    persian: {
      headerAbout: 'آرش پیمانی فر',
      aboutText:
        'آرش پیمانی فر بنیانگذار پلتفرم آجر (Ajur) و از فعالان حوزه فناوری و خدمات آنلاین در ایران است. او با هدف ساده‌تر کردن معاملات املاک و ایجاد ارتباط مستقیم میان کاربران و مشاوران املاک، پلتفرم آجر را طراحی و توسعه داد.',
      historyHeader: 'نحوه شکل‌گیری آجر',
      historyText:
        'ایده پلتفرم آجر در سال ۱۴۰۰ توسط آرش پیمانی فر شکل گرفت. هدف از ایجاد این پلتفرم، ایجاد یک بستر دیجیتال برای جستجو، معرفی و مدیریت املاک در سراسر ایران بود.',
      teamNames: 'بنیانگذار پلتفرم آجر',
      footerText: 'تمام حقوق محفوظ است © Ajur'
    },

    english: {
      headerAbout: 'Arash Peymanifar',
      aboutText:
        'Arash Peymanifar is the founder of the Ajur platform focused on digital real estate services in Iran.',
      historyHeader: 'How Ajur Was Created',
      historyText:
        'Ajur was created in 2021 by Arash Peymanifar to modernize real estate services using technology.',
      teamNames: 'Founder of Ajur Platform',
      footerText: 'All rights reserved © Ajur'
    },

    arabic: {
      headerAbout: 'آرش بيماني فر',
      aboutText:
        'آرش بيماني فر هو مؤسس منصة آجر الرقمية المتخصصة في خدمات العقارات.',
      historyHeader: 'كيف تم إنشاء آجر',
      historyText:
        'تم تطوير فكرة منصة آجر في عام 2021.',
      teamNames: 'مؤسس منصة آجر',
      footerText: 'جميع الحقوق محفوظة © Ajur'
    },

    french: {
      headerAbout: 'Arash Peymanifar',
      aboutText:
        'Arash Peymanifar est le fondateur de la plateforme Ajur.',
      historyHeader: 'Création de Ajur',
      historyText:
        'La plateforme Ajur a été créée en 2021.',
      teamNames: 'Fondateur de la plateforme Ajur',
      footerText: 'Tous droits réservés © Ajur'
    },

    chinese: {
      headerAbout: 'Arash Peymanifar',
      aboutText:
        'Arash Peymanifar 是 Ajur 房地产平台的创始人。',
      historyHeader: 'Ajur 的创建',
      historyText:
        'Ajur 平台于 2021 年创建。',
      teamNames: 'Ajur 平台创始人',
      footerText: '版权所有 © Ajur'
    }
  };

  const t = translations[language];

  const getTextAlignment = () => {
    if (language === 'english' || language === 'french') return 'left';
    return 'right';
  };

  const getDirection = () => {
    if (language === 'english' || language === 'french') return 'ltr';
    return 'rtl';
  };

  return (
    <>
      <Head>

        <title>آرش پیمانی فر | بنیانگذار آجر | Arash Peymanifar</title>

        <meta
          name="description"
          content="آرش پیمانی فر بنیانگذار پلتفرم آجر (Ajur) است. در این صفحه با سوابق، فعالیت‌ها و نقش او در ایجاد و توسعه پلتفرم آجر آشنا شوید."
        />

        <meta name="keywords" content="آرش پیمانی فر, Arash Peymanifar, بنیانگذار آجر, Ajur founder" />

        <meta name="author" content="آرش پیمانی فر" />

        <meta property="og:locale" content="fa_IR" />

        <link rel="canonical" href={pageUrl} />

        <meta property="og:title" content="آرش پیمانی فر | بنیانگذار آجر" />
        <meta property="og:description" content="صفحه رسمی آرش پیمانی فر بنیانگذار پلتفرم آجر" />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="profile" />

      </Head>

      {/* PERSON SCHEMA */}

      <Script id="person-schema" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "آرش پیمانی فر",
          alternateName: "Arash Peymanifar",
          url: pageUrl,
          image: imageUrl,
          jobTitle: "Founder",
          worksFor: {
            "@type": "Organization",
            name: "Ajur",
            url: "https://ajur.app"
          },
          sameAs: [
            "https://www.linkedin.com/"
          ]
        })}
      </Script>

      {/* PROFILE PAGE SCHEMA */}

      <Script id="profile-schema" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          mainEntity: {
            "@type": "Person",
            name: "آرش پیمانی فر",
            alternateName: "Arash Peymanifar",
            image: imageUrl,
            jobTitle: "Founder",
            worksFor: {
              "@type": "Organization",
              name: "Ajur",
              url: "https://ajur.app"
            }
          },
          inLanguage: "fa"
        })}
      </Script>

      {/* IMAGE OBJECT SCHEMA */}

      <Script id="image-schema" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ImageObject",
          contentUrl: imageUrl,
          creator: {
            "@type": "Person",
            name: "آرش پیمانی فر"
          },
          creditText: "Arash Peymanifar",
          copyrightNotice: "Ajur"
        })}
      </Script>

      <div style={styles.container}>
        <div style={styles.contentContainer}>

          <div style={styles.headerSection}>
            <div style={styles.logoLanguageRow}>
              <div style={styles.logoContainer}>
                <img
                  src="/logo/ajur.png"
                  alt="Ajur Logo"
                  style={styles.mainLogo}
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
                      {lang === 'persian' ? 'فارسی' :
                        lang === 'english' ? 'English' :
                        lang === 'arabic' ? 'العربية' :
                        lang === 'french' ? 'Français' : '中文'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

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

          <div style={styles.section}>
            <div style={styles.partnersContainer}>
              <div style={styles.imageWrapper}>
                <img
                  src="/img/arash.jpg"
                  alt="آرش پیمانی فر بنیانگذار پلتفرم آجر Ajur Founder Arash Peymanifar"
                  style={styles.partnersImage}
                />
              </div>

              <p style={{...styles.teamNames, direction: getDirection(), textAlign: getTextAlignment()}}>
                {t.teamNames}
              </p>
            </div>
          </div>

          <div style={styles.footer}>
            <div style={styles.footerContent}>
              <div style={styles.footerLogoContainer}>
                <img
                  src="/logo/ajur.png"
                  alt="Ajur Logo"
                  style={styles.footerLogo}
                />
              </div>

              <p style={{...styles.footerText, direction: getDirection(), textAlign: getTextAlignment()}}>
                {t.footerText}
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

const styles = {
container:{backgroundColor:'#f8f9fa',minHeight:'100vh',fontFamily:"'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"},
contentContainer:{padding:'28px 24px',maxWidth:'1000px',margin:'0 auto'},
headerSection:{marginBottom:'36px'},
logoLanguageRow:{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'20px',flexWrap:'wrap'},
logoContainer:{display:'flex',alignItems:'center',gap:'18px'},
mainLogo:{width:'70px',height:'70px',objectFit:'contain',borderRadius:'10px'},
logoText:{display:'flex',flexDirection:'column'},
logoTitle:{fontSize:'30px',fontWeight:'bold',color:'#a92b21'},
logoSubtitle:{fontSize:'17px',color:'#6c757d'},
languageContainer:{display:'flex',justifyContent:'flex-end'},
languageContentContainer:{display:'flex',gap:'8px',flexWrap:'wrap'},
languageButton:{padding:'10px 18px',borderRadius:'20px',background:'#e9ecef',border:'none',cursor:'pointer'},
activeLanguage:{background:'#a92b21',color:'#fff'},
section:{marginBottom:'36px'},
headerAbout:{fontSize:'30px',color:'#2c3e50',marginBottom:'20px',fontWeight:'700'},
historyHeader:{fontSize:'26px',color:'#2c3e50',marginBottom:'20px'},
textContainer:{background:'#fff',padding:'28px',borderRadius:'12px'},
aboutText:{fontSize:'18px',color:'#555',lineHeight:'1.8'},
historyText:{fontSize:'18px',color:'#555',lineHeight:'1.8'},
partnersContainer:{background:'#fff',padding:'28px',borderRadius:'12px'},
imageWrapper:{borderRadius:'10px',overflow:'hidden',marginBottom:'20px'},
partnersImage:{width:'100%',height:'550px',objectFit:'cover',objectPosition:'top center'},
teamNames:{fontSize:'20px',fontWeight:'600'},
footer:{marginTop:'36px',paddingTop:'24px',borderTop:'1px solid #e9ecef'},
footerContent:{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap'},
footerLogo:{width:'50px',height:'50px',objectFit:'contain'},
footerText:{fontSize:'16px',color:'#6c757d'}
};

export default About;
