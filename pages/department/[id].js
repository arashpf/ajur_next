import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import Head from "next/head";
import Styles from "../../components/styles/RealstateSingle.module.css";
import axios from "axios";
import CatCard2 from "../../components/cards/CatCard2";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import WorkerCard from "../../components/cards/WorkerCard";
import CallIcon from "@mui/icons-material/Call";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import RealstateSkeleton from "../../components/skeleton/RealstateSkeleton";
import Link from "next/link";
import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import DepartmentHead from "../../components/panel/department/parts/DepartmentHead";
import RealStateSmalCard from "../../components/cards/realestate/RealStateSmalCard";
import LazyLoader from "../../components/lazyLoader/Loading";

// Import the WorkerFilter component
import WorkerFilter from "../../components/WorkerFilter";

const singleDeparment = (props) => {
  const router = useRouter();
  const { slug, id } = router.query;

  console.log("the department come form the ssr is : --------");
  console.log(props.department);

  const [loading, set_loading] = useState(true);
  const [workers, set_workers] = useState([]);
  const [all_workers, set_all_workers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [department, set_department] = useState("");
  const [department_agents, set_department_agents] = useState("");
  const [cats, set_cats] = useState([]);
  const [selectedcat, set_selectedcat] = useState("all");
  const [selected_cat_name, set_selected_cat_name] = useState("همه فایل ها");
  const [isFilterSticky, setIsFilterSticky] = useState(false);

  // Scroll detection for sticky filter
  useEffect(() => {
    const handleScroll = () => {
      const filterSection = document.getElementById("filter-section");
      if (filterSection) {
        const rect = filterSection.getBoundingClientRect();
        // When filter section reaches top of viewport, make it sticky
        setIsFilterSticky(rect.top <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (props.department) {
      set_loading(false);
    }

    set_department(props.department);
    set_department_agents(props.department_agents);
    console.log("the department agents ------");
    console.log(props.department_agents);

    set_workers(props.workers);
    set_all_workers(props.workers);
    setFilteredWorkers(props.workers); // Initialize filtered workers
    set_cats(props.subcategories);
  }, []);

  const handleParentClick = (cat) => {
    console.log("Category selected:", cat);

    if (cat === "all") {
      set_selectedcat("all");
      set_selected_cat_name("همه فایل ها");
      set_workers(all_workers);
      setFilteredWorkers(all_workers);
    } else {
      set_selectedcat(cat.id);
      set_selected_cat_name(cat.name);
      const filtered = all_workers.filter((item) => item.category_id == cat.id);
      set_workers(filtered);
      setFilteredWorkers(filtered);
    }
  };

  const renderDeparmentHead = () => {
    if (department.id) {
      return <DepartmentHead department={department} />;
    } else {
      return <RealstateSkeleton />;
    }
  };

  const renderWorkers = () => {
    if (!filteredWorkers || filteredWorkers.length === 0) {
      return (
        <Grid item xs={12}>
          <Box sx={{ textAlign: "center", py: 4 }}>
            <p style={{ fontSize: "18px", color: "#666" }}>
              متاسفانه موردی یافت نشد ❌
            </p>
            <img
              src="/logo/not-found.png"
              alt="موردی یافت نشد"
              width={200}
              height={120}
              style={{ marginTop: "20px" }}
            />
          </Box>
        </Grid>
      );
    }

    return (
      <LazyLoader
        items={filteredWorkers}
        itemsPerPage={8}
        delay={800}
        renderItem={(worker) => (
          <Link
            href={`/worker/${worker.id}?slug=${worker.slug}`}
            key={worker.id}
          >
            <Grid item md={4} xs={12} key={worker.id}>
              
                <WorkerCard worker={worker} />
              
            </Grid>
          </Link>
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

  // Sticky filter section
  const renderFilterSection = () => {
    return (
      <Box
        id="filter-section"
        sx={{
          mb: 3,
          mt: 2,
          position: isFilterSticky ? "fixed" : "relative",
          top: isFilterSticky ? 0 : "auto",
          left: 0,
          right: 0,
          zIndex: isFilterSticky ? 1000 : "auto",
          backgroundColor: isFilterSticky ? "white" : "transparent",
          padding: isFilterSticky ? "12px 16px" : "0",
          boxShadow: isFilterSticky ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
          borderBottom: isFilterSticky ? "1px solid #e0e0e0" : "none",
        }}
      >
        <WorkerFilter
          workers={selectedcat === "all" ? all_workers : workers}
          onFilteredWorkersChange={setFilteredWorkers}
          enableLocalCategoryFilter={true}
          availableCategories={cats}
        />
      </Box>
    );
  };

  // Add spacer when filter is sticky to prevent content jump
  const renderStickySpacer = () => {
    if (isFilterSticky) {
      return (
        <Box sx={{ height: "70px" }} /> // Adjust height based on your filter button height
      );
    }
    return null;
  };

  const renderDepartmentAgents = () => {
    if (department_agents && department_agents.length > 0) {
      return department_agents.map((realstate) => (
        <SwiperSlide key={realstate.id}>
          <Link
            href={`/realestates/${
              realstate.user_id ? realstate.user_id : realstate.id
            }?slug=${realstate.slug}`}
          >
           
              <RealStateSmalCard key={realstate.id} realstate={realstate} />
          
          </Link>
        </SwiperSlide>
      ));
    }
    return null;
  };

  const onclickJoinRequest = () => {
    set_loading(true);
  };

  const renderOrSpinner = () => {
    if (!loading) {
      return (
        <div>
          <div className={Styles["realstate-items-wrapper"]}>
            {/* Department Header */}
            <Box sx={{ flexGrow: 1, mb: 4 }}>
              <Grid container spacing={2}>
                <Grid item md={2} xs={0}></Grid>
                <Grid item md={8} xs={12}>
                  {renderDeparmentHead()}
                </Grid>
                <Grid item md={2} xs={0}></Grid>
              </Grid>
            </Box>

            {/* Contact Buttons */}
            <div className={Styles["contact-wrapper"]}>
              <Box
                component="div"
                sx={{
                  p: 2,
                  border: "1px dashed grey",
                  margin: "5px",
                  textAlign: "center",
                  mb: 4,
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
                      {department && department.head_phone}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </div>

            {/* Department Agents */}
            {department_agents && department_agents.length > 0 && (
              <>
                <div className={Styles["title"]}>
                  <h2>
                    {" "}
                    مشاورین {department.name} ({department_agents.length} عضو)
                  </h2>
                </div>

                <div>
                  <Swiper
                    slidesPerView={1}
                    spaceBetween={8}
                    navigation
                    pagination={{ clickable: true }}
                    breakpoints={{
                      200: { slidesPerView: 2, spaceBetween: 5 },
                      640: { slidesPerView: 2, spaceBetween: 10 },
                      768: { slidesPerView: 5, spaceBetween: 20 },
                      1400: { slidesPerView: 7, spaceBetween: 30 },
                    }}
                    modules={[Pagination, Navigation]}
                    className={Styles["cat-swiper"]}
                  >
                    {renderDepartmentAgents()}
                  </Swiper>
                </div>
              </>
            )}

            {/* Files Categories */}

            {/* Filter Section - Always Visible */}
            {renderFilterSection()}

            {/* Spacer for sticky filter */}
            {renderStickySpacer()}

            {/* Workers Grid */}
            <Box sx={{ flexGrow: 1, py: 3, px: 3 }}>
              <Grid container spacing={2}>
                {renderWorkers()}
              </Grid>
            </Box>
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
        <meta charSet="UTF-8" />
        <meta name="robots" content="max-image-preview:large" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
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
    },
  };
}

export default singleDeparment;
