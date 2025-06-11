import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import Head from "next/head";
import Styles from "../../styles/CategoriesWorkersIndex.module.css";
import axios from "axios";
// import Slider from "react-slick";
import CatCard2 from "../../components/cards/CatCard2";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Slider from "@mui/material/Slider";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";

import WorkerCard from "../../components/cards/WorkerCard";
import WorkerRealstate from "../../components/cards/realestate/WorkerRealstate";
import RealstateSkeleton from "../../components/skeleton/RealstateSkeleton";
import Link from "next/link";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
// import "./styles.css";
// import required modules
import Modal from "@mui/material/Modal";

import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CloseIcon from "@mui/icons-material/Close";
import dynamic from "next/dynamic";
const InteractiveMap = dynamic(
  () => import("../../components/map/InteractiveMap"),
  { ssr: false }
);
import SpinnerModalLoader from "../../components/panel/SpinnerModalLoader";
import MainCatCard from "../../components/cards/MainCatCard";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import TuneIcon from "@mui/icons-material/Tune";
function valuetext(value) {
  return `${value}°C`;
}

const SingleCategory = (props) => {
  const router = useRouter();
  const { slug, id ,categories} = router.query;

  const [loading, set_loading] = useState(true);
  const [name, set_name] = useState(false);
  const [city, set_city] = useState(false);
  const [neighborhoods, set_neighborhoods] = useState([]);
  const [neighbor, set_neighbor] = useState();
  const [selected_neighborhoods, set_selected_neighborhoods] = useState([]);
  const [selected_neighborhoods_array, set_selected_neighborhoods_array] =
    useState([]);
  const [neighborhoods_worker, set_neighborhoods_worker] = useState([]);
  const [workers, set_workers] = useState([]);
  const [details, set_details] = useState([]);
  const [all_workers, set_all_workers] = useState([]);
  const [cats, set_cats] = useState([]);
  const [main_cats, set_main_cats] = useState();
  const [selectedcat, set_selectedcat] = useState(false);
  const [selectedparentcat, set_selectedparentcat] = useState(false);
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

  const minDistance = 10;

  /* fetch single worker data and Images */

  useEffect(() => {
    // {fetchWorker()}
    if (props.workers) {
      set_loading(false);
    }

    set_workers(props.workers);
    set_all_workers(props.workers);
    set_details(props.details);
    set_cats(props.subcategories);
    set_main_cats(props.main_cats);
    set_neighborhoods(props.neighborhoods);
    set_name(props.name);
    set_city(props.city);
    set_neighbor(props.neighbor);

    if (props.subcategories.length > 0) {
      // set_open_modal(true);
    }
  }, []);

  // filtering the workers section

  useEffect(() => {

    console.log('propeties change trigered in filtering trigered now-----');
    console.log(properties);
    console.log(normal_fields);

    var selected_normal_field = normal_fields.filter((field) => {
      if(field.low !== 0 || field.high=== properties) return field;

    })

    console.log('the selected_noraml_filed is ');
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

    if(is_in_range) return worker;

    
    
    })

    set_workers(fitering_on_range);
  }, [selectedcat, selected_neighborhoods_array,properties]); 

  // end of filtering in useeffect section

  useEffect(() => {
    if (neighbor != undefined) {
      const defalut_neighborhood = neighborhoods.find(function (item) {
        return item.name == neighbor;
      });

      // set_selected_neighborhoods_array([2]);
      set_selected_neighborhoods([
        ...selected_neighborhoods,
        defalut_neighborhood,
      ]);

      set_selected_neighborhoods_array([
        ...selected_neighborhoods_array,
        defalut_neighborhood.id,
      ]);
    } else {
      set_selected_neighborhoods(neighborhoods);

      set_workers(all_workers);
      neighborhoods.map((nb) => {
        // set_selected_neighborhoods([
        //   ...selected_neighborhoods,
        //   nb.id,
        // ]);
      });
    }
  }, [neighbor]);

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

  function AlterLoading() {
    set_loading(!loading);
  }

  const fetchWorker = (cat) => {
    if (cat == "all") {
      set_workers(all_workers);
    } else {
      // set_workers(all_workers.filter((item) => item.category_id == cat.id));
    }
  };

  function gotoOtherMainCatPage(cater) {
    router
      .replace({
        pathname: "/"+city+"/" + cater.name, 
        query: { name: cater.name, city: city },
      })
      .then(() => router.reload());
    //   router.reload({
    //     pathname: '/categories/'+cater.name,
    //     query: { name: cater.name  , city:city}
    // })
  }

  const renderMainSliderCategories = () => {
    return main_cats.map((cater) =>
      cater.id != selectedparentcat ? (
        // <Link replace
        //        href={`/categories/${name}?name=${name}&city=${city}`}
        //      >
        <div
          style={{ cursor: "pointer" }}
          onClick={() => gotoOtherMainCatPage(cater)}
        >
          <a>
            <p
              style={{
                background: "#f1f1f1",
                textAlign: "center",
                color: "gray",
                padding: 20,
                borderRadius: "5px",
              }}
            >
              {cater.name} 
            </p>
          </a>
        </div>
      ) : (
        // </Link>
        <></>
      )
    );
  };

  const handleParentClick = (cat) => {
    set_selectedcat(cat.id);

    set_selectedparentcat(cat.parent_id);
    set_selected_cat_name(cat.name);
    // fetchWorker(cat);

    set_open_modal(false);
  };

  const rednerModalContents = () => {
    if (loading) {
      return <SpinnerModalLoader />;
    }

    const onClickCloseModalButton = () => {
      set_open_modal(false);
    };

    const onPressingSingleNeighborCheckbox = (neighbor) => {
      set_selected_neighborhoods([...selected_neighborhoods, neighbor]);
      set_selected_neighborhoods_array([
        ...selected_neighborhoods_array,
        neighbor.id,
      ]);

      // set_workers(all_workers.filter((item) => item.category_id == cat.id));
    };

    const onDeletingingSingleNeighborCheckbox = (neighbor) => {
      set_selected_neighborhoods(
        selected_neighborhoods.filter((item) => item.id !== neighbor.id)
      );

      set_selected_neighborhoods_array(
        selected_neighborhoods_array.filter((item) => item !== neighbor.id)
      );
    };

    async function onClickResetFiledsFilterForm() {
      //  alert('todo : reset all filters');
      await  normal_fields.map((fl, index) => {
        console.log("the number of index in loop");
        console.log(index);
        set_properties((fl.low = 0));

         set_properties((fl.high = 0));
      });
    }
    const onClickResetNeighborhoodsForm = () => {
      set_selected_neighborhoods([]);
      set_selected_neighborhoods_array([]);
    };

    const onClickCheckAllNeighborhoodsForm = () => {
      set_selected_neighborhoods(neighborhoods);

      set_workers(all_workers);
      neighborhoods.map((nb) => {
        // set_selected_neighborhoods([
        //   ...selected_neighborhoods,
        //   nb.id,
        // ]);
      });
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

    function calculateSteps(fl) {
      // if(fl.low <1000){
      //   return 2;
      // }else{
      //   return 10;
      // }
    }

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

    function deleteFlFilter(fl){
      console.log('the fl must be deleted from filter');
      console.log(fl);
      var filtered = normal_fields.filter((x) => {
        return x.id === fl.id;
      });
      set_properties((filtered[0].low = 0));
      set_properties((filtered[0].high = 0));
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

                    {(fl.low > 0 || fl.high > 0 ) &&
                     <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={()=>deleteFlFilter(fl)}
                      >
                        حذف
                      </Button>
                    
                    }
                     
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
                          fl.low > 0
                            ? parseInt(fl.low)
                            : parseInt(fl.min_range),
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

    const renderOnOffNeighborhoods = (neighbor) => {
      const x = selected_neighborhoods.find(function (item) {
        return item.id == neighbor.id;
      });
      if (x) {
        return (
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<CheckBoxIcon />}
              onClick={() => onDeletingingSingleNeighborCheckbox(neighbor)}
              style={{
                textAlign: "right",
                justifyContent: "space-between",
              }}
            >
              <p>{neighbor.name}</p>
            </Button>
          </Grid>
        );
      } else {
        return (
          <Grid item xs={12} md={6} spacing={2}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<CheckBoxOutlineBlankIcon />}
              onClick={() => onPressingSingleNeighborCheckbox(neighbor)}
              style={{
                textAlign: "right",
                justifyContent: "space-between",
              }}
            >
              <p>{neighbor.name}</p>
            </Button>
          </Grid>
        );
      }
    };

    const renderNeighborhoodsList = () => {
      if (1) {
        return (
          <Grid container spacing={2} style={{ padding: 20 }}>
            {neighborhoods.map((neighbor) =>
              renderOnOffNeighborhoods(neighbor)
            )}
          </Grid>
        );
      }
    };

    const onClickConfirmFilteringNeighborhoods = () => {
      set_open_modal(false);
    };
    const onClickConfirmFilteringFileds = () => {
      set_open_modal(false);
    };

    const renderModalInsideContent = () => {
      if (modal_type == "subcategory") {
        return (
          <div style={{ padding: 50 }}>
            {cats.length > 0 ? (
              <div>
                <p
                  style={{
                    direction: "rtl",
                    textAlign: "center",
                    marginRight: 10,
                    color: "gray",
                    fontSize: 14,
                  }}
                >
                  {" "}
                  انتخاب از دسته بندی های {name}
                </p>
                {cats.map((cat) => (
                  <SwiperSlide key={cat.id}>
                    <CatCard2
                      selectedcat={selectedcat}
                      cat={cat}
                      handleParentClick={handleParentClick}
                    />
                  </SwiperSlide>
                ))}
              </div>
            ) : (
              <div
                style={{ cursor: "pointer" }}
                onClick={() => set_open_modal(false)}
              >
                <a>
                  <p
                    style={{
                      background: "#f1f1f1",
                      textAlign: "center",
                      color: "gray",
                      padding: 20,
                      borderRadius: "5px",
                    }}
                  >
                    {name}
                  </p>
                </a>
              </div>
            )}

            <Divider
              sx={{ borderBottomWidth: 5, background: "#555", margin: 3 }}
              fullWidth
            />
            <p
              style={{
                direction: "rtl",
                textAlign: "center",
                marginRight: 10,
                color: "gray",
                fontSize: 14,
                padding: 10,
              }}
            >
              و یا تغییر کامل دسته بندی
            </p>

            <Swiper
              slidesPerView={1}
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
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
              }}
              modules={[Pagination, Navigation]}
            >
              {renderMainSliderCategories()}
            </Swiper>
          </div>
        );
      } else if (modal_type == "neighborhood") {
        return (
          <div className={Styles["neighborhood-modal-wrapper"]}>
            <div className={Styles["neighborhood-modal-main-wrapper"]}>
              {renderNeighborhoodsList()}
            </div>
            <div className={Styles["neighborhood-modal-footer-wrapper"]}>
              {selected_neighborhoods.length > 0 ? (
                <Button
                  size="large"
                  variant="text"
                  style={{
                    fontSize: 13,
                    paddingRight: 30,
                    background: "white",
                    border: "1px solid black",
                    marginRight: 10,
                    textAlign: "center",
                  }}
                  onClick={onClickResetNeighborhoodsForm}
                >
                  پاک کردن انتخاب ها
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

              {selected_neighborhoods.length > 0 ? (
                <Button
                  size="large"
                  variant="contained"
                  style={{ fontSize: 15, width: 120 }}
                  onClick={onClickConfirmFilteringNeighborhoods}
                >
                  تایید{" "}
                </Button>
              ) : null}
            </div>
          </div>
        );
      } else if (modal_type == "filters") {
        return (
          <div style={{ padding: 10 }}>
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
    };

    return (
      <div className={Styles["modal-wrapper"]}>
        <div className={Styles["modal-header"]}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item md={2} xs={2}>
                {/* <CloseIcon  className={Styles['modal-header-close-button']}/> */}
                <Button onClick={onClickCloseModalButton} variant="text">
                  <CloseIcon className={Styles["modal-header-close-button"]} />
                </Button>
              </Grid>

              <Grid item md={10} xs={10}>
                {renderModalTitle()}
              </Grid>

              {workers.length}
            </Grid>
          </Box>
        </div>

        <div className={Styles["modal-main-wrapper"]}>
          {renderModalInsideContent()}
        </div>
      </div>
    );
  };

  const handleClose = () => {
    set_open_modal(false);
  };

  const renderModal = () => {
    return (
      <Modal
        open={open_modal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={Styles["modal-wrapper"]}>
          {/* {renderModalContent()} */}
          {rednerModalContents()}
        </Box>
      </Modal>
    );
  };

  const is_worker_in_range = (worker) => {
    const is_googd_to_go = true;
   var decoded_pr =  JSON.parse(worker.json_properties);
   
   var selected_decoded_pr = decoded_pr.filter((pr) => {
    if(pr.special ==1) return pr;

  })
   console.log('the decode pr is ------------------');
   console.log(selected_decoded_pr);


   normal_fields.map(nf=>{
    
    if(nf.special ==1 ){
      if(nf.low > 0 || nf.high > 0){


      
      const matched_pr_nf = selected_decoded_pr.find(function (pr) {
        return pr.name == nf.value;
      });

   
     

      const lower  = nf.low > 0 ? parseInt(nf.low) : parseInt(nf.min_range) ;
      const higher = nf.high > 0 ?  parseInt(nf.high) : parseInt(nf.max_range);

      
      console.log(matched_pr_nf.value); 
      console.log(' between');
      console.log(lower);
      console.log('and');
      console.log(higher);
      


      
      if(matched_pr_nf.value > lower && matched_pr_nf.value < higher ){
      
        console.log('in range');
      }else{
      //  console.log(matched_pr_nf.value); 
      //   console.log('not in range of between');
      //   console.log(lower);
      //   console.log('and');
      //   console.log(higher);
        
      console.log('not in range');
       
          is_googd_to_go = false;
       
        
      }
    }
  }
   })

  //  return decoded_pr[1].value
   return is_googd_to_go
  }

  function isPassedFilters(worker){
    var decoded_pr =  JSON.parse(worker.json_properties);
  }

  const renderWorkers = () => {
    if (workers.length > 0) {
      return workers.map((worker) => (
        <Grid item xl={3} md={4} xs={12} key={worker.id}>
         
           
            
          <a href="#" onClick={AlterLoading}>
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
        <Grid item md={12} xs={12} style={{background:'white'}}>
          <p style={{ textAlign: "center", padding: 20 }}>
            متاسفانه موردی یافت نشد
          </p>
          <div className="not-found-wrapper">
            <img
              className="not-found-image"
              src="/logo/not-found.png"
              alt="ملکی پیدا نشد"
              width={400}
              height={240}
            />
          </div>
        </Grid>
      );
    }
  };

  // const Main =() => {
  //   return cats.map(cat =>
  //     <SwiperSlide key={cat.id}>
  //         <CatCard2   selectedcat={selectedcat} cat={cat} handleParentClick={handleParentClick}/>
  //     </SwiperSlide>
  //    );
  //  }

  const Main = () => {
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

  // const renderSubCategories = () => {
  //   return (
  //     <div>
  //       <Swiper
  //         slidesPerView={3}
  //         spaceBetween={8}
  //         navigation
  //         breakpoints={{
  //           200: {
  //             slidesPerView: 2,
  //             spaceBetween: 10,
  //           },

  //           640: {
  //             slidesPerView: 2,
  //             spaceBetween: 10,
  //           },
  //           768: {
  //             slidesPerView: 4,
  //             spaceBetween: 20,
  //           },
  //           1024: {
  //             slidesPerView: 4,
  //             spaceBetween: 5,
  //           },
  //         }}
  //         modules={[Pagination, Navigation]}
  //         className={Styles["cat-swiper"]}
  //       >
  //         {Main()}
  //         <SwiperSlide key="all">
  //           <CatCard2
  //             selectedcat="all"
  //             cat="all"
  //             handleParentClick={handleParentClick}
  //           />
  //         </SwiperSlide>
  //       </Swiper>
  //     </div>
  //   );
  // };

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

  const clickToOpenfiltersSelection = () => {
    set_modal_type("filters");

    set_open_modal(true);
  };

  const clickToOpenSubcategorySelection = () => {
    set_modal_type("subcategory");
    set_open_modal(true);
  };

  const clickToOpenNeighborhoodSelection = () => {
    set_modal_type("neighborhood");
    set_open_modal(true);
  };

  const renderSubcategoryDialog = () => {
    if (1) {
      return (
        <div className={Styles["neighborhood-icon-wrapper"]}>
          <Button
            onClick={clickToOpenSubcategorySelection}
            endIcon={<KeyboardArrowDownIcon />}
            variant="contained"
            size="medium"
            fullWidth
          >
            {selected_cat_name ? selected_cat_name : "انتخاب دسته بندی"}
          </Button>
        </div>
      );
    }
  };

  const renderNeighborhoodDialog = () => {
    if (1) {
      return (
        <div className={Styles["neighborhood-icon-wrapper"]}>
          <Button
            onClick={clickToOpenNeighborhoodSelection}
            endIcon={<KeyboardArrowDownIcon />}
            variant="contained"
            size="medium"
            fullWidth
          >
            {selected_neighborhoods.length > 0
              ? selected_neighborhoods.length + ": محلات"
              : "انتخاب محله"}
          </Button>
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
            variant="contained"
            size="medium"
            fullWidth
          >
            <div>فیلترها</div>
            <TuneIcon />
          </Button>
        </div>
      );
    }
  };

  const renderHeader = () => {
    return (
      <div className={Styles["header-wrapper"]}>
        <Box sx={{ flexGrow: 0 }}>
          <Grid container spacing={0}>
            {/* <Grid item md={2} xs={2} >
              <p>filters</p>
              </Grid> */}

            <Grid item md={3} xs={5}>
              {renderSubcategoryDialog()}
            </Grid>

            <Grid item md={3} xs={4}>
              {renderNeighborhoodDialog()}
            </Grid>

            <Grid item md={3} xs={3}>
              {renderFiltersDialog()}
            </Grid>
          </Grid>
        </Box>
      </div>
    );
  };

  const renderBreadCrumb = () => {
    if (1) {
      return (
        <div className={Styles["breadcrumb-wrapper"]}>
        
          <p className={Styles["breadcrumb-p"]}>
            {" "}
            {name} در {city}
            {selected_neighborhoods.length > 0 ? " محلات " : " "}
            {selected_neighborhoods.map((neighbor) => neighbor.name + " , ")}
          </p>
        </div>
      );
    }
  };

  const renderOrSpinner = () => {
    if (!loading) {
      return (
        <div>
          <div className={Styles["realstate-items-wrapper"]}>
            <div>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  <Grid item md={2} xs={0}></Grid>

                  <Grid item md={2} xs={0}></Grid>
                </Grid>
              </Box>
            </div>
            {/* <div>





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
                    modules={[Pagination,Navigation]}
                    className={Styles['cat-swiper']}
                  >
                {Main()}
                <SwiperSlide key='all'>
                <CatCard2   selectedcat='all' cat='all' handleParentClick={handleParentClick}/>
         
      </SwiperSlide>
       

               </Swiper>

            </div> */}

            {renderHeader()}

            <div className={Styles["main-wrapper"]}>
              {renderBreadCrumb()}
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  {renderWorkers()}
                </Grid>
              </Box>
            </div>
          </div>

          {renderModal()}
        </div>
      );
    } else {
      return (
        <div className="spinnerImageView">
          <img
            className="spinner-image"
            src="/logo/ajour-gif.gif"
            alt="ajur logo"
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
        <title>مشاور املاک هوشمند آجر | {details.name} </title>
        <meta name="description" content={details.description} />
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta property="og:locale" content="fa_IR" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fa_IR" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Ajur| مشاور املاک هوشمند آجر " />
        <meta
          property="og:description"
          content="از خرید و فروش خانه و ویلا تا مشاوره برای سرمایه گزاری در مشاور املاک هوشمند آجر"
        />
        <meta
          property="og:url"
          content={
            "https://ajur.app/realestates/" +
            details.id +
            "?slug=" +
            details.slug
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
        <meta property="og:image" content={details.profile_url} />
        <meta property="og:image:width" content="840" />
        <meta property="og:image:height" content="840" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:label1" content="Written by" />
        <meta name="twitter:data1" content={details.name} />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="canonical"
          href={
            "https://ajur.app/realestates/" +
            details.id +
            "?slug=" +
            details.slug
          }
        />
      </Head>
      {renderOrSpinner()}
    </div>
  );
};

export async function getServerSideProps(context) {
  const { params } = context;

  const name = params.name;
  const categories_city = params.categories;

  // const city = context.query.city ? context.query.city : "رباط کریم";

  const city = categories_city? categories_city : "رباط کریم";

  const subcat = context.query.subcat ? context.query.subcat : null;

  const neighbor = context.query.neighbor ? context.query.neighbor : null;

  const res = await fetch(
    `https://api.ajur.app/api/main-category-workers?subcat=${subcat}&catname=${name}&city=${city}`
  );
  const data = await res.json();
  return {
    props: {
      details: data.details,
      workers: data.workers,
      all_workers: data.workers,
      specials: data.specials,
      uppers: data.uppers,
      subcategories: data.subcategories,
      main_cats: data.main_cats,
      name: name,
      city: city,
      neighborhoods: data.the_neighborhoods,
      neighbor: neighbor,
    }, // will be passed to the page component as props
  };
}

export default SingleCategory;
