import React, { useState, useEffect } from "react";
import Style from "../styles/g-ads/Header.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Cookies from 'js-cookie';


const dummyUser = {
    id: '1',
    name: 'I.C',
    lastName: 'Wiener',
    profileUrl: 'https://i.postimg.cc/KYvhKPLF/ajur-1200.png',
    userUrl: '#'
}

function BackButton({ color = "inherit", size = "medium" }) {
    const router = useRouter();

    return (
        <IconButton onClick={() => router.back()} color={color} size={size}>
            <ArrowBackIcon />
        </IconButton>
    );
}


export function DashboardHeader({ User }) {
    const token = Cookies.get("id_token");
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState([]);

     useEffect(() => {
  setLoading(true);

  axios.post("https://api.ajur.app/api/user-gads", null, {
    params: { token },
  })
  .then((response) => {

    setUser(response.data.user);

    console.log("+++++++++++++ the response from the get-user-gads");
    console.log(JSON.stringify(response.data, null, 2));

  })
  .catch((err) => {
    console.error("Error fetching ads:", err);
  })
  .finally(() => {
    setLoading(false);
  });
}, []);

    return (
        <div className={Style["header-wrapper"]}>
            <div className={Style["profile-section"]}>
                <a href={user.userUrl} className={Style["profile-picture"]}>
                    <img
                        src={user.profile_url}
                        alt={user.name + " " + user.family}
                    />
                </a>
                <div className={Style["info"]}>
                    <div className={Style["name"]}>{user.name} {user.family}</div>
                    <div className={Style["back-button"]}>
                        <BackButton />
                    </div>
                </div>
            </div>
        </div>
    );
}
