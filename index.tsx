import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// --- Types & Constants ---
type ThemeType = 'savanna' | 'jungle' | 'school' | 'celebration';

const THEMES: Record<ThemeType, {
  bg: string;
  accent: string;
  text: string;
  elements: string[];
  animation: 'fall' | 'slide' | 'pop' | 'flash';
}> = {
  savanna: {
    bg: 'linear-gradient(135deg, #f39c12 0%, #d35400 100%)', // Sunrise Savanna
    accent: '#FFD700', // Awana Yellow
    text: '#ffffff',
    elements: ['🐘', '🦒', '🌅', '☀️', '🦓'],
    animation: 'fall'
  },
  jungle: {
    bg: 'linear-gradient(135deg, #27ae60 0%, #145a32 100%)', // Green Jungle
    accent: '#a2d149',
    text: '#ffffff',
    elements: ['🌿', '🐒', '🦜', '🌴', '🐍'],
    animation: 'slide'
  },
  school: {
    bg: 'linear-gradient(135deg, #686158 0%, #2c3e50 100%)', // Flint Grey / Building
    accent: '#e67e22',
    text: '#ffffff',
    elements: ['🧱', '📐', '🏫', '🏗️', '📝'],
    animation: 'pop'
  },
  celebration: {
    bg: 'radial-gradient(circle at center, #FFD700 0%, #f1c40f 100%)', // High Energy
    accent: '#ffffff',
    text: '#2c3e50',
    elements: ['🎉', '✨', '🎈', '🎊', '🏆'],
    animation: 'flash'
  }
};

const getThemeForCount = (count: number): ThemeType => {
  if (count <= 100) return 'savanna';
  if (count <= 200) return 'jungle';
  if (count <= 500) return 'school';
  return 'celebration';
};

// --- Audio Engine ---
let audioCtx: AudioContext | null = null;

const playPop = () => {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
};

const playMilestone = () => {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const freqs = [261.63, 329.63, 392.00, 523.25]; // C Major
  freqs.forEach((f, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(f, now + (i * 0.05));
    gain.gain.setValueAtTime(0, now + (i * 0.05));
    gain.gain.linearRampToValueAtTime(0.1, now + (i * 0.05) + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.05) + 1.5);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now + (i * 0.05));
    osc.stop(now + (i * 0.05) + 1.5);
  });
};

