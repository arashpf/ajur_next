// utils/numberFormat.js
export const convertToPersianDigits = (str) => {
    if (!str) return "";
    return str.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
  };
  
  export const formatNumber = (num) => {
    if (num === "" || num === null || num === undefined) return "";
    const number = parseFloat(num);
    if (isNaN(number)) return "";
  
    return convertToPersianDigits(
      number.toLocaleString("en-US", { maximumFractionDigits: 0 })
    );
  };
  
  export const formatNumberWithWords = (num) => {
    if (num === "" || num === null || num === undefined) return "";
    const number = parseFloat(num);
    if (isNaN(number)) return "";
  
    // For numbers >= 1 billion
    if (number >= 1000000000) {
      const billions = Math.floor(number / 1000000000);
      const remainder = number % 1000000000;
      let result = `${convertToPersianDigits(billions.toString())} میلیارد`;
      if (remainder > 0) {
        const millions = Math.floor(remainder / 1000000);
        result += ` و ${convertToPersianDigits(millions.toString())} میلیون`;
      }
      return result;
    }
  
    // For numbers >= 1 million
    if (number >= 1000000) {
      const millions = Math.floor(number / 1000000);
      const remainder = number % 1000000;
      let result = `${convertToPersianDigits(millions.toString())} میلیون`;
      if (remainder > 0) {
        const thousands = Math.floor(remainder / 1000);
        result += ` و ${convertToPersianDigits(thousands.toString())} هزار`;
      }
      return result;
    }
  
    // For numbers >= 1000
    if (number >= 1000) {
      const thousands = Math.floor(number / 1000);
      const remainder = number % 1000;
      let result = `${convertToPersianDigits(thousands.toString())} هزار`;
      if (remainder > 0) {
        result += ` و ${convertToPersianDigits(remainder.toString())}`;
      }
      return result;
    }
  
    return convertToPersianDigits(number.toString());
  };
  