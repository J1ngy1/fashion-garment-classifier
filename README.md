# Fashion Garment Classification & Inspiration Web App

This project is a lightweight web app for uploading garment photos, generating AI-like garment metadata, searching/filtering a visual library, and saving designer annotations.

## Setup

### Prerequisites

- Node.js 20+
- npm 10+

### Install

```bash
npm install
npm --prefix app install
```

### Run locally

```bash
npm --prefix app run dev
```

Open the URL printed by Vite (typically `http://127.0.0.1:5173`).

### Test commands

```bash
npm run test:unit
npm run test:e2e
```

### Evaluation command

```bash
npm run eval
```

This generates `eval/reports/latest-report.json`.

## Architecture Notes

- `app/src/App.jsx`: main UI state and workflows (upload, classify, filter, search, annotation, persistence).
- `app/src/utils/classifyImage.js`: classification service with parser boundary:
  - `parseModelOutput(raw)` normalizes model output into schema.
  - `classifyImage(fileLike)` currently uses a practical local/mock multimodal fallback based on filename tokens.
  - This is the plug point for real multimodal API integration.
- `app/src/utils/filterImages.js`: dynamic filter definitions and filtering/search logic.
- `app/src/components/ImageCard.jsx`: card UI with clear separation of AI metadata vs designer annotations.
- Persistence is implemented via `localStorage` for images, AI metadata, notes, and tags.

## Requirement Coverage

- Upload + classify: implemented with parser + mock fallback.
- Rich description + structured attributes: stored per image.
- Dynamic filters: generated from stored data (no hardcoded option values).
- Full-text search: description, metadata, and designer annotations.
- Designer annotations: tags + notes, searchable, and clearly marked as user-added.
- Required tests: unit parser test, integration location/time filter test, and e2e upload/classify/filter test.
- Required structure: `/app`, `/eval`, `/tests`, and this `README.md`.

## Evaluation Summary

- Dataset scaffold: `eval/labeled-test-set.json` with **50 labeled samples** (within required 50-100 range).
- Script: `eval/run-evaluation.mjs`.
- Report: per-attribute accuracy for garment type, style, material, color palette, pattern, occasion, and location context.
- Baseline behavior:
  - Stronger when filename has explicit signal tokens.
  - Weaker when key tokens are missing/ambiguous.

See `eval/EVALUATION_SUMMARY.md` and `eval/reports/latest-report.json`.

## Assumptions

- Local/mock multimodal fallback is acceptable when external AI APIs are not wired.
- In this baseline, image content is not visually analyzed; filename tokens drive inference.
- Local storage is acceptable for persistence in a local assessment environment.

## Trade-offs

- Pros: minimal setup, deterministic outputs, fast test/eval loop, easy to replace classifier backend later.
- Cons: mock classifier is not true vision understanding and can overfit to filename quality.
- Local storage is simple but not multi-user and not suitable for large-scale production datasets.

## Limitations

- No backend database or authentication.
- No real multimodal image inference yet (only local/mock fallback).
- Evaluation scaffold includes labels and file names; real image files should be placed in `eval/images/`.

## Next Steps

1. Replace local fallback in `classifyImage()` with real multimodal API call.
2. Add confidence scores and uncertainty handling per attribute.
3. Persist data in a backend database for multi-device access.
4. Expand evaluation with real images and confusion-matrix reporting.
