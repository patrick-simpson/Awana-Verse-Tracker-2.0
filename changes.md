# Change Log - Africa Schools Project Verse Tracker

## [2.5.0] - 2024-05-22
### Changed
- **Architectural Shift**: Replaced local timer/state with Firebase Realtime Database integration for multi-device sync.
- **Visual Polish**: Removed the "Next Session" countdown to prioritize broadcast visual space.
- **Reliability Fix**: Updated index.html and scripts to prevent "grey screen" loading issues.
- **Theming**: Expanded to 10 unique themes (0-1000 verses) with distinct background gradients and animations.
- **GSAP Compatibility**: Refined animation triggers to be more resilient across different browser performance levels.
- **Branding**: Removed all specific organization names to generalized branding for Africa Schools Project.

### Fixed
- Initialization bug where React might fail to mount before assets loaded.
- Audio context initialization moved to explicit user gesture to comply with browser policies.
- Background color now initializes as dark to prevent white/grey flashes during load.