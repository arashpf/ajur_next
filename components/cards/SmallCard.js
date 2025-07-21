import React from "react";
import Styles from "../styles/SmallCard.module.css";
import Stars from "../others/Stars";

function SmallCard({ realEstate, profileImageKey = "profile_url" }) {
    const onClickCall = () => {
        if (realEstate.phone) {
            window.location.href = `tel:${realEstate.phone}`;
        } else {
            alert("شماره تماس موجود نیست");
        }
    };

    const profile_url = realEstate[profileImageKey];

    return (
        <div className={Styles["card-wrapper"]}>
            <img
                className={Styles["card-image"]}
                src={profile_url}
                alt={realEstate.name + " " + realEstate.family}
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
                            alt="verified"
                            title="Verified Agent"
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
                <button className={Styles["contact-button"]} onClick={onClickCall}>
                    تماس
                </button>
            </div>
        </div>
    );
}

export default SmallCard;
