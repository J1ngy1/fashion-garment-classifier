import { useMemo, useState } from "react";
import mockImages from "./data/mockImages";
import ImageCard from "./components/ImageCard";

function App() {
  // keep the selected garment type here
  const [selectedGarmentType, setSelectedGarmentType] = useState("");

  // build filter options from the real data, not hardcoded
  const garmentTypeOptions = useMemo(() => {
    return [...new Set(mockImages.map((item) => item.garmentType))];
  }, []);

  // filter the list based on user's selection
  const filteredImages = useMemo(() => {
    if (!selectedGarmentType) {
      return mockImages;
    }

    return mockImages.filter(
      (item) => item.garmentType === selectedGarmentType,
    );
  }, [selectedGarmentType]);

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

        <div style={{ marginBottom: "16px" }}>
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