// --- Main Component ---
const VerseTracker: React.FC = () => {
  const [count, setCount] = useState<number>(() => {
    const saved = localStorage.getItem('awana-verse-count');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isStarted, setIsStarted] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [buildInfoVisible, setBuildInfoVisible] = useState(true);
  
  const countRef = useRef<HTMLDivElement>(null);
  const theme = THEMES[getThemeForCount(count)];

  // Persistence
  useEffect(() => {
    localStorage.setItem('awana-verse-count', count.toString());
  }, [count]);

  // Build info cleanup
  useEffect(() => {
    const timer = setTimeout(() => setBuildInfoVisible(false), 8000);
    return () => clearTimeout(timer);
  }, [isStarted]);

  const triggerAnimation = useCallback((type: 'fall' | 'slide' | 'pop' | 'flash') => {
    if (!countRef.current) return;
    
    gsap.killTweensOf(countRef.current);
    
    switch (type) {
      case 'fall':
        gsap.fromTo(countRef.current, { y: -200, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "bounce.out" });
        break;
      case 'slide':
        gsap.fromTo(countRef.current, { x: 300, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "back.out(1.7)" });
        break;
      case 'pop':
        gsap.fromTo(countRef.current, { scale: 0, rotation: -15 }, { scale: 1, rotation: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
        break;
      case 'flash':
        gsap.fromTo(countRef.current, { filter: 'brightness(3)' }, { filter: 'brightness(1)', duration: 0.4 });
        gsap.fromTo(countRef.current, { scale: 1.2 }, { scale: 1, duration: 0.3 });
        break;
    }
  }, []);

  const increment = useCallback(() => {
    setCount(prev => {
      const next = prev + 1;
      if (next % 100 === 0 || next % 50 === 0) {
        playMilestone();
      } else {
        playPop();
      }
      return next;
    });

    triggerAnimation(theme.animation);

    // Particle Effect
    const emoji = theme.elements[Math.floor(Math.random() * theme.elements.length)];
    const p = document.createElement('div');
    p.innerText = emoji;
    p.style.position = 'fixed';
    p.style.left = '50%';
    p.style.top = '50%';
    p.style.fontSize = '3rem';
    p.style.pointerEvents = 'none';
    p.style.zIndex = '10';
    document.body.appendChild(p);

    gsap.fromTo(p, 
      { x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100, opacity: 1, scale: 0 },
      { 
        y: '-=500', 
        x: (Math.random() - 0.5) * 600,
        opacity: 0, 
        scale: 2.5, 
        rotation: Math.random() * 720,
        duration: 2.5, 
        ease: "power1.out",
        onComplete: () => p.remove() 
      }
    );
  }, [theme, triggerAnimation]);

  const handleReset = useCallback(() => {
    if (confirm('Are you sure you want to reset the count to 0? This cannot be undone.')) {
      setCount(0);
      playMilestone();
      triggerAnimation('pop');
    }
  }, [triggerAnimation]);

  const handleManualSet = useCallback(() => {
    const val = prompt('Set exact verse count:', count.toString());
    if (val !== null) {
      const n = parseInt(val, 10);
      if (!isNaN(n)) {
        setCount(n);
        triggerAnimation('pop');
      }
    }
  }, [count, triggerAnimation]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowRight', 'ArrowLeft', 'PageDown', 'PageUp'].includes(e.key)) {
        if (!isStarted) return;
        increment();
      } else if (e.key.toLowerCase() === 'r') {
        handleReset();
      } else if (e.key.toLowerCase() === 's') {
        handleManualSet();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [increment, handleReset, handleManualSet, isStarted]);

  const startBroadcast = () => {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    setIsStarted(true);
    setBuildInfoVisible(false);
    triggerAnimation(theme.animation);
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
        background: theme.bg,
        color: theme.text,
        transition: 'background 1.5s cubic-bezier(0.4, 0, 0.2, 1), color 1s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Broadcast CRT/Scanline Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))',
        backgroundSize: '100% 4px, 3px 100%',
        pointerEvents: 'none',
        zIndex: 100,
        opacity: 0.4
      }} />

      {/* Build Info Overlay */}
      {buildInfoVisible && (
        <div style={{
          position: 'absolute',
          top: 20,
          left: 20,
          fontSize: '12px',
          opacity: 0.6,
          zIndex: 150,
          pointerEvents: 'none',
          backgroundColor: 'rgba(0,0,0,0.2)',
          padding: '5px 10px',
          borderRadius: '4px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          LIVE FEED // BUILD 2.1.0 // {new Date().toLocaleTimeString()}
        </div>
      )}

      {/* Background Elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.2
      }}>
        {theme.elements.map((el, i) => (
          <div 
            key={`${getThemeForCount(count)}-${i}`}
            style={{
              position: 'absolute',
              fontSize: '6rem',
              left: `${(i * 25) % 100}%`,
              top: `${(i * 35) % 80 + 10}%`,
              animation: `float ${10 + i * 2}s infinite ease-in-out alternate`
            }}
          >
            {el}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, -30px) rotate(5deg); }
          100% { transform: translate(-20px, 20px) rotate(-5deg); }
        }
      `}</style>

      {/* Main Counter Display */}
      <div 
        ref={countRef}
        style={{
          fontSize: '45vw',
          fontWeight: 900,
          lineHeight: 0.8,
          textAlign: 'center',
          textShadow: '0 30px 60px rgba(0,0,0,0.4)',
          cursor: 'pointer',
          userSelect: 'none',
          zIndex: 50,
          fontVariantNumeric: 'tabular-nums'
        }}
        onClick={increment}
      >
        {count}
      </div>
      
      <div style={{ 
        fontSize: '3vw', 
        opacity: 0.9, 
        letterSpacing: '0.3em', 
        textTransform: 'uppercase', 
        fontWeight: 700,
        zIndex: 50,
        marginTop: '2rem',
        textShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}>
        Verses Recited
      </div>

      {/* Start Overlay */}
      {!isStarted && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(21, 21, 21, 0.95)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          backdropFilter: 'blur(10px)'
        }}>
          <h1 style={{ color: '#FFD700', fontSize: '4rem', marginBottom: '1rem', fontWeight: 900 }}>AWANA AFRICA</h1>
          <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '3rem', opacity: 0.8 }}>SCHOOLS VERSE TRACKER v2.1</h2>
          <button 
            onClick={startBroadcast}
            style={{
              padding: '25px 80px',
              fontSize: '2rem',
              backgroundColor: '#FFD700',
              color: '#000',
              border: 'none',
              borderRadius: '60px',
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: '0 15px 40px rgba(255, 215, 0, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            INITIALIZE BROADCAST
          </button>
        </div>
      )}

      {/* Admin Interface */}
      <div 
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          opacity: isAdminOpen ? 1 : 0.05,
          transition: 'opacity 0.4s',
          cursor: 'pointer',
          zIndex: 500,
          color: theme.text
        }}
        onMouseEnter={(e) => !isAdminOpen && (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => !isAdminOpen && (e.currentTarget.style.opacity = '0.05')}
        onClick={() => setIsAdminOpen(!isAdminOpen)}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.21.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
        </svg>
      </div>

      {isAdminOpen && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '30px',
          background: 'rgba(255,255,255,0.98)',
          padding: '25px',
          borderRadius: '20px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          color: '#222',
          zIndex: 500,
          minWidth: '240px',
          border: '1px solid rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#686158', fontWeight: 900 }}>ADMIN CONSOLE</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <button onClick={() => setCount(c => c + 1)} style={adminBtnStyle}>+1</button>
            <button onClick={() => setCount(c => c + 5)} style={adminBtnStyle}>+5</button>
            <button onClick={() => setCount(c => c + 10)} style={adminBtnStyle}>+10</button>
          </div>
          <button onClick={handleManualSet} style={{...adminBtnStyle, background: '#686158', color: 'white'}}>SET EXACT COUNT (S)</button>
          <button onClick={handleReset} style={{...adminBtnStyle, background: '#e74c3c', color: 'white'}}>RESET TO ZERO (R)</button>
          <div style={{ 
            fontSize: '0.75rem', 
            opacity: 0.6, 
            marginTop: '10px', 
            paddingTop: '10px', 
            borderTop: '1px solid #eee',
            lineHeight: 1.5
          }}>
            <strong>INPUT MAPPINGS:</strong><br/>
            Projector Remote: +1 Verse<br/>
            S Key: Manual Set<br/>
            R Key: Full Reset
          </div>
        </div>
      )}
    </div>
  );
};

const adminBtnStyle: React.CSSProperties = {
  padding: '12px',
  borderRadius: '10px',
  border: 'none',
  fontWeight: 'bold',
  cursor: 'pointer',
  background: '#FFD700',
  color: '#000',
  transition: 'all 0.2s',
  fontSize: '0.9rem'
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<VerseTracker />);