import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import MarketingEntro from "../../components/parts/MarketingEntro";
import MarketingFaq from "../../components/parts/MarketingFaq";
import MarketingFaqForMarketer from "../../components/parts/MarketingFaqForMarketer";
import MarketLayout from "../../components/layouts/MarketLayout";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Cookies from "js-cookie";

import { useRouter } from "next/router";
import Head from "next/head";
import IntroSlider from "../../components/common/IntroSlider/IntroSlider";

const index = (props) => {
  const router = useRouter();
  // const { slug,username } = router.query
  const username = router.query.id;
  const type = router.query.type;
  Cookies.set("ref", router.query.id, { expires: 255 });

  // Intro slider (reuse the same slides and lottie assets as assistant notebook)
  const [showIntroSlider, setShowIntroSlider] = useState(false);

  const introSlides = [
    {
      id: 1,
      title: "تا یک میلیون نفر اول",
      description: "کسب درآمد میلیونی برای یک میلیون نفر اول آجر",
      lottieSource: require("./assets/Money.json"),
      color: "#2196F3",
    },
    {
      id: 2,
      title: "با دعوت دوست‌‍‌هات",
      description: "هم کسب درآمد کن، هم به دوستات 3 ماه اشتراک رایگان هدیه بده",
      lottieSource: require("./assets/Send Invitation.json"),
      color: "#4CAF50",
    },
    {
      id: 3,
      title: "لطفا اپلیکیشن آجر را نصب کنید",
      description:
        "برای استفاده از پنل بازاریابی و دیگر قابلیت های آجر لطفا اپلیکیشن ما را نصب کنید",
      image: "/img/ajur-1200.png",
      color: "#9C27B0",
    },
  ];

  useEffect(() => {
    // Wait for router to populate query params (SSR -> CSR hydration)
    if (!router || !router.isReady) return;

    try {
      const hasSeen =
        typeof window !== "undefined"
          ? localStorage.getItem("hasSeenFileBankIntro")
          : null;
      const q = router.query || {};
      const force =
        q.showIntro === "1" ||
        q.showIntro === "true" ||
        q.forceIntro === "1" ||
        q.forceIntro === "true";

      if (force || hasSeen === null) setShowIntroSlider(true);
    } catch (e) {
      // ignore
    }
  }, [router && router.isReady, router && router.query]);

  const renderMarketingFaq = () => {
    if (type == "marketer") {
      return <MarketingFaqForMarketer />;
    } else {
      return <MarketingFaq />;
    }
  };

  const onclickMarketingLogin = () => {
    console.log("marketing login clicked ");

    var ref_cookie = Cookies.get("ref");
    console.log("ref_cookie now is");
    console.log(ref_cookie);

    var token = Cookies.get("id_token");
    if (!token) {
      console.log("you have to login");
      Cookies.set("destination_before_auth", "/marketing/single", {
        expires: 14,
      });
      router.push("/panel/auth/login");
    } else {
      console.log("you are currently loged in and enjoy");
      console.log(token);
      router.push("/marketing/single");
    }
  };

  const onclickRealestateLogin = () => {
    console.log("real login clicked ");

    var token = Cookies.get("id_token");
    if (!token) {
      console.log("you have to login");
      Cookies.set("destination_before_auth", "/", { expires: 14 });
      router.push("/panel/auth/login");
    } else {
      console.log("you are currently loged in and enjoy");
      console.log(token);
      router.push("/");
    }
  };

  const renderRegisterButton = () => {
    return (
      <Paper sx={{ px: 2, py: 2, mt: 2 }} elevation={1}>
        <Button
          size="large"
          color="success"
          onClick={() => {
            window.location.href = "/download"; // replace with your app link
          }}
          variant="contained"
          fullWidth={true}
          style={{ fontSize: 20 }}
        >
          نصب اپلیکیشن
        </Button>
      </Paper>
    );
    // Render button inline (non-sticky) so it participates in page flow
    // if( type == 'marketer'){
    //   return(
    //     <Paper sx={{ px: 2, py: 2, mt: 2 }} elevation={1}>
    //       <Button size="large" color="success" onClick={onclickMarketingLogin} variant="contained" fullWidth={true} style={{fontSize:20}}>ورود / ثبت نام</Button>
    //     </Paper>
    //   )
    // }else{
    //   return(
    //     <Paper sx={{ px: 2, py: 2, mt: 2 }} elevation={1}>
    //       <Button size="large"  onClick={onclickRealestateLogin} variant="contained" fullWidth={true} style={{fontSize:20}}>ورود  مشاور</Button>
    //     </Paper>
    //   )
    // }
  };

  return (
    <div>
      <Head>
        <meta charset="UTF-8" />
        <meta name="robots" content="max-image-preview:large" />
        <title> مشاور املاک هوشمند آجر | بخش بازاریابی </title>
        <meta
          name="description"
          content="کسب درامد، فقط با ارسال لینک بازاریابی آجر"
        />
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta property="og:locale" content="fa_IR" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="  کسب درامد دیجیتال |   بازاریابی آجر"
        />
        <meta
          property="og:description"
          content="فقط با اشتراک لینک کسب درامد کنید"
        />
        <meta property="og:url" content="https://ajur.app" />
        <meta property="og:site_name" content="مشاور املاک هوشمند آجر" />
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
          content="https://ajur.app/img/big-logo-180.png"
        />
        <meta property="og:image:width" content="180" />
        <meta property="og:image:height" content="180" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:label1" content="Written by" />
        <meta name="twitter:data1" content="آرش پیمانی فر" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://ajur.app/marketing" />
      </Head>
      <IntroSlider
        visible={showIntroSlider}
        hasSkip={false}
        onClose={() => {
          try {
            if (typeof window !== "undefined")
              localStorage.setItem("hasSeenFileBankIntro", "true");
          } catch (e) {}
          setShowIntroSlider(false);
        }}
        slides={introSlides}
        lastButtonLabel="نصب"
        onLastButtonClick={() => {
          window.location.href = "/download"; // replace with your app link
        }}
      />

      {/* <MarketingEntro username={username} type={type}/> */}

      <div style={{ marginBottom: 16 }}>{/* {renderMarketingFaq()} */}</div>
      {renderRegisterButton()}
    </div>
  );
};

export default index;
index.getLayout = function (page) {
  return <MarketLayout>{page}</MarketLayout>;
};
