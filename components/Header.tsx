
import React from 'react';
import { ShieldCheckIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-3">
        <div className="flex items-center gap-3">
            <ShieldCheckIcon className="w-8 h-8 text-sky-500" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                Imposter Syndrome Companion
            </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
