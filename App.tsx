import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getTheme, BUILD_INFO } from './constants.tsx';
import { initAudio, playPop, playMilestone } from './utils/audio.ts';
import { verseRef, onValue, set } from './firebase.ts';
import { AnimationType } from './types.ts';

// --- SUB-COMPONENTS ---

const DisplayMode: React.FC<{ count: number; theme: any; audioStarted: boolean }> = ({ count, theme, audioStarted }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const prevCount = useRef<number>(count);
  
  // Floating elements state for whimsy
  const [elements] = useState(() => Array.from({ length: 10 }).map(() => ({
    id: Math.random(),
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 20 + Math.random() * 50,
    idx: Math.floor(Math.random() * 4)
  })));

  useEffect(() => {
    if (count !== prevCount.current) {
      if (audioStarted && count > prevCount.current) {
        if (count > 0 && count % 50 === 0) playMilestone();
        else playPop();
      }

      const gsap = (window as any).gsap;
      if (numberRef.current && gsap) {
        const tl = gsap.timeline();
        
        switch (theme.animationType) {
          case AnimationType.FALL:
            tl.fromTo(numberRef.current, { y: -300, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "bounce.out" });
            break;
          case AnimationType.POP:
            tl.fromTo(numberRef.current, { scale: 0 }, { scale: 1, duration: 0.7, ease: "back.out(1.7)" });
            break;
          case AnimationType.SLIDE:
            tl.fromTo(numberRef.current, { x: 500, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" });
            break;
          default:
            tl.fromTo(numberRef.current, { scale: 0.4, opacity: 0, y: 150 }, { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" });
        }
      }
      prevCount.current = count;
    }
  }, [count, theme, audioStarted]);

  return (
    <div className={`relative w-full h-screen transition-all duration-1000 bg-gradient-to-br ${theme.gradient} flex items-center justify-center overflow-hidden`}>
      {/* Whimsical Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        {elements.map((el) => (
          <div key={el.id} className="absolute text-7xl select-none transition-all duration-1000" style={{ left: `${el.x}%`, top: `${el.y}%` }}>
            {theme.elements[el.idx % theme.elements.length]}
          </div>
        ))}
      </div>

      <div className="text-center z-10 select-none">
        <h2 className={`uppercase font-black text-xl md:text-2xl mb-4 tracking-[0.4em] opacity-70 ${theme.secondaryText}`}>
          Verses Recited
        </h2>
        <div className="relative">
          <div ref={numberRef} className={`text-[40vw] md:text-[25vw] leading-none font-black text-outline ${theme.text} drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]`}>
            {count}
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[40vh] bg-white opacity-10 blur-[120px] rounded-full -z-10"></div>
        </div>
        <div className={`mt-10 px-12 py-3 rounded-full border-4 border-current font-black tracking-[0.3em] text-lg inline-block ${theme.secondaryText} bg-black/10 backdrop-blur-md uppercase shadow-xl`}>
          {theme.name}
        </div>
      </div>
    </div>
  );
};

const AdminPanel: React.FC<{ count: number; onUpdate: (v: number) => void }> = ({ count, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [custom, setCustom] = useState('');

  return (
    <>
      <div 
        className="fixed bottom-6 right-6 z-[100] opacity-10 hover:opacity-100 transition-opacity cursor-pointer p-2 bg-white/10 rounded-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
      </div>

      {isOpen && (
        <div className="fixed bottom-20 right-6 w-72 glass-panel p-6 rounded-[2.5rem] shadow-2xl border-2 border-yellow-400 z-[101] text-white">
          <h3 className="text-xl font-black uppercase mb-4 text-yellow-400 italic">Admin Control</h3>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button onClick={() => onUpdate(count + 1)} className="bg-white/10 hover:bg-white/20 py-4 rounded-2xl font-black text-xl">+1</button>
            <button onClick={() => onUpdate(count + 5)} className="bg-white/10 hover:bg-white/20 py-4 rounded-2xl font-black text-xl">+5</button>
          </div>
          <div className="flex gap-2">
            <input 
              type="number" value={custom} onChange={e => setCustom(e.target.value)}
              className="bg-black/50 border border-white/20 rounded-xl px-4 py-2 w-full outline-none focus:border-yellow-400 text-white"
              placeholder="Custom"
            />
            <button onClick={() => { if(custom) onUpdate(parseInt(custom)); setCustom(''); }} className="bg-yellow-400 text-black font-bold px-4 rounded-xl">Set</button>
          </div>
          <button onClick={() => { if(confirm("Reset all?")) onUpdate(0); }} className="w-full mt-6 text-red-400 text-[10px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">Reset All Progress</button>
        </div>
      )}
    </>
  );
};

const App: React.FC = () => {
  const [count, setCount] = useState<number | null>(null);
  const [audioStarted, setAudioStarted] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const theme = useMemo(() => getTheme(count || 0), [count]);

  useEffect(() => {
    if (!verseRef) {
      setIsOffline(true);
      setCount(0);
      return;
    }

    const unsubscribe = onValue(verseRef, (snapshot: any) => {
      const val = snapshot.val();
      setCount((val !== null) ? val : 0);
      setIsOffline(false);
    }, () => {
      setIsOffline(true);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdate = (newVal: number) => {
    if (verseRef) set(verseRef, Math.max(0, newVal));
    else setCount(Math.max(0, newVal));
  };

  if (count === null) {
    return (
      <div className="fixed inset-0 bg-stone-900 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-6 text-yellow-400 font-black tracking-[0.4em] text-[10px] uppercase animate-pulse">Syncing Uplink...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen font-sans">
      <DisplayMode count={count} theme={theme} audioStarted={audioStarted} />
      <AdminPanel count={count} onUpdate={handleUpdate} />

      {isOffline && (
        <div className="fixed bottom-6 left-6 flex items-center gap-2 bg-red-500/20 px-4 py-2 rounded-full border border-red-500/40 text-red-500 text-[10px] font-black uppercase tracking-widest backdrop-blur-sm">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          Connection Low
        </div>
      )}

      {!audioStarted && (
        <div className="fixed inset-0 z-[200] bg-stone-900/95 flex items-center justify-center p-6 backdrop-blur-xl">
          <div className="max-w-md w-full glass-panel border border-white/10 p-12 rounded-[3.5rem] text-center shadow-2xl">
            <h1 className="text-4xl font-black text-yellow-400 uppercase italic tracking-tighter mb-4">Awana Africa</h1>
            <p className="text-white/60 text-sm font-bold uppercase tracking-[0.2em] mb-12">Broadcast Verse Tracker</p>
            <button 
              onClick={() => { initAudio(); setAudioStarted(true); }}
              className="px-10 py-5 font-black text-stone-900 transition-all duration-200 bg-yellow-400 rounded-2xl hover:bg-yellow-300 active:scale-95 shadow-lg"
            >
              INITIALIZE BROADCAST
            </button>
          </div>
        </div>
      )}

      <div className="fixed top-6 left-6 text-[8px] font-mono text-white/20 uppercase tracking-[0.2em] pointer-events-none transition-opacity">
        Build: {BUILD_INFO.number} | {BUILD_INFO.timestamp}
      </div>
    </div>
  );
};

export default App;