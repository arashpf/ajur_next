import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import Head from "next/head";
import Styles from "../../components/styles/RealstateSingle.module.css";
import axios from "axios";
// import Slider from "react-slick";
import Slider from "@mui/material/Slider";
import CatCard2 from "../../components/cards/CatCard2";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import WorkerCard from "../../components/cards/WorkerCard";
import CallIcon from "@mui/icons-material/Call";
import TourOutlinedIcon from "@mui/icons-material/TourOutlined";
import RealstateCard from "../../components/cards/realestate/RealStateCard";
import RealstateSkeleton from "../../components/skeleton/RealstateSkeleton";
import SpinnerModalLoader from "../../components/panel/SpinnerModalLoader";
import Link from "next/link";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Divider from "@mui/material/Divider";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";

import AddReactionIcon from '@mui/icons-material/AddReaction';
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
// import "./styles.css";
// import required modules
import Modal from "@mui/material/Modal";

import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DepartmentHead from "../../components/panel/department/parts/DepartmentHead";
import RealStateSmalCard from "../../components/cards/realestate/RealStateSmalCard";

const singleDeparment = (props) => {
  const router = useRouter();
  const { slug, id } = router.query;

  console.log("the department come form the ssr is : --------");

  console.log(props.department);

  const [loading, set_loading] = useState(true);
  const [show_filters_status, set_show_filters_status] = useState(false);
  const [workers, set_workers] = useState([]);
  const [all_workers, set_all_workers] = useState([]);
  const [department, set_department] = useState("");
  const [department_agents, set_department_agents] = useState("");
  const [cats, set_cats] = useState([]);
  const [selectedcat, set_selectedcat] = useState();
  const [selected_cat_name, set_selected_cat_name] = useState(false);

  const [have_workers, set_have_workers] = useState(null);
  const [lat, set_lat] = useState(35.80251019486825);
  const [long, set_long] = useState(51.45487293982643);
  const [open_modal, set_open_modal] = useState(false);
  const [modal_type, set_modal_type] = useState("subcategory");
  const [normal_fields, set_normal_fields] = useState([]);
  const [predefine_fields, set_predefine_fields] = useState([]);
  const [tick_fields, set_tick_fields] = useState([]);
  const [properties, set_properties] = useState([]);

  const [selected_neighborhoods, set_selected_neighborhoods] = useState([]);
  const [selected_neighborhoods_array, set_selected_neighborhoods_array] =
    useState([]);

  useEffect(() => {
    console.log("propeties change trigered in filtering trigered now-----");

    console.log(properties);
    console.log(normal_fields);

    var selected_normal_field = normal_fields.filter((field) => {
      if (field.low !== 0 || field.high === properties) return field;
    });

    console.log("the selected_noraml_filed is ");
    console.log(selected_normal_field);
    if (!selectedcat && selected_neighborhoods_array.length < 1) {
      set_workers([]);
      return;
    }

    // const old_workers = [...all_workers];
    const filtering_the_workers = all_workers.filter((worker) => {
      if (selectedcat === "all") return worker;

      if (selectedcat) {
        if (worker.category_id != selectedcat) return false;
      }

      if (selected_neighborhoods_array.length > 0) {
        // if (worker.neighborhood_id  > 1 ) return false;
        if (
          !selected_neighborhoods_array.includes(
            parseInt(worker.neighborhood_id)
          )
        )
          return false;
      }

      return worker;
    });

    const fitering_on_range = filtering_the_workers.filter((worker) => {
      const is_in_range = is_worker_in_range(worker);

      if (is_in_range) return worker;
    });

    set_workers(fitering_on_range);
  }, [selectedcat, selected_neighborhoods_array, properties]);

  /* fetch single worker data and Images */

  useEffect(() => {
    // {fetchWorker()}
    if (props.department) {
      set_loading(false);
    }

    set_department(props.department);
    set_department_agents(props.department_agents);
    console.log("the department agents ------");
    console.log(props.department_agents);

    set_workers(props.workers);
    set_all_workers(props.workers);
    set_cats(props.subcategories);
  }, []);

  useEffect(() => {
    if (selectedcat) {
      axios({
        method: "get",
        url: "https://api.ajur.app/api/category-fields",
        params: {
          cat: selectedcat,
        },
      }).then(function (response) {
        set_normal_fields(response.data.normal_fields);

        set_tick_fields(response.data.tick_fields);
        set_predefine_fields(response.data.predefine_fields);
      });
    }
  }, [selectedcat]);

  function valuetext(value) {
    return `${value}°C`;
  }

  function deleteFlFilter(fl) {
    console.log("the fl must be deleted from filter");
    console.log(fl);
    var filtered = normal_fields.filter((x) => {
      return x.id === fl.id;
    });
    set_properties((filtered[0].low = 0));
    set_properties((filtered[0].high = 0));
  }

  const renderModalTitle = () => {
    if (modal_type == "subcategory") {
      return (
        <p className={Styles["modal-header-title"]}>
          انتخاب دسته بندی ({workers.length} فایل موجود ){" "}
        </p>
      );
    } else if (modal_type == "neighborhood") {
      return (
        <p className={Styles["modal-header-title"]}>
          انتخاب محلات {city} ({workers.length} فایل موجود ){" "}
        </p>
      );
    } else if (modal_type == "filters") {
      return (
        <p className={Styles["modal-header-title"]}>
          فیلتر های {selected_cat_name} ({workers.length} فایل موجود )
        </p>
      );
    }
  };

  const is_worker_in_range = (worker) => {
    const is_googd_to_go = true;
    var decoded_pr = JSON.parse(worker.json_properties);

    var selected_decoded_pr = decoded_pr.filter((pr) => {
      if (pr.special == 1) return pr;
    });
    console.log("the decode pr is ------------------");
    console.log(selected_decoded_pr);

    normal_fields.map((nf) => {
      if (nf.special == 1) {
        if (nf.low > 0 || nf.high > 0) {
          const matched_pr_nf = selected_decoded_pr.find(function (pr) {
            return pr.name == nf.value;
          });

          const lower = nf.low > 0 ? parseInt(nf.low) : parseInt(nf.min_range);
          const higher =
            nf.high > 0 ? parseInt(nf.high) : parseInt(nf.max_range);

          console.log(matched_pr_nf.value);
          console.log(" between");
          console.log(lower);
          console.log("and");
          console.log(higher);

          if (matched_pr_nf.value > lower && matched_pr_nf.value < higher) {
            console.log("in range");
          } else {
            //  console.log(matched_pr_nf.value);
            //   console.log('not in range of between');
            //   console.log(lower);
            //   console.log('and');
            //   console.log(higher);

            console.log("not in range");

            is_googd_to_go = false;
          }
        }
      }
    });

    //  return decoded_pr[1].value
    return is_googd_to_go;
  };

  const onClickCloseModalButton = () => {
    set_open_modal(false);
  };

  const fetchWorker = (cat) => {
    console.log("the cat in fetch worker is ");

    if (cat == "all") {
      console.log("the all selected");
      set_workers(all_workers);
    } else {
      console.log(cat.id);
      set_workers(all_workers.filter((item) => item.category_id == cat.id));
    }

    return;

    axios({
      method: "get",
      url: "https://api.ajur.app/api/department-front-workers",
      params: {
        title: "title",
        lat: lat,
        long: long,
        selectedcat: selectedcat,
        department_id: id,
        collect: "all",
      },
    }).then(function (response) {
      console.log("the response data in departmentSingle is ");
      console.log(response.data);
      set_department(response.data.department);
      set_workers(response.data.workers);
      set_all_workers(response.data.workers);
      set_cats(response.data.subcategories);
      set_loading(false);

      if (response.data.workers.length > 0) {
        set_have_workers(true);
      } else {
        set_have_workers(false);
      }
    });
  };

  function numFormatter(num) {
    if (num > 999 && num < 1000000) {
      return (num / 1000).toFixed(0) + " هزار "; // convert to K for number from > 1000 < 1 million
    } else if (num >= 1000000 && num < 1000000000) {
      return (num / 1000000).toFixed(0) + " میلیون "; // convert to M for number from > 1 million
    } else if (num >= 1000000000) {
      return (num / 1000000000).toFixed(0) + "B"; // convert to M for number from > 1 million
    } else if (num < 900) {
      return num; // if value < 1000, nothing to do
    }
  }

  const renderDeparmentHead = () => {
    if (department.id) {
      return <DepartmentHead department={department} />;
    } else {
      return <RealstateSkeleton />;
    }
  };

  const handleParentClick = (cat) => {
    console.log("this is parent log triggered from child in RealstateSingle");
    console.log(cat.name);
    console.log(cat.id);
    set_selectedcat(cat.id);
    fetchWorker(cat);

    set_selected_cat_name(cat.name);

    set_show_filters_status(true);
  };

  const renderWorkers = () => {
    if (workers.length > 0) {
      return workers.map((worker) => (
        <Grid item xl={3} md={4} xs={12} key={worker.id}>
          <Link
            href={`/worker/${worker.id}?slug=${worker.slug}`}
            key={worker.id}
          >
            <a>
              <WorkerCard key={worker.id} worker={worker} />
            </a>
          </Link>
        </Grid>
      ));
    } else {
      return (
        <Grid item md={12} xs={12}>
          <p>متاسفانه موردی یافت </p>
        </Grid>
      );
    }
  };

  const renderSliderCategories = () => {
    return cats.map((cat) => (
      <SwiperSlide key={cat.id}>
        <CatCard2
          selectedcat={selectedcat}
          cat={cat}
          handleParentClick={handleParentClick}
        />
      </SwiperSlide>
    ));
  };

  const renderFitering = () => {
    if (show_filters_status) {
      return (
        <div className={Styles["header-wrapper"]}>
          <Box sx={{ flexGrow: 0 }}>
            <Grid container spacing={0}>
              {/* <Grid item md={2} xs={2} >
              <p>filters</p>
              </Grid> */}

              <Grid item md={12} xs={12}>
                {renderFiltersDialog()}
              </Grid>
            </Grid>
          </Box>
        </div>
      );
    }
  };

  const renderFiltersDialog = () => {
    if (1) {
      return (
        <div className={Styles["neighborhood-icon-wrapper"]}>
          <Button
            onClick={clickToOpenfiltersSelection}
            endIcon={<KeyboardArrowDownIcon />}
            variant="text"
            size="medium"
            fullWidth
            style={{
              backgroundColor: "white",
              margin: 10,
            }}
          >
            <div>فیلتر های بیشتر</div>
            <TuneIcon />
          </Button>
        </div>
      );
    }
  };

  const clickToOpenfiltersSelection = () => {
    set_modal_type("filters");
    set_open_modal(true);
  };

  const handleClose = () => {
    set_open_modal(false);
  };

  async function onClickResetFiledsFilterForm() {
    //  alert('todo : reset all filters');
    await normal_fields.map((fl, index) => {
      console.log("the number of index in loop");
      console.log(index);
      set_properties((fl.low = 0));

      set_properties((fl.high = 0));
    });
  }

  const onClickConfirmFilteringFileds = () => {
    set_open_modal(false);
  };

  async function handleChangeSliderValue(
    event,
    newValue,
    activeThumb,
    fl,
    index
  ) {
    // console.log('the index is -----');
    // console.log(index);
    // console.log('the selected fl is ----------');
    // console.log(fl);

    // console.log('and the new value low is-------- ');
    // console.log(newValue[0]);

    // console.log('and the value high is -------');
    // console.log(newValue[1]);

    console.log("the active thumb is------------------- ");

    console.log(activeThumb);

    // var rounded_min_value = Math.ceil((newValue[0]+1)/10)*10;
    var rounded_min_value = newValue[0];
    // var rounded_high_value = Math.ceil((newValue[1]+1)/10)*10;
    var rounded_high_value = newValue[1];

    var filtered = normal_fields.filter((x) => {
      return x.id === fl.id;
    });

    if (activeThumb == 0) {
      await set_properties((filtered[0].low = rounded_min_value));
    }

    if (activeThumb == 1) {
      await set_properties((filtered[0].high = rounded_high_value));
    }

    // console.log('filtered is ------------');
    // console.log(filtered);

    return;

    set_properties(
      (normal_fields.filter((x) => {
        return x.id === fl.id;
      })[0].low = newValue[0]),
      ([0].high = newValue[1])
    );
    //  set_properties(normal_fields.filter(x => {return x.id === fl.id })
    //  [0].low = newValue[0],
    //  [0].high = newValue[1],
    // )

    //  set_properties(normal_fields.filter(x => {return x.id === fl.id })[0].high = newValue[1])

    // var valueSelected = properties.filter((item) => item.name == fl.value);

    // if (!Array.isArray(newValue)) {
    //   return;
    // }

    // if (newValue[1] - newValue[0] < minDistance) {
    //   if (activeThumb === 0) {
    //     const clamped = Math.min(newValue[0], 100 - minDistance);
    //     setValue2([clamped, clamped + minDistance]);
    //   } else {
    //     const clamped = Math.max(newValue[1], minDistance);
    //     setValue2([clamped - minDistance, clamped]);
    //   }
    // } else {
    //   setValue2(newValue);
    // }
  }

  const rednerFiltersBasedOnCatSelected = () => {
    if (1) {
      return normal_fields.map(
        (fl, index) =>
          fl.special == 1 && (
            <div>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  {(fl.low > 0 || fl.high > 0) && (
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={() => deleteFlFilter(fl)}
                    >
                      حذف
                    </Button>
                  )}

                  <p
                    style={{
                      direction: "rtl",
                      textAlign: "right",
                      marginRight: 10,
                      color: "gray",
                      fontSize: 14,
                      padding: 10,

                      marginLeft: 10,
                      width: "100%",
                    }}
                  >
                    {fl.value}
                  </p>
                </AccordionSummary>
                <AccordionDetails>
                  <div style={{ padding: "1px 50px" }}>
                    <Slider
                      getAriaLabel={() => "Minimum distance"}
                      // value={[handleMinValueForSlider(fl), handleMaxValueForSlider(fl)]}
                      value={[
                        fl.low > 0 ? parseInt(fl.low) : parseInt(fl.min_range),
                        fl.high > 0
                          ? parseInt(fl.high)
                          : parseInt(fl.max_range),
                      ]}
                      onChange={(event, newValue, activeThumb) =>
                        handleChangeSliderValue(
                          event,
                          newValue,
                          activeThumb,
                          fl,
                          index
                        )
                      }
                      valueLabelFormat={numFormatter}
                      valueLabelDisplay="on"
                      aria-labelledby="non-linear-slider"
                      getAriaValueText={valuetext}
                      // disableSwap
                      // step={calculateSteps(fl)}

                      min={parseInt(fl.min_range)}
                      max={parseInt(fl.max_range)}
                      // min={0}
                      // max={500}
                    />
                  </div>
                </AccordionDetails>
              </Accordion>

              <Divider
                sx={{ borderBottomWidth: 2, background: "#555", margin: 3 }}
                fullWidth
              />
            </div>
          )
      );
    }
  };

  const renderModalContent = () => {
    if (loading) {
      return <SpinnerModalLoader />;
    } else {
      if (modal_type == "filters") {
        return (
          <div style={{ padding: 10 }}>
            <div className={Styles["modal-header"]}>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  <Grid item md={2} xs={2}>
                    {/* <CloseIcon  className={Styles['modal-header-close-button']}/> */}
                    <Button onClick={onClickCloseModalButton} variant="text">
                      <CloseIcon
                        className={Styles["modal-header-close-button"]}
                      />
                    </Button>
                  </Grid>

                  <Grid item md={10} xs={10}>
                    {renderModalTitle()}
                  </Grid>

                  {workers.length}
                </Grid>
              </Box>
            </div>
            {rednerFiltersBasedOnCatSelected()}
            <div className={Styles["neighborhood-modal-footer-wrapper"]}>
              {1 ? (
                <Button
                  size="large"
                  variant="text"
                  style={{
                    fontSize: 13,
                    paddingRight: 20,
                    background: "white",
                    border: "1px solid black",
                    marginRight: 10,
                    textAlign: "center",
                  }}
                  onClick={onClickResetFiledsFilterForm}
                >
                  حذف فیلترها
                </Button>
              ) : (
                <Button
                  size="large"
                  variant="text"
                  style={{
                    fontSize: 13,
                    paddingRight: 30,
                    background: "#ef7420",
                    color: "white",
                    border: "1px solid black",
                    marginRight: 10,
                    textAlign: "center",
                  }}
                  onClick={onClickCheckAllNeighborhoodsForm}
                >
                  همه مناطق {city}
                </Button>
              )}

              {1 && (
                <Button
                  size="large"
                  variant="contained"
                  style={{ fontSize: 15, width: 200 }}
                  onClick={onClickConfirmFilteringFileds}
                >
                  تایید{" "}
                </Button>
              )}
            </div>
          </div>
        );
      }
    }
  };

  const renderModal = () => {
    return (
      <Modal
        open={open_modal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={Styles["modal-wrapper"]}>{renderModalContent()}</Box>
      </Modal>
    );
  };

  function AlterLoading() {
    console.log("loading is fired ~~~~~");
    set_loading(!loading);
  }

  const renderDepartmentAgents = () => {
    if (1) {
      return department_agents.map((realstate) => (
        <SwiperSlide key={realstate.id} onClick={AlterLoading}>
          <Link href={`/realestates/${realstate.user_id ? realstate.user_id :realstate.id}?slug=${realstate.slug}`}>
            <a>
              <RealStateSmalCard key={realstate.id} realstate={realstate} />
            </a>
          </Link>
        </SwiperSlide>
      ));
    }
  };

  const renderSelectedFilters = () => {
    if (selectedcat) {
      return (
        <div>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              {normal_fields.map(
                (fl, index) =>
                  fl.special == 1 && (
                    <div>
                      {(fl.low > 0 || fl.high > 0) && (
                        <>
                          <Button
                            component="label"
                            role={undefined}
                            variant="outlined"
                            color="error"
                            tabIndex={-1}
                            startIcon={<DeleteIcon />}
                            onClick={() => deleteFlFilter(fl)}
                          >
                            {fl.value}
                          </Button>
                          {/* <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => deleteFlFilter(fl)}
                          >
                            حذف
                          </Button> */}
                          {/* <p
                            style={{
                              direction: "rtl",
                              textAlign: "right",
                              marginRight: 10,
                              color: "gray",
                              fontSize: 14,
                              padding: 10,

                              marginLeft: 10,
                              width: "100%",
                            }}
                          >
                            {fl.value}
                          </p> */}
                        </>
                      )}

                      <Divider
                        sx={{
                          borderBottomWidth: 2,
                          background: "#555",
                          margin: 3,
                        }}
                        fullWidth
                      />
                    </div>
                  )
              )}
            </Grid>
          </Box>
        </div>
      );
    }
  };

  const onclickJoinRequest = () => {
    set_loading(true);
   
  }

  const renderOrSpinner = () => {
    if (!loading) {
      return (
        <div>
          <div className={Styles["realstate-items-wrapper"]}>
            <div>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  <Grid item md={2} xs={0}></Grid>
                  <Grid item md={8} xs={12}>
                    {renderDeparmentHead()}
                  </Grid>

                  <Grid item md={2} xs={0}></Grid>
                </Grid>
              </Box>
            </div>
            <div className={Styles["contact-wrapper"]}>
              <Box
                component="div"
                sx={{
                  p: 2,
                  border: "1px dashed grey",
                  margin: "5px",
                  textAlign: "center",
                }}
              >
                <Grid container spacing={1}>
                  <Grid item xs={6} md={6}>
                  <Link href={`/join-department/${department.id}`}>
                    <Button
                      fullWidth
                      className={Styles["worker-detail-button"]}
                      variant="contained"
                      startIcon={<AddReactionIcon />}

                      onClick={onclickJoinRequest}
                     
                    >
                      درخواست عضویت
                    </Button>
                    </Link>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <Button
                      fullWidth
                      href={`tel:${department && department.head_phone}`}
                      className={Styles["worker-detail-button"]}
                      variant="outlined"
                      startIcon={<CallIcon />}
                    >
                      {" "}
                      {department && department.head_phone}{" "}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </div>
            <div className={Styles["title"]}>
              <h2> مشاورین  {department.name} {'('} {department_agents.length} {'عضو )'}</h2>
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
                    spaceBetween: 5,
                  },

                  640: {
                    slidesPerView: 2,
                    spaceBetween: 10,
                  },
                  768: {
                    slidesPerView: 5,
                    spaceBetween: 20,
                  },
                  1400: {
                    slidesPerView: 7,
                    spaceBetween: 30,
                  },
                }}
                modules={[Pagination, Navigation]}
                className={Styles["cat-swiper"]}
              >
                {renderDepartmentAgents()}
              </Swiper>
            </div>

            <div className={Styles["title"]}>
              <h2> فایل های  {department.name} {'('} {all_workers.length} {'فایل )'}</h2>
            </div>

            <div>
              <Swiper
                slidesPerView={3}
                spaceBetween={8}
                navigation
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
                  1024: {
                    slidesPerView: 4,
                    spaceBetween: 5,
                  },
                }}
                modules={[Pagination, Navigation]}
                className={Styles["cat-swiper"]}
              >
                {renderSliderCategories()}
                <SwiperSlide key="all">
                  <CatCard2
                    selectedcat="all"
                    cat="all"
                    handleParentClick={handleParentClick}
                  />
                </SwiperSlide>
              </Swiper>
            </div>

           
            {renderFitering()}
            {renderSelectedFilters()}

           
            <div style={{ display: "flex" }}>
              <Grid container spacing={2}>
                {renderWorkers()}
              </Grid>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="spinnerImageView">
          <img
            className="spinner-image"
            src="/logo/ajour-gif.gif"
            alt="ajour logo"
          />
        </div>
      );
    }
  };
  return (
    <div className="realstate-contents-wrapper">
      <Head>
        <meta charset="UTF-8" />
        <meta name="robots" content="max-image-preview:large" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        ></meta>
        <title>مشاور املاک هوشمند آجر | {department.name}</title>
        <meta name="description" content={department.description} />
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta property="og:locale" content="fa_IR" />
        <meta property="og:type" content="website" />

        <meta
          property="og:title"
          content={"مشاور املاک هوشمند آجر |" + department.name}
        />
        <meta
          property="og:description"
          content={
            " صفحه اختصاصی  " + department.name + " | مشاور املاک هوشمند آجر "
          }
        />
        <meta
          property="og:url"
          content={
            "https://ajur.app/department/" +
            department.id +
            "?slug=" +
            department.slug
          }
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
        <meta property="og:image" content={department.profile_url} />
        <meta property="og:image:width" content="840" />
        <meta property="og:image:height" content="840" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:label1" content="Written by" />
        <meta name="twitter:data1" content={department.name} />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="canonical"
          href={
            "https://ajur.app/department/" +
            department.id +
            "?slug=" +
            department.slug
          }
        />
      </Head>
      {renderOrSpinner()}
      {renderModal()}
    </div>
  );
};

export async function getServerSideProps(context) {
  const { params } = context;
  const id = params.id;

  const res = await fetch(
    `https://api.ajur.app/api/get-department-front?department_id=${id}`
  );
  const data = await res.json();
  return {
    props: {
      department: data.department,
      workers: data.department_workers,
      all_workers: data.department_workers,
      department_agents: data.department_agents,
      subcategories: data.subcategories,
    }, // will be passed to the page component as props
  };
}

export default singleDeparment;
