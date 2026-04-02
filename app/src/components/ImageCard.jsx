function ImageCard({ item, noteValue, onNoteChange }) {
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

        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            background: "#f7f7f7",
            borderRadius: "8px",
          }}
        >
          <p style={{ marginTop: 0, marginBottom: "8px" }}>
            <strong>Designer Note</strong>
          </p>

          <textarea
            value={noteValue}
            onChange={(e) => onNoteChange(item.id, e.target.value)}
            placeholder="Add your own observation here"
            rows={4}
            style={{
              width: "100%",
              boxSizing: "border-box",
              resize: "vertical",
              padding: "8px",
              fontFamily: "Arial, sans-serif",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ImageCard;
