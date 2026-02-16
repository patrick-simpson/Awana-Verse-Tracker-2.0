import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getTheme, BUILD_INFO } from './constants.tsx';
import { initAudio, playPop, playMilestone } from './utils/audio.ts';
import { AnimationType } from './types.ts';
import Peer from 'peerjs';

/**
 * P2P SYNC ENGINE
 * Connects the Laptop (Host) to the Projector (Client)
 */
const usePeerSync = () => {
  const [role, setRole] = useState<'setup' | 'host' | 'client'>('setup');
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [count, setCount] = useState(0);
  const [roomCode, setRoomCode] = useState('AWANA');
  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<any>(null);

  const startHost = (code: string) => {
    setRole('host');
    setStatus('connecting');
    const id = `awana-v1-${code.toUpperCase()}`;
    const peer = new Peer(id);
    peerRef.current = peer;

    peer.on('open', () => setStatus('connected'));
    peer.on('connection', (conn) => {
      connRef.current = conn;
      conn.send({ type: 'SYNC', value: count });
    });
    peer.on('error', () => setStatus('error'));
  };

  const startClient = (code: string) => {
    setRole('client');
    setStatus('connecting');
    const peer = new Peer();
    peerRef.current = peer;

    peer.on('open', () => {
      const conn = peer.connect(`awana-v1-${code.toUpperCase()}`, { reliable: true });
      connRef.current = conn;
      conn.on('open', () => setStatus('connected'));
      conn.on('data', (data: any) => {
        if (data.type === 'SYNC') setCount(data.value);
      });
      conn.on('close', () => setStatus('connecting'));
    });
    peer.on('error', () => setStatus('error'));
  };

  const updateCount = (newVal: number) => {
    const val = Math.max(0, newVal);
    setCount(val);
    if (role === 'host' && connRef.current?.open) {
      connRef.current.send({ type: 'SYNC', value: val });
    }
  };

  return { role, status, count, updateCount, startHost, startClient, roomCode, setRoomCode };
};

// --- SUB-COMPONENTS ---

const DisplayUI: React.FC<{ count: number; theme: any }> = ({ count, theme }) => {
  const numberRef = useRef<HTMLDivElement>(null);
  const prevCount = useRef(count);

  useEffect(() => {
    if (count !== prevCount.current) {
      const gsap = (window as any).gsap;
      if (gsap && numberRef.current) {
        gsap.fromTo(numberRef.current, 
          { scale: 0.5, opacity: 0, y: 100 }, 
          { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "back.out(2)" }
        );
      }
      prevCount.current = count;
    }
  }, [count]);

  return (
    <div className="text-center z-10 px-6">
      <h2 className={`uppercase font-black text-xl mb-2 tracking-[0.3em] opacity-60 ${theme.secondaryText}`}>Verses Recited</h2>
      <div className="relative inline-block">
        <div ref={numberRef} className={`text-[35vw] md:text-[25vw] leading-none font-black text-outline ${theme.text} drop-shadow-2xl`}>
          {count}
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[30vh] bg-white opacity-10 blur-[100px] rounded-full -z-10"></div>
      </div>
      <div className={`mt-12 px-10 py-3 rounded-full border-2 border-current font-bold tracking-widest text-sm inline-block ${theme.secondaryText} glass-panel uppercase`}>
        {theme.name}
      </div>
    </div>
  );
};

const AdminControls: React.FC<{ count: number; onUpdate: (n: number) => void }> = ({ count, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <button onClick={() => setIsOpen(!isOpen)} className="p-3 text-white opacity-20 hover:opacity-100 bg-black/20 rounded-full transition-all">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
      </button>
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-72 glass-panel rounded-3xl p-6 text-white shadow-2xl border-2 border-yellow-400">
          <h3 className="text-xl font-black uppercase mb-6 text-yellow-400 italic">Broadcast Controller</h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button onClick={() => onUpdate(count + 1)} className="bg-white/10 hover:bg-white/20 py-4 rounded-xl font-black text-xl">+1</button>
            <button onClick={() => onUpdate(count + 5)} className="bg-white/10 hover:bg-white/20 py-4 rounded-xl font-black text-xl">+5</button>
          </div>
          <button onClick={() => onUpdate(0)} className="w-full text-red-400 text-[10px] font-bold uppercase tracking-widest mt-4">Reset to Zero</button>
        </div>
      )}
    </div>
  );
};

// --- MAIN APP ---

const App: React.FC = () => {
  const { role, status, count, updateCount, startHost, startClient, roomCode, setRoomCode } = usePeerSync();
  const theme = useMemo(() => getTheme(count), [count]);
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Sound triggers
  useEffect(() => {
    if (audioEnabled && count > 0) {
      if (count % 50 === 0) playMilestone();
      else playPop();
    }
  }, [count, audioEnabled]);

  if (role === 'setup') {
    return (
      <div className="fixed inset-0 bg-stone-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full glass-panel border border-white/10 p-10 rounded-[3rem] text-center shadow-2xl">
          <h1 className="text-4xl font-black text-yellow-400 uppercase italic tracking-tighter mb-2">Awana Sync</h1>
          <p className="text-stone-500 text-xs uppercase tracking-[0.3em] mb-10">Broadcast Uplink System</p>
          <input 
            value={roomCode} onChange={e => setRoomCode(e.target.value.toUpperCase())}
            className="w-full bg-black/50 border-2 border-white/10 rounded-2xl py-4 text-center text-2xl font-mono mb-8 focus:border-yellow-400 outline-none"
            placeholder="ROOM CODE"
          />
          <div className="grid grid-cols-1 gap-4">
            <button onClick={() => { initAudio(); startHost(roomCode); }} className="bg-yellow-400 text-stone-900 font-black py-4 rounded-2xl uppercase tracking-widest hover:scale-105 transition-transform">Start Controller</button>
            <button onClick={() => startClient(roomCode)} className="bg-white/5 text-white font-black py-4 rounded-2xl uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all">Start Display</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-screen transition-all duration-1000 bg-gradient-to-br ${theme.gradient} flex items-center justify-center overflow-hidden`}>
      <DisplayUI count={count} theme={theme} />
      {role === 'host' && <AdminControls count={count} onUpdate={updateCount} />}
      
      {/* Visual background elements */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="absolute text-6xl" style={{ left: `${i * 15}%`, top: `${(i * 27) % 100}%` }}>
            {theme.elements[i % theme.elements.length]}
          </div>
        ))}
      </div>

      {/* Connection Status */}
      <div className="fixed top-6 left-6 flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${status === 'connected' ? 'bg-green-500 shadow-[0_0_10px_green]' : 'bg-red-500 animate-pulse'}`} />
        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
          {role} : {status} [{roomCode}]
        </span>
      </div>

      {/* Audio Bypass */}
      {role === 'client' && !audioEnabled && (
        <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center">
          <button onClick={() => { initAudio(); setAudioEnabled(true); }} className="bg-yellow-400 text-black font-black px-12 py-6 rounded-full text-2xl uppercase animate-bounce shadow-2xl">
            Enable Sound
          </button>
        </div>
      )}
    </div>
  );
};

export default App;