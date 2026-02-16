import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ref, onValue, set, off } from 'firebase/database';
import { db } from './firebase.ts';
import { getTheme, BUILD_INFO } from './constants.tsx';
import { initAudio, playPop, playMilestone } from './utils/audio.ts';
import { AnimationType } from './types.ts';

const AdminPanel: React.FC<{ current: number; onUpdate: (n: number) => void; onClose: () => void }> = ({ current, onUpdate, onClose }) => {
  const [val, setVal] = useState('');
  return (
    <div className="absolute bottom-20 right-0 w-80 glass-panel rounded-3xl p-6 text-white shadow-2xl z-[150]">
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
      <button 
        onClick={() => { if(confirm("Reset everything?")) onUpdate(0); }}
        className="w-full mt-4 text-red-400 hover:text-red-300 text-[10px] font-black uppercase tracking-widest"
      >
        Danger: Reset to Zero
      </button>
    </div>
  );
};

const App: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  const numberRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<(HTMLDivElement | null)[]>([]);
  const prevCount = useRef<number>(0);
  const theme = useMemo(() => getTheme(count), [count]);

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
      console.error("Firebase Sync Error:", err);
      setIsOffline(true);
    });
    return () => off(countRef);
  }, []);

  // Background GSAP Animations
  useEffect(() => {
    const gsap = (window as any).gsap;
    if (!gsap || particlesRef.current.length === 0) return;

    const currentParticles = particlesRef.current;
    currentParticles.forEach((el, i) => {
      if (!el) return;
      
      gsap.killTweensOf(el);

      const type = i % 3;
      if (type === 0) {
        gsap.to(el, {
          x: "random(-40, 40)",
          y: "random(-40, 40)",
          duration: "random(8, 15)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      } else if (type === 1) {
        gsap.to(el, {
          scale: 1.2,
          rotation: "random(-45, 45)",
          duration: "random(4, 7)",
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut"
        });
      } else {
        gsap.to(el, {
          rotation: 360,
          duration: "random(20, 40)",
          repeat: -1,
          ease: "none"
        });
      }
    });

    return () => {
      currentParticles.forEach(el => el && gsap.killTweensOf(el));
    };
  }, [theme, isStarted]);

  useEffect(() => {
    if (count !== prevCount.current && isStarted) {
      if (count > 0 && count % 50 === 0) playMilestone();
      else playPop();

      const gsap = (window as any).gsap;
      if (gsap) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        const size = 100;
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `calc(50% - ${size/2}px)`;
        ripple.style.top = `calc(50% - ${size/2}px)`;
        containerRef.current?.appendChild(ripple);

        gsap.to(ripple, {
          scale: 15,
          opacity: 0,
          borderWidth: 0,
          duration: 1,
          ease: "power2.out",
          onComplete: () => ripple.remove()
        });

        if (numberRef.current) {
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
            case AnimationType.BOUNCE:
              tl.fromTo(numberRef.current, { y: 200, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "bounce.out" });
              break;
            case AnimationType.CELEBRATE:
              tl.fromTo(numberRef.current, { scale: 1.5, filter: "brightness(3)" }, { scale: 1, filter: "brightness(1)", duration: 1, ease: "elastic.out(1, 0.3)" });
              gsap.to(containerRef.current, { backgroundColor: "#fff", duration: 0.1, repeat: 3, yoyo: true });
              break;
            case AnimationType.WAVE:
              tl.fromTo(numberRef.current, { x: -300, rotation: -15, opacity: 0 }, { x: 0, rotation: 0, opacity: 1, duration: 0.7, ease: "back.out" });
              break;
            case AnimationType.ZOOM:
              tl.fromTo(numberRef.current, { scale: 5, opacity: 0, filter: "blur(20px)" }, { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.5 });
              break;
            default:
              tl.fromTo(numberRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4 });
          }
        }
      }
      prevCount.current = count;
    }
  }, [count, isStarted, theme.animationType]);

  const handleUpdate = (newVal: number) => {
    if (db) set(ref(db, 'verseCount/current'), Math.max(0, newVal));
    else setCount(Math.max(0, newVal));
  };

  return (
    <div ref={containerRef} className={`relative w-full h-screen transition-all duration-1000 bg-gradient-to-br ${theme.gradient} flex items-center justify-center overflow-hidden`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {Array.from({length: 15}).map((_, i) => (
          <div 
            key={i} 
            ref={el => { particlesRef.current[i] = el; }}
            className="absolute"
            style={{ 
              left: `${(i * 13) % 100}%`, 
              top: `${(i * 21) % 100}%`,
              fontSize: `${40 + (i % 5) * 20}px`,
              willChange: "transform"
            }}
          >
            {theme.elements[i % theme.elements.length]}
          </div>
        ))}
      </div>

      <div className="z-10 text-center relative">
        <div className="relative inline-block">
          <div className="relative px-12 md:px-20 py-10 rounded-[5rem] glass-panel border-4 border-white/20 shadow-2xl overflow-hidden">
            <div 
              ref={numberRef}
              className={`text-[35vw] md:text-[25vw] leading-none font-[900] text-outline ${theme.text} select-none drop-shadow-2xl`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {count}
            </div>
          </div>
        </div>

        <div className="mt-8">
            <div className={`h-1.5 w-48 bg-white/10 rounded-full mx-auto overflow-hidden`}>
                <div 
                    className="h-full bg-yellow-400 transition-all duration-700"
                    style={{ width: `${(count % 50) / 50 * 100}%` }}
                ></div>
            </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-[120]">
        <button 
          onClick={() => setIsAdmin(!isAdmin)}
          className="p-3 text-white opacity-[0.05] hover:opacity-100 transition-all duration-500 bg-black/20 hover:bg-black/60 rounded-full focus:outline-none"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </button>
        {isAdmin && <AdminPanel current={count} onUpdate={handleUpdate} onClose={() => setIsAdmin(false)} />}
      </div>

      {!isStarted && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-stone-900/98 backdrop-blur-2xl text-center">
          <div className="p-12 glass-panel border-4 border-yellow-400 rounded-[3.5rem] max-w-lg shadow-[0_0_100px_rgba(250,204,21,0.2)] relative">
            <h1 className="text-6xl font-black text-white mb-4 uppercase tracking-tighter italic drop-shadow-lg">Awana Africa</h1>
            <p className="text-stone-300 mb-10 font-bold tracking-widest text-sm uppercase opacity-70">Schools Verse Tracker</p>
            
            <button
              onClick={() => { initAudio(); setIsStarted(true); }}
              className="group relative bg-yellow-400 hover:bg-white text-stone-900 font-black py-8 px-24 rounded-full text-3xl shadow-[0_12px_0_rgb(180,130,0)] hover:translate-y-2 transition-all active:scale-95 uppercase tracking-tighter"
            >
              Start Broadcast
              <div className="absolute -inset-2 bg-yellow-400 opacity-20 blur-xl group-hover:opacity-40 transition-opacity rounded-full"></div>
            </button>

            <div className="mt-12 pt-8 border-t border-white/10 text-[11px] text-white/30 font-mono tracking-widest uppercase flex flex-col gap-1">
              <span>{BUILD_INFO.number} // RELEASED {BUILD_INFO.timestamp}</span>
              <span>{isOffline ? 'CACHE_MODE' : 'CLOUD_SYNC_ENABLED'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;