# Evaluation Summary

The evaluation harness uses **50 labeled rows** in `eval/labeled-test-set.json`.

## Modes

1. **Gemini multimodal (image + filename)**  
   When `GEMINI_API_KEY` is set (e.g. in `app/.env`, loaded by `eval/run-evaluation.mjs`) **and** a file exists at `eval/images/<basename of fileName>`, the runner calls `classifyImage({ fileName, imageDataUrl })`. Responses are normalized with `parseModelOutput()`.

2. **Local mock (filename-only)**  
   If the API key is missing or no matching image file is on disk, the runner uses `classifyImage(fileName)` (filename-token heuristics).

## Smoke row

- **`gemini-smoke.png`** (minimal 1×1 PNG) is included as a connectivity smoke test. The dataset marks it with `excludeFromAccuracy: true` so trivial-image output does not affect reported accuracy.

## Metrics

- **Per-attribute accuracy** (garment type, style, material, color palette, pattern, occasion, location context) is computed only on **scored** rows (all except excluded smoke rows).
- **`eval/reports/latest-report.json`** includes `geminiSuccessCount`, `mockClassifierCount`, and whether the API key was loaded.

## Improvement path

- Add real garment images under `eval/images/` matching the remaining basenames for a full vision benchmark.
- Tune prompts in `app/src/utils/classifyImage.js` or switch models for better attribute agreement with manual labels.
