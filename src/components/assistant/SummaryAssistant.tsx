import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { detectMissingAtsKeywords } from '@/lib/assistant/recommendation-engine';

import { generateSmartSummary } from '@/lib/assistant/summary-generator';

interface SummaryAssistantProps {
  careerProfile: any; // Using any or CareerProfile to pass full context
  summaryText: string;
  onUpdateSummary: (newSummary: string) => void;
}

export default function SummaryAssistant({ careerProfile, summaryText, onUpdateSummary }: SummaryAssistantProps) {
  const [atsAnalysis, setAtsAnalysis] = useState<{ missing: string[], present: string[] }>({ missing: [], present: [] });
  const [showAtsPanel, setShowAtsPanel] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (careerProfile?.professionCategory) {
      const analysis = detectMissingAtsKeywords(careerProfile.professionCategory, summaryText || '');
      setAtsAnalysis(analysis);
    }
  }, [careerProfile?.professionCategory, summaryText]);

  const handleAutoGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateSmartSummary(careerProfile, summaryText);
      const words = generated.split(' ');
      let currentWordIndex = 0;
      let streamedSummary = '';
      
      // Clear current summary first
      onUpdateSummary('');
      
      const interval = setInterval(() => {
        if (currentWordIndex < words.length) {
          streamedSummary += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex];
          onUpdateSummary(streamedSummary);
          currentWordIndex++;
        } else {
          clearInterval(interval);
          setIsGenerating(false);
        }
      }, 35); // 35ms per word streaming speed (very clean ChatGPT feel)
    }, 1000);
  };

  if (!careerProfile?.professionCategory) return null;

  const hasExistingSummary = summaryText && summaryText.trim().length > 10;

  return (
    <div className="mt-3 space-y-3">
      {/* ATS Panel Toggle */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setShowAtsPanel(!showAtsPanel)}
          className="text-[10px] font-bold uppercase tracking-wider text-brand hover:underline flex items-center gap-1"
          disabled={isGenerating}
        >
          {showAtsPanel ? "Hide ATS Analysis" : "Show ATS Keyword Analysis"}
        </button>

        <button
          onClick={handleAutoGenerate}
          disabled={isGenerating}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              {hasExistingSummary ? 'Enhancing Summary...' : 'Generating Summary...'}
            </>
          ) : (
            <>
              <Sparkles size={14} />
              {hasExistingSummary ? 'Enhance Summary with AI' : 'Auto-Generate Smart Summary'}
            </>
          )}
        </button>
      </div>

      {/* ATS Panel */}
      {showAtsPanel && (
        <div className="p-3 bg-warm-bg border border-warm-border rounded-lg text-xs">
          <div className="mb-2">
            <span className="font-semibold text-primary block mb-1">Present Keywords ({atsAnalysis.present.length})</span>
            <div className="flex flex-wrap gap-1">
              {atsAnalysis.present.length > 0 ? atsAnalysis.present.map(kw => (
                <span key={kw} className="flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded text-[10px]">
                  <CheckCircle2 size={10} /> {kw}
                </span>
              )) : <span className="text-gray-400 italic">None detected</span>}
            </div>
          </div>
          <div>
            <span className="font-semibold text-primary block mb-1">Suggested Keywords ({atsAnalysis.missing.length})</span>
            <div className="flex flex-wrap gap-1">
              {atsAnalysis.missing.length > 0 ? atsAnalysis.missing.map(kw => (
                <span key={kw} className="flex items-center gap-1 bg-orange-50 text-orange-700 border border-orange-200 px-1.5 py-0.5 rounded text-[10px]">
                  <AlertTriangle size={10} /> {kw}
                </span>
              )) : <span className="text-gray-400 italic">All suggested keywords present!</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
