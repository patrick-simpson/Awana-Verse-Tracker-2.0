import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getTheme, BUILD_INFO } from './constants.tsx';
import { initAudio, playPop, playMilestone } from './utils/audio.ts';
import { AnimationType } from './types.ts';

const App: React.FC = () => {
  // Load initial state from local storage or default to 0
  const [count, setCount] = useState<number>(() => {
    const saved = localStorage.getItem('awana_verse_count');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [audioStarted, setAudioStarted] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [customVal, setCustomVal] = useState('');
  const [engaged, setEngaged] = useState(false);
  
  const numberRef = useRef<HTMLDivElement>(null);
  const prevCount = useRef<number>(count);
  const theme = useMemo(() => getTheme(count), [count]);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('awana_verse_count', count.toString());
  }, [count]);

  // Handle Animations and Sound
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
            tl.fromTo(numberRef.current, { scale: 0.4, opacity: 0, y: 50 }, { scale: 1, opacity: 1, y: 0, duration: 0.5 });
        }
      }
      prevCount.current = count;
      setEngaged(true);
    }
  }, [count, theme, audioStarted]);

  // Global Keyboard Listener (Projector Remote)
  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      // Remote "Next" keys
      const nextKeys = ['PageDown', 'ArrowRight', 'ArrowDown', ' ', 'Enter'];
      // Remote "Back" keys (user requested these ALSO increment count)
      const backKeys = ['PageUp', 'ArrowLeft', 'ArrowUp'];
      
      if (nextKeys.includes(e.key) || backKeys.includes(e.key)) {
        // Prevent default scrolling behavior
        if (![' ', 'Enter'].includes(e.key) || e.target === document.body) {
          e.preventDefault();
        }
        setCount(c => c + 1);
      }

      // Secret Admin Undo (Shift + Backspace)
      if (e.shiftKey && e.key === 'Backspace') {
        setCount(c => Math.max(0, c - 1));
      }
    };

    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, []);

  const floatingDecor = useMemo(() => Array.from({ length: 12 }).map(() => ({
    id: Math.random(),
    x: Math.random() * 90 + 5,
    y: Math.random() * 90 + 5,
    rot: Math.random() * 360,
    size: 20 + Math.random() * 40
  })), []);

  return (
    <div className={`relative w-full h-screen transition-all duration-1000 bg-gradient-to-br ${theme.gradient} flex items-center justify-center overflow-hidden`}>
      {/* Whimsy Background */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        {floatingDecor.map((el, i) => (
          <div key={el.id} className="absolute select-none transition-all duration-1000" style={{ left: `${el.x}%`, top: `${el.y}%`, fontSize: `${el.size}px`, transform: `rotate(${el.rot}deg)` }}>
            {theme.elements[i % theme.elements.length]}
          </div>
        ))}
      </div>

      {/* Main Counter */}
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

      {/* Branding */}
      <div className="absolute bottom-10 left-0 w-full flex justify-center opacity-30 pointer-events-none">
        <span className="text-[10px] text-white font-black uppercase tracking-[0.6em]">Awana Africa Schools Project</span>
      </div>

      {/* Build Info (Fades after engagement) */}
      {!engaged && (
        <div className="fixed top-6 left-6 text-[8px] font-mono text-white/40 uppercase tracking-[0.2em] transition-opacity">
          LOCAL BROADCAST ENGINE {BUILD_INFO.number} | {BUILD_INFO.timestamp}
        </div>
      )}

      {/* Manual Admin Override Icon */}
      <div 
        className="fixed bottom-6 right-6 z-[100] opacity-5 hover:opacity-100 transition-opacity cursor-pointer p-4 bg-white/5 rounded-full"
        onClick={() => setShowAdmin(!showAdmin)}
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
      </div>

      {showAdmin && (
        <div className="fixed bottom-24 right-6 w-72 glass-panel p-8 rounded-[2rem] text-white z-[101]">
          <h3 className="text-xs font-black uppercase tracking-widest text-amber-400 mb-6 italic">Manual Controls</h3>
          <div className="flex gap-2 mb-4">
            <input 
              type="number" value={customVal} onChange={e => setCustomVal(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 w-full outline-none focus:border-amber-400 font-bold"
              placeholder="Set count"
            />
            <button onClick={() => { if(customVal) setCount(parseInt(customVal)); setCustomVal(''); }} className="bg-amber-400 text-stone-900 font-black px-4 rounded-xl">SET</button>
          </div>
          <button onClick={() => { if(confirm("Reset to 0?")) setCount(0); }} className="w-full py-2 text-red-400 text-[10px] font-bold uppercase tracking-widest border border-red-400/20 rounded-lg hover:bg-red-400/10">Reset Data</button>
          <p className="mt-4 text-[9px] text-white/30 uppercase text-center italic">Use Remote or Keyboard Arrows</p>
        </div>
      )}

      {/* Start Overlay (Browser Policy) */}
      {!audioStarted && (
        <div className="fixed inset-0 z-[200] bg-stone-950 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <h1 className="text-6xl font-black text-amber-400 uppercase italic tracking-tighter mb-2">Awana</h1>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em] mb-16">Africa Schools Project Tracker</p>
            <button 
              onClick={() => { initAudio(); setAudioStarted(true); }}
              className="w-full py-6 font-black text-stone-900 bg-amber-400 rounded-3xl hover:bg-amber-300 hover:scale-[1.05] active:scale-95 transition-all text-xl uppercase tracking-widest shadow-[0_20px_40px_rgba(251,191,36,0.2)]"
            >
              Start Tracker
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;