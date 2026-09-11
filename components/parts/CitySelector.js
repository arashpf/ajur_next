import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CityContext } from "./CityContext";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

// MUI components
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const CitySelector = ({ handleCitySelect }) => {
  const { currentCity, updateCity } = useContext(CityContext);

  const [showModal, setShowModal] = useState(false);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Tooltip visibility
  const [showTooltip, setShowTooltip] = useState(false);

  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const router = useRouter();

  // Show tooltip ONCE if no city selected
  useEffect(() => {
    const seen = Cookies.get("city_tooltip_seen");

    if (!currentCity && !seen) {
      setShowTooltip(true);
      Cookies.set("city_tooltip_seen", "true", { expires: 365 });
    }
  }, [currentCity]);

  // Fetch cities
  useEffect(() => {
    if (!showModal) return;

    const timer = setTimeout(fetchCities, 300);
    return () => clearTimeout(timer);
  }, [showModal, searchQuery]);

  const fetchCities = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "https://api.ajur.app/api/search-cities",
        {
          params: { title: searchQuery || "" },
          timeout: 5000,
        }
      );

      setCities(response.data?.items || getDefaultCities());
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCities(getDefaultCities());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultCities = () => [
    { id: 1, title: "تهران" },
    { id: 2, title: "رباط کریم" },
    { id: 3, title: "کرج" },
    { id: 4, title: "اصفهان" },
    { id: 5, title: "مشهد" },
  ];

  const handleCitySelection = async (city) => {
    try {
     
      const success = await updateCity(city);

      if (success) {
        Cookies.set("persian_city", city.title);
        Cookies.set("city", city.slug);

        router.push(`/${city.slug}`).then(() => {
          // window.location.reload();
        });

        setShowModal(false);
        setSearchQuery("");

        setSnackbarMessage(`شهر ${city.title} با موفقیت انتخاب شد`);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        if (handleCitySelect) handleCitySelect(city);
      }
    } catch (error) {
      setSnackbarMessage("ذخیره شهر با مشکل مواجه شد");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseModal = () => {
    if (!currentCity) {
      setSnackbarMessage("انتخاب شهر الزامی است");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }
    setShowModal(false);
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  // Inline bounce animation keyframes
  const bounceAnimation = `
    @keyframes tooltipBounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(6px); }
    }
  `;

  return (
    <>
      {/* Inject animation keyframes */}
      <style>{bounceAnimation}</style>

      {/* Tooltip Wrapper */}
      <div className="relative inline-block">

        {/* TOOLTIP BELOW BUTTON */}
        {showTooltip && (
          <div
            className="
              absolute top-14 right-30
              bg-gray-800 text-white text-sm p-3 rounded-lg shadow-lg
              w-56 text-center font-sans z-50
            "
            style={{
              animation: "tooltipBounce 1.4s infinite ease-in-out",
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute top-1 left-1 text-gray-300 hover:text-white text-lg leading-none"
            >
              ×
            </button>

              با انتخاب شهر از اینجا میتوانید آگهی های آن شهر را ببینید

            {/* Upward arrow */}
            <div
              className="
                absolute -top-2 right-40 w-0 h-0 
                border-l-8 border-r-8 border-b-8
                border-b-gray-800 border-l-transparent border-r-transparent
              "
            ></div>
          </div>
        )}

        {/* BUTTON */}
        <button
          className="
             py-2 px-3 rounded-lg bg-gray-50 border border-gray-300
            max-w-[120px] h-12 flex items-center justify-center
            hover:bg-gray-100 transition-colors
          "
          onClick={() => {
            setShowModal(true);
            setShowTooltip(false);
          }}
        >
          <div className="flex flex-row-reverse items-center gap-1">
            <LocationOnIcon style={{ color: "#6b7280" }} />
            <span className="text-sm text-gray-700 font-sans truncate max-w-[80px]">
              {currentCity?.title || "انتخاب شهر"}
            </span>
          </div>
        </button>

      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={handleCloseModal}
          />

          <div className="absolute bottom-0 left-0 right-0 bg-white p-5 h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-row-reverse items-center justify-between mb-3">
              <h2 className="text-xl text-gray-700 font-sans mr-2">
                انتخاب شهر
              </h2>

              {currentCity && (
                <button
                  className="p-2 text-gray-500 hover:text-gray-700"
                  onClick={handleCloseModal}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Search */}
            <div className="flex flex-row-reverse items-center bg-gray-100 rounded-lg px-3 py-2 mb-4">
              <input
                type="text"
                className="flex-1 bg-transparent text-right text-gray-800 text-base outline-none ml-2"
                placeholder="جستجوی شهر..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchIcon style={{ color: "#9CA3AF" }} />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                  <div className="space-y-0">
                    {cities.map((item) => (
                      <button
                        key={item.id}
                        className="
                        w-full flex flex-row-reverse items-center justify-between
                        py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors
                      "
                        onClick={() => handleCitySelection(item)}
                      >
                        <span className="text-base text-gray-700 font-sans pr-5">
                          {item.title}
                        </span>

                        {currentCity?.id === item.id && (
                          <span className="text-blue-500 text-lg">✓</span>
                        )}
                      </button>
                    ))}

                    {cities.length === 0 && (
                      <div className="text-center text-gray-500 py-8 font-sans">
                        شهری یافت نشد
                      </div>
                    )}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{
            width: "100%",
            fontFamily: "sans-serif",
            fontSize: "1rem",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CitySelector;