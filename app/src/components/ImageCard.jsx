import { useState } from "react";

function ImageCard({
  item,
  noteValue,
  tagValue,
  onNoteChange,
  onTagChange,
  onDelete,
  onReclassify,
}) {
  const [showMetadata, setShowMetadata] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      style={{
        border: "1px solid #e1e8ed",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        transition: "box-shadow 0.2s",
        position: "relative",
      }}
      onMouseOver={(e) =>
        (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)")
      }
      onMouseOut={(e) =>
        (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)")
      }
    >
      <div style={{ position: "relative" }}>
        <img
          src={item.imageUrl}
          alt={item.description}
          style={{
            width: "100%",
            height: "240px",
            objectFit: "cover",
            display: "block",
          }}
        />

        {/* 3-dot menu button in lower right */}
        <div style={{ position: "absolute", bottom: "8px", right: "8px" }}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              border: "1px solid #e1e8ed",
              borderRadius: "6px",
              width: "32px",
              height: "32px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              color: "#666",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "rgba(255, 255, 255, 1)";
              e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
              e.target.style.boxShadow = "none";
            }}
            title="More options"
          >
            ⋮
          </button>

          {/* Dropdown menu */}
          {showMenu && (
            <div
              style={{
                position: "absolute",
                bottom: "40px",
                right: "0",
                backgroundColor: "white",
                border: "1px solid #e1e8ed",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                minWidth: "120px",
                zIndex: 1000,
              }}
            >
              <button
                onClick={() => {
                  onReclassify(item.id);
                  setShowMenu(false);
                }}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "none",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "14px",
                  color: "#495057",
                  borderRadius: "6px 6px 0 0",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#f8f9fa")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                🔄 Reclassify
              </button>
              <button
                onClick={() => {
                  onDelete(item.id);
                  setShowMenu(false);
                }}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "none",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "14px",
                  color: "#dc3545",
                  borderRadius: "0 0 6px 6px",
                  borderTop: "1px solid #e1e8ed",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#f8d7da")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: "600",
              color: "#2c3e50",
            }}
          >
            {item.garmentType}
          </h3>
          <span
            style={{
              marginLeft: "8px",
              fontSize: "11px",
              padding: "2px 6px",
              borderRadius: "10px",
              fontWeight: "500",
              backgroundColor:
                item.classificationSource === "gemini"
                  ? "#d4edda"
                  : item.classificationSource === "local-mock"
                    ? "#fff3cd"
                    : "#f8d7da",
              color:
                item.classificationSource === "gemini"
                  ? "#155724"
                  : item.classificationSource === "local-mock"
                    ? "#856404"
                    : "#721c24",
            }}
          >
            {item.classificationSource === "gemini"
              ? "AI"
              : item.classificationSource === "local-mock"
                ? "Mock"
                : "Fallback"}
          </span>
        </div>

        <p
          style={{
            margin: "0 0 16px 0",
            color: "#5a6c7d",
            fontSize: "14px",
            lineHeight: "1.4",
          }}
        >
          {item.description}
        </p>

        <div style={{ borderTop: "1px solid #e1e8ed", paddingTop: "16px" }}>
          <button
            onClick={() => setShowMetadata(!showMetadata)}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#f8f9fa",
              border: "1px solid #e1e8ed",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              color: "#495057",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#e9ecef")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#f8f9fa")}
          >
            <span>AI Metadata</span>
            <span
              style={{
                fontSize: "12px",
                transform: showMetadata ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            >
              ▼
            </span>
          </button>

          {showMetadata && (
            <div
              style={{
                padding: "16px",
                background: "#f8f9fa",
                border: "1px solid #e1e8ed",
                borderRadius: "8px",
                marginBottom: "16px",
                fontSize: "13px",
                lineHeight: "1.5",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    color: "#2f5ea8",
                    background: "#e8f1ff",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontWeight: "500",
                  }}
                >
                  AI-generated
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                }}
              >
                <div>
                  <strong>Style:</strong> {item.style}
                </div>
                <div>
                  <strong>Material:</strong> {item.material}
                </div>
                <div>
                  <strong>Color:</strong> {item.colorPalette}
                </div>
                <div>
                  <strong>Pattern:</strong> {item.pattern}
                </div>
                <div>
                  <strong>Occasion:</strong> {item.occasion}
                </div>
                <div>
                  <strong>Profile:</strong> {item.consumerProfile}
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <strong>Location:</strong> {item.location.city},{" "}
                  {item.location.country}, {item.location.continent}
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <strong>Captured:</strong> {item.time.month} {item.time.year},{" "}
                  {item.time.seasonCaptured}
                </div>
                <div>
                  <strong>Designer:</strong> {item.designer}
                </div>
                <div>
                  <strong>Source:</strong>{" "}
                  {item.classificationSource || "seed-data"}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowAnnotations(!showAnnotations)}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#f8f9fa",
              border: "1px solid #e1e8ed",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              color: "#495057",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#e9ecef")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#f8f9fa")}
          >
            <span>Designer Annotations</span>
            <span
              style={{
                fontSize: "12px",
                transform: showAnnotations ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            >
              ▼
            </span>
          </button>

          {showAnnotations && (
            <div
              style={{
                padding: "16px",
                background: "#f8f9fa",
                border: "1px solid #e1e8ed",
                borderRadius: "8px",
                fontSize: "13px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    color: "#555",
                    background: "#ececec",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontWeight: "500",
                  }}
                >
                  User-added
                </span>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label
                  htmlFor={`tags-${item.id}`}
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                    color: "#495057",
                  }}
                >
                  Designer Tags
                </label>

                <input
                  id={`tags-${item.id}`}
                  type="text"
                  value={tagValue}
                  onChange={(e) => onTagChange(item.id, e.target.value)}
                  placeholder="e.g. embroidered neckline, artisan market, resort"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "8px 12px",
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    fontSize: "13px",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor={`note-${item.id}`}
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                    color: "#495057",
                  }}
                >
                  Designer Note
                </label>

                <textarea
                  id={`note-${item.id}`}
                  value={noteValue}
                  onChange={(e) => onNoteChange(item.id, e.target.value)}
                  placeholder="Add your own observation here"
                  rows={3}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    resize: "vertical",
                    padding: "8px 12px",
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    fontSize: "13px",
                    fontFamily: "inherit",
                    minHeight: "80px",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageCard;
