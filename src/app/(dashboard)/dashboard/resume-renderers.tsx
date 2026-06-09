import React from 'react';
import { Experience, Project, Education, Certification, Achievement, CareerProfile, Skill } from '@/db/local-db';
import { EnhancementEngine } from '@/components/premiumTemplates/technical/EnhancementEngine';

// --- SHARED COMPONENTS ---

const SectionHeader = ({ title }: { title: string }) => (
  <div className="mb-3">
    <h3 className="text-[13px] font-bold uppercase tracking-widest text-gray-900 leading-none">
      {title}
    </h3>
    <div className="w-full border-b border-gray-900 mt-1"></div>
  </div>
);

const SectionSpacing = () => <div className="h-4" />;
const EntrySpacing = () => <div className="h-3" />;

// --- RENDERERS ---

export const ResumeHeader = ({ profile, portfolioSubdomain }: { profile: CareerProfile, portfolioSubdomain?: string }) => {
  const { personalInfo, professionCategory } = profile;
  
  const ensureHttp = (url: string) => {
    if (!url) return url;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  const contactItems: { label: string; href?: string; isLink?: boolean }[] = [];

  if (personalInfo.email) contactItems.push({ label: personalInfo.email, href: `mailto:${personalInfo.email}`, isLink: true });
  if (personalInfo.phone) contactItems.push({ label: personalInfo.phone });
  if (personalInfo.location) contactItems.push({ label: personalInfo.location });
  if (personalInfo.linkedin) contactItems.push({ label: 'LinkedIn', href: ensureHttp(personalInfo.linkedin), isLink: true });
  if (personalInfo.github) contactItems.push({ label: 'GitHub', href: ensureHttp(personalInfo.github), isLink: true });
  if (personalInfo.website) contactItems.push({ label: 'Website', href: ensureHttp(personalInfo.website), isLink: true });
  if (portfolioSubdomain) contactItems.push({ label: 'Portfolio', href: `https://${portfolioSubdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'careerforge.com'}`, isLink: true });

  return (
    <div className="text-center mb-6">
      <h1 className="text-[32px] md:text-[38px] font-serif font-bold text-gray-900 tracking-tight uppercase">
        {personalInfo.fullName}
      </h1>
      <p className="text-xs md:text-sm font-semibold text-gray-800 uppercase tracking-[0.2em] mt-1 mb-2">
        {professionCategory}
      </p>
      {contactItems.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-700 font-medium mb-4">
          {contactItems.map((item, idx) => (
            <React.Fragment key={idx}>
              {item.isLink && item.href ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 hover:underline transition-colors decoration-gray-400 underline-offset-2">
                  {item.label}
                </a>
              ) : (
                <span>{item.label}</span>
              )}
              {idx < contactItems.length - 1 && <span className="text-gray-400">|</span>}
            </React.Fragment>
          ))}
        </div>
      )}
      <div className="w-full border-b border-gray-900 mt-2"></div>
    </div>
  );
};

export const ResumeSummary = ({ profile }: { profile: CareerProfile }) => {
  const summaryText = profile.summary || (profile as any).professionalSummary || (profile.personalInfo as any)?.summary;
  
  if (!summaryText) return null;
  
  return (
    <div className="avoid-break mb-6">
      <SectionHeader title="Professional Summary" />
      <p className="text-[12px] text-gray-900 leading-relaxed text-left">
        {summaryText}
      </p>
    </div>
  );
};

