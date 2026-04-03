import { describe, expect, it } from "vitest";
import { parseModelOutput } from "../../app/src/utils/classifyImage";

describe("parseModelOutput", () => {
  it("parses a JSON model response into normalized structured attributes", () => {
    const raw = JSON.stringify({
      description: "Blue denim jacket with streetwear styling.",
      garmentType: "Jacket",
      style: "Streetwear",
      material: "Denim",
      colorPalette: "Blue",
      pattern: "Solid",
      season: "Fall",
      occasion: "Casual",
      consumerProfile: "Young Adult",
      trendNotes: "Oversized layers are trending.",
      location: {
        continent: "North America",
        country: "United States",
        city: "New York",
      },
      time: {
        year: 2025,
        month: "September",
        seasonCaptured: "Fall",
      },
      designer: "Alex",
    });

    const parsed = parseModelOutput(raw);

    expect(parsed.garmentType).toBe("Jacket");
    expect(parsed.location.country).toBe("United States");
    expect(parsed.time.year).toBe(2025);
    expect(parsed.consumerProfile).toBe("Young Adult");
  });

  it("fills missing fields with safe defaults", () => {
    const parsed = parseModelOutput({
      description: "Minimal metadata response",
      location: {},
      time: {},
    });

    expect(parsed.garmentType).toBe("Unknown");
    expect(parsed.location.city).toBe("Unknown");
    expect(parsed.time.month).toBe("Unknown");
    expect(parsed.time.year).toBeTypeOf("number");
  });
});
