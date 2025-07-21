import React, { useState, useRef, useEffect } from "react";
import Style from "../../styles/G-ads/new-ad-page.module.css";
import { Modal, Box } from "@mui/material";
import GDashboardLayout from "../../components/layouts/GDashboardLayout";
import OffersModal from "../../components/G-ads/OffersModal";
import AdNameInput from "../../components/G-ads/AdNameInput";
import CitySelector from "../../components/G-ads/CitySelector";
import CatSelector from "../../components/G-ads/CatSelector";

const suggestedTags = [
    "خانه", "ویلایی", "رباط کریم", "صد متری", "نورگیر", "زیرقیمت", "تا یک میلیارد", "هشتاد متری"
]


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
    const [tags, setTags] = useState([]);
    const [selectedCities, setSelectedCities] = useState([]);
    const [selectedCats, setSelectedCats] = useState([]);
    const [showModal, setShowModal] = useState(false);

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
                        onClick={() => setShowModal(true)}
                        // disabled={tags.length < 2 || !adName.trim()}
                        disabled={selectedCities.length == 0 || selectedCats.length === 0 || !adName.trim()}
                    />
                </div>

            </div>
        </div>
    )
}

export default NewAdPage;

NewAdPage.getLayout = function (page) {
    return <GDashboardLayout>{page}</GDashboardLayout>;
};