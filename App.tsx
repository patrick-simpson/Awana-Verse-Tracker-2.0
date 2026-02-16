import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getTheme, BUILD_INFO } from './constants.tsx';
import { initAudio, playPop, playMilestone } from './utils/audio.ts';
import { AnimationType } from './types.ts';
import Peer from 'peerjs';

// --- P2P SYNC ENGINE (WebRTC) ---
// Syncs two computers (Controller & Display) via PeerJS public servers.
type Role = 'setup' | 'host' | 'client';
type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

const usePeerSync = () => {
  const [role, setRole] = useState<Role>('setup');
  const [roomCode, setRoomCode] = useState('AWANA');
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<any>(null);

  // HOST: Create the room
  const startHost = (code: string) => {
    setRoomCode(code);
    setRole('host');
    setStatus('connecting');

    // Create a predictable ID: awana-host-[CODE]
    // Clean code to be alphanumeric only
    const cleanCode = code.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const hostId = `awana-host-${cleanCode}`;
    
    const peer = new Peer(hostId);
    peerRef.current = peer;

    peer.on('open', (id) => {
      console.log('Host initialized:', id);
      setStatus('connected');
    });

    peer.on('connection', (conn) => {
      console.log('Client connected');
      connRef.current = conn;
      // Send current state immediately upon connection
      setTimeout(() => {
        conn.send({ type: 'SYNC', value: count });
      }, 500);
    });

    peer.on('error', (err) => {
      console.error('Peer error:', err);
      if (err.type === 'unavailable-id') {
         // If ID is taken, we might need to reconnect or just assume we are the owner
         setStatus('connected'); 
      } else {
         setStatus('error');
      }
    });
  };

  // CLIENT: Connect to the room
  const startClient = (code: string) => {
    setRoomCode(code);
    setRole('client');
    setStatus('connecting');

    const cleanCode = code.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const hostId = `awana-host-${cleanCode}`;
    
    // Random ID for client
    const peer = new Peer();
    peerRef.current = peer;

    peer.on('open', () => {
      connectToHost(peer, hostId);
    });

    peer.on('error', (err) => {
      console.error('Client Peer error:', err);
      setStatus('error');
    });
  };

  const connectToHost = (peer: Peer, hostId: string) => {
    console.log('Connecting to:', hostId);
    const conn = peer.connect(hostId, { reliable: true });
    connRef.current = conn;

    conn.on('open', () => {
      console.log('Connected to Host');
      setStatus('connected');
    });

    conn.on('data', (data: any) => {
      if (data && data.type === 'SYNC') {
        setCount(data.value);
      }
    });

    conn.on('close', () => {
      setStatus('disconnected');
      // Simple retry logic
      setTimeout(() => connectToHost(peer, hostId), 3000);
    });
  };

  // BROADCAST: Host sends updates
  const updateCount = (newVal: number) => {
    const val = Math.max(0, newVal);
    setCount(val);
    
    if (role === 'host' && connRef.current && connRef.current.open) {
      connRef.current.send({ type: 'SYNC', value: val });
    }
  };

  return { role, setRole, roomCode, setRoomCode, count, updateCount, status, startHost, startClient };
};

const AdminPanel: React.FC<{ current: number; onUpdate: (n: number) => void; onClose: () => void }> = ({ current, onUpdate, onClose }) => {
  const [val, setVal] = useState('');
  return (
    <div className="absolute bottom-20 right-0 w-80 glass-panel rounded-3xl p-6 text-white shadow-2xl z-[150] animate-[fadeIn_0.2s_ease-out]">
      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
        <h3 className="text-xl font-black uppercase tracking-widest text-yellow-400">Broadcast Desk</h3>
        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">✕</button>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button onClick={() => onUpdate(current + 1)} className="bg-white/10 hover:bg-white/20 py-4 rounded-2xl font-black text-lg transition-all active:scale-95">+1</button>
        <button onClick={() => onUpdate(current + 5)} className="bg-white/10 hover:bg-white/20 py-4 rounded-2xl font-black text-lg transition-all active:scale-95">+5</button>
      </div>
      <div className="space-y-4">
        <input 
          type="number" 
          value={val} 
          onChange={e => setVal(e.target.value)}
          placeholder="Set custom count..."
          className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 outline-none focus:border-yellow-400 text-white"
        />
        <button 
          onClick={() => { if(val) onUpdate(parseInt(val)); setVal(''); }}
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-stone-900 font-black py-3 rounded-xl uppercase tracking-widest transition-all active:scale-95"
        >
          Update Count
        </button>
      </div>
      <div className="mt-4 pt-4 border-t border-white/10">
        <button 
            onClick={() => { if(confirm("Reset everything?")) onUpdate(0); }}
            className="w-full text-red-400 hover:text-red-300 text-[10px] font-black uppercase tracking-widest"
        >
            Danger: Reset to Zero
        </button>
      </div>
    </div>
  );
};

