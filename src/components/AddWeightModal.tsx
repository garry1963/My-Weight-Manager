import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { useWeightManager } from '../store';
import { kgToLbs, lbsToKg } from '../lib/utils';

export function AddWeightModal({ store, onClose }: { store: ReturnType<typeof useWeightManager>; onClose: () => void }) {
  const { addEntry, settings, entries } = store;
  
  const today = format(new Date(), 'yyyy-MM-dd');
  const [date, setDate] = useState(today);
  
  // Initialize weight field based on the most recent entry if available
  const [weight, setWeight] = useState<string>('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (entries.length > 0) {
      const latest = entries[0].weightKg;
      setWeight((settings.unit === 'kg' ? latest : latest * 2.20462).toFixed(1));
    }
  }, [entries, settings.unit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) return;

    const weightKg = settings.unit === 'kg' ? w : lbsToKg(w);
    
    addEntry({
      date,
      weightKg,
      note: note.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
      <div 
        className="bg-[#161618] border border-[#242426] rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-8 duration-200 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-white tracking-tight">Log Weight</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-white rounded-full transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="date" className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2 block">Date Selection</label>
            <input
              type="date"
              id="date"
              required
              value={date}
              max={today}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#1C1C1E] border border-[#242426] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 transition-all font-medium [color-scheme:dark]"
            />
          </div>

          <div>
            <label htmlFor="weight" className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2 block">Weight Value</label>
            <div className="relative">
              <input
                type="number"
                id="weight"
                required
                step="0.1"
                min="1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-[#1C1C1E] border border-[#242426] rounded-xl px-4 py-4 text-3xl font-bold focus:outline-none focus:border-teal-500 transition-all text-center tracking-tight text-white placeholder-gray-600 appearance-none"
                placeholder={`e.g., ${settings.unit === 'kg' ? '70.5' : '155.0'}`}
                autoFocus
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 font-bold uppercase tracking-widest">{settings.unit}</span>
            </div>
          </div>

          <div>
            <label htmlFor="note" className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2 block">Note (Optional)</label>
            <input
              type="text"
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-[#1C1C1E] border border-[#242426] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 transition-all font-medium"
              placeholder="How are you feeling?"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-teal-500 text-black font-bold rounded-2xl hover:bg-teal-400 active:scale-[0.98] transition-all shadow-lg shadow-teal-500/10 mt-8 cursor-pointer"
          >
            Log Entry
          </button>
        </form>
      </div>
    </div>
  );
}
