import React, { useState } from "react";
import Style from "../../../styles/G-ads/new-ad-page.module.css";
// import GDashboardLayout from "../../components/layouts/GDashboardLayout";
import GDashboardLayout from "../../../components/layouts/GDashboardLayout";
import OffersModal from "../../../components/G-ads/OffersModal";
import AdNameInput from "../../../components/G-ads/AdNameInput";
import CitySelector from "../../../components/G-ads/CitySelector";
import CatSelector from "../../../components/G-ads/CatSelector";
import axios from "axios";
import Cookies from 'js-cookie';
import { useEffect } from "react";

// Client-side only token retrieval
const getToken = () => {
  if (typeof window !== 'undefined') {
    return Cookies.get('id_token');
  }
  return null;
};

function SubmitButton({ onClick, disabled }) {
  return (
    <button
      className={Style["submit-button"]}
      onClick={onClick}
      disabled={disabled}
    >
      ثبت
    </button>
  );
}

function NewAdPage() {
  const [adName, setAdName] = useState("تبلیغ جدید ۱");
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedCats, setSelectedCats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [token, setToken] = useState(null);

  // Set token on client side only
  useEffect(() => {
    setToken(getToken());
  }, []);

  const handleCreateGAds = async ({ adName, selectedCats, selectedCities }) => {
    const currentToken = token || getToken();
    
    if (!currentToken) {
      console.error("❌ No token available");
      return;
    }

    setShowModal(true);

    const cityNames = selectedCities.map(city => city.id);
    const catId = selectedCats.map(cat => cat.id);

    const payload = {
      token: currentToken,
      ad_name: adName,
      cities: cityNames,
      cats: catId,
    };

    console.log("📤 Payload to send:", payload);

    try {
      const response = await axios.post("https://api.ajur.app/api/google-ads/new", payload);
      console.log("✅ Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to create GADS ID:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    try {
      await handleCreateGAds({
        adName,
        selectedCats,
        selectedCities,
      });
    } catch (error) {
      console.error("Submission failed:", error);
      // Handle error state here if needed
    }
  };

  const isSubmitDisabled = selectedCities.length === 0 ||
    selectedCats.length === 0 ||
    !adName.trim() ||
    !token;

  return (
    <div className={Style["main-wrapper"]}>
      <div className={Style["modal-wrapper"]}>
        <OffersModal open={showModal} setOpen={setShowModal} />
      </div>
      <div className={Style["query-section"]}>
        <div className={Style["ad-name"]}>
          <AdNameInput adName={adName} setAdName={setAdName} />
        </div>

        <div className={Style["city-select"]}>
          <CitySelector
            selectedCities={selectedCities}
            setSelectedCities={setSelectedCities}
          />
        </div>

        <div className={Style["cat-select"]}>
          <CatSelector
            selectedCats={selectedCats}
            setSelectedCats={setSelectedCats}
          />
        </div>

        <div className={Style["submit-wrapper"]}>
          <SubmitButton
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
          />
        </div>
      </div>
    </div>
  );
}

export default NewAdPage;

NewAdPage.getLayout = function (page) {
  return <GDashboardLayout>{page}</GDashboardLayout>;
};