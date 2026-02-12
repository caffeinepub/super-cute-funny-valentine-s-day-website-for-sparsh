# Specification

## Summary
**Goal:** Improve the Valentine intro overlay experience by adding user-initiated romantic audio, updating the hero one-liner text, and making the intro overlay a clean full-screen view without background blur.

**Planned changes:**
- Add intro-overlay ambient romantic background audio that only starts after a user interaction, with audio defaulting to muted until interaction enables it.
- Add a visible mute/unmute control on the intro overlay that prevents any sounds from playing when muted.
- Play a short romantic confirmation sound exactly once when the user clicks “Yes! 💖”, then continue navigation to the main page as before.
- Replace the hero sub-line text with: “I like you more than Hange liked titans.” and ensure the old line is removed everywhere.
- Remove any backdrop blur behind the “Will you be my Valentine?” overlay and make it read as a solid/clean, full-screen overlay while keeping the rose petal animation and accessible dialog semantics.

**User-visible outcome:** The intro overlay appears as a clean full-screen Valentine prompt (no blurred background), offers mute/unmute controls, plays romantic audio only after the user interacts, and plays a one-time confirmation sound on “Yes! 💖”. The homepage hero sub-line displays the updated Hange text.
