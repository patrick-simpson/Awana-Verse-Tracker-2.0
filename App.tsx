import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getTheme, BUILD_INFO } from './constants.tsx';
import { initAudio, playPop, playMilestone } from './utils/audio.ts';
import { verseRef, onValue, set } from './firebase.ts';
import { AnimationType } from './types.ts';

// --- SUB-COMPONENTS ---

const DisplayUI: React.FC<{ count: number; theme: any; audioStarted: boolean }> = ({ count, theme, audioStarted }) => {
  const numberRef = useRef<HTMLDivElement>(null);
  const prevCount = useRef<number>(count);
  
  // Create randomized positions for floating whimsy elements once
  const floatingElements = useMemo(() => Array.from({ length: 10 }).map(() => ({
    id: Math.random(),
    x: Math.random() * 90 + 5,
    y: Math.random() * 90 + 5,
    rotation: Math.random() * 360,
    size: 20 + Math.random() * 50
  })), []);

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
            tl.fromTo(numberRef.current, { y: -300, opacity: 0, scale: 0.5 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "bounce.out" });
            break;
          case AnimationType.POP:
            tl.fromTo(numberRef.current, { scale: 0 }, { scale: 1, duration: 0.7, ease: "back.out(1.7)" });
            break;
          case AnimationType.SLIDE:
            tl.fromTo(numberRef.current, { x: 500, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" });
            break;
          case AnimationType.ROTATE:
            tl.fromTo(numberRef.current, { rotation: 180, scale: 0.5, opacity: 0 }, { rotation: 0, scale: 1, opacity: 1, duration: 0.7, ease: "power2.out" });
            break;
          case AnimationType.ZOOM:
            tl.fromTo(numberRef.current, { scale: 3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "circ.out" });
            break;
          case AnimationType.CELEBRATE:
            tl.fromTo(numberRef.current, { scale: 0.5, y: 150 }, { scale: 1, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
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
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        {floatingElements.map((el, i) => (
          <div 
            key={el.id} 
            className="absolute select-none transition-all duration-1000" 
            style={{ 
              left: `${el.x}%`, 
              top: `${el.y}%`, 
              fontSize: `${el.size}px`, 
              transform: `rotate(${el.rotation}deg)` 
            }}
          >
            {theme.elements[i % theme.elements.length]}
          </div>
        ))}
      </div>

      <div className="text-center z-10 select-none px-6">
        <h2 className={`uppercase font-black text-xl md:text-2xl mb-4 tracking-[0.4em] opacity-70 ${theme.secondaryText}`}>
          Verses Recited
        </h2>
        <div className="relative">
          <div ref={numberRef} className={`text-[40vw] md:text-[25vw] leading-none font-black text-outline ${theme.text} drop-shadow-[0_20px_60px_rgba(0,0,0,0.3)]`}>
            {count}
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[40vh] bg-white opacity-10 blur-[130px] rounded-full -z-10"></div>
        </div>
        <div className={`mt-12 px-12 py-4 rounded-full border-4 border-current font-black tracking-[0.3em] text-lg inline-block ${theme.secondaryText} bg-black/10 backdrop-blur-md uppercase shadow-xl`}>
          {theme.name}
        </div>
      </div>
      
      {/* Subtle branding */}
      <div className="absolute bottom-10 left-0 w-full flex justify-center opacity-30 pointer-events-none">
        <div className="flex items-center gap-6">
           <div className="h-px w-16 bg-white"></div>
           <span className="text-[10px] text-white font-black uppercase tracking-[0.6em]">Awana Africa Schools Project</span>
           <div className="h-px w-16 bg-white"></div>
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
        className="fixed bottom-6 right-6 z-[100] opacity-5 hover:opacity-100 transition-opacity cursor-pointer p-4 bg-white/5 rounded-full hover:bg-white/10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 glass-panel p-8 rounded-[3rem] shadow-2xl border-2 border-yellow-400 z-[101] text-white">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black uppercase text-yellow-400 italic">Broadcast Controller</h3>
            <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white">✕</button>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button onClick={() => onUpdate(count + 1)} className="bg-white/10 hover:bg-white/20 py-4 rounded-2xl font-black text-xl active:scale-95 transition-transform border border-white/5">+1</button>
            <button onClick={() => onUpdate(count + 5)} className="bg-white/10 hover:bg-white/20 py-4 rounded-2xl font-black text-xl active:scale-95 transition-transform border border-white/5">+5</button>
          </div>
          <div className="space-y-2 mb-6">
             <label className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">Manual Override</label>
             <div className="flex gap-2">
                <input 
                  type="number" value={custom} onChange={e => setCustom(e.target.value)}
                  className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 w-full outline-none focus:border-yellow-400 text-white font-bold"
                  placeholder="Set Count"
                />
                <button onClick={() => { if(custom) onUpdate(parseInt(custom)); setCustom(''); }} className="bg-yellow-400 text-stone-900 font-black px-6 rounded-xl hover:bg-yellow-300 active:scale-95 transition-all shadow-lg">GO</button>
             </div>
          </div>
          <button onClick={() => { if(confirm("Permanently wipe all verse data?")) onUpdate(0); }} className="w-full mt-4 text-red-400 text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity">Emergency Reset</button>
        </div>
      )}
    </>
  );
};

const App: React.FC = () => {
  const [count, setCount] = useState<number | null>(null);
  const [audioStarted, setAudioStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useMemo(() => getTheme(count || 0), [count]);

  useEffect(() => {
    if (!verseRef) {
      setError("Firebase SDK failed to initialize correctly. Please check connection.");
      return;
    }

    try {
      const unsubscribe = onValue(verseRef, (snapshot: any) => {
        const val = snapshot.val();
        setCount(val === null ? 0 : val);
        setError(null);
      }, (err: any) => {
        setError(`Database Error: ${err.message}`);
      });

      return () => unsubscribe();
    } catch (e: any) {
      setError(`Critical Error: ${e.message}`);
    }
  }, []);

  const handleUpdate = (newVal: number) => {
    const safeVal = Math.max(0, newVal);
    if (verseRef) set(verseRef, safeVal);
    else setCount(safeVal);
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-stone-950 flex flex-col items-center justify-center p-10 text-center">
         <div className="text-red-500 border-2 border-red-500/50 p-10 rounded-[2rem] bg-red-500/5 max-w-md">
            <h1 className="text-2xl font-black mb-4 uppercase tracking-tighter italic">Critical Uplink Failure</h1>
            <p className="font-mono text-sm opacity-60 mb-8">{error}</p>
            <button onClick={() => location.reload()} className="bg-red-500 text-white font-black px-8 py-3 rounded-xl uppercase text-xs tracking-widest hover:bg-red-600">Reboot Engine</button>
         </div>
      </div>
    );
  }

  if (count === null) {
    return (
      <div className="fixed inset-0 bg-stone-950 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-8 text-yellow-400 font-black tracking-[0.5em] text-[10px] uppercase animate-pulse">Syncing Broadcast Feed...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen font-sans">
      <DisplayUI count={count} theme={theme} audioStarted={audioStarted} />
      <AdminPanel count={count} onUpdate={handleUpdate} />

      {!audioStarted && (
        <div className="fixed inset-0 z-[200] bg-stone-950/98 flex items-center justify-center p-6 backdrop-blur-2xl">
          <div className="max-w-md w-full glass-panel border border-white/10 p-14 rounded-[4rem] text-center shadow-2xl border-yellow-400/20">
            <h1 className="text-5xl font-black text-yellow-400 uppercase italic tracking-tighter mb-4">Awana Africa</h1>
            <p className="text-white/50 text-xs font-bold uppercase tracking-[0.3em] mb-14 leading-relaxed">Broadcast Verse Tracker<br/>Live Synchronization Engine</p>
            <button 
              onClick={() => { initAudio(); setAudioStarted(true); }}
              className="w-full py-6 font-black text-stone-900 transition-all duration-300 bg-yellow-400 rounded-3xl hover:bg-yellow-300 hover:scale-[1.05] active:scale-95 shadow-[0_20px_40px_rgba(251,191,36,0.2)] text-xl uppercase tracking-widest"
            >
              Start Uplink
            </button>
          </div>
        </div>
      )}

      {/* Version Info */}
      <div className="fixed top-6 left-6 text-[8px] font-mono text-white/20 uppercase tracking-[0.2em] pointer-events-none">
        Broadcast: {BUILD_INFO.number} | {BUILD_INFO.timestamp}
      </div>
    </div>
  );
};

export default App;