'use client';

import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function ProfileSyncBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [syncState, setSyncState] = useState<'prompt' | 'synced' | 'dismissed'>('prompt');

  if (!isVisible || syncState === 'dismissed') return null;

  return (
    <div className="mb-6 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-white shadow-lg animate-in fade-in slide-in-from-top-4">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 mt-0.5 md:mt-0">
          <RefreshCw className="w-4 h-4 animate-spin-slow" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white flex items-center gap-2">
            <span>Career Profile Updated</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono">Sync System</span>
          </h4>
          <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
            Your Career Profile contains fresh discovery updates. Would you like to sync new data while preserving your custom visual edits?
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        {syncState === 'synced' ? (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Profile Synced!</span>
          </div>
        ) : (
          <>
            <button
              onClick={() => setSyncState('synced')}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold tracking-wide transition-colors cursor-pointer shadow-md shadow-indigo-600/30"
            >
              Sync Everything
            </button>
            <button
              onClick={() => setSyncState('dismissed')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
            >
              Keep Portfolio Version
            </button>
          </>
        )}
        <button
          onClick={() => setIsVisible(false)}
          className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer ml-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
