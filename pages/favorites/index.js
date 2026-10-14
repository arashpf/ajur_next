// pages/favorites/index.js
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/router";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import WorkerCard from "../../components/cards/WorkerCard";

const API_BASE = "https://api.ajur.app/api";
const COOKIE_KEY = "favorited";

// ─────────────────────────────────────────────────────────────
// Local (cookie) helpers — kept for logged-out users
// ─────────────────────────────────────────────────────────────
const readLocalFavorites = () => {
  try {
    const raw = Cookies.get(COOKIE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(Number) : [];
  } catch {
    return [];
  }
};

const writeLocalFavorites = (ids) => {
  try {
    Cookies.set(COOKIE_KEY, JSON.stringify(ids), { expires: 365 });
  } catch {
    // ignore
  }
};

const favoritesIndex = () => {
  const router = useRouter();
  const [is_have_favorited, set_is_have_favorited] = useState(false);
  const [loading, set_loading] = useState(true);
  const [workers, set_workers] = useState([]);
  const [favoriteIds, set_favoriteIds] = useState([]);

  // ─────────────────────────────────────────────────────────────
  // 1. Resolve favorites: server (if logged in) merged with cookie
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const token = Cookies.get("id_token");
    const localIds = readLocalFavorites();

    const fetchWorkers = (ids) => {
      if (!ids || ids.length === 0) {
        set_workers([]);
        set_is_have_favorited(false);
        set_loading(false);
        return;
      }

      axios({
        method: "get",
        url: `${API_BASE}/history-workers`,
        params: { workers_holder: ids },
      })
        .then((response) => {
          const list = Array.isArray(response.data) ? response.data : [];
          set_workers(list);
          set_is_have_favorited(list.length > 0);
        })
        .catch((error) => {
          console.error("Error fetching favorites:", error);
          set_workers([]);
          set_is_have_favorited(false);
        })
        .finally(() => set_loading(false));
    };

    // No auth → fall back to cookie only
    if (!token) {
      set_favoriteIds(localIds);
      fetchWorkers(localIds);
      return;
    }

    // Logged in → ask server, then merge any local-only IDs
    axios({
      method: "get",
      url: `${API_BASE}/favorites`,
      params: { token },
    })
      .then((res) => {
        const serverIds = Array.isArray(res.data.favorites)
          ? res.data.favorites.map(Number)
          : [];

        const serverSet = new Set(serverIds);
        const localOnly = localIds.filter((id) => !serverSet.has(id));

        // Merge local-only favorites up to the server (one-time)
        if (localOnly.length > 0) {
          axios({
            method: "post",
            url: `${API_BASE}/favorites/sync`,
            params: { token },
            data: { worker_ids: localOnly },
          })
            .then((syncRes) => {
              const merged = Array.isArray(syncRes.data.favorites)
                ? syncRes.data.favorites.map(Number)
                : serverIds;
              set_favoriteIds(merged);
              writeLocalFavorites(merged);
              fetchWorkers(merged);
            })
            .catch(() => {
              // Sync failed → just use server list
              set_favoriteIds(serverIds);
              writeLocalFavorites(serverIds);
              fetchWorkers(serverIds);
            });
        } else {
          set_favoriteIds(serverIds);
          writeLocalFavorites(serverIds);
          fetchWorkers(serverIds);
        }
      })
      .catch((err) => {
        // Server unreachable / token invalid → fall back to cookie
        console.warn("Server favorites fetch failed, using cookie:", err?.message);
        set_favoriteIds(localIds);
        fetchWorkers(localIds);
      });
  }, []);

  // ─────────────────────────────────────────────────────────────
  // 2. UI handlers (unchanged)
  // ─────────────────────────────────────────────────────────────
  const searchOnFiles = () => {
    router.push("/");
  };

  const renderFavoritedWorkers = () => {
    if (workers.length > 0) {
      return (
        <Grid container spacing={2}>
          {workers.map((worker) => (
            <Grid item xs={12} md={4} key={worker.id}>
              <a href={`/worker/${worker.id}?slug=${worker.slug}`}>
                <WorkerCard worker={worker} />
              </a>
            </Grid>
          ))}
        </Grid>
      );
    }

    return (
      <Grid item xs={12} style={{ background: "white" }}>
        <Box sx={{ textAlign: "center", padding: "40px 20px" }}>
          <p style={{ marginBottom: 20, fontSize: 18, color: "#666" }}>
            متاسفانه موردی یافت نشد
          </p>
          <div className="not-found-wrapper">
            <img
              className="not-found-image"
              src="/logo/not-found.png"
              alt="ملکی پیدا نشد"
              width={200}
              height={120}
              style={{ margin: "0 auto" }}
            />
          </div>
        </Box>
      </Grid>
    );
  };

  const renderFavotited = () => {
    if (is_have_favorited) {
      return (
        <Container
          maxWidth="xl"
          sx={{
            px: { xs: 2, sm: 3, md: 4 },
            margin: "0 auto",
            paddingBottom: "70px",
          }}
        >
          <h1
            style={{
              textAlign: "right",
              padding: "20px 0",
              color: "#555",
              fontSize: 22,
              fontFamily: "iransans",
              margin: 0,
            }}
          >
            فایل های مورد پسند شما در آجر
          </h1>

          <Box sx={{ flexGrow: 1, py: 3 }}>
            {renderFavoritedWorkers()}
          </Box>
        </Container>
      );
    }

    return (
      <Container
        maxWidth="md"
        sx={{
          px: { xs: 2, sm: 3 },
          margin: "0 auto",
          paddingTop: "40px",
          paddingBottom: "60px",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            padding: { xs: "20px 10px", sm: "40px 20px" },
            backgroundColor: "#f9f9f9",
            borderRadius: "12px",
            border: "1px solid #eee",
          }}
        >
          <Box sx={{ marginBottom: "24px" }}>
            <Image
              height={120}
              width={120}
              src="/logo/half-heart.png"
              alt="ajur half heart"
              style={{ margin: "0 auto" }}
            />
          </Box>

          <h3
            style={{
              color: "#555",
              fontSize: 20,
              marginBottom: 16,
              fontFamily: "iransans",
            }}
          >
            شما هنوز ملکی را نپسندیده اید
          </h3>

          <p
            style={{
              color: "#666",
              fontSize: 16,
              lineHeight: 1.6,
              marginBottom: 32,
              maxWidth: "500px",
              margin: "0 auto 32px",
            }}
          >
            با استفاده از آیکون قلب در فایل ها میتوانید آنها را به این صفحه
            اضافه کنید.
          </p>

          <Box
            onClick={searchOnFiles}
            sx={{
              display: "inline-block",
              backgroundColor: "#b92a31",
              color: "white",
              padding: "12px 32px",
              borderRadius: "24px",
              cursor: "pointer",
              fontSize: 16,
              fontWeight: 600,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#a01c22",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(185, 42, 49, 0.3)",
              },
            }}
          >
            جستجو در فایل ها
          </Box>
        </Box>
      </Container>
    );
  };

  const renderSpinner = () => (
    <div
      className="spinnerImageView"
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "400px",
          height: "400px",
          marginBottom: "20px",
        }}
      >
        <Image
          src="/logo/ajour-gif.gif"
          alt="در حال بارگذاری"
          fill
          sizes="400px"
          style={{ objectFit: "contain" }}
          priority
        />
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh" }}>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="robots" content="max-image-preview:large" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <title>آجر : فایل های مورد پسند شما</title>
        <meta
          name="description"
          content="فایل های مورد پسند شما در آجر در این صفحه نمایش داده میشوند"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://ajur.app/favorites" />
      </Head>

      {loading ? renderSpinner() : renderFavotited()}
    </div>
  );
};

export default favoritesIndex;