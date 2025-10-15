
import React, { useState, useCallback, useEffect } from 'react';
import type { Win } from '../types';
import { generateAffirmations } from '../services/geminiService';
import Card from './common/Card';
import Spinner from './common/Spinner';
import { SparklesIcon, QuoteIcon } from './Icons';

interface AffirmationsProps {
  wins: Win[];
}

const Affirmations: React.FC<AffirmationsProps> = ({ wins }) => {
  const [affirmations, setAffirmations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAffirmations = useCallback(async () => {
    setIsLoading(true);
    const winTexts = wins.map(w => w.text).slice(0, 5); // Use recent wins
    const result = await generateAffirmations(winTexts);
    setAffirmations(result);
    setIsLoading(false);
  }, [wins]);

  useEffect(() => {
    fetchAffirmations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Fetch on initial load

  return (
    <Card>
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-full">
            <SparklesIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Your Affirmations</h2>
            <p className="text-slate-500 dark:text-slate-400">Reinforce your competence with personalized truths.</p>
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        <p className="text-slate-600 dark:text-slate-300">
          Based on your achievements, here are some truths to remember. Repeat them to yourself, especially when you feel doubt creeping in.
        </p>
        <button
          onClick={fetchAffirmations}
          disabled={isLoading}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 disabled:bg-sky-400 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800"
        >
          {isLoading ? <><Spinner /> Generating...</> : 'Generate New Affirmations'}
        </button>
      </div>

      <div className="space-y-3">
        {isLoading ? (
            <div className="flex justify-center items-center h-24">
                <Spinner />
            </div>
        ) : (
            affirmations.map((affirmation, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                <QuoteIcon className="w-5 h-5 text-purple-500 dark:text-purple-400 flex-shrink-0 mt-1" />
                <p className="font-medium text-slate-700 dark:text-slate-200">{affirmation}</p>
            </div>
            ))
        )}
      </div>
    </Card>
  );
};

export default Affirmations;
