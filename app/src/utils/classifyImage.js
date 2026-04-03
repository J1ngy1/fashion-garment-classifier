const UNKNOWN = "Unknown";

// Stable defaults for the Gemini Developer API (see README "Gemini model IDs").
// Primary: fast, broadly available on current API keys. Fallback: if primary errors.
// Change these only if you get 404 (model not enabled for your key) or a permanent migration notice from Google.
const GEMINI_MODEL_PRIMARY = "gemini-2.5-flash";
const GEMINI_MODEL_FALLBACK = "gemini-2.0-flash";

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
  const consumerProfile = readTokenValue(
    lowerName,
    [
      ["women", "Women"],
      ["men", "Men"],
      ["teen", "Teen"],
      ["professional", "Professional"],
    ],
    "General",
  );
  const designer = readTokenValue(
    lowerName,
    [
      ["alex", "Alex"],
      ["mia", "Mia"],
      ["sophia", "Sophia"],
      ["james", "James"],
    ],
    "Current User",
  );

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

/**
 * Normalizes model output (JSON object or JSON string) into the app schema.
 * Accepts legacy keys `location` / `time` or Gemini-oriented `locationContext` / `timeContext`.
 */
export function parseModelOutput(rawOutput) {
  console.log("[parseModelOutput] Parsing model output");
  let parsed = rawOutput;

  if (typeof rawOutput === "string") {
    console.log(
      "[parseModelOutput] Raw output is string, attempting to parse JSON",
    );
    const trimmed = rawOutput.trim();
    const unfenced = trimmed
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "");

    try {
      parsed = JSON.parse(unfenced);
      console.log("[parseModelOutput] JSON parsing successful");
    } catch (parseError) {
      console.error(
        "[parseModelOutput] JSON parsing failed:",
        parseError.message,
      );
      console.error("[parseModelOutput] Raw output was:", rawOutput);
      throw new Error(
        `Failed to parse model output as JSON: ${parseError.message}`,
      );
    }
  } else {
    console.log("[parseModelOutput] Raw output is already an object");
  }

  const location = parsed.locationContext || parsed.location || {};
  const time = parsed.timeContext || parsed.time || {};

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

  console.log("[parseModelOutput] Normalization completed");
  return normalized;
}

function localMockMultimodalOutput(fileName = "") {
  const inferred = inferFromFileName(fileName);
  return JSON.stringify(inferred);
}

function getGeminiApiKey() {
  if (
    typeof import.meta !== "undefined" &&
    import.meta.env?.VITE_PLAYWRIGHT === "1"
  ) {
    console.log("[API Key] Playwright test mode detected, returning empty key");
    return "";
  }

  if (typeof import.meta !== "undefined" && import.meta.env?.GEMINI_API_KEY) {
    const key = String(import.meta.env.GEMINI_API_KEY).trim();
    console.log(
      `[API Key] Found key in import.meta.env (length: ${key.length})`,
    );
    return key;
  }

  if (typeof process !== "undefined" && process.env?.GEMINI_API_KEY) {
    const key = String(process.env.GEMINI_API_KEY).trim();
    console.log(`[API Key] Found key in process.env (length: ${key.length})`);
    return key;
  }

  console.log("[API Key] No Gemini API key found in environment");
  return "";
}

export function isGeminiAvailable() {
  const hasKey = getGeminiApiKey() !== "";
  console.log(`[Gemini Available] ${hasKey ? "Yes" : "No"}`);
  return hasKey;
}

function parseDataUrl(dataUrl) {
  if (!dataUrl || typeof dataUrl !== "string") {
    return null;
  }
  const match = /^data:([^;]+);base64,(.+)$/i.exec(dataUrl.trim());
  if (!match) {
    return null;
  }
  return { mimeType: match[1].split(";")[0].trim(), base64: match[2].trim() };
}

const GEMINI_JSON_INSTRUCTION = `You are a fashion garment analyst. Look at the garment image and respond with ONLY valid JSON (no markdown) using exactly these keys:
{
  "description": "string — rich natural-language description of the garment and styling",
  "garmentType": "string",
  "style": "string",
  "material": "string",
  "colorPalette": "string",
  "pattern": "string",
  "season": "string",
  "occasion": "string",
  "consumerProfile": "string",
  "locationContext": { "continent": "string", "country": "string", "city": "string" },
  "timeContext": { "year": number, "month": "string", "seasonCaptured": "string" }
}
Use "${UNKNOWN}" when not inferable from the image. For location/time, infer only if visible in the image (signs, landmarks, EXIF is not available); otherwise use "${UNKNOWN}" for those fields.`;

