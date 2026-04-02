import { useMemo, useState } from "react";
import mockImages from "./data/mockImages";
import ImageCard from "./components/ImageCard";
import { classifyImageFromName } from "./utils/classifyImage";

function App() {
  const [images, setImages] = useState(mockImages);
  const [selectedGarmentType, setSelectedGarmentType] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [searchText, setSearchText] = useState("");
  const [designerNotes, setDesignerNotes] = useState({});

  const garmentTypeOptions = useMemo(() => {
    return [...new Set(images.map((item) => item.garmentType))];
  }, [images]);

  const styleOptions = useMemo(() => {
    return [...new Set(images.map((item) => item.style))];
  }, [images]);

  const handleNoteChange = (imageId, value) => {
    setDesignerNotes((prev) => ({
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

  const filteredImages = useMemo(() => {
    return images.filter((item) => {
      const matchesGarmentType =
        !selectedGarmentType || item.garmentType === selectedGarmentType;

      const matchesStyle = !selectedStyle || item.style === selectedStyle;

      const designerNote = designerNotes[item.id] || "";

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
        ${item.designer}
        ${designerNote}
      `.toLowerCase();

      const matchesSearch =
        !searchText || searchableText.includes(searchText.toLowerCase());

      return matchesGarmentType && matchesStyle && matchesSearch;
    });
  }, [images, selectedGarmentType, selectedStyle, searchText, designerNotes]);

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
          <div>
            <label htmlFor="garmentTypeFilter" style={{ marginRight: "8px" }}>
              Garment Type:
            </label>
            <select
              id="garmentTypeFilter"
              value={selectedGarmentType}
              onChange={(e) => setSelectedGarmentType(e.target.value)}
              style={{ padding: "8px", minWidth: "180px" }}
            >
              <option value="">All</option>
              {garmentTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="styleFilter" style={{ marginRight: "8px" }}>
              Style:
            </label>
            <select
              id="styleFilter"
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              style={{ padding: "8px", minWidth: "180px" }}
            >
              <option value="">All</option>
              {styleOptions.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="searchInput" style={{ marginRight: "8px" }}>
              Search:
            </label>
            <input
              id="searchInput"
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search descriptions or metadata"
              style={{ padding: "8px", minWidth: "260px" }}
            />
          </div>
        </div>
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
              onNoteChange={handleNoteChange}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
