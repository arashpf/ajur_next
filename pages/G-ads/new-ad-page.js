import React, { useState, useRef, useEffect } from "react";
import Style from "../../styles/G-ads/new-ad-page.module.css";
import { Modal, Box } from "@mui/material";
import GDashboardLayout from "../../components/layouts/GDashboardLayout";
import OffersModal from "../../components/G-ads/OffersModal";
import AdNameInput from "../../components/G-ads/AdNameInput";
import CitySelector from "../../components/G-ads/CitySelector";
import CatSelector from "../../components/G-ads/CatSelector";
import axios from "axios"; // ✅ Import axios
import Cookies from 'js-cookie';
import { CatchingPokemonSharp } from "@mui/icons-material";


let token = Cookies.get('id_token')


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

    const handleCreateGAds = async ({ adName, token, selectedCats, selectedCities }) => {
        setShowModal(true);

        const cityNames = selectedCities.map(city => city.id);
        const catId = selectedCats.map(cat => cat.id);

        const payload = {
            token: token,
            ad_name: adName,
            cities: cityNames,
            cats: catId,
        };

        console.log("cityID" + catId)

        console.log("📤 Payload to send:", payload);

        try {
            const response = await axios.post("https://api.ajur.app/api/google-ads/new", payload);
            console.log("✅ Response:", response.data);
        } catch (error) {
            console.error("❌ Failed to create GADS ID:", error);
        }
    };


    const handleSubmit = () => {
        handleCreateGAds({
            adName,
            userId,
            selectedCats,
            selectedCities,
        });
    };

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
                        disabled={
                            selectedCities.length === 0 ||
                            selectedCats.length === 0 ||
                            !adName.trim()
                        }
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
