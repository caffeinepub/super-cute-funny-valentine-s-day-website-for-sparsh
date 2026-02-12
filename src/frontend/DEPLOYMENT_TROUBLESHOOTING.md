# Deployment Troubleshooting Guide

This document provides a comprehensive checklist for diagnosing deployment issues with the Valentine's Day SPA.

## Quick Diagnostics Checklist

### 1. Check Build Output
- [ ] Build completes without errors
- [ ] All assets are bundled correctly
- [ ] No missing dependencies or import errors
- [ ] TypeScript compilation succeeds
- [ ] Verify the exact failing step/task name if build fails

### 2. Verify Asset Paths
- [ ] Check browser console for 404 errors on assets
- [ ] Verify `BASE_URL` is set correctly in build environment
- [ ] Confirm asset URLs resolve to correct paths
- [ ] Check that `getAssetUrl()` helper is used for all generated images

### 3. Runtime Diagnostics
Open browser console and look for:
- [ ] `[Deploy Diagnostics]` startup logs showing:
  - Timestamp, Base URL, Mode, Location
  - User Agent and Viewport dimensions
  - DOM ready and resource load completion
  - Performance metrics
- [ ] Any `ResourceLoadError` entries (failed scripts, stylesheets, images)
- [ ] Any `JavaScriptError` entries with full stack traces
- [ ] Any `UnhandledPromiseRejection` entries with serialized reason
- [ ] Network tab shows successful asset loading

### 4. Common Issues

#### Assets Return 404
**Symptom**: Images don't load, background pattern missing
**Solution**: 
- Verify assets are in `frontend/public/assets/` directory
- Check that build process copies assets correctly
- Ensure `getAssetUrl()` is used for all asset references
- Look for `[Deploy Diagnostics] Resource load failure` logs with exact failing URLs

#### Blank Screen After Deploy
**Symptom**: App loads but shows nothing
**Solution**:
- Check browser console for JavaScript errors
- Look for `[Deploy Diagnostics] Global JavaScript error` entries
- Verify React root element exists in index.html
- Check that all components render without errors
- Look for unhandled promise rejections in diagnostics logs

#### Base Path Issues
**Symptom**: App works locally but not after deployment
**Solution**:
- Verify `BASE_URL` environment variable is set during build
- Check `[Deploy Diagnostics]` logs for Base URL value
- Check that Vite config uses correct base path
- Ensure all asset references use `getAssetUrl()` helper

### 5. Collecting Diagnostic Information for Bug Reports

When reporting deployment issues, **you must include**:

#### A. Build/Deploy Task Information
1. **Exact failing step/task name** from the build runner output
   - Example: "vite build", "dfx deploy", "npm run build", etc.
   - Include the command that failed

#### B. Full Error Output
2. **Complete error message** from the build/deploy process
   - Copy the entire error output, not just the summary
   - Include any stack traces from the build tool
   - Include exit codes if available

#### C. Browser Console Logs (for runtime failures)
3. **All `[Deploy Diagnostics]` log entries** from browser console:
   - Startup configuration block (Base URL, Mode, Location, etc.)
   - Any `ResourceLoadError` entries with failing resource URLs
   - Any `JavaScriptError` entries with full stack traces
   - Any `UnhandledPromiseRejection` entries with serialized reasons
   - Performance metrics from the load event

#### D. Additional Context
4. Environment/build configuration
   - Node version, npm/pnpm version
   - Operating system
   - Deployment target (local dev, canister, CDN, etc.)
5. Network tab screenshot showing failed requests (if any)

### Example Diagnostic Report

