
import React, { useEffect, useRef, useState } from 'react';
import { getTheme } from '../constants.tsx';
import { playPop, playMilestone } from '../utils/audio.ts';
import { AnimationType } from '../types.ts';

interface Props {
  count: number;
  audioStarted: boolean;
}

const DisplayMode: React.FC<Props> = ({ count, audioStarted }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const prevCount = useRef<number>(count);
  const theme = getTheme(count);
  
  // Floating elements state for whimsy
  const [elements] = useState(() => Array.from({ length: 8 }).map(() => ({
    id: Math.random(),
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 20 + Math.random() * 40,
    speed: 5 + Math.random() * 10,
    char: theme.elements[Math.floor(Math.random() * theme.elements.length)]
  })));

  useEffect(() => {
    // Only animate if count actually changed
    if (count !== prevCount.current) {
      if (audioStarted) {
        if (count > 0 && count % 50 === 0) {
          playMilestone();
        } else {
          playPop();
        }
      }

      // Animate the number change based on theme type
      const gsap = (window as any).gsap;
      if (numberRef.current && gsap) {
        const tl = gsap.timeline();
        
        switch (theme.animationType) {
          case AnimationType.FALL:
            tl.fromTo(numberRef.current, { y: -200, opacity: 0, scale: 0.5 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "bounce.out" });
            break;
          case AnimationType.SLIDE:
            tl.fromTo(numberRef.current, { x: 400, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
            break;
          case AnimationType.POP:
            tl.fromTo(numberRef.current, { scale: 0 }, { scale: 1, duration: 0.7, ease: "back.out(1.7)" });
            break;
          case AnimationType.ROTATE:
            tl.fromTo(numberRef.current, { rotation: 180, scale: 0.2, opacity: 0 }, { rotation: 0, scale: 1, opacity: 1, duration: 0.6, ease: "power2.out" });
            break;
          case AnimationType.ZOOM:
            tl.fromTo(numberRef.current, { scale: 3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "circ.out" });
            break;
          case AnimationType.BLUR:
            tl.fromTo(numberRef.current, { filter: "blur(20px)", opacity: 0 }, { filter: "blur(0px)", opacity: 1, duration: 0.8 });
            break;
          case AnimationType.CELEBRATE:
            tl.fromTo(numberRef.current, { scale: 0.5, y: 100 }, { scale: 1, y: 0, duration: 0.4, ease: "elastic.out(1, 0.3)" });
            gsap.to(containerRef.current, { backgroundColor: "#FFF", duration: 0.1, repeat: 3, yoyo: true });
            break;
          default:
            tl.fromTo(numberRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });
        }
      }
      prevCount.current = count;
    }
  }, [count, audioStarted, theme.animationType]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-screen transition-all duration-1000 bg-gradient-to-br ${theme.gradient} flex flex-col items-center justify-center`}
    >
      {/* Background Floating Elements */}
      {elements.map((el, idx) => (
        <div
          key={el.id}
          className="absolute opacity-20 pointer-events-none select-none transition-all duration-1000"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            fontSize: `${el.size}px`,
            filter: 'blur(1px)',
            transform: `translateY(${(Math.sin(Date.now() / 1000 + idx) * 20)}px)`
          }}
        >
          {theme.elements[idx % theme.elements.length]}
        </div>
      ))}

      {/* Main UI Container */}
      <div className="z-10 text-center px-4">
        <h2 className={`uppercase font-black text-xl md:text-2xl mb-2 tracking-[0.2em] opacity-80 ${theme.secondaryText}`}>
          Total Verses Recited
        </h2>
        
        <div className="relative">
          <div 
            ref={numberRef}
            className={`text-[25vw] leading-none font-black filter drop-shadow-2xl text-outline ${theme.text}`}
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {count}
          </div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[30vh] bg-white opacity-10 blur-[100px] rounded-full -z-10"></div>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <div className={`px-8 py-2 rounded-full border-2 border-current font-bold tracking-widest text-sm md:text-base ${theme.secondaryText} bg-white/10 backdrop-blur-sm`}>
            {theme.name.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Branding Overlay */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-30 flex items-center gap-4">
        <div className="h-px w-12 bg-white"></div>
        <span className="text-white font-bold tracking-[0.5em] text-[10px] uppercase">Awana Africa Schools Project</span>
        <div className="h-px w-12 bg-white"></div>
      </div>
    </div>
  );
};

export default DisplayMode;
