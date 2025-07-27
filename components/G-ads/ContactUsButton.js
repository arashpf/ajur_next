import React, { useState } from "react";
import { Fab, Zoom } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import CloseIcon from "@mui/icons-material/Close";
import Style from "../../styles/G-ads/contact-button.module.css";

function ContactButton() {
    const [open, setOpen] = useState(false);

    const toggleButtons = () => setOpen(prev => !prev);

    return (
        <div className={Style["fab-container"]}>
            {/* Main FAB */}
            <Fab
                size="medium"
                onClick={toggleButtons}
                sx={{
                    backgroundColor: "rgba(0, 131, 50, 1)",
                    color: 'white',
                    transition: "all 0.3s",
                    '&:hover': {
                        backgroundColor: "rgba(0, 131, 50, 1)",
                        transform: "scale(1.1)",
                    }
                }}
            >
                {open ? <CloseIcon fontSize="medium" /> : <PhoneIcon fontSize="medium" />}
            </Fab>

            {/* WhatsApp Button */}
            <Zoom in={open} unmountOnExit>
                <Fab
                    size="small"
                    color="success"
                    sx={{
                        position: "absolute",
                        bottom: 60,
                        left: 4,
                        transition: "all 0.3s",
                        '&:hover': {
                            backgroundColor: "#25D366",
                            transform: "scale(1.1)"
                        }
                    }}
                    onClick={() => window.open("https://wa.me/989382740488", "_blank")}
                >
                    <WhatsAppIcon fontSize="small" />
                </Fab>
            </Zoom>

            {/* Call Button */}
            <Zoom in={open} unmountOnExit>
                <Fab
                    size="small"
                    color="secondary"
                    sx={{
                        position: "absolute",
                        bottom: 115,
                        left: 5,
                        transition: "all 0.3s",
                        '&:hover': {
                            backgroundColor: "#c2185b",
                            transform: "scale(1.1)"
                        }
                    }}
                    href="tel:+989382740488"
                >
                    <LocalPhoneIcon fontSize="small" />
                </Fab>
            </Zoom>
        </div>
    );
}

export default ContactButton;
