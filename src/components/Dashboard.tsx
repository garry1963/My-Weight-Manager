import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useWeightManager } from '../store';
import { AddWeightModal } from './AddWeightModal';
import { formatWeight, calculateBMI, getBMICategory } from '../lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard({ store, onNavigate }: { store: ReturnType<typeof useWeightManager>; onNavigate: (tab: any) => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const { entries, settings } = store;

  const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const recentEntries = sortedEntries.slice(-14); // Last 14 entries for the mini chart

  const chartData = recentEntries.map(e => ({
    date: format(new Date(e.date), 'MMM d'),
    weight: settings.unit === 'kg' ? e.weightKg : e.weightKg * 2.20462
  }));

  const latestEntry = entries[0];
  const previousEntry = entries[1];

  const diff = latestEntry && previousEntry ? latestEntry.weightKg - previousEntry.weightKg : 0;
  const isLoss = diff < 0;
  const isGain = diff > 0;

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Weight Overview</h1>
          <p className="text-gray-500">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        </div>
      </header>

      <div className="bg-[#161618] rounded-2xl p-6 border border-[#242426]">
        <div className="flex flex-wrap gap-6 justify-between items-start">
          <div className="flex-1 min-w-[120px]">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Current Weight</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-white">
                {latestEntry ? formatWeight(latestEntry.weightKg, settings.unit) : '--'}
              </span>
            </div>
            {latestEntry && previousEntry && (
              <p className={`text-sm font-medium mt-2 flex items-center ${isLoss ? 'text-teal-400' : isGain ? 'text-red-400' : 'text-gray-500'}`}>
                {isLoss ? '↓ ' : isGain ? '↑ ' : '−'}
                {Math.abs(settings.unit === 'kg' ? diff : diff * 2.20462).toFixed(1)} {settings.unit}
              </p>
            )}
          </div>

          {(settings.heightCm && latestEntry) && (() => {
            const bmi = calculateBMI(latestEntry.weightKg, settings.heightCm);
            const category = getBMICategory(bmi);
            return (
              <div className="flex-1 min-w-[100px] text-left sm:text-center sm:border-l sm:border-[#242426] sm:pl-6">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">BMI <span className="lowercase normal-case text-[10px] font-normal">(kg/m²)</span></p>
                <div className="flex flex-col sm:items-center space-y-1">
                  <span className="text-3xl font-bold text-white">
                    {bmi.toFixed(1)}
                  </span>
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${bmi >= 18.5 && bmi < 25 ? 'text-teal-400' : 'text-red-400'}`}>
                    {category}
                  </span>
                </div>
              </div>
            );
          })()}

          {settings.goalWeightKg && (
            <div className="flex-1 min-w-[100px] text-left sm:text-right sm:border-l sm:border-[#242426] sm:pl-6">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Goal</p>
              <div className="flex items-baseline justify-start sm:justify-end space-x-2">
                <span className="text-3xl font-bold text-gray-400">
                  {formatWeight(settings.goalWeightKg, settings.unit)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {chartData.length > 1 && (
        <div className="bg-[#161618] rounded-3xl p-6 border border-[#242426] h-72 flex flex-col">
          <h3 className="font-semibold text-lg text-white mb-6">Weight Trends</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#242426" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 'bold' }} 
                  dy={10}
                />
                <YAxis 
                  domain={['dataMin - 1', 'dataMax + 1']} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 'bold' }}
                  dx={-10}
                  tickFormatter={(val) => val.toFixed(0)}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #242426', backgroundColor: '#1C1C1E', color: '#E4E4E6' }}
                  itemStyle={{ color: '#14b8a6' }}
                  formatter={(value: number) => [`${value.toFixed(1)} ${settings.unit}`, 'Weight']}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#14b8a6" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#161618', stroke: '#14b8a6' }}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: '#14b8a6', fill: '#0F0F10' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {entries.length === 0 && (
        <div className="bg-teal-500/10 text-teal-400 p-6 rounded-2xl border border-teal-500/30 text-center">
          <h3 className="font-medium text-lg mb-2 text-white">Welcome to My Weight Manager</h3>
          <p className="text-sm mb-4 text-gray-400">Start your journey by logging your first weight.</p>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-teal-500 text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-teal-400 transition cursor-pointer"
          >
            Log Weight Now
          </button>
        </div>
      )}

      <button
        onClick={() => setIsAdding(true)}
        className="fixed bottom-20 right-6 w-14 h-14 bg-teal-500 hover:bg-teal-400 active:bg-teal-600 rounded-2xl shadow-lg shadow-teal-500/20 flex items-center justify-center text-black transition-transform hover:scale-105 cursor-pointer"
      >
        <Plus size={24} />
      </button>

      {isAdding && <AddWeightModal store={store} onClose={() => setIsAdding(false)} />}
    </div>
  );
}
