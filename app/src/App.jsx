import mockImages from "./data/mockImages";
import ImageCard from "./components/ImageCard";

function App() {
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
        <p>Dynamic filters and text search will go here.</p>
      </section>

      <section style={{ marginTop: "24px" }}>
        <h2>Image Library</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "16px",
          }}
        >
          {mockImages.map((item) => (
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
