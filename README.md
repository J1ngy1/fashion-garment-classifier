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

Open the URL printed by Vite (typically `http://localhost:5173/`).

### Gemini API (real multimodal classification)

1. **Create an API key** in [Google AI Studio](https://aistudio.google.com/apikey) (Gemini Developer API).

2. **Store the key in `.env`** (not committed). Copy `app/.env.example` to `app/.env` and set:

   ```bash
   GEMINI_API_KEY=your_key_here
   ```

   Vite exposes variables whose names start with `GEMINI_`, so `GEMINI_API_KEY` is available to the app as `import.meta.env.GEMINI_API_KEY`. **Do not paste keys into source code.**

3. **Run in real API mode**: restart the dev server after changing `.env`. Upload images and click **Run Demo AI Classification**. When the key is present and the image is a `data:` URL (uploaded file), the app calls Gemini with the image and parses JSON through `parseModelOutput()`.

4. **Fallback mode**: If `GEMINI_API_KEY` is missing, empty, or the Gemini request fails, classification automatically uses the **local mock** (filename-token heuristics).

5. **Evaluation (`npm run eval`)**: The script `eval/run-evaluation.mjs` loads `GEMINI_API_KEY` from the environment or from `app/.env` (without printing the key). For each row in `eval/labeled-test-set.json`, if a file exists at `eval/images/<basename>` and the key is set, that sample is classified with **Gemini + image**; otherwise it uses the **filename mock**. The shipped `eval/images/gemini-smoke.png` is a smoke test (excluded from accuracy so trivial image output does not skew metrics). Add more images matching the dataset basenames for a full multimodal benchmark.

6. **Free tier**: Gemini API usage may be subject to [rate limits and quotas](https://ai.google.dev/pricing); free-tier caps may apply.

7. **Security note**: The key is loaded in the browser bundle for this local demo. For production, call Gemini from a backend and keep keys server-side. The eval script only reads the key server-side from `app/.env`; it never logs the secret.

#### Gemini model IDs (stable)

The app uses two model names in `app/src/utils/classifyImage.js` only:

| Role                        | Model ID           |
| --------------------------- | ------------------ |
| Primary                     | `gemini-2.5-flash` |
| Fallback (if primary fails) | `gemini-2.0-flash` |

These match the [current Gemini API model list](https://ai.google.dev/gemini-api/docs/models/gemini) for the Developer API. Older names (`gemini-1.5-flash` without a version, etc.) often return **404** for newer projects; **429** means [quota / rate](https://ai.google.dev/gemini-api/docs/rate-limits) — wait and retry, or switch to a paid tier in Google AI Studio.

If you must use a different model, edit only `GEMINI_MODEL_PRIMARY` / `GEMINI_MODEL_FALLBACK` in that file — do not scatter model names elsewhere.

### Test commands

```bash
npm run test:unit
npm run test:e2e
```

### Evaluation command

```bash
npm run eval
```

This generates `eval/reports/latest-report.json`. **By default, evaluation uses the local mock classifier** to avoid API costs and ensure fast, deterministic results during development and testing. The mock provides filename-token based inference without requiring real images or API calls.

To enable real Gemini multimodal evaluation:

1. Set `GEMINI_API_KEY` in `app/.env`
2. Place image files under `eval/images/` whose basenames match entries in `eval/labeled-test-set.json`
3. Run `npm run eval` — samples with matching images will use Gemini vision classification

**Note**: The current evaluation setup intentionally uses the mock by default to:

- **Save costs**: Avoid Gemini API charges during frequent testing and CI runs
- **Ensure speed**: Mock classification is instant vs. API round-trips
- **Provide determinism**: Consistent results across runs without network dependencies
- **Enable offline evaluation**: No internet required for basic functionality testing

Only the included `eval/images/gemini-smoke.png` (a minimal smoke test) triggers real API calls when the key is configured. For full multimodal benchmarking, add real garment images to `eval/images/`.

See `eval/EVALUATION_SUMMARY.md` and `eval/reports/latest-report.json`.

**Debug Gemini from the CLI:** `node eval/try-gemini-once.mjs` (prints `classificationSource` and one field; never prints the key). **Verbose eval** (why a row fell back to mock): set `EVAL_VERBOSE=1` when running `npm run eval` (same shell as your package manager).

## Architecture Notes

- `app/src/App.jsx`: main UI state and workflows (upload, classify, filter, search, annotation, persistence).
- `app/src/utils/classifyImage.js`: classification service with parser boundary:
  - `parseModelOutput(raw)` normalizes model output into schema (supports `location`/`time` or `locationContext`/`timeContext`).
  - `classifyImage(input)` calls **Gemini** when `GEMINI_API_KEY` is set and an uploaded `imageDataUrl` is provided; otherwise uses the **local mock** (filename tokens).
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
- Script: `eval/run-evaluation.mjs` (loads `app/.env` for `GEMINI_API_KEY`, never prints secrets).
- Report: per-attribute accuracy for garment type, style, material, color palette, pattern, occasion, and location context; plus `geminiSuccessCount` vs mock/fallback counts.
- **Default behavior**: Uses local mock classification to avoid API costs and ensure fast evaluation. Only enables Gemini multimodal when both API key and matching image files are present.
- **Gemini**: Rows with a matching file in `eval/images/` and a valid API key run vision classification; the repo includes `eval/images/gemini-smoke.png` for a connectivity smoke test (excluded from accuracy).
- **Mock**: Rows without an on-disk image or without a key use filename-token inference.

See `eval/EVALUATION_SUMMARY.md` and `eval/reports/latest-report.json`.

## Assumptions

- Local/mock multimodal fallback is acceptable when external AI APIs are not wired or fail.
- With `GEMINI_API_KEY`, uploaded images are analyzed visually via Gemini; without it, filename tokens drive inference.
- Local storage is acceptable for persistence in a local assessment environment.

## Trade-offs

- Pros: minimal setup, deterministic outputs, fast test/eval loop, easy to replace classifier backend later. **Mock evaluation avoids API costs and provides instant feedback during development.**
- Cons: mock classifier is not true vision understanding and can overfit to filename quality. **Real multimodal evaluation requires API keys and image files, adding cost and complexity.**
- Local storage is simple but not multi-user and not suitable for large-scale production datasets.

## Limitations

- No backend database or authentication.
- Gemini runs in the browser for this demo; keys are embedded in the client bundle when using `.env` with Vite (not suitable for production).
- Remote seed image URLs (not `data:` URLs) are not sent to Gemini from the client; only uploaded files use multimodal classification when the key is set.
- Full vision evaluation requires placing image files in `eval/images/` whose basenames match `labeled-test-set.json`; only the smoke PNG is bundled by default.

## Next Steps

1. Move Gemini calls to a small backend proxy to protect API keys in production.
2. Add confidence scores and uncertainty handling per attribute.
3. Persist data in a backend database for multi-device access.
4. Expand evaluation with real images and confusion-matrix reporting.
