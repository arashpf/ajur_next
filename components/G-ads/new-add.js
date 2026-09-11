import React, { useState } from "react";
import { Modal, Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import styles from "../styles/g-ads/new-ad.module.css"
import { useRouter } from "next/router";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #ccc',
    boxShadow: 24,
    p: 4,
    borderRadius: '12px',
};


function NewAd() {

    const router = useRouter();

    const onClickNewAd = () => {
        router.push("/G-ads/new-ad-page");
    }

    return (
        <div>
            <button
                className={styles["new-ad-button"]}
                onClick={onClickNewAd}>
                <AddIcon style={{ fontSize: 48 }} />
                <span>تبلیغ جدید</span>
            </button>
        </div>
    );
}

export default NewAd;