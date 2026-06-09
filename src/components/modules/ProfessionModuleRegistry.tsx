import React from 'react';
import { ShowcaseItem, ProfessionCategory } from '@/db/local-db';

export interface ShowcaseModuleProps {
  item: any;
  idx: number;
  updateField: (idx: number, field: string, val: any) => void;
}

const DeveloperModule: React.FC<ShowcaseModuleProps> = ({ item, idx, updateField }) => (
  <>
    <div>
      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">GitHub URL</label>
      <input value={item.githubUrl || ''} onChange={(e) => updateField(idx, 'githubUrl', e.target.value)} placeholder="github.com/username/repo" className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
    </div>
    <div>
      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Live URL</label>
      <input value={item.liveUrl || ''} onChange={(e) => updateField(idx, 'liveUrl', e.target.value)} placeholder="https://..." className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
    </div>
    <div>
      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Tech Stack (comma separated)</label>
      <input value={item.techStack?.join(', ') || ''} onChange={(e) => updateField(idx, 'techStack', e.target.value.split(',').map((t: string) => t.trim()))} placeholder="React, Node.js, PostgreSQL" className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
    </div>
    <div>
      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Open Source Links (comma separated)</label>
      <input value={item.openSourceLinks?.join(', ') || ''} onChange={(e) => updateField(idx, 'openSourceLinks', e.target.value.split(',').map((t: string) => t.trim()))} placeholder="PR links or repository URLs" className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
    </div>
  </>
);

const DesignerModule: React.FC<ShowcaseModuleProps> = ({ item, idx, updateField }) => (
  <>
    <div>
      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Behance URL</label>
      <input value={item.behanceUrl || ''} onChange={(e) => updateField(idx, 'behanceUrl', e.target.value)} placeholder="behance.net/username" className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
    </div>
    <div>
      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Dribbble URL</label>
      <input value={item.dribbbleUrl || ''} onChange={(e) => updateField(idx, 'dribbbleUrl', e.target.value)} placeholder="dribbble.com/username" className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
    </div>
    <div>
      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Figma URL</label>
      <input value={item.figmaUrl || ''} onChange={(e) => updateField(idx, 'figmaUrl', e.target.value)} placeholder="figma.com/file/..." className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
    </div>
    <div>
      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Design Tools (comma separated)</label>
      <input value={item.designTools?.join(', ') || ''} onChange={(e) => updateField(idx, 'designTools', e.target.value.split(',').map((t: string) => t.trim()))} placeholder="Figma, Adobe XD, Sketch" className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
    </div>
  </>
);

const DataAnalystModule: React.FC<ShowcaseModuleProps> = ({ item, idx, updateField }) => (
  <>
    <div>
      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Dataset Type</label>
      <input value={item.datasetType || ''} onChange={(e) => updateField(idx, 'datasetType', e.target.value)} placeholder="e.g., E-commerce sales data, User telemetry" className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
    </div>
    <div>
      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Dashboard URL</label>
      <input value={item.dashboardUrl || ''} onChange={(e) => updateField(idx, 'dashboardUrl', e.target.value)} placeholder="Tableau or Power BI link" className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
    </div>
    <div className="md:col-span-2">
      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Tools Used (comma separated)</label>
      <input value={item.tools?.join(', ') || ''} onChange={(e) => updateField(idx, 'tools', e.target.value.split(',').map((t: string) => t.trim()))} placeholder="Python, SQL, Tableau" className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
    </div>
  </>
);

const BusinessModule: React.FC<ShowcaseModuleProps> = ({ item, idx, updateField }) => (
  <>
    <div>
      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Business Domain</label>
      <input value={item.domain || ''} onChange={(e) => updateField(idx, 'domain', e.target.value)} placeholder="e.g., FinTech, Healthcare, EdTech" className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
    </div>
    <div>
      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Team Size</label>
      <input value={item.teamSize || ''} onChange={(e) => updateField(idx, 'teamSize', e.target.value)} placeholder="e.g., 5 cross-functional members" className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
    </div>
    <div>
      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Business Impact</label>
      <input value={item.impact || ''} onChange={(e) => updateField(idx, 'impact', e.target.value)} placeholder="e.g., Increased retention by 15%" className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
    </div>
    <div>
      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Presentation Link</label>
      <input value={item.presentationUrl || ''} onChange={(e) => updateField(idx, 'presentationUrl', e.target.value)} placeholder="Pitch deck or strategy doc URL" className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
    </div>
  </>
);

const MarketingModule: React.FC<ShowcaseModuleProps> = ({ item, idx, updateField }) => (
  <>
    <div>
      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Campaign Type</label>
      <input value={item.campaignType || ''} onChange={(e) => updateField(idx, 'campaignType', e.target.value)} placeholder="e.g., B2B Lead Gen, Product Launch" className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
    </div>
    <div>
      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Reach / Audience Size</label>
      <input value={item.reach || ''} onChange={(e) => updateField(idx, 'reach', e.target.value)} placeholder="e.g., 500K impressions" className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
    </div>
    <div>
      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Conversions / ROI</label>
      <input value={item.conversions || ''} onChange={(e) => updateField(idx, 'conversions', e.target.value)} placeholder="e.g., 20% conversion rate" className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
    </div>
    <div>
      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Campaign Link</label>
      <input value={item.campaignUrl || ''} onChange={(e) => updateField(idx, 'campaignUrl', e.target.value)} placeholder="URL to campaign assets" className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
    </div>
  </>
);

