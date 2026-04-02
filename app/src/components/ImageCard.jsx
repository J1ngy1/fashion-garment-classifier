function ImageCard({ item }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <img
        src={item.imageUrl}
        alt={item.description}
        style={{
          width: "100%",
          height: "260px",
          objectFit: "cover",
          display: "block",
        }}
      />

      <div style={{ padding: "16px" }}>
        <h3 style={{ marginTop: 0 }}>{item.garmentType}</h3>
        <p>{item.description}</p>
        <p>
          <strong>Style:</strong> {item.style}
        </p>
        <p>
          <strong>Material:</strong> {item.material}
        </p>
        <p>
          <strong>Color:</strong> {item.colorPalette}
        </p>
        <p>
          <strong>Location:</strong> {item.location.city},{" "}
          {item.location.country}
        </p>
        <p>
          <strong>Designer:</strong> {item.designer}
        </p>
      </div>
    </div>
  );
}

export default ImageCard;
