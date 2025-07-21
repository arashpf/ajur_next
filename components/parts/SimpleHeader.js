import React, { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Offcanvas from "react-bootstrap/Offcanvas";
import Nav from "react-bootstrap/Nav";
import Link from "next/link";
import styles from "../styles/SimpleHeader.module.css";

function SimpleHeader() {
    const expand = "false";
    const [nav_kind, set_nav_kind] = useState("main");

    const changeLogo = () => {
        if (window.scrollY >= 300) {
            set_nav_kind("secondary");
        } else if (window.scrollY <= 270) {
            set_nav_kind("main");
        }
    };

    React.useEffect(() => {
        changeLogo();
        window.addEventListener("scroll", changeLogo);
        return () => window.removeEventListener("scroll", changeLogo);
    }, []);

    return (
        <Navbar
            key={expand}
            collapseOnSelect
            bg="light"
            expand={expand}
            className={styles.mb_1}
            sticky="top"
        >
            <Container fluid className={styles.navbar}>


                <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} className={styles.toggleButton} />

                <Navbar.Offcanvas
                    id={`offcanvasNavbar-expand-${expand}`}
                    aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                    placement="end"
                >
                    <Offcanvas.Header closeButton style={{ background: '#bc323a', flexDirection: 'row-reverse' }}>
                        <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                            <p
                                style={{
                                    background: "#bc323a",
                                    margin: 10,
                                    padding: 6,
                                    fontSize: 16,
                                    textAlign: "center",
                                    color: 'white',
                                    borderRadius: '5px',
                                }}
                            >
                                <img
                                    className={styles["logo-just-mobile-image"]}
                                    src="/img/big-logo-180.png"
                                    alt="لوگوی مشاور املاک آجر"
                                    width={45}
                                    height={45}
                                    style={{ marginRight: '5px' }}
                                />
                                مشاور املاک هوشمند آجر
                            </p>
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Nav className={`flex-grow-1 pe-3 ${styles["nav-link-wrapper-end"]}`}>
                            <Nav.Link href="/"><p>خانه</p></Nav.Link>
                            <Nav.Link href="/about"><p>درباره آجر</p></Nav.Link>
                            <Nav.Link href="/support"><p>پشتیبانی</p></Nav.Link>
                            <Nav.Link href="/download"><p>دانلود اپلیکیشن</p></Nav.Link>
                        </Nav>
                        <Nav className={`${styles["nav-link-wrapper-start"]} pe-3`}>
                            <Nav.Link href="/Counseling"><p>درخواست فایل</p></Nav.Link>
                            <Nav.Link href="/marketing"><p>بازاریابی</p></Nav.Link>
                        </Nav>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
                <Navbar.Brand className={styles.navar_brand_center}>
                    <Link href="/">
                        <img
                            className={styles.image_logo_small}
                            src="/logo/web-logo-text.png"
                            alt="لوگوی آجر"
                        />
                    </Link>
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default SimpleHeader;