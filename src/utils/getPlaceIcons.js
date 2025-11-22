// src/utils/getPlaceIcons.js

export const placeIcons = {
  restaurant: "🍽️",
  cafe: "☕",
  bar: "🍺",
  hotel: "🏨",
  atm: "🏧",
  park: "🌳",
  museum: "🏛️",
  pharmacy: "💊",
  hospital: "🏥",
  supermarket: "🛒",
  petrol: "⛽",
  cinema: "🎬",
  bank: "🏦",
  clothing: "👗",
  gym: "🏋️",
  school: "🏫",
  university: "🎓",
  airport: "✈️",
  train_station: "🚉",
  bus_station: "🚌",
  parking: "🅿️",
  beauty: "💇",
  default: "📍",
};

/**
 * Returns an emoji icon for a place object from Geoapify
 * Accepts categories as an array or string. Returns a single emoji string.
 */
export default function getPlaceIcons(place) {
  const props = place?.properties || {};
  const categories = props.categories ?? props.category ?? props.type ?? "";

  // normalize to array of lowercase tokens
  const catList = Array.isArray(categories)
    ? categories.map((c) => String(c).toLowerCase())
    : String(categories)
        .split(/[,\s|]+/)
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

  // simple heuristics — return first matching icon
  for (const c of catList) {
    if (c.includes("restaurant") || c.includes("food") || c.includes("dining")) return placeIcons.restaurant;
    if (c.includes("cafe") || c.includes("coffee")) return placeIcons.cafe;
    if (c.includes("bar") || c.includes("pub")) return placeIcons.bar;
    if (c.includes("hotel") || c.includes("lodging") || c.includes("accommodation")) return placeIcons.hotel;
    if (c.includes("park") || c.includes("playground")) return placeIcons.park;
    if (c.includes("museum") || c.includes("gallery") || c.includes("tourism")) return placeIcons.museum;
    if (c.includes("pharmacy") || c.includes("chemist")) return placeIcons.pharmacy;
    if (c.includes("hospital") || c.includes("clinic")) return placeIcons.hospital;
    if (c.includes("supermarket") || c.includes("grocery") || c.includes("market")) return placeIcons.supermarket;
    if (c.includes("fuel") || c.includes("petrol") || c.includes("gas")) return placeIcons.petrol;
    if (c.includes("cinema") || c.includes("movie")) return placeIcons.cinema;
    if (c.includes("bank") || c.includes("atm")) return placeIcons.bank;
    if (c.includes("clothing") || c.includes("shop")) return placeIcons.clothing;
    if (c.includes("gym") || c.includes("fitness")) return placeIcons.gym;
    if (c.includes("school") || c.includes("college") || c.includes("university")) return placeIcons.school;
    if (c.includes("airport")) return placeIcons.airport;
    if (c.includes("train") || c.includes("rail")) return placeIcons.train_station;
    if (c.includes("bus") || c.includes("coach") || c.includes("station")) return placeIcons.bus_station;
    if (c.includes("parking")) return placeIcons.parking;
    if (c.includes("beauty") || c.includes("salon")) return placeIcons.beauty;
  }

  return placeIcons.default;
}
