# Specification

## Summary
**Goal:** Ensure the provided “I Wanna Be Yours” MP3 is included as a static frontend asset so the existing background-music loader can fetch and play it at runtime.

**Planned changes:**
- Add the attached MP3 file to `frontend/public/assets/audio/i-wanna-be-yours.mp3` so it matches the existing `getAssetUrl('audio/i-wanna-be-yours.mp3')` reference.
- Verify the asset is served from the correct SPA base path (BASE_URL-safe) and loads without 404s using the current asset-loading approach.

**User-visible outcome:** After accepting the intro overlay and unmuting background music, the “I Wanna Be Yours” track plays and loops; muting pauses/stops playback as it currently does.
