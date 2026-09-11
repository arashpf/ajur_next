import React, { useState, useEffect } from "react";
import GDashboardLayout from "../../../components/layouts/GDashboardLayout";
import Style from "../../../styles/G-ads/user-dashboard.module.css";
import { ActiveAds } from "../../../components/G-ads/ActiveAds";
import NewAd from "../../../components/G-ads/new-add";
import KeywordClicksDoughnutChart from "../../../components/G-ads/KeywordClicksDoughnutChart";
import axios from "axios";
import Cookies from 'js-cookie';
import { useRouter } from "next/router";

// Client-side only functions
const getToken = () => {
  if (typeof window !== 'undefined') {
    return Cookies.get('id_token');
  }
  return null;
};

function aggregateKeywordClicks(ads) {
  if (!Array.isArray(ads)) return {};  // defensive check

  const keywordMap = {};
  ads.forEach(ad => {
    if (Array.isArray(ad.keywords)) {
      ad.keywords.forEach(kc => {
        if (!kc || !kc.keyword) return; // skip bad entries
        if (!keywordMap[kc.keyword]) keywordMap[kc.keyword] = 0;
        keywordMap[kc.keyword] += kc.clicks || 0;
      });
    }
  });

  return keywordMap;
}

function UserDashboard() {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null);
    const router = useRouter();

    // Check authentication and fetch data
    useEffect(() => {
        const currentToken = getToken();
        setToken(currentToken);

        if (!currentToken) {
            router.replace(`/panel/auth/login?next=${encodeURIComponent(router.asPath)}`);
            return;
        }

        setLoading(true);
        axios.post("https://api.ajur.app/api/user-gads", null, {
            params: { token: currentToken },
        })
        .then((response) => {
            setAds(response.data.all_user_gads || []);
            console.log("+++++++++++++ the response from the get-user-gads");
            console.log(JSON.stringify(response.data.all_user_gads, null, 2));
        })
        .catch((err) => {
            console.error("Error fetching ads:", err);
            setError("Failed to load ads");
        })
        .finally(() => {
            setLoading(false);
        });
    }, [router]);

    // Redirect if no token
    if (!token) {
        return (
            <div className="spinnerImageView">
                <img
                    className="spinner-image"
                    src="/logo/ajour-gif.gif"
                    alt="ajur logo"
                />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="spinnerImageView">
                <img
                    className="spinner-image"
                    src="/logo/ajour-gif.gif"
                    alt="ajur logo"
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className={Style["main-wrapper"]}>
                <div className={Style["error-message"]}>
                    {error}
                </div>
            </div>
        );
    }

    const keywordClicksData = aggregateKeywordClicks(ads);

    return (
        <div id="dashboard" className={Style["main-wrapper"]}>
            <div className={Style["active-ads"]}>
                <ActiveAds ads={ads} />
            </div>
            <div className={Style["new-ad-container"]}>
                <NewAd />
            </div>
            <div className={Style["graphs"]}>
                <div style={{ textAlign: "center", fontWeight: 600, fontSize: 18, margin: "24px 0 8px 0" }}>
                    تعداد کلیک هر کلیدواژه
                </div>
                <KeywordClicksDoughnutChart data={keywordClicksData} style={{ width: 300, height: 300 }} />
            </div>
        </div>
    );
}

export default UserDashboard;

UserDashboard.getLayout = function (page) {
    return <GDashboardLayout>{page}</GDashboardLayout>;
};