const SetupScreen: React.FC<{ onHost: (code: string) => void; onClient: (code: string) => void }> = ({ onHost, onClient }) => {
  const [code, setCode] = useState('AWANA');
  
  return (
    <div className="fixed inset-0 bg-stone-900 flex flex-col items-center justify-center text-white z-[200]">
      <div className="max-w-md w-full p-8 glass-panel border border-white/10 rounded-3xl text-center">
        <h1 className="text-4xl font-black text-yellow-400 mb-2 uppercase italic tracking-tighter">Awana Sync</h1>
        <p className="text-stone-400 text-sm mb-8 tracking-widest uppercase">Multi-Computer Uplink</p>
        
        <div className="mb-8">
            <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-stone-500">Room Code</label>
            <input 
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                className="w-full bg-black/50 border-2 border-white/20 rounded-xl py-4 text-center text-2xl font-mono tracking-[0.5em] text-white focus:border-yellow-400 outline-none transition-colors"
            />
        </div>

        <div className="grid grid-cols-1 gap-4">
            <button onClick={() => onHost(code)} className="group bg-yellow-400 hover:bg-yellow-300 text-stone-900 py-4 rounded-xl font-black uppercase tracking-widest transition-all active:scale-95">
                <span className="block text-lg">Start Controller</span>
                <span className="text-[10px] opacity-60">For the Laptop (Admin)</span>
            </button>
            <button onClick={() => onClient(code)} className="group bg-stone-800 hover:bg-stone-700 text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all active:scale-95">
                <span className="block text-lg">Start Display</span>
                <span className="text-[10px] opacity-60">For the Projector</span>
            </button>
        </div>
        
        <div className="mt-8 text-[10px] text-stone-600 font-mono">
            SECURE P2P CONNECTION // NO SERVER REQUIRED
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const { role, roomCode, count, updateCount, status, startHost, startClient } = usePeerSync();
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  const numberRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<(HTMLDivElement | null)[]>([]);
  const prevCount = useRef<number>(count);
  const theme = useMemo(() => getTheme(count), [count]);

  // Audio Auto-Start logic
  useEffect(() => {
    // If we are Display and connected, we want audio
    if (role === 'client' && status === 'connected' && !audioEnabled) {
        // We can't auto-play audio without interaction usually, 
        // but let's try or show a "Click to Enable Audio" button
    }
  }, [role, status, audioEnabled]);

  // Background GSAP Animations
  useEffect(() => {
    const gsap = (window as any).gsap;
    if (!gsap) return;

    particlesRef.current.forEach(el => {
       if(el) gsap.killTweensOf(el);
    });

    if (particlesRef.current.length > 0) {
        particlesRef.current.forEach((el, i) => {
          if (!el) return;
          const type = i % 3;
          if (type === 0) {
            gsap.to(el, { x: "random(-60, 60)", y: "random(-60, 60)", duration: "random(10, 20)", repeat: -1, yoyo: true, ease: "sine.inOut" });
          } else if (type === 1) {
            gsap.to(el, { scale: 1.3, rotation: "random(-90, 90)", duration: "random(5, 10)", repeat: -1, yoyo: true, ease: "power1.inOut" });
          } else {
            gsap.to(el, { rotation: 360, duration: "random(30, 60)", repeat: -1, ease: "none" });
          }
        });
    }
  }, [theme]);

  // Count Change Effects
  useEffect(() => {
    if (count !== prevCount.current) {
      if (audioEnabled) {
        if (count > prevCount.current) {
            if (count > 0 && count % 50 === 0) playMilestone();
            else playPop();
        }
      }

      const gsap = (window as any).gsap;
      if (gsap && containerRef.current && numberRef.current) {
        // Ripple FX
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        ripple.style.width = ripple.style.height = `150px`;
        ripple.style.left = `50%`;
        ripple.style.top = `50%`;
        ripple.style.transform = `translate(-50%, -50%)`;
        containerRef.current.appendChild(ripple);

        gsap.to(ripple, {
          scale: 20, opacity: 0, borderWidth: 0, duration: 1.2,
          ease: "power2.out", onComplete: () => ripple.remove()
        });

        // Number Anim
        const tl = gsap.timeline();
        gsap.set(numberRef.current, { clearProps: "all" });
        
        switch (theme.animationType) {
          case AnimationType.FALL:
            tl.fromTo(numberRef.current, { y: -300, opacity: 0, scale: 0.5 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "bounce.out" });
            break;
          case AnimationType.POP:
            tl.fromTo(numberRef.current, { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2)" });
            break;
          case AnimationType.SLIDE:
            tl.fromTo(numberRef.current, { x: 500, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power4.out" });
            break;
          case AnimationType.CELEBRATE:
            tl.fromTo(numberRef.current, { scale: 1.5, filter: "brightness(3)" }, { scale: 1, filter: "brightness(1)", duration: 1, ease: "elastic.out(1, 0.3)" });
            gsap.to(containerRef.current, { backgroundColor: "#fff", duration: 0.1, repeat: 3, yoyo: true });
            break;
          default:
            tl.fromTo(numberRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4 });
        }
      }
      prevCount.current = count;
    }
  }, [count, theme.animationType, audioEnabled]);

  if (role === 'setup') {
    return <SetupScreen onHost={startHost} onClient={startClient} />;
  }

  return (
    <div ref={containerRef} className={`relative w-full h-screen transition-all duration-1000 bg-gradient-to-br ${theme.gradient} flex items-center justify-center overflow-hidden`}>
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {Array.from({length: 15}).map((_, i) => (
          <div 
            key={i} 
            ref={el => { particlesRef.current[i] = el; }}
            className="absolute"
            style={{ 
              left: `${(i * 13) % 100}%`, top: `${(i * 21) % 100}%`,
              fontSize: `${40 + (i % 5) * 20}px`, willChange: "transform"
            }}
          >
            {theme.elements[i % theme.elements.length]}
          </div>
        ))}
      </div>

      {/* Main Display */}
      <div className="z-10 text-center relative">
        <div className="relative inline-block">
            {/* Status Indicator for Admin */}
            {role === 'host' && (
                <div className={`absolute -top-12 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-widest ${status === 'connected' ? 'text-green-400' : 'text-red-400'} animate-pulse`}>
                    CONTROLLER: {status} [{roomCode}]
                </div>
            )}
             {/* Status Indicator for Display */}
             {role === 'client' && (
                <div className={`absolute -top-12 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-widest ${status === 'connected' ? 'text-green-400' : 'text-red-400'}`}>
                    DISPLAY: {status}
                </div>
            )}

          <div className="relative px-12 md:px-20 py-10 rounded-[5rem] glass-panel border-4 border-white/20 shadow-2xl overflow-hidden min-w-[300px]">
            <div 
              ref={numberRef}
              className={`text-[35vw] md:text-[25vw] leading-none font-[900] text-outline ${theme.text} select-none drop-shadow-2xl`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {count}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
            <div className={`h-1.5 w-48 bg-white/10 rounded-full mx-auto overflow-hidden`}>
                <div className="h-full bg-yellow-400 transition-all duration-700" style={{ width: `${(count % 50) / 50 * 100}%` }}></div>
            </div>
        </div>
      </div>

      {/* Audio Init for Display */}
      {role === 'client' && !audioEnabled && (
        <button 
            onClick={() => { initAudio(); setAudioEnabled(true); }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[300] bg-yellow-400 text-black px-8 py-4 rounded-full font-black uppercase tracking-widest shadow-2xl animate-bounce"
        >
            Click to Enable Sound
        </button>
      )}

      {/* Admin Controls (Only for Host) */}
      {role === 'host' && (
        <div className="fixed bottom-6 right-6 z-[120]">
            <button 
            onClick={() => setIsAdminOpen(!isAdminOpen)}
            className="p-3 text-white opacity-20 hover:opacity-100 transition-all duration-500 bg-black/20 hover:bg-black/60 rounded-full"
            >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            </button>
            {isAdminOpen && <AdminPanel current={count} onUpdate={updateCount} onClose={() => setIsAdminOpen(false)} />}
        </div>
      )}
    </div>
  );
};

export default App;