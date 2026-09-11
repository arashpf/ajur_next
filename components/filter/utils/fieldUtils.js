// components/filter/utils/fieldUtils.js

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

export function convertToPersianDigits(str) {
  if (!str) return "";
  return String(str).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

export function formatNumber(num) {
  if (num === "" || num === null || num === undefined) return "";
  const n = parseFloat(num);
  if (isNaN(n)) return "";
  return convertToPersianDigits(
    n.toLocaleString("en-US", { maximumFractionDigits: 0 })
  );
}

export function formatNumberWithWords(num) {
  if (num === "" || num === null || num === undefined) return "";
  const n = parseFloat(num);
  if (isNaN(n)) return "";

  if (n >= 1_000_000_000) {
    const b = Math.floor(n / 1_000_000_000);
    const r = n % 1_000_000_000;
    let out = `${convertToPersianDigits(b)} میلیارد`;
    if (r > 0) {
      const m = Math.floor(r / 1_000_000);
      out += ` و ${convertToPersianDigits(m)} میلیون`;
    }
    return out;
  }
  if (n >= 1_000_000) {
    const m = Math.floor(n / 1_000_000);
    const r = n % 1_000_000;
    let out = `${convertToPersianDigits(m)} میلیون`;
    if (r > 0) {
      const t = Math.floor(r / 1_000);
      out += ` و ${convertToPersianDigits(t)} هزار`;
    }
    return out;
  }
  if (n >= 1_000) {
    const t = Math.floor(n / 1_000);
    const r = n % 1_000;
    let out = `${convertToPersianDigits(t)} هزار`;
    if (r > 0) out += ` و ${convertToPersianDigits(r)}`;
    return out;
  }
  return convertToPersianDigits(n);
}

export function findField(fields, slug) {
  if (!Array.isArray(fields) || !slug) return null;
  return fields.find((f) => f.slug === slug) || null;
}

export function getAllFields(categoryFields = {}) {
  return [
    ...(categoryFields.normal || []),
    ...(categoryFields.tick || []),
    ...(categoryFields.predefine || []),
  ];
}

export function getFieldDisplayName(field) {
  if (!field) return "";
  return field.name || field.value || field.label || field.slug || "";
}

export function getFieldUnit(field) {
  return field?.unit || "";
}

export function normalizeField(raw) {
  if (!raw || !raw.value) return null;
  const options = Array.isArray(raw.vars)
    ? raw.vars
    : Array.isArray(raw.varchars)
    ? raw.varchars
    : [];

  return {
    id: raw.id,
    name: raw.value,
    value: raw.value,
    label: raw.value,
    // slug: raw.slug,
    slug: raw.value.replace(/\s+/g, "_"),
    unit: raw.unit,
    type: raw.type,
    min_range: raw.min_range,
    max_range: raw.max_range,
    low: raw.low,
    high: raw.high,
    special: raw.special,
    sort: raw.sort,
    options,
    key: raw.id?.toString() || raw.value,
  };
}