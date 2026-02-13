# Specification

## Summary
**Goal:** Allow the app to stream background music and other audio directly from an external MP3 URL while preserving support for bundled/relative audio assets.

**Planned changes:**
- Update audio URL resolution to support two explicit modes: relative asset paths resolved via `getAssetUrl()` and absolute `http(s)` URLs used as-is, applied consistently for background music and intro overlay ambient/confirm audio.
- Adjust audio validation/guard logic so valid external URLs are not flagged (and no concatenated paths like `audio/https://...` are ever constructed).
- Update audio preflight/diagnostics to work with external URLs, including fallback behavior when `HEAD` is blocked and clearer error reporting for non-audio responses, without breaking the UI.
- Update `README_AUDIO_SETUP.md` and `DEPLOYMENT_TROUBLESHOOTING.md` to document external MP3 streaming configuration and related troubleshooting (reachability, CORS/content-type), in English.

**User-visible outcome:** Users can configure the app to play audio from a full external MP3 link (or continue using local asset audio), and will see existing English error messaging if the stream can’t be loaded or played.
