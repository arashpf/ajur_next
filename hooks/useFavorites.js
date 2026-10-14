// hooks/useFavorites.js
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const API = "https://api.ajur.app/api";
const COOKIE_KEY = "favorited"; // legacy cookie — kept for backwards compat

// Read local (cookie) favorites
function readLocal() {
  try {
    const raw = Cookies.get(COOKIE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocal(ids) {
  Cookies.set(COOKIE_KEY, JSON.stringify(ids), { expires: 365 });
}

// Normalize to a Set of numbers for fast lookup
const toSet = (arr) => new Set((arr || []).map((x) => Number(x)));

export default function useFavorites() {
  const [favorites, setFavorites] = useState(() => toSet([]));
  const [ready, setReady] = useState(false);

  // ─── Load: server first, then merge any local-only ones ───
  useEffect(() => {
    const token = Cookies.get("id_token");
    const local = readLocal();

    // No token → just use local cookie (unauthenticated browsing)
    if (!token) {
      setFavorites(toSet(local));
      setReady(true);
      return;
    }

    axios({
      method: "get",
      url: `${API}/favorites`,
      params: { token },
    })
      .then((res) => {
        const serverIds = res.data.favorites || [];

        // If local has ids the server doesn't, sync them up
        const serverSet = toSet(serverIds);
        const localOnly = local.filter((id) => !serverSet.has(Number(id)));

        if (localOnly.length > 0) {
          axios({
            method: "post",
            url: `${API}/favorites/sync`,
            params: { token },
            data: { worker_ids: localOnly },
          }).then((syncRes) => {
            const merged = toSet(syncRes.data.favorites || []);
            setFavorites(merged);
            writeLocal([...merged]); // keep cookie in sync for unauth pages
            setReady(true);
          }).catch(() => {
            // Sync failed — fall back to server list
            setFavorites(toSet(serverIds));
            writeLocal(serverIds);
            setReady(true);
          });
        } else {
          setFavorites(serverSet);
          writeLocal(serverIds);
          setReady(true);
        }
      })
      .catch(() => {
        // Server call failed — fall back to cookie
        setFavorites(toSet(local));
        setReady(true);
      });
  }, []);

  // ─── Toggle one ───
  const toggle = useCallback(async (workerId) => {
    const id = Number(workerId);
    const token = Cookies.get("id_token");

    // Optimistic update
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      writeLocal([...next]);
      return next;
    });

    // Persist to server if logged in
    if (token) {
      try {
        await axios({
          method: "post",
          url: `${API}/favorites/toggle`,
          params: { token },
          data: { worker_id: id },
        });
      } catch (err) {
        // Roll back on failure
        console.error("favorite toggle failed", err);
        setFavorites((prev) => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          writeLocal([...next]);
          return next;
        });
      }
    }
  }, []);

  const isFavorited = useCallback(
    (workerId) => favorites.has(Number(workerId)),
    [favorites]
  );

  return {
    favorites: [...favorites],   // array of ids
    favoritesSet: favorites,     // Set for fast lookup
    isFavorited,
    toggle,
    ready,                       // true once initial load is done
  };
}