const LawModule: React.FC<ShowcaseModuleProps> = ({ item, idx, updateField }) => (
  <>
    <div>
      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Practice Area</label>
      <input value={item.practiceArea || ''} onChange={(e) => updateField(idx, 'practiceArea', e.target.value)} placeholder="e.g., Corporate Finance, IP Law" className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
    </div>
    <div>
      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Case Type / Transaction</label>
      <input value={item.caseType || ''} onChange={(e) => updateField(idx, 'caseType', e.target.value)} placeholder="e.g., M&A, Litigation" className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
    </div>
    <div className="md:col-span-2">
      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Publication / Case Link</label>
      <input value={item.publicationUrl || ''} onChange={(e) => updateField(idx, 'publicationUrl', e.target.value)} placeholder="URL to brief or public record" className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
    </div>
  </>
);

const HRModule: React.FC<ShowcaseModuleProps> = ({ item, idx, updateField }) => (
  <>
    <div className="md:col-span-2">
      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Initiative Type</label>
      <input value={item.initiativeType || ''} onChange={(e) => updateField(idx, 'initiativeType', e.target.value)} placeholder="e.g., DEI Training, Executive Hiring Campaign" className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
    </div>
    <div className="md:col-span-2">
      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Participants / Scope</label>
      <input value={item.participants || ''} onChange={(e) => updateField(idx, 'participants', e.target.value)} placeholder="e.g., 200+ employees trained" className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
    </div>
  </>
);

const FinanceModule: React.FC<ShowcaseModuleProps> = ({ item, idx, updateField }) => (
  <>
    <div>
      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Financial Model</label>
      <input value={item.modelType || ''} onChange={(e) => updateField(idx, 'modelType', e.target.value)} placeholder="e.g., 3-Statement Model, LBO" className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
    </div>
    <div>
      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Valuation Type</label>
      <input value={item.valuationType || ''} onChange={(e) => updateField(idx, 'valuationType', e.target.value)} placeholder="e.g., DCF, Comps" className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
    </div>
    <div className="md:col-span-2">
      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Research Report / Analysis Link</label>
      <input value={item.reportUrl || ''} onChange={(e) => updateField(idx, 'reportUrl', e.target.value)} placeholder="URL to equity research or analysis" className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
    </div>
  </>
);

const GeneralModule: React.FC<ShowcaseModuleProps> = ({ item, idx, updateField }) => (
  <>
    <div className="md:col-span-2">
      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Work Category</label>
      <input value={item.category || ''} onChange={(e) => updateField(idx, 'category', e.target.value)} placeholder="e.g., Operations, Logistics, Consulting" className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
    </div>
    <div className="md:col-span-2">
      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Supporting Link</label>
      <input value={item.supportingUrl || ''} onChange={(e) => updateField(idx, 'supportingUrl', e.target.value)} placeholder="URL to case study or portfolio piece" className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
    </div>
  </>
);

interface ModuleConfig {
  label: string;
  component: React.FC<ShowcaseModuleProps>;
  defaultItem: any;
}

export const ProfessionModuleRegistry: Record<ProfessionCategory | string, ModuleConfig> = {
  'Developer': {
    label: 'Projects',
    component: DeveloperModule,
    defaultItem: { title: 'New Project', description: '', githubUrl: '', liveUrl: '', techStack: [], openSourceLinks: [] }
  },
  'Designer': {
    label: 'Portfolio Projects',
    component: DesignerModule,
    defaultItem: { title: 'New Portfolio Project', description: '', behanceUrl: '', dribbbleUrl: '', figmaUrl: '', designTools: [] }
  },
  'Data Analyst': {
    label: 'Analytics Projects',
    component: DataAnalystModule,
    defaultItem: { title: 'New Analytics Project', description: '', datasetType: '', tools: [], dashboardUrl: '' }
  },
  'MBA / Business': {
    label: 'Business Projects',
    component: BusinessModule,
    defaultItem: { title: 'New Strategic Initiative', description: '', domain: '', teamSize: '', impact: '', presentationUrl: '' }
  },
  'Marketing': {
    label: 'Campaigns',
    component: MarketingModule,
    defaultItem: { title: 'New Campaign', description: '', campaignType: '', reach: '', conversions: '', campaignUrl: '' }
  },
  'Law': {
    label: 'Cases & Legal Work',
    component: LawModule,
    defaultItem: { title: 'New Case', description: '', practiceArea: '', caseType: '', publicationUrl: '' }
  },
  'HR': {
    label: 'People Initiatives',
    component: HRModule,
    defaultItem: { title: 'New Initiative', description: '', initiativeType: '', participants: '' }
  },
  'Finance': {
    label: 'Financial Analysis',
    component: FinanceModule,
    defaultItem: { title: 'New Analysis', description: '', modelType: '', valuationType: '', reportUrl: '' }
  },
  'General Professional': {
    label: 'Professional Work',
    component: GeneralModule,
    defaultItem: { title: 'New Work Item', description: '', category: '', supportingUrl: '' }
  }
};
