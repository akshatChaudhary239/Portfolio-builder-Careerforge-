'use client';

import React from 'react';
import { useLiveEditor } from './LiveEditorContext';
import { Edit3, Eye, EyeOff, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';

interface SectionEditOverlayProps {
  sectionKey: string;
  sectionTitle: string;
  children: React.ReactNode;
}

export default function SectionEditOverlay({ sectionKey, sectionTitle, children }: SectionEditOverlayProps) {
  const { 
    isEditorActive, 
    activeEditingSection, 
    setActiveEditingSection,
    customization,
    toggleSectionVisibility,
    reorderSections
  } = useLiveEditor();

  if (!isEditorActive) {
    return <>{children}</>;
  }

  const isEditing = activeEditingSection === sectionKey;
  const isVisible = customization.sections[sectionKey]?.visible !== false;

  const handleMove = (direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    const currentOrder = [...customization.sectionOrder];
    const idx = currentOrder.indexOf(sectionKey);
    if (idx === -1) return;

    if (direction === 'up' && idx > 0) {
      const temp = currentOrder[idx];
      currentOrder[idx] = currentOrder[idx - 1];
      currentOrder[idx - 1] = temp;
      reorderSections(currentOrder);
    } else if (direction === 'down' && idx < currentOrder.length - 1) {
      const temp = currentOrder[idx];
      currentOrder[idx] = currentOrder[idx + 1];
      currentOrder[idx + 1] = temp;
      reorderSections(currentOrder);
    }
  };

  return (
    <div 
      className={`relative group transition-all duration-300 rounded-2xl ${
        isEditing 
          ? 'ring-2 ring-indigo-500 ring-offset-4 ring-offset-background bg-indigo-500/5' 
          : 'hover:ring-1 hover:ring-indigo-400/50'
      } ${!isVisible ? 'opacity-40 grayscale' : ''}`}
    >
      {/* Floating Section Action Bar */}
      <div className="absolute top-3 right-4 z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-xl text-white">
        <button
          onClick={() => setActiveEditingSection(sectionKey)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold tracking-wide transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Edit {sectionTitle}</span>
        </button>

        <div className="w-[1px] h-4 bg-white/20 mx-0.5" />

        <button
          onClick={(e) => { e.stopPropagation(); toggleSectionVisibility(sectionKey); }}
          title={isVisible ? "Hide section" : "Show section"}
          className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-rose-400" />}
        </button>

        <button
          onClick={(e) => handleMove('up', e)}
          title="Move Up"
          className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={(e) => handleMove('down', e)}
          title="Move Down"
          className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {children}
    </div>
  );
}
