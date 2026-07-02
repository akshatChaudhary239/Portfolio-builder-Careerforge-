'use client';

import React, { useState } from 'react';
import { useLiveEditor } from './LiveEditorContext';
import { 
  X, Layout, Type, AlignLeft, AlignCenter, AlignRight, Palette, Layers, Sparkles, 
  ChevronRight, ArrowUp, ArrowDown, Eye, EyeOff, Edit3, Type as FontIcon, Plus, Trash2, Link2 
} from 'lucide-react';
import { THEME_PALETTES, TYPOGRAPHY_PACKS } from '@/types/portfolio-customization';
import { COMPONENT_SCHEMAS } from '@/types/universal-schema';

export default function LiveSidebarEditor({ 
  templateId, 
  careerProfile 
}: { 
  templateId: string;
  careerProfile?: any;
}) {
  const { 
    activeEditingSection, 
    setActiveEditingSection, 
    customization, 
    updateSectionCustomization,
    updateRootCustomization,
    updateItemOverride,
    reorderSections,
    toggleSectionVisibility
  } = useLiveEditor();

  const [activeTab, setActiveTab] = useState<'theme' | 'sections' | 'controls' | 'enhance'>('controls');

  if (!activeEditingSection) return null;

  const sectionKey = activeEditingSection;
  const sectionConfig = customization.sections[sectionKey] || { visible: true };
  const isPremium = ['executive', 'product_builder', 'interactive_showcase', 'product', 'interactive'].includes(templateId);

  // Load Component Schema dynamically
  const schema = COMPONENT_SCHEMAS[sectionKey];

  // Safely retrieve enhancement values
  const globalCustomProps = customization.sections.global?.customProps || {};
  const enhancements = globalCustomProps.enhancements || {
    additionalProjects: [],
    additionalExperience: [],
    externalLinks: {}
  };

  const updateEnhancements = (newEnhancements: any) => {
    updateSectionCustomization('global', {
      customProps: {
        ...globalCustomProps,
        enhancements: newEnhancements
      }
    });
  };

  return (
    <aside className="fixed top-0 right-0 z-50 w-96 h-full bg-slate-950/95 backdrop-blur-2xl border-l border-white/10 text-white shadow-2xl flex flex-col transition-all duration-300 animate-in slide-in-from-right">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl border ${isPremium ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30'}`}>
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>{isPremium ? 'Premium Visual Editor' : 'Base Visual Editor'}</span>
            </h3>
            <p className="text-[11px] text-slate-400 capitalize">{templateId} Engine Components</p>
          </div>
        </div>
        <button
          onClick={() => setActiveEditingSection(null)}
          className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Top Multi-Tab Navigation */}
      <div className="grid grid-cols-4 p-2 bg-slate-900/40 border-b border-white/5 gap-1">
        {[
          { id: 'theme', label: '🎨 Style' },
          { id: 'sections', label: '📑 Arrange' },
          { id: 'controls', label: '✨ Block' },
          { id: 'enhance', label: '➕ Add Content' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 rounded-xl text-[10px] font-semibold transition-all cursor-pointer text-center ${
              activeTab === tab.id
                ? isPremium ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30' : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* TAB 1: THEMES & TYPOGRAPHY */}
        {activeTab === 'theme' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-400" />
                <span>Color Palettes</span>
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {Object.values(THEME_PALETTES).map(palette => {
                  const active = (customization.themeId || 'dev') === palette.id;
                  return (
                    <button
                      key={palette.id}
                      onClick={() => updateRootCustomization({ themeId: palette.id, accentColor: palette.primary })}
                      type="button"
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        active
                          ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500'
                          : 'bg-slate-900/60 border-white/5 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: palette.primary }} />
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: palette.secondary }} />
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: palette.surface }} />
                      </div>
                      <div className="text-xs font-semibold text-white truncate">{palette.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FontIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Typography Packs</span>
              </label>
              <div className="space-y-2">
                {Object.entries(TYPOGRAPHY_PACKS).map(([key, pack]) => {
                  const active = (customization.typographyPack || 'modern') === key;
                  return (
                    <button
                      key={key}
                      onClick={() => updateRootCustomization({ typographyPack: key as any })}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        active
                          ? 'bg-indigo-600/20 border-indigo-500 text-white'
                          : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">{pack.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 font-mono">Headings & Body aligned</div>
                      </div>
                      {active && <Sparkles className="w-4 h-4 text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SECTION MANAGER */}
        {activeTab === 'sections' && (
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isPremium ? 'Premium Section Ordering' : 'Base Section Ordering'}</span>
            </label>
            <div className="space-y-2">
              {customization.sectionOrder.map((secKey, idx) => {
                const isVisible = customization.sections[secKey]?.visible !== false;
                const isFirst = idx === 0;
                const isLast = idx === customization.sectionOrder.length - 1;

                return (
                  <div key={secKey} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => toggleSectionVisibility(secKey)}
                        className="p-1 rounded-lg hover:bg-white/10 text-slate-400 cursor-pointer"
                      >
                        {isVisible ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-rose-400" />}
                      </button>
                      <span className={`text-xs font-bold capitalize ${!isVisible ? 'line-through text-slate-500' : 'text-white'}`}>{secKey}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        disabled={isFirst}
                        onClick={() => {
                          const order = [...customization.sectionOrder];
                          const temp = order[idx]; order[idx] = order[idx-1]; order[idx-1] = temp;
                          reorderSections(order);
                        }}
                        className="p-1 rounded-lg hover:bg-white/10 disabled:opacity-30 text-slate-300 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={isLast}
                        onClick={() => {
                          const order = [...customization.sectionOrder];
                          const temp = order[idx]; order[idx] = order[idx+1]; order[idx+1] = temp;
                          reorderSections(order);
                        }}
                        className="p-1 rounded-lg hover:bg-white/10 disabled:opacity-30 text-slate-300 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => { setActiveEditingSection(secKey); setActiveTab('controls'); }}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 text-[11px] font-semibold hover:bg-indigo-600 hover:text-white transition-colors ml-1 cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: ACTIVE SECTION & SCHEMA CONTROLS */}
        {activeTab === 'controls' && (
          <div className="space-y-6">
            <div className={`p-3 rounded-xl border flex items-center justify-between ${isPremium ? 'bg-amber-500/10 border-amber-500/20' : 'bg-indigo-600/10 border-indigo-500/20'}`}>
              <span className={`text-xs font-bold capitalize ${isPremium ? 'text-amber-300' : 'text-indigo-300'}`}>Editing {sectionKey} ({isPremium ? 'Premium' : 'Base'} Component)</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${isPremium ? 'bg-amber-500/20 text-amber-300' : 'bg-indigo-500/20 text-indigo-300'}`}>{templateId}</span>
            </div>

            {schema ? (
              <div className="space-y-4">
                {schema.fields.map(field => {
                  const value = sectionConfig[field.name as keyof typeof sectionConfig] ?? field.default;

                  return (
                    <div key={field.name} className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">{field.label}</label>
                      {field.type === 'text' && (
                        <input
                          type="text"
                          value={value}
                          onChange={e => updateSectionCustomization(sectionKey, { [field.name]: e.target.value })}
                          className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      )}
                      {field.type === 'textarea' && (
                        <textarea
                          rows={3}
                          value={value}
                          onChange={e => updateSectionCustomization(sectionKey, { [field.name]: e.target.value })}
                          className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                        />
                      )}
                      {field.type === 'select' && (
                        <select
                          value={value}
                          onChange={e => updateSectionCustomization(sectionKey, { [field.name]: e.target.value })}
                          className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        >
                          {field.options?.map(opt => {
                            const val = typeof opt === 'string' ? opt : opt.value;
                            const lbl = typeof opt === 'string' ? opt : opt.label;
                            return <option key={val} value={val}>{lbl}</option>;
                          })}
                        </select>
                      )}
                      {field.type === 'toggle' && (
                        <button
                          onClick={() => updateSectionCustomization(sectionKey, { [field.name]: !value })}
                          className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                            value ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900/60 border-white/5 text-slate-400'
                          }`}
                        >
                          <span>{value ? 'Active / Enabled' : 'Disabled'}</span>
                          <span className={`w-2.5 h-2.5 rounded-full ${value ? 'bg-white' : 'bg-slate-500'}`} />
                        </button>
                      )}
                      {field.type === 'alignment' && (
                        <div className="flex gap-2">
                          {[
                            { key: 'left', icon: AlignLeft },
                            { key: 'center', icon: AlignCenter },
                            { key: 'right', icon: AlignRight }
                          ].map(item => {
                            const Icon = item.icon;
                            const active = value === item.key;
                            return (
                              <button
                                key={item.key}
                                onClick={() => updateSectionCustomization(sectionKey, { [field.name]: item.key as any })}
                                className={`flex-1 py-2 flex items-center justify-center rounded-xl border transition-colors cursor-pointer ${
                                  active ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white'
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No editable schema properties found for {sectionKey}.</p>
            )}

            {/* Item-Level Customizer Accordion for Projects or Experience */}
            {(sectionKey === 'projects' || sectionKey === 'experience') && careerProfile && (
              <div className="space-y-3 pt-4 border-t border-white/5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Item Overrides ({sectionKey === 'projects' ? careerProfile.projects?.length : careerProfile.experience?.length})</span>
                </label>
                <div className="space-y-3">
                  {(sectionKey === 'projects' ? careerProfile.projects : careerProfile.experience)?.map((item: any, idx: number) => {
                    const itemId = item.id || item.name || item.company || `item_${idx}`;
                    const override = sectionConfig.itemOverrides?.[itemId] || {};

                    return (
                      <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
                        <div className="text-xs font-bold text-indigo-300">{item.name || item.company || `Item ${idx+1}`}</div>
                        <input
                          type="text"
                          placeholder={sectionKey === 'projects' ? 'Project Name Override' : 'Position Override'}
                          value={override.name || override.position || ''}
                          onChange={e => updateItemOverride(sectionKey, itemId, sectionKey === 'projects' ? 'name' : 'position', e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-white"
                        />
                        <textarea
                          rows={2}
                          placeholder="Description Override"
                          value={override.description || ''}
                          onChange={e => updateItemOverride(sectionKey, itemId, 'description', e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-white resize-none"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Premium Component Flavor Switcher */}
            {isPremium && (
              <div className="space-y-3 pt-4 border-t border-white/5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Component Design style</span>
                </label>
                <p className="text-[10px] text-slate-400">Change the design style paradigm for this section entirely.</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Cinematic', label: '🎬 Cinematic', desc: 'Fluid layout' },
                    { id: 'Brutalist', label: '🏁 Brutalist', desc: 'Bold grids' },
                    { id: 'Ethereal', label: '🌸 Ethereal', desc: 'Soft blur' }
                  ].map(flav => {
                    const active = (sectionConfig.flavor || 'Cinematic') === flav.id;
                    return (
                      <button
                        key={flav.id}
                        onClick={() => updateSectionCustomization(sectionKey, { flavor: flav.id })}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          active
                            ? 'bg-amber-500/25 border-amber-500 text-white font-bold'
                            : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <div className="text-[11px]">{flav.label}</div>
                        <div className="text-[9px] text-slate-500 mt-0.5">{flav.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: UNIFIED PORTFOLIO ENHANCEMENTS */}
        {activeTab === 'enhance' && (
          <div className="space-y-6">
            {/* External Links */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Showcase Links</span>
              </label>
              <div className="space-y-2">
                {['github', 'linkedin', 'behance', 'dribbble', 'figma'].map(key => (
                  <div key={key} className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">{key} URL</span>
                    <input
                      type="text"
                      placeholder={`https://${key}.com/username`}
                      value={enhancements.externalLinks?.[key] || ''}
                      onChange={e => {
                        const updated = {
                          ...enhancements,
                          externalLinks: {
                            ...(enhancements.externalLinks || {}),
                            [key]: e.target.value
                          }
                        };
                        updateEnhancements(updated);
                      }}
                      className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Projects Section */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  <span>Additional Projects</span>
                </label>
                <button
                  onClick={() => {
                    const updated = {
                      ...enhancements,
                      additionalProjects: [
                        ...(enhancements.additionalProjects || []),
                        { title: 'New Custom Project', description: '', technologies: [], link: '' }
                      ]
                    };
                    updateEnhancements(updated);
                  }}
                  className="flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add Project
                </button>
              </div>

              <div className="space-y-3">
                {(enhancements.additionalProjects || []).map((proj: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-2 relative group">
                    <button
                      onClick={() => {
                        const list = [...enhancements.additionalProjects];
                        list.splice(idx, 1);
                        updateEnhancements({ ...enhancements, additionalProjects: list });
                      }}
                      className="absolute top-2 right-2 text-slate-500 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={proj.title || ''}
                      onChange={e => {
                        const list = [...enhancements.additionalProjects];
                        list[idx] = { ...list[idx], title: e.target.value };
                        updateEnhancements({ ...enhancements, additionalProjects: list });
                      }}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1 text-xs font-semibold"
                    />
                    <textarea
                      rows={2}
                      placeholder="Project Summary"
                      value={proj.description || ''}
                      onChange={e => {
                        const list = [...enhancements.additionalProjects];
                        list[idx] = { ...list[idx], description: e.target.value };
                        updateEnhancements({ ...enhancements, additionalProjects: list });
                      }}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1 text-[11px] resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Experience Section */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  <span>Additional Work Experience</span>
                </label>
                <button
                  onClick={() => {
                    const updated = {
                      ...enhancements,
                      additionalExperience: [
                        ...(enhancements.additionalExperience || []),
                        { company: 'Company Name', position: 'Position', startDate: '', endDate: '', description: '' }
                      ]
                    };
                    updateEnhancements(updated);
                  }}
                  className="flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add Work
                </button>
              </div>

              <div className="space-y-3">
                {(enhancements.additionalExperience || []).map((exp: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-2 relative group">
                    <button
                      onClick={() => {
                        const list = [...enhancements.additionalExperience];
                        list.splice(idx, 1);
                        updateEnhancements({ ...enhancements, additionalExperience: list });
                      }}
                      className="absolute top-2 right-2 text-slate-500 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company || ''}
                      onChange={e => {
                        const list = [...enhancements.additionalExperience];
                        list[idx] = { ...list[idx], company: e.target.value };
                        updateEnhancements({ ...enhancements, additionalExperience: list });
                      }}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1 text-xs font-semibold"
                    />
                    <input
                      type="text"
                      placeholder="Position"
                      value={exp.position || ''}
                      onChange={e => {
                        const list = [...enhancements.additionalExperience];
                        list[idx] = { ...list[idx], position: e.target.value };
                        updateEnhancements({ ...enhancements, additionalExperience: list });
                      }}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1 text-[11px]"
                    />
                    <textarea
                      rows={2}
                      placeholder="Role Description"
                      value={exp.description || ''}
                      onChange={e => {
                        const list = [...enhancements.additionalExperience];
                        list[idx] = { ...list[idx], description: e.target.value };
                        updateEnhancements({ ...enhancements, additionalExperience: list });
                      }}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1 text-[11px] resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Status */}
      <div className="p-4 border-t border-white/10 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live Preview Updating
        </span>
        <button
          onClick={() => setActiveEditingSection(null)}
          className={`px-4 py-1.5 rounded-xl text-white font-semibold cursor-pointer ${isPremium ? 'bg-amber-600 hover:bg-amber-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}
        >
          Done
        </button>
      </div>
    </aside>
  );
}
