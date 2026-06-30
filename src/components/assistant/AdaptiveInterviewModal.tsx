import React, { useState, useEffect } from 'react';
import { Sparkles, Check, ChevronRight, ChevronLeft, X, Trophy, FileText, Wand2 } from 'lucide-react';
import { getInterviewConfig, RoleInterviewConfig } from '@/lib/interview-config';

interface AdaptiveInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  professionCategory: string;
  currentDescription: string;
  experienceType: 'experience' | 'project';
  onSave: (formattedDescription: string) => void;
}

export default function AdaptiveInterviewModal({
  isOpen,
  onClose,
  jobTitle,
  professionCategory,
  currentDescription,
  experienceType,
  onSave
}: AdaptiveInterviewModalProps) {
  const [config, setConfig] = useState<RoleInterviewConfig | null>(null);
  const [stepIndex, setStepIndex] = useState<number>(0);
  
  // Structured selections
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [followUpSelections, setFollowUpSelections] = useState<Record<string, string[]>>({});
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [previewText, setPreviewText] = useState<string>('');

  useEffect(() => {
    if (jobTitle && isOpen) {
      const interviewConfig = getInterviewConfig(jobTitle, professionCategory);
      setConfig(interviewConfig);
      setStepIndex(0);
    }
  }, [jobTitle, professionCategory, isOpen]);

  // Re-generate real-time bullet preview whenever selections change
  useEffect(() => {
    if (!config) return;

    const bullets: string[] = [];

    config.categories.forEach(cat => {
      const selected = selectedOptions[cat.id] || [];
      if (selected.length > 0) {
        let text = '';
        if (cat.id === 'features') {
          text = `Engineered core ${experienceType === 'experience' ? 'deliverables' : 'project features'} including ${selected.join(', ')}.`;
        } else if (cat.id === 'technologies') {
          text = `Utilized tech stack: ${selected.join(', ')}.`;
        } else if (cat.id === 'responsibilities') {
          text = `Executed operational duties spanning ${selected.join(', ')}.`;
        } else if (cat.id === 'achievements') {
          text = `Achieved key performance milestones: ${selected.join(', ')}.`;
        } else {
          text = `Completed ${cat.title.toLowerCase()}: ${selected.join(', ')}.`;
        }

        // Check if any follow-ups were selected
        if (cat.followUps) {
          cat.followUps.forEach(fu => {
            const fuSelected = followUpSelections[fu.triggerOption] || [];
            if (fuSelected.length > 0) {
              text += ` specifically leveraging ${fuSelected.join(', ')}.`;
            }
          });
        }

        bullets.push(`• ${text}`);
      }
    });

    if (additionalNotes.trim()) {
      bullets.push(`• ${additionalNotes.trim()}`);
    }

    setPreviewText(bullets.join('\n'));
  }, [selectedOptions, followUpSelections, additionalNotes, config, experienceType]);

  if (!isOpen || !config) return null;

  const currentCategory = config.categories[stepIndex];
  const totalSteps = config.categories.length + 1; // +1 for final notes/review
  const progressPercent = Math.round(((stepIndex + 1) / totalSteps) * 100);

  const handleToggleOption = (categoryId: string, option: string) => {
    setSelectedOptions(prev => {
      const current = prev[categoryId] || [];
      const exists = current.includes(option);
      const updated = exists ? current.filter(item => item !== option) : [...current, option];
      return { ...prev, [categoryId]: updated };
    });
  };

  const handleToggleFollowUp = (triggerOption: string, option: string) => {
    setFollowUpSelections(prev => {
      const current = prev[triggerOption] || [];
      const exists = current.includes(option);
      const updated = exists ? current.filter(item => item !== option) : [...current, option];
      return { ...prev, [triggerOption]: updated };
    });
  };

  const handleFinish = () => {
    const finalContent = previewText.trim() || currentDescription;
    onSave(finalContent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-warm-border rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-warm-bg via-white to-warm-bg border-b border-warm-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand/10 text-brand">
              {experienceType === 'experience' ? <Trophy size={18} /> : <Sparkles size={18} />}
            </div>
            <div>
              <h3 className="font-bold text-base text-primary">
                Adaptive Career Interview: <span className="text-brand">{jobTitle}</span>
              </h3>
              <p className="text-xs text-primary-light font-medium">
                {config.roleName} • Guided Data Collection Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-primary-light hover:text-primary hover:bg-warm-bg rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-3 pb-1 bg-white border-b border-warm-border/50">
          <div className="flex items-center justify-between text-xs font-semibold text-primary-light mb-1.5">
            <span>Step {stepIndex + 1} of {totalSteps}</span>
            <span className="text-brand">{progressPercent}% Complete</span>
          </div>
          <div className="w-full bg-warm-bg h-2 rounded-full overflow-hidden border border-warm-border/40">
            <div
              className="bg-brand h-full transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Modal Body (Single Logical Step) */}
        <div className="px-6 py-5 flex-1 overflow-y-auto space-y-6">
          {stepIndex < config.categories.length && currentCategory && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand text-white text-[11px]">
                    {stepIndex + 1}
                  </span>
                  {currentCategory.title}
                </h4>
                <p className="text-xs text-primary-light mt-0.5 ml-7">
                  {currentCategory.subtitle}
                </p>
              </div>

              {/* Main Selectable Option Chips */}
              <div className="flex flex-wrap gap-2 pt-1 ml-7">
                {currentCategory.options.map(opt => {
                  const isSelected = (selectedOptions[currentCategory.id] || []).includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => handleToggleOption(currentCategory.id, opt)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs ${
                        isSelected
                          ? 'bg-brand text-white border border-brand scale-[1.02]'
                          : 'bg-warm-bg/70 text-primary border border-warm-border hover:border-brand/40 hover:bg-brand/5'
                      }`}
                    >
                      {isSelected && <Check size={13} />}
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Progressive Disclosure: Follow-up Questions */}
              {currentCategory.followUps && currentCategory.followUps.map(fu => {
                const triggerSelected = (selectedOptions[currentCategory.id] || []).includes(fu.triggerOption);
                if (!triggerSelected) return null;

                return (
                  <div key={fu.triggerOption} className="ml-7 mt-4 p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                      <Wand2 size={13} className="text-indigo-600" />
                      Follow-up: {fu.question}
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {fu.options.map(fuOpt => {
                        const fuIsSelected = (followUpSelections[fu.triggerOption] || []).includes(fuOpt);
                        return (
                          <button
                            key={fuOpt}
                            onClick={() => handleToggleFollowUp(fu.triggerOption, fuOpt)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                              fuIsSelected
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-white text-indigo-900 border border-indigo-200 hover:bg-indigo-100/50'
                            }`}
                          >
                            {fuIsSelected && <Check size={11} />}
                            <span>{fuOpt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Final Step: Additional Notes & Manual Text */}
          {stepIndex === config.categories.length && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                <FileText size={16} className="text-brand" />
                Additional Experience Notes & Context
              </h4>
              <p className="text-xs text-primary-light">
                Anything else specific you would like recruiters or hiring managers to know?
              </p>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="e.g. Led client meetings, mentored junior developers..."
                className="w-full p-3 bg-warm-bg border border-warm-border rounded-xl text-xs text-primary focus:outline-none focus:border-brand min-h-[90px]"
              />
            </div>
          )}

          {/* Real-Time Generated Bullet Points Preview */}
          <div className="mt-6 pt-4 border-t border-warm-border space-y-2">
            <span className="text-[11px] font-bold text-primary-light uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={12} className="text-amber-500" /> Real-Time Generated Resume Bullets
            </span>
            <div className="p-3 bg-warm-bg/60 border border-warm-border rounded-xl text-xs text-primary font-serif italic leading-relaxed min-h-[60px]">
              {previewText ? (
                <pre className="whitespace-pre-wrap font-serif text-xs leading-relaxed text-primary">{previewText}</pre>
              ) : (
                <span className="text-primary-light font-sans not-italic text-[11px]">Select options above to see real-time generated bullet points...</span>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-warm-bg/40 border-t border-warm-border flex items-center justify-between">
          <button
            onClick={() => setStepIndex(prev => Math.max(0, prev - 1))}
            disabled={stepIndex === 0}
            className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold text-primary border border-warm-border bg-white hover:bg-warm-bg disabled:opacity-40 transition-colors"
          >
            <ChevronLeft size={14} /> Back
          </button>

          {stepIndex < totalSteps - 1 ? (
            <button
              onClick={() => setStepIndex(prev => Math.min(totalSteps - 1, prev + 1))}
              className="flex items-center gap-1 px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand hover:bg-brand-hover shadow-md transition-all"
            >
              Next Step <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-6 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all"
            >
              <Check size={14} /> Complete & Save to Profile
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
