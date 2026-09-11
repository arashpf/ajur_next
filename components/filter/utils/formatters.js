// components/filter/utils/formatters.js
// Your exact code - works perfectly for Next.js

export const formatNumber = (num) => {
  if (num === '' || num === null || num === undefined) return '';
  const number = parseFloat(num);
  if (isNaN(number)) return '';

  return number.toLocaleString('en-US', { maximumFractionDigits: 0 });
};

export const formatNumberWithWords = (num) => {
  if (num === '' || num === null || num === undefined) return '';
  const number = parseFloat(num);
  if (isNaN(number)) return '';

  if (number >= 1000000000) {
    const billions = Math.floor(number / 1000000000);
    const remainder = number % 1000000000;
    let result = `${billions} میلیارد`;
    if (remainder > 0) {
      const millions = Math.floor(remainder / 1000000);
      result += ` و ${millions} میلیون`;
    }
    return result;
  }

  if (number >= 1000000) {
    const millions = Math.floor(number / 1000000);
    const remainder = number % 1000000;
    let result = `${millions} میلیون`;
    if (remainder > 0) {
      const thousands = Math.floor(remainder / 1000);
      result += ` و ${thousands} هزار`;
    }
    return result;
  }

  if (number >= 1000) {
    const thousands = Math.floor(number / 1000);
    const remainder = number % 1000;
    let result = `${thousands} هزار`;
    if (remainder > 0) {
      result += ` و ${remainder}`;
    }
    return result;
  }

  return number.toString();
};

// Additional helper for Persian digits if needed
export const toPersianDigits = (str) => {
  if (!str && str !== 0) return "";
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.toString().replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
};

// Format currency with Persian words
export const formatCurrencyWithWords = (amount) => {
  const formatted = formatNumber(amount);
  const withWords = formatNumberWithWords(amount);
  return {
    numeric: formatted,
    words: withWords,
    full: `${formatted} تومان (${withWords} تومان)`
  };
};

// Parse input value (remove commas, convert to number)
export const parseInputValue = (value) => {
  if (!value) return '';
  // Remove commas and convert to number
  const cleanValue = value.toString().replace(/,/g, '');
  return parseFloat(cleanValue) || '';
};