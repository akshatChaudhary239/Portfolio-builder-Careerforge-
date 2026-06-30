'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PortfolioCustomizationState, DEFAULT_CUSTOMIZATION, SectionCustomization } from '@/types/portfolio-customization';

interface LiveEditorContextType {
  isEditorActive: boolean;
  setIsEditorActive: (active: boolean) => void;
  activeEditingSection: string | null;
  setActiveEditingSection: (section: string | null) => void;
  customization: PortfolioCustomizationState;
  updateSectionCustomization: (sectionKey: string, updates: Partial<SectionCustomization>) => void;
  updateRootCustomization: (updates: Partial<PortfolioCustomizationState>) => void;
  updateItemOverride: (sectionKey: string, itemId: string, propKey: string, value: any) => void;
  reorderSections: (newOrder: string[]) => void;
  toggleSectionVisibility: (sectionKey: string) => void;
  resetToDefault: () => void;
}

const LiveEditorContext = createContext<LiveEditorContextType | undefined>(undefined);

export function LiveEditorProvider({ 
  children, 
  initialCustomization,
  isEditorActive: initialIsEditorActive
}: { 
  children: React.ReactNode; 
  initialCustomization?: Partial<PortfolioCustomizationState>;
  isEditorActive?: boolean;
}) {
  const [isEditorActive, setIsEditorActive] = useState<boolean>(initialIsEditorActive !== false);
  const [activeEditingSection, setActiveEditingSection] = useState<string | null>(null);
  const [customization, setCustomization] = useState<PortfolioCustomizationState>(() => ({
    ...DEFAULT_CUSTOMIZATION,
    ...initialCustomization,
    sections: {
      ...DEFAULT_CUSTOMIZATION.sections,
      ...(initialCustomization?.sections || {})
    }
  }));

  const updateSectionCustomization = (sectionKey: string, updates: Partial<SectionCustomization>) => {
    setCustomization(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: {
          ...(prev.sections[sectionKey] || { visible: true }),
          ...updates
        }
      }
    }));
  };

  const updateRootCustomization = (updates: Partial<PortfolioCustomizationState>) => {
    setCustomization(prev => ({
      ...prev,
      ...updates
    }));
  };

  const updateItemOverride = (sectionKey: string, itemId: string, propKey: string, value: any) => {
    setCustomization(prev => {
      const currentSec = prev.sections[sectionKey] || { visible: true };
      const currentOverrides = currentSec.itemOverrides || {};
      const currentItemProps = currentOverrides[itemId] || {};

      return {
        ...prev,
        sections: {
          ...prev.sections,
          [sectionKey]: {
            ...currentSec,
            itemOverrides: {
              ...currentOverrides,
              [itemId]: {
                ...currentItemProps,
                [propKey]: value
              }
            }
          }
        }
      };
    });
  };

  const reorderSections = (newOrder: string[]) => {
    setCustomization(prev => ({
      ...prev,
      sectionOrder: newOrder
    }));
  };

  const toggleSectionVisibility = (sectionKey: string) => {
    setCustomization(prev => {
      const current = prev.sections[sectionKey] || { visible: true };
      return {
        ...prev,
        sections: {
          ...prev.sections,
          [sectionKey]: {
            ...current,
            visible: !current.visible
          }
        }
      };
    });
  };

  const resetToDefault = () => {
    setCustomization(DEFAULT_CUSTOMIZATION);
  };

  return (
    <LiveEditorContext.Provider
      value={{
        isEditorActive,
        setIsEditorActive,
        activeEditingSection,
        setActiveEditingSection,
        customization,
        updateSectionCustomization,
        updateRootCustomization,
        updateItemOverride,
        reorderSections,
        toggleSectionVisibility,
        resetToDefault
      }}
    >
      {children}
    </LiveEditorContext.Provider>
  );
}

export function useLiveEditor() {
  const context = useContext(LiveEditorContext);
  if (!context) {
    throw new Error('useLiveEditor must be used within a LiveEditorProvider');
  }
  return context;
}

export function usePortfolioLiveConfig(sectionKey?: string) {
  const context = useContext(LiveEditorContext);
  if (!context) {
    return {
      isEditorActive: false,
      visible: true,
      variant: 'variantA',
      customTitle: undefined,
      customSubtitle: undefined,
      customDescription: undefined,
      alignment: 'left',
      itemOverrides: {},
      customization: DEFAULT_CUSTOMIZATION
    };
  }

  const sec = sectionKey ? (context.customization.sections[sectionKey] || { visible: true }) : { visible: true };
  return {
    isEditorActive: context.isEditorActive,
    visible: sec.visible !== false,
    variant: sec.variant || 'variantA',
    customTitle: sec.customTitle,
    customSubtitle: sec.customSubtitle,
    customDescription: sec.customDescription,
    alignment: sec.alignment || 'left',
    itemOverrides: sec.itemOverrides || {},
    customization: context.customization
  };
}
