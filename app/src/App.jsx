import { useMemo, useState } from "react";
import mockImages from "./data/mockImages";
import ImageCard from "./components/ImageCard";

function App() {
  const [selectedGarmentType, setSelectedGarmentType] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [searchText, setSearchText] = useState("");
  const [designerNotes, setDesignerNotes] = useState({});

  const garmentTypeOptions = useMemo(() => {
    return [...new Set(mockImages.map((item) => item.garmentType))];
  }, []);

  const styleOptions = useMemo(() => {
    return [...new Set(mockImages.map((item) => item.style))];
  }, []);

  const handleNoteChange = (imageId, value) => {
    setDesignerNotes((prev) => ({
      ...prev,
      [imageId]: value,
    }));
  };

  const filteredImages = useMemo(() => {
    return mockImages.filter((item) => {
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
  }, [selectedGarmentType, selectedStyle, searchText, designerNotes]);

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
        <p>Image upload area will go here.</p>
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
