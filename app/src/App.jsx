import { useEffect, useMemo, useState } from "react";
import mockImages from "./data/mockImages";
import ImageCard from "./components/ImageCard";
import { classifyImage, isGeminiAvailable } from "./utils/classifyImage";
import { FILTER_CONFIGS, filterImages } from "./utils/filterImages";

const STORAGE_KEYS = {
  images: "fashion-app-images-v1",
  notes: "fashion-app-designer-notes-v1",
  tags: "fashion-app-designer-tags-v1",
};

function getInitialState(key, fallbackValue) {
  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) {
      return fallbackValue;
    }
    return JSON.parse(stored);
  } catch {
    return fallbackValue;
  }
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.readAsDataURL(file);
  });
}

function App() {
  const [images, setImages] = useState(() =>
    getInitialState(STORAGE_KEYS.images, mockImages),
  );
  const [searchText, setSearchText] = useState("");
  const [designerNotes, setDesignerNotes] = useState(() =>
    getInitialState(STORAGE_KEYS.notes, {}),
  );
  const [designerTags, setDesignerTags] = useState(() =>
    getInitialState(STORAGE_KEYS.tags, {}),
  );
  const [isClassifying, setIsClassifying] = useState(false);
  const [filters, setFilters] = useState({
    garmentType: "",
    style: "",
    material: "",
    colorPalette: "",
    pattern: "",
    consumerProfile: "",
    trendNotes: "",
    continent: "",
    country: "",
    city: "",
    occasion: "",
    year: "",
    month: "",
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
            .filter(
              (value) =>
                value !== undefined &&
                value !== null &&
                String(value).trim() !== "",
            )
            .map((value) => String(value)),
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

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) {
      return;
    }
    const now = Date.now();
    const newImages = await Promise.all(
      files.map(async (file, index) => {
        const imageUrl = await fileToDataUrl(file);
        return {
          id: now + index,
          imageUrl,
          originalFileName: file.name,
          description: `Uploaded image awaiting AI classification: ${file.name}`,
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
          classificationSource: "not-run",
        };
      }),
    );
    setImages((prev) => [...newImages, ...prev]);
    event.target.value = "";
  };

  const handleRunDemoClassification = async () => {
    setIsClassifying(true);
    const nextImages = await Promise.all(
      images.map(async (item) => {
        if (item.classificationSource !== "not-run") {
          return item;
        }
        const result = await classifyImage({
          fileName: item.originalFileName || "",
          imageDataUrl: item.imageUrl,
        });
        return {
          ...item,
          ...result,
        };
      }),
    );
    setImages(nextImages);
    setIsClassifying(false);
  };

  const clearAllFilters = () => {
    setFilters({
      garmentType: "",
      style: "",
      material: "",
      colorPalette: "",
      pattern: "",
      consumerProfile: "",
      trendNotes: "",
      continent: "",
      country: "",
      city: "",
      occasion: "",
      year: "",
      month: "",
      seasonCaptured: "",
      designer: "",
    });
    setSearchText("");
  };

  const filteredImages = useMemo(() => {
    return filterImages(
      images,
      filters,
      searchText,
      designerNotes,
      designerTags,
    );
  }, [images, filters, searchText, designerNotes, designerTags]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.images, JSON.stringify(images));
  }, [images]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.notes,
      JSON.stringify(designerNotes),
    );
  }, [designerNotes]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.tags,
      JSON.stringify(designerTags),
    );
  }, [designerTags]);

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

      <div style={{ marginTop: "12px", fontSize: "18px", fontWeight: "bold" }}>
        Classification Mode: {isGeminiAvailable() ? "Gemini API" : "Local Mock"}
      </div>

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
            disabled={isClassifying}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              cursor: "pointer",
              marginRight: "12px",
            }}
          >
            {isClassifying
              ? "Classifying Uploaded Images..."
              : "Run Demo AI Classification"}
          </button>
        </div>

        <p style={{ marginTop: "8px" }}>
          Uploaded images are persisted in local storage. With{" "}
          <code>GEMINI_API_KEY</code> set (see README), classification uses the
          Gemini API; otherwise the local filename-based mock is used.
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