async function generateGeminiJson(
  apiKey,
  modelName,
  mimeType,
  base64,
  fileName,
) {
  console.log(`[Gemini API] Calling ${modelName} for file: ${fileName}`);

  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
  });

  const result = await model.generateContent([
    {
      text: `${GEMINI_JSON_INSTRUCTION}\nOriginal filename (hint only): ${fileName}\n\nRespond with a single JSON object only (no markdown fences).`,
    },
    {
      inlineData: {
        mimeType,
        data: base64,
      },
    },
  ]);

  const text = result.response.text();
  console.log(
    `[Gemini API] Response received from ${modelName}, length: ${text.length} characters`,
  );

  // Log a preview of the response for debugging
  const preview = text.substring(0, 200) + (text.length > 200 ? "..." : "");
  console.log(`[Gemini API] Response preview: ${preview}`);

  return text;
}

async function classifyWithGemini(imageDataUrl, fileName) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    console.log("[Gemini] No API key available");
    return null;
  }

  const parsedUrl = parseDataUrl(imageDataUrl);
  if (!parsedUrl) {
    console.log("[Gemini] Failed to parse image data URL");
    return null;
  }

  console.log(
    `[Gemini] Attempting classification for "${fileName}" with ${parsedUrl.mimeType} image`,
  );

  try {
    console.log(`[Gemini] Trying primary model: ${GEMINI_MODEL_PRIMARY}`);
    const text = await generateGeminiJson(
      apiKey,
      GEMINI_MODEL_PRIMARY,
      parsedUrl.mimeType,
      parsedUrl.base64,
      fileName,
    );
    console.log("[Gemini] Primary model succeeded");
    return parseModelOutput(text);
  } catch (primaryError) {
    console.warn(
      `[Gemini] Primary model (${GEMINI_MODEL_PRIMARY}) failed:`,
      primaryError.message || primaryError,
    );

    try {
      console.log(`[Gemini] Trying fallback model: ${GEMINI_MODEL_FALLBACK}`);
      const text = await generateGeminiJson(
        apiKey,
        GEMINI_MODEL_FALLBACK,
        parsedUrl.mimeType,
        parsedUrl.base64,
        fileName,
      );
      console.log("[Gemini] Fallback model succeeded");
      return parseModelOutput(text);
    } catch (fallbackError) {
      console.error(
        `[Gemini] Fallback model (${GEMINI_MODEL_FALLBACK}) also failed:`,
        fallbackError.message || fallbackError,
      );
      throw primaryError;
    }
  }
}

function runLocalMock(fileName) {
  const rawOutput = localMockMultimodalOutput(fileName);
  const parsed = parseModelOutput(rawOutput);
  return {
    ...parsed,
    classificationSource: "local-mock",
  };
}

/**
 * Classify a garment image.
 * - Pass a string (filename) for filename-only mock (eval, tests).
 * - Pass { fileName, imageDataUrl } to allow Gemini multimodal analysis when GEMINI_API_KEY is set.
 */
export async function classifyImage(input) {
  const fileName =
    typeof input === "string" ? input : input?.fileName || "unknown-image";
  const imageDataUrl =
    typeof input === "object" && input ? input.imageDataUrl : undefined;

  console.log(`[classifyImage] Starting classification for "${fileName}"`);

  if (imageDataUrl && getGeminiApiKey()) {
    console.log(
      "[classifyImage] Gemini API key available and image provided, attempting Gemini classification",
    );
    try {
      const geminiParsed = await classifyWithGemini(imageDataUrl, fileName);
      if (geminiParsed) {
        console.log("[classifyImage] Gemini classification successful");
        return {
          ...geminiParsed,
          classificationSource: "gemini",
        };
      } else {
        console.log(
          "[classifyImage] Gemini returned null, falling back to local mock",
        );
      }
    } catch (error) {
      console.error(
        "[classifyImage] Gemini classification failed, falling back to local mock:",
        error.message || error,
      );
      if (typeof process !== "undefined" && process.env.EVAL_VERBOSE === "1") {
        console.warn("[classifyImage] Detailed Gemini error:", error);
      }
    }
  } else {
    if (!imageDataUrl) {
      console.log(
        "[classifyImage] No image data URL provided, using filename-only mock",
      );
    } else if (!getGeminiApiKey()) {
      console.log(
        "[classifyImage] No Gemini API key available, using local mock",
      );
    }
  }

  try {
    console.log("[classifyImage] Running local mock classification");
    const result = runLocalMock(fileName);
    console.log("[classifyImage] Local mock classification completed");
    return result;
  } catch (error) {
    console.error(
      "[classifyImage] Local mock failed, using fallback parser:",
      error.message || error,
    );
    const fallback = parseModelOutput(inferFromFileName(fileName));
    console.log("[classifyImage] Fallback parser completed");
    return {
      ...fallback,
      classificationSource: "fallback-parser",
      trendNotes: `Fallback classification used due to parser error: ${error.message}`,
    };
  }
}
