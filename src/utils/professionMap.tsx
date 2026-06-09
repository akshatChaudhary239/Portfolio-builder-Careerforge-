import React from 'react';
import { User, Code2, Briefcase, Paintbrush, MonitorPlay, Users, Cpu, FileText, Database, Target, Zap, Layout, GraduationCap, Award } from 'lucide-react';

export type SectionType = 'about' | 'skills' | 'experience' | 'projects' | 'differentiator' | 'education' | 'certifications';

export function getSectionMetadata(professionCategory: string | undefined, section: SectionType) {
  const category = (professionCategory || '').toLowerCase();
  
  let isHR = category.includes('hr') || category.includes('human') || category.includes('recruiting');
  let isCreative = category.includes('design') || category.includes('creative') || category.includes('art');
  let isBusiness = category.includes('business') || category.includes('manage') || category.includes('marketing') || category.includes('sales');
  let isTech = !isHR && !isCreative && !isBusiness; // Default to tech if unknown, but we adapt

  switch (section) {
    case 'about':
      if (isHR) return { title: 'Professional Profile', icon: <Users size={24} /> };
      if (isCreative) return { title: 'The Narrative', icon: <User size={24} /> };
      if (isBusiness) return { title: 'Executive Summary', icon: <Target size={24} /> };
      return { title: 'About Me', icon: <User size={24} /> };

    case 'skills':
      if (isHR) return { title: 'Core Competencies', icon: <Users size={24} /> };
      if (isCreative) return { title: 'Creative Arsenal', icon: <Paintbrush size={24} /> };
      if (isBusiness) return { title: 'Strategic Expertise', icon: <Target size={24} /> };
      return { title: 'Technical Arsenal', icon: <Cpu size={24} /> };

    case 'experience':
      if (isHR) return { title: 'Career Trajectory', icon: <Briefcase size={24} /> };
      if (isCreative) return { title: 'Professional Journey', icon: <Paintbrush size={24} /> };
      if (isBusiness) return { title: 'Professional Experience', icon: <Briefcase size={24} /> };
      return { title: 'Work Experience', icon: <Code2 size={24} /> };

    case 'projects':
      if (isHR) return { title: 'Key Initiatives', icon: <FileText size={24} /> };
      if (isCreative) return { title: 'Selected Works', icon: <Layout size={24} /> };
      if (isBusiness) return { title: 'Strategic Case Studies', icon: <FileText size={24} /> };
      return { title: 'Featured Projects', icon: <Database size={24} /> };

    case 'differentiator':
      if (isHR) return { title: 'My Edge', icon: <Target size={24} /> };
      if (isCreative) return { title: 'Creative Vision', icon: <Zap size={24} /> };
      if (isBusiness) return { title: 'Strategic Advantage', icon: <Target size={24} /> };
      return { title: 'The Edge', icon: <Zap size={24} /> };

    case 'education':
      if (isHR) return { title: 'Academic Background', icon: <GraduationCap size={24} /> };
      if (isCreative) return { title: 'Creative Foundations', icon: <GraduationCap size={24} /> };
      if (isBusiness) return { title: 'Academic Foundation', icon: <GraduationCap size={24} /> };
      return { title: 'Education', icon: <GraduationCap size={24} /> };

    case 'certifications':
      if (isHR) return { title: 'Professional Credentials', icon: <Award size={24} /> };
      if (isCreative) return { title: 'Accolades', icon: <Award size={24} /> };
      if (isBusiness) return { title: 'Professional Certifications', icon: <Award size={24} /> };
      return { title: 'Certifications', icon: <Award size={24} /> };

    default:
      return { title: 'Section', icon: <User size={24} /> };
  }
}
