
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ref, onValue, set, off } from 'firebase/database';
import { db } from './firebase';
import { AppState } from './types';
import DisplayMode from './components/DisplayMode';
import AdminMode from './components/AdminMode';
import { initAudio } from './utils/audio';
import { BUILD_INFO } from './constants';

const App: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [audioStarted, setAudioStarted] = useState<boolean>(false);
  const [engaged, setEngaged] = useState<boolean>(false);
  const prevCountRef = useRef<number>(0);

  // Sync with Firebase
  useEffect(() => {
    if (!db) {
      setIsOffline(true);
      return;
    }

    const countRef = ref(db, 'verseCount/current');
    onValue(countRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setCount(Number(data));
      }
      setIsOffline(false);
    }, (error) => {
      console.error("Firebase error:", error);
      setIsOffline(true);
    });

    return () => off(countRef);
  }, []);

  const handleUpdateCount = useCallback((newCount: number) => {
    if (!db) return;
    set(ref(db, 'verseCount/current'), newCount);
  }, []);

  const startExperience = () => {
    initAudio();
    setAudioStarted(true);
    setEngaged(true);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden select-none bg-stone-900">
      {/* Build Info overlay (disappears on engagement) */}
      {!engaged && (
        <div className="fixed top-4 left-4 text-[10px] text-white/30 z-50 pointer-events-none uppercase tracking-widest font-mono">
          Build {BUILD_INFO.number} • {BUILD_INFO.timestamp}
        </div>
      )}

      {/* Main Display Layer */}
      <DisplayMode count={count} audioStarted={audioStarted} />

      {/* Admin Layer */}
      <AdminMode currentCount={count} onUpdateCount={handleUpdateCount} />

      {/* Start Overlay (Autoplay Policy) */}
      {!audioStarted && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-500">
          <div className="text-center p-8 bg-[#686158] rounded-3xl border-4 border-[#FBBF24] shadow-2xl max-w-sm">
            <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Awana Africa</h1>
            <p className="text-stone-200 mb-8 font-semibold">Verse Tracker Live Stream</p>
            <button
              onClick={startExperience}
              className="bg-[#FBBF24] hover:bg-yellow-500 text-stone-900 font-black py-4 px-10 rounded-full text-xl shadow-[0_8px_0_rgb(180,130,0)] hover:translate-y-1 hover:shadow-[0_4px_0_rgb(180,130,0)] transition-all active:scale-95"
            >
              ENABLE BROADCAST
            </button>
          </div>
        </div>
      )}

      {/* Offline Indicator */}
      {isOffline && (
        <div className="fixed bottom-4 left-4 flex items-center gap-2 bg-red-600/80 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse z-50">
          <div className="w-2 h-2 rounded-full bg-white"></div>
          OFFLINE
        </div>
      )}
    </div>
  );
};

export default App;
