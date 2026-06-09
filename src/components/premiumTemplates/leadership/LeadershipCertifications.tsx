import React from 'react';
import { LeadershipResumeResult } from '@/lib/ai-service';

export const LeadershipCertifications = ({ profile, title }: { profile: LeadershipResumeResult; title?: string }) => {
  const validCerts = profile.certifications?.filter((c: any) => typeof c === 'string' ? !!c.trim() : (c.title || c.issuer));
  if (!validCerts || validCerts.length === 0) return null;

  return (
    <div className="mb-3 print:mb-1">
      <div className="flex items-center mb-2 border-b border-gray-300 pb-1">
        <h3 className="text-[12px] print:text-[11px] font-extrabold uppercase tracking-widest text-gray-900">
          {title || "Certifications"}
        </h3>
      </div>
      <ul className="list-disc pl-4 space-y-1">
        {validCerts.map((cert: any, idx: number) => {
          let content = typeof cert === 'string' ? cert : '';
          if (typeof cert === 'object' && cert !== null) {
            content = cert.title || cert.name || '';
            if (cert.issuer) content += ` - ${typeof cert === 'string' ? '' : cert.issuer}`;
            if (cert.issueDate || cert.year) content += ` (${cert.issueDate || cert.year})`;
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
