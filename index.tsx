import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// --- Theme Definitions ---
interface Theme {
  id: string;
  name: string;
  bg: string;
  accent: string;
  text: string;
  elements: string[];
  animation: 'fall' | 'slide' | 'pop' | 'float' | 'spin' | 'zoom';
}

const THEMES: Theme[] = [
  {
    id: 'savanna',
    name: 'Sunrise Savanna',
    bg: 'linear-gradient(135deg, #FF9800 0%, #E65100 100%)',
    accent: '#FFEB3B',
    text: '#FFFFFF',
    elements: ['🐘', '🦒', '☀️', '🦓', '🌳'],
    animation: 'fall'
  },
  {
    id: 'village',
    name: 'Village Map',
    bg: 'linear-gradient(135deg, #8D6E63 0%, #4E342E 100%)',
    accent: '#FFD54F',
    text: '#FFFFFF',
    elements: ['🛖', '🥣', '🧺', '🐾', '🏜️'],
    animation: 'slide'
  },
  {
    id: 'school',
    name: 'Building a School',
    bg: 'linear-gradient(135deg, #686158 0%, #263238 100%)',
    accent: '#FFC107',
    text: '#FFFFFF',
    elements: ['🧱', '🏗️', '📐', '🏫', '📝'],
    animation: 'pop'
  },
  {
    id: 'jungle',
    name: 'The Great Jungle',
    bg: 'linear-gradient(135deg, #43A047 0%, #1B5E20 100%)',
    accent: '#C0CA33',
    text: '#FFFFFF',
    elements: ['🌴', '🐒', '🦜', '🐆', '🐍'],
    animation: 'float'
  },
  {
    id: 'water',
    name: 'Life Giving Water',
    bg: 'linear-gradient(135deg, #0288D1 0%, #01579B 100%)',
    accent: '#81D4FA',
    text: '#FFFFFF',
    elements: ['💧', '🛶', '🐟', '🌊', '🐳'],
    animation: 'zoom'
  },
  {
    id: 'harvest',
    name: 'Abundant Harvest',
    bg: 'linear-gradient(135deg, #FBC02D 0%, #F57F17 100%)',
    accent: '#FFFFFF',
    text: '#3E2723',
    elements: ['🌾', '🌽', '🍎', '🧺', '🚜'],
    animation: 'spin'
  },
  {
    id: 'mountain',
    name: 'Mountain Peak',
    bg: 'linear-gradient(135deg, #7E57C2 0%, #311B92 100%)',
    accent: '#B39DDB',
    text: '#FFFFFF',
    elements: ['⛰️', '🦅', '❄️', '🧗', '💨'],
    animation: 'fall'
  },
  {
    id: 'city',
    name: 'Future City',
    bg: 'linear-gradient(135deg, #212121 0%, #000000 100%)',
    accent: '#FF4081',
    text: '#FFFFFF',
    elements: ['🏙️', '✨', '⚡', '🚀', '🚁'],
    animation: 'slide'
  },
  {
    id: 'sky',
    name: 'Infinite Sky',
    bg: 'linear-gradient(135deg, #4FC3F7 0%, #0288D1 100%)',
    accent: '#FFFFFF',
    text: '#FFFFFF',
    elements: ['☁️', '🕊️', '✈️', '🌈', '🎈'],
    animation: 'pop'
  },
  {
    id: 'celebration',
    name: 'Grand Celebration',
    bg: 'radial-gradient(circle at center, #FFD700 0%, #FBC02D 100%)',
    accent: '#FFFFFF',
    text: '#1B5E20',
    elements: ['🎉', '🏆', '🎈', '🎊', '🥇'],
    animation: 'zoom'
  }
];

const getThemeForCount = (count: number): Theme => {
  const index = Math.min(Math.floor(count / 100), THEMES.length - 1);
  return THEMES[index];
};

// --- Audio System ---
let audioCtx: AudioContext | null = null;

const playPop = () => {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
};

const playMilestone = () => {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + (i * 0.1));
    gain.gain.setValueAtTime(0, now + (i * 0.1));
    gain.gain.linearRampToValueAtTime(0.1, now + (i * 0.1) + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.1) + 0.8);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now + (i * 0.1));
    osc.stop(now + (i * 0.1) + 0.8);
  });
};

