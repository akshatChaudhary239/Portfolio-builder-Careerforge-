import React from 'react';
import { Certification } from '@/db/local-db';
import { EnhancedProfile } from './EnhancementEngine';
import { Award } from 'lucide-react';

export const TechCertifications = ({ profile, title }: { profile: EnhancedProfile; title?: string }) => {
  const validCerts = profile.certifications?.filter((c: any) => typeof c === 'string' ? !!c.trim() : (c.title || c.issuer || c.name));
  if (!validCerts || validCerts.length === 0) return null;
  
  return (
    <div className="avoid-break mb-4">
      <div className="flex items-center mb-2 border-b border-gray-300 pb-1">
        <h3 className="text-[13px] font-extrabold uppercase tracking-widest text-gray-900">
          {title || "Certifications"}
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {validCerts.map((cert: any, idx: number) => (
          <div key={idx} className="flex items-start gap-1.5">
            <div className="w-1 h-1 bg-[#2563EB] rounded-full mt-1.5 shrink-0" />
            <div>
              <div className="text-[11px] font-bold text-gray-900 leading-tight">{typeof cert === 'string' ? cert : (cert.name || cert.title)}</div>
              <div className="text-[10px] text-gray-800">{typeof cert === 'string' ? '' : cert.issuer}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
