
import React from 'react';
import { SpinResult } from '../types';

interface SpinHistoryProps {
  history: SpinResult[];
}

const SpinHistory: React.FC<SpinHistoryProps> = ({ history }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto mt-12 mb-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
      <h4 className="luxury-text text-sm uppercase tracking-widest text-yellow-500/60 font-bold mb-4 text-center">
        Recent Fortune
      </h4>
      <div className="space-y-2">
        {history.map((result) => (
          <div 
            key={result.id} 
            className="glass-effect border border-white/5 rounded-lg px-4 py-3 flex justify-between items-center transform transition-all hover:bg-white/10"
          >
            <span className="text-white/80 font-medium">{result.prize}</span>
            <span className="text-white/40 text-xs">
              {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpinHistory;
