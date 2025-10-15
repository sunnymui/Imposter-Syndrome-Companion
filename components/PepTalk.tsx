
import React, { useState, useCallback, useEffect } from 'react';
import { getQuickPepTalk } from '../services/geminiService';
import Card from './common/Card';
import Spinner from './common/Spinner';
import { ZapIcon } from './Icons';

const PepTalk: React.FC = () => {
  const [pepTalk, setPepTalk] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchPepTalk = useCallback(async () => {
    setIsLoading(true);
    setPepTalk('');
    try {
      const talk = await getQuickPepTalk();
      setPepTalk(talk);
    } catch (error) {
      console.error("Failed to get pep talk:", error);
      setPepTalk("You are capable of amazing things. Keep going!");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPepTalk();
  }, [fetchPepTalk]);

  return (
    <Card>
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-rose-100 dark:bg-rose-900/50 p-3 rounded-full">
          <ZapIcon className="w-6 h-6 text-rose-600 dark:text-rose-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">SOS Pep Talk</h2>
          <p className="text-slate-500 dark:text-slate-400">A quick shot of confidence when you need it most.</p>
        </div>
      </div>
      
      <div className="space-y-4 text-center">
        <p className="text-slate-600 dark:text-slate-300">
          Feeling a wave of self-doubt? Click the button for a quick reminder of your capabilities.
        </p>
        
        <div className="my-6 flex justify-center items-center min-h-[8rem] p-6 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
          {isLoading ? (
            <Spinner />
          ) : (
            <p className="text-2xl font-semibold text-slate-700 dark:text-slate-200 italic">
              "{pepTalk}"
            </p>
          )}
        </div>
        
        <button
          onClick={fetchPepTalk}
          disabled={isLoading}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 disabled:bg-sky-400 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800"
        >
          {isLoading ? <><Spinner /> Getting one...</> : 'Give Me Another!'}
        </button>
      </div>
    </Card>
  );
};

export default PepTalk;
