# Version 3.0.1 - HOTFIX

- **CRITICAL FIX**: Resolved "Minified React error #31" by removing duplicate React 19 entries from the import map. The app now strictly enforces React 18.3.1 to ensure the P2P engine and UI components share the same runtime instance.

# Version 3.0.0 - "Global Link"

- **ARCHITECTURE OVERHAUL**: Implemented `PeerJS` (WebRTC) for serverless multi-computer syncing.
- **Laptop/Projector Mode**: Distinct startup modes for "Controller" and "Display".
- **Room Codes**: Users can set a custom "Room Code" to pair devices securely over the web.
- **UI Update**: Added a sleek "Connection Setup" screen.
- **Audio Logic**: Added a specific "Enable Sound" overlay for the Display machine to comply with browser policies.