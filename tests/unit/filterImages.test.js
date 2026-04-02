import { describe, it, expect } from "vitest";
import { filterImages } from "../../app/src/utils/filterImages";

const mockData = [
  {
    id: 1,
    description: "Blue denim jacket with streetwear styling",
    garmentType: "Jacket",
    style: "Streetwear",
    material: "Denim",
    colorPalette: "Blue",
    pattern: "Solid",
    occasion: "Casual",
    consumerProfile: "Young Adult",
    trendNotes: "Oversized outerwear",
    location: {
      continent: "North America",
      country: "United States",
      city: "New York",
    },
    time: {
      year: 2025,
      month: "September",
      seasonCaptured: "Fall",
    },
    designer: "Alex",
  },
  {
    id: 2,
    description: "Floral linen dress with bohemian styling",
    garmentType: "Dress",
    style: "Bohemian",
    material: "Linen",
    colorPalette: "Multicolor",
    pattern: "Floral",
    occasion: "Vacation",
    consumerProfile: "Women",
    trendNotes: "Artisan details",
    location: {
      continent: "Asia",
      country: "Thailand",
      city: "Bangkok",
    },
    time: {
      year: 2024,
      month: "July",
      seasonCaptured: "Summer",
    },
    designer: "Sophia",
  },
];

describe("filterImages", () => {
  it("filters by dropdown values", () => {
    const result = filterImages(
      mockData,
      {
        garmentType: "Dress",
        style: "",
        continent: "",
        country: "",
        city: "",
        occasion: "",
        seasonCaptured: "",
        designer: "",
      },
      "",
      {},
      {},
    );

    expect(result).toHaveLength(1);
    expect(result[0].garmentType).toBe("Dress");
  });

  it("matches designer tags and notes in search", () => {
    const result = filterImages(
      mockData,
      {
        garmentType: "",
        style: "",
        continent: "",
        country: "",
        city: "",
        occasion: "",
        seasonCaptured: "",
        designer: "",
      },
      "embroidered neckline",
      { 2: "save this for summer capsule" },
      { 2: "embroidered neckline, artisan market" },
    );

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });
});
