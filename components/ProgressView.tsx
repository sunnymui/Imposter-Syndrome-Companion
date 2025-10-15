import React, { useMemo, useState, useCallback } from 'react';
import type { Win } from '../types';
import Card from './common/Card';
import { ChartBarIcon } from './Icons';
import { analyzeProgress } from '../services/geminiService';
import Spinner from './common/Spinner';

interface ProgressViewProps {
  wins: Win[];
}

// Helper to get the start of the week (Sunday) for a given date
const getWeekStartDate = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay(); // Sunday = 0
  const diff = d.getDate() - day;
  const targetDate = new Date(d.setDate(diff));
  targetDate.setHours(0, 0, 0, 0); // Normalize to midnight
  return targetDate;
};

const ProgressView: React.FC<ProgressViewProps> = ({ wins }) => {
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const chartData = useMemo(() => {
    if (wins.length === 0) return [];

    const weeklyWins = wins.reduce((acc: { [key: string]: number }, win) => {
      const winDate = new Date(win.date);
      if (isNaN(winDate.getTime())) return acc;

      const weekStartDate = getWeekStartDate(winDate);
      const weekKey = weekStartDate.toISOString().split('T')[0]; // YYYY-MM-DD

      acc[weekKey] = (acc[weekKey] || 0) + 1;
      return acc;
    }, {});

    const sortedWeekKeys = Object.keys(weeklyWins).sort();
    if (sortedWeekKeys.length === 0) return [];

    const lastWinWeekStart = getWeekStartDate(new Date(sortedWeekKeys[sortedWeekKeys.length - 1]));
    const dataPoints: { label: string; count: number; fullDate: string }[] = [];

    // Display the last 12 weeks, ending with the most recent week that has a win
    for (let i = 11; i >= 0; i--) {
      const date = new Date(lastWinWeekStart);
      date.setDate(date.getDate() - i * 7);
      const weekStart = getWeekStartDate(date);

      const weekKey = weekStart.toISOString().split('T')[0];
      const count = weeklyWins[weekKey] || 0;
      const label = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      dataPoints.push({ label, count, fullDate: weekKey });
    }

    return dataPoints;
  }, [wins]);
  
  const maxCount = useMemo(() => {
    if (!chartData || chartData.length === 0) return 1;
    const max = Math.max(...chartData.map(d => d.count));
    return max > 0 ? max : 1; // Avoid division by zero
  }, [chartData]);

  const handleAnalysis = useCallback(async () => {
    if (!chartData || chartData.length === 0) return;
    setIsLoading(true);
    setAnalysis('');
    const analysisResult = await analyzeProgress(chartData.map(({label, count}) => ({label, count})));
    setAnalysis(analysisResult);
    setIsLoading(false);
  }, [chartData]);


  return (
    <Card>
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-teal-100 dark:bg-teal-900/50 p-3 rounded-full">
            <ChartBarIcon className="w-6 h-6 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Your Progress</h2>
            <p className="text-slate-500 dark:text-slate-400">Visualize your journey of acknowledging wins.</p>
        </div>
      </div>
      
      {wins.length < 1 ? (
        <div className="text-center py-10">
          <p className="text-slate-500 dark:text-slate-400">Log your first win to start tracking your progress!</p>
        </div>
      ) : (
        <>
            <div className="mt-8">
                <h3 className="text-lg font-semibold text-center mb-4 text-slate-700 dark:text-slate-200">Wins Logged Per Week</h3>
                <div className="w-full h-64 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg flex items-end justify-around gap-2" aria-label="Weekly wins chart">
                {chartData.map(item => (
                    <div key={item.fullDate} className="relative flex-1 flex flex-col items-center justify-end h-full group" role="presentation">
                        <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-slate-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            {item.count} {item.count === 1 ? 'win' : 'wins'}
                        </div>
                        <div 
                          className="w-full bg-teal-400 dark:bg-teal-500 rounded-t-md transition-all duration-300 group-hover:bg-teal-500 dark:group-hover:bg-teal-400"
                          style={{ height: `${(item.count / maxCount) * 100}%` }}
                          aria-label={`${item.count} wins for the week of ${item.label}`}
                          >
                        </div>
                        <span className="text-xs mt-2 text-slate-500 dark:text-slate-400">{item.label}</span>
                    </div>
                ))}
                </div>
            </div>

            <div className="mt-8 text-center">
                <button
                    onClick={handleAnalysis}
                    disabled={isLoading}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 disabled:bg-sky-400 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800"
                    >
                    {isLoading ? <><Spinner /> Analyzing...</> : 'Get Progress Analysis'}
                </button>
            </div>
            
            {analysis && (
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold mb-2 text-slate-700 dark:text-slate-200">A Quick Reflection:</h3>
                <div className="prose prose-slate dark:prose-invert max-w-none p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                    <p>{analysis}</p>
                </div>
                </div>
            )}
        </>
      )}
    </Card>
  );
};

export default ProgressView;