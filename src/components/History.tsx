import React, { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Trash2 } from 'lucide-react';
import { useWeightManager } from '../store';
import { formatWeight } from '../lib/utils';
import { AddWeightModal } from './AddWeightModal';

export default function History({ store }: { store: ReturnType<typeof useWeightManager> }) {
  const [isAdding, setIsAdding] = useState(false);
  const { entries, settings, deleteEntry } = store;

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">History</h1>
          <p className="text-sm text-gray-500">{entries.length} records</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-1 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <Plus size={16} />
          <span>Add Past Entry</span>
        </button>
      </header>

      {entries.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500">No weight records yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {entries.map((entry) => (
              <li key={entry.id} className="p-4 sm:p-5 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-semibold text-gray-900">{formatWeight(entry.weightKg, settings.unit)}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-sm text-gray-500">{format(new Date(entry.date), 'MMM d, yyyy')}</p>
                    {entry.note && (
                      <>
                        <span className="text-gray-300">â€¢</span>
                        <p className="text-sm text-gray-500 truncate max-w-[120px] sm:max-w-[200px]" title={entry.note}>{entry.note}</p>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this entry?')) {
                      deleteEntry(entry.id);
                    }
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                  aria-label="Delete entry"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isAdding && <AddWeightModal store={store} onClose={() => setIsAdding(false)} />}
    </div>
  );
}
