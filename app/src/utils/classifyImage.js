const UNKNOWN = "Unknown";

function readTokenValue(lowerName, mapping, fallback = UNKNOWN) {
  for (const [token, value] of mapping) {
    if (lowerName.includes(token)) {
      return value;
    }
  }
  return fallback;
}

function inferFromFileName(fileName = "") {
  const lowerName = fileName.toLowerCase();
  const garmentType = readTokenValue(lowerName, [
    ["dress", "Dress"],
    ["jacket", "Jacket"],
    ["coat", "Coat"],
    ["blazer", "Blazer"],
    ["shirt", "Shirt"],
    ["pants", "Pants"],
    ["skirt", "Skirt"],
  ]);
  const style = readTokenValue(lowerName, [
    ["street", "Streetwear"],
    ["minimal", "Minimal"],
    ["tailored", "Tailored"],
    ["boho", "Bohemian"],
    ["bohemian", "Bohemian"],
    ["sport", "Sporty"],
  ]);
  const material = readTokenValue(lowerName, [
    ["denim", "Denim"],
    ["linen", "Linen"],
    ["wool", "Wool Blend"],
    ["cotton", "Cotton Blend"],
    ["leather", "Leather"],
  ]);
  const colorPalette = readTokenValue(lowerName, [
    ["blue", "Blue"],
    ["black", "Black"],
    ["white", "White"],
    ["beige", "Beige"],
    ["red", "Red"],
    ["green", "Green"],
  ]);
  const pattern = readTokenValue(lowerName, [
    ["floral", "Floral"],
    ["striped", "Striped"],
    ["solid", "Solid"],
    ["plaid", "Plaid"],
  ]);
  const occasion = readTokenValue(lowerName, [
    ["work", "Work"],
    ["office", "Work"],
    ["party", "Party"],
    ["casual", "Casual"],
    ["vacation", "Vacation"],
    ["resort", "Vacation"],
  ]);
  const season = readTokenValue(lowerName, [
    ["spring", "Spring"],
    ["summer", "Summer"],
    ["fall", "Fall"],
    ["autumn", "Fall"],
    ["winter", "Winter"],
  ]);
  const continent = readTokenValue(lowerName, [
    ["asia", "Asia"],
    ["europe", "Europe"],
    ["america", "North America"],
    ["africa", "Africa"],
  ]);
  const country = readTokenValue(lowerName, [
    ["france", "France"],
    ["thailand", "Thailand"],
    ["korea", "South Korea"],
    ["japan", "Japan"],
    ["usa", "United States"],
    ["uk", "United Kingdom"],
  ]);
  const city = readTokenValue(lowerName, [
    ["paris", "Paris"],
    ["bangkok", "Bangkok"],
    ["seoul", "Seoul"],
    ["tokyo", "Tokyo"],
    ["london", "London"],
    ["newyork", "New York"],
    ["new-york", "New York"],
  ]);
  const month = readTokenValue(lowerName, [
    ["january", "January"],
    ["february", "February"],
    ["march", "March"],
    ["april", "April"],
    ["may", "May"],
    ["june", "June"],
    ["july", "July"],
    ["august", "August"],
    ["september", "September"],
    ["october", "October"],
    ["november", "November"],
    ["december", "December"],
  ]);
  const yearMatch = lowerName.match(/\b(20\d{2})\b/);
  const year = yearMatch ? Number(yearMatch[1]) : new Date().getFullYear();
  const consumerProfile = readTokenValue(lowerName, [
    ["women", "Women"],
    ["men", "Men"],
    ["teen", "Teen"],
    ["professional", "Professional"],
  ], "General");
  const designer = readTokenValue(lowerName, [
    ["alex", "Alex"],
    ["mia", "Mia"],
    ["sophia", "Sophia"],
    ["james", "James"],
  ], "Current User");

  const compactDescription = `${colorPalette} ${material} ${garmentType}`
    .replace(/\bUnknown\b/g, "")
    .trim();
  const description = compactDescription
    ? `${compactDescription} with ${style.toLowerCase()} styling`.replace(
        "unknown styling",
        "versatile styling",
      )
    : `Garment image likely featuring ${garmentType.toLowerCase()} details.`;

  return {
    description,
    garmentType,
    style,
    material,
    colorPalette,
    pattern,
    season,
    occasion,
    consumerProfile,
    trendNotes:
      "Local mock multimodal inference from filename tokens and defaults.",
    location: {
      continent,
      country,
      city,
    },
    time: {
      year,
      month,
      seasonCaptured: season,
    },
    designer,
  };
}

export function parseModelOutput(rawOutput) {
  let parsed = rawOutput;
  if (typeof rawOutput === "string") {
    parsed = JSON.parse(rawOutput);
  }
  const location = parsed.location || {};
  const time = parsed.time || {};
  const normalized = {
    description: parsed.description || "No description generated.",
    garmentType: parsed.garmentType || UNKNOWN,
    style: parsed.style || UNKNOWN,
    material: parsed.material || UNKNOWN,
    colorPalette: parsed.colorPalette || UNKNOWN,
    pattern: parsed.pattern || UNKNOWN,
    season: parsed.season || UNKNOWN,
    occasion: parsed.occasion || UNKNOWN,
    consumerProfile: parsed.consumerProfile || UNKNOWN,
    trendNotes: parsed.trendNotes || UNKNOWN,
    location: {
      continent: location.continent || UNKNOWN,
      country: location.country || UNKNOWN,
      city: location.city || UNKNOWN,
    },
    time: {
      year:
        typeof time.year === "number" ? time.year : new Date().getFullYear(),
      month: time.month || UNKNOWN,
      seasonCaptured: time.seasonCaptured || parsed.season || UNKNOWN,
    },
    designer: parsed.designer || "Current User",
  };
  return normalized;
}

function localMockMultimodalOutput(fileName = "") {
  const inferred = inferFromFileName(fileName);
  return JSON.stringify(inferred);
}

export async function classifyImage(fileLike) {
  const fileName =
    typeof fileLike === "string" ? fileLike : fileLike?.name || "unknown-image";
  try {
    const rawOutput = localMockMultimodalOutput(fileName);
    const parsed = parseModelOutput(rawOutput);
    return {
      ...parsed,
      classificationSource: "local-mock",
    };
  } catch (error) {
    const fallback = parseModelOutput(inferFromFileName(fileName));
    return {
      ...fallback,
      classificationSource: "fallback-parser",
      trendNotes: `Fallback classification used due to parser error: ${error.message}`,
    };
  }
}
