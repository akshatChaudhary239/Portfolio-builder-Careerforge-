const fs = require('fs');
const path = require('path');

const dir = 'c:/Projects/Portfolio builder/src/components/premiumTemplates/balanced';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const files = {
  'ValidationLayer.ts': `import { BalancedResumeResult } from '@/lib/ai-service';

export const BalancedValidationLayer = {
  validate: (profile: any): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    if (!profile) return { isValid: false, errors: ['Profile is undefined'] };
    
    if (!profile.fullName) errors.push('Missing fullName');
    if (!profile.professionalProfile) errors.push('Missing professionalProfile');
    
    if (!profile.coreCompetencies || !Array.isArray(profile.coreCompetencies.technical) || !Array.isArray(profile.coreCompetencies.leadership)) {
      errors.push('Missing or invalid coreCompetencies (requires technical and leadership arrays)');
    }

    if (profile.experience && Array.isArray(profile.experience)) {
      profile.experience.forEach((e: any, idx: number) => {
        if (!e.achievements || e.achievements.length < 3) {
          errors.push(\`Experience "\${e.company || idx}" must have at least 3 achievements\`);
        }
      });
    }

    if (profile.projects && Array.isArray(profile.projects)) {
      profile.projects.forEach((p: any, idx: number) => {
        if (!p.title) errors.push(\`Project \${idx} is missing a title\`);
        if (!p.achievements || p.achievements.length < 3) {
          errors.push(\`Project "\${p.title || idx}" must have at least 3 achievements\`);
        }
      });
    }

    return { isValid: errors.length === 0, errors };
  }
};
`,
  'BalancedHeader.tsx': `import React from 'react';
import { BalancedResumeResult } from '@/lib/ai-service';
import { Mail, Phone, MapPin, Globe, Github, Linkedin } from 'lucide-react';

export const BalancedHeader = ({ profile }: { profile: BalancedResumeResult }) => {
  return (
    <div className="text-center mb-3 print:mb-1.5 pb-3 border-b border-gray-300">
      <h1 className="text-3xl print:text-2xl font-extrabold text-gray-900 tracking-tight uppercase">
        {profile.fullName}
      </h1>
      
      {profile.title && (
        <h2 className="text-[13px] print:text-[11px] font-bold text-gray-700 tracking-widest uppercase mt-1 mb-2">
          {profile.title}
        </h2>
      )}

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10.5px] print:text-[9.5px] text-gray-600 font-medium mt-2">
        {profile.email && (
          <a href={\`mailto:\${profile.email}\`} className="flex items-center hover:text-[#2563EB] transition-colors">
            {profile.email}
          </a>
        )}
        {profile.phone && (
          <span className="flex items-center">
            <span className="text-gray-300 mx-1">|</span> {profile.phone}
          </span>
        )}
        {profile.location && (
          <span className="flex items-center">
            <span className="text-gray-300 mx-1">|</span> {profile.location}
          </span>
        )}
        {profile.linkedin && (
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-[#2563EB] transition-colors">
            <span className="text-gray-300 mx-1">|</span> {profile.linkedin.replace(/^https?:\\/\\/(www\\.)?linkedin\\.com\\/in\\//i, 'linkedin.com/in/')}
          </a>
        )}
        {profile.github && (
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-[#2563EB] transition-colors">
            <span className="text-gray-300 mx-1">|</span> {profile.github.replace(/^https?:\\/\\/(www\\.)?github\\.com\\//i, 'github.com/')}
          </a>
        )}
        {profile.website && (
          <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-[#2563EB] transition-colors">
            <span className="text-gray-300 mx-1">|</span> {profile.website.replace(/^https?:\\/\\/(www\\.)?/i, '')}
          </a>
        )}
      </div>
    </div>
  );
};
`,
  'BalancedProfile.tsx': `import React from 'react';
import { BalancedResumeResult } from '@/lib/ai-service';

export const BalancedProfile = ({ profile }: { profile: BalancedResumeResult }) => {
  if (!profile.professionalProfile) return null;

  return (
    <div className="mb-3 print:mb-1.5">
      <div className="flex items-center mb-1.5 border-b border-gray-300 pb-1">
        <h3 className="text-[12px] print:text-[11px] font-extrabold uppercase tracking-widest text-gray-900">
          Professional Profile
        </h3>
      </div>
      <p className="text-[10.5px] print:text-[9.5px] leading-relaxed print:leading-snug text-gray-800 text-justify">
        {profile.professionalProfile}
      </p>
    </div>
  );
};
`,
  'BalancedCompetencies.tsx': `import React from 'react';
import { BalancedResumeResult } from '@/lib/ai-service';

export const BalancedCompetencies = ({ profile }: { profile: BalancedResumeResult }) => {
  if (!profile.coreCompetencies || (!profile.coreCompetencies.technical.length && !profile.coreCompetencies.leadership.length)) return null;

  return (
    <div className="mb-3 print:mb-1.5">
      <div className="flex items-center mb-1.5 border-b border-gray-300 pb-1">
        <h3 className="text-[12px] print:text-[11px] font-extrabold uppercase tracking-widest text-gray-900">
          Core Competencies
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-[10px] print:text-[9px] font-bold text-gray-600 uppercase mb-1">Technical Expertise</h4>
          <div className="flex flex-wrap gap-x-1.5 gap-y-1">
            {profile.coreCompetencies.technical.map((skill, idx) => (
              <span key={idx} className="text-[10.5px] print:text-[9.5px] text-gray-800 font-medium">
                {skill}{idx < profile.coreCompetencies.technical.length - 1 ? ',' : ''}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-[10px] print:text-[9px] font-bold text-gray-600 uppercase mb-1">Leadership & Collaboration</h4>
          <div className="flex flex-wrap gap-x-1.5 gap-y-1">
            {profile.coreCompetencies.leadership.map((skill, idx) => (
              <span key={idx} className="text-[10.5px] print:text-[9.5px] text-gray-800 font-medium">
                {skill}{idx < profile.coreCompetencies.leadership.length - 1 ? ',' : ''}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
`,
  'BalancedExperience.tsx': `import React from 'react';
import { BalancedResumeResult } from '@/lib/ai-service';

export const BalancedExperience = ({ profile }: { profile: BalancedResumeResult }) => {
  if (!profile.experience || profile.experience.length === 0) return null;

  return (
    <div className="mb-3 print:mb-1.5">
      <div className="flex items-center mb-1.5 border-b border-gray-300 pb-1">
        <h3 className="text-[12px] print:text-[11px] font-extrabold uppercase tracking-widest text-gray-900">
          Professional Experience
        </h3>
      </div>
      
      <div className="space-y-2 print:space-y-1">
        {profile.experience.map((exp, idx) => (
          <div key={idx} className="avoid-break space-y-1 pb-1.5">
            <div className="flex justify-between items-baseline">
              <div>
                <h4 className="text-[11px] print:text-[10px] font-bold text-gray-900 leading-snug print:leading-tight">
                  {exp.position}
                </h4>
                <div className="text-[10.5px] print:text-[9.5px] font-medium text-[#2563EB]">
                  {exp.company}
                </div>
              </div>
              <div className="text-[10px] print:text-[9px] text-gray-500 font-medium whitespace-nowrap text-right shrink-0 ml-4">
                {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                {exp.location && <span className="block italic text-gray-400">{exp.location}</span>}
              </div>
            </div>

            <ul className="list-disc pl-4 space-y-0.5 print:space-y-0 text-[10.5px] print:text-[9.5px] text-gray-800 leading-relaxed print:leading-snug">
              {exp.achievements?.map((ach: any, idx: number) => {
                let content = typeof ach === 'string' ? ach : (ach.description || ach.title || ach.name || JSON.stringify(ach));
                return (
                  <li key={idx} className="pl-1 avoid-break">
                    {content}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
`,
  'BalancedProjects.tsx': `import React from 'react';
import { BalancedResumeResult } from '@/lib/ai-service';

export const BalancedProjects = ({ profile }: { profile: BalancedResumeResult }) => {
  if (!profile.projects || profile.projects.length === 0) return null;

  return (
    <div className="mb-3 print:mb-1.5">
      <div className="flex items-center mb-1.5 border-b border-gray-300 pb-1">
        <h3 className="text-[12px] print:text-[11px] font-extrabold uppercase tracking-widest text-gray-900">
          Projects
        </h3>
      </div>
      
      <div className="space-y-2 print:space-y-1">
        {profile.projects.map((proj, idx) => (
          <div key={idx} className="avoid-break space-y-1 pb-1.5">
            <div className="flex justify-between items-baseline">
              <div className="flex items-center flex-wrap gap-2">
                <h4 className="text-[11px] print:text-[10px] font-bold text-[#2563EB] leading-snug print:leading-tight">
                  {proj.title}
                </h4>
                <div className="flex items-center space-x-2 text-[9px] text-gray-500 font-medium">
                  {proj.github && (
                    <a href={proj.github} className="hover:text-[#2563EB] transition-colors border-l border-gray-300 pl-2">
                      GitHub
                    </a>
                  )}
                  {proj.link && (
                    <a href={proj.link} className="hover:text-[#2563EB] transition-colors border-l border-gray-300 pl-2">
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>

            {proj.techStack && proj.techStack.length > 0 && (
              <div className="text-[10px] print:text-[9px] text-gray-700">
                <span className="font-bold text-gray-900">Tech Stack:</span> {proj.techStack.join(', ')}
              </div>
            )}
            
            {proj.overview && (
              <p className="text-[10.5px] print:text-[9.5px] text-gray-800 leading-relaxed print:leading-snug">
                {proj.overview}
              </p>
            )}

            <ul className="list-disc pl-4 space-y-0.5 print:space-y-0 text-[10.5px] print:text-[9.5px] text-gray-800 leading-relaxed print:leading-snug">
              {proj.achievements?.map((ach: any, i: number) => {
                let content = typeof ach === 'string' ? ach : (ach.description || ach.title || ach.name || JSON.stringify(ach));
                return (
                  <li key={i} className="pl-1 avoid-break">
                    {content}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
`,
  'BalancedEducation.tsx': `import React from 'react';
import { BalancedResumeResult } from '@/lib/ai-service';

export const BalancedEducation = ({ profile }: { profile: BalancedResumeResult }) => {
  if (!profile.education || profile.education.length === 0) return null;

  return (
    <div className="mb-3 print:mb-1.5">
      <div className="flex items-center mb-1.5 border-b border-gray-300 pb-1">
        <h3 className="text-[12px] print:text-[11px] font-extrabold uppercase tracking-widest text-gray-900">
          Education
        </h3>
      </div>
      <div className="space-y-1.5 print:space-y-0.5">
        {profile.education.map((edu, idx) => (
          <div key={idx} className="flex justify-between items-baseline avoid-break">
            <div>
              <div className="text-[11px] print:text-[10px] font-bold text-gray-900">
                {edu.degree} {edu.fieldOfStudy ? \`in \${edu.fieldOfStudy}\` : ''}
              </div>
              <div className="text-[10.5px] print:text-[9.5px] text-gray-700 italic">
                {edu.institution}
              </div>
              {edu.grade && (
                <div className="text-[10px] print:text-[9px] text-gray-600 mt-0.5">
                  CGPA/Grade: {edu.grade}
                </div>
              )}
            </div>
            <div className="text-[10px] print:text-[9px] text-gray-500 font-medium text-right shrink-0">
              {edu.startDate ? \`\${edu.startDate} – \` : ''}{edu.endDate || 'Present'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
`,
  'BalancedCertifications.tsx': `import React from 'react';
import { BalancedResumeResult } from '@/lib/ai-service';

export const BalancedCertifications = ({ profile }: { profile: BalancedResumeResult }) => {
  if (!profile.certifications || profile.certifications.length === 0) return null;

  return (
    <div className="mb-3 print:mb-1.5">
      <div className="flex items-center mb-1.5 border-b border-gray-300 pb-1">
        <h3 className="text-[12px] print:text-[11px] font-extrabold uppercase tracking-widest text-gray-900">
          Certifications
        </h3>
      </div>
      <ul className="list-disc pl-4 space-y-0.5 print:space-y-0">
        {profile.certifications.map((cert: any, idx) => {
          let content = typeof cert === 'string' ? cert : '';
          if (typeof cert === 'object' && cert !== null) {
            content = cert.title || cert.name || '';
            if (cert.issuer) content += \` - \${cert.issuer}\`;
            if (cert.issueDate || cert.year) content += \` (\${cert.issueDate || cert.year})\`;
          }
          return (
            <li key={idx} className="text-[10.5px] print:text-[9.5px] leading-relaxed print:leading-snug text-gray-800 pl-1">
              {content}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
`,
  'BalancedAchievements.tsx': `import React from 'react';
import { BalancedResumeResult } from '@/lib/ai-service';

export const BalancedAchievements = ({ profile }: { profile: BalancedResumeResult }) => {
  if (!profile.achievements || profile.achievements.length === 0) return null;

  return (
    <div className="mb-3 print:mb-1.5">
      <div className="flex items-center mb-1.5 border-b border-gray-300 pb-1">
        <h3 className="text-[12px] print:text-[11px] font-extrabold uppercase tracking-widest text-gray-900">
          Achievements
        </h3>
      </div>
      <ul className="list-disc pl-4 space-y-0.5 print:space-y-0">
        {profile.achievements.map((ach: any, idx) => {
          let content = typeof ach === 'string' ? ach : '';
          if (typeof ach === 'object' && ach !== null) {
            content = ach.title || ach.description || ach.name || JSON.stringify(ach);
          }
          return (
            <li key={idx} className="text-[10.5px] print:text-[9.5px] leading-relaxed print:leading-snug text-gray-800 pl-1">
              {content}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
`,
  'BalancedResume.tsx': `import React, { useMemo } from 'react';
import { BalancedResumeResult } from '@/lib/ai-service';
import { BalancedValidationLayer } from './ValidationLayer';
import { BalancedHeader } from './BalancedHeader';
import { BalancedProfile } from './BalancedProfile';
import { BalancedCompetencies } from './BalancedCompetencies';
import { BalancedExperience } from './BalancedExperience';
import { BalancedProjects } from './BalancedProjects';
import { BalancedEducation } from './BalancedEducation';
import { BalancedCertifications } from './BalancedCertifications';
import { BalancedAchievements } from './BalancedAchievements';
import { AlertCircle } from 'lucide-react';

export const BalancedResume = ({ profile }: { profile: any }) => {
  const { isValid, errors, typedProfile } = useMemo(() => {
    const validation = BalancedValidationLayer.validate(profile);
    return {
      isValid: validation.isValid,
      errors: validation.errors,
      typedProfile: profile as BalancedResumeResult
    };
  }, [profile]);

  if (!isValid) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">Schema Upgrade Required</h3>
        <p className="text-sm text-gray-600 mb-4 max-w-md">
          This Balanced Professional Resume requires our newest AI schema mapping. Please click the Regenerate icon at the top right to process your profile.
        </p>
        <button 
          onClick={() => {
             alert('Please click the small Regenerate (refresh) icon at the top right of this resume card!');
          }}
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold mb-6 hover:bg-brand/90 transition-colors"
        >
          Click the Regenerate Icon Above
        </button>
        <div className="text-left bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-full max-w-md">
          <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">Missing Requirements:</h4>
          <ul className="list-disc pl-4 text-xs text-red-600 space-y-1">
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans text-gray-900 bg-white">
      <BalancedHeader profile={typedProfile} />
      <BalancedProfile profile={typedProfile} />
      <BalancedCompetencies profile={typedProfile} />
      <BalancedExperience profile={typedProfile} />
      <BalancedProjects profile={typedProfile} />
      <BalancedEducation profile={typedProfile} />
      <BalancedCertifications profile={typedProfile} />
      <BalancedAchievements profile={typedProfile} />
    </div>
  );
};
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, filename), content, 'utf-8');
  console.log("Created " + filename);
}
