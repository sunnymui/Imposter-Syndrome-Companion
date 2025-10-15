import React, { useState, useCallback, useMemo } from 'react';
import type { Win } from './types';
import Header from './components/Header';
import IdentifyFeelings from './components/IdentifyFeelings';
import LogWins from './components/LogWins';
import Affirmations from './components/Affirmations';
import PepTalk from './components/PepTalk';
import ProgressView from './components/ProgressView';
import { BrainCircuitIcon, TrophyIcon, SparklesIcon, ZapIcon, ChartBarIcon, InfoIcon, CloseIcon } from './components/Icons';

type Tab = 'reframe' | 'wins' | 'affirmations' | 'peptalk' | 'progress';

const App: React.FC = () => {
  const [wins, setWins] = useState<Win[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('reframe');
  const [isDisclaimerVisible, setIsDisclaimerVisible] = useState(true);

  const addWin = useCallback((newWin: Win) => {
    setWins(prevWins => [newWin, ...prevWins]);
  }, []);

  const handleDismissDisclaimer = () => {
    setIsDisclaimerVisible(false);
  };

  // Fix: Defined props type for TabButton to ensure it is correctly recognized as a React component, which allows the use of the special 'key' prop in loops.
  type TabButtonProps = { tab: Tab; label: string; icon: React.ReactNode };

  const TabButton = ({ tab, label, icon }: TabButtonProps) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800 ${
        activeTab === tab
          ? 'bg-sky-600 text-white shadow-md'
          : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
  
  const TABS = useMemo(() => [
    { id: 'reframe', label: 'Reframe Thoughts', component: <IdentifyFeelings />, icon: <BrainCircuitIcon className="w-5 h-5" /> },
    { id: 'wins', label: 'Log Your Wins', component: <LogWins wins={wins} addWin={addWin} />, icon: <TrophyIcon className="w-5 h-5" /> },
    { id: 'progress', label: 'View Progress', component: <ProgressView wins={wins} />, icon: <ChartBarIcon className="w-5 h-5" /> },
    { id: 'affirmations', label: 'Affirmations', component: <Affirmations wins={wins} />, icon: <SparklesIcon className="w-5 h-5" /> },
    { id: 'peptalk', label: 'SOS Pep Talk', component: <PepTalk />, icon: <ZapIcon className="w-5 h-5" /> },
  ], [wins, addWin]);

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200">
      {isDisclaimerVisible && (
        <div className="bg-sky-100 dark:bg-sky-900/50 border-b border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-200" role="alert">
          <div className="max-w-4xl mx-auto flex items-center justify-between p-3 gap-4">
            <div className="flex items-center">
              <InfoIcon className="w-5 h-5 mr-3 flex-shrink-0" />
              <p className="text-sm">
                <strong>Disclaimer:</strong> This tool utilizes Google Gemini AI. Please ensure your company's policies permit its use before proceeding.
              </p>
            </div>
            <button onClick={handleDismissDisclaimer} className="p-1 rounded-md hover:bg-sky-200 dark:hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500" aria-label="Dismiss disclaimer">
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      <Header />
      <main className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex space-x-2 sm:space-x-4">
            {TABS.map(tab => (
              <TabButton key={tab.id} tab={tab.id as Tab} label={tab.label} icon={tab.icon} />
            ))}
          </div>
        </div>
        
        <div className="transition-opacity duration-300">
          {TABS.find(tab => tab.id === activeTab)?.component}
        </div>
      </main>
      <footer className="text-center p-4 text-xs text-slate-400 dark:text-slate-500">
        <p>Built to help you see your own brilliance. You've got this.</p>
      </footer>
    </div>
  );
};

export default App;