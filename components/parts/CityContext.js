// CityContext.js
import React, { createContext, useState, useEffect } from "react";
import Cookies from 'js-cookie';
import axios from "axios";

export const CityContext = createContext();

export const CityProvider = ({ children }) => {
  const [currentCity, setCurrentCity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allCities, setAllCities] = useState([]);

  // Fetch all cities from API
  const fetchAllCities = async () => {
    try {
      const response = await axios.get('https://api.ajur.app/api/search-cities');
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
    return allCities.find(city => city.slug === slug);
  };

  // Find city by Persian title
  const findCityByTitle = (title) => {
    return allCities.find(city => city.title === title);
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
        // First fetch all cities
        await fetchAllCities();

        // Load both cookies
        const persianCityRaw = Cookies.get('persian_city');
        const englishCityRaw = Cookies.get('city');
        
        console.log('Loading cookies:', { persianCityRaw, englishCityRaw });
        
        if (persianCityRaw) {
          let persianName = '';
          let englishSlug = '';
          
          // Parse Persian city name
          try {
            persianName = JSON.parse(persianCityRaw);
          } catch {
            persianName = persianCityRaw;
          }
          
          // Parse English city slug
          if (englishCityRaw) {
            try {
              englishSlug = JSON.parse(englishCityRaw);
            } catch {
              englishSlug = englishCityRaw;
            }
          } else {
            // If no English cookie, get slug from API data
            englishSlug = getSlugFromTitle(persianName);
          }
          
          // Find the city in API data to get full info
          const cityData = findCityBySlug(englishSlug) || findCityByTitle(persianName);
          
          // Create city object
          const cityObj = {
            id: cityData?.id || Date.now(),
            title: cityData?.title || persianName,
            slug: cityData?.slug || englishSlug,
            parent: cityData?.parent,
            region: cityData?.region,
            // Include any other fields from API
          };
          
          console.log('Loaded city:', cityObj);
          
          if (cityObj.title && cityObj.slug) {
            setCurrentCity(cityObj);
          } else {
            // Clear invalid data
            Cookies.remove('city');
            Cookies.remove('persian_city');
          }
        }
      } catch (error) {
        console.error("Failed to load city from cookies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCity();
  }, []);

  // Update city in cookies
  const updateCity = async (city) => {
    try {
      if (!city?.title) {
        throw new Error("Invalid city object - must have title");
      }

      // Find the city in API data to get correct slug
      let cityData = findCityByTitle(city.title);
      
      // If not found by title, try by slug
      if (!cityData && city.slug) {
        cityData = findCityBySlug(city.slug);
      }
      
      // Use API data if available, otherwise use provided data
      const finalCity = {
        id: cityData?.id || city.id || Date.now(),
        title: cityData?.title || city.title,
        slug: cityData?.slug || city.slug || getSlugFromTitle(city.title),
        parent: cityData?.parent || city.parent,
        region: cityData?.region || city.region,
      };
      
      console.log('Saving city:', finalCity);

      // Store both values in separate cookies
      Cookies.set('city', JSON.stringify(finalCity.slug), {
        expires: 365,
        path: '/',
        sameSite: 'strict'
      });

      Cookies.set('persian_city', JSON.stringify(finalCity.title), {
        expires: 365,
        path: '/',
        sameSite: 'strict'
      });
      
      // Update state with complete city object
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
      Cookies.remove('city', { path: '/' });
      Cookies.remove('persian_city', { path: '/' });
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