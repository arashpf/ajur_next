import React, { useState } from "react";
import styles from "../styles/g-ads/ad-collapsibles.module.css";
import dayjs from "dayjs";
import jalali from "jalali-dayjs"
import AdChart from "./Ad-chart";
import KeywordClicksBarChart from "./KeywordClicksBarChart";
import KeywordClicksDoughnutChart from "./KeywordClicksDoughnutChart";
import { height, width } from "@mui/system";

dayjs.extend(jalali);

function formatToJalali(date) {
    return dayjs(date).locale('fa').format('YYYY/MM/DD');
}

export function AdCollapsibles({ ads }) {
    const [openIndex, setOpenIndex] = useState(ads.length === 1 ? 0 : null);

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className={styles["collapsibles-wrapper"]}>
            <div className={styles["collapsibles"]}>
                {ads.map((ad, index) => {
                    const isOpen = openIndex === index;

                    return (
                        <div
                            key={index}
                            className={`${styles["collapsible-item"]} ${isOpen ? styles["open"] : ""
                                }`}
                        >
                            <button
                                className={styles["toggle-button"]}
                                onClick={() => toggle(index)}
                            >
                                <div className={styles["toggle-header"]}>
                                    <div className={styles["right-info"]}>
                                        <span className={styles["ad-name"]}>{ad.campaign_name}</span>
                                        <span className={styles["start-date"]}>{formatToJalali(ad.created_at)}</span>
                                    </div>
                                    <div className={styles["left-status"]}>
                                        <img
                                            className={`${styles["collapse-icon"]} ${isOpen ? styles["rotate"] : ""}`}
                                            src="/img/G-ads/expand-arrow.png"
                                            alt="toggle"
                                        />
                                        <span
                                            className={`${styles["status-dot"]} ${styles[
                                                ad.status === "active"
                                                    ? "green"
                                                    : ad.status === "pending"
                                                        ? "yellow"
                                                        : "red"
                                            ]}`}
                                        ></span>
                                        <span className={styles["status-label"]}>
                                            {ad.status === "active"
                                                ? "فعال"
                                                : ad.status === "pending"
                                                    ? " در انتظار تایید"
                                                    : "غیرفعال"}
                                        </span>
                                        {ad.plan && (
                                            <span style={{ marginRight: 12, fontWeight: 600, color: '#bc323a', fontSize: 14 }}>
                                                {ad.plan === 'diamond' ? 'الماس'
                                                    : ad.plan === 'gold' ? 'طلایی'
                                                        : ad.plan === 'silver' ? 'نقره‌ای'
                                                            : ad.plan}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>

                            <div
                                className={styles["content-wrapper"]}
                                style={{
                                    maxHeight: isOpen ? "1000px" : "0px",
                                    opacity: isOpen ? 1 : 0,
                                }}
                            >
                                <div className={styles["content"]}>
                                    <div className={styles["half-group"]}>
                                        <div className={styles["half-container"]}>
                                            <p>تعداد کلیک: </p>
                                            <p>{ad.click_count}</p>
                                        </div>
                                        
                                        <div className={styles["half-container"]}>
                                            <p>کلیک باقیمانده: </p>
                                            <p>{ad.clicksLeft}</p>
                                        </div>


                                    </div>
                                    {/* <div className={styles["container"]}>
                                        <p>تعداد تماس: </p>
                                        <p>{ad.callCount}</p>
                                    </div> */}
                                    {/* {ad.chart && ad.chart.length !== 0 && ( */}
                                        <div className={styles["container"]}>
                                            {/* <div className={styles["chart-wrapper"]}>
                                                <AdChart chartData={ad.chart} />
                                            </div> */}
                                            {/* Per-ad keyword clicks charts */}
                                            {ad.keywords && ad.keywords.length > 0 && (
                                                <>
                                                    <div style={{ margin: "24px 0 12px 0" }}>
                                                        {ad.keywords.length > 4 ? (
                                                            <KeywordClicksBarChart
                                                                data={{
                                                                    labels: ad.keywords.map(kc => kc.keyword),
                                                                    values: ad.keywords.map(kc => kc.clicks)
                                                                }} />)
                                                            : (
                                                                <KeywordClicksDoughnutChart
                                                                    data={{
                                                                        labels: ad.keywords.map(kc => kc.keyword),
                                                                        values: ad.keywords.map(kc => kc.clicks)
                                                                    }} />
                                                            )
                                                        }
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    {/* )} */}
                                    <div className={styles["delete-container"]}>
                                        <button className={styles["delete-button"]}>
                                            <p style={{ margin: "auto" }}>حذف</p>
                                            {/* <img className={styles["delete-image"]} src="https://iili.io/FXAM6Lx.png" alt="Delete" /> */}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
