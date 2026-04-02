export const FILTER_CONFIGS = [
  {
    key: "garmentType",
    getValue: (item) => item.garmentType,
  },
  {
    key: "style",
    getValue: (item) => item.style,
  },
  {
    key: "continent",
    getValue: (item) => item.location.continent,
  },
  {
    key: "country",
    getValue: (item) => item.location.country,
  },
  {
    key: "city",
    getValue: (item) => item.location.city,
  },
  {
    key: "occasion",
    getValue: (item) => item.occasion,
  },
  {
    key: "seasonCaptured",
    getValue: (item) => item.time.seasonCaptured,
  },
  {
    key: "designer",
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

      return !selectedValue || itemValue === selectedValue;
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
