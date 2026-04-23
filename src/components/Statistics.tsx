import React, { useState } from 'react';
import { format, startOfWeek, startOfMonth, parseISO } from 'date-fns';
import { useWeightManager } from '../store';
import { formatWeight } from '../lib/utils';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend, ReferenceLine } from 'recharts';

export default function Statistics({ store }: { store: ReturnType<typeof useWeightManager> }) {
  const { entries, settings } = store;

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  if (entries.length < 2) {
    return (
      <div className="space-y-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-white">Statistics</h1>
        </header>
        <div className="bg-[#161618] rounded-2xl p-8 text-center border border-[#242426]">
          <p className="text-gray-500">Log at least two entries to see statistics and charts.</p>
        </div>
      </div>
    );
  }

  const sortedEntries = [...entries]
    .filter(e => (!startDate || e.date >= startDate) && (!endDate || e.date <= endDate))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (sortedEntries.length < 2) {
    return (
      <div className="space-y-6">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-white">Statistics</h1>
          <div className="flex items-center gap-2">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-[#1C1C1E] border border-[#242426] text-white rounded-xl px-3 py-1.5 text-sm outline-none focus:border-teal-500 transition-colors [&::-webkit-calendar-picker-indicator]:invert" />
            <span className="text-gray-500">-</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-[#1C1C1E] border border-[#242426] text-white rounded-xl px-3 py-1.5 text-sm outline-none focus:border-teal-500 transition-colors [&::-webkit-calendar-picker-indicator]:invert" />
          </div>
        </header>
        <div className="bg-[#161618] rounded-2xl p-8 text-center border border-[#242426]">
          <p className="text-gray-500">Not enough data in this date range to display statistics.</p>
        </div>
      </div>
    );
  }

  const firstEntry = sortedEntries[0];
  const latestEntry = sortedEntries[sortedEntries.length - 1];

  const totalChangeKg = latestEntry.weightKg - firstEntry.weightKg;
  const daysTracked = Math.max(1, Math.round((new Date(latestEntry.date).getTime() - new Date(firstEntry.date).getTime()) / (1000 * 60 * 60 * 24)));
  
  const weeklyChangeKg = (totalChangeKg / daysTracked) * 7;

  // Group by weeks for bar chart
  const weeklyDataMap = new Map<string, { weekNum: number, start: Date, weights: number[] }>();
  
  sortedEntries.forEach((entry) => {
    const date = parseISO(entry.date);
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const key = format(weekStart, 'yyyy-MM-dd');
    
    if (!weeklyDataMap.has(key)) {
      weeklyDataMap.set(key, { weekNum: weeklyDataMap.size, start: weekStart, weights: [] });
    }
    weeklyDataMap.get(key)!.weights.push(entry.weightKg);
  });

  const weeklyChartData = Array.from(weeklyDataMap.values()).map(week => {
    const avgKg = week.weights.reduce((a, b) => a + b, 0) / week.weights.length;
    return {
      name: format(week.start, 'MMM d'),
      average: settings.unit === 'kg' ? avgKg : avgKg * 2.20462,
    };
  }).slice(-12); // Show up to last 12 weeks

  // Group by months for bar chart
  const monthlyDataMap = new Map<string, { start: Date, weights: number[] }>();
  
  sortedEntries.forEach((entry) => {
    const date = parseISO(entry.date);
    const monthStart = startOfMonth(date);
    const key = format(monthStart, 'yyyy-MM');
    
    if (!monthlyDataMap.has(key)) {
      monthlyDataMap.set(key, { start: monthStart, weights: [] });
    }
    monthlyDataMap.get(key)!.weights.push(entry.weightKg);
  });

  const monthlyChartData = Array.from(monthlyDataMap.values()).map(month => {
    const avgKg = month.weights.reduce((a, b) => a + b, 0) / month.weights.length;
    return {
      name: format(month.start, 'MMM yyyy'),
      average: settings.unit === 'kg' ? avgKg : avgKg * 2.20462,
    };
  }).slice(-12); // Show up to last 12 months

  // Generate data for Goal Progress Line Chart
  const currentGoalWeight = settings.goalWeightKg ? (settings.unit === 'kg' ? settings.goalWeightKg : settings.goalWeightKg * 2.20462) : undefined;
  
  const goalChartData = sortedEntries.map(e => {
    const weight = settings.unit === 'kg' ? e.weightKg : e.weightKg * 2.20462;
    return {
      date: format(new Date(e.date), 'MMM d'),
      Weight: weight,
    };
  });

  // Calculate domain explicitly to ensure goal fits
  const minWeight = Math.min(...goalChartData.map(d => d.Weight));
  const maxWeight = Math.max(...goalChartData.map(d => d.Weight));
  
  const yDomainMin = currentGoalWeight ? Math.min(minWeight, currentGoalWeight) - 2 : 'auto';
  const yDomainMax = currentGoalWeight ? Math.max(maxWeight, currentGoalWeight) + 2 : 'auto';

  return (
    <div className="space-y-6">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-white">Statistics</h1>
        <div className="flex items-center gap-2">
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            className="bg-[#1C1C1E] border border-[#242426] text-white rounded-xl px-3 py-1.5 text-sm outline-none focus:border-teal-500 transition-colors [&::-webkit-calendar-picker-indicator]:invert" 
          />
          <span className="text-gray-500">-</span>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            className="bg-[#1C1C1E] border border-[#242426] text-white rounded-xl px-3 py-1.5 text-sm outline-none focus:border-teal-500 transition-colors [&::-webkit-calendar-picker-indicator]:invert" 
          />
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#161618] border border-[#242426] p-5 rounded-2xl">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-1 font-bold">Total Change</p>
          <p className={`text-2xl font-bold ${totalChangeKg < 0 ? 'text-teal-400' : 'text-red-400'}`}>
            {totalChangeKg > 0 ? '+' : ''}{formatWeight(totalChangeKg, settings.unit)}
          </p>
        </div>
        <div className="bg-[#161618] border border-[#242426] p-5 rounded-2xl">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-1 font-bold">Weekly Trend</p>
          <p className={`text-2xl font-bold ${weeklyChangeKg < 0 ? 'text-teal-400' : 'text-white'}`}>
            {weeklyChangeKg > 0 ? '+' : ''}{formatWeight(weeklyChangeKg, settings.unit, 2)}
          </p>
        </div>
        <div className="bg-[#161618] border border-[#242426] p-5 rounded-2xl">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-1 font-bold">Highest</p>
          <p className="text-2xl font-bold text-white">
            {formatWeight(Math.max(...sortedEntries.map(e => e.weightKg)), settings.unit)}
          </p>
        </div>
        <div className="bg-[#161618] border border-[#242426] p-5 rounded-2xl">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-1 font-bold">Lowest</p>
          <p className="text-2xl font-bold text-white">
            {formatWeight(Math.min(...sortedEntries.map(e => e.weightKg)), settings.unit)}
          </p>
        </div>
      </div>

      <div className="bg-[#161618] border border-[#242426] rounded-3xl p-6 flex flex-col h-72">
        <h3 className="font-semibold text-lg text-white mb-6">Weekly Averages</h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#242426" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 'bold' }} 
                dy={10} 
              />
              <YAxis 
                domain={['dataMin - 2', 'auto']} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 'bold' }} 
                dx={-10}
                tickFormatter={(val) => val.toFixed(0)}
              />
              <Tooltip 
                cursor={{ fill: '#1C1C1E' }}
                contentStyle={{ borderRadius: '12px', border: '1px solid #242426', backgroundColor: '#1C1C1E', color: '#E4E4E6' }}
                itemStyle={{ color: '#14b8a6' }}
                formatter={(value: number) => [`${value.toFixed(1)} ${settings.unit}`, 'Average']}
              />
              <Bar dataKey="average" radius={[4, 4, 0, 0]}>
                {weeklyChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === weeklyChartData.length - 1 ? "#14b8a6" : "rgba(20, 184, 166, 0.4)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {monthlyChartData.length > 0 && (
        <div className="bg-[#161618] border border-[#242426] rounded-3xl p-6 flex flex-col h-72">
          <h3 className="font-semibold text-lg text-white mb-6">Monthly Averages</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#242426" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 'bold' }} 
                  dy={10} 
                />
                <YAxis 
                  domain={['dataMin - 2', 'auto']} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 'bold' }} 
                  dx={-10}
                  tickFormatter={(val) => val.toFixed(0)}
                />
                <Tooltip 
                  cursor={{ fill: '#1C1C1E' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #242426', backgroundColor: '#1C1C1E', color: '#E4E4E6' }}
                  itemStyle={{ color: '#14b8a6' }}
                  formatter={(value: number) => [`${value.toFixed(1)} ${settings.unit}`, 'Average']}
                />
                <Bar dataKey="average" radius={[4, 4, 0, 0]}>
                  {monthlyChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === monthlyChartData.length - 1 ? "#14b8a6" : "rgba(20, 184, 166, 0.4)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="bg-[#161618] border border-[#242426] rounded-3xl p-6 flex flex-col h-72">
        <h3 className="font-semibold text-lg text-white mb-6">Goal Progress</h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={goalChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#242426" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 'bold' }} 
                dy={10} 
              />
              <YAxis 
                domain={[yDomainMin, yDomainMax]} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 'bold' }} 
                dx={-10}
                tickFormatter={(val) => val.toFixed(0)}
              />
              <Tooltip 
                cursor={{ stroke: '#242426', strokeWidth: 1, strokeDasharray: '5 5' }}
                contentStyle={{ borderRadius: '12px', border: '1px solid #242426', backgroundColor: '#1C1C1E', color: '#E4E4E6' }}
                itemStyle={{ fontWeight: 'bold' }}
                formatter={(value: number, name: string) => [`${value.toFixed(1)} ${settings.unit}`, name]}
              />
              <Legend 
                wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', color: '#6B7280', paddingTop: '10px' }} 
                iconType="circle"
              />
              {currentGoalWeight && (
                <ReferenceLine 
                  y={currentGoalWeight} 
                  stroke="#ef4444" 
                  strokeDasharray="4 4" 
                  strokeWidth={2}
                  label={{ position: 'top', value: 'TARGET', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }}
                />
              )}
              <Line 
                type="monotone" 
                dataKey="Weight" 
                stroke="#14b8a6" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 2, stroke: '#14b8a6', fill: '#0F0F10' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
