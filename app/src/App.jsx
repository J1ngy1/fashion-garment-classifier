import { useMemo, useState } from "react";
import mockImages from "./data/mockImages";
import ImageCard from "./components/ImageCard";
import { classifyImageFromName } from "./utils/classifyImage";

const FILTER_CONFIGS = [
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
    key: "seasonCaptured",
    label: "Captured Season",
    getValue: (item) => item.time.seasonCaptured,
  },
  {
    key: "designer",
    label: "Designer",
    getValue: (item) => item.designer,
  },
];

function App() {
  const [images, setImages] = useState(mockImages);
  const [searchText, setSearchText] = useState("");
  const [designerNotes, setDesignerNotes] = useState({});
  const [designerTags, setDesignerTags] = useState({});
  const [filters, setFilters] = useState({
    garmentType: "",
    style: "",
    continent: "",
    country: "",
    city: "",
    occasion: "",
    seasonCaptured: "",
    designer: "",
  });

  const filterOptions = useMemo(() => {
    const options = {};

    FILTER_CONFIGS.forEach((config) => {
      options[config.key] = [
        ...new Set(
          images
            .map((item) => config.getValue(item))
            .filter((value) => value && value.trim() !== ""),
        ),
      ].sort();
    });

    return options;
  }, [images]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNoteChange = (imageId, value) => {
    setDesignerNotes((prev) => ({
      ...prev,
      [imageId]: value,
    }));
  };

  const handleTagChange = (imageId, value) => {
    setDesignerTags((prev) => ({
      ...prev,
      [imageId]: value,
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) {
      return;
    }

    const newImages = files.map((file, index) => ({
      id: Date.now() + index,
      imageUrl: URL.createObjectURL(file),
      originalFileName: file.name,
      description: `Uploaded image: ${file.name}`,
      garmentType: "Unknown",
      style: "Unknown",
      material: "Unknown",
      colorPalette: "Unknown",
      pattern: "Unknown",
      season: "Unknown",
      occasion: "Unknown",
      consumerProfile: "Unknown",
      trendNotes: "Pending AI classification",
      location: {
        continent: "Unknown",
        country: "Unknown",
        city: "Unknown",
      },
      time: {
        year: new Date().getFullYear(),
        month: "Unknown",
        seasonCaptured: "Unknown",
      },
      designer: "Current User",
      annotations: [],
    }));

    setImages((prev) => [...newImages, ...prev]);
    event.target.value = "";
  };

  const handleRunDemoClassification = () => {
    setImages((prev) =>
      prev.map((item) => {
        if (item.garmentType !== "Unknown") {
          return item;
        }

        const result = classifyImageFromName(item.originalFileName || "");

        return {
          ...item,
          ...result,
        };
      }),
    );
  };

  const clearAllFilters = () => {
    setFilters({
      garmentType: "",
      style: "",
      continent: "",
      country: "",
      city: "",
      occasion: "",
      seasonCaptured: "",
      designer: "",
    });
    setSearchText("");
  };

  const filteredImages = useMemo(() => {
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
  }, [images, filters, searchText, designerNotes, designerTags]);

  return (
    <div
      style={{
        padding: "24px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          fontSize: "40px",
          lineHeight: 1.1,
          margin: 0,
        }}
      >
        Fashion Garment Classification & Inspiration App
      </h1>

      <p style={{ marginTop: "12px" }}>
        Upload, classify, search, and annotate inspiration images.
      </p>

      <section style={{ marginTop: "24px" }}>
        <h2>Upload</h2>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
        />

        <div style={{ marginTop: "12px" }}>
          <button
            onClick={handleRunDemoClassification}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              cursor: "pointer",
              marginRight: "12px",
            }}
          >
            Run Demo AI Classification
          </button>
        </div>

        <p style={{ marginTop: "8px" }}>
          Uploaded images will appear in the library with placeholder metadata.
          Click the button to auto-fill metadata from filename keywords.
        </p>
      </section>

      <section style={{ marginTop: "24px" }}>
        <h2>Filters and Search</h2>

        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "16px",
          }}
        >
          {FILTER_CONFIGS.map((config) => (
            <div key={config.key}>
              <label
                htmlFor={`${config.key}Filter`}
                style={{ marginRight: "8px" }}
              >
                {config.label}:
              </label>

              <select
                id={`${config.key}Filter`}
                value={filters[config.key]}
                onChange={(e) => handleFilterChange(config.key, e.target.value)}
                style={{ padding: "8px", minWidth: "180px" }}
              >
                <option value="">All</option>
                {filterOptions[config.key].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <div>
            <label htmlFor="searchInput" style={{ marginRight: "8px" }}>
              Search:
            </label>
            <input
              id="searchInput"
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search descriptions, metadata, tags, or notes"
              style={{ padding: "8px", minWidth: "260px" }}
            />
          </div>
        </div>

        <button
          onClick={clearAllFilters}
          style={{
            padding: "8px 14px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          Clear Filters
        </button>
      </section>

      <section style={{ marginTop: "24px" }}>
        <h2>Image Library</h2>
        <p>{filteredImages.length} result(s)</p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "16px",
          }}
        >
          {filteredImages.map((item) => (
            <ImageCard
              key={item.id}
              item={item}
              noteValue={designerNotes[item.id] || ""}
              tagValue={designerTags[item.id] || ""}
              onNoteChange={handleNoteChange}
              onTagChange={handleTagChange}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
