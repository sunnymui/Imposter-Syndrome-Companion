
import React, { useState, useCallback } from 'react';
import type { Win } from '../types';
import Card from './common/Card';
import Spinner from './common/Spinner';
import { celebrateWin } from '../services/geminiService';
import { TrophyIcon, SparklesIcon } from './Icons';

interface LogWinsProps {
  wins: Win[];
  addWin: (win: Win) => void;
}

const LogWins: React.FC<LogWinsProps> = ({ wins, addWin }) => {
  const [newWinText, setNewWinText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastReflection, setLastReflection] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWinText.trim()) {
      setError('Please describe your achievement.');
      return;
    }
    setError('');
    setIsLoading(true);
    setLastReflection(null);

    const reflection = await celebrateWin(newWinText);
    
    const newWin: Win = {
      id: new Date().toISOString(),
      text: newWinText,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      reflection: reflection,
    };
    
    addWin(newWin);
    setNewWinText('');
    setLastReflection(reflection);
    setIsLoading(false);
  }, [newWinText, addWin]);

  return (
    <Card>
       <div className="flex items-center gap-4 mb-4">
        <div className="bg-amber-100 dark:bg-amber-900/50 p-3 rounded-full">
            <TrophyIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Log Your Wins</h2>
            <p className="text-slate-500 dark:text-slate-400">Create a concrete record of your accomplishments.</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <p className="text-slate-600 dark:text-slate-300">
          No win is too small! Did you solve a tricky bug, get positive feedback, or finish a difficult task? Write it down.
        </p>
        <input
          type="text"
          value={newWinText}
          onChange={(e) => setNewWinText(e.target.value)}
          placeholder="e.g., I successfully led a team meeting today."
          className="w-full p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
          disabled={isLoading}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 disabled:bg-sky-400 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800"
        >
          {isLoading ? <><Spinner /> Celebrating...</> : 'Log This Win'}
        </button>
      </form>

      {lastReflection && (
          <div className="p-4 mb-6 bg-green-50 border border-green-200 dark:bg-green-900/50 dark:border-green-800 rounded-lg transition-all duration-300 ease-in-out">
              <div className="flex items-start gap-3">
                  <SparklesIcon className="w-5 h-5 text-green-500 dark:text-green-400 mt-1 flex-shrink-0"/>
                  <div>
                      <h3 className="font-semibold text-green-800 dark:text-green-200">Great Job!</h3>
                      <p className="text-green-700 dark:text-green-300">{lastReflection}</p>
                  </div>
              </div>
          </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">Your Achievement Log</h3>
        {wins.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-4">Your logged wins will appear here. Let's start building your evidence file!</p>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-700">
            {wins.map(win => (
              <li key={win.id} className="py-4">
                <p className="font-semibold text-slate-800 dark:text-slate-100">{win.text}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{win.date}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
};

export default LogWins;
