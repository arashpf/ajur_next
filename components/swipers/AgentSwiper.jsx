import React, { useRef } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper";
import SmallCard from "../cards/SmallCard";

import "swiper/css";
import "swiper/css/free-mode";

const AgentSwiper = ({ agents = [] }) => {
  const swiperRef = useRef(null);

  if (!Array.isArray(agents) || agents.length === 0) {
    return null;
  }

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        my: 2,
      }}
    >
      <IconButton
        aria-label="مشاور قبلی"
        onClick={handlePrev}
        sx={{
          position: "absolute",
          zIndex: 10,
          left: { xs: -8, md: 4 },
          top: "50%",
          transform: "translateY(-50%)",
          width: 40,
          height: 40,
          bgcolor: "rgba(20,20,20,0.75)",
          color: "#fff",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          "&:hover": {
            bgcolor: "#7a1f2b",
          },
        }}
      >
        <KeyboardArrowLeftIcon />
      </IconButton>

      <IconButton
        aria-label="مشاور بعدی"
        onClick={handleNext}
        sx={{
          position: "absolute",
          zIndex: 10,
          right: { xs: -8, md: 4 },
          top: "50%",
          transform: "translateY(-50%)",
          width: 40,
          height: 40,
          bgcolor: "rgba(20,20,20,0.75)",
          color: "#fff",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          "&:hover": {
            bgcolor: "#7a1f2b",
          },
        }}
      >
        <KeyboardArrowRightIcon />
      </IconButton>

      <Swiper
        modules={[FreeMode]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        freeMode
        grabCursor
        slidesPerView="auto"
        spaceBetween={16}
        watchOverflow
        observer
        observeParents
        style={{
          width: "100%",
          padding: "8px 4px",
        }}
      >
        {agents.map((agent, index) => (
          <SwiperSlide
            key={agent?.id || agent?.slug || index}
            style={{
              width: "180px",
              height: "auto",
            }}
          >
            <SmallCard
              realEstate={agent}
              profileImageKey="profile_url"
              compact
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

AgentSwiper.propTypes = {
  agents: PropTypes.arrayOf(PropTypes.object),
};

export default React.memo(AgentSwiper);
