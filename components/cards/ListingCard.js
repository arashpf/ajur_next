import React, { useState, useEffect } from "react";
import { differenceInDays, parseISO } from "date-fns";
import Cookies from "js-cookie";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

function WorkerCard({ file }) {
  const [properties, setProperties] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    try {
      setProperties(JSON.parse(file.json_properties));
    } catch {
      setProperties([]);
    }
  }, [file.json_properties]);

  useEffect(() => {
    let favorited = Cookies.get("favorited");
    if (!favorited) return;
    let list = JSON.parse(favorited) || [];
    if (list.includes(file.id)) setIsFavorite(true);
  }, [file.id]);

  const onClickFavorite = (e) => {
    e.stopPropagation(); // ⛔ stops opening file
    let favorited = Cookies.get("favorited");
    let list = favorited ? JSON.parse(favorited) : [];
    if (list.length > 20) list = list.slice(list.length - 20);
    list = list.filter((id) => id !== file.id);
    list.push(file.id);
    Cookies.set("favorited", JSON.stringify(list));
    setIsFavorite(true);
  };

  const onClickUnfavorite = (e) => {
    e.stopPropagation(); // ⛔ stops opening file
    let favorited = Cookies.get("favorited");
    let list = favorited ? JSON.parse(favorited) : [];
    list = list.filter((id) => id !== file.id);
    Cookies.set("favorited", JSON.stringify(list));
    setIsFavorite(false);
  };

  const calculateDaysPast = (createdAt) => {
    if (!createdAt) return "امروز در آجر";
    try {
      const createdDate = parseISO(createdAt);
      const daysPast = differenceInDays(new Date(), createdDate);
      return daysPast < 1 ? "امروز در آجر" : `${daysPast} روز در آجر`;
    } catch {
      return "امروز در آجر";
    }
  };

  const renderPrice = () => {
    const price = properties.find((p) => p.name === "قیمت");
    const pricePerM2 = properties.find((p) => p.name === "قیمت هر متر");
    const rentFront = properties.find((p) => p.name === "پول پیش");
    const rentMonth = properties.find((p) => p.name === "اجاره ماهیانه");

    if (price) {
      return (
        <p className="text-right text-sm text-gray-800">
          <strong className="text-base text-gray-900">
            {Number(price.value).toLocaleString()} تومان
          </strong>{" "}
          | متری {Number(pricePerM2?.value || 0).toLocaleString()} تومان
        </p>
      );
    }
    if (rentFront) {
      return (
        <p className="text-right text-sm text-gray-800">
          {rentMonth?.value && rentMonth.value !== 0 ? (
            <strong className="text-base text-gray-900">
              {Number(rentMonth.value).toLocaleString()} اجاره{" "}
            </strong>
          ) : (
            <strong className="text-base text-gray-900">کامل </strong>
          )}
          <strong className="text-base text-gray-900">
            {Number(rentFront.value).toLocaleString()} رهن
          </strong>
        </p>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80 bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
      {/* IMAGE SECTION */}
      <div className="relative h-[60%] w-full">
        <img
          src={file.thumb}
          alt={file.name}
          className="w-full h-full object-cover"
        />

        {/* Heart top-left */}
        <button
          onClick={isFavorite ? onClickUnfavorite : onClickFavorite}
          className="absolute top-2 left-2 bg-white/80 rounded-md p-2 shadow-sm"
        >
          {isFavorite ? (
            <FavoriteIcon style={{ color: "#b92a31" }} />
          ) : (
            <FavoriteBorderIcon />
          )}
        </button>

        {/* Location top-right */}
        {file.neighbourhood && (
          <div className="absolute top-2 right-2 bg-white/80 text-xs px-2 py-1 rounded-md shadow-sm">
            {file.neighbourhood}
          </div>
        )}

        {/* Date bottom-right */}
        <div className="absolute bottom-2 right-2 bg-white/80 text-xs px-2 py-1 rounded-md shadow-sm">
          {calculateDaysPast(file.updated_at)}
        </div>
      </div>

      {/* INFO SECTION */}
      <div className="h-[40%] flex flex-col justify-between p-3">
        <div>
          <h3 className="text-right font-semibold text-base truncate">
            {file.name}
          </h3>
          <div className="mt-1">{renderPrice()}</div>
        </div>

        {/* Properties */}
        <div className="flex flex-wrap justify-end text-xs text-gray-700 gap-1 mt-2">
          {properties.map(
            (p, i) =>
              p.special === "1" &&
              p.kind === 1 &&
              p.name !== "قیمت" &&
              p.name !== "قیمت هر متر" &&
              p.name !== "پول پیش" &&
              p.name !== "اجاره ماهیانه" && (
                <span key={i}>
                  {p.name}: {Number(p.value).toLocaleString()}
                </span>
              )
          )}
        </div>

        {/* Quick hints */}
        <div className="flex flex-wrap justify-end gap-2 mt-2">
          {properties.map(
            (p, i) =>
              p.special === "1" &&
              p.kind === 2 &&
              p.value == 1 && (
                <span
                  key={i}
                  className="bg-red-600 text-white text-xs px-2 py-1 rounded"
                >
                  {p.name} ✔
                </span>
              )
          )}
        </div>

        {/* Address */}
        <div className="text-right text-xs text-gray-500 mt-2">
          {file.formatted || file.neighbourhood || file.region}
        </div>
      </div>
    </div>
  );
}

export default WorkerCard;
