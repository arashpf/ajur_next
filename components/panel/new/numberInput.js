// components/panel/new/numberInput.js

// Maps Persian (۰-۹) and Arabic-Indic (٠-٩) digits to Latin 0-9
const DIGIT_MAP = {
    "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4",
    "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
    "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
    "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
  };
  
  /**
   * Accept any digit system + separators, return clean Latin digits only.
   * - Persian/Arabic digits → Latin
   * - Removes commas, spaces, dots, minus signs, Persian thousand separators (٬)
   * - Anything else stripped
   */
  export const normalizeNumericInput = (input) => {
    if (input === null || input === undefined) return "";
    const str = String(input);
  
    // 1. Translate digit characters
    let latin = "";
    for (const ch of str) {
      latin += DIGIT_MAP[ch] ?? ch;
    }
  
    // 2. Strip everything that isn't a Latin digit
    return latin.replace(/[^0-9]/g, "");
  };