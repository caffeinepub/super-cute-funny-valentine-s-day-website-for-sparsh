# Specification

## Summary
**Goal:** Bundle the provided “I Wanna Be Yours” MP3 into the app so background music reliably loads and plays in production without hotlinking.

**Planned changes:**
- Download and commit the MP3 into the repo at `frontend/public/assets/audio/i-wanna-be-yours.mp3`.
- Ensure the existing background-music loader continues to reference only `getAssetUrl('audio/i-wanna-be-yours.mp3')` so it resolves correctly under the SPA base path.
- Verify background music loops after the intro overlay is accepted and the user performs the required interaction to unmute, and that audio stops when the app unmounts/tab closes.

**User-visible outcome:** After dismissing the intro overlay and interacting to unmute, users hear looping background music in production (no missing/404 audio), and it stops when they leave/close the app.
