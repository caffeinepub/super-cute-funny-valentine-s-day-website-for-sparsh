# Audio Setup Guide

This application supports two modes for background music and sound effects:

## 🎵 Audio Modes

### 1. Local Asset Mode (Default for bundled files)
Audio files are stored in `frontend/public/assets/audio/` and served as static assets.

**When to use:**
- You have audio files you want to bundle with your application
- You need guaranteed availability and fast loading
- You're deploying to environments with reliable static asset serving

**Setup:**
1. Place your audio files in `frontend/public/assets/audio/`
2. Reference them using relative paths: `'audio/your-file.mp3'`
3. The app will automatically resolve them via `getAssetUrl()`

**Example:**
