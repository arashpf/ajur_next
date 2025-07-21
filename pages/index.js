import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import SearchDiv from "../components/others/SearchDiv";
import WorkerCard from "../components/cards/WorkerCard";
import RealStateSmalCard from "../components/cards/realestate/RealStateSmalCard";
import DepartmentSmalCard from "../components/cards/department/DepartmentSmalCard";
import CatCard from "../components/cards/CatCard";
import MainCatCard from "../components/cards/MainCatCard";
import PropTypes from "prop-types";
import Slider from "react-slick";
import axios from "axios";
import Link from "next/link";
import FileRequest from "../components/request/FileRequest";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import LandingPage from "./G-ads/landing-page";

import ForwardIcon from "@mui/icons-material/Forward";

import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { display, style } from "@mui/system";
// import "./styles.css";
// import required modules

function Home(props) {
  const router = useRouter();
  SwiperCore.use([Autoplay]);

  const [loading, set_loading] = useState(true);
  const [cats, set_cats] = useState();
  const [main_cats, set_main_cats] = useState();
  const [realestates, set_realestates] = useState();
  const [departments, set_departments] = useState();
  const [title1, set_title1] = useState();
  const [title2, set_title2] = useState();
  const [title3, set_title3] = useState();
  const [collection1, set_collection1] = useState();
  const [collection2, set_collection2] = useState();
  const [collection3, set_collection3] = useState();
  const [the_city, set_the_city] = useState();
  const [the_neighborhoods, set_the_neighborhoods] = useState();

  const [is_have_favorited, set_is_have_favorited] = useState(false);
  const [is_have_history, set_is_have_history] = useState(false);

  const [favorite_workers, set_favorite_workers] = useState([]);
  const [history_workers, set_history_workers] = useState([]);



  useEffect(() => {
    //  Cookies.set('selected_city','');

    //  var selected_city = Cookies.get('selected_city');
    var selected_city = props.trigeredcity;

    //  if(props.url_city){
    //   alert('city set in url');
    //   Cookies.set('selected_city',props.url_city);
    //  }else

    if (!selected_city) {
      //  router.push("/city-selection");
      // Cookies.set('selected_city','رباط کریم');
      selected_city = "رباط کریم";
      //   Cookies.set('selected_city_lat', '35.47229675', { expires: 365 });
      // Cookies.set('selected_city_lng', '51.08457936', { expires: 365 });
    }

    axios({
      method: "get",
      url: "https://api.ajur.app/api/base",
      params: {
        city: props.url_city ? props.url_city : selected_city,
      },
    }).then(function (response) {
      set_cats(response.data.cats);
      set_the_city(response.data.the_city);
      set_the_neighborhoods(response.data.the_neighborhoods);

      set_main_cats(response.data.main_cats);

      set_realestates(response.data.realstates);

      console.log("the departments data in base is --------------------");
      console.log(response.data.departments);

      set_departments(response.data.departments);

      set_title1(response.data.title1);

      set_title2(response.data.title2);

      set_title3(response.data.title3);

      set_collection1(response.data.collection1);
      set_collection2(response.data.collection2);
      set_collection3(response.data.collection3);

      set_loading(false);
    });
  }, [props.trigeredcity]);



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
      set_favorite_workers(response.data);

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


  useEffect(() => {
    var history = Cookies.get("history");

    if (!history) {
      return;
    }

    // const newProduct = JSON.parse(faviorited);
    const newProduct = JSON.parse(history);

    axios({
      method: "get",
      url: "https://api.ajur.app/api/history-workers",
      params: {
        workers_holder: newProduct,
      },
    }).then(function (response) {
      set_history_workers(response.data);

      if (response.data.length == 0) {
        console.log("trigered no post error");
        set_is_have_history(false);
      } else {
        set_is_have_history(true);
      }
      console.log("the data now is+++++++++++++++++++++ ");
      console.log(response.data);
    });

    // alert(newProduct);
  }, []);

  function AlterLoading() {
    console.log("loading is fired ~~~~~");
    set_loading(!loading);
  }

  function renderDefaultCity() {
    if (1) {
      return "رباط کریم";
    }
  }

  const renderSliderCategories = () => {
    var selected_city = Cookies.get("selected_city");

    return main_cats.map((cat) => (
      <SwiperSlide
        key={cat.id}
        onClick={AlterLoading}
        className={styles["single_cat_swipper"]}
      >
        <Link
          href={`/${props.trigeredcity ? props.trigeredcity : renderDefaultCity()
            }/${cat.name}`}
        >
          <a>
            <MainCatCard key={cat.id} cat={cat} />
          </a>
        </Link>
      </SwiperSlide>
    ));
  };

  const renderSliderOne = () => {
    return collection1.map((worker) => (
      <SwiperSlide key={worker.id} onClick={AlterLoading}>
        <Link href={`/worker/${worker.id}?slug=${worker.slug}`}>
          <a>
            <WorkerCard key={worker.id} worker={worker} />
          </a>
        </Link>
      </SwiperSlide>
    ));
  };

  const renderSlidertwo = () => {
    return collection2.map((worker) => (
      <SwiperSlide key={worker.id} onClick={AlterLoading}>
        <Link href={`/worker/${worker.id}?slug=${worker.slug}`}>
          <a>
            <WorkerCard key={worker.id} worker={worker} />
          </a>
        </Link>
      </SwiperSlide>
    ));
  };

  const renderSliderthree = () => {
    return collection3.map((worker) => (
      <SwiperSlide key={worker.id} onClick={AlterLoading}>
        <Link href={`/worker/${worker.id}?slug=${worker.slug}`}>
          <a>
            <WorkerCard key={worker.id} worker={worker} />
          </a>
        </Link>
      </SwiperSlide>
    ));
  };

  const renderSliderDepartments = () => {
    return departments.map((department) => (
      <SwiperSlide key={department.id} onClick={AlterLoading}>
        <Link href={`/department/${department.id}?slug=${department.slug}`}>
          <a>
            <DepartmentSmalCard key={department.id} department={department} />
          </a>
        </Link>
      </SwiperSlide>
    ));
  };

  const renderSliderRealState = () => {
    return realestates.map((realstate) => (
      <SwiperSlide key={realstate.id} onClick={AlterLoading}>
        <Link href={`/realestates/${realstate.id}?slug=${realstate.slug}`}>
          <a>
            <RealStateSmalCard key={realstate.id} realstate={realstate} />
          </a>
        </Link>
      </SwiperSlide>
    ));
  };


  const renderSomeHistoryeWorkers = () => {
    return history_workers.map((worker) => (
      <SwiperSlide key={worker.id} onClick={AlterLoading}>
        <Link href={`/worker/${worker.id}?slug=${worker.slug}`}>
          <a>
            <WorkerCard key={worker.id} worker={worker} />
          </a>
        </Link>
      </SwiperSlide>
    ));
  }

  const renderSomeFavoriteWorkers = () => {
    return favorite_workers.map((worker) => (
      <SwiperSlide key={worker.id} onClick={AlterLoading}>
        <Link href={`/worker/${worker.id}?slug=${worker.slug}`}>
          <a>
            <WorkerCard key={worker.id} worker={worker} />
          </a>
        </Link>
      </SwiperSlide>
    ));
  }


  const renderHistoryWorkers = () => {

    if (1) {
      return (
        history_workers.length > 0 && (
          <div style={{ paddingBottom: 10 }}>
            <div className={styles["title"]}>


              <h2>آخرین بازدید های شما</h2>



            </div>
            <Swiper
              slidesPerView={1}
              spaceBetween={8}
              autoplay={{
                delay: 3000,
                disableOnInteraction: true,
                pauseOnMouseEnter: true,
              }}
              pagination={{ clickable: true }}
              breakpoints={{
                200: {
                  slidesPerView: 1,
                  spaceBetween: 2,

                  navigation: {
                    enabled: true,
                  },
                },

                640: {
                  slidesPerView: 2,
                  spaceBetween: 3,
                  navigation: {
                    enabled: true,
                  },
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                  navigation: {
                    enabled: true,
                  },
                },
                1400: {
                  slidesPerView: 4,
                  spaceBetween: 20,
                  navigation: {
                    enabled: true,
                  },
                },
              }}
              modules={[Pagination, Navigation]}
              className={styles["worker-swiper"]}
            >
              {renderSomeHistoryeWorkers()}


            </Swiper>
          </div>
        )
      )
    }
  }


  const renderFavoriteWorkers = () => {

    if (1) {
      return (
        favorite_workers.length > 0 && (
          <div style={{ paddingBottom: 20 }}>
            <div className={styles["title"]}>


              <h2>آخرین مورد پسند های شما</h2>



            </div>
            <Swiper
              slidesPerView={1}
              spaceBetween={8}
              autoplay={{
                delay: 3000,
                disableOnInteraction: true,
                pauseOnMouseEnter: true,
              }}
              pagination={{ clickable: true }}
              breakpoints={{
                200: {
                  slidesPerView: 1,
                  spaceBetween: 2,

                  navigation: {
                    enabled: true,
                  },
                },

                640: {
                  slidesPerView: 2,
                  spaceBetween: 3,
                  navigation: {
                    enabled: true,
                  },
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                  navigation: {
                    enabled: true,
                  },
                },
                1400: {
                  slidesPerView: 4,
                  spaceBetween: 20,
                  navigation: {
                    enabled: true,
                  },
                },
              }}

              modules={[Pagination, Navigation]}
              className={styles["worker-swiper"]}
            >

              {renderSomeFavoriteWorkers()}


            </Swiper>
          </div>

        )

      )


    }

  }

  const renderOrSpinner = () => {
    if (loading) {
      return (
        <div className="spinnerImageView" >
          <img
            className="spinner-image"
            src="/logo/ajour-gif.gif"
            alt="ajur logo"
          />
        </div>
      );
    } else {
      return (
        <div>
          <main className={styles["main"]}>
            <div className={styles["main-row"]}>
              <SearchDiv
                loading={AlterLoading}
                the_city={the_city}
                the_neighborhoods={the_neighborhoods}
              />

              {renderHistoryWorkers()}
              {renderFavoriteWorkers()}

              <Swiper
                slidesPerView={1}
                spaceBetween={10}
                pagination={{ clickable: true }}
                // autoplay
                // autoplay={true}

                autoplay={{
                  delay: 5000,
                  disableOnInteraction: true,
                  pauseOnMouseEnter: true,
                }}
                breakpoints={{
                  200: {
                    slidesPerView: 2,
                    spaceBetween: 10,
                  },

                  640: {
                    slidesPerView: 2,
                    spaceBetween: 10,
                  },
                  768: {
                    slidesPerView: 4,
                    spaceBetween: 20,
                  },
                  1400: {
                    slidesPerView: 5,
                    spaceBetween: 30,
                  },
                }}
                modules={[Pagination, Navigation]}
              // className={styles["cat-swiper"]}
              >
                {renderSliderCategories()}
              </Swiper>

              {collection1.length > 0 && (
                <div>
                  <div className={styles["title"]}>

                    <Link
                      href={`/${props.trigeredcity
                        ? props.trigeredcity
                        : renderDefaultCity()
                        }/فروش زمین مسکونی`}
                    >
                      <h2>{title1}</h2>

                    </Link>

                  </div>
                  <Swiper
                    slidesPerView={1}
                    spaceBetween={8}
                    autoplay={{
                      delay: 3000,
                      disableOnInteraction: true,
                      pauseOnMouseEnter: true,
                    }}
                    pagination={{ clickable: true }}
                    breakpoints={{
                      200: {
                        slidesPerView: 1,
                        spaceBetween: 2,

                        navigation: {
                          enabled: true,
                        },
                      },

                      640: {
                        slidesPerView: 2,
                        spaceBetween: 3,
                        navigation: {
                          enabled: true,
                        },
                      },
                      768: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                        navigation: {
                          enabled: true,
                        },
                      },
                      1400: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                        navigation: {
                          enabled: true,
                        },
                      },
                    }}
                    modules={[Pagination, Navigation]}
                    className={styles["worker-swiper"]}
                  >
                    {renderSliderOne()}

                    <SwiperSlide>
                      <Link
                        href={`/${props.trigeredcity
                          ? props.trigeredcity
                          : renderDefaultCity()
                          }/فروش زمین مسکونی`}
                      >
                        <div className={styles["more-swiper"]}>
                          <p className={styles["more-swiper-p"]}>
                            {" "}
                            <p>نمایش موارد بیشتر</p>{" "}
                            <ForwardIcon
                              className={styles["more-swiper-icon"]}
                            />{" "}
                          </p>
                        </div>
                      </Link>
                    </SwiperSlide>
                  </Swiper>
                </div>
              )}

              {collection2.length > 0 && (
                <div>
                  <div className={styles["title"]}>
                    <Link
                      href={`/${props.trigeredcity
                        ? props.trigeredcity
                        : renderDefaultCity()
                        }/فروش آپارتمان`}
                    >
                      <h2>{title2} </h2>
                    </Link>
                  </div>
                  <Swiper
                    slidesPerView={1}
                    spaceBetween={8}
                    navigation
                    pagination={{ clickable: true }}
                    // autoplay
                    // autoplay={true}

                    breakpoints={{
                      200: {
                        slidesPerView: 1,
                        spaceBetween: 2,

                        navigation: {
                          enabled: true,
                        },
                      },

                      640: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                        navigation: {
                          enabled: true,
                        },
                      },
                      768: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                        navigation: {
                          enabled: true,
                        },
                      },
                      1400: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                        navigation: {
                          enabled: true,
                        },
                      },
                    }}
                    modules={[Pagination, Navigation]}
                    className={styles["worker-swiper"]}
                  >
                    {renderSlidertwo()}
                    <SwiperSlide>
                      <Link
                        href={`/${props.trigeredcity
                          ? props.trigeredcity
                          : renderDefaultCity()
                          }/فروش آپارتمان`}
                      >
                        <div className={styles["more-swiper"]}>
                          <p className={styles["more-swiper-p"]}>
                            {" "}
                            <p>نمایش موارد بیشتر</p>{" "}
                            <ForwardIcon
                              className={styles["more-swiper-icon"]}
                            />{" "}
                          </p>
                        </div>
                      </Link>
                    </SwiperSlide>
                  </Swiper>
                </div>
              )}

              {collection3.length > 0 && (
                <div>
                  <div className={styles["title"]}>
                    <Link
                      href={`/${props.trigeredcity
                        ? props.trigeredcity
                        : renderDefaultCity()
                        }/فروش باغ و باغچه`}
                    >
                      <h2>{title3} </h2>
                    </Link>

                  </div>
                  <Swiper
                    slidesPerView={1}
                    spaceBetween={8}
                    navigation
                    pagination={{ clickable: true }}
                    breakpoints={{
                      200: {
                        slidesPerView: 1,
                        spaceBetween: 2,

                        navigation: {
                          enabled: true,
                        },
                      },

                      640: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                        navigation: {
                          enabled: true,
                        },
                      },
                      768: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                        navigation: {
                          enabled: true,
                        },
                      },
                      1400: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                        navigation: {
                          enabled: true,
                        },
                      },
                    }}
                    modules={[Pagination, Navigation]}
                    className={styles["worker-swiper"]}
                  >
                    {renderSliderthree()}

                    <SwiperSlide>
                      <Link
                        href={`/${props.trigeredcity
                          ? props.trigeredcity
                          : renderDefaultCity()
                          }/فروش باغ و باغچه`}
                      >
                        <div className={styles["more-swiper"]}>
                          <p className={styles["more-swiper-p"]}>
                            {" "}
                            <p>نمایش موارد بیشتر</p>{" "}
                            <ForwardIcon
                              className={styles["more-swiper-icon"]}
                            />{" "}
                          </p>
                        </div>
                      </Link>
                    </SwiperSlide>
                  </Swiper>
                </div>
              )}

              <FileRequest />

              <div className={styles["title"]}>
                <h2>بهترین دپارتمان های املاک آجر {the_city.title}</h2>
              </div>

              <div>
                <Swiper
                  slidesPerView={1}
                  spaceBetween={8}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  breakpoints={{
                    200: {
                      slidesPerView: 2,
                      spaceBetween: 15,
                    },

                    640: {
                      slidesPerView: 3,
                      spaceBetween: 20,
                    },
                    768: {
                      slidesPerView: 5,
                      spaceBetween: 25,
                    },
                    1400: {
                      slidesPerView: 7,
                      spaceBetween: 35,
                    },
                  }}
                  modules={[Pagination, Navigation]}
                  className={styles["cat-swiper"]}
                >
                  {renderSliderDepartments()}
                </Swiper>
              </div>

              <div className={styles["title"]}>
                <h2>بهترین مشاورین املاک آجر {the_city.title}</h2>
              </div>

              <div>
                <Swiper
                  slidesPerView={1}
                  spaceBetween={8}
                  navigation
                  pagination={{ clickable: true }}
                  breakpoints={{
                    200: {
                      slidesPerView: 2,
                      spaceBetween: 15,
                    },

                    640: {
                      slidesPerView: 3,
                      spaceBetween: 20,
                    },
                    768: {
                      slidesPerView: 5,
                      spaceBetween: 25,
                    },
                    1400: {
                      slidesPerView: 7,
                      spaceBetween: 35,
                    },
                  }}
                  modules={[Pagination, Navigation]}
                  className={styles["cat-swiper"]}
                >
                  {renderSliderRealState()}
                </Swiper>
              </div>
            </div>
          </main>
        </div>
      );
    }
  };
  return (
    <div className={styles.container}>

      <Head>
        <meta charset="UTF-8" />
        <meta name="robots" content="max-image-preview:large" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        ></meta>
        <title> آجر : مشاور املاک هوشمند </title>
        <meta
          name="description"
          content="مشاور املاک هوشمند آجر مشاور املاکی به وسعت ایران با صدها مشاور مسلط به منطقه"
        />
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta property="og:locale" content="fa_IR" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fa_IR" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="آجر : مشاور املاک هوشمند " />
        <meta
          property="og:description"
          content="از خرید و فروش خانه و ویلا تا مشاوره برای سرمایه گزاری در مشاور املاک هوشمند آجر"
        />
        <meta property="og:url" content="https://ajur.app" />
        <meta property="og:site_name" content="آجر : مشاور املاک هوشمند " />
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
        <meta property="og:image:width" content="1080" />
        <meta property="og:image:height" content="702" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:label1" content="Written by" />
        <meta name="twitter:data1" content="آرش پیمانی فر" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://ajur.app" />
      </Head>

      <main className={styles.main}>{renderOrSpinner()}</main>

    </div>
  );
}

// This gets called on every request

export function getServerSideProps(props) {
  // const city = context.query.city ? context.query.city : false;
  const city = props.city ? props.city : false;

  return {
    props: {
      url_city: city,
    }, // will be passed to the page component as props
  };
}

export default Home;
