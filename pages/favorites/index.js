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


import WorkerCard from "../../components/cards/WorkerCard";

const favoritesIndex = (props) => {
  const router = useRouter();

  const [is_have_favorited, set_is_have_favorited] = useState(false);
  const [loading, set_loading] = useState(true);
  const [workers, set_workers] = useState([]);

  useEffect(() => {
    var faviorited = Cookies.get("favorited");

    if (!faviorited) {
      return;
    }

    // const newProduct = JSON.parse(faviorited);
    const newProduct = JSON.parse(faviorited);

    axios({
      method: "get",
      url: "https://api.ajur.app/api/history-workers",
      params: {
        workers_holder: newProduct,
      },
    }).then(function (response) {
      set_workers(response.data);
      set_loading(false);
      if (response.data.length == 0) {
        console.log("trigered no post error");
        set_is_have_favorited(false);
      } else {
        set_is_have_favorited(true);
      }
      console.log("the data now is+++++++++++++++++++++ ");
      console.log(response.data);
    });

    // alert(newProduct);
  }, []);

  const searchOnFiles = () => {
    router.push("/");
  };

  const renderFavoritedWorkers = () => {
    if (workers.length > 0) {
      return workers.map((worker) => (
        <Grid item xl={3} md={4} xs={12} key={worker.id}>
          <a href="#">
            <Link
              href={`/worker/${worker.id}?slug=${worker.slug}`}
              key={worker.id}
            >
              <a>
                <WorkerCard key={worker.id} worker={worker} />
              </a>
            </Link>
          </a>
        </Grid>
      ));
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
  const renderFavotited = () => {
    if (is_have_favorited) {
      return (
        <Box sx={{ padding: '10px 2px', flexGrow: 1 }}>
          <h1 style={{textAlign:'right',padding:10,color:'#555',fontSize:22,fontFamily:'iransans'}}>فایل های مورد پسند شما در آجر</h1>
          <Grid container spacing={2}>

         
            {renderFavoritedWorkers()}
          </Grid>
          
        </Box>
      );
    } else {
      return (
        <div className={styles["no-favorites-wrapper"]}>
          <Grid container>
            <Grid item xs={0} md={3} spacing={1}></Grid>
            <Grid item xs={12} md={6} spacing={1}>
              <div>
                <Image
                  height={99}
                  width={100}
                  // src="/logo/heart-dance.gif"
                  src="/logo/half-heart.png"
                  alt="ajur half heart"
                />
<<<<<<< HEAD
                <h3>شما هنوز ملکی را قلب  نکردید</h3>
=======
                <h3>شما هنوز ملکی را پسند خود نکردید </h3>
>>>>>>> a6b1c29616623faba10577384ad1bca1dcbff403
                <p>
                  با استفاده از آیکون قلب در فایل ها میتوانید آنها را به این
                  صفحه اضافه کنید ، تا از آخرین تغییرات قیمت ، تغییر وضعیت و
                  فایل های مشابه آگاه شوید
                </p>
              </div>

              <div
                className={styles["search-on-files"]}
                onClick={searchOnFiles}
              >
                <p>جستجو در فایل ها</p>
              </div>
            </Grid>
          </Grid>
        </div>
      );
    }
  };
  return <div>

<Head>
        <meta charset="UTF-8" />
        <meta name="robots" content="max-image-preview:large" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        ></meta>
        <title> آجر :  فایل های مورد پسند شما </title>
        <meta
          name="description"
          content="فایل های مورد پسند شما در آجر در این صفحه نمایش داده میشوند"
        />
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta property="og:locale" content="fa_IR" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fa_IR" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="آجر :  فایل های مورد پسند شما " />
        <meta
          property="og:description"
          content="فایل های مورد پسند شما در آجر در این صفحه نمایش داده میشوند"
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
        <link rel="canonical" href="https://ajur.app" />
      </Head>
      
    {renderFavotited()}
    
    </div>;
};

export default favoritesIndex;
