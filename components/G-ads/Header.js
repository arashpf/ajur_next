import React, { useState } from "react";
import Style from "../styles/g-ads/Header.module.css";

import { useRouter } from "next/router";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


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

    User = dummyUser;

    return (
        <div className={Style["header-wrapper"]}>
            <div className={Style["profile-section"]}>
                <a href={User.userUrl} className={Style["profile-picture"]}>
                    <img
                        src={User.profileUrl}
                        alt={User.name + " " + User.lastName}
                    />
                </a>
                <div className={Style["info"]}>
                    <div className={Style["name"]}>{User.name} {User.lastName}</div>
                    <div className={Style["back-button"]}>
                        <BackButton />
                    </div>
                </div>
            </div>
        </div>
    );
}
