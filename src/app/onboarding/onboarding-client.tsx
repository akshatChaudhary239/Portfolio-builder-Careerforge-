'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Briefcase, Code, Palette, BarChart3, GraduationCap, 
  Scale, Users, HeartHandshake, DollarSign, Upload, 
  FileText, Sparkles, Plus, Trash2, CheckCircle2, Check, Loader2, ArrowRight,
  ArrowLeft, ChevronDown, ChevronUp, Star, Award, ShieldAlert, X, Globe,
  AlertTriangle, Info, ChevronLeft, ChevronRight, UploadCloud, FolderGit2, Settings2, Wand2
} from 'lucide-react';
import { ProfessionCategory, CareerProfile } from '@/db/local-db';
import { parseResumeAction, parseResumeFileAction, confirmOnboardingAction } from './actions';
import { ProfessionModuleRegistry } from '@/components/modules/ProfessionModuleRegistry';
import SummaryAssistant from '@/components/assistant/SummaryAssistant';
import SkillAssistant from '@/components/assistant/SkillAssistant';
import CertificationAssistant from '@/components/assistant/CertificationAssistant';
import GuidedDiscoveryModal from '@/components/assistant/GuidedDiscoveryModal';
import { ROLE_CATALOG, PROJECT_CATALOG } from '@/lib/role-resolver';
import { enhanceDescription, detectRoleConfig } from '@/lib/career-engine';

const DEGREE_CATALOG = [
  "Bachelor of Science (B.S.) in Computer Science",
  "Bachelor of Technology (B.Tech) in Computer Science",
  "Bachelor of Computer Applications (BCA)",
  "Bachelor of Science (B.Sc) in Information Technology",
  "Bachelor of Design (B.Des) in UI/UX Design",
  "Bachelor of Design (B.Des) in Interaction Design",
  "Bachelor of Design (B.Des) in Communication Design",
  "Bachelor of Fine Arts (BFA)",
  "Bachelor of Business Administration (BBA) in Finance",
  "Bachelor of Business Administration (BBA) in Marketing",
  "Bachelor of Business Administration (BBA) in Human Resource Management",
  "Bachelor of Commerce (B.Com) in Accounting",
  "Bachelor of Commerce (B.Com) in Finance",
  "Bachelor of Science (B.Sc) in Business Administration",
  "Bachelor of Technology (B.Tech) in Mechanical Engineering",
  "Bachelor of Technology (B.Tech) in Electrical Engineering",
  "Bachelor of Technology (B.Tech) in Electronics & Communication",
  "Bachelor of Technology (B.Tech) in Civil Engineering",
  "Bachelor of Engineering (B.E.) in Mechanical Engineering",
  "Bachelor of Engineering (B.E.) in Electrical Engineering",
  "Bachelor of Arts (B.A.) in Economics",
  "Bachelor of Arts (B.A.) in English Literature",
  "Bachelor of Arts (B.A.) in Psychology",
  "Bachelor of Science (B.Sc) in Mathematics",
  "Bachelor of Science (B.Sc) in Physics",
  "Bachelor of Laws (LL.B.)",
  
  "Master of Technology (M.Tech) in Computer Science",
  "Master of Science (M.S.) in Computer Science",
  "Master of Computer Applications (MCA)",
  "Master of Science (M.S.) in Data Science",
  "Master of Science (M.S.) in Business Analytics",
  "Master of Design (M.Des) in Interaction Design",
  "Master of Design (M.Des) in Visual Communication",
  "Master of Fine Arts (MFA)",
  "Master of Business Administration (MBA) in Finance",
  "Master of Business Administration (MBA) in Marketing",
  "Master of Business Administration (MBA) in Human Resource Management",
  "Master of Business Administration (MBA) in Operations & Strategy",
  "Master of Science (M.S.) in Finance",
  "Master of Science (M.Sc) in Economics",
  "Master of Science (M.Sc) in Financial Engineering",
  "Master of Science (M.S.) in Human Resource Management",
  "Master of Laws (LL.M.) in Corporate Law",
  "Master of Laws (LL.M.) in Intellectual Property Law",
  "Master of Arts (M.A.) in Industrial-Organizational Psychology",
  "Master of Science (M.Sc) in Physics",
  "Master of Science (M.Sc) in Mathematics",
  
  "Ph.D. in Computer Science",
  "Ph.D. in Machine Learning & AI",
  "Ph.D. in Design & Human-Computer Interaction",
  "Ph.D. in Business Administration",
  "Ph.D. in Economics",
  "Ph.D. in Finance",
  "Ph.D. in Electrical Engineering",
  "Ph.D. in Physics",
  "Ph.D. in Mathematics",
  "Ph.D. in Law",
  "Ph.D. in Organizational Behavior"
];

const INSTITUTION_CATALOG = [
  "Stanford University",
  "Harvard University",
  "Massachusetts Institute of Technology (MIT)",
  "California Institute of Technology (Caltech)",
  "Princeton University",
  "Yale University",
  "Columbia University",
  "University of Chicago",
  "University of Pennsylvania",
  "Cornell University",
  "University of California, Berkeley",
  "University of California, Los Angeles (UCLA)",
  "Carnegie Mellon University",
  "Georgia Institute of Technology",
  "University of Michigan",
  "New York University (NYU)",
  "University of Washington",
  "University of Toronto",
  "University of British Columbia (UBC)",
  "McGill University",
  "University of Waterloo",
  
  "University of Oxford",
  "University of Cambridge",
  "Imperial College London",
  "University College London (UCL)",
  "London School of Economics (LSE)",
  "University of Edinburgh",
  "King's College London",
  "ETH Zurich",
  "EPFL (École Polytechnique Fédérale de Lausanne)",
  "Technical University of Munich (TUM)",
  "LMU Munich",
  "Sorbonne University",
  "École Polytechnique",
  "University of Amsterdam",
  "Delft University of Technology",
  "KU Leuven",
  "Karolinska Institute",
  "University of Copenhagen",
  "Trinity College Dublin",
  
  "National University of Singapore (NUS)",
  "Nanyang Technological University (NTU)",
  "Tsinghua University",
  "Peking University",
  "Fudan University",
  "Shanghai Jiao Tong University",
  "University of Tokyo",
  "Kyoto University",
  "Seoul National University",
  "KAIST (Korea Advanced Institute of Science and Technology)",
  "University of Hong Kong (HKU)",
  "Hong Kong University of Science and Technology (HKUST)",
  
  "Indian Institute of Technology (IIT) Bombay",
  "Indian Institute of Technology (IIT) Delhi",
  "Indian Institute of Technology (IIT) Madras",
  "Indian Institute of Technology (IIT) Kharagpur",
  "Indian Institute of Technology (IIT) Kanpur",
  "Indian Institute of Technology (IIT) Roorkee",
  "Indian Institute of Technology (IIT) Guwahati",
  "Indian Institute of Science (IISc) Bangalore",
  "Birla Institute of Technology and Science (BITS) Pilani",
  "Delhi Technological University (DTU)",
  "Netaji Subhas University of Technology (NSUT)",
  "National Institute of Technology (NIT) Trichy",
  "National Institute of Technology (NIT) Surathkal",
  "Vellore Institute of Technology (VIT)",
  "Indian Institute of Management (IIM) Ahmedabad",
  "Indian Institute of Management (IIM) Bangalore",
  "Indian Institute of Management (IIM) Calcutta",
  "Indian Institute of Management (IIM) Lucknow",
  "Indian Institute of Management (IIM) Kozhikode",
  "Indian Institute of Management (IIM) Indore",
  "University of Delhi (DU)",
  "Jawaharlal Nehru University (JNU)",
  "St. Stephen's College",
  "Lady Shri Ram College for Women",
  "SRCC (Shri Ram College of Commerce)",
  "Loyola College, Chennai",
  "Christ University, Bangalore",
  "Symbiosis International University",
  "Narsee Monjee Institute of Management Studies (NMIMS)",
  
  "University of Melbourne",
  "Australian National University (ANU)",
  "University of Sydney",
  "University of Queensland",
  "UNSW Sydney",
  "University of Auckland",
  
  "University of São Paulo (USP)",
  "National Autonomous University of Mexico (UNAM)",
  "Pontifical Catholic University of Chile",
  "University of Cape Town",
  "University of the Witwatersrand"
];

interface OnboardingClientProps {
  userId: string;
  userName: string;
  userEmail: string;
  isEditMode?: boolean;
  initialProfile?: any;
}

