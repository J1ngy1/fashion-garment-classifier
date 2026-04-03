# Evaluation images

Place evaluation images here so filenames **match** the `fileName` field in `eval/labeled-test-set.json` (same basename).

- **`gemini-smoke.png`**: minimal 1×1 PNG shipped as a smoke fixture to verify Gemini multimodal + `parseModelOutput` when `GEMINI_API_KEY` is set in `app/.env`. This row is marked `excludeFromAccuracy` in the dataset so trivial image output does not skew accuracy.
- **Full Gemini run**: copy or symlink up to **50 real garment photos** using the basenames in `labeled-test-set.json` (e.g. `dress-bohemian-linen-floral-...jpg`). Rows with a file on disk and a configured API key are classified with Gemini; missing files fall back to the filename-based mock.
