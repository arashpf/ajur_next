// components/panel/new/numToPersian.js
import Num2persian from "num2persian";

export const numToPersian = (num) => {
  if (num === null || num === undefined || num === "") return "";
  const n = Number(String(num).replace(/[^0-9]/g, ""));
  if (isNaN(n) || n === 0) return "";
  return Num2persian(n);
};