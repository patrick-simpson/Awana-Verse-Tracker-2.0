
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ref, onValue, set, off } from 'firebase/database';
import { db } from './firebase.ts';
import { getTheme, BUILD_INFO } from './constants.tsx';
import { initAudio, playPop, playMilestone } from './utils/audio.ts';
import { AnimationType } from './types.ts';

// Helper for Admin Controls UI
const AdminPanel: React.FC<{ current: number; onUpdate: (n: number) => void; onClose: () => void }> = ({ current, onUpdate, onClose }) => {
  const [val, setVal] = useState('');
  return (
    <div className="absolute bottom-20 right-0 w-80 glass-panel rounded-3xl p-6 text-white shadow-2xl animate-in slide-in-from-right-10 duration-300">
      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
        <h3 className="text-xl font-black uppercase tracking-widest text-yellow-400">Broadcast Desk</h3>
        <button onClick={onClose} className="hover:scale-110 transition-transform">✕</button>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button onClick={() => onUpdate(current + 1)} className="bg-white/10 hover:bg-white/20 py-4 rounded-2xl font-black text-lg">+1</button>
        <button onClick={() => onUpdate(current + 5)} className="bg-white/10 hover:bg-white/20 py-4 rounded-2xl font-black text-lg">+5</button>
      </div>
      <div className="space-y-4">
        <input 
          type="number" 
          value={val} 
          onChange={e => setVal(e.target.value)}
          placeholder="Set custom count..."
          className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 outline-none focus:border-yellow-400 transition-colors"
        />
        <button 
          onClick={() => { if(val) onUpdate(parseInt(val)); setVal(''); }}
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-stone-900 font-black py-3 rounded-xl uppercase tracking-widest"
        >
          Update Count
        </button>
        <button 
          onClick={() => { if(confirm('Reset all?')) onUpdate(0); }}
          className="w-full text-red-400 font-bold text-xs uppercase tracking-widest opacity-50 hover:opacity-100 mt-4"
        >
          Critical Reset
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [engaged, setEngaged] = useState<boolean>(false);
  
  const numberRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevCount = useRef<number>(0);
  const theme = getTheme(count);

  useEffect(() => {
    if (!db) {
      setIsOffline(true);
      return;
    }
    const countRef = ref(db, 'verseCount/current');
    const unsubscribe = onValue(countRef, (snap) => {
      const val = snap.val();
      if (val !== null) setCount(Number(val));
      setIsOffline(false);
    }, (err) => {
      console.error(err);
      setIsOffline(true);
    });
    return () => off(countRef);
  }, []);

  useEffect(() => {
    if (count !== prevCount.current) {
      if (isStarted) {
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
            tl.fromTo(numberRef.current, { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2)" });
            break;
          case AnimationType.SLIDE:
            tl.fromTo(numberRef.current, { x: 500, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power4.out" });
            break;
          case AnimationType.CELEBRATE:
            tl.fromTo(numberRef.current, { scale: 1.5, filter: "brightness(3)" }, { scale: 1, filter: "brightness(1)", duration: 1, ease: "elastic.out(1, 0.3)" });
            gsap.to(containerRef.current, { backgroundColor: "#fff", duration: 0.1, repeat: 5, yoyo: true });
            break;
          default:
            tl.fromTo(numberRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 });
        }
      }
      prevCount.current = count;
    }
  }, [count, isStarted, theme.animationType]);

  const handleUpdate = (newVal: number) => {
    if (db) set(ref(db, 'verseCount/current'), newVal);
    else setCount(newVal);
  };

  return (
    <div ref={containerRef} className={`relative w-full h-screen transition-all duration-1000 bg-gradient-to-br ${theme.gradient} flex items-center justify-center overflow-hidden`}>
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {Array.from({length: 12}).map((_, i) => (
          <div 
            key={i} 
            className="absolute floating text-6xl"
            style={{ 
              left: `${Math.random()*100}%`, 
              top: `${Math.random()*100}%`,
              animationDelay: `${Math.random()*5}s`,
              fontSize: `${20 + Math.random()*80}px`
            }}
          >
            {theme.elements[i % theme.elements.length]}
          </div>
        ))}
      </div>

      {/* Main Broadcast Counter */}
      <div className="z-10 text-center relative max-w-4xl px-6">
        <h2 className={`uppercase font-black text-xl md:text-3xl mb-4 tracking-[0.3em] ${theme.secondaryText} opacity-90 drop-shadow-lg`}>
          Awana Africa Progress
        </h2>
        
        <div className="relative inline-block px-12 py-8 rounded-[4rem] glass-panel border-4 border-white/20 shadow-2xl overflow-hidden">
          <div 
            ref={numberRef}
            className={`text-[30vw] md:text-[22vw] leading-none font-[900] text-outline ${theme.text} select-none drop-shadow-2xl`}
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {count}
          </div>
          {/* Internal Glow */}
          <div className="absolute inset-0 bg-white/5 pointer-events-none"></div>
        </div>

        <div className="mt-12">
          <div className={`inline-block px-10 py-3 rounded-full border-2 border-current font-black tracking-widest text-lg ${theme.secondaryText} bg-white/10 backdrop-blur-md`}>
            STRETCH: {theme.name.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Build & Connection UI */}
      {!engaged && (
        <div className="fixed top-6 left-6 text-[11px] text-white/40 font-mono tracking-widest z-50">
          AWANA-AFRICA-OS // v{BUILD_INFO.number} // {isOffline ? 'OFFLINE_MODE' : 'SYNC_ACTIVE'}
        </div>
      )}

      {/* Admin Toggle */}
      <div className="fixed bottom-6 right-6 z-[120]">
        <button 
          onMouseEnter={() => (window as any).gsap?.to('#gear', { rotation: 90, duration: 0.3 })}
          onClick={() => setIsAdmin(!isAdmin)}
          className="p-3 text-white opacity-10 hover:opacity-100 transition-all duration-500 bg-black/20 hover:bg-black/40 rounded-full"
        >
          <svg id="gear" className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        </button>
        {isAdmin && <AdminPanel current={count} onUpdate={handleUpdate} onClose={() => setIsAdmin(false)} />}
      </div>

      {/* Start Overlay */}
      {!isStarted && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-stone-900/95 backdrop-blur-xl">
          <div className="text-center p-12 glass-panel border-4 border-yellow-400 rounded-[3rem] max-w-lg shadow-[0_0_100px_rgba(251,191,36,0.2)]">
            <div className="text-6xl mb-6">🦒</div>
            <h1 className="text-5xl font-black text-white mb-4 tracking-tighter uppercase italic">Awana Africa</h1>
            <p className="text-stone-300 mb-10 font-bold tracking-widest text-sm">REAL-TIME BROADCAST TRACKER</p>
            <button
              onClick={() => { initAudio(); setIsStarted(true); setEngaged(true); }}
              className="bg-yellow-400 hover:bg-yellow-300 text-stone-900 font-black py-6 px-16 rounded-full text-2xl shadow-[0_12px_0_rgb(180,130,0)] hover:translate-y-2 hover:shadow-[0_4px_0_rgb(180,130,0)] transition-all active:scale-95 uppercase tracking-tighter"
            >
              Start Session
            </button>
          </div>
        </div>
      )}

      {/* Branding */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 opacity-30 group hover:opacity-100 transition-opacity">
        <div className="h-px w-24 bg-white"></div>
        <span className="text-white font-black tracking-[0.6em] text-[12px] uppercase whitespace-nowrap">Schools Project Live</span>
        <div className="h-px w-24 bg-white"></div>
      </div>
    </div>
  );
};

export default App;
