import React from "react";
import Link from "next/link";
import Styles from '../../styles/NeighborhoodCard.module.css';

export default function NeighborhoodCard({
  neighborhood,
  href,            // optional: allow overriding link
}) {
  if (!neighborhood) return null;

  const {
    id,
    name,
    city_name,
    image_url,
    description,
    // slug, // if you have it
  } = neighborhood;

  // default link: /neighborhoods/[id]
  const defaultHref = `/neighborhoods/${id}`;
  const linkHref = href || defaultHref;

  return (
    <Link href={linkHref} legacyBehavior>
      <a className={Styles.card}>
        <div className={Styles.thumbnailWrapper}>
          {image_url ? (
            // plain img: for now we keep it simple; you can switch to next/image later
            <img
              src={image_url}
              alt={name ? `محله ${name} در ${city_name}` : "محله"}
              className={Styles.thumbnail}
              loading="lazy"
            />
          ) : (
            <div className={Styles.thumbnailPlaceholder}>
              <span>بدون تصویر</span>
            </div>
          )}
          <div className={Styles.overlayGradient} />
        </div>

        <div className={Styles.body}>
          <h3 className={Styles.title}>
            {name}
          </h3>
          {city_name && (
            <div className={Styles.city}>
              {city_name}
            </div>
          )}

          {description && (
            <p className={Styles.description}>
              {description.length > 80
                ? description.slice(0, 77) + "..."
                : description}
            </p>
          )}
        </div>
      </a>
    </Link>
  );
}
