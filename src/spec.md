# Specification

## Summary
**Goal:** Update Valentine page copy to say “I like you” and add a playful intro Valentine prompt with rose petals before the main wishing content.

**Planned changes:**
- Replace all user-facing occurrences of the exact phrase “I love you” with “I like you” (including hero text and rotating one-liners).
- Add an initial full-screen intro overlay with a rose-petal animation and the exact question text “Will you be my Valentine?” plus “Yes” and “No” buttons.
- Make the “Yes” button dismiss the intro and reveal the existing wishing page content.
- Make the “No” button evade clicks/taps by moving within the viewport, with reduced/disabled motion and animation when `prefers-reduced-motion: reduce` is enabled.

**User-visible outcome:** On page load, users see a rose-petal Valentine prompt with “Yes/No”; choosing “Yes” opens the existing wishing page, while “No” playfully dodges interaction.
