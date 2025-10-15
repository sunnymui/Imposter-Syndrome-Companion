
import React, { useState } from 'react';
import { analyzeImposterThought } from '../services/geminiService';
import Card from './common/Card';
import Spinner from './common/Spinner';
import { BrainCircuitIcon } from './Icons';

const IdentifyFeelings: React.FC = () => {
  const [thought, setThought] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!thought.trim()) {
      setError('Please enter a thought or feeling to analyze.');
      return;
    }
    setError('');
    setIsLoading(true);
    setAnalysis('');
    try {
      const result = await analyzeImposterThought(thought);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to get analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-sky-100 dark:bg-sky-900/50 p-3 rounded-full">
            <BrainCircuitIcon className="w-6 h-6 text-sky-600 dark:text-sky-400" />
        </div>
        <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Reframe Your Thoughts</h2>
            <p className="text-slate-500 dark:text-slate-400">Challenge self-doubt by examining the evidence.</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <p className="text-slate-600 dark:text-slate-300">
          Write down a recent thought that made you feel like an imposter. For example, "I only got this promotion because I was lucky" or "Everyone else knows what they're doing but me."
        </p>
        
        <textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full h-32 p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
          disabled={isLoading}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 disabled:bg-sky-400 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800"
        >
          {isLoading ? <><Spinner /> Analyzing...</> : 'Get a New Perspective'}
        </button>
      </div>

      {analysis && (
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold mb-2 text-slate-700 dark:text-slate-200">A Kinder Perspective:</h3>
          <div className="prose prose-slate dark:prose-invert max-w-none p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg" dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br />') }} />
        </div>
      )}
    </Card>
  );
};

export default IdentifyFeelings;
