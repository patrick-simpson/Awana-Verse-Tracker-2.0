let audioCtx: AudioContext | null = null;

export const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    // Warm up context for iOS
    const buffer = audioCtx.createBuffer(1, 1, 22050);
    const node = audioCtx.createBufferSource();
    node.buffer = buffer;
    node.connect(audioCtx.destination);
    node.start(0);
  }
  return audioCtx;
};

export const playPop = () => {
  if (!audioCtx || audioCtx.state !== 'running') {
    audioCtx?.resume();
    if (!audioCtx) return;
  }
  
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  // Joyful randomized pitch for 'cartoon' bounce
  const baseFreq = 400 + (Math.random() * 300);
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(baseFreq, now);
  // Frequency slide
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.3, now + 0.12);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 0.12);
};

export const playMilestone = () => {
  if (!audioCtx || audioCtx.state !== 'running') {
    audioCtx?.resume();
    if (!audioCtx) return;
  }
  
  const now = audioCtx.currentTime;
  
  // Triumphant Joyful Fanfare chord (C Major + Octave)
  const frequencies = [261.63, 329.63, 392.00, 523.25, 659.25]; 
  
  frequencies.forEach((f, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = i % 2 === 0 ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(f, now);
    
    // Slight vibrato/swell for celebration
    osc.frequency.exponentialRampToValueAtTime(f * 1.02, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(f, now + 0.8);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 1.5);
  });
};