import React, { useState } from 'react';
import { useWeightManager } from '../store';
import { lbsToKg, cmToInches, inchesToCm } from '../lib/utils';
import { Check } from 'lucide-react';

export default function Settings({ store }: { store: ReturnType<typeof useWeightManager> }) {
  const { settings, updateSettings } = store;
  
  const [goalInput, setGoalInput] = useState<string>(
    settings.goalWeightKg
      ? (settings.unit === 'kg' ? settings.goalWeightKg : settings.goalWeightKg * 2.20462).toFixed(1)
      : ''
  );

  const [heightInput, setHeightInput] = useState<string>(
    settings.heightCm 
      ? (settings.unit === 'kg' ? settings.heightCm : cmToInches(settings.heightCm)).toFixed(1)
      : ''
  );

  const [isSaved, setIsSaved] = useState(false);

  const handleUnitToggle = (unit: 'kg' | 'lbs') => {
    if (unit === settings.unit) return;
    
    // We should compute the current target weight in kg first to safely transition to the new unit formatting
    let currentGoalKg: number | null = null;
    
    if (goalInput) {
      currentGoalKg = settings.unit === 'kg' ? parseFloat(goalInput) : lbsToKg(parseFloat(goalInput));
    }

    if (currentGoalKg !== null && !isNaN(currentGoalKg)) {
      if (unit === 'kg') {
        setGoalInput(currentGoalKg.toFixed(1));
      } else if (unit === 'lbs') {
        setGoalInput((currentGoalKg * 2.20462).toFixed(1));
      }
    }

    if (heightInput) {
      const currentHeight = parseFloat(heightInput);
      if (!isNaN(currentHeight)) {
        if (unit === 'kg') {
          // If switching to cm from Imperial
          if (settings.unit !== 'kg') {
            setHeightInput(inchesToCm(currentHeight).toFixed(1));
          }
        } else {
          // If switching to Imperial from cm
          if (settings.unit === 'kg') {
            setHeightInput(cmToInches(currentHeight).toFixed(1));
          }
        }
      }
    }
    
    updateSettings({ unit });
  };

  const handleSaveGoal = () => {
    const valsToUpdate: Partial<typeof settings> = {};
    
    const val = parseFloat(goalInput);
    if (!isNaN(val) && val > 0) {
      const kgValue = settings.unit === 'kg' ? val : lbsToKg(val);
      valsToUpdate.goalWeightKg = kgValue;
    } else if (goalInput === '') {
      valsToUpdate.goalWeightKg = null;
    }

    const heightVal = parseFloat(heightInput);
    if (!isNaN(heightVal) && heightVal > 0) {
      const cmValue = settings.unit === 'kg' ? heightVal : inchesToCm(heightVal);
      valsToUpdate.heightCm = cmValue;
    } else if (heightInput === '') {
      valsToUpdate.heightCm = null;
    }
    
    if (Object.keys(valsToUpdate).length > 0) {
      updateSettings(valsToUpdate);
    }
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
      </header>

      <div className="bg-[#161618] rounded-3xl border border-[#242426] overflow-hidden">
        <div className="p-6 border-b border-[#242426]">
          <h3 className="font-semibold text-lg text-white mb-6">Units</h3>
          <div className="flex bg-[#1C1C1E] p-1.5 rounded-xl border border-[#242426]">
            <button
              onClick={() => handleUnitToggle('kg')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                settings.unit === 'kg' 
                  ? 'bg-teal-500 text-black' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Metric (kg)
            </button>
            <button
              onClick={() => handleUnitToggle('lbs')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                settings.unit === 'lbs' 
                  ? 'bg-teal-500 text-black' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Imperial (lb)
            </button>
          </div>
        </div>

        <div className="p-6">
          <h3 className="font-semibold text-lg text-white mb-6">Personal Details & Goals</h3>
          <div className="space-y-6">
            <div>
              <label htmlFor="height" className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2 block">
                Height ({settings.unit === 'kg' ? 'cm' : 'in'})
              </label>
              <div className="flex space-x-3 mb-6">
                <input
                  type="number"
                  id="height"
                  inputMode="decimal"
                  value={heightInput}
                  onChange={(e) => setHeightInput(e.target.value)}
                  placeholder={`e.g., ${settings.unit === 'kg' ? '175.0' : '68.0'}`}
                  className="flex-1 bg-[#1C1C1E] border border-[#242426] rounded-xl px-4 py-3 text-lg sm:text-base text-white focus:outline-none focus:border-teal-500 font-bold transition-all appearance-none m-0"
                />
              </div>
            </div>

            <div>
              <label htmlFor="goal" className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2 block">
                Target Weight ({settings.unit})
              </label>
                <div className="flex space-x-3">
                  <input
                    type="number"
                    id="goal"
                    inputMode="decimal"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    placeholder={`e.g., ${settings.unit === 'kg' ? '65.0' : '145.0'}`}
                    className="flex-1 bg-[#1C1C1E] border border-[#242426] rounded-xl px-4 py-3 text-lg sm:text-base text-white focus:outline-none focus:border-teal-500 font-bold transition-all appearance-none m-0"
                  />
                </div>
            </div>
            
            <div className="pt-2">
              <button
                onClick={handleSaveGoal}
                className="w-full bg-teal-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-teal-400 transition-colors flex items-center justify-center cursor-pointer shadow-lg shadow-teal-500/10"
              >
                {isSaved ? <Check size={18} className="text-black mr-2" /> : ''}
                {isSaved ? 'Saved Successfully' : 'Save Details'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
