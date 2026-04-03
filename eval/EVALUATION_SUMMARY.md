# Evaluation Summary

The baseline evaluation runs on a labeled scaffold of **50 fashion samples** in `eval/labeled-test-set.json`.

- Evaluated attributes: garment type, style, material, color palette, pattern, occasion, and location context (continent/country/city).
- Classifier mode: local mock multimodal fallback (`classifyImage`) with parser normalization.
- Current strengths: garment type, style, and location context perform well when filename tokens are explicit.
- Current weaknesses: color palette and pattern are weaker when samples omit those tokens.
- Improvement path: connect `classifyImage` to a real multimodal model (image+text), then keep `parseModelOutput` as the stable schema boundary and rerun `npm run eval`.
