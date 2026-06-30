import React, { useState, useEffect } from 'react';
import { Sparkles, Check, ChevronRight, ChevronLeft, X, Trophy, FileText, Wand2, Compass, Layers, HelpCircle, ArrowRight, Search } from 'lucide-react';
import { evaluateProfessionalContext, synthesizePCEBullets, resolveRoleOrProjectType, PCEContextResult, ResolutionResult, ItemDiscoveryState } from '@/lib/pce-engine';
import { font_categories, getSuggestedRolesForCategory, getSuggestedProjectsForCategory, searchAllRoles } from '@/lib/role-resolver';

interface GuidedDiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  title: string;
  professionCategory: string;
  currentDescription: string;
  experienceType: 'experience' | 'project';
  onSave: (formattedDescription: string, structuredData: ItemDiscoveryState) => void;
  itemDiscoveryState?: ItemDiscoveryState;
  currentSkills?: { name: string }[];
}

export default function GuidedDiscoveryModal({
  isOpen,
  onClose,
  itemId,
  title: initialTitle,
  professionCategory,
  currentDescription,
  experienceType,
  onSave,
  itemDiscoveryState,
  currentSkills = []
}: GuidedDiscoveryModalProps) {
  const [activeTitle, setActiveTitle] = useState<string>(initialTitle || '');
  const [resolution, setResolution] = useState<ResolutionResult | null>(null);
  const [contextResult, setContextResult] = useState<PCEContextResult | null>(null);
  const [stepIndex, setStepIndex] = useState<number>(0);
  
  // Clarification state
  const [roleSearchQuery, setRoleSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>(professionCategory || 'developer');
  
  // Structured selections
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [followUpSelections, setFollowUpSelections] = useState<Record<string, string[]>>({});
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setActiveTitle(initialTitle || '');
      const res = resolveRoleOrProjectType(initialTitle || '', professionCategory, experienceType);
      setResolution(res);

      if (res.isResolved) {
        const targetCategory = res.resolvedCategory || professionCategory;
        const evaluated = evaluateProfessionalContext(targetCategory, res.resolvedTitle, experienceType, currentSkills);
        setContextResult(evaluated);
      } else {
        setContextResult(null);
      }

      setStepIndex(0);
      if (itemDiscoveryState && itemDiscoveryState.itemId === itemId && itemDiscoveryState.status === 'completed') {
        setSelectedOptions(itemDiscoveryState.selectedOptions || {});
        setFollowUpSelections(itemDiscoveryState.followUpSelections || {});
        setAdditionalNotes(itemDiscoveryState.additionalNotes || '');
      } else {
        setSelectedOptions({});
        setFollowUpSelections({});
        setAdditionalNotes('');
        setRoleSearchQuery('');
      }
    }
  }, [isOpen, itemId, initialTitle, professionCategory, experienceType, itemDiscoveryState, currentSkills]);

  const handleResolveCandidate = (chosenTitle: string) => {
    setActiveTitle(chosenTitle);
    const res = resolveRoleOrProjectType(chosenTitle, professionCategory, experienceType);
    const targetCategory = res.resolvedCategory || professionCategory;
    const evaluated = evaluateProfessionalContext(targetCategory, chosenTitle, experienceType, currentSkills);
    setContextResult(evaluated);
    setResolution({
      isResolved: true,
      resolvedTitle: chosenTitle,
      candidateSuggestions: []
    });
  };

  if (!isOpen) return null;

  const isClarificationPhase = resolution && !resolution.isResolved;
  const currentGroup = contextResult?.groups[stepIndex];
  const totalSteps = contextResult ? contextResult.groups.length + 1 : 1;
  const progressPercent = isClarificationPhase ? 10 : Math.round(((stepIndex + 1) / totalSteps) * 100);

  const handleToggleOption = (groupId: string, option: string) => {
    setSelectedOptions(prev => {
      const current = prev[groupId] || [];
      const exists = current.includes(option);
      const updated = exists ? current.filter(item => item !== option) : [...current, option];
      return { ...prev, [groupId]: updated };
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
    if (!contextResult) return;
    const synthesizedBullets = synthesizePCEBullets(selectedOptions, followUpSelections, additionalNotes, experienceType, contextResult);
    
    let count = 0;
    Object.values(selectedOptions).forEach(arr => count += arr.length);
    Object.values(followUpSelections).forEach(arr => count += arr.length);

    const structuredData: ItemDiscoveryState = {
      itemId,
      status: 'completed',
      resolvedRole: activeTitle,
      context: contextResult,
      selectedOptions,
      followUpSelections,
      additionalNotes,
      generatedBullets: synthesizedBullets,
      insightCount: count,
      completedAt: new Date().toISOString()
    };

    onSave(synthesizedBullets, structuredData);
    onClose();
  };

  const searchResults = searchAllRoles(roleSearchQuery);
  const categorySuggestions = experienceType === 'experience'
    ? getSuggestedRolesForCategory(selectedCategoryFilter)
    : getSuggestedProjectsForCategory(selectedCategoryFilter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-warm-border rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Conversational PCE Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-warm-bg via-white to-warm-bg border-b border-warm-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand/10 text-brand">
              <Compass size={18} />
            </div>
            <div>
              <h3 className="font-bold text-base text-primary">
                {experienceType === 'experience' ? '✨ Tell Us About This Role:' : '✨ Let\'s Explore This Project:'} <span className="text-brand">{activeTitle}</span>
              </h3>
              <div className="flex items-center gap-2 text-xs text-primary-light font-medium mt-0.5">
                <span>{contextResult ? contextResult.title : 'Role Resolver Active'}</span>
                {contextResult?.isCrossFunctional && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                    <Layers size={10} /> Cross-Functional Context
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-primary-light hover:text-primary hover:bg-warm-bg rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-3 pb-1 bg-white border-b border-warm-border/50">
          <div className="flex items-center justify-between text-xs font-semibold text-primary-light mb-1.5">
            <span>{isClarificationPhase ? 'Phase 1: Role Verification' : `Step ${stepIndex + 1} of ${totalSteps}`}</span>
            <span className="text-brand">{progressPercent}% Discovered</span>
          </div>
          <div className="w-full bg-warm-bg h-2 rounded-full overflow-hidden border border-warm-border/40">
            <div
              className="bg-brand h-full transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-6 flex-1 overflow-y-auto space-y-6">

          {/* ROLE & PROJECT TYPE CLARIFICATION SCREEN */}
          {isClarificationPhase && resolution && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                  <HelpCircle size={18} className="text-amber-600" />
                  <span>{experienceType === 'experience' ? 'We couldn\'t understand this role yet.' : 'We couldn\'t identify this project scope.'}</span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed ml-6">
                  {resolution.reason} Help us understand your work so we can accurately personalize your resume and portfolio.
                </p>
              </div>

              {/* Live Role Search Bar */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-primary flex items-center gap-1.5">
                  <Search size={14} className="text-brand" /> Search Standard Role Catalog:
                </label>
                <input
                  type="text"
                  value={roleSearchQuery}
                  onChange={(e) => setRoleSearchQuery(e.target.value)}
                  placeholder="e.g. Software Engineer, Product Manager, Growth Marketer..."
                  className="w-full px-4 py-2.5 bg-warm-bg border border-warm-border rounded-xl text-xs text-primary focus:outline-none focus:border-brand shadow-2xs"
                />
                {searchResults.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {searchResults.map(res => (
                      <button
                        key={res}
                        onClick={() => handleResolveCandidate(res)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-brand/10 border border-brand/30 hover:bg-brand text-brand hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        <span>{res}</span>
                        <ArrowRight size={12} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Select Category Grid */}
              <div className="space-y-3 pt-2 border-t border-warm-border">
                <label className="block text-xs font-bold text-primary">Or Select a Career Category:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {font_categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategoryFilter(cat.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold text-left border transition-all cursor-pointer ${
                        selectedCategoryFilter === cat.id
                          ? 'bg-brand text-white border-brand shadow-xs'
                          : 'bg-warm-bg/60 text-primary border-warm-border hover:bg-brand/5 hover:border-brand/40'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Suggestions */}
              <div className="space-y-2.5 pt-2 border-t border-warm-border">
                <label className="block text-xs font-bold text-primary">
                  {experienceType === 'experience' ? 'Matching Roles in Selected Category:' : 'Matching Project Types in Selected Category:'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {categorySuggestions.map(cand => (
                    <button
                      key={cand}
                      onClick={() => handleResolveCandidate(cand)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-warm-border hover:border-brand hover:bg-brand/5 text-primary text-xs font-semibold shadow-2xs transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      <span>{cand}</span>
                      <ArrowRight size={13} className="text-brand" />
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* DISCOVERY QUESTION STEPS */}
          {!isClarificationPhase && contextResult && stepIndex < contextResult.groups.length && currentGroup && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand text-white text-[11px]">
                    {stepIndex + 1}
                  </span>
                  {currentGroup.question}
                </h4>
                <p className="text-xs text-primary-light mt-0.5 ml-7">
                  {currentGroup.subtitle}
                </p>
              </div>

              {/* Selectable Chips */}
              <div className="flex flex-wrap gap-2 pt-1 ml-7">
                {currentGroup.options.map(opt => {
                  const isSelected = (selectedOptions[currentGroup.id] || []).includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => handleToggleOption(currentGroup.id, opt)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer ${
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

              {/* Progressive Disclosure Follow-ups */}
              {currentGroup.followUps && currentGroup.followUps.map(fu => {
                const triggerSelected = (selectedOptions[currentGroup.id] || []).some(
                  opt => opt.toLowerCase().includes(fu.triggerOption.toLowerCase().split(' ')[0])
                );
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
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
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

          {/* Final Step: Additional Notes & Context */}
          {!isClarificationPhase && contextResult && stepIndex === contextResult.groups.length && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                <FileText size={16} className="text-brand" />
                Additional Highlights & Context
              </h4>
              <p className="text-xs text-primary-light">
                Anything else unique you would like the system to incorporate into your professional profile?
              </p>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="e.g. Led client meetings, presented to executives..."
                className="w-full p-3 bg-warm-bg border border-warm-border rounded-xl text-xs text-primary focus:outline-none focus:border-brand min-h-[90px]"
              />
            </div>
          )}

        </div>

        {/* Controls Footer */}
        <div className="px-6 py-4 bg-warm-bg/40 border-t border-warm-border flex items-center justify-between">
          <button
            onClick={() => {
              if (!isClarificationPhase && stepIndex === 0 && resolution && !resolution.isResolved) {
                setContextResult(null);
              } else {
                setStepIndex(prev => Math.max(0, prev - 1));
              }
            }}
            disabled={isClarificationPhase || stepIndex === 0}
            className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold text-primary border border-warm-border bg-white hover:bg-warm-bg disabled:opacity-40 transition-colors cursor-pointer"
          >
            <ChevronLeft size={14} /> Back
          </button>

          {!isClarificationPhase && contextResult && (
            stepIndex < totalSteps - 1 ? (
              <button
                onClick={() => setStepIndex(prev => Math.min(totalSteps - 1, prev + 1))}
                className="flex items-center gap-1 px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand hover:bg-brand-hover shadow-md transition-all cursor-pointer"
              >
                Next Step <ChevronRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="flex items-center gap-1.5 px-6 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all cursor-pointer"
              >
                <Check size={14} /> Complete Discovery & Generate Profile
              </button>
            )
          )}
        </div>

      </div>
    </div>
  );
}
