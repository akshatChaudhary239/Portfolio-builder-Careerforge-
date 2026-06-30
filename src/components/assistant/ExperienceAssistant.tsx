import React, { useState, useEffect } from 'react';
import { Sparkles, Wand2, Plus } from 'lucide-react';
import { getResponsibilitiesForJob } from '@/lib/assistant/job-templates';

interface ExperienceAssistantProps {
  jobTitle: string;
  professionCategory: string;
  currentDescription: string;
  onUpdateDescription: (newDescription: string) => void;
}

export default function ExperienceAssistant({ jobTitle, professionCategory, currentDescription, onUpdateDescription }: ExperienceAssistantProps) {
  const [showAssistant, setShowAssistant] = useState(false);
  const [responsibilities, setResponsibilities] = useState<string[]>([]);

  useEffect(() => {
    if (jobTitle && jobTitle.trim().length >= 3) {
      setResponsibilities(getResponsibilitiesForJob(professionCategory, jobTitle));
    }
  }, [jobTitle, professionCategory]);

 
  if (!jobTitle || jobTitle.trim().length < 3) return null;

  const handleAddResponsibility = (resp: string) => {
    const formatted = `• ${resp}`;
    const newDesc = currentDescription.trim() 
      ? `${currentDescription}\n${formatted}`
      : formatted;
      
    onUpdateDescription(newDesc);
  };

  return (
    <div className="mt-2">
      {!showAssistant ? (
        <button 
          onClick={() => setShowAssistant(true)}
          className="text-[10px] font-bold uppercase tracking-wider text-brand hover:underline flex items-center gap-1"
        >
          <Wand2 size={12} />
          Use Smart Job Checklist
        </button>
      ) : (
        <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg mt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold text-indigo-800 uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={10} /> 
              Role Suggestions
            </span>
            <button 
              onClick={() => setShowAssistant(false)}
              className="text-[10px] text-indigo-500 hover:text-indigo-700"
            >
              Close
            </button>
          </div>
          
          <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
            {responsibilities.map((resp, idx) => (
              <button
                key={idx}
                onClick={() => handleAddResponsibility(resp)}
                className="flex items-start text-left gap-1.5 px-2 py-1.5 rounded-md bg-white border border-indigo-100 text-indigo-800 hover:bg-indigo-50 transition-colors text-[10px] font-medium"
              >
                <Plus size={12} className="shrink-0 mt-0.5 text-indigo-500" />
                <span>{resp}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
