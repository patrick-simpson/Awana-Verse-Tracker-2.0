
import React, { useState } from 'react';

interface Props {
  currentCount: number;
  onUpdateCount: (newCount: number) => void;
}

const AdminMode: React.FC<Props> = ({ currentCount, onUpdateCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customValue, setCustomValue] = useState<string>('');

  const handleAdd = (val: number) => {
    onUpdateCount(currentCount + val);
  };

  const handleSet = () => {
    const val = parseInt(customValue);
    if (!isNaN(val)) {
      onUpdateCount(val);
      setCustomValue('');
    }
  };

  const handleReset = () => {
    if (confirm("Reset verse count to zero?")) {
      onUpdateCount(0);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[110]">
      {/* Gear Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white opacity-10 hover:opacity-100 transition-opacity p-2 rounded-full bg-black/20 hover:bg-black/40"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Control Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-72 bg-[#686158] border-4 border-[#FBBF24] rounded-2xl shadow-2xl p-6 text-white overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black uppercase tracking-tight">Admin Controls</h3>
            <button onClick={() => setIsOpen(false)} className="hover:text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button 
              onClick={() => handleAdd(1)}
              className="bg-stone-700 hover:bg-stone-600 py-3 rounded-xl font-bold border-b-4 border-stone-800 transition-all active:translate-y-1 active:border-b-0"
            >
              +1 Verse
            </button>
            <button 
              onClick={() => handleAdd(5)}
              className="bg-stone-700 hover:bg-stone-600 py-3 rounded-xl font-bold border-b-4 border-stone-800 transition-all active:translate-y-1 active:border-b-0"
            >
              +5 Verses
            </button>
          </div>

          <div className="space-y-3 mb-6">
            <label className="text-xs font-bold uppercase text-stone-300">Set Absolute Count</label>
            <div className="flex gap-2">
              <input 
                type="number"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="Ex: 500"
                className="flex-1 bg-stone-800 rounded-lg px-4 py-2 border-2 border-stone-700 outline-none focus:border-[#FBBF24]"
              />
              <button 
                onClick={handleSet}
                className="bg-[#FBBF24] text-stone-900 font-bold px-4 rounded-lg hover:bg-yellow-500"
              >
                Set
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-600">
            <button 
              onClick={handleReset}
              className="w-full bg-red-900/40 hover:bg-red-900 text-red-200 py-2 rounded-lg text-sm font-bold transition-colors"
            >
              Reset to 0
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMode;
