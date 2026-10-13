// CityContext.js
import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export const CityContext = createContext();

export const CityProvider = ({ children }) => {
  const [currentCity, setCurrentCity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allCities, setAllCities] = useState([]);

  // Fetch all cities from API
  const fetchAllCities = async () => {
    try {
      const response = await axios.get(
        "https://api.ajur.app/api/search-cities"
      );
      if (response.data?.items) {
        setAllCities(response.data.items);
        return response.data.items;
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch cities:", error);
      return [];
    }
  };

  // Find city by slug (English name)
  const findCityBySlug = (slug) => {
    return allCities.find((city) => city.slug === slug);
  };

  // Find city by Persian title
  const findCityByTitle = (title) => {
    return allCities.find((city) => city.title === title);
  };

  // Convert Persian title to slug using API data
  const getSlugFromTitle = (persianTitle) => {
    const city = findCityByTitle(persianTitle);
    return city?.slug || persianTitle;
  };

  // Convert slug to Persian title using API data
  const getTitleFromSlug = (slug) => {
    const city = findCityBySlug(slug);
    return city?.title || slug;
  };

  // Load city from cookies on mount
  useEffect(() => {
    const loadCity = async () => {
      try {
        // ⚠️ IMPORTANT: use the returned array, NOT the `allCities` state.
        // React state updates are async, so `allCities` is still [] at this
        // point in the effect, and findCityBySlug/findCityByTitle would fail.
        const cities = await fetchAllCities();

        const persianCityRaw = Cookies.get("persian_city");
        const englishCityRaw = Cookies.get("city");

        console.log("Loading cookies:", { persianCityRaw, englishCityRaw });

        if (persianCityRaw) {
          let persianName = "";
          let englishSlug = "";

          try {
            persianName = JSON.parse(persianCityRaw);
          } catch {
            persianName = persianCityRaw;
          }

          if (englishCityRaw) {
            try {
              englishSlug = JSON.parse(englishCityRaw);
            } catch {
              englishSlug = englishCityRaw;
            }
          }

          // Look up in the freshly fetched list
          const cityData =
            (englishSlug && cities.find((c) => c.slug === englishSlug)) ||
            (persianName && cities.find((c) => c.title === persianName)) ||
            null;

          console.log("Resolved city data:", cityData);

          if (cityData && cityData.id && cityData.title && cityData.slug) {
            setCurrentCity({
              id: cityData.id,
              title: cityData.title,
              slug: cityData.slug,
              parent: cityData.parent,
              region: cityData.region,
            });
          } else {
            console.warn(
              "[CityContext] Could not resolve a valid city from cookies, clearing"
            );
            Cookies.remove("city", { path: "/" });
            Cookies.remove("persian_city", { path: "/" });
            setCurrentCity(null);
          }
        }
      } catch (error) {
        console.error("Failed to load city from cookies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update city in cookies
  const updateCity = async (city) => {
    try {
      if (!city?.title) {
        throw new Error("Invalid city object - must have title");
      }

      // Find the city in API data to get the correct slug + id
      let cityData = findCityByTitle(city.title);

      if (!cityData && city.slug) {
        cityData = findCityBySlug(city.slug);
      }

      const finalCity = {
        id: cityData?.id || city.id,
        title: cityData?.title || city.title,
        slug: cityData?.slug || city.slug || getSlugFromTitle(city.title),
        parent: cityData?.parent || city.parent,
        region: cityData?.region || city.region,
      };

      // Refuse to persist an invalid city
      if (!finalCity.id || !finalCity.title || !finalCity.slug) {
        console.error(
          "[CityContext] Refusing to save invalid city:",
          finalCity
        );
        throw new Error("Could not resolve a valid city id");
      }

      console.log("Saving city:", finalCity);

      Cookies.set("city", JSON.stringify(finalCity.slug), {
        expires: 365,
        path: "/",
        sameSite: "strict",
      });

      Cookies.set("persian_city", JSON.stringify(finalCity.title), {
        expires: 365,
        path: "/",
        sameSite: "strict",
      });

      setCurrentCity(finalCity);
      return true;
    } catch (error) {
      console.error("Failed to save city to cookies:", error);
      throw error;
    }
  };

  // Clear selected city from cookies
  const clearCity = async () => {
    try {
      Cookies.remove("city", { path: "/" });
      Cookies.remove("persian_city", { path: "/" });
      setCurrentCity(null);
    } catch (error) {
      console.error("Failed to clear city from cookies:", error);
      throw error;
    }
  };

  return (
    <CityContext.Provider
      value={{
        currentCity,
        updateCity,
        clearCity,
        isLoading,
        allCities,
        getSlugFromTitle,
        getTitleFromSlug,
        findCityBySlug,
        findCityByTitle,
      }}
    >
      {children}
    </CityContext.Provider>
  );
};