const categorizeSkills = (skills: any[]) => {
  const categories: Record<string, string[]> = {
    'Languages & Core': [],
    'Frontend & UI': [],
    'Backend & Databases': [],
    'Cloud, Tools & DevOps': [],
    'Data & Analytics': [],
    'Domain & Other': []
  };

  const dict: Record<string, string[]> = {
    'Languages & Core': ['javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'scala', 'c'],
    'Frontend & UI': ['react', 'next.js', 'vue', 'angular', 'svelte', 'html', 'css', 'tailwindcss', 'sass', 'figma', 'sketch', 'ui design', 'ux design'],
    'Backend & Databases': ['node.js', 'express', 'nestjs', 'django', 'flask', 'spring boot', 'laravel', 'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'graphql', 'rest', 'api'],
    'Cloud, Tools & DevOps': ['aws', 'gcp', 'azure', 'docker', 'kubernetes', 'terraform', 'ci/cd', 'git', 'linux', 'jenkins', 'github actions'],
    'Data & Analytics': ['machine learning', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'excel', 'power bi', 'tableau', 'statistics', 'nlp', 'scikit-learn']
  };

  skills.forEach(skill => {
    const name = typeof skill === 'string' ? skill : skill?.name;
    if (!name) return;
    
    const sName = name.toLowerCase();
    let matched = false;
    for (const [catName, keywords] of Object.entries(dict)) {
      if (keywords.some(k => sName.includes(k))) {
        categories[catName].push(name);
        matched = true;
        break;
      }
    }
    if (!matched) {
      categories['Domain & Other'].push(name);
    }
  });

  // Remove empty categories
  return Object.entries(categories).filter(([_, items]) => items.length > 0);
};

export const ResumeSkills = ({ profile }: { profile: CareerProfile }) => {
  if (!profile.skills || profile.skills.length === 0) return null;
  
  const groupedSkills = categorizeSkills(profile.skills);

  return (
    <div className="avoid-break mb-5">
      <SectionHeader title="Technical Skills" />
      <div className="space-y-1.5">
        {groupedSkills.map(([catName, items], idx) => (
          <div key={idx} className="grid grid-cols-[160px_1fr] gap-2 text-[12px] leading-relaxed">
            <span className="font-bold text-gray-900">{catName}:</span>
            <span className="text-gray-900">{items.join(', ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ResumeExperience = ({ profile }: { profile: CareerProfile }) => {
  if (!profile.experience || profile.experience.length === 0) return null;
  
  const enhancedExperience = EnhancementEngine.enhanceExperience(profile.experience);
  
  return (
    <div className="mb-5">
      <SectionHeader title="Professional Experience" />
      <div className="space-y-3">
        {enhancedExperience.map((exp: any, idx: number) => (
          <div key={idx} className="avoid-break space-y-1">
            <div className="flex justify-between items-baseline">
              <span className="text-[13px] font-bold text-gray-900">{exp.company}</span>
              <span className="text-[12px] text-gray-900 font-medium">
                {exp.startDate} – {exp.currentlyWorking ? 'Present' : (exp.endDate || 'Present')}
              </span>
            </div>
            <div className="text-[12px] font-semibold text-gray-900 italic">
              {exp.position}
            </div>
            {exp.description && exp.enhancedAchievements.length === 0 && (
              <p className="text-[12px] text-gray-900 leading-relaxed mt-1">
                {exp.description}
              </p>
            )}
            {exp.enhancedAchievements && exp.enhancedAchievements.length > 0 && (
              <ul className="list-disc pl-3 text-[12px] text-gray-900 space-y-1 mt-1.5 leading-relaxed">
                {exp.enhancedAchievements.map((bullet: string, bIdx: number) => (
                  <li key={bIdx} className="pl-1">{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ResumeProjects = ({ profile }: { profile: CareerProfile }) => {
  if (!profile.projects || profile.projects.length === 0) return null;
  
  const enhancedProjects = EnhancementEngine.enhanceProjects(profile.projects);
  
  return (
    <div className="mb-5">
      <SectionHeader title="Key Projects" />
      <div className="space-y-3">
        {enhancedProjects.map((proj: any, idx: number) => {
          const hasTech = Array.isArray(proj.extractedTechnologies) && proj.extractedTechnologies.length > 0;
          const bullets = proj.enhancedAchievements || [];

          return (
            <div key={idx} className="avoid-break space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="text-[13px] font-bold text-gray-900">
                  {proj.name}
                </span>
                {proj.startDate && (
                  <span className="text-[12px] text-gray-900 font-medium">
                    {proj.startDate} – {proj.endDate || 'Present'}
                  </span>
                )}
              </div>
              {hasTech && (
                <div className="text-[12px] text-gray-900 italic">
                  <span className="font-bold text-gray-900 not-italic">Tech Stack:</span> {proj.extractedTechnologies.join(', ')}
                </div>
              )}
              
              {proj.enhancedOverview && bullets.length === 0 && (
                <p className="text-[12px] text-gray-900 leading-relaxed mt-1">
                  {proj.enhancedOverview}
                </p>
              )}
              
              {bullets.length > 0 && (
                <ul className="list-disc pl-3 text-[12px] text-gray-900 space-y-1 mt-1.5 leading-relaxed">
                  {bullets.map((b: string, bIdx: number) => (
                    <li key={bIdx} className="pl-1">{b}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ResumeEducation = ({ profile }: { profile: CareerProfile }) => {
  if (!profile.education || profile.education.length === 0) return null;
  
  return (
    <div className="mb-5">
      <SectionHeader title="Education" />
      <div className="space-y-3">
        {profile.education.map((edu: Education, idx: number) => (
          <div key={idx} className="avoid-break space-y-1">
            <div className="flex justify-between items-baseline">
              <span className="text-[13px] font-bold text-gray-900">{edu.institution}</span>
              <span className="text-[12px] text-gray-900 font-medium">
                {(() => {
                  const start = (edu as any).startDate || edu.startYear || (edu as any).start || (edu as any).from;
                  const end = (edu as any).endDate || edu.endYear || (edu as any).end || (edu as any).to;
                  const singleDate = (edu as any).date || (edu as any).year || (edu as any).duration;
                  
                  if (singleDate) return singleDate;
                  if (start && end) return `${start} – ${end}`;
                  if (start && !end) return `${start} – Present`;
                  if (!start && end) return end;
                  return '';
                })()}
              </span>
            </div>
            <div className="text-[12px] text-gray-900 italic">
              {edu.degree}{edu.specialization ? ` in ${edu.specialization}` : ''}
              {edu.cgpa && ` | GPA: ${edu.cgpa}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ResumeCertifications = ({ profile }: { profile: CareerProfile }) => {
  if (!profile.certifications || profile.certifications.length === 0) return null;

  // Filter out truly empty certifications
  const validCerts = profile.certifications.filter((c: any) => typeof c === 'string' ? !!c.trim() : (c.title || c.issuer));
  if (validCerts.length === 0) return null;
  
  return (
    <div className="mb-5">
      <SectionHeader title="Certifications" />
      <div className="space-y-3">
        {validCerts.map((cert: Certification, idx: number) => (
          <div key={idx} className="avoid-break space-y-1">
            <div className="flex justify-between items-baseline">
              <span className="text-[13px] font-bold text-gray-900">{typeof cert === 'string' ? cert : (cert.title || (cert as any).name)}</span>
              <span className="text-[12px] text-gray-900 font-medium">{typeof cert === 'string' ? '' : cert.issueDate}</span>
            </div>
            {cert.issuer && (
              <div className="text-[12px] text-gray-900 italic">
                {typeof cert === 'string' ? '' : cert.issuer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ResumeAchievements = ({ profile }: { profile: CareerProfile }) => {
  if (!profile.achievements || profile.achievements.length === 0) return null;
  
  return (
    <div className="mb-5">
      <SectionHeader title="Achievements" />
      <div className="space-y-2">
        <ul className="list-disc pl-3 text-[12px] text-gray-900 space-y-1 mt-1.5 leading-relaxed">
          {profile.achievements.map((ach: Achievement, idx: number) => (
            <li key={idx} className="pl-1 avoid-break">
              <span className="font-bold text-gray-900">{ach.title}</span>
              {ach.description ? `: ${ach.description}` : ''}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
