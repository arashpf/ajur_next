import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";

import styles from "../../styles/Home.module.css";

import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/router";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import Box from "@mui/material/Box";
import LazyLoader from "../../components/lazyLoader/Loading";

import WorkerCard from "../../components/cards/WorkerCard";
import { useTheme } from "@emotion/react";
import { useMediaQuery } from "@mui/material";

const historyIndex = (props) => {
  const router = useRouter();
  const theme = useTheme();

  const [is_have_history, set_is_have_history] = useState(false);
  const [loading, set_loading] = useState(true);
  const [history_workers, set_history_workers] = useState([]);

  useEffect(() => {
    var history = Cookies.get("history");

    if (!history) {
      set_loading(false);
      set_is_have_history(false);
      return;
    }

    const historyItems = JSON.parse(history);

    axios({
      method: "get",
      url: "https://api.ajur.app/api/history-workers",
      params: {
        workers_holder: historyItems,
      },
    })
      .then(function (response) {
        set_history_workers(response.data);
        set_loading(false);
        if (response.data.length == 0) {
          console.log("trigered no post error");
          set_is_have_history(false);
        } else {
          set_is_have_history(true);
        }
        console.log("the data now is+++++++++++++++++++++ ");
        console.log(response.data);
      })
      .catch(function (error) {
        console.error("Error loading history workers:", error);
        set_loading(false);
        set_is_have_history(false);
      });
  }, []);

  const searchOnFiles = () => {
    router.push("/");
  };

  const renderHistoryWorkers = () => {
    if (Array.isArray(history_workers) && history_workers.length > 0) {
      return (
        <LazyLoader
          items={history_workers} // whole array of workers
          itemsPerPage={6} // adjust as needed
          delay={800}
          renderItem={(worker) => (
            <Grid item md={4} xs={12} key={worker.id}>
              <a
                href={`/worker/${worker.id}?slug=${worker.slug}`}
                key={worker.id}
              >
                {/* <WorkerCard worker={worker} /> */}
                <WorkerCard worker={worker} />
              </a>
            </Grid>

          )}
          loadingComponent={
            <p style={{ textAlign: "center" }}>در حال بارگذاری...</p>
          }
          endComponent={
            <p style={{ textAlign: "center" }}>همه فایل‌ها بارگذاری شدند✅</p>
          }
          grid={true}
          gridProps={{ spacing: 2 }}
          itemProps={{ xl: 3, md: 4, xs: 12 }}
        />
      );
    } else {
      return (
        <Grid item md={12} xs={12} style={{ background: "white" }}>
          <p style={{ textAlign: "center", padding: 20 }}>
            متاسفانه موردی یافت نشد
          </p>
          <div className="not-found-wrapper">
            <img
              className="not-found-image"
              src="/logo/not-found.png"
              alt="ملکی پیدا نشد"
              width={200}
              height={120}
            />
          </div>
        </Grid>
      );
    }
  };

  const renderHistory = () => {
    if (loading) {
      return (
        <div style={{ textAlign: "center", padding: 50 }}>
          <p>در حال بارگذاری...</p>
        </div>
      );
    }

    if (is_have_history) {
      return (
        <Box sx={{ padding: "10px 2px", flexGrow: 1, marginBottom: "70px" }}>
          <h1
            style={{
              textAlign: "right",
              padding: 10,
              color: "#555",
              fontSize: 22,
              fontFamily: "iransans",
              padding: 20,
            }}
          >
            فایل های بازدید شده اخیر شما در آجر
          </h1>
          <Box sx={{ flexGrow: 1, py: 3, px: { xs: 2, sm: 3 } }}>
             
                {renderHistoryWorkers()}
              
            </Box>
        </Box>
      );
    } else {
      return (
        <div className={styles["no-favorites-wrapper"]}>
          <Grid container>
            <Grid item xs={0} md={3} spacing={1}></Grid>
            <Grid item xs={12} md={6} spacing={1}>
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div className="not-found-wrapper">
                  <img
                    className="not-found-image"
                    src="/logo/not-found.png"
                    alt="هنوز هیچ فایلی بازدید نکرده اید"
                    width={200}
                    height={120}
                  />
                </div>
                <h3 style={{ color: "#555", marginBottom: 16, marginTop: 20 }}>
                  هنوز هیچ فایلی را بازدید نکرده اید
                </h3>
                <p style={{ color: "#777", lineHeight: 1.6, fontSize: 14 }}>
                  با بازدید از فایل های مختلف در آجر، آنها به صورت خودکار به این
                  صفحه اضافه می‌شوند تا بتوانید به راحتی به فایل های مشاهده شده
                  اخیر خود دسترسی داشته باشید
                </p>
              </div>

              <div
                className={styles["search-on-files"]}
                onClick={searchOnFiles}
                style={{
                  textAlign: "center",
                  marginTop: 30,
                  cursor: "pointer",
                }}
              >
                <p style={{
                  background: "#b92a31",
                  color: "white",
                  padding: "12px 24px",
                  borderRadius: 8,
                  display: "inline-block",
                  margin: 0
                }}>
                  جستجو در فایل ها
                </p>
              </div>
            </Grid>
          </Grid>
        </div>
      );
    }
  };

  return (
    <div>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="robots" content="max-image-preview:large" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        ></meta>
        <title> آجر : فایل های بازدید شده اخیر شما </title>
        <meta
          name="description"
          content="فایل های بازدید شده اخیر شما در آجر در این صفحه نمایش داده میشوند"
        />
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta property="og:locale" content="fa_IR" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fa_IR" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="آجر : فایل های بازدید شده اخیر شما "
        />
        <meta
          property="og:description"
          content="فایل های بازدید شده اخیر شما در آجر در این صفحه نمایش داده میشوند"
        />
        <meta property="og:url" content="https://ajur.app" />
        <meta property="og:site_name" content="آجر : مشاور املاک هوشمند " />
        <meta
          property="article:published_time"
          content="2023-05-19T21:34:43+00:00"
        />
        <meta
          property="article:modified_time"
          content="2024-01-28T03:47:57+00:00"
        />
        <meta
          property="og:image"
          content="https://ajur.app/logo/ajour-meta-image.jpg"
        />
        <meta property="og:image:width" content="1080" />
        <meta property="og:image:height" content="702" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:label1" content="Written by" />
        <meta name="twitter:data1" content="آرش پیمانی فر" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://ajur.app/history" />
      </Head>

      {renderHistory()}
    </div>
  );
};

export default historyIndex;