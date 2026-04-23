import React, { useState } from 'react';
import { LineChart as LineChartIcon, List, Settings as SettingsIcon, Activity, HelpCircle } from 'lucide-react';
import { useWeightManager } from './store';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Statistics from './components/Statistics';
import Settings from './components/Settings';
import Help from './components/Help';
import { cn } from './lib/utils';

type Tab = 'dashboard' | 'history' | 'stats' | 'settings' | 'help';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const store = useWeightManager();

  return (
    <div className="flex flex-col h-screen bg-[#0F0F10] text-[#E4E4E6] font-sans">
      <main className="flex-1 overflow-y-auto pb-20 pt-4 px-4 sm:px-6 md:px-8 max-w-2xl mx-auto w-full">
        {activeTab === 'dashboard' && <Dashboard store={store} onNavigate={setActiveTab} />}
        {activeTab === 'history' && <History store={store} />}
        {activeTab === 'stats' && <Statistics store={store} />}
        {activeTab === 'settings' && <Settings store={store} />}
        {activeTab === 'help' && <Help />}
      </main>

      <nav className="fixed bottom-0 w-full bg-[#161618] border-t border-[#242426] z-10 pb-env-safe">
        <div className="flex justify-around items-center h-16 max-w-2xl mx-auto px-4">
          <NavItem
            icon={<Activity />}
            label="Dashboard"
            isActive={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
          />
          <NavItem
            icon={<List />}
            label="History"
            isActive={activeTab === 'history'}
            onClick={() => setActiveTab('history')}
          />
          <NavItem
            icon={<LineChartIcon />}
            label="Statistics"
            isActive={activeTab === 'stats'}
            onClick={() => setActiveTab('stats')}
          />
          <NavItem
            icon={<SettingsIcon />}
            label="Settings"
            isActive={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
          />
          <NavItem
            icon={<HelpCircle />}
            label="Help"
            isActive={activeTab === 'help'}
            onClick={() => setActiveTab('help')}
          />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors cursor-pointer",
        isActive ? "text-teal-400" : "text-gray-500 hover:text-gray-300"
      )}
    >
      <div className={cn("p-1.5 rounded-xl", isActive && "bg-teal-500/10")}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}
