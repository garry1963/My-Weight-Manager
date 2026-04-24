import { useState, useEffect } from 'react';

export type Unit = 'kg' | 'lbs' | 'st';

export interface WeightEntry {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  weightKg: number;
  note?: string;
  timestamp: number;
}

export interface UserSettings {
  unit: Unit;
  goalWeightKg: number | null;
  heightCm: number | null;
}

const DEFAULT_SETTINGS: UserSettings = {
  unit: 'kg',
  goalWeightKg: null,
  heightCm: null,
};

export function useWeightManager() {
  const [entries, setEntries] = useState<WeightEntry[]>(() => {
    const saved = localStorage.getItem('libra_entries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('libra_settings');
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Save on change
  useEffect(() => {
    localStorage.setItem('libra_entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('libra_settings', JSON.stringify(settings));
  }, [settings]);

  const addEntry = (entry: Omit<WeightEntry, 'id' | 'timestamp'>) => {
    const newEntry: WeightEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    
    setEntries((prev) => {
      // Check if entry for this date already exists, if so update it
      const existingIndex = prev.findIndex(e => e.date === entry.date);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...newEntry };
        return updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }
      return [...prev, newEntry].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return {
    entries,
    settings,
    addEntry,
    deleteEntry,
    updateSettings,
  };
}
