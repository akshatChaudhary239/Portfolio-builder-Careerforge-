'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CareerProfile, Portfolio, PortfolioEnhancements, Project } from '@/db/local-db';
import { Plus, Trash2, Save, ArrowLeft, Camera, Link as LinkIcon, Briefcase, Award } from 'lucide-react';
import { updatePortfolioEnhancementsAction } from './actions';

export default function EnhancePortfolioClient({
  careerProfile,
  portfolio
}: {
  careerProfile: CareerProfile;
  portfolio: Portfolio;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  
  const [enhancements, setEnhancements] = useState<PortfolioEnhancements>(portfolio.enhancements || {
    additionalProjects: [],
    additionalCertifications: [],
    externalLinks: {}
  });

  const profession = careerProfile.professionCategory;

  const getProjectLabels = () => {
    switch (profession) {
      case 'Developer': return { title: 'Open Source / Extra Projects', addBtn: 'Add Project', nameLabel: 'Repository / Project Name', descLabel: 'Contribution / Description' };
      case 'Designer': return { title: 'Additional Case Studies', addBtn: 'Add Case Study', nameLabel: 'Project Name', descLabel: 'Design Challenge & Solution' };
      case 'Marketing': return { title: 'Additional Campaigns', addBtn: 'Add Campaign', nameLabel: 'Campaign Name', descLabel: 'Goal & Results' };
      case 'Law': return { title: 'Additional Cases / Publications', addBtn: 'Add Case', nameLabel: 'Case / Publication Name', descLabel: 'Outcome & Details' };
      case 'Finance': return { title: 'Financial Models & Analysis', addBtn: 'Add Analysis', nameLabel: 'Project Name', descLabel: 'Analysis Type & Outcome' };
      case 'HR': return { title: 'People Initiatives', addBtn: 'Add Initiative', nameLabel: 'Initiative Name', descLabel: 'Objective & Results' };
      default: return { title: 'Additional Professional Work', addBtn: 'Add Work', nameLabel: 'Title', descLabel: 'Description & Outcome' };
    }
  };

  const labels = getProjectLabels();

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePortfolioEnhancementsAction(enhancements);
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to save enhancements');
    } finally {
      setSaving(false);
    }
  };

  const updateExternalLinks = (key: string, value: string) => {
    setEnhancements(prev => ({
      ...prev,
      externalLinks: {
        ...(prev.externalLinks || {}),
        [key]: value
      }
    }));
  };

  const addProject = () => {
    setEnhancements(prev => ({
      ...prev,
      additionalProjects: [...(prev.additionalProjects || []), { title: '', description: '', technologies: [], link: '' }]
    }));
  };

  const updateProject = (index: number, key: keyof Project, value: any) => {
    const updated = [...(enhancements.additionalProjects || [])];
    updated[index] = { ...updated[index], [key]: value };
    setEnhancements({ ...enhancements, additionalProjects: updated });
  };

  const removeProject = (index: number) => {
    const updated = [...(enhancements.additionalProjects || [])];
    updated.splice(index, 1);
    setEnhancements({ ...enhancements, additionalProjects: updated });
  };

  const addExperience = () => {
    setEnhancements(prev => ({
      ...prev,
      additionalExperience: [...(prev.additionalExperience || []), { company: '', position: '', startDate: '', endDate: '', currentlyWorking: false, description: '', achievements: [] }]
    }));
  };

  const updateExperience = (index: number, key: string, value: any) => {
    const updated = [...(enhancements.additionalExperience || [])];
    updated[index] = { ...updated[index], [key]: value } as any;
    setEnhancements({ ...enhancements, additionalExperience: updated });
  };

  const removeExperience = (index: number) => {
    const updated = [...(enhancements.additionalExperience || [])];
    updated.splice(index, 1);
    setEnhancements({ ...enhancements, additionalExperience: updated });
  };

  const addCertification = () => {
    setEnhancements(prev => ({
      ...prev,
      additionalCertifications: [...(prev.additionalCertifications || []), { title: '', issuer: '', issueDate: '', credentialUrl: '' }]
    }));
  };

  const updateCertification = (index: number, key: string, value: any) => {
    const updated = [...(enhancements.additionalCertifications || [])];
    updated[index] = { ...updated[index], [key]: value } as any;
    setEnhancements({ ...enhancements, additionalCertifications: updated });
  };

  const removeCertification = (index: number) => {
    const updated = [...(enhancements.additionalCertifications || [])];
    updated.splice(index, 1);
    setEnhancements({ ...enhancements, additionalCertifications: updated });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Enhance Your Portfolio</h1>
          <p className="text-sm text-primary-light mt-2 max-w-2xl">
            Add comprehensive details, case studies, and extra projects to your public portfolio without cluttering your concise resume.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 text-sm font-semibold text-primary-light hover:text-primary transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-brand hover:bg-brand-hover text-white text-sm font-bold rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save Enhancements'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Media & Links */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-warm-border p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Camera className="text-brand" size={20} />
              <h3 className="font-bold text-primary">Profile Photo</h3>
            </div>
            <p className="text-xs text-primary-light mb-4">Provide a URL to your professional headshot. If provided, premium portfolios will use it.</p>
            <input 
              type="text" 
              placeholder="https://example.com/my-photo.jpg" 
              value={enhancements.profilePhotoUrl || ''}
              onChange={(e) => setEnhancements({...enhancements, profilePhotoUrl: e.target.value})}
              className="w-full bg-warm-bg border border-warm-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand/50 transition-colors"
            />
          </div>

          <div className="bg-white rounded-2xl border border-warm-border p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <LinkIcon className="text-brand" size={20} />
              <h3 className="font-bold text-primary">External Links</h3>
            </div>
            <p className="text-xs text-primary-light mb-4">Add additional portfolio links that aren't on your resume.</p>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-primary-light mb-1 block">GitHub</label>
                <input 
                  type="text" 
                  value={enhancements.externalLinks?.github || ''}
                  onChange={(e) => updateExternalLinks('github', e.target.value)}
                  className="w-full bg-warm-bg border border-warm-border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              {(profession === 'Designer' || profession === 'Marketing') && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-primary-light mb-1 block">Behance</label>
                    <input 
                      type="text" 
                      value={enhancements.externalLinks?.behance || ''}
                      onChange={(e) => updateExternalLinks('behance', e.target.value)}
                      className="w-full bg-warm-bg border border-warm-border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-primary-light mb-1 block">Dribbble</label>
                    <input 
                      type="text" 
                      value={enhancements.externalLinks?.dribbble || ''}
                      onChange={(e) => updateExternalLinks('dribbble', e.target.value)}
                      className="w-full bg-warm-bg border border-warm-border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Projects & Extensive Data */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-warm-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Briefcase className="text-brand" size={20} />
                <h3 className="font-bold text-primary text-lg">{labels.title}</h3>
              </div>
              <button 
                onClick={addProject}
                className="text-xs font-bold bg-brand/10 text-brand px-3 py-1.5 rounded-lg hover:bg-brand/20 transition-colors flex items-center gap-1"
              >
                <Plus size={14} /> {labels.addBtn}
              </button>
            </div>

            <div className="space-y-6">
              {(!enhancements.additionalProjects || enhancements.additionalProjects.length === 0) && (
                <div className="text-center py-8 border-2 border-dashed border-warm-border rounded-xl">
                  <p className="text-sm text-primary-light">No additional items added yet.</p>
                </div>
              )}

              {(enhancements.additionalProjects || []).map((proj, idx) => (
                <div key={idx} className="p-4 border border-warm-border rounded-xl bg-warm-bg relative group">
                  <button 
                    onClick={() => removeProject(idx)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  
                  <div className="space-y-4 pr-8">
                    <div>
                      <label className="text-xs font-semibold text-primary-light mb-1 block">{labels.nameLabel}</label>
                      <input 
                        type="text" 
                        value={proj.title || ''}
                        onChange={(e) => updateProject(idx, 'title', e.target.value)}
                        className="w-full bg-white border border-warm-border rounded-lg px-3 py-2 text-sm focus:border-brand/50 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-primary-light mb-1 block">{labels.descLabel}</label>
                      <textarea 
                        value={proj.description || ''}
                        onChange={(e) => updateProject(idx, 'description', e.target.value)}
                        rows={3}
                        className="w-full bg-white border border-warm-border rounded-lg px-3 py-2 text-sm focus:border-brand/50 outline-none resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-primary-light mb-1 block">Live URL / Link</label>
                        <input 
                          type="text" 
                          value={proj.link || ''}
                          onChange={(e) => updateProject(idx, 'link', e.target.value)}
                          className="w-full bg-white border border-warm-border rounded-lg px-3 py-2 text-sm focus:border-brand/50 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-primary-light mb-1 block">Tools / Tech Stack (comma separated)</label>
                        <input 
                          type="text" 
                          value={(proj.technologies || []).join(', ')}
                          onChange={(e) => updateProject(idx, 'technologies', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                          className="w-full bg-white border border-warm-border rounded-lg px-3 py-2 text-sm focus:border-brand/50 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-warm-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Briefcase className="text-brand" size={20} />
                <h3 className="font-bold text-primary text-lg">Additional Work Experience</h3>
              </div>
              <button 
                onClick={addExperience}
                className="text-xs font-bold bg-brand/10 text-brand px-3 py-1.5 rounded-lg hover:bg-brand/20 transition-colors flex items-center gap-1"
              >
                <Plus size={14} /> Add Experience
              </button>
            </div>

            <div className="space-y-6">
              {(!enhancements.additionalExperience || enhancements.additionalExperience.length === 0) && (
                <div className="text-center py-8 border-2 border-dashed border-warm-border rounded-xl">
                  <p className="text-sm text-primary-light">No additional experience added yet.</p>
                </div>
              )}

              {(enhancements.additionalExperience || []).map((exp, idx) => (
                <div key={idx} className="p-4 border border-warm-border rounded-xl bg-warm-bg relative group">
                  <button 
                    onClick={() => removeExperience(idx)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  
                  <div className="space-y-4 pr-8">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-primary-light mb-1 block">Company Name</label>
                        <input 
                          type="text" 
                          value={exp.company || ''}
                          onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                          className="w-full bg-white border border-warm-border rounded-lg px-3 py-2 text-sm focus:border-brand/50 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-primary-light mb-1 block">Position / Role</label>
                        <input 
                          type="text" 
                          value={exp.position || ''}
                          onChange={(e) => updateExperience(idx, 'position', e.target.value)}
                          className="w-full bg-white border border-warm-border rounded-lg px-3 py-2 text-sm focus:border-brand/50 outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-primary-light mb-1 block">Start Date</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Jan 2020"
                          value={exp.startDate || ''}
                          onChange={(e) => updateExperience(idx, 'startDate', e.target.value)}
                          className="w-full bg-white border border-warm-border rounded-lg px-3 py-2 text-sm focus:border-brand/50 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-primary-light mb-1 block">End Date (or Present)</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Present"
                          value={exp.endDate || ''}
                          onChange={(e) => updateExperience(idx, 'endDate', e.target.value)}
                          className="w-full bg-white border border-warm-border rounded-lg px-3 py-2 text-sm focus:border-brand/50 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-primary-light mb-1 block">Description</label>
                      <textarea 
                        value={exp.description || ''}
                        onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                        rows={3}
                        className="w-full bg-white border border-warm-border rounded-lg px-3 py-2 text-sm focus:border-brand/50 outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-warm-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Award className="text-brand" size={20} />
                <h3 className="font-bold text-primary text-lg">Additional Certifications</h3>
              </div>
              <button 
                onClick={addCertification}
                className="text-xs font-bold bg-brand/10 text-brand px-3 py-1.5 rounded-lg hover:bg-brand/20 transition-colors flex items-center gap-1"
              >
                <Plus size={14} /> Add Certification
              </button>
            </div>

            <div className="space-y-6">
              {(!enhancements.additionalCertifications || enhancements.additionalCertifications.length === 0) && (
                <div className="text-center py-8 border-2 border-dashed border-warm-border rounded-xl">
                  <p className="text-sm text-primary-light">No additional certifications added yet.</p>
                </div>
              )}

              {(enhancements.additionalCertifications || []).map((cert, idx) => (
                <div key={idx} className="p-4 border border-warm-border rounded-xl bg-warm-bg relative group">
                  <button 
                    onClick={() => removeCertification(idx)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  
                  <div className="space-y-4 pr-8">
                    <div>
                      <label className="text-xs font-semibold text-primary-light mb-1 block">Certification Title</label>
                      <input 
                        type="text" 
                        value={cert.title || ''}
                        onChange={(e) => updateCertification(idx, 'title', e.target.value)}
                        className="w-full bg-white border border-warm-border rounded-lg px-3 py-2 text-sm focus:border-brand/50 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-primary-light mb-1 block">Issuer</label>
                        <input 
                          type="text" 
                          value={cert.issuer || ''}
                          onChange={(e) => updateCertification(idx, 'issuer', e.target.value)}
                          className="w-full bg-white border border-warm-border rounded-lg px-3 py-2 text-sm focus:border-brand/50 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-primary-light mb-1 block">Issue Date</label>
                        <input 
                          type="text" 
                          value={cert.issueDate || ''}
                          onChange={(e) => updateCertification(idx, 'issueDate', e.target.value)}
                          className="w-full bg-white border border-warm-border rounded-lg px-3 py-2 text-sm focus:border-brand/50 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-primary-light mb-1 block">Credential URL</label>
                      <input 
                        type="text" 
                        value={cert.credentialUrl || ''}
                        onChange={(e) => updateCertification(idx, 'credentialUrl', e.target.value)}
                        className="w-full bg-white border border-warm-border rounded-lg px-3 py-2 text-sm focus:border-brand/50 outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
