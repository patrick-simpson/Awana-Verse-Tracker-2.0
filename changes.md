
# Version 2.2.0 - Broadcast Resilience Update

## Fixes
- **Bypassed GitHub Pages MIME restriction**: Consolidated logic into `index.html` as the browser blocks separate `.tsx` files when served as `text/plain`.
- **Firebase Initialization**: Simplified service registration to ensure version parity across `app` and `database` modules.
- **Boot Performance**: Removed multiple external network requests for sub-modules, opting for a single transpilation pass via Babel Standalone.

## UI/UX
- Added a high-visibility loading state.
- Enhanced theme switching logic for smoother transitions during live events.
