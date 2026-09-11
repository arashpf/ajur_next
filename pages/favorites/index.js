import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/Home.module.css";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/router";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import WorkerCard from "../../components/cards/WorkerCard";

const favoritesIndex = () => {
  const router = useRouter();
  const [is_have_favorited, set_is_have_favorited] = useState(false);
  const [loading, set_loading] = useState(true);
  const [workers, set_workers] = useState([]);

  useEffect(() => {
    let favorited = Cookies.get("favorited");
    if (!favorited) {
      set_loading(false);
      set_is_have_favorited(false);
      return;
    }

    const ids = JSON.parse(favorited);

    axios({
      method: "get",
      url: "https://api.ajur.app/api/history-workers",
      params: { workers_holder: ids },
    })
      .then((response) => {
        set_workers(response.data);
        set_loading(false);
        set_is_have_favorited(response.data.length > 0);
      })
      .catch((error) => {
        console.error("Error fetching favorites:", error);
        set_loading(false);
        set_is_have_favorited(false);
      });
  }, []);

  const searchOnFiles = () => {
    router.push("/");
  };

  const renderFavoritedWorkers = () => {
    if (workers.length > 0) {
      return (
        <Grid container spacing={2}>
          {workers.map((worker) => (
            <Grid item xs={12} md={4} key={worker.id}>
              <a href={`/worker/${worker.id}?slug=${worker.slug}`}>
                <WorkerCard worker={worker} />
              </a>
            </Grid>
          ))}
        </Grid>
      );
    }

    return (
      <Grid item xs={12} style={{ background: "white" }}>
        <Box sx={{ textAlign: "center", padding: "40px 20px" }}>
          <p style={{ marginBottom: 20, fontSize: 18, color: "#666" }}>
            متاسفانه موردی یافت نشد
          </p>
          <div className="not-found-wrapper">
            <img
              className="not-found-image"
              src="/logo/not-found.png"
              alt="ملکی پیدا نشد"
              width={200}
              height={120}
              style={{ margin: "0 auto" }}
            />
          </div>
        </Box>
      </Grid>
    );
  };

  const renderFavotited = () => {
    if (is_have_favorited) {
      return (
        <Container
          maxWidth="xl"
          sx={{
            px: { xs: 2, sm: 3, md: 4 },
            margin: "0 auto",
            paddingBottom: "70px",
          }}
        >
          <h1
            style={{
              textAlign: "right",
              padding: "20px 0",
              color: "#555",
              fontSize: 22,
              fontFamily: "iransans",
              margin: 0,
            }}
          >
            فایل های مورد پسند شما در آجر
          </h1>

          <Box sx={{ flexGrow: 1, py: 3 }}>
            {renderFavoritedWorkers()}
          </Box>
        </Container>
      );
    }

    return (
      <Container
        maxWidth="md"
        sx={{
          px: { xs: 2, sm: 3 },
          margin: "0 auto",
          paddingTop: "40px",
          paddingBottom: "60px",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            padding: { xs: "20px 10px", sm: "40px 20px" },
            backgroundColor: "#f9f9f9",
            borderRadius: "12px",
            border: "1px solid #eee",
          }}
        >
          <Box sx={{ marginBottom: "24px" }}>
            <Image
              height={120}
              width={120}
              src="/logo/half-heart.png"
              alt="ajur half heart"
              style={{ margin: "0 auto" }}
            />
          </Box>

          <h3
            style={{
              color: "#555",
              fontSize: 20,
              marginBottom: 16,
              fontFamily: "iransans",
            }}
          >
            شما هنوز ملکی را نپسندیده اید
          </h3>

          <p
            style={{
              color: "#666",
              fontSize: 16,
              lineHeight: 1.6,
              marginBottom: 32,
              maxWidth: "500px",
              margin: "0 auto 32px",
            }}
          >
            با استفاده از آیکون قلب در فایل ها میتوانید آنها را به این صفحه
            اضافه کنید.
          </p>

          <Box
            onClick={searchOnFiles}
            sx={{
              display: "inline-block",
              backgroundColor: "#b92a31",
              color: "white",
              padding: "12px 32px",
              borderRadius: "24px",
              cursor: "pointer",
              fontSize: 16,
              fontWeight: 600,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#a01c22",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(185, 42, 49, 0.3)",
              },
            }}
          >
            جستجو در فایل ها
          </Box>
        </Box>
      </Container>
    );
  };

  // const renderSpinner = () => {
  //   return (
  //     <Box
  //       sx={{
  //         width: "100%",
  //         height: "100vh",
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         flexDirection: "column",
  //         backgroundColor: "white", // optional
  //       }}
  //     >
  //       <img
  //         src="/logo/ajour-gif.gif"
  //         alt="در حال بارگذاری"
  //         style={{ width: 100, height: 100 }}
  //       />
  //       <p style={{ marginTop: 15, color: "#666" }}>
  //         در حال بارگذاری علاقه‌مندی‌ها...
  //       </p>
  //     </Box>
  //   );
  // };

  const renderSpinner = () => (
    <div className="spinnerImageView" style={{
      minHeight: "60vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "white"
    }}>
      <div style={{
        position: 'relative',
        width: '400px',
        height: '400px',
        marginBottom: '20px'
      }}>
        <Image
          src="/logo/ajour-gif.gif"
          alt="در حال بارگذاری"
          fill
          sizes="400px"
          style={{ objectFit: "contain" }}
          priority
        />
      </div>
    </div>
  );
  

  return (
    <div style={{ minHeight: "100vh" }}>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="robots" content="max-image-preview:large" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <title>آجر : فایل های مورد پسند شما</title>
        <meta
          name="description"
          content="فایل های مورد پسند شما در آجر در این صفحه نمایش داده میشوند"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://ajur.app/favorites" />
      </Head>

      {loading ? renderSpinner() : renderFavotited()}
    </div>
  );
};

export default favoritesIndex;
