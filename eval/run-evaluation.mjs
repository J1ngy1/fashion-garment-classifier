import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { classifyImage } from "../app/src/utils/classifyImage.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

for (const sample of samples) {
  const predicted = await classifyImage(sample.fileName);
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
  accuracy,
  totals,
  correct,
  errorCount: errors.length,
  sampleErrors: errors.slice(0, 20),
  notes: [
    "This evaluation uses local mock multimodal classification based on filename tokens.",
    "Replace classifyImage() internals with a real multimodal API call for production-grade metrics.",
  ],
};

fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

const lines = [
  "Evaluation complete.",
  `Samples: ${report.sampleCount}`,
  ...Object.entries(report.accuracy).map(
    ([key, value]) => `Accuracy ${key}: ${value}%`,
  ),
  `Detailed report: ${reportPath}`,
];

console.log(lines.join("\n"));
