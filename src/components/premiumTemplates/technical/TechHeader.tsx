import React from 'react';
import { EnhancedProfile } from './EnhancementEngine';
import { Mail, Phone, MapPin, Link, Code, Globe } from 'lucide-react';

export const TechHeader = ({ profile }: { profile: EnhancedProfile }) => {
  const { personalInfo } = profile;
  
  const contactParts = [
    { label: personalInfo.email, url: `mailto:${personalInfo.email}`, icon: Mail },
    { label: personalInfo.phone, url: `tel:${personalInfo.phone}`, icon: Phone },
    { label: personalInfo.location, url: null, icon: MapPin },
    { label: personalInfo.linkedin ? 'LinkedIn' : null, url: personalInfo.linkedin?.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`, icon: Link },
    { label: personalInfo.github ? 'GitHub' : null, url: personalInfo.github?.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`, icon: Code },
    { label: personalInfo.website ? personalInfo.website.replace('https://', '').replace('http://', '') : null, url: personalInfo.website?.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`, icon: Globe }
  ].filter(part => part.label);

  return (
    <div className="mb-4 text-center">
      <h1 className="text-[32px] font-sans font-bold text-gray-900 tracking-tight leading-none mb-1.5 uppercase">
        {personalInfo.fullName}
      </h1>
      <p className="text-[12px] font-bold text-[#2563EB] mb-3">
        {profile.professionCategory}
      </p>
      
      {contactParts.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-gray-700 font-medium print:flex-nowrap print:w-full print:justify-center">
          {contactParts.map((part, idx) => {
            const Icon = part.icon;
            return (
              <React.Fragment key={idx}>
                <div className="flex items-center gap-1 print:shrink-0">
                  <Icon size={10} className="text-[#2563EB]" />
                  {part.url ? (
                    <a href={part.url} target="_blank" rel="noreferrer" className="hover:text-brand">
                      {part.label?.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  ) : (
                    <span>{part.label}</span>
                  )}
                </div>
                {idx < contactParts.length - 1 && <span className="text-gray-300 mx-1">|</span>}
              </React.Fragment>
            );
          })}
        </div>
      )}
      <div className="w-full border-b border-gray-300 mt-4 mb-2"></div>
    </div>
  );
};