export default function OnboardingClient({ userId, userName, userEmail, isEditMode = false, initialProfile = null }: OnboardingClientProps) {
  const router = useRouter();
  
  // Navigation states
  const [step, setStep] = useState<number>(isEditMode ? 3 : 1);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  
  // Edit mode states
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Step 1: Selected Category
  const [category, setCategory] = useState<ProfessionCategory | null>(null);

  // Step 2: Resume Content & File Upload
  const [resumeText, setResumeText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Step 3: Extracted Data (Editable Form State)
  const [careerProfile, setCareerProfile] = useState<any>(initialProfile || null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedFields, setParsedFields] = useState<string[]>([]);
  const [activeInterviewModal, setActiveInterviewModal] = useState<{ type: 'experience' | 'project'; idx: number } | null>(null);
  const [expErrors, setExpErrors] = useState<Record<number, string>>({});
  const [projErrors, setProjErrors] = useState<Record<number, string>>({});
  const [activeDropdownIdx, setActiveDropdownIdx] = useState<number | null>(null);
  const [activeProjectDropdownIdx, setActiveProjectDropdownIdx] = useState<number | null>(null);
  const [activeDegreeDropdownIdx, setActiveDegreeDropdownIdx] = useState<number | null>(null);
  const [activeInstitutionDropdownIdx, setActiveInstitutionDropdownIdx] = useState<number | null>(null);

  const handleEnhanceExperience = (idx: number) => {
    const exp = careerProfile?.experience?.[idx];
    if (!exp) return;
    const config = detectRoleConfig(exp.role ?? exp.position ?? '', careerProfile?.professionCategory || '');
    const enhanced = enhanceDescription(exp.description || '', config, 'experience');
    updateExperience(idx, 'description', enhanced);
  };

  const handleEnhanceProject = (idx: number) => {
    const proj = careerProfile?.projects?.[idx];
    if (!proj) return;
    const config = detectRoleConfig(proj.title ?? proj.name ?? '', careerProfile?.professionCategory || '');
    const enhanced = enhanceDescription(proj.description || '', config, 'project');
    updateProject(idx, 'description', enhanced);
  };

  // Step 4: Questionnaire State
  const [questionnaire, setQuestionnaire] = useState<any>({
    projects: [],
    experience: [],
    leadership: { ledTeam: false, teamSize: 0, outcome: '' },
    general: { 
      targetRoles: '', 
      strengths: '', 
      targetCompanies: '',
      careerStage: 'Mid-Level',
      primaryStrength: 'Technical Expertise',
      desiredImage: 'Innovative',
      careerGoal: 'Get Hired',
      stylePreference: 'Modern'
    }
  });

  const categories: { name: ProfessionCategory; icon: any; desc: string }[] = [
    { name: 'Developer', icon: Code, desc: 'Software engineers, architects, web developers' },
    { name: 'Designer', icon: Palette, desc: 'UI/UX, visual, product, graphic designers' },
    { name: 'Data Analyst', icon: BarChart3, desc: 'Data scientists, business intelligence, analysts' },
    { name: 'MBA / Business', icon: GraduationCap, desc: 'Product managers, founders, business leads' },
    { name: 'Marketing', icon: Sparkles, desc: 'Growth, brand, SEO, content strategists' },
    { name: 'Law', icon: Scale, desc: 'Attorneys, legal consultants, compliance specialists' },
    { name: 'HR', icon: Users, desc: 'Recruiters, HR business partners, operations' },
    { name: 'Finance', icon: DollarSign, desc: 'Investment bankers, financial modelers, auditors' },
    { name: 'General Professional', icon: HeartHandshake, desc: 'General professional consulting & leadership' },
  ];

  // Helper to load sample text
  const loadSampleResume = () => {
    setUploadedFile(null);
    let sample = '';
    if (category === 'Developer') {
      sample = `${userName}\nSoftware Engineer\nSan Francisco, CA | ${userName.toLowerCase().replace(' ', '')}@gmail.com | github.com/alexmercer\n\nSKILLS:\nJavaScript, React, Next.js, Node.js, SQL, REST APIs\n\nEXPERIENCE:\nSoftware Intern at Nexus Tech Solutions (June 2023 - Sept 2023)\n- Migrated dashboard to Next.js, improving loading speed by 25%.\n- Developed Redis-caching middleware saving response database calls.\n- Worked in a squad of 5 developers.\n\nPROJECTS:\nDynamic Asset Optimizer\n- Created an image processing server resulting in 30% faster downloads.\n- Coded worker threads to run processing tasks.\n\nEDUCATION:\nState University - Bachelor of Science in Computer Science (GPA: 3.8/4.0)`;
    } else if (category === 'Designer') {
      sample = `${userName}\nUI/UX Designer\nLos Angeles, CA | ${userName.toLowerCase().replace(' ', '')}@gmail.com | behance.net/alex\n\nSKILLS:\nFigma, Adobe Creative Suite, Design Systems, Typography, Wireframing\n\nEXPERIENCE:\nDesign Assistant at Aura Studio (May 2023 - Aug 2023)\n- Redesigned onboarding layout which reduced user bounce rates by 32%.\n- Developed standardized components in Figma for production assets.\n\nPROJECTS:\nEcho UI System\n- Crafted 30+ accessible components matching WCAG parameters.`;
    } else {
      sample = `${userName}\nOperations Lead\nNew York, NY | ${userName.toLowerCase().replace(' ', '')}@gmail.com\n\nSKILLS:\nProject Management, Operations Consulting, Agile, Excel Data Modeling\n\nEXPERIENCE:\nOperations Intern at Pinnacle Operations (June 2023 - Sept 2023)\n- Optimized regional pipeline workflows resulting in 15% distance savings.\n- Built digital dashboard to align team updates.`;
    }
    setResumeText(sample);
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const allowedExtensions = ['.pdf', '.docx', '.txt'];
    const fileName = file.name.toLowerCase();
    const isValid = allowedExtensions.some(ext => fileName.endsWith(ext));
    if (!isValid) {
      alert('Unsupported file type. Please upload a PDF, DOCX, or TXT file.');
      return;
    }
    setUploadedFile(file);
    setResumeText(''); // Clear pasted text if file is uploaded
  };

  const clearUploadedFile = () => {
    setUploadedFile(null);
  };

  // --- SUBMISSIONS ---

  // Trigger parsing (Step 2 -> Step 3)
  const handleParse = async () => {
    if (!category) return;
    if (!uploadedFile && !resumeText.trim()) {
      alert('Please upload a resume file or paste your resume content!');
      return;
    }

    setLoading(true);
    setLoadingMessage('Parsing your resume and structuring your profile...');
    
    try {
      let data;
      if (uploadedFile) {
        const formData = new FormData();
        formData.append('file', uploadedFile);
        data = await parseResumeFileAction(formData, category);
      } else {
        data = await parseResumeAction(resumeText, category);
      }
      
      const dataWithCategory = {
        ...data,
        professionCategory: category,
        personalInfo: {
          ...data.personalInfo,
          fullName: data.personalInfo?.fullName || userName,
          email: data.personalInfo?.email || userEmail,
          phone: data.personalInfo?.phone || '',
          location: data.personalInfo?.location || '',
          github: data.personalInfo?.github || '',
          linkedin: data.personalInfo?.linkedin || '',
          website: data.personalInfo?.website || ''
        },
        extensions: (data as any).extensions || {
          apis: [], openSource: [], behance: '', dribbble: '', tools: [],
          practiceAreas: [], cases: [], campaigns: [], growthMetrics: [],
          seoExperience: '', financialModels: [], research: [],
          dashboards: [], pipelines: [], hris: [], initiatives: [], methodologies: [],
          businessFrameworks: [], caseCompetitions: []
        }
      };
      
      // Always render at least one education and certification field
      if (!dataWithCategory.education || dataWithCategory.education.length === 0) {
        dataWithCategory.education = [{ institution: '', degree: '', specialization: '', startYear: '', endYear: '', cgpa: '' }];
      }
      if (!dataWithCategory.certifications || dataWithCategory.certifications.length === 0) {
        dataWithCategory.certifications = [{ title: '', issuer: '', issueDate: '', credentialUrl: '' }];
      }
      
      setCareerProfile(dataWithCategory);
      
      // Pre-fill questionnaire based on parsed content
      const projAnswers = (data.projects || []).map((proj: any) => ({
        title: proj.name,
        intendedUser: '',
        technicalChallenge: '',
        proudOf: '',
        technologies: proj.technologies ? proj.technologies.join(', ') : '',
        problemSolved: proj.problemSolved || '',
        measurableResults: proj.impact || ''
      }));

      const expAnswers = (data.experience || []).map((exp: any) => {
        // Auto-check for leadership keywords
        const isLeader = exp.position.toLowerCase().includes('lead') || 
                          exp.position.toLowerCase().includes('manager') || 
                          exp.position.toLowerCase().includes('head') || 
                          exp.position.toLowerCase().includes('founder') || 
                          exp.position.toLowerCase().includes('director');
        
        return {
          company: exp.company,
          position: exp.position,
          responsibilities: '',
          achievement: '',
          processImproved: '',
          ledTeam: isLeader,
          teamSize: isLeader ? 3 : 0,
          outcome: ''
        };
      });

      // Default questionnaire setup
      setQuestionnaire({
        projects: projAnswers,
        experience: expAnswers,
        leadership: { ledTeam: expAnswers.some((e: any) => e.ledTeam), teamSize: 3, outcome: '' },
        general: { 
          targetRoles: category === 'Developer' ? 'Software Engineer' : category || '', 
          strengths: '', 
          targetCompanies: '',
          careerStage: 'Mid-Level',
          primaryStrength: 'Technical Expertise',
          desiredImage: 'Innovative',
          careerGoal: 'Get Hired',
          stylePreference: 'Modern'
        }
      });

      const fields: string[] = [];
      if (data.personalInfo?.fullName) fields.push('fullName');
      if (data.personalInfo?.email) fields.push('email');
      if (data.personalInfo?.phone) fields.push('phone');
      if (data.personalInfo?.location) fields.push('location');
      if (data.personalInfo?.github) fields.push('github');
      if (data.personalInfo?.linkedin) fields.push('linkedin');
      if (data.personalInfo?.website) fields.push('website');
      if (data.summary) fields.push('summary');
      if (data.skills && data.skills.length > 0) fields.push('skills');
      if (data.experience && data.experience.length > 0) fields.push('experience');
      if (data.projects && data.projects.length > 0) fields.push('projects');
      if (data.education && data.education.length > 0 && data.education[0].institution) fields.push('education');
      if (data.certifications && data.certifications.length > 0 && data.certifications[0].title) fields.push('certifications');
      setParsedFields(fields);

      setStep(3);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error parsing resume details. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const handlePersistentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const currentCategory = category || careerProfile?.professionCategory || 'General Professional';

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds the 5MB limit.');
      return;
    }

    const nameLower = file.name.toLowerCase();
    if (!nameLower.endsWith('.pdf') && !nameLower.endsWith('.docx')) {
      alert('Unsupported file type. Please upload a PDF or DOCX file.');
      return;
    }

    setIsParsing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const data = await parseResumeFileAction(formData, currentCategory);

      const dataWithCategory = {
        ...careerProfile,
        ...data,
        professionCategory: currentCategory,
        personalInfo: {
          ...careerProfile.personalInfo,
          ...data.personalInfo,
          fullName: data.personalInfo?.fullName || careerProfile.personalInfo?.fullName || userName,
          email: data.personalInfo?.email || careerProfile.personalInfo?.email || userEmail,
          phone: data.personalInfo?.phone || careerProfile.personalInfo?.phone || '',
          location: data.personalInfo?.location || careerProfile.personalInfo?.location || '',
          github: data.personalInfo?.github || careerProfile.personalInfo?.github || '',
          linkedin: data.personalInfo?.linkedin || careerProfile.personalInfo?.linkedin || '',
          website: data.personalInfo?.website || careerProfile.personalInfo?.website || ''
        }
      };

      if (!dataWithCategory.education || dataWithCategory.education.length === 0) {
        dataWithCategory.education = [{ institution: '', degree: '', specialization: '', startYear: '', endYear: '', cgpa: '' }];
      }
      if (!dataWithCategory.certifications || dataWithCategory.certifications.length === 0) {
        dataWithCategory.certifications = [{ title: '', issuer: '', issueDate: '', credentialUrl: '' }];
      }

      setCareerProfile(dataWithCategory);

      const projAnswers = (data.projects || []).map((proj: any) => ({
        title: proj.name,
        intendedUser: '',
        technicalChallenge: '',
        proudOf: '',
        technologies: proj.technologies ? proj.technologies.join(', ') : '',
        problemSolved: proj.problemSolved || '',
        measurableResults: proj.impact || ''
      }));

      const expAnswers = (data.experience || []).map((exp: any) => {
        const isLeader = exp.position.toLowerCase().includes('lead') || 
                          exp.position.toLowerCase().includes('manager') || 
                          exp.position.toLowerCase().includes('head') || 
                          exp.position.toLowerCase().includes('founder') || 
                          exp.position.toLowerCase().includes('director');
        
        return {
          company: exp.company,
          position: exp.position,
          responsibilities: '',
          achievement: '',
          processImproved: '',
          ledTeam: isLeader,
          teamSize: isLeader ? 3 : 0,
          outcome: ''
        };
      });

      setQuestionnaire({
        ...questionnaire,
        projects: projAnswers.length > 0 ? projAnswers : questionnaire.projects,
        experience: expAnswers.length > 0 ? expAnswers : questionnaire.experience,
      });

      const fields: string[] = [];
      if (data.personalInfo?.fullName) fields.push('fullName');
      if (data.personalInfo?.email) fields.push('email');
      if (data.personalInfo?.phone) fields.push('phone');
      if (data.personalInfo?.location) fields.push('location');
      if (data.personalInfo?.github) fields.push('github');
      if (data.personalInfo?.linkedin) fields.push('linkedin');
      if (data.personalInfo?.website) fields.push('website');
      if (data.summary) fields.push('summary');
      if (data.skills && data.skills.length > 0) fields.push('skills');
      if (data.experience && data.experience.length > 0) fields.push('experience');
      if (data.projects && data.projects.length > 0) fields.push('projects');
      if (data.education && data.education.length > 0 && data.education[0].institution) fields.push('education');
      if (data.certifications && data.certifications.length > 0 && data.certifications[0].title) fields.push('certifications');
      setParsedFields(fields);

    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error parsing resume details. Please try again.');
    } finally {
      setIsParsing(false);
    }
  };

  // Initialize Empty Profile (Step 1 -> Step 3)
  const handleInitializeEmptyProfile = (selectedCategory: ProfessionCategory) => {
    const emptyProfile = {
      userId: userId,
      professionCategory: selectedCategory,
      personalInfo: { fullName: userName, email: userEmail, phone: '', location: '', github: '', linkedin: '', website: '' },
      summary: '',
      skills: [{ name: '' }],
      education: [{ institution: '', degree: '', specialization: '', startYear: '', endYear: '', cgpa: '' }],
      experience: [{ company: '', position: '', startDate: '', endDate: '', currentlyWorking: false, description: '', achievements: [] }],
      projects: [{ name: '', description: '', technologies: [], problemSolved: '', impact: '', githubUrl: '', liveUrl: '' }],
      certifications: [{ title: '', issuer: '', issueDate: '', credentialUrl: '' }],
      achievements: [],
      extensions: {
        apis: [], openSource: [], behance: '', dribbble: '', tools: [],
        practiceAreas: [], cases: [], campaigns: [], growthMetrics: [],
        seoExperience: '', financialModels: [], research: [],
        dashboards: [], pipelines: [], hris: [], initiatives: [], methodologies: [],
        businessFrameworks: [], caseCompetitions: []
      }
    };
    setCareerProfile(emptyProfile);
    
    // Default questionnaire setup
    setQuestionnaire({
      projects: [],
      experience: [],
      leadership: { ledTeam: false, teamSize: 0, outcome: '' },
      general: { 
        targetRoles: selectedCategory || '', 
        strengths: '', 
        targetCompanies: '',
        careerStage: 'Mid-Level',
        primaryStrength: 'Technical Expertise',
        desiredImage: 'Innovative',
        careerGoal: 'Get Hired',
        stylePreference: 'Modern'
      }
    });

    setStep(3);
  };

  // Confirm and save data (Step 5 -> Finished)
  const handleConfirm = async (includeQuestionnaire: boolean) => {
    setLoading(true);
    setLoadingMessage('Building your premium resume layout, portfolio template, and interview kit...');
    
    try {
      const qAnswers = includeQuestionnaire ? questionnaire : null;
      await confirmOnboardingAction(userId, careerProfile, qAnswers);
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Error confirming profile details. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  
  const handleEditSave = async () => {
    setLoading(true);
    setLoadingMessage('Saving profile updates...');
    try {
      const { updateCareerProfileAction } = await import('@/app/(dashboard)/dashboard/actions');
      await updateCareerProfileAction(careerProfile);
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Error saving profile');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateAssets = async () => {
    setIsRegenerating(true);
    setLoadingMessage('Regenerating Interview Questions and insights...');
    try {
      const { regenerateAssetsAction } = await import('./actions');
      await regenerateAssetsAction(userId, careerProfile);
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Error regenerating assets');
    } finally {
      setIsRegenerating(false);
    }
  };

  // --- EDIT FORM HELPERS (STEP 3) ---

  const handleProfileChange = (field: string, val: string) => {
    setCareerProfile((prev: any) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: val }
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Profile photo size must be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      handleProfileChange('avatarUrl', base64);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    handleProfileChange('avatarUrl', '');
  };

  const handleSkillChange = (idx: number, val: string) => {
    const updated = [...careerProfile.skills];
    updated[idx] = { name: val };
    setCareerProfile((prev: any) => ({ ...prev, skills: updated }));
  };

  const addSkill = () => {
    setCareerProfile((prev: any) => ({ ...prev, skills: [...prev.skills, { name: '' }] }));
  };

  const deleteSkill = (idx: number) => {
    setCareerProfile((prev: any) => {
      const filtered = prev.skills.filter((_: any, i: number) => i !== idx);
      return { ...prev, skills: filtered.length > 0 ? filtered : [{ name: '' }] };
    });
  };

  const updateExperience = (idx: number, field: string, val: string) => {
    const updated = [...careerProfile.experience];
    updated[idx] = { ...updated[idx], [field]: val };
    setCareerProfile((prev: any) => ({ ...prev, experience: updated }));
  };

  const addExperience = () => {
    const itemId = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const newExp = { 
      id: itemId, 
      company: '', role: '', position: '', duration: '', location: '', 
      description: '', 
      discovery: {
        itemId,
        status: 'uninitiated',
        resolvedRole: '',
        context: null,
        selectedOptions: {},
        followUpSelections: {},
        additionalNotes: '',
        generatedBullets: '',
        insightCount: 0
      },
      discoveryData: undefined,
      achievements: [] 
    };
    setCareerProfile((prev: any) => ({ ...prev, experience: [...prev.experience, newExp] }));
  };

  const deleteExperience = (idx: number) => {
    setCareerProfile((prev: any) => ({ ...prev, experience: prev.experience.filter((_: any, i: number) => i !== idx) }));
  };

  const updateExpHighlight = (expIdx: number, highlightIdx: number, val: string) => {
    const updatedExps = [...careerProfile.experience];
    const updatedHighlights = [...updatedExps[expIdx].achievements];
    updatedHighlights[highlightIdx] = val;
    updatedExps[expIdx].achievements = updatedHighlights;
    setCareerProfile((prev: any) => ({ ...prev, experience: updatedExps }));
  };

  const addExpHighlight = (expIdx: number) => {
    const updated = [...careerProfile.experience];
    updated[expIdx].achievements.push('Add a quantified achievement (e.g. Optimized queries, improving response time by 15%)');
    setCareerProfile((prev: any) => ({ ...prev, experience: updated }));
  };

  const deleteExpHighlight = (expIdx: number, highlightIdx: number) => {
    const updated = [...careerProfile.experience];
    updated[expIdx].achievements = updated[expIdx].achievements.filter((_: any, i: number) => i !== highlightIdx);
    setCareerProfile((prev: any) => ({ ...prev, experience: updated }));
  };

  const updateProject = (projIdx: number, field: string, val: any) => {
    const updated = [...careerProfile.projects];
    updated[projIdx] = { ...updated[projIdx], [field]: val };
    setCareerProfile((prev: any) => ({ ...prev, projects: updated }));
  };

  const addProject = () => {
    const categoryName = careerProfile.professionCategory || 'General Professional';
    const ModuleConfig = ProfessionModuleRegistry[categoryName] || ProfessionModuleRegistry['General Professional'];
    const itemId = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const newProj = { 
      ...JSON.parse(JSON.stringify(ModuleConfig.defaultItem)), 
      id: itemId,
      title: '', name: '', description: '', 
      discovery: {
        itemId,
        status: 'uninitiated',
        resolvedRole: '',
        context: null,
        selectedOptions: {},
        followUpSelections: {},
        additionalNotes: '',
        generatedBullets: '',
        insightCount: 0
      },
      discoveryData: undefined 
    };
    setCareerProfile((prev: any) => ({ ...prev, projects: [...prev.projects, newProj] }));
  };

  const deleteProject = (idx: number) => {
    setCareerProfile((prev: any) => ({ ...prev, projects: prev.projects.filter((_: any, i: number) => i !== idx) }));
  };

  const updateEducation = (idx: number, field: string, val: any) => {
    const updated = [...careerProfile.education];
    updated[idx] = { ...updated[idx], [field]: val };
    setCareerProfile((prev: any) => ({ ...prev, education: updated }));
  };

  const addEducation = () => {
    const newEdu = { institution: 'New Institution', degree: '', fieldOfStudy: '', startDate: '', endDate: '', grade: '' };
    setCareerProfile((prev: any) => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const deleteEducation = (idx: number) => {
    setCareerProfile((prev: any) => ({ ...prev, education: prev.education.filter((_: any, i: number) => i !== idx) }));
  };

  const updateCertification = (idx: number, field: string, val: string) => {
    const updated = [...careerProfile.certifications];
    updated[idx] = { ...updated[idx], [field]: val };
    setCareerProfile((prev: any) => ({ ...prev, certifications: updated }));
  };

  const addCertification = () => {
    const newCert = { title: 'New Certification', issuer: '', issueDate: '', expiryDate: '', description: '' };
    setCareerProfile((prev: any) => ({ ...prev, certifications: [...prev.certifications, newCert] }));
  };

  const deleteCertification = (idx: number) => {
    setCareerProfile((prev: any) => ({ ...prev, certifications: prev.certifications.filter((_: any, i: number) => i !== idx) }));
  };



  // --- QUESTIONNAIRE INPUT HELPERS (STEP 4) ---

  const handleQuestProjChange = (projIdx: number, field: string, val: string) => {
    const updatedProjs = [...questionnaire.projects];
    updatedProjs[projIdx] = { ...updatedProjs[projIdx], [field]: val };
    setQuestionnaire((prev: any) => ({ ...prev, projects: updatedProjs }));
  };

  const handleQuestExpChange = (expIdx: number, field: string, val: any) => {
    const updatedExps = [...questionnaire.experience];
    updatedExps[expIdx] = { ...updatedExps[expIdx], [field]: val };
    setQuestionnaire((prev: any) => ({ ...prev, experience: updatedExps }));
  };

  const handleQuestLeadershipChange = (field: string, val: any) => {
    setQuestionnaire((prev: any) => ({
      ...prev,
      leadership: { ...prev.leadership, [field]: val }
    }));
  };

  const handleQuestGeneralChange = (field: string, val: string) => {
    setQuestionnaire((prev: any) => ({
      ...prev,
      general: { ...prev.general, [field]: val }
    }));
  };

  const updateExtensionArray = (field: string, idx: number, val: string) => {
    setCareerProfile((prev: any) => {
      const currentExtensions = prev.extensions || {};
      const currentArr = [...(currentExtensions[field] || [])];
      currentArr[idx] = val;
      return {
        ...prev,
        extensions: {
          ...currentExtensions,
          [field]: currentArr
        }
      };
    });
  };

  const addExtensionArrayItem = (field: string, defaultVal: string = '') => {
    setCareerProfile((prev: any) => {
      const currentExtensions = prev.extensions || {};
      const currentArr = [...(currentExtensions[field] || [])];
      currentArr.push(defaultVal);
      return {
        ...prev,
        extensions: {
          ...currentExtensions,
          [field]: currentArr
        }
      };
    });
  };

  const deleteExtensionArrayItem = (field: string, idx: number) => {
    setCareerProfile((prev: any) => {
      const currentExtensions = prev.extensions || {};
      const currentArr = (currentExtensions[field] || []).filter((_: any, i: number) => i !== idx);
      return {
        ...prev,
        extensions: {
          ...currentExtensions,
          [field]: currentArr
        }
      };
    });
  };

  const updateExtensionString = (field: string, val: string) => {
    setCareerProfile((prev: any) => {
      const currentExtensions = prev.extensions || {};
      return {
        ...prev,
        extensions: {
          ...currentExtensions,
          [field]: val
        }
      };
    });
  };

  return (
    <div className="relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center z-50 rounded-2xl min-h-[400px]">
          <Loader2 size={40} className="text-primary animate-spin mb-4" />
          <p className="font-serif text-lg font-medium text-primary text-center px-4 max-w-md">
            {loadingMessage}
          </p>
        </div>
      )}

      {/* STEP INDICATOR HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand">
            Step {step} of 5
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-semibold text-primary mt-1">
            {step === 1 && "Select your profession"}
            {step === 2 && "Upload or paste your resume"}
            {step === 3 && "Verify and review parsed data"}
            {step === 4 && "Enhance your profile questionnaire"}
            {step === 5 && "Launch your professional profile"}
          </h1>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <div 
              key={s} 
              className={`w-5 h-1.5 rounded-full ${step >= s ? 'bg-primary' : 'bg-warm-border'}`} 
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: PROFESSION SELECTION */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <p className="text-primary-light text-sm">
              We personalize your templates, copy improvements, and interview simulations based on your profession. Select yours below:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const IconComp = cat.icon;
                const isSelected = category === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setCategory(cat.name)}
                    className={`text-left p-5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-primary shadow-xs ring-1 ring-primary'
                        : 'bg-warm-bg border-warm-border hover:bg-white hover:border-warm-border-hover'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                      isSelected ? 'bg-primary text-white' : 'bg-white text-primary-light border border-warm-border'
                    }`}>
                      <IconComp size={18} />
                    </div>
                    <h3 className="font-semibold text-primary text-sm">{cat.name}</h3>
                    <p className="text-xs text-primary-light mt-1 leading-relaxed">
                      {cat.desc}
                    </p>
                  </button>
                );
              })}
            </div>
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                disabled={!category}
                onClick={() => handleInitializeEmptyProfile(category!)}
                className="flex items-center gap-2 py-3 px-6 rounded-xl font-semibold text-white bg-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-light transition-all cursor-pointer"
              >
                Continue
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: UPLOAD OR PASTE RESUME */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <p className="text-primary-light text-sm">
                Upload your existing resume file or paste raw text details. We will automatically parse and structure it.
              </p>
              <button
                type="button"
                onClick={loadSampleResume}
                className="text-xs text-brand font-semibold hover:text-brand-hover hover:underline transition-all flex items-center gap-1 cursor-pointer"
              >
                <Sparkles size={12} className="text-amber-500" />
                Use Sample Resume
              </button>
            </div>

            {/* Drag and Drop File Uploader Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all flex flex-col items-center justify-center min-h-[160px] ${
                isDragging 
                  ? 'border-primary bg-indigo-50/10' 
                  : 'border-warm-border bg-warm-bg/50 hover:bg-warm-bg'
              }`}
            >
              {uploadedFile ? (
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary mx-auto">
                    <FileText size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-primary">{uploadedFile.name}</p>
                    <p className="text-[10px] text-primary-light">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    type="button"
                    onClick={clearUploadedFile}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-red-500 hover:underline cursor-pointer"
                  >
                    <X size={12} /> Remove File
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-white border border-warm-border flex items-center justify-center text-primary-light mx-auto">
                    <Upload size={20} />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-primary cursor-pointer hover:underline">
                      Click to upload resume file
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".pdf,.docx,.txt" 
                        onChange={handleFileSelect} 
                      />
                    </label>
                    <span className="text-sm text-primary-light"> or drag & drop here</span>
                  </div>
                  <p className="text-[10px] text-primary-light">Supports PDF, DOCX, or TXT (Max 5MB)</p>
                </div>
              )}
            </div>

            {/* Pasted Text area fallback */}
            {!uploadedFile && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-light block">Or Paste Resume Text Details</span>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder={`Paste details here...\n\ne.g.,\nAlex Mercer | alex@gmail.com\n\nEXPERIENCE:\nSoftware Intern at Nexus...\n\nSKILLS:\nReact, Next.js, Node...`}
                  rows={8}
                  className="w-full p-4 rounded-xl bg-warm-bg border border-warm-border text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:border-primary transition-colors resize-none font-mono leading-relaxed"
                />
              </div>
            )}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="py-3 px-6 rounded-xl font-semibold text-primary border border-warm-border hover:bg-warm-bg transition-all cursor-pointer"
              >
                Skip Upload
              </button>
              <button
                type="button"
                onClick={handleParse}
                className="flex items-center gap-2 py-3 px-6 rounded-xl font-semibold text-white bg-primary hover:bg-primary-light transition-all cursor-pointer"
              >
                Extract Data
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: MANDATORY REVIEW & EDIT */}
        {step === 3 && careerProfile && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Partial extraction warning banner */}
            {careerProfile.isPartialExtraction && (
              <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex gap-3 text-orange-900 text-xs">
                <AlertTriangle className="text-orange-500 shrink-0 mt-0.5" size={16} />
                <div>
                  <span className="font-semibold block">Partial Extraction Detected</span>
                  We couldn&apos;t confidently detect all sections from your resume. The fields we found are pre-filled below — please review and complete any missing information before continuing.
                </div>
              </div>
            )}
            
            
            
            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif font-semibold text-primary">{isEditMode ? 'Edit Your Profile' : 'Your Career Profile'}</h2>
            </div>

            {/* Persistent Resume Upload Card */}
            <div className="bg-slate-900 border border-indigo-500/20 rounded-2xl p-5 shadow-lg text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                  <UploadCloud size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Upload Your Resume</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Automatically parse and pre-populate your profile details. Accepts PDF and DOCX (Max 5MB).
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-center">
                {isParsing ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 bg-indigo-500/5 px-4 py-2.5 rounded-xl border border-indigo-500/10">
                    <span className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
                    <span>Reading your resume...</span>
                  </div>
                ) : (
                  <label className="py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 cursor-pointer shadow-md shadow-indigo-600/20 transition-all">
                    Upload Resume
                    <input 
                      type="file" 
                      accept=".pdf,.docx" 
                      onChange={handlePersistentUpload} 
                      className="hidden" 
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-8">
              
              {/* Personal Info */}
              <div className="bg-white/40 border border-warm-border rounded-xl p-5">
                <div className="flex items-center gap-2 border-b border-warm-border pb-2 mb-4">
                  <User size={16} className="text-brand" />
                  <h3 className="font-bold text-sm text-primary">Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">
                      Full Name
                      {parsedFields.includes('fullName') && <span className="ml-2 text-[8px] bg-indigo-500/10 text-indigo-500 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider normal-case">from resume</span>}
                    </label>
                    <input value={careerProfile.personalInfo?.fullName || ''} onChange={(e) => handleProfileChange('fullName', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="flex items-center text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">
                      Email Address
                      {parsedFields.includes('email') && <span className="ml-2 text-[8px] bg-indigo-500/10 text-indigo-500 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider normal-case">from resume</span>}
                    </label>
                    <input value={careerProfile.personalInfo?.email || ''} onChange={(e) => handleProfileChange('email', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="flex items-center text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">
                      Phone Number
                      {parsedFields.includes('phone') && <span className="ml-2 text-[8px] bg-indigo-500/10 text-indigo-500 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider normal-case">from resume</span>}
                    </label>
                    <input value={careerProfile.personalInfo?.phone || ''} onChange={(e) => handleProfileChange('phone', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="flex items-center text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">
                      Location
                      {parsedFields.includes('location') && <span className="ml-2 text-[8px] bg-indigo-500/10 text-indigo-500 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider normal-case">from resume</span>}
                    </label>
                    <input value={careerProfile.personalInfo?.location || ''} onChange={(e) => handleProfileChange('location', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="flex items-center text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">
                      <span>{(() => {
                        const p = (careerProfile.professionCategory || '').toLowerCase();
                        if (p.includes('developer') || p.includes('dev') || p.includes('software')) return 'GitHub Profile URL';
                        if (p.includes('designer') || p.includes('design')) return 'Figma / Behance / Dribbble URL';
                        if (p.includes('data')) return 'Kaggle / GitHub URL';
                        if (p.includes('hr')) return 'Blog / Articles / Publication URL (Optional)';
                        if (p.includes('finance')) return 'Credentials / Professional Association URL';
                        if (p.includes('marketing')) return 'Campaign Portfolio / Case Study URL';
                        if (p.includes('mba') || p.includes('business')) return 'Case Competition / Project Portfolio URL';
                        if (p.includes('law')) return 'Firm Profile / Publications URL';
                        return 'LinkedIn / Professional Profile URL';
                      })()}</span>
                      {parsedFields.includes('github') && <span className="ml-2 text-[8px] bg-indigo-500/10 text-indigo-500 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider normal-case">from resume</span>}
                    </label>
                    <input 
                      value={careerProfile.personalInfo?.github || ''} 
                      onChange={(e) => handleProfileChange('github', e.target.value)} 
                      placeholder={(() => {
                        const p = (careerProfile.professionCategory || '').toLowerCase();
                        if (p.includes('developer') || p.includes('dev') || p.includes('software')) return 'github.com/username';
                        if (p.includes('designer') || p.includes('design')) return 'behance.net/username or figma.com/@username';
                        if (p.includes('data')) return 'kaggle.com/username or github.com/username';
                        if (p.includes('hr')) return 'medium.com/@username (or leave blank)';
                        if (p.includes('finance')) return 'association-profile-link-or-linkedin-url';
                        if (p.includes('marketing')) return 'behance.net/username or portfolio-link';
                        return 'https://...';
                      })()}
                      className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" 
                    />
                  </div>
                  <div>
                    <label className="flex items-center text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">
                      LinkedIn URL
                      {parsedFields.includes('linkedin') && <span className="ml-2 text-[8px] bg-indigo-500/10 text-indigo-500 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider normal-case">from resume</span>}
                    </label>
                    <input value={careerProfile.personalInfo?.linkedin || ''} onChange={(e) => handleProfileChange('linkedin', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-2">Profile Photo (Optional)</label>
                    <div className="flex items-center gap-4">
                      {careerProfile.personalInfo?.avatarUrl ? (
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-warm-border group shadow-sm bg-warm-bg">
                          <img
                            src={careerProfile.personalInfo.avatarUrl}
                            alt="Profile Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200 cursor-pointer"
                            title="Remove Photo"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl border border-dashed border-warm-border bg-warm-bg flex items-center justify-center text-primary-light shadow-2xs">
                          <User size={20} />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          id="photo-upload-input"
                        />
                        <label
                          htmlFor="photo-upload-input"
                          className="px-3 py-1 border border-warm-border rounded-lg text-[10px] font-semibold text-primary bg-white hover:bg-warm-bg cursor-pointer transition-colors shadow-2xs inline-block text-center"
                        >
                          {careerProfile.personalInfo?.avatarUrl ? 'Change' : 'Upload'}
                        </label>
                        <p className="text-[9px] text-primary-light mt-1">PNG, JPG, WEBP (Max 2MB)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white/40 border border-warm-border rounded-xl p-5">
                <div className="flex items-center gap-2 border-b border-warm-border pb-2 mb-4">
                  <FileText size={16} className="text-brand" />
                  <h3 className="flex items-center gap-2 font-bold text-sm text-primary">
                    Professional Summary
                    {parsedFields.includes('summary') && <span className="text-[8px] bg-indigo-500/10 text-indigo-500 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider normal-case">from resume</span>}
                  </h3>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Executive Summary</label>
                  <textarea value={careerProfile.summary || ''} onChange={(e) => setCareerProfile({...careerProfile, summary: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary min-h-[100px] resize-y"></textarea>
                  <SummaryAssistant 
                    careerProfile={careerProfile}
                    summaryText={careerProfile.summary || ''}
                    onUpdateSummary={(newSummary) => setCareerProfile({ ...careerProfile, summary: newSummary })}
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white/40 border border-warm-border rounded-xl p-5">
                <div className="flex items-center justify-between border-b border-warm-border pb-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-brand" />
                    <h3 className="flex items-center gap-2 font-bold text-sm text-primary">
                      Skills & Technologies
                      {parsedFields.includes('skills') && <span className="text-[8px] bg-indigo-500/10 text-indigo-500 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider normal-case">from resume</span>}
                    </h3>
                  </div>
                  <button onClick={addSkill} className="flex items-center gap-1 text-[11px] font-semibold text-brand hover:text-brand-hover bg-brand/5 px-2 py-1 rounded-md transition-all"><Plus size={12} /> Add Skill</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {careerProfile.skills?.map((skill: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-1 bg-white border border-warm-border rounded-lg pl-2 pr-1 py-1 shadow-xs">
                      <input value={skill.name || ''} onChange={(e) => handleSkillChange(idx, e.target.value)} className="bg-transparent outline-none text-xs w-20 focus:w-28 transition-all text-primary font-medium" />
                      <button onClick={() => deleteSkill(idx)} className="p-1 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"><X size={12} /></button>
                    </div>
                  ))}
                </div>
                <SkillAssistant
                  professionCategory={careerProfile.professionCategory || ''}
                  currentSkills={careerProfile.skills || []}
                  onAddSkill={(skillName) => {
                    const exists = careerProfile.skills?.some((s: any) => s.name?.toLowerCase() === skillName.toLowerCase());
                    if (exists) return;

                    const emptyIndex = (careerProfile.skills || []).findIndex((s: any) => !s.name || s.name.trim() === '');
                    if (emptyIndex !== -1) {
                      const updated = [...(careerProfile.skills || [])];
                      updated[emptyIndex] = { name: skillName };
                      setCareerProfile({ ...careerProfile, skills: updated });
                    } else {
                      setCareerProfile({ ...careerProfile, skills: [...(careerProfile.skills || []), { name: skillName }] });
                    }
                  }}
                  onRemoveSkill={(skillName) => {
                    const filtered = (careerProfile.skills || []).filter((s: any) => s.name?.toLowerCase() !== skillName.toLowerCase());
                    const updated = filtered.length > 0 ? filtered : [{ name: '' }];
                    setCareerProfile({ 
                      ...careerProfile, 
                      skills: updated 
                    });
                  }}
                />
              </div>

              {/* Experience */}
              <div className="bg-white/40 border border-warm-border rounded-xl p-5">
                <div className="flex items-center justify-between border-b border-warm-border pb-2 mb-4">
                  <div className="flex items-center gap-3">
                    <Briefcase size={16} className="text-brand" />
                    <h3 className="flex items-center gap-2 font-bold text-sm text-primary">
                      Work Experience
                      {parsedFields.includes('experience') && <span className="text-[8px] bg-indigo-500/10 text-indigo-500 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider normal-case">from resume</span>}
                    </h3>
                    {Object.keys(expErrors).length > 0 && (
                      <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full animate-in fade-in flex items-center gap-1 shadow-2xs">
                        <AlertTriangle size={12} className="text-red-500" /> Please enter the title first
                      </span>
                    )}
                  </div>
                  <button onClick={addExperience} className="flex items-center gap-1 text-[11px] font-semibold text-brand hover:text-brand-hover bg-brand/5 px-2 py-1 rounded-md transition-all"><Plus size={12} /> Add Role</button>
                </div>
                <div className="space-y-4">
                  {careerProfile.experience?.map((exp: any, idx: number) => (
                    <div key={idx} className="relative p-4 border border-warm-border rounded-lg bg-white/60 group">
                      <button onClick={() => deleteExperience(idx)} className="absolute top-4 right-4 p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 pr-8">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider">Job Title</label>
                            {expErrors[idx] && (
                              <span className="text-[10px] font-bold text-red-500 animate-in fade-in flex items-center gap-1">
                                <AlertTriangle size={11} /> Please enter the title first
                              </span>
                            )}
                          </div>
                          <div className="relative">
                            <input 
                              placeholder={(() => {
                                const p = (careerProfile.professionCategory || '').toLowerCase();
                                if (p.includes('developer') || p.includes('dev') || p.includes('software')) return 'e.g. Software Engineer';
                                if (p.includes('designer') || p.includes('design')) return 'e.g. UI/UX Designer';
                                if (p.includes('data')) return 'e.g. Data Analyst';
                                if (p.includes('hr')) return 'e.g. Talent Acquisition Specialist';
                                if (p.includes('finance')) return 'e.g. Financial Analyst';
                                if (p.includes('marketing')) return 'e.g. Growth Marketer';
                                if (p.includes('mba') || p.includes('business')) return 'e.g. Product Manager';
                                if (p.includes('law')) return 'e.g. Legal Counsel';
                                return 'e.g. Project Manager';
                              })()}
                              value={exp.role ?? exp.position ?? ''} 
                              onChange={(e) => {
                                updateExperience(idx, 'role', e.target.value);
                                if (e.target.value.trim()) {
                                  setExpErrors(prev => { const n = { ...prev }; delete n[idx]; return n; });
                                }
                              }} 
                              onFocus={() => setActiveDropdownIdx(idx)}
                              onBlur={() => setTimeout(() => setActiveDropdownIdx(null), 200)}
                              className={`w-full px-3 py-2 rounded-lg bg-warm-bg border text-xs text-primary focus:outline-none ${
                                expErrors[idx] ? 'border-red-400 bg-red-50/20' : 'border-warm-border focus:border-primary'
                              }`} 
                            />
                            
                            {activeDropdownIdx === idx && (
                              <div className="absolute left-0 right-0 mt-1 bg-white border border-warm-border rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-100">
                                {(() => {
                                  const typedValue = (exp.role ?? exp.position ?? '').toLowerCase().trim();
                                  
                                  const mapCategoryToCatalogKey = (category: string): string => {
                                    const c = (category || '').toLowerCase();
                                    if (c.includes('developer') || c.includes('dev') || c.includes('software')) return 'developer';
                                    if (c.includes('designer') || c.includes('design')) return 'designer';
                                    if (c.includes('data')) return 'data';
                                    if (c.includes('mba') || c.includes('business')) return 'mba';
                                    if (c.includes('marketing')) return 'marketing';
                                    if (c.includes('law')) return 'law';
                                    if (c.includes('hr')) return 'hr';
                                    if (c.includes('finance')) return 'finance';
                                    return 'general';
                                  };
                                  
                                  const catalogKey = mapCategoryToCatalogKey(careerProfile.professionCategory);
                                  const categoryRoles = ROLE_CATALOG[catalogKey] || [];
                                  const allRoles = Object.values(ROLE_CATALOG).flat();
                                  
                                  let filtered: string[] = [];
                                  if (typedValue === '') {
                                    filtered = categoryRoles;
                                  } else {
                                    const matchedCategoryRoles = categoryRoles.filter(role => role.toLowerCase().includes(typedValue));
                                    const matchedOtherRoles = allRoles.filter(role => 
                                      !categoryRoles.includes(role) && role.toLowerCase().includes(typedValue)
                                    );
                                    filtered = [...matchedCategoryRoles, ...matchedOtherRoles];
                                  }
                                  
                                  const finalSuggestions = filtered.slice(0, 6);
                                  
                                  if (finalSuggestions.length === 0) {
                                    return (
                                      <div className="px-3 py-2 text-[10px] text-primary-light italic text-center">
                                        Type to add custom job title...
                                      </div>
                                    );
                                  }
                                  
                                  return finalSuggestions.map((role, rIdx) => (
                                    <button
                                      key={rIdx}
                                      type="button"
                                      onMouseDown={() => {
                                        updateExperience(idx, 'role', role);
                                        if (role.trim()) {
                                          setExpErrors(prev => { const n = { ...prev }; delete n[idx]; return n; });
                                        }
                                      }}
                                      className="w-full text-left px-3.5 py-2 text-[11px] text-primary hover:bg-warm-bg transition-colors font-medium border-b border-warm-border/40 last:border-b-0 cursor-pointer"
                                    >
                                      {role}
                                    </button>
                                  ));
                                })()}
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">
                            {careerProfile.professionCategory?.toLowerCase().includes('law') ? 'Company / Court Name' : 'Company'}
                          </label>
                          <input placeholder={careerProfile.professionCategory?.toLowerCase().includes('law') ? "e.g. Acme Corp / District Court" : "e.g. Acme Corp"} value={exp.company ?? ''} onChange={(e) => updateExperience(idx, 'company', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Duration</label>
                          <input value={exp.duration || ''} onChange={(e) => updateExperience(idx, 'duration', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Location</label>
                          <input value={exp.location || ''} onChange={(e) => updateExperience(idx, 'location', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
                        </div>
                      </div>
                      <div>
                        {(exp.discovery?.status === 'completed' || exp.discoveryData) && (
                          <div className="mb-3 p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between shadow-2xs">
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                <Check size={11} /> Experience Profile Completed ✓
                              </span>
                              <span className="text-xs font-semibold text-emerald-900">
                                {exp.discovery?.insightCount ?? exp.discoveryData?.insightCount ?? 8} insights collected
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                type="button" 
                                onClick={() => {
                                  const title = (exp.role ?? exp.position ?? '').trim();
                                  if (!title) {
                                    setExpErrors(prev => ({ ...prev, [idx]: 'Please enter the title first' }));
                                    return;
                                  }
                                  setExpErrors(prev => { const n = { ...prev }; delete n[idx]; return n; });
                                  setActiveInterviewModal({ type: 'experience', idx });
                                }}
                                className="flex items-center gap-1 text-xs font-bold text-brand hover:text-brand-hover bg-white border border-brand/20 hover:bg-brand/5 px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-2xs"
                              >
                                <Sparkles size={12} /> Refine
                              </button>
                              <button 
                                type="button" 
                                onClick={() => handleEnhanceExperience(idx)}
                                className="flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-2xs"
                              >
                                <Wand2 size={12} /> Enhance Experience
                              </button>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider">Description & Achievements</label>
                          <div className="flex items-center gap-2">
                            {!(exp.discovery?.status === 'completed' || exp.discoveryData) && (
                              <button 
                                type="button" 
                                onClick={() => {
                                  const title = (exp.role ?? exp.position ?? '').trim();
                                  if (!title) {
                                    setExpErrors(prev => ({ ...prev, [idx]: 'Please enter the title first' }));
                                    return;
                                  }
                                  setExpErrors(prev => { const n = { ...prev }; delete n[idx]; return n; });
                                  setActiveInterviewModal({ type: 'experience', idx });
                                }}
                                className="flex items-center gap-1 text-[10px] font-bold text-brand hover:text-brand-hover bg-brand/10 hover:bg-brand/20 px-2.5 py-0.5 rounded-md transition-all cursor-pointer"
                              >
                                <Sparkles size={11} /> ✨ Tell Us About This Role
                              </button>
                            )}
                            {exp.description && !(exp.discovery?.status === 'completed' || exp.discoveryData) && (
                              <button 
                                type="button" 
                                onClick={() => handleEnhanceExperience(idx)}
                                className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-0.5 rounded-md transition-all cursor-pointer"
                              >
                                <Wand2 size={11} /> ✨ Enhance Experience
                              </button>
                            )}
                          </div>
                        </div>
                        <textarea value={exp.description || ''} onChange={(e) => updateExperience(idx, 'description', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary min-h-[80px] resize-y"></textarea>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Showcase Module */}
              <div className="bg-white/40 border border-warm-border rounded-xl p-5">
                <div className="flex items-center justify-between border-b border-warm-border pb-2 mb-4">
                  <div className="flex items-center gap-3">
                    <Code size={16} className="text-brand" />
                    <h3 className="flex items-center gap-2 font-bold text-sm text-primary">
                      <span>{ProfessionModuleRegistry[careerProfile.professionCategory || 'General Professional']?.label || 'Professional Showcase'}</span>
                      {parsedFields.includes('projects') && <span className="text-[8px] bg-indigo-500/10 text-indigo-500 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider normal-case">from resume</span>}
                    </h3>
                    {Object.keys(projErrors).length > 0 && (
                      <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full animate-in fade-in flex items-center gap-1 shadow-2xs">
                        <AlertTriangle size={12} className="text-red-500" /> Please enter the title first
                      </span>
                    )}
                  </div>
                  <button onClick={addProject} className="flex items-center gap-1 text-[11px] font-semibold text-brand hover:text-brand-hover bg-brand/5 px-2 py-1 rounded-md transition-all"><Plus size={12} /> Add Item</button>
                </div>
                <div className="space-y-4">
                  {careerProfile.projects?.map((proj: any, idx: number) => {
                    const categoryName = careerProfile.professionCategory || 'General Professional';
                    const ModuleConfig = ProfessionModuleRegistry[categoryName] || ProfessionModuleRegistry['General Professional'];
                    const ExtraFieldsComponent = ModuleConfig.component;
                    
                    return (
                      <div key={idx} className="relative p-4 border border-warm-border rounded-lg bg-white/60 group">
                        <button onClick={() => deleteProject(idx)} className="absolute top-4 right-4 p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 pr-8">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider">Title</label>
                              {projErrors[idx] && (
                                <span className="text-[10px] font-bold text-red-500 animate-in fade-in flex items-center gap-1">
                                  <AlertTriangle size={11} /> Please enter the title first
                                </span>
                              )}
                            </div>
                            <div className="relative">
                              <input 
                                placeholder={(() => {
                                  const p = (careerProfile.professionCategory || '').toLowerCase();
                                  if (p.includes('developer') || p.includes('dev') || p.includes('software')) return 'e.g. E-Commerce Platform';
                                  if (p.includes('designer') || p.includes('design')) return 'e.g. Mobile Banking App UX';
                                  if (p.includes('data')) return 'e.g. Customer Churn Prediction Model';
                                  if (p.includes('hr')) return 'e.g. Diversity & Inclusion Training';
                                  if (p.includes('finance')) return 'e.g. Valuation & LBO Model';
                                  if (p.includes('marketing')) return 'e.g. Product Launch Growth Campaign';
                                  if (p.includes('mba') || p.includes('business')) return 'e.g. Market Expansion GTM Strategy';
                                  if (p.includes('law')) return 'e.g. Commercial SLA Compliance Audit';
                                  return 'e.g. Operations Optimization Project';
                                })()}
                                value={proj.title || proj.name || ''} 
                                onChange={(e) => {
                                  updateProject(idx, 'title', e.target.value);
                                  if (e.target.value.trim()) {
                                    setProjErrors(prev => { const n = { ...prev }; delete n[idx]; return n; });
                                  }
                                }} 
                                onFocus={() => setActiveProjectDropdownIdx(idx)}
                                onBlur={() => setTimeout(() => setActiveProjectDropdownIdx(null), 200)}
                                className={`w-full px-3 py-2 rounded-lg bg-warm-bg border text-xs text-primary focus:outline-none ${
                                  projErrors[idx] ? 'border-red-400 bg-red-50/20' : 'border-warm-border focus:border-primary'
                                }`} 
                              />
                              
                              {activeProjectDropdownIdx === idx && (
                                <div className="absolute left-0 right-0 mt-1 bg-white border border-warm-border rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-100">
                                  {(() => {
                                    const typedValue = (proj.title || proj.name || '').toLowerCase().trim();
                                    
                                    const mapCategoryToCatalogKey = (category: string): string => {
                                      const c = (category || '').toLowerCase();
                                      if (c.includes('developer') || c.includes('dev') || c.includes('software')) return 'developer';
                                      if (c.includes('designer') || c.includes('design')) return 'designer';
                                      if (c.includes('data')) return 'data';
                                      if (c.includes('mba') || c.includes('business')) return 'mba';
                                      if (c.includes('marketing')) return 'marketing';
                                      if (c.includes('law')) return 'law';
                                      if (c.includes('hr')) return 'hr';
                                      if (c.includes('finance')) return 'finance';
                                      return 'general';
                                    };
                                    
                                    const catalogKey = mapCategoryToCatalogKey(careerProfile.professionCategory);
                                    const categoryProjects = PROJECT_CATALOG[catalogKey] || [];
                                    const allProjects = Object.values(PROJECT_CATALOG).flat();
                                    
                                    let filtered: string[] = [];
                                    if (typedValue === '') {
                                      filtered = categoryProjects;
                                    } else {
                                      const matchedCategoryProjects = categoryProjects.filter(title => title.toLowerCase().includes(typedValue));
                                      const matchedOtherProjects = allProjects.filter(title => 
                                        !categoryProjects.includes(title) && title.toLowerCase().includes(typedValue)
                                      );
                                      filtered = [...matchedCategoryProjects, ...matchedOtherProjects];
                                    }
                                    
                                    const finalSuggestions = filtered.slice(0, 6);
                                    
                                    if (finalSuggestions.length === 0) {
                                      return (
                                        <div className="px-3 py-2 text-[10px] text-primary-light italic text-center">
                                          Type to add custom project title...
                                        </div>
                                      );
                                    }
                                    
                                    return finalSuggestions.map((title, pIdx) => (
                                      <button
                                        key={pIdx}
                                        type="button"
                                        onMouseDown={() => {
                                          updateProject(idx, 'title', title);
                                          if (title.trim()) {
                                            setProjErrors(prev => { const n = { ...prev }; delete n[idx]; return n; });
                                          }
                                        }}
                                        className="w-full text-left px-3.5 py-2 text-[11px] text-primary hover:bg-warm-bg transition-colors font-medium border-b border-warm-border/40 last:border-b-0 cursor-pointer"
                                      >
                                        {title}
                                      </button>
                                    ));
                                  })()}
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Link / URL</label>
                            <input value={proj.link || proj.supportingUrl || ''} onChange={(e) => updateProject(idx, 'link', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
                          </div>
                          <ExtraFieldsComponent item={proj} idx={idx} updateField={updateProject} />
                        </div>
                        <div>
                        {(proj.discovery?.status === 'completed' || proj.discoveryData) && (
                          <div className="mb-3 p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between shadow-2xs">
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                <Check size={11} /> Project Profile Completed ✓
                              </span>
                              <span className="text-xs font-semibold text-emerald-900">
                                {proj.discovery?.insightCount ?? proj.discoveryData?.insightCount ?? 6} project insights collected
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                type="button" 
                                onClick={() => {
                                  const title = (proj.title ?? proj.name ?? '').trim();
                                  if (!title) {
                                    setProjErrors(prev => ({ ...prev, [idx]: 'Please enter the title first' }));
                                    return;
                                  }
                                  setProjErrors(prev => { const n = { ...prev }; delete n[idx]; return n; });
                                  setActiveInterviewModal({ type: 'project', idx });
                                }}
                                className="flex items-center gap-1 text-xs font-bold text-brand hover:text-brand-hover bg-white border border-brand/20 hover:bg-brand/5 px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-2xs"
                              >
                                <Sparkles size={12} /> Refine
                              </button>
                              <button 
                                type="button" 
                                onClick={() => handleEnhanceProject(idx)}
                                className="flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-2xs"
                              >
                                <Wand2 size={12} /> Enhance Project
                              </button>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider">Description & Details</label>
                          <div className="flex items-center gap-2">
                            {!(proj.discovery?.status === 'completed' || proj.discoveryData) && (
                              <button 
                                type="button" 
                                onClick={() => {
                                  const title = (proj.title ?? proj.name ?? '').trim();
                                  if (!title) {
                                    setProjErrors(prev => ({ ...prev, [idx]: 'Please enter the title first' }));
                                    return;
                                  }
                                  setProjErrors(prev => { const n = { ...prev }; delete n[idx]; return n; });
                                  setActiveInterviewModal({ type: 'project', idx });
                                }}
                                className="flex items-center gap-1 text-[10px] font-bold text-brand hover:text-brand-hover bg-brand/10 hover:bg-brand/20 px-2.5 py-0.5 rounded-md transition-all cursor-pointer"
                              >
                                <Sparkles size={11} /> ✨ Let's Explore This Project
                              </button>
                            )}
                            {proj.description && !(proj.discovery?.status === 'completed' || proj.discoveryData) && (
                              <button 
                                type="button" 
                                onClick={() => handleEnhanceProject(idx)}
                                className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-0.5 rounded-md transition-all cursor-pointer"
                              >
                                <Wand2 size={11} /> ✨ Enhance Project
                              </button>
                            )}
                          </div>
                        </div>
                        <textarea value={proj.description || ''} onChange={(e) => updateProject(idx, 'description', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary min-h-[80px] resize-y"></textarea>
                      </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Education */}
              <div className="bg-white/40 border border-warm-border rounded-xl p-5">
                <div className="flex items-center justify-between border-b border-warm-border pb-2 mb-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap size={16} className="text-brand" />
                    <h3 className="flex items-center gap-2 font-bold text-sm text-primary">
                      Education
                      {parsedFields.includes('education') && <span className="text-[8px] bg-indigo-500/10 text-indigo-500 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider normal-case">from resume</span>}
                    </h3>
                  </div>
                  <button onClick={addEducation} className="flex items-center gap-1 text-[11px] font-semibold text-brand hover:text-brand-hover bg-brand/5 px-2 py-1 rounded-md transition-all"><Plus size={12} /> Add Education</button>
                </div>
                <div className="space-y-4">
                  {careerProfile.education?.map((edu: any, idx: number) => (
                    <div key={idx} className="relative p-4 border border-warm-border rounded-lg bg-white/60 group">
                      <button onClick={() => deleteEducation(idx)} className="absolute top-4 right-4 p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                        <div>
                          <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Degree</label>
                          <div className="relative">
                            <input 
                              placeholder="e.g. Bachelor of Computer Applications (BCA)"
                              value={edu.degree || ''} 
                              onChange={(e) => updateEducation(idx, 'degree', e.target.value)} 
                              onFocus={() => setActiveDegreeDropdownIdx(idx)}
                              onBlur={() => setTimeout(() => setActiveDegreeDropdownIdx(null), 200)}
                              className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" 
                            />
                            
                            {activeDegreeDropdownIdx === idx && (
                              <div className="absolute left-0 right-0 mt-1 bg-white border border-warm-border rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-100">
                                {(() => {
                                  const typedValue = (edu.degree || '').toLowerCase().trim();
                                  
                                  const filtered = DEGREE_CATALOG.filter(d => 
                                    d.toLowerCase().includes(typedValue)
                                  );
                                  
                                  const finalSuggestions = filtered.slice(0, 6);
                                  
                                  if (finalSuggestions.length === 0) {
                                    return (
                                      <div className="px-3 py-2 text-[10px] text-primary-light italic text-center">
                                        Type to add custom degree...
                                      </div>
                                    );
                                  }
                                  
                                  return finalSuggestions.map((degree, dIdx) => (
                                    <button
                                      key={dIdx}
                                      type="button"
                                      onMouseDown={() => updateEducation(idx, 'degree', degree)}
                                      className="w-full text-left px-3.5 py-2 text-[11px] text-primary hover:bg-warm-bg transition-colors font-medium border-b border-warm-border/40 last:border-b-0 cursor-pointer"
                                    >
                                      {degree}
                                    </button>
                                  ));
                                })()}
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Institution</label>
                          <div className="relative">
                            <input 
                              placeholder="e.g. Stanford University"
                              value={edu.institution || ''} 
                              onChange={(e) => updateEducation(idx, 'institution', e.target.value)} 
                              onFocus={() => setActiveInstitutionDropdownIdx(idx)}
                              onBlur={() => setTimeout(() => setActiveInstitutionDropdownIdx(null), 200)}
                              className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" 
                            />
                            
                            {activeInstitutionDropdownIdx === idx && (
                              <div className="absolute left-0 right-0 mt-1 bg-white border border-warm-border rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-100">
                                {(() => {
                                  const typedValue = (edu.institution || '').toLowerCase().trim();
                                  
                                  const filtered = INSTITUTION_CATALOG.filter(i => 
                                    i.toLowerCase().includes(typedValue)
                                  );
                                  
                                  const finalSuggestions = filtered.slice(0, 6);
                                  
                                  if (finalSuggestions.length === 0) {
                                    return (
                                      <div className="px-3 py-2 text-[10px] text-primary-light italic text-center">
                                        Type to add custom institution...
                                      </div>
                                    );
                                  }
                                  
                                  return finalSuggestions.map((inst, iIdx) => (
                                    <button
                                      key={iIdx}
                                      type="button"
                                      onMouseDown={() => updateEducation(idx, 'institution', inst)}
                                      className="w-full text-left px-3.5 py-2 text-[11px] text-primary hover:bg-warm-bg transition-colors font-medium border-b border-warm-border/40 last:border-b-0 cursor-pointer"
                                    >
                                      {inst}
                                    </button>
                                  ));
                                })()}
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Graduation Year</label>
                          <input value={edu.year || ''} onChange={(e) => updateEducation(idx, 'year', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Location</label>
                          <input value={edu.location || ''} onChange={(e) => updateEducation(idx, 'location', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Certifications */}
            <div className="bg-white/40 border border-warm-border rounded-xl p-5 mb-8">
              <div className="flex items-center justify-between border-b border-warm-border pb-2 mb-4">
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-brand" />
                  <h3 className="flex items-center gap-2 font-bold text-sm text-primary">
                    Certifications
                    {parsedFields.includes('certifications') && <span className="text-[8px] bg-indigo-500/10 text-indigo-500 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider normal-case">from resume</span>}
                  </h3>
                </div>
                <button onClick={addCertification} className="flex items-center gap-1 text-[11px] font-semibold text-brand hover:text-brand-hover bg-brand/5 px-2 py-1 rounded-md transition-all"><Plus size={12} /> Add Certification</button>
              </div>
              <div className="space-y-4">
                {careerProfile.certifications?.map((cert: any, idx: number) => (
                  <div key={idx} className="relative p-4 border border-warm-border rounded-lg bg-white/60 group">
                    <button onClick={() => deleteCertification(idx)} className="absolute top-4 right-4 p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                      <div>
                        <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Title</label>
                        <input value={cert.title || ''} onChange={(e) => updateCertification(idx, 'title', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Issuer</label>
                        <input value={cert.issuer || ''} onChange={(e) => updateCertification(idx, 'issuer', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <CertificationAssistant
                professionCategory={careerProfile.professionCategory || ''}
                currentSkills={careerProfile.skills || []}
                currentCertifications={careerProfile.certifications || []}
                onAddCertification={(title) => {
                  const exists = careerProfile.certifications?.some((c: any) => c.title.toLowerCase() === title.toLowerCase());
                  if (!exists) {
                    setCareerProfile({ ...careerProfile, certifications: [...(careerProfile.certifications || []), { title, issuer: '', issueDate: '', credentialUrl: '' }] });
                  }
                }}
              />
            </div>

            {/* Business & Strategy Module (Executive Module) */}
            <div className="bg-white/40 border border-warm-border rounded-xl p-5 mb-8">
              <div className="flex items-center gap-2 border-b border-warm-border pb-2 mb-4">
                <Sparkles size={16} className="text-brand" />
                <h3 className="font-bold text-sm text-primary">Business & Strategy Module</h3>
              </div>
              
              <div className="space-y-6">
                {/* Business Frameworks */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider">Business & Strategic Frameworks</label>
                    <button type="button" onClick={() => addExtensionArrayItem('businessFrameworks', 'Framework (e.g. SWOT)')} className="text-[10px] font-semibold text-brand hover:underline flex items-center gap-0.5"><Plus size={10} /> Add Framework</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(careerProfile.extensions?.businessFrameworks || []).length === 0 ? (
                      <span className="text-xs text-primary-light italic block">None listed. Click add to list frameworks.</span>
                    ) : (
                      careerProfile.extensions?.businessFrameworks?.map((framework: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-1 bg-white border border-warm-border rounded-lg pl-2 pr-1 py-1 shadow-3xs">
                          <input value={framework} onChange={(e) => updateExtensionArray('businessFrameworks', idx, e.target.value)} className="bg-transparent outline-none text-xs w-28 text-primary font-medium focus:w-40 transition-all" />
                          <button type="button" onClick={() => deleteExtensionArrayItem('businessFrameworks', idx)} className="p-1 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"><X size={10} /></button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Case Competitions / Strategic Projects */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider">Case Competitions & Strategic Initiatives</label>
                    <button type="button" onClick={() => addExtensionArrayItem('caseCompetitions', 'Case/Project')} className="text-[10px] font-semibold text-brand hover:underline flex items-center gap-0.5"><Plus size={10} /> Add Case/Project</button>
                  </div>
                  <div className="space-y-2">
                    {(careerProfile.extensions?.caseCompetitions || []).length === 0 ? (
                      <span className="text-xs text-primary-light italic block">None listed.</span>
                    ) : (
                      careerProfile.extensions?.caseCompetitions?.map((comp: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-1 bg-white border border-warm-border rounded-lg pl-2 pr-1 py-1 shadow-3xs w-full">
                          <input value={comp} onChange={(e) => updateExtensionArray('caseCompetitions', idx, e.target.value)} className="bg-transparent outline-none text-xs text-primary font-medium w-full" />
                          <button type="button" onClick={() => deleteExtensionArrayItem('caseCompetitions', idx)} className="p-1 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors shrink-0"><X size={10} /></button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {isEditMode ? (
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-warm-border">
                <button type="button" onClick={() => router.push('/dashboard')} className="py-2.5 px-6 rounded-lg font-semibold text-sm text-primary border border-warm-border bg-white hover:bg-warm-bg transition-all cursor-pointer">
                  Cancel
                </button>
                <button type="button" onClick={handleEditSave} className="flex items-center gap-2 py-2.5 px-6 rounded-lg font-bold text-sm text-white bg-primary hover:bg-primary-light shadow-sm transition-all cursor-pointer">
                  Save and Continue
                  <CheckCircle2 size={14} />
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-warm-border">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-2.5 px-6 rounded-lg font-semibold text-sm text-primary border border-warm-border bg-white hover:bg-warm-bg transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="flex items-center gap-2 py-2.5 px-6 rounded-lg font-bold text-sm text-white bg-primary hover:bg-primary-light shadow-sm transition-all cursor-pointer"
                >
                  Continue to Questionnaire
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* STEP 4: INTERACTIVE QUESTIONNAIRE */}
        {step === 4 && careerProfile && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between bg-warm-bg border border-warm-border p-4 rounded-xl">
              <div className="flex items-center gap-2 text-xs text-primary-light">
                <Sparkles size={14} className="text-amber-500" />
                <span>Fill this skippable questionnaire to enrich your profile using AI storytelling.</span>
              </div>
              <button
                type="button"
                onClick={() => setStep(5)}
                className="text-xs text-brand font-bold hover:underline cursor-pointer"
              >
                Skip Questionnaire &rarr;
              </button>
            </div>

            <div className="bg-white/40 border border-warm-border rounded-xl p-5 min-h-[250px]">
              <div className="space-y-4 max-w-xl mx-auto">
                <div className="text-center mb-6">
                  <h4 className="font-serif font-semibold text-lg text-primary">Career Target Details</h4>
                  <p className="text-xs text-primary-light mt-1">
                    Help us align the tone of your resume summary and interview simulation to your target roles.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Target Roles</label>
                    <input
                      type="text"
                      value={questionnaire.general.targetRoles || ''}
                      onChange={(e) => handleQuestGeneralChange('targetRoles', e.target.value)}
                      placeholder="e.g. Frontend Engineer, Product Designer, Business Analyst"
                      className="w-full px-3 py-2.5 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Top Strengths / Recruiter Keywords</label>
                    <input
                      type="text"
                      value={questionnaire.general.strengths || ''}
                      onChange={(e) => handleQuestGeneralChange('strengths', e.target.value)}
                      placeholder="e.g. System Design, Agile Planning, SQL, Figma Prototyping"
                      className="w-full px-3 py-2.5 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Target Companies or Industries</label>
                    <input
                      type="text"
                      value={questionnaire.general.targetCompanies || ''}
                      onChange={(e) => handleQuestGeneralChange('targetCompanies', e.target.value)}
                      placeholder="e.g. High-growth B2B startups, healthcare technology companies"
                      className="w-full px-3 py-2.5 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Career Stage</label>
                      <select
                        value={questionnaire.general.careerStage || 'Mid-Level'}
                        onChange={(e) => handleQuestGeneralChange('careerStage', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary"
                      >
                        <option value="Student">Student</option>
                        <option value="Fresher">Fresher / Entry-Level</option>
                        <option value="Mid-Level">Mid-Level Professional</option>
                        <option value="Senior">Senior / Executive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Primary Strength</label>
                      <select
                        value={questionnaire.general.primaryStrength || 'Technical Expertise'}
                        onChange={(e) => handleQuestGeneralChange('primaryStrength', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary"
                      >
                        <option value="Technical Expertise">Technical Expertise</option>
                        <option value="Leadership">Leadership & Management</option>
                        <option value="Communication">Communication & Stakeholder Alignment</option>
                        <option value="Creativity">Creativity & Design Thinking</option>
                        <option value="Problem Solving">Problem Solving & Analytics</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Desired Professional Image</label>
                      <select
                        value={questionnaire.general.desiredImage || 'Innovative'}
                        onChange={(e) => handleQuestGeneralChange('desiredImage', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary"
                      >
                        <option value="Innovative">Innovative (Dynamic, cutting-edge)</option>
                        <option value="Reliable">Reliable (Structured, detail-oriented)</option>
                        <option value="Strategic">Strategic (Big picture, outcome-focused)</option>
                        <option value="Analytical">Analytical (Data-driven, precise)</option>
                        <option value="Executive">Executive (Polished, leader-like)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Career Goal</label>
                      <select
                        value={questionnaire.general.careerGoal || 'Get Hired'}
                        onChange={(e) => handleQuestGeneralChange('careerGoal', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary"
                      >
                        <option value="Get Hired">Get Hired (Full-time role)</option>
                        <option value="Freelance">Freelance / Contracting</option>
                        <option value="Promotion">Promotion (Internal growth)</option>
                        <option value="Leadership">Leadership (Transition to management)</option>
                        <option value="Career Switch">Career Switch (New domain/role)</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Style Preference</label>
                      <select
                        value={questionnaire.general.stylePreference || 'Modern'}
                        onChange={(e) => handleQuestGeneralChange('stylePreference', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary"
                      >
                        <option value="Corporate">Corporate (Traditional, polished)</option>
                        <option value="Modern">Modern (Clean, standard premium)</option>
                        <option value="Minimal">Minimal (Text-focused, clean whitespace)</option>
                        <option value="Premium">Premium (Warm colors, sleek layout)</option>
                        <option value="Creative">Creative (Vibrant, design-first)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-warm-border">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="py-3 px-6 rounded-xl font-semibold text-primary border border-warm-border hover:bg-warm-bg transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(5)}
                className="flex items-center gap-2 py-3 px-8 rounded-xl font-bold text-white bg-primary hover:bg-primary-light shadow-sm transition-all cursor-pointer"
              >
                Next: Finalize Profile
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 5: CONFIRMATION & ASSET GENERATION SUMMARY */}
        {step === 5 && careerProfile && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 max-w-xl mx-auto"
          >
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-primary mx-auto mb-2">
                <Sparkles size={28} className="text-brand animate-pulse" />
              </div>
              <h2 className="text-xl font-serif font-bold text-primary">Your Professional Identity Portfolio</h2>
              <p className="text-xs text-primary-light max-w-sm mx-auto leading-relaxed">
                Confirm your selections to construct a cohesive professional profile. We will compile 4 outputs instantly:
              </p>
            </div>

            <div className="border border-warm-border rounded-xl bg-white p-5 space-y-4 shadow-3xs">
              {[
                { title: 'Recruiter-Ready Resume', desc: 'Minimalist layout designed for reading clarity and print formatting.', icon: FileText, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
                { title: 'Public Portfolio Website', desc: `Responsive portfolio template live at platform.com/u/...`, icon: Globe, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                { title: 'Contextual Interview Simulation Kit', desc: '10 custom questions with STAR answering guidance derived from your projects.', icon: Users, color: 'text-amber-600 bg-amber-50 border-amber-100' },
                { title: 'Interactive Career Insights Dashboard', desc: 'Deterministic metrics profiling your strengths & growth areas.', icon: Award, color: 'text-purple-600 bg-purple-50 border-purple-100' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex gap-3.5 items-start">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${item.color}`}>
                      <Icon size={14} />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-primary leading-tight">{item.title}</h4>
                      <p className="text-[10px] text-primary-light mt-0.5 leading-normal">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-4 border-t border-warm-border">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="py-3 px-6 rounded-xl font-semibold text-primary border border-warm-border hover:bg-warm-bg transition-all cursor-pointer"
              >
                Back
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleConfirm(false)}
                  className="py-3 px-4 rounded-xl font-semibold text-primary border border-warm-border hover:bg-warm-bg transition-all cursor-pointer text-xs"
                >
                  Create Without Questionnaire
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirm(true)}
                  className="flex items-center gap-2 py-3 px-6 rounded-xl font-bold text-white bg-primary hover:bg-primary-light shadow-sm transition-all cursor-pointer text-xs"
                >
                  Launch My Profile
                  <CheckCircle2 size={14} className="text-emerald-400" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guided Career Discovery Modal */}
      {activeInterviewModal && (
        <GuidedDiscoveryModal
          key={`${activeInterviewModal.type}_${activeInterviewModal.idx}_${activeInterviewModal.type === 'experience' ? (careerProfile.experience?.[activeInterviewModal.idx]?.id || activeInterviewModal.idx) : (careerProfile.projects?.[activeInterviewModal.idx]?.id || activeInterviewModal.idx)}`}
          isOpen={!!activeInterviewModal}
          onClose={() => setActiveInterviewModal(null)}
          itemId={activeInterviewModal.type === 'experience' ? (careerProfile.experience?.[activeInterviewModal.idx]?.id || `exp_${activeInterviewModal.idx}`) : (careerProfile.projects?.[activeInterviewModal.idx]?.id || `proj_${activeInterviewModal.idx}`)}
          title={
            activeInterviewModal.type === 'experience'
              ? (careerProfile.experience?.[activeInterviewModal.idx]?.role ?? careerProfile.experience?.[activeInterviewModal.idx]?.position ?? '')
              : (careerProfile.projects?.[activeInterviewModal.idx]?.title ?? careerProfile.projects?.[activeInterviewModal.idx]?.name ?? '')
          }
          professionCategory={careerProfile.professionCategory || ''}
          currentDescription={
            activeInterviewModal.type === 'experience'
              ? (careerProfile.experience?.[activeInterviewModal.idx]?.description || '')
              : (careerProfile.projects?.[activeInterviewModal.idx]?.description || '')
          }
          experienceType={activeInterviewModal.type}
          itemDiscoveryState={
            activeInterviewModal.type === 'experience'
              ? (careerProfile.experience?.[activeInterviewModal.idx]?.discovery || careerProfile.experience?.[activeInterviewModal.idx]?.discoveryData)
              : (careerProfile.projects?.[activeInterviewModal.idx]?.discovery || careerProfile.projects?.[activeInterviewModal.idx]?.discoveryData)
          }
          currentSkills={careerProfile.skills || []}
          onSave={(formatted, structuredData) => {
            if (activeInterviewModal.type === 'experience') {
              const updated = [...(careerProfile.experience || [])];
              const item = updated[activeInterviewModal.idx];
              updated[activeInterviewModal.idx] = {
                ...item,
                description: formatted,
                discovery: structuredData,
                discoveryData: structuredData
              };
              setCareerProfile({ ...careerProfile, experience: updated });
            } else {
              const updated = [...(careerProfile.projects || [])];
              const item = updated[activeInterviewModal.idx];
              updated[activeInterviewModal.idx] = {
                ...item,
                description: formatted,
                discovery: structuredData,
                discoveryData: structuredData
              };
              setCareerProfile({ ...careerProfile, projects: updated });
            }
          }}
        />
      )}
      
      {/* Comprehensive Academic Degrees Autocomplete Datalist */}
      <datalist id="role-catalog-list">
        {Object.values(ROLE_CATALOG).flat().map((role, rIdx) => (
          <option key={rIdx} value={role} />
        ))}
      </datalist>

      <datalist id="project-catalog-list">
        {Object.values(PROJECT_CATALOG).flat().map((proj, pIdx) => (
          <option key={pIdx} value={proj} />
        ))}
      </datalist>

      <datalist id="degrees-list">
        {/* Bachelors */}
        <option value="Bachelor of Science (B.S.) in Computer Science" />
        <option value="Bachelor of Technology (B.Tech) in Computer Science" />
        <option value="Bachelor of Computer Applications (BCA)" />
        <option value="Bachelor of Science (B.Sc) in Information Technology" />
        <option value="Bachelor of Design (B.Des) in UI/UX Design" />
        <option value="Bachelor of Design (B.Des) in Interaction Design" />
        <option value="Bachelor of Design (B.Des) in Communication Design" />
        <option value="Bachelor of Fine Arts (BFA)" />
        <option value="Bachelor of Business Administration (BBA) in Finance" />
        <option value="Bachelor of Business Administration (BBA) in Marketing" />
        <option value="Bachelor of Business Administration (BBA) in Human Resource Management" />
        <option value="Bachelor of Commerce (B.Com) in Accounting" />
        <option value="Bachelor of Commerce (B.Com) in Finance" />
        <option value="Bachelor of Science (B.Sc) in Business Administration" />
        <option value="Bachelor of Technology (B.Tech) in Mechanical Engineering" />
        <option value="Bachelor of Technology (B.Tech) in Electrical Engineering" />
        <option value="Bachelor of Technology (B.Tech) in Electronics & Communication" />
        <option value="Bachelor of Technology (B.Tech) in Civil Engineering" />
        <option value="Bachelor of Engineering (B.E.) in Mechanical Engineering" />
        <option value="Bachelor of Engineering (B.E.) in Electrical Engineering" />
        <option value="Bachelor of Arts (B.A.) in Economics" />
        <option value="Bachelor of Arts (B.A.) in English Literature" />
        <option value="Bachelor of Arts (B.A.) in Psychology" />
        <option value="Bachelor of Science (B.Sc) in Mathematics" />
        <option value="Bachelor of Science (B.Sc) in Physics" />
        <option value="Bachelor of Laws (LL.B.)" />
        
        {/* Masters */}
        <option value="Master of Technology (M.Tech) in Computer Science" />
        <option value="Master of Science (M.S.) in Computer Science" />
        <option value="Master of Computer Applications (MCA)" />
        <option value="Master of Science (M.S.) in Data Science" />
        <option value="Master of Science (M.S.) in Business Analytics" />
        <option value="Master of Design (M.Des) in Interaction Design" />
        <option value="Master of Design (M.Des) in Visual Communication" />
        <option value="Master of Fine Arts (MFA)" />
        <option value="Master of Business Administration (MBA) in Finance" />
        <option value="Master of Business Administration (MBA) in Marketing" />
        <option value="Master of Business Administration (MBA) in Human Resource Management" />
        <option value="Master of Business Administration (MBA) in Operations & Strategy" />
        <option value="Master of Science (M.S.) in Finance" />
        <option value="Master of Science (M.Sc) in Economics" />
        <option value="Master of Science (M.Sc) in Financial Engineering" />
        <option value="Master of Science (M.S.) in Human Resource Management" />
        <option value="Master of Laws (LL.M.) in Corporate Law" />
        <option value="Master of Laws (LL.M.) in Intellectual Property Law" />
        <option value="Master of Arts (M.A.) in Industrial-Organizational Psychology" />
        <option value="Master of Science (M.Sc) in Physics" />
        <option value="Master of Science (M.Sc) in Mathematics" />
        
        {/* PhD */}
        <option value="Ph.D. in Computer Science" />
        <option value="Ph.D. in Machine Learning & AI" />
        <option value="Ph.D. in Design & Human-Computer Interaction" />
        <option value="Ph.D. in Business Administration" />
        <option value="Ph.D. in Economics" />
        <option value="Ph.D. in Finance" />
        <option value="Ph.D. in Electrical Engineering" />
        <option value="Ph.D. in Physics" />
        <option value="Ph.D. in Mathematics" />
        <option value="Ph.D. in Law" />
        <option value="Ph.D. in Organizational Behavior" />
      </datalist>

      {/* Comprehensive Academic Institutions Autocomplete Datalist */}
      <datalist id="institutions-list">
        {/* North America (USA & Canada) */}
        <option value="Stanford University" />
        <option value="Harvard University" />
        <option value="Massachusetts Institute of Technology (MIT)" />
        <option value="California Institute of Technology (Caltech)" />
        <option value="Princeton University" />
        <option value="Yale University" />
        <option value="Columbia University" />
        <option value="University of Chicago" />
        <option value="University of Pennsylvania" />
        <option value="Cornell University" />
        <option value="University of California, Berkeley" />
        <option value="University of California, Los Angeles (UCLA)" />
        <option value="Carnegie Mellon University" />
        <option value="Georgia Institute of Technology" />
        <option value="University of Michigan" />
        <option value="New York University (NYU)" />
        <option value="University of Washington" />
        <option value="University of Toronto" />
        <option value="University of British Columbia (UBC)" />
        <option value="McGill University" />
        <option value="University of Waterloo" />
        
        {/* Europe & UK */}
        <option value="University of Oxford" />
        <option value="University of Cambridge" />
        <option value="Imperial College London" />
        <option value="University College London (UCL)" />
        <option value="London School of Economics (LSE)" />
        <option value="University of Edinburgh" />
        <option value="King's College London" />
        <option value="ETH Zurich" />
        <option value="EPFL (École Polytechnique Fédérale de Lausanne)" />
        <option value="Technical University of Munich (TUM)" />
        <option value="LMU Munich" />
        <option value="Sorbonne University" />
        <option value="École Polytechnique" />
        <option value="University of Amsterdam" />
        <option value="Delft University of Technology" />
        <option value="KU Leuven" />
        <option value="Karolinska Institute" />
        <option value="University of Copenhagen" />
        <option value="Trinity College Dublin" />
        
        {/* Asia (Singapore, Japan, China, Hong Kong, Korea) */}
        <option value="National University of Singapore (NUS)" />
        <option value="Nanyang Technological University (NTU)" />
        <option value="Tsinghua University" />
        <option value="Peking University" />
        <option value="Fudan University" />
        <option value="Shanghai Jiao Tong University" />
        <option value="University of Tokyo" />
        <option value="Kyoto University" />
        <option value="Seoul National University" />
        <option value="KAIST (Korea Advanced Institute of Science and Technology)" />
        <option value="University of Hong Kong (HKU)" />
        <option value="Hong Kong University of Science and Technology (HKUST)" />
        
        {/* India */}
        <option value="Indian Institute of Technology (IIT) Bombay" />
        <option value="Indian Institute of Technology (IIT) Delhi" />
        <option value="Indian Institute of Technology (IIT) Madras" />
        <option value="Indian Institute of Technology (IIT) Kharagpur" />
        <option value="Indian Institute of Technology (IIT) Kanpur" />
        <option value="Indian Institute of Technology (IIT) Roorkee" />
        <option value="Indian Institute of Technology (IIT) Guwahati" />
        <option value="Indian Institute of Science (IISc) Bangalore" />
        <option value="Birla Institute of Technology and Science (BITS) Pilani" />
        <option value="Delhi Technological University (DTU)" />
        <option value="Netaji Subhas University of Technology (NSUT)" />
        <option value="National Institute of Technology (NIT) Trichy" />
        <option value="National Institute of Technology (NIT) Surathkal" />
        <option value="Vellore Institute of Technology (VIT)" />
        <option value="Indian Institute of Management (IIM) Ahmedabad" />
        <option value="Indian Institute of Management (IIM) Bangalore" />
        <option value="Indian Institute of Management (IIM) Calcutta" />
        <option value="Indian Institute of Management (IIM) Lucknow" />
        <option value="Indian Institute of Management (IIM) Kozhikode" />
        <option value="Indian Institute of Management (IIM) Indore" />
        <option value="University of Delhi (DU)" />
        <option value="Jawaharlal Nehru University (JNU)" />
        <option value="St. Stephen's College" />
        <option value="Lady Shri Ram College for Women" />
        <option value="SRCC (Shri Ram College of Commerce)" />
        <option value="Loyola College, Chennai" />
        <option value="Christ University, Bangalore" />
        <option value="Symbiosis International University" />
        <option value="Narsee Monjee Institute of Management Studies (NMIMS)" />
        
        {/* Australia & New Zealand */}
        <option value="University of Melbourne" />
        <option value="Australian National University (ANU)" />
        <option value="University of Sydney" />
        <option value="University of Queensland" />
        <option value="UNSW Sydney" />
        <option value="University of Auckland" />
        
        {/* Latin America & Africa */}
        <option value="University of São Paulo (USP)" />
        <option value="National Autonomous University of Mexico (UNAM)" />
        <option value="Pontifical Catholic University of Chile" />
        <option value="University of Cape Town" />
        <option value="University of the Witwatersrand" />
      </datalist>
    </div>
  );
}

// Minimalist target icon fallback
function TargetIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
