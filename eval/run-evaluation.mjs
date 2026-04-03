import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { classifyImage } from "../app/src/utils/classifyImage.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIME_BY_EXT = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".bmp": "image/bmp",
};

function loadEnvFromAppDotEnv() {
  const appEnv = path.join(__dirname, "../app/.env");
  if (!fs.existsSync(appEnv)) {
    return;
  }
  const content = fs.readFileSync(appEnv, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const match = trimmed.match(/^GEMINI_API_KEY\s*=\s*(.*)$/);
    if (match && !process.env.GEMINI_API_KEY) {
      let value = match[1].trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env.GEMINI_API_KEY = value;
    }
  }
}

function getGeminiApiKey() {
  return String(process.env.GEMINI_API_KEY || "").trim();
}

function fileToDataUrl(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME_BY_EXT[ext] || "application/octet-stream";
  const buf = fs.readFileSync(filePath);
  return `data:${mime};base64,${buf.toString("base64")}`;
}

function resolveImagePath(fileName) {
  const base = path.basename(fileName);
  const imagePath = path.join(__dirname, "images", base);
  if (fs.existsSync(imagePath) && fs.statSync(imagePath).isFile()) {
    return imagePath;
  }
  return null;
}

loadEnvFromAppDotEnv();

const datasetPath = path.join(__dirname, "labeled-test-set.json");
const reportDir = path.join(__dirname, "reports");
const reportPath = path.join(reportDir, "latest-report.json");

const raw = fs.readFileSync(datasetPath, "utf-8");
const samples = JSON.parse(raw);

const trackedAttributes = [
  "garmentType",
  "style",
  "material",
  "colorPalette",
  "pattern",
  "occasion",
];

function isLocationMatch(expected, predicted) {
  return (
    expected.continent === predicted.location.continent &&
    expected.country === predicted.location.country &&
    expected.city === predicted.location.city
  );
}

const totals = Object.fromEntries(
  [...trackedAttributes, "locationContext"].map((name) => [name, 0]),
);
const correct = Object.fromEntries(
  [...trackedAttributes, "locationContext"].map((name) => [name, 0]),
);
const errors = [];

let geminiSuccessCount = 0;
let mockClassifierCount = 0;
let samplesWithoutImageFile = 0;
let samplesWithoutApiKey = 0;
let skippedAccuracy = 0;

for (const sample of samples) {
  const imagePath = resolveImagePath(sample.fileName);
  const apiKey = getGeminiApiKey();
  let predicted;

  if (!apiKey) {
    samplesWithoutApiKey += 1;
  }
  if (!imagePath) {
    samplesWithoutImageFile += 1;
  }

  if (imagePath && apiKey) {
    try {
      const imageDataUrl = fileToDataUrl(imagePath);
      predicted = await classifyImage({
        fileName: sample.fileName,
        imageDataUrl,
      });
      if (predicted.classificationSource === "gemini") {
        geminiSuccessCount += 1;
      } else {
        mockClassifierCount += 1;
        if (process.env.EVAL_VERBOSE === "1") {
          console.warn(
            `[eval] ${sample.fileName}: expected Gemini, got ${predicted.classificationSource}`,
          );
        }
      }
    } catch (error) {
      if (process.env.EVAL_VERBOSE === "1") {
        console.warn(`[eval] Gemini error for ${sample.fileName}:`, error.message);
      }
      predicted = await classifyImage(sample.fileName);
      mockClassifierCount += 1;
    }
  } else {
    predicted = await classifyImage(sample.fileName);
    mockClassifierCount += 1;
  }

  if (sample.excludeFromAccuracy) {
    skippedAccuracy += 1;
    continue;
  }

  for (const attribute of trackedAttributes) {
    totals[attribute] += 1;
    if (sample.expected[attribute] === predicted[attribute]) {
      correct[attribute] += 1;
    } else {
      errors.push({
        id: sample.id,
        fileName: sample.fileName,
        attribute,
        expected: sample.expected[attribute],
        predicted: predicted[attribute],
      });
    }
  }

  totals.locationContext += 1;
  if (isLocationMatch(sample.expected.location, predicted)) {
    correct.locationContext += 1;
  } else {
    errors.push({
      id: sample.id,
      fileName: sample.fileName,
      attribute: "locationContext",
      expected: sample.expected.location,
      predicted: predicted.location,
    });
  }
}

const accuracy = Object.fromEntries(
  Object.keys(totals).map((attribute) => [
    attribute,
    Number(((correct[attribute] / totals[attribute]) * 100).toFixed(2)),
  ]),
);

const report = {
  generatedAt: new Date().toISOString(),
  sampleCount: samples.length,
  scoredSampleCount: samples.length - skippedAccuracy,
  skippedForAccuracy: skippedAccuracy,
  geminiApiConfigured: Boolean(getGeminiApiKey()),
  geminiSuccessCount,
  mockClassifierCount,
  samplesWithoutImageFile,
  samplesWithoutApiKey,
  accuracy,
  totals,
  correct,
  errorCount: errors.length,
  sampleErrors: errors.slice(0, 20),
  notes: [
    "Samples with a matching file under eval/images/ and GEMINI_API_KEY set use Gemini multimodal classification (then parseModelOutput).",
    "Missing image files or missing API key fall back to the local filename classifier.",
    "Rows with excludeFromAccuracy: true (e.g. gemini-smoke.png) verify API connectivity without affecting aggregate accuracy.",
  ],
};

fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

const lines = [
  "Evaluation complete.",
  `Samples: ${report.sampleCount} (scored: ${report.scoredSampleCount}, skipped: ${skippedAccuracy})`,
  `GEMINI_API_KEY: ${getGeminiApiKey() ? "set" : "not set"}`,
  `Gemini successes (classificationSource=gemini): ${geminiSuccessCount}`,
  `Mock / fallback classifications: ${mockClassifierCount}`,
  ...Object.entries(report.accuracy).map(
    ([key, value]) => `Accuracy ${key}: ${value}%`,
  ),
  `Detailed report: ${reportPath}`,
];

console.log(lines.join("\n"));
