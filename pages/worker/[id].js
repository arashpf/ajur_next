import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import Head from "next/head";
import dynamic from "next/dynamic";
import axios from "axios";
import Cookies from 'js-cookie';
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Link from "next/link";


// Components
import WorkerMedia from "../../components/workers/WorkerMedia";
import WorkerCard from "../../components/cards/WorkerCard";
import WorkerDetails from "../../components/workers/WorkerDetails";
import WorkerShare from "../../components/workers/WorkerShare";

// Dynamic imports
const LocationNoSsr = dynamic(() => import("../../components/map/Location"), {
  ssr: false,
});

// Styles
import Styles from "../../components/styles/WorkerSingle.module.css";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const WorkerSingle = (props) => {
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();
  const { slug, id } = router.query;

  const {
    details,
    properties,
    realstate,
    relateds,
    images,
    videos,
    virtual_tours
  } = props;


  



  useEffect(() => {
    // Check if this worker is favorited
    const favorited = Cookies.get('favorited');
    if (favorited) {
      const favoriteItems = JSON.parse(favorited);
      setIsFavorite(favoriteItems.includes(details.id));
    }

    // Add to browsing history
    let history = Cookies.get("history") || '[]';
    let historyItems = JSON.parse(history);
    
    // Remove if already exists and add to end
    historyItems = historyItems.filter(item => item !== details.id);
    historyItems.push(details.id);
    
    // Keep only last 10 items
    if (historyItems.length > 10) {
      historyItems = historyItems.slice(-10);
    }
    
    Cookies.set('history', JSON.stringify(historyItems));

    // Set loading to false when data is ready
    if (details) {
      setLoading(false);
    }
  }, [details, id]);

  const toggleFavorite = () => {
    let favorited = Cookies.get('favorited') || '[]';
    let favoriteItems = JSON.parse(favorited);
    
    if (isFavorite) {
      // Remove from favorites
      favoriteItems = favoriteItems.filter(item => item !== details.id);
      Cookies.set('favorited', JSON.stringify(favoriteItems));
    } else {
      // Add to favorites
      if (!favoriteItems.includes(details.id)) {
        favoriteItems.push(details.id);
        // Keep only last 20 items
        if (favoriteItems.length > 20) {
          favoriteItems = favoriteItems.slice(-20);
        }
        Cookies.set('favorited', JSON.stringify(favoriteItems));
      }
    }
    
    setIsFavorite(!isFavorite);
  };

  const renderSeoHeader = () => {
    return (
      <Head>
        <meta charSet="UTF-8" />
        <meta name="robots" content="max-image-preview:large" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <title>
          {details.name} {" در "} {details.category_name} - {details.region} -{" "}
          {details.city}{" "}
        </title>

        <meta
          name="description"
          content={
            details.description ||
            `${details.category_name} - ${details.name} - ${details.city} ${details.region}`
          }
        />
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />

        <meta property="og:locale" content="fa_IR" />
        <meta property="og:type" content="product" />
        <meta
          property="og:title"
          content={`${details.category_name} ${details.region} ${details.city}`}
        />
        <meta
          property="og:description"
          content={`${details.name} - ${details.category_name}`}
        />
        <meta
          property="og:url"
          content={`https://ajur.app/worker/${details.id}?slug=${slug}`}
        />
        <meta property="og:site_name" content="مشاور املاک هوشمند آجر" />
        <meta property="article:published_time" content={details.created_at} />
        <meta property="article:modified_time" content={details.updated_at} />
        <meta property="og:image" content={details.thumb} />
        <meta property="og:image:width" content="256" />
        <meta property="og:image:height" content="256" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:label1"
          content={`فایل های املاک ${realstate.name}`}
        />
        <meta name="twitter:data1" content={realstate.name} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={`https://ajur.app/worker/${details.id}`} />
      </Head>
    );
  };

  const goToRelatedWorker = (worker) => {
    window.location.href = `/worker/${worker.id}?slug=${worker.slug}`;
  };

  const renderRelatedWorkers = () => {
    return relateds.map((worker) => (
      <Grid item xs={12} md={4} key={worker.id}>
        <a
          style={{ cursor: "pointer" }}
          onClick={() => goToRelatedWorker(worker)}
        >
          <WorkerCard worker={worker} />
        </a>
      </Grid>
    ));
  };

  return (
    <>
      {renderSeoHeader()}

      {/* <WorkerMedia 
  images={images}
  videos={videos}
  virtualTours={virtualTours}
  loading={loading}
/> */}
      <div className={`${Styles["scroll-div"]} ${Styles["worker-single"]}`}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={5}>
              <div className={Styles["favorite-icon"]} onClick={toggleFavorite}>
                {isFavorite ? (
                  <FavoriteIcon style={{ color: '#b92a31' }} />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </div>
              <WorkerMedia 
                images={images} 
                videos={videos} 
                virtual_tours={virtual_tours}
                loading={loading} 
                 
              />
            </Grid>

            <Grid item xs={12} md={7}>
              <div className={Styles["worker-single-details"]}>
                <WorkerDetails
                  isFavorite={isFavorite}
                  onFavoriteToggle={toggleFavorite}
                  details={details}
                  properties={properties}
                  realstate={realstate}
                />
              </div>
            </Grid>
          </Grid>
        </Box>

        <div className={Styles["title"]}>
          <h2>موقعیت روی نقشه</h2>
        </div>

        <LocationNoSsr details={details} />

        <WorkerShare details={details} slug={slug} />

        <div className={Styles["title"]}>
          <h2>
            {"موارد دیگر"} {details.category_name} {"در"} {details.neighbourhood} {details.city}
          </h2>
        </div>

        <div>
          <Grid container spacing={1}>
            {renderRelatedWorkers()}
          </Grid>
        </div>

        <div className={Styles["more-wrapper"]}>
          <Link
            href={`/${details.city}/${details.category_name}?subcat=${details.category_name}&neighbor=${details.neighbourhood}&city=${details.city}`}
            passHref
          >
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<ArrowDropDownIcon />}
            >
              دیدن موارد بیشتر
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

WorkerSingle.propTypes = {
  details: PropTypes.object.isRequired,
  images: PropTypes.array.isRequired,
  videos: PropTypes.array.isRequired,
  virtual_tours: PropTypes.array.isRequired,
  properties: PropTypes.array.isRequired,
  realstate: PropTypes.object.isRequired,
  relateds: PropTypes.array.isRequired,
};

export async function getServerSideProps(context) {
  const { params } = context;
  const id = params.id;
  
  try {
    const res = await fetch(`https://api.ajur.app/api/posts/${id}`);
    const data = await res.json();

   

    return {
      props: {
        details: data.details,
        images: data.images || [],
        videos: data.videos || [],
        virtual_tours: data.virtual_tours || [],
        properties: data.properties || [],
        realstate: data.realstate || {},
        relateds: data.relateds || [],
      },
    };
  } catch (error) {
    console.error("Error fetching worker data:", error);
    return {
      notFound: true,
    };
  }
}

export default WorkerSingle;