// --- App Component ---
const VerseTracker: React.FC = () => {
  const [count, setCount] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [buildInfoVisible, setBuildInfoVisible] = useState(true);
  
  const countRef = useRef<HTMLDivElement>(null);
  const dbRef = useRef<any>(null);
  const currentTheme = getThemeForCount(count);

  // Initialize Firebase (Assuming standard compat mode via window object)
  useEffect(() => {
    const firebaseConfig = {
      databaseURL: "https://asp-verse-tracker-default-rtdb.firebaseio.com"
    };
    
    try {
      const fb = (window as any).firebase;
      if (fb && !fb.apps.length) {
        fb.initializeApp(firebaseConfig);
      }
      if (fb) {
        dbRef.current = fb.database().ref('verses');
        
        // Real-time listener
        dbRef.current.on('value', (snapshot: any) => {
          const val = snapshot.val();
          if (val !== null && val !== undefined) {
            setCount(val);
          }
        });
      }
    } catch (e) {
      console.warn("Firebase Init Failed - Tracking via local state only.");
    }

    return () => {
      if (dbRef.current) dbRef.current.off();
    };
  }, []);

  // GSAP Animations
  const animateNumber = useCallback((theme: Theme) => {
    const gsap = (window as any).gsap;
    if (!countRef.current || !gsap) return;
    
    gsap.killTweensOf(countRef.current);
    
    switch (theme.animation) {
      case 'fall':
        gsap.fromTo(countRef.current, { y: -300, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "bounce.out" });
        break;
      case 'slide':
        gsap.fromTo(countRef.current, { x: 500, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "back.out(1.5)" });
        break;
      case 'pop':
        gsap.fromTo(countRef.current, { scale: 0, rotation: -45 }, { scale: 1, rotation: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
        break;
      case 'float':
        gsap.fromTo(countRef.current, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" });
        break;
      case 'zoom':
        gsap.fromTo(countRef.current, { scale: 3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "power2.inOut" });
        break;
      case 'spin':
        gsap.fromTo(countRef.current, { rotation: 360, scale: 0 }, { rotation: 0, scale: 1, duration: 0.8, ease: "power2.out" });
        break;
    }
  }, []);

  // Particles
  const spawnParticle = useCallback((theme: Theme) => {
    const gsap = (window as any).gsap;
    if (!gsap) return;

    const emoji = theme.elements[Math.floor(Math.random() * theme.elements.length)];
    const p = document.createElement('div');
    p.innerText = emoji;
    p.style.position = 'fixed';
    p.style.left = '50%';
    p.style.top = '50%';
    p.style.fontSize = '4rem';
    p.style.pointerEvents = 'none';
    p.style.zIndex = '100';
    document.body.appendChild(p);

    gsap.fromTo(p, 
      { x: (Math.random() - 0.5) * 50, y: (Math.random() - 0.5) * 50, scale: 0, opacity: 1 },
      { 
        x: (Math.random() - 0.5) * 1000, 
        y: -window.innerHeight - 200, 
        scale: 2 + Math.random() * 2, 
        opacity: 0, 
        rotation: Math.random() * 1080,
        duration: 2.5 + Math.random() * 1,
        ease: "power2.out",
        onComplete: () => p.remove()
      }
    );
  }, []);

  // Update Logic
  const updateCount = (newCount: number) => {
    const val = Math.max(0, newCount);
    if (dbRef.current) {
      dbRef.current.set(val);
    } else {
      setCount(val);
    }
    
    if (val % 50 === 0 && val !== 0) {
      playMilestone();
    } else {
      playPop();
    }
    
    animateNumber(getThemeForCount(val));
    spawnParticle(getThemeForCount(val));
  };

  const increment = () => updateCount(count + 1);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isStarted) return;
      if (['ArrowRight', 'ArrowUp', 'PageUp', 'Enter'].includes(e.key)) increment();
      if (['ArrowLeft', 'ArrowDown', 'PageDown'].includes(e.key)) updateCount(count - 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [count, isStarted]);

  const startApp = () => {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    setIsStarted(true);
    setTimeout(() => setBuildInfoVisible(false), 5000);
    animateNumber(currentTheme);
  };

  return (
    <div 
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: currentTheme.bg,
        color: currentTheme.text,
        transition: 'background 1.5s ease-in-out',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.05) 50%), linear-gradient(90deg, rgba(255,0,0,0.01), rgba(0,255,0,0.01), rgba(0,0,255,0.01))',
        backgroundSize: '100% 4px, 3px 100%',
        pointerEvents: 'none',
        zIndex: 100
      }} />

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.15 }}>
        {currentTheme.elements.map((el, i) => (
          <div 
            key={`${currentTheme.id}-${i}`}
            style={{
              position: 'absolute',
              fontSize: '8rem',
              left: `${(i * 30) % 90 + 5}%`,
              top: `${(i * 25) % 70 + 15}%`,
              filter: 'blur(2px)',
              animation: `float-bg ${15 + i * 5}s infinite ease-in-out alternate`
            }}
          >
            {el}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes float-bg {
          from { transform: translate(0, 0) rotate(0deg); }
          to { transform: translate(50px, -50px) rotate(20deg); }
        }
      `}</style>

      <div 
        ref={countRef}
        onClick={increment}
        style={{
          fontSize: '48vw',
          fontWeight: 900,
          fontFamily: "'Poppins', sans-serif",
          lineHeight: 0.85,
          textAlign: 'center',
          userSelect: 'none',
          cursor: 'pointer',
          zIndex: 50,
          textShadow: '0 40px 80px rgba(0,0,0,0.3)',
          fontVariantNumeric: 'tabular-nums'
        }}
      >
        {count}
      </div>

      <div style={{
        fontSize: '2.5vw',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.5em',
        opacity: 0.8,
        marginTop: '2rem',
        zIndex: 50
      }}>
        Verses Shared
      </div>

      {buildInfoVisible && (
        <div style={{
          position: 'absolute',
          top: 30,
          left: 30,
          fontSize: '12px',
          opacity: 0.6,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          zIndex: 200,
          background: 'rgba(0,0,0,0.4)',
          padding: '5px 15px',
          borderRadius: '20px'
        }}>
          AFRICA SCHOOLS PROJECT // BROADCAST FEED // LIVE SYNC ACTIVE // v2.5.1
        </div>
      )}

      {!isStarted && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.95)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000,
          backdropFilter: 'blur(15px)'
        }}>
          <h1 style={{ fontSize: '4rem', fontWeight: 900, color: '#FFC107', margin: '0 0 1rem 0', textAlign: 'center' }}>AFRICA SCHOOLS PROJECT</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.7, marginBottom: '3rem' }}>VERSE TRACKER BROADCAST SYSTEM</p>
          <button 
            onClick={startApp}
            style={{
              padding: '25px 80px',
              fontSize: '1.8rem',
              fontWeight: 900,
              borderRadius: '50px',
              border: 'none',
              backgroundColor: '#FFC107',
              color: 'black',
              cursor: 'pointer',
              boxShadow: '0 10px 40px rgba(255,193,7,0.4)',
              transition: 'transform 0.2s'
            }}
          >
            INITIALIZE BROADCAST
          </button>
        </div>
      )}

      <div 
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          opacity: 0.1,
          cursor: 'pointer',
          zIndex: 1000,
          transition: 'opacity 0.3s'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.1')}
        onClick={() => setIsAdminOpen(!isAdminOpen)}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.21.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
        </svg>
      </div>

      {isAdminOpen && (
        <div style={{
          position: 'absolute',
          bottom: 70,
          right: 20,
          background: 'rgba(255,255,255,0.95)',
          padding: '20px',
          borderRadius: '15px',
          color: 'black',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          zIndex: 1000,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          minWidth: '220px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', fontWeight: 900 }}>ADMIN CONTROL</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button style={adminBtnStyle} onClick={() => updateCount(count + 1)}>+1</button>
            <button style={adminBtnStyle} onClick={() => updateCount(count + 5)}>+5</button>
            <button style={adminBtnStyle} onClick={() => updateCount(count + 10)}>+10</button>
            <button style={adminBtnStyle} onClick={() => updateCount(count + 50)}>+50</button>
          </div>
          <button style={{ ...adminBtnStyle, width: '100%', background: '#686158', color: 'white' }} 
            onClick={() => {
              const val = prompt("Set exact count:", count.toString());
              if (val) updateCount(parseInt(val, 10));
            }}
          >SET CUSTOM</button>
          <button style={{ ...adminBtnStyle, width: '100%', background: '#f44336', color: 'white' }} 
            onClick={() => {
              if (confirm("Reset everything to zero?")) updateCount(0);
            }}
          >RESET ALL</button>
        </div>
      )}
    </div>
  );
};

const adminBtnStyle: React.CSSProperties = {
  padding: '10px',
  borderRadius: '8px',
  border: 'none',
  fontWeight: 700,
  backgroundColor: '#FFEB3B',
  cursor: 'pointer',
};

const root = createRoot(document.getElementById('root')!);
root.render(<VerseTracker />);