# Version 3.5.2 - "Stability Recovery"

- **FIXED**: Minified React Error #31. This was caused by the `importmap` containing overlapping mappings for React 18 and React 19. All mappings for React 19 have been removed to ensure version consistency.
- **FIXED**: Firebase "Service database is not available" error. This was resolved by cleaning the `importmap` and ensuring the Modular Firebase SDK (v10.13.0) is initialized with proper dependency resolution.
- **STABILITY**: Added defensive checks in `firebase.ts` to ensure the app doesn't attempt to re-initialize if an instance already exists.
- **ERROR HANDLING**: Updated `App.tsx` with a robust error boundary UI to report connection or initialization failures directly on the screen for the broadcast team.