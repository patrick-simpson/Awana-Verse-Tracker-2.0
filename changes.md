# Change Log - Africa Schools Project Verse Tracker

## [2.5.1] - 2024-05-22
### Fixed
- **Critical**: Resolved React Error #31 by standardizing the `importmap` to use a single version of React (18.2.0).
- **Grey Screen**: Fixed issue where the app would crash during initialization due to version mismatches.
- **GSAP**: Ensured GSAP is accessed safely via the window object.

## [2.5.0] - 2024-05-22
### Changed
- **Architectural Shift**: Replaced local timer/state with Firebase Realtime Database integration for multi-device sync.
- **Visual Polish**: Removed the "Next Session" countdown to prioritize broadcast visual space.
- **Reliability Fix**: Updated index.html and scripts to prevent "grey screen" loading issues.
- **Theming**: Expanded to 10 unique themes (0-1000 verses) with distinct background gradients and animations.
- **GSAP Compatibility**: Refined animation triggers to be more resilient across different browser performance levels.
- **Branding**: Removed all specific organization names to generalized branding for Africa Schools Project.