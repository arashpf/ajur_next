import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import axios from "axios";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { getPersianCityName } from "../../../components/util/cityNames";

// TODO: fix this import path to match your project
import NeighborhoodCard from "../../../components/cards/neighborhood/NeighborhoodCard";

const CityNeighborhoodHub = ({ city, neighborhoods, error }) => {
  const persianCity = useMemo(() => getPersianCityName(city), [city]);

  const seoData = useMemo(() => {
    const pageTitle = `محله‌ های ${persianCity} | معرفی و راهنمای مناطق شهری | آجر`;
    const metaDescription = `لیست کامل محله‌ ها و مناطق مسکونی شهر ${persianCity}. جهت بررسی وضعیت دسترسی، خرید و اجاره مسکن در محله‌ های مختلف ${persianCity} وارد آجر شوید.`;
    const canonicalUrl = `https://ajur.app/neighborhoods/${city}`;
    return { pageTitle, metaDescription, canonicalUrl };
  }, [city, persianCity]);

  const structuredData = useMemo(() => {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "خانه", item: "https://ajur.app" },
        {
          "@type": "ListItem",
          position: 2,
          name: `محله‌ های ${persianCity}`,
          item: seoData.canonicalUrl,
        },
      ],
    };

    const itemCollectionSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `محله های ${persianCity}`,
      url: seoData.canonicalUrl,
      numberOfItems: neighborhoods.length,
      itemListElement: neighborhoods.map((item, index) => {
        const slug = item.eng_name || item.slug || item.id;
        return {
          "@type": "ListItem",
          position: index + 1,
          url: `https://ajur.app/neighborhoods/${city}/${slug}`,
          name: item.name || item.title,
        };
      }),
    };

    return { breadcrumbSchema, itemCollectionSchema };
  }, [neighborhoods, city, persianCity, seoData.canonicalUrl]);

  return (
    <>
      <Head>
        <title>{seoData.pageTitle}</title>
        <meta name="description" content={seoData.metaDescription} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={seoData.canonicalUrl} />
        <meta property="og:locale" content="fa_IR" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoData.pageTitle} />
        <meta property="og:description" content={seoData.metaDescription} />
        <meta property="og:url" content={seoData.canonicalUrl} />
        <meta property="og:image" content="https://api.ajur.app/logo/og-default.jpg" />
        <meta name="theme-color" content="#b92a31" />
      </Head>

      <Script
        id="jsonld-breadcrumb"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumbSchema) }}
      />
      <Script
        id="jsonld-collection"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.itemCollectionSchema) }}
      />

      <div style={{ direction: "rtl", margin: "20px", minHeight: "100vh" }}>
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs aria-label="breadcrumb" separator="›">
            <Link href="/" passHref legacyBehavior>
              <Box
                component="a"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "#666",
                  textDecoration: "none",
                  fontSize: "14px",
                }}
              >
                <HomeIcon sx={{ fontSize: "16px", ml: 0.5 }} />
                خانه
              </Box>
            </Link>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: "#b92a31",
                fontWeight: "700",
                fontSize: "14px",
              }}
            >
              <LocationOnIcon sx={{ fontSize: "16px", ml: 0.5 }} />
              محله‌ های {persianCity}
            </Box>
          </Breadcrumbs>
        </Box>

        <Box sx={{ textAlign: "center", my: 4 }}>
          <Box
            component="h1"
            sx={{
              fontSize: { xs: "22px", md: "28px" },
              fontWeight: 800,
              color: "#222",
              mb: 1,
            }}
          >
            محله‌ های {persianCity}
          </Box>
          <Box
            component="p"
            sx={{
              color: "#666",
              fontSize: "14px",
              maxWidth: "600px",
              mx: "auto",
              lineHeight: 1.8,
            }}
          >
            لیست محله‌ ها و مناطق مسکونی شهر {persianCity}. با کلیک روی هر محله، می‌ توانید به اطلاعات و آگهی‌ های خرید، فروش، رهن و اجاره ملک در آن منطقه دسترسی پیدا کنید.
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1, py: 2 }}>
          {error ? (
            <Box sx={{ textAlign: "center", py: 4, color: "#666" }}>
              خطایی در بارگذاری اطلاعات محله‌ها رخ داده است.
            </Box>
          ) : neighborhoods.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4, color: "#666" }}>
              هیچ محله‌ ای برای این شهر پیدا نشد.
            </Box>
          ) : (
            <Grid container spacing={3}>
              {neighborhoods.map((item) => {
                const slug = item.eng_name || item.slug || item.id;
                const detailUrl = `/neighborhoods/${city}/${slug}`;

                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={slug}>
                    <NeighborhoodCard neighborhood={item} href={detailUrl} />
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      </div>
    </>
  );
};

CityNeighborhoodHub.propTypes = {
  city: PropTypes.string.isRequired,
  neighborhoods: PropTypes.array.isRequired,
  error: PropTypes.bool.isRequired,
};

export async function getServerSideProps(context) {
  const { params, res } = context;
  const { city } = params;

  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");

  try {
    const baseRes = await axios.get(
      `https://api.ajur.app/api/base?city=${encodeURIComponent(city)}`,
      {
        timeout: 10000,
        headers: { Accept: "application/json" },
      }
    );

    const baseData = baseRes.data;

    return {
      props: {
        city,
        neighborhoods: baseData?.the_neighborhoods || [],
        error: false,
      },
    };
  } catch (error) {
    console.error("Error fetching city config data for hub:", error?.message || error);
    return {
      props: {
        city,
        neighborhoods: [],
        error: true,
      },
    };
  }
}

export default React.memo(CityNeighborhoodHub);
