// utils/cityNames.js

// City data based on your API response
const cityData = {
    "items": [
      { "id": 1024, "title": "آستانه اشرفیه", "slug": "astane-ashrafiye" },
      { "id": 1031, "title": "رشت", "slug": "rasht" },
      { "id": 522, "title": "مشهد", "slug": "mashhad" },
      { "id": 1066, "title": "لاهیجان", "slug": "lahijan" },
      { "id": 1068, "title": "چاف و چمخاله", "slug": "chaf-chamkhale" },
      { "id": 1073, "title": "ماسال", "slug": "masal" },
      { "id": 570, "title": "اهواز", "slug": "ahvaz" },
      { "id": 841, "title": "قم", "slug": "ghom" },
      { "id": 1099, "title": "آمل", "slug": "amol" },
      { "id": 349, "title": "اسلامشهر", "slug": "eslamshahr" },
      { "id": 354, "title": "پاکدشت", "slug": "pakdasht" },
      { "id": 1123, "title": "چالوس", "slug": "chaloos" },
      { "id": 357, "title": "بومهن", "slug": "bomehen" },
      { "id": 1126, "title": "رامسر", "slug": "ramsar" },
      { "id": 360, "title": "تهران", "slug": "tehran" },
      { "id": 1129, "title": "ساری", "slug": "sari" },
      { "id": 363, "title": "دماوند", "slug": "damavand" },
      { "id": 364, "title": "رودهن", "slug": "rodehen" },
      { "id": 366, "title": "شهر جدید پرند", "slug": "parand" },
      { "id": 367, "title": "رباط کریم", "slug": "robat-karim" },
      { "id": 371, "title": "ری", "slug": "rey" },
      { "id": 377, "title": "اندیشه", "slug": "andishe" },
      { "id": 380, "title": "شهریار", "slug": "shahriyar" },
      { "id": 381, "title": "صباشهر", "slug": "sabashahr" },
      { "id": 385, "title": "فیروزکوه", "slug": "firozkooh" },
      { "id": 386, "title": "قدس", "slug": "ghods" },
      { "id": 1156, "title": "نوشهر", "slug": "noshahr" },
      { "id": 389, "title": "ملارد", "slug": "malard" },
      { "id": 391, "title": "ورامین", "slug": "varamin" },
      { "id": 170, "title": "اصفهان", "slug": "esfehan" },
      { "id": 1203, "title": "کیش", "slug": "kish" },
      { "id": 967, "title": "کرمانشاه", "slug": "kermanshah" },
      { "id": 758, "title": "شیراز", "slug": "shiraz" },
      { "id": 1277, "title": "یزد", "slug": "yazd" }
    ]
  };
  
  // Create lookup maps for quick access
  const slugToPersianMap = {};
  const persianToSlugMap = {};
  
  // Populate the maps
  cityData.items.forEach(city => {
    slugToPersianMap[city.slug] = city.title;
    persianToSlugMap[city.title] = city.slug;
  });
  
  /**
   * Get Persian city name from English slug
   * @param {string} slug - English city slug
   * @returns {string} Persian city name or original slug if not found
   */
  export function getPersianCityName(slug) {
    if (!slug) return 'تهران'; // Default fallback
    
    const normalizedSlug = slug.toLowerCase().trim();
    return slugToPersianMap[normalizedSlug] || slug;
  }
  
  /**
   * Get English slug from Persian city name
   * @param {string} persianName - Persian city name
   * @returns {string} English slug or original name if not found
   */
  export function getEnglishSlug(persianName) {
    if (!persianName) return 'tehran'; // Default fallback
    
    return persianToSlugMap[persianName] || persianName;
  }
  
  /**
   * Get all cities as an array
   * @returns {Array} Array of city objects with title and slug
   */
  export function getAllCities() {
    return cityData.items.map(city => ({
      title: city.title,
      slug: city.slug,
      id: city.id
    }));
  }
  
  /**
   * Find city by slug or title
   * @param {string} query - City slug or Persian name
   * @returns {Object|null} City object or null
   */
  export function findCity(query) {
    if (!query) return null;
    
    const normalizedQuery = query.toLowerCase().trim();
    
    return cityData.items.find(city => 
      city.slug.toLowerCase() === normalizedQuery || 
      city.title === query
    ) || null;
  }