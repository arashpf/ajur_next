import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CityContext } from "./CityContext";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/router";

const CitySelector = ({ handleCitySelect }) => {
  const {
    currentCity,
    updateCity,
    isLoading: contextLoading,
  } = useContext(CityContext);
  const [showModal, setShowModal] = useState(false);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  // Fetch cities when modal opens or search query changes
  useEffect(() => {
    if (!showModal) return;

    const timer = setTimeout(() => {
      fetchCities();
    }, 300);

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
        // Update URL with city title
        router.push(`/${city.title}`, undefined, { shallow: true });

        setShowModal(false);
        setSearchQuery("");
        alert(`شهر ${city.title}`)
      }

      if (handleCitySelect) {
        handleCitySelect(city);
      }
    } catch (error) {
      alert("خطا", "ذخیره شهر با مشکل مواجه شد");
    }
  };

  const handleCloseModal = () => {
    if (!currentCity) {
      alert("انتخاب شهر الزامی است", "لطفاً یک شهر را انتخاب کنید");
      return;
    }
    setShowModal(false);
  };

  return (
    <>
      <button
        className="mr-2 py-2 px-3 rounded-lg bg-gray-50 border border-gray-300 max-w-[120px] h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
        onClick={() => setShowModal(true)}
        data-testid="citySelectorButton"
      >
        <div className="flex flex-row-reverse items-center gap-1">
          <LocationOnIcon style={{ color: "#6b7280" }} />
          <span className="text-sm text-gray-700 font-sans text-right truncate max-w-[80px]">
            {currentCity?.title || "انتخاب شهر"}
          </span>
        </div>
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={handleCloseModal}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 h-4/5 flex flex-col">
            {/* Header */}
            <div className="flex flex-row-reverse items-center justify-between mb-5">
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

            {/* City List */}
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
                      className="w-full flex flex-row-reverse items-center justify-between py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
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
    </>
  );
};

export default CitySelector;
