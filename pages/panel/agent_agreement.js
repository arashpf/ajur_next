import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import styles from "../../components/styles/agreement.module.css";
import MarketLayout from "../../components/layouts/MarketLayout";

import Head from "next/head";

import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from 'next/router';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const AgentAgreement = (props) => {
  const router = useRouter();
  const [loading, set_loading] = useState(false);
  const [open, setOpen] = useState(false);
  const [problem, setProblem] = useState('test');
  const [type, set_type] = useState('success');

  useEffect(() => {
    var token = Cookies.get("id_token");
    if (!token) {
      console.log("you have to login");
      router.push("/panel/auth/login");
    }
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
 

  const OnClickAcceptAgreement = () => {
    set_loading(true);

    var token = Cookies.get("id_token");
    //axios  call

    axios({
      method: "post",
      url: "https://api.ajur.app/webauth/change-to-agent",
      params: {
        token: token,
      },
    }).then(function (response) {
      console.log("the response in change-to-agent  : ");
      console.log(response.data);

      set_loading(false);

      if (response.data.status == 200) {
        
        setProblem('به آجر مشاورین خوش آمدید');
           
           setOpen(true);

           set_type('success');

        router.push("/panel/profile");
      } else {
        set_loading(false);
      }
    }).catch(function (e) {
        console.log('something wrong in server');
        set_loading(false);
        setProblem('متاسفانه مشکلی پیش آمده، اتصال خود به اینترنت را چک کنید و مجدد امتحان کنید');
        set_type('warning');
           
        setOpen(true);
     });

    //end of axios  call
  };

  const renderFooter = () => {
    return (
      <div className={styles.stickyButtonContainer}>
        {!loading ? (
          <Button
            onClick={OnClickAcceptAgreement}
            size="large"
            variant="contained"
            fullWidth={true}
            style={{ fontSize: 20 }}
          >
            قوانین را خواندم و قبول میکنم
          </Button>
        ) : (
          <Button
            size="large"
            variant="contained"
            fullWidth={true}
            style={{ fontSize: 20 }}
          >
            ...
          </Button>
        )}
      </div>
    );
  };
  return (
    <div>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="robots" content="max-image-preview:large" />
        <title> قوانین و توافق نامه کاربری آجر برای مشاورین آجر</title>
        <meta
          name="description"
          content="راه های ارتباطی ، آدرس و ساعات کاری آکادمی و پانسیون مطالعاتی کنکور دخترانه فرهنگ"
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
          content="قوانین و توافق نامه کاربری آجر برای مشاورین آجر"
        />
        <meta
          property="og:description"
          content="قوانین و توافق نامه کاربری آجر برای مشاورین آجر"
        />
        <meta
          property="og:url"
          content="https://ajur.app/panel/agent_agreement"
        />
        <meta property="og:site_name" content="مشاور املاک هوشمند آجر" />
        <meta
          property="article:published_time"
          content="2020-05-19T21:34:43+00:00"
        />
        <meta
          property="article:modified_time"
          content="2022-01-28T03:47:57+00:00"
        />
        <meta
          property="og:image"
          content="https://ajur.app/logo/ajour-meta-image.jpg"
        />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="533" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:label1" content="Written by" />
        <meta name="twitter:data1" content="آرش پیمانی فر" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://ajur.app/panel/agent_agreement" />
      </Head>

      <div className={styles.wrapper}>
        <h1 className={styles.wrapper_h1}>
          قوانین و توافق نامه کاربری آجر برای مشاورین
        </h1>
        <h5 className={styles.wrapper_h5}>1403/3/21 آخرین بروز رسانی</h5>
        <h3 className={styles.wrapper_h3}>خوش آمدید</h3>

        <p className={styles.wrapper_p}>
          از اینکه سکوی آجر را انتخاب کردید بسیار خوشحالیم،امیدواریم در کنار
          همدیگر به پیشرفت کشور عزیزمان مخصوصا در زمینه املاک و مستغلات ، کمک
          کوچکی کنیم
        </p>

        <h3>کمی درباره آجر</h3>
        <p className={styles.wrapper_p}>
          آجر مشاور املاکی هوشمند است که در شهرهای مختلف در ایران و خارج از کشور
          فعالیت خواهد داشت استفاده از تکنولوژی های روز دنیا از هوش مصنوعی گرفته
          تا تورهای مجازی ، ایجاد شبکه ای از مشاوران در منطقه و ... زیرساخت آجر
          را پایه گزاری میکنند
        </p>
        <h3>قوانین عمومی آجر</h3>
        <p className={styles.wrapper_p}>
          تمامی معاملات در آجر میبایست از قوانین جمهوری اسلامی ایران و قوانین
          املاک در کشور مقصد در صورت ثبت املاک در خارج از ایران تبعیت کنند، شما
          نیاز به ثبت شماره موبایل خود و تایید صحت آن در آجر خواهید داشت پروفایل
          شما توسط تیم نظارت آجر برسی خواهد شد . فایل های ثبت شده توسط شما ممکن
          است توسط تیم فنی آجر تایید یا رد شود
        </p>

        <h3>شرایط سنی</h3>
        <p className={styles.wrapper_p}>
          حد اقل سن مجاز برای استفاده از خدمات آجر ۱۸ سال تمام است{" "}
        </p>

        <h3>سیاست های انشار محتوا</h3>
        <p className={styles.wrapper_p}>
          تمامی مسئولیت های مرتبط با انتشار محتوا شامل عکس ها ، متن ها، ویدیو ها
          و همچنین مشکلات احتمالی کپی رایت آنها با مشاور است انتشار محتوا باید
          تابع قوانین جمهوری اسلامی ایران باشد. انشار محتوای شامل موارد
          جنسیتی،تبلیغ مشروبات الکلی، تبلیغات دخانیات و مواردی که جنبه آزاردهنده
          و نژاد پرستانه دارند در آجر ممنوع است
        </p>

        <h3>سیاست های انتشار محتوا</h3>
        <p className={styles.wrapper_p}>
          شما با انتشار محتوا در آجر این حق را به آجر میدهید که آنها را در
          اختیار دیگران قرار دهد
        </p>

        <h3>سیاست های حریم خصوصی</h3>
        <p className={styles.wrapper_p}>
          آجر برای نمایش موارد مرتبط با سلایق شما ، شهر انتخابی شما برای بازدید
          فایل ها و همچنین پردازش اطلاعات توسط تیم فنی و یا هوش مصنوعی ممکن است
          اطالاعاتی را از سمت شما در قالب کوکی ها جمع آوری کنند که این اطلاعات
          در اختیار هیچ نفر یا سازمان سومی قرار نخواهد گرفت
        </p>
        <h3>کلاهبرادری و فیشینگ</h3>
        <p className={styles.wrapper_p}>
          در معاملات ملکی از خرید و اجاره گرفته تا پیش فروش دو طرف معامله یعنی
          مشاور و مشتری مسئولیت کامل انجام معامله را به عهده خواهند داشت . آجر
          هیچ گونه مسئولیتی در زمینه فیشنیگ ها و کلاه برداری ها به اسم آجر را به
          عهده نمیگیرد
        </p>

        <h3>حل و فصل اختلافات</h3>
        <p className={styles.wrapper_p}>
          در صورت وجود اختلافات در معاملات آجر ممکن است سعی در حل و فصل صلح
          جویانه اختلاف دو طرف معامله داشته باشد، در صورت حل نشدن مشکل پیگیری
          قانونی به عهده دو طرف معامله خواهد بود و آجر هیچ گونه مسئولیتی را در
          این باره به عهده نمیگیرد
        </p>

        <h3>حقوق و مسئولیت های آجر</h3>
        <p className={styles.wrapper_p}>
          آجر باید در حفظ و نگه داری اطلاعات مشتریان خود روی سروهای آجر کوشا
          باشد. پشتیبانی در دسترسی برای حل مشکلات احتمالی معرفی کند. از فروش و
          سو استفاده از اطلاعات خصوصی مشاورین خود خود داری کند
        </p>
        <h3>حقوق و مسئولیت های مشاور</h3>
        <p className={styles.wrapper_p}>
          مشاورین آجر باید تابع شرایط و قوانین آجر و همچنین قوانین حاکم بر کشور
          باشند. مشاور حق انتشار محتوا با واتر مارک پلتفرم های دیگر در آجر را
          ندارد. مشاور حق انتشار و یا انتقال اطالعات مشتریان و مشاورین دیگر به
          نفر سوم را ندارد، مشاور این حق را به آجر میدهد که در صورت نارضایتی آجر
          از عملکردش بتواند صفحه و یا پروفایل وی در سکوی آجر را محدود و یا مسدود
          کند
        </p>

        <h3>موارد مالی</h3>
        <p className={styles.wrapper_p}>
          انتشار فایل در آجر با امکانات پایه کاملا رایگان است ، ولی در صورت نیاز
          به امکانات و یا انتشار های خاص ممکن است شامل دریافت هزینه شوید
        </p>
        <h3>کارمزد آجر</h3>
        <p className={styles.wrapper_p}>
           
           آجر کارمزدی از مشاوران املاک برای ارایه خدمات  دریافت نمیکند 
           مگر در قراردادی جداگانه و با رضایت دو طرف برای ارایه خدماتی خاص
        </p>
        {renderFooter()}
      </div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
          {problem}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AgentAgreement;
AgentAgreement.getLayout = function (page) {
  return <MarketLayout>{page}</MarketLayout>;
};
