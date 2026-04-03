/**
 * One-off smoke: loads app/.env, calls classifyImage on eval/images/gemini-smoke.png.
 * Run: node eval/try-gemini-once.mjs
 * Does not print the API key; prints classificationSource or error message.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { classifyImage } from "../app/src/utils/classifyImage.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

function fileToDataUrl(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime =
    ext === ".png"
      ? "image/png"
      : ext === ".jpg" || ext === ".jpeg"
        ? "image/jpeg"
        : "application/octet-stream";
  const buf = fs.readFileSync(filePath);
  return `data:${mime};base64,${buf.toString("base64")}`;
}

loadEnvFromAppDotEnv();

const imagePath = path.join(__dirname, "images", "gemini-smoke.png");
if (!fs.existsSync(imagePath)) {
  console.error("Missing: eval/images/gemini-smoke.png");
  process.exit(1);
}

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY not set (add app/.env or export in shell).");
  process.exit(1);
}

if (!process.env.GEMINI_API_KEY.trim()) {
  console.error("GEMINI_API_KEY is empty.");
  process.exit(1);
}

try {
  const imageDataUrl = fileToDataUrl(imagePath);
  const result = await classifyImage({
    fileName: "gemini-smoke.png",
    imageDataUrl,
  });
  console.log("classificationSource:", result.classificationSource);
  console.log("garmentType:", result.garmentType);
} catch (error) {
  console.error("Error:", error.message);
  process.exit(1);
}
