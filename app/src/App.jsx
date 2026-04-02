import { useMemo, useState } from "react";
import mockImages from "./data/mockImages";
import ImageCard from "./components/ImageCard";

function App() {
  // selected filter values
  const [selectedGarmentType, setSelectedGarmentType] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");

  // build garment type options from data
  const garmentTypeOptions = useMemo(() => {
    return [...new Set(mockImages.map((item) => item.garmentType))];
  }, []);

  // build style options from data
  const styleOptions = useMemo(() => {
    return [...new Set(mockImages.map((item) => item.style))];
  }, []);

  // apply both filters together
  const filteredImages = useMemo(() => {
    return mockImages.filter((item) => {
      const matchesGarmentType =
        !selectedGarmentType || item.garmentType === selectedGarmentType;

      const matchesStyle = !selectedStyle || item.style === selectedStyle;

      return matchesGarmentType && matchesStyle;
    });
  }, [selectedGarmentType, selectedStyle]);

  return (
    <div style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
      <h1>Fashion Garment Classification & Inspiration App</h1>
      <p>Upload, classify, search, and annotate inspiration images.</p>

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
            <ImageCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section style={{ marginTop: "24px" }}>
        <h2>Annotations</h2>
        <p>Designer notes and tags will go here.</p>
      </section>
    </div>
  );
}

export default App;
