import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, HelpCircle, Check, X, ArrowRight, CornerDownRight, Zap } from 'lucide-react';
import { rankSuggestions, detectRoleConfig, substituteTemplates, enhanceDescription, RankedSuggestion } from '@/lib/career-engine';

interface KnowledgeAssistantProps {
  jobTitle: string;
  professionCategory: string;
  currentSkills: { name: string }[];
  currentDescription: string;
  experienceType: 'experience' | 'project';
  onUpdateDescription: (newDescription: string) => void;
}

export default function KnowledgeAssistant({
  jobTitle,
  professionCategory,
  currentSkills,
  currentDescription,
  experienceType,
  onUpdateDescription
}: KnowledgeAssistantProps) {
  // Experience Isolation states (local to this card)
  const [rejectedTopics, setRejectedTopics] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<RankedSuggestion[]>([]);
  
  // Guided Builder / Enhancer States
  const [mode, setMode] = useState<'idle' | 'guided' | 'preview' | 'enhance_preview'>('idle');
  const [activeSuggestion, setActiveSuggestion] = useState<RankedSuggestion | null>(null);
  const [guidedInputs, setGuidedInputs] = useState<Record<string, string>>({});
  const [generatedBullet, setGeneratedBullet] = useState<string>('');
  const [enhancedTextPreview, setEnhancedTextPreview] = useState<string>('');
  const [isPreviewEditing, setIsPreviewEditing] = useState<boolean>(false);

  // Hash values to trigger recalculations cleanly
  const skillsHash = JSON.stringify(currentSkills);

  useEffect(() => {
    if (jobTitle && jobTitle.trim().length >= 3) {
      const ranked = rankSuggestions({
        jobTitle,
        professionCategory,
        currentSkills,
        currentDescription,
        experienceType,
        rejectedTopics
      });
      setSuggestions(ranked);
    } else {
      setSuggestions([]);
    }
  }, [jobTitle, professionCategory, skillsHash, currentDescription, rejectedTopics, experienceType]);

  // Hide suggestions entirely if no relevant job/project title is filled in
  if (!jobTitle || jobTitle.trim().length < 3) {
    return null;
  }

  const roleConfig = detectRoleConfig(jobTitle, professionCategory);

  // -- SUGGESTION CARD HANDLERS --
  const handleReject = (topic: string) => {
    // Suppress semantic topic (Deduplication)
    setRejectedTopics(prev => [...prev, topic]);
  };

  const handleAccept = (suggestion: RankedSuggestion) => {
    setActiveSuggestion(suggestion);
    
    // Clear inputs and populate appropriate questions for guided step
    const questions = roleConfig.followUpQuestions[suggestion.topic] || [
      "What exactly did you develop or execute?",
      "What specific tools or libraries were used?",
      "What was the measurable improvement or business metric?"
    ];
    
    const initialInputs: Record<string, string> = {};
    questions.forEach(q => {
      initialInputs[q] = '';
    });
    setGuidedInputs(initialInputs);
    setMode('guided');
  };

  // -- GUIDED BUILDER HANDLERS --
  const handleInputChange = (question: string, value: string) => {
    setGuidedInputs(prev => ({
      ...prev,
      [question]: value
    }));
  };

  const handleGenerateBullet = () => {
    if (!activeSuggestion) return;

    // Substitute template placeholders first
    const basePoint = substituteTemplates(activeSuggestion.upgradedPoint, currentSkills, roleConfig);
    
    // Merge user answers into a clean, cohesive ATS bullet point
    const answers = Object.entries(guidedInputs)
      .map(([q, val]) => val.trim())
      .filter(Boolean);

    let finalBullet = basePoint;
    if (answers.length > 0) {
      const joinedAnswers = answers.join(', leveraging ');
      if (finalBullet.endsWith('.')) {
        finalBullet = finalBullet.slice(0, -1);
      }
      finalBullet = `${finalBullet}, specifically ${joinedAnswers}.`;
    }

    setGeneratedBullet(finalBullet);
    setMode('preview');
  };

  // -- ONE-CLICK ATS ENHANCER --
  const handleTriggerEnhancer = () => {
    const upgraded = enhanceDescription(currentDescription, roleConfig, experienceType);
    setEnhancedTextPreview(upgraded);
    setMode('enhance_preview');
  };

  const handleApplyEnhancer = () => {
    onUpdateDescription(enhancedTextPreview);
    setMode('idle');
    setEnhancedTextPreview('');
    setIsPreviewEditing(false);
  };

  // -- PREVIEW ACTION HANDLERS --
  const handleInsertBullet = () => {
    const cleanBullet = generatedBullet.trim();
    if (!cleanBullet) return;

    const prefix = cleanBullet.startsWith('•') ? '' : '• ';
    const formatted = `${prefix}${cleanBullet}`;

    const updatedDesc = currentDescription.trim()
      ? `${currentDescription}\n${formatted}`
      : formatted;

    onUpdateDescription(updatedDesc);
    
    // Clean up states and return to idle suggestions
    setMode('idle');
    setActiveSuggestion(null);
    setGuidedInputs({});
    setGeneratedBullet('');
    setIsPreviewEditing(false);
  };

  const handleCancel = () => {
    setMode('idle');
    setActiveSuggestion(null);
    setGuidedInputs({});
    setGeneratedBullet('');
    setEnhancedTextPreview('');
    setIsPreviewEditing(false);
  };

  // -- RENDER MODES --
  return (
    <div className="mt-4 pt-3 border-t border-warm-border">
      {mode === 'idle' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-semibold text-primary-light uppercase tracking-wider flex items-center gap-1.5">
              {experienceType === 'experience' ? (
                <Trophy size={11} className="text-amber-500" />
              ) : (
                <Sparkles size={11} className="text-teal-500" />
              )}
              {experienceType === 'experience' ? 'Work Experience Suggestions' : 'Project & Campaign Suggestions'} ({roleConfig.role})
            </span>

            {/* Premium One-Click ATS Enhancer trigger */}
            <button
              onClick={handleTriggerEnhancer}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-brand text-white font-bold text-[9px] hover:shadow transition-all"
            >
              <Zap size={9} /> One-Click ATS Enhancer
            </button>
          </div>
          
          {suggestions.length === 0 ? (
            <p className="text-[10px] text-primary-light italic">Type details above to populate targeted suggestions.</p>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {suggestions.slice(0, 3).map((item) => (
                <div
                  key={item.topic}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-warm-border hover:border-brand/35 transition-all text-xs"
                >
                  <div className="flex items-start gap-2 max-w-[70%]">
                    <HelpCircle size={13} className="shrink-0 mt-0.5 text-brand" />
                    <div>
                      <span className="text-primary font-medium">{item.question}</span>
                      {item.isFollowUp && (
                        <span className="block text-[9px] text-brand/85 italic mt-0.5">
                          Follow-up to expand existing details
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleAccept(item)}
                      className="flex items-center gap-0.5 px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-[10px] transition-colors"
                    >
                      <Check size={11} /> YES
                    </button>
                    <button
                      onClick={() => handleReject(item.topic)}
                      className="flex items-center gap-0.5 px-2.5 py-1 rounded-md bg-warm-bg hover:bg-red-50 hover:text-red-600 text-primary-light font-semibold text-[10px] transition-colors"
                    >
                      <X size={11} /> NO
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {mode === 'guided' && activeSuggestion && (
        <div className="p-3 bg-indigo-50/40 border border-indigo-100 rounded-lg space-y-3">
          <div className="flex items-center justify-between border-b border-indigo-100 pb-1.5">
            <span className="text-[10px] font-semibold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={11} className="text-indigo-600" />
              Guided Achievement Builder
            </span>
            <button onClick={handleCancel} className="text-[9px] font-bold text-primary-light hover:text-primary">
              Cancel
            </button>
          </div>

          <p className="text-[10px] text-primary-light italic leading-normal">
            Topic: "{activeSuggestion.topic}" — Upgrade details below:
          </p>

          <div className="space-y-3">
            {Object.keys(guidedInputs).map((q) => (
              <div key={q} className="space-y-1">
                <label className="block text-[9.5px] font-medium text-primary">{q}</label>
                <div className="flex items-center gap-2">
                  <CornerDownRight size={10} className="text-indigo-400 shrink-0" />
                  <input
                    type="text"
                    value={guidedInputs[q]}
                    onChange={(e) => handleInputChange(q, e.target.value)}
                    placeholder="Type details..."
                    className="w-full px-2.5 py-1 rounded bg-white border border-warm-border text-xs text-primary focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-1.5 pt-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1 rounded-md text-[10px] font-semibold border border-warm-border text-primary hover:bg-warm-bg transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleGenerateBullet}
              className="px-3.5 py-1 rounded-md text-[10px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm flex items-center gap-1 transition-colors"
            >
              Generate Bullet <ArrowRight size={10} />
            </button>
          </div>
        </div>
      )}

      {mode === 'preview' && (
        <div className="p-3 bg-emerald-50/40 border border-emerald-100 rounded-lg space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-1.5">
            <span className="text-[10px] font-semibold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <Check size={11} className="text-emerald-600" />
              Bullet Point Preview
            </span>
            <button onClick={handleCancel} className="text-[9px] font-bold text-primary-light hover:text-primary">
              Discard
            </button>
          </div>

          <div className="bg-white border border-emerald-100 rounded p-2.5 text-xs text-primary font-serif italic leading-relaxed shadow-sm">
            {isPreviewEditing ? (
              <textarea
                value={generatedBullet}
                onChange={(e) => setGeneratedBullet(e.target.value)}
                className="w-full bg-warm-bg border border-warm-border rounded p-1 text-xs focus:outline-none min-h-[60px]"
              />
            ) : (
              generatedBullet
            )}
          </div>

          <div className="flex justify-end gap-1.5">
            <button
              onClick={() => setIsPreviewEditing(!isPreviewEditing)}
              className="px-3 py-1 rounded-md text-[10px] font-semibold border border-warm-border text-primary hover:bg-warm-bg transition-colors"
            >
              {isPreviewEditing ? 'Done Editing' : 'Edit Manual'}
            </button>
            <button
              onClick={handleInsertBullet}
              className="px-3.5 py-1 rounded-md text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors"
            >
              Insert into Resume
            </button>
          </div>
        </div>
      )}

      {mode === 'enhance_preview' && (
        <div className="p-3 bg-amber-50/40 border border-amber-100 rounded-lg space-y-3">
          <div className="flex items-center justify-between border-b border-amber-100 pb-1.5">
            <span className="text-[10px] font-semibold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <Zap size={11} className="text-amber-600" />
              ATS Enhancement Preview ({experienceType === 'experience' ? 'Job Side' : 'Project Side'})
            </span>
            <button onClick={handleCancel} className="text-[9px] font-bold text-primary-light hover:text-primary">
              Discard
            </button>
          </div>

          <div className="bg-white border border-amber-100 rounded p-2.5 text-xs text-primary font-serif italic leading-relaxed shadow-sm">
            {isPreviewEditing ? (
              <textarea
                value={enhancedTextPreview}
                onChange={(e) => setEnhancedTextPreview(e.target.value)}
                className="w-full bg-warm-bg border border-warm-border rounded p-1 text-xs focus:outline-none min-h-[80px]"
              />
            ) : (
              <pre className="whitespace-pre-wrap font-serif text-xs leading-relaxed">{enhancedTextPreview}</pre>
            )}
          </div>

          <p className="text-[9px] text-amber-800">
            {experienceType === 'experience' 
              ? '✨ Upgraded statements with job-oriented metrics, business impacts, and stakeholder alignments.' 
              : '✨ Upgraded statements with project-oriented tools, architectures, and testing branches.'}
          </p>

          <div className="flex justify-end gap-1.5">
            <button
              onClick={() => setIsPreviewEditing(!isPreviewEditing)}
              className="px-3 py-1 rounded-md text-[10px] font-semibold border border-warm-border text-primary hover:bg-warm-bg transition-colors"
            >
              {isPreviewEditing ? 'Done Editing' : 'Edit Manual'}
            </button>
            <button
              onClick={handleApplyEnhancer}
              className="px-3.5 py-1 rounded-md text-[10px] font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm transition-colors"
            >
              Accept Upgrade
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
