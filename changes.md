
# Version 2.4.0 - Critical Stability Fix

- **Unified Dependencies**: Removed semantic versioning from `importmap` to prevent multiple React instances from loading (Fixes Error #31 and Dispatcher issues).
- **Firebase Initialization**: Corrected `getDatabase()` initialization to explicitly pass the `app` instance.
- **Single-Source Architecture**: Consolidated all logic into `index.html` to eliminate MIME-type blocking on GitHub Pages.
