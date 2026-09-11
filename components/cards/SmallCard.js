import React from "react";
import Styles from "../styles/SmallCard.module.css";
import Stars from "../others/Stars";

import Image from "next/image";

function SmallCard({ realEstate, profileImageKey = "profile_url", compact = false }) {

    const goToProfile = () => {
        window.location.href = `/realestates/${realEstate.id}`;
    };

    const onClickCall = (e) => {
        e.stopPropagation(); // prevents card click
        if (realEstate.phone) {
            window.location.href = `tel:${realEstate.phone}`;
        } else {
            alert("شماره تماس موجود نیست");
        }
    };

    const profile_url = realEstate[profileImageKey];

    const wrapperStyle = compact
        ? { margin: "8px 6px 16px", cursor: "pointer" }
        : { cursor: "pointer" };

    const imgStyle = compact
        ? { height: 140, objectFit: "cover" }
        : {};

    return (
        <div
            className={Styles["card-wrapper"]}
            style={wrapperStyle}
            onClick={goToProfile}
        >
            <Image
    className={Styles["card-image"]}
    src={profile_url}
    alt={`تصویر پروفایل ${realEstate.name || ""} ${realEstate.family || ""} مشاور املاک آجر`}
    width={300}
    height={300}
    style={imgStyle}
    loading="lazy"
/>


            <div className={Styles["card-info"]}>
                <div className={Styles["card-name-wrapper"]}>
                    <div className={Styles["card-name"]}>
                        <h2>
                            {realEstate.name} {realEstate.family}
                        </h2>
                    </div>

                    {realEstate.verified == 1 && (
                        <img
                            className={Styles["verified-badge"]}
                            src="https://cdn3.emoji.gg/emojis/2089-instagram-verified.png"
                            alt={`نشان تایید شده ${realEstate.name || ""} ${realEstate.family || ""}`}
                            title="مشاور تایید شده"
                            loading="lazy"
                        />
                    )}
                </div>

                <div className={Styles["card-real-estate"]}>
                    {realEstate.is_realstate == 1 && (
                        <p>{realEstate.realstate}</p>
                    )}
                </div>

                <div className={Styles["card-stars-wrapper"]}>
                    <div className={Styles["card-stars"]}>
                        <Stars amount={realEstate.stars} />
                    </div>
                </div>

                <button
                    className={Styles["contact-button"]}
                    onClick={onClickCall}
                >
                    تماس
                </button>
            </div>
        </div>
    );
}

export default SmallCard;