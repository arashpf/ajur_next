import React, { useEffect } from "react"
import axios from "axios";
import { useRouter } from "next/router";
import FrontLayout from '../components/layouts/FrontLayout'
import '../styles/globals.css'
import '../styles/download-theme.css'
import 'font-awesome/css/font-awesome.min.css'
import 'bootstrap/dist/css/bootstrap.css'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import "video.js/dist/video-js.css"

import Header from '../components/parts/Header'
import Footer from '../components/parts/Footer'
import Head from 'next/head';

import CookieConsent from '../components/others/CookieConsent';
import SmartAppBanner from "../components/banner/SmartAppBanner";

import { ensureIdentity } from "../lib/identity";
import { captureAttribution } from "../lib/utm";
import { AuthProvider } from "../components/auth/AuthProvider"; // ← ADDED

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    ensureIdentity(); // Sets ajur_anonymous_id + ajur_session_id on first visit
  }, []);

  useEffect(() => {
    captureAttribution();
  }, []);

  // Setup global axios error interceptor
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle 5xx errors
        if (error.response && error.response.status >= 500) {
          router.push("/500");
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [router]);

  const renderWithLayout =
    Component.getLayout ||
    function (page) {
      return <FrontLayout>
        {page}
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#000000" />
        </Head>
        {/* <CookieConsent /> */}
        <SmartAppBanner />
      </FrontLayout>;
    };

  return (
    <AuthProvider>
      {renderWithLayout(<Component {...pageProps} />)}
    </AuthProvider>
  );
}