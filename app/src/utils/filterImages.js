export const FILTER_CONFIGS = [
  {
    key: "garmentType",
    label: "Garment Type",
    getValue: (item) => item.garmentType,
  },
  {
    key: "style",
    label: "Style",
    getValue: (item) => item.style,
  },
  {
    key: "material",
    label: "Material",
    getValue: (item) => item.material,
  },
  {
    key: "colorPalette",
    label: "Color Palette",
    getValue: (item) => item.colorPalette,
  },
  {
    key: "pattern",
    label: "Pattern",
    getValue: (item) => item.pattern,
  },
  {
    key: "consumerProfile",
    label: "Consumer Profile",
    getValue: (item) => item.consumerProfile,
  },
  {
    key: "trendNotes",
    label: "Trend Notes",
    getValue: (item) => item.trendNotes,
  },
  {
    key: "continent",
    label: "Continent",
    getValue: (item) => item.location.continent,
  },
  {
    key: "country",
    label: "Country",
    getValue: (item) => item.location.country,
  },
  {
    key: "city",
    label: "City",
    getValue: (item) => item.location.city,
  },
  {
    key: "occasion",
    label: "Occasion",
    getValue: (item) => item.occasion,
  },
  {
    key: "year",
    label: "Year",
    getValue: (item) => item.time.year,
  },
  {
    key: "month",
    label: "Month",
    getValue: (item) => item.time.month,
  },
  {
    key: "seasonCaptured",
    label: "Season",
    getValue: (item) => item.time.seasonCaptured,
  },
  {
    key: "designer",
    label: "Designer",
    getValue: (item) => item.designer,
  },
];

export function filterImages(
  images,
  filters,
  searchText,
  designerNotes,
  designerTags,
) {
  return images.filter((item) => {
    const matchesDropdownFilters = FILTER_CONFIGS.every((config) => {
      const selectedValue = filters[config.key];
      const itemValue = config.getValue(item);

      return !selectedValue || String(itemValue) === String(selectedValue);
    });

    const designerNote = designerNotes[item.id] || "";
    const designerTag = designerTags[item.id] || "";

    const searchableText = `
      ${item.description}
      ${item.garmentType}
      ${item.style}
      ${item.material}
      ${item.colorPalette}
      ${item.pattern}
      ${item.occasion}
      ${item.consumerProfile}
      ${item.trendNotes}
      ${item.location.continent}
      ${item.location.country}
      ${item.location.city}
      ${item.time.year}
      ${item.time.month}
      ${item.time.seasonCaptured}
      ${item.designer}
      ${designerNote}
      ${designerTag}
    `.toLowerCase();

    const matchesSearch =
      !searchText || searchableText.includes(searchText.toLowerCase());

    return matchesDropdownFilters && matchesSearch;
  });
}
