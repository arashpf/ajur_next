import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import Link from "next/link"
import { useRouter } from "next/router"
import Cookies from "js-cookie"
import styles from "../styles/SearchDiv.module.css"
import InfoIcon from "@mui/icons-material/Info"
import { createTheme, ThemeProvider, styled } from "@mui/material/styles"
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip"
import ClickAwayListener from "@mui/material/ClickAwayListener"
import Button from "@mui/material/Button"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Navigation } from "swiper"
import SmartSearchBox from "./SmartSearchBox"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "font-awesome/css/font-awesome.min.css"

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    minWidth: 300,
    maxWidth: 500,
  },
})

const defaultTheme = createTheme()
const theme = createTheme({
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "1.2em",
          color: "#a1a1a1",
          backgroundColor: "black",
          textAlign: "right",
          padding: 20,
          fontFamily: "iransans",
        },
      },
    },
  },
})

export default function SearchDiv({ the_city, the_neighborhoods, loading }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selected_city, set_selected_city] = useState("robat")

  useEffect(() => {
    const selected = Cookies.get("selected_city")
    set_selected_city(selected || "robat")
  }, [])

  const handleTooltipClose = () => setOpen(false)
  const handleTooltipOpen = () => setOpen(true)

const handleSmartSearch = (filters) => {
  loading?.()

  const category = filters.category_name || "فروش خانه"
  const city = filters.city || selected_city

  console.log("SmartSearch detected:", filters)
  console.log("Using city:", city)

  let url = `/${city}/${encodeURIComponent(category)}?city=${city}`

  if (filters.neighbor) url += `&neighbor=${filters.neighbor}`
  if (filters.price) url += `&priceMax=${filters.price}`
  if (filters.area) url += `&minArea=${filters.area}`
  if (filters.rooms) url += `&rooms=${filters.rooms}`
  if (filters.parking) url += `&features=پارکینگ`

  router.push(url)
}


  const renderNeighborhoods = () =>
    the_neighborhoods.map((neighbor) => (
      <SwiperSlide key={neighbor.id} onClick={loading}>
        <Link
          href={`/${the_city.title}/فروش%20خانه?neighbor=${neighbor.name}&city=${selected_city}`}
        >
          <Button
            variant="contained"
            size="small"
            fullWidth
            style={{ background: "#b92a31" }}
          >
            <p>{neighbor.name}</p>
          </Button>
        </Link>
      </SwiperSlide>
    ))

  const rendertooltip = () => (
    <div>
      <p style={{ color: "#e2e2e2" }}>{the_city.description}</p>
      {the_city.link && <a href={the_city.link}>اطلاعات بیشتر</a>}
    </div>
  )

  return (
    <ThemeProvider theme={defaultTheme}>
      <div
        className={styles["search-div-wrapper"]}
        style={{
          backgroundImage: !the_city.video
            ? `url(${the_city.avatar_url})`
            : null,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className={styles["navbar-about-place"]}>
          <ThemeProvider theme={theme}>
            <ClickAwayListener onClickAway={handleTooltipClose}>
              <div>
                <CustomWidthTooltip
                  PopperProps={{ disablePortal: true }}
                  onClose={handleTooltipClose}
                  open={open}
                  disableFocusListener
                  disableHoverListener
                  disableTouchListener
                  title={rendertooltip()}
                >
                  <InfoIcon
                    onClick={handleTooltipOpen}
                    enterTouchDelay={0}
                    style={{ margin: 10, cursor: "pointer" }}
                  />
                </CustomWidthTooltip>
              </div>
            </ClickAwayListener>
          </ThemeProvider>
          <p>{the_city.avatar_title}</p>
        </div>

        <div
          className={`${styles["navar-brand-center"]} ${styles["navbar-serach"]}`}
          style={{ padding: "8px 0", maxWidth: "600px", margin: "0 auto" }}
        >
          <div className={styles["search-box-wrapper"]}>
            <SmartSearchBox onSearch={handleSmartSearch} />
          </div>
        </div>

        <div className={styles["neighborhoods-wrapper"]}>
          <Swiper
            slidesPerView={1}
            spaceBetween={5}
            navigation={false}
            pagination={{ clickable: true, enabled: true }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
        breakpoints={{
  200: { slidesPerView: 3, spaceBetween: 3 },
  640: { slidesPerView: 6, spaceBetween: 3 },
  768: { slidesPerView: 7, spaceBetween: 3 },
  1024: { slidesPerView: 7, spaceBetween: 3 },
}}

            modules={[Pagination, Navigation]}
            className={styles["neighborh-swiper"]}
          >
            {renderNeighborhoods()}
          </Swiper>
        </div>
      </div>
    </ThemeProvider>
  )
}
