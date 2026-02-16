# Version 4.0.0 - "The Remote Controller"

- **REMOVED**: Firebase Realtime Database. The app is now fully local and offline-ready for broadcast.
- **ADDED**: Projector Remote Support. Key listeners for PageUp, PageDown, Arrows, Space, and Enter.
- **LOGIC**: As requested, both "Next" and "Back" remote buttons increment the verse count to prevent broadcast mistakes.
- **UNDO**: Added `Shift + Backspace` as a secret emergency undo key for the operator.
- **PERSISTENCE**: Using `localStorage` to save count across browser refreshes.
- **THEMING**: Themes now advance every 100 verses to match the projector-slide rhythm.
- **STABILITY**: Minimized dependencies to zero external services.