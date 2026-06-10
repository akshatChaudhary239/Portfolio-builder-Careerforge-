'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Briefcase, Code, Palette, BarChart3, GraduationCap, 
  Scale, Users, HeartHandshake, DollarSign, Upload, 
  FileText, Sparkles, Plus, Trash2, CheckCircle2, Loader2, ArrowRight,
  ArrowLeft, ChevronDown, ChevronUp, Star, Award, ShieldAlert, X, Globe,
  AlertTriangle, Info
} from 'lucide-react';
import { ProfessionCategory, CareerProfile } from '@/db/local-db';
import { parseResumeAction, parseResumeFileAction, confirmOnboardingAction } from './actions';
import { ProfessionModuleRegistry } from '@/components/modules/ProfessionModuleRegistry';

interface OnboardingClientProps {
  userId: string;
  userName: string;
  isEditMode?: boolean;
  initialProfile?: any;
}

export default function OnboardingClient({ userId, userName, isEditMode = false, initialProfile = null }: OnboardingClientProps) {
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

      setStep(3);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error parsing resume details. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  // Initialize Empty Profile (Step 1 -> Step 3)
  const handleInitializeEmptyProfile = (selectedCategory: ProfessionCategory) => {
    const emptyProfile = {
      userId: userId,
      professionCategory: selectedCategory,
      personalInfo: { fullName: '', email: '', phone: '', location: '', github: '', linkedin: '', website: '' },
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

  const handleSkillChange = (idx: number, val: string) => {
    const updated = [...careerProfile.skills];
    updated[idx] = { name: val };
    setCareerProfile((prev: any) => ({ ...prev, skills: updated }));
  };

  const addSkill = () => {
    setCareerProfile((prev: any) => ({ ...prev, skills: [...prev.skills, { name: 'New Skill' }] }));
  };

  const deleteSkill = (idx: number) => {
    setCareerProfile((prev: any) => ({ ...prev, skills: prev.skills.filter((_: any, i: number) => i !== idx) }));
  };

  const updateExperience = (idx: number, field: string, val: string) => {
    const updated = [...careerProfile.experience];
    updated[idx] = { ...updated[idx], [field]: val };
    setCareerProfile((prev: any) => ({ ...prev, experience: updated }));
  };

  const addExperience = () => {
    const newExp = { company: 'New Company', position: 'New Role', duration: '', achievements: [] };
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
    const newProj = { ...ModuleConfig.defaultItem };
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

            <div className="space-y-8">
              
              {/* Personal Info */}
              <div className="bg-white/40 border border-warm-border rounded-xl p-5">
                <div className="flex items-center gap-2 border-b border-warm-border pb-2 mb-4">
                  <User size={16} className="text-brand" />
                  <h3 className="font-bold text-sm text-primary">Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Full Name</label>
                    <input value={careerProfile.personalInfo?.fullName || ''} onChange={(e) => handleProfileChange('fullName', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Email Address</label>
                    <input value={careerProfile.personalInfo?.email || ''} onChange={(e) => handleProfileChange('email', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Phone Number</label>
                    <input value={careerProfile.personalInfo?.phone || ''} onChange={(e) => handleProfileChange('phone', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Location</label>
                    <input value={careerProfile.personalInfo?.location || ''} onChange={(e) => handleProfileChange('location', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">GitHub URL</label>
                    <input value={careerProfile.personalInfo?.github || ''} onChange={(e) => handleProfileChange('github', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">LinkedIn URL</label>
                    <input value={careerProfile.personalInfo?.linkedin || ''} onChange={(e) => handleProfileChange('linkedin', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Profile Photo URL (Optional)</label>
                    <input value={careerProfile.personalInfo?.avatarUrl || ''} onChange={(e) => handleProfileChange('avatarUrl', e.target.value)} placeholder="https://example.com/photo.jpg" className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Personal Website</label>
                    <input value={careerProfile.personalInfo?.website || ''} onChange={(e) => handleProfileChange('website', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white/40 border border-warm-border rounded-xl p-5">
                <div className="flex items-center gap-2 border-b border-warm-border pb-2 mb-4">
                  <FileText size={16} className="text-brand" />
                  <h3 className="font-bold text-sm text-primary">Professional Summary</h3>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Executive Summary</label>
                  <textarea value={careerProfile.summary || ''} onChange={(e) => setCareerProfile({...careerProfile, summary: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary min-h-[100px] resize-y"></textarea>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white/40 border border-warm-border rounded-xl p-5">
                <div className="flex items-center justify-between border-b border-warm-border pb-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-brand" />
                    <h3 className="font-bold text-sm text-primary">Skills & Technologies</h3>
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
              </div>

              {/* Experience */}
              <div className="bg-white/40 border border-warm-border rounded-xl p-5">
                <div className="flex items-center justify-between border-b border-warm-border pb-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} className="text-brand" />
                    <h3 className="font-bold text-sm text-primary">Work Experience</h3>
                  </div>
                  <button onClick={addExperience} className="flex items-center gap-1 text-[11px] font-semibold text-brand hover:text-brand-hover bg-brand/5 px-2 py-1 rounded-md transition-all"><Plus size={12} /> Add Role</button>
                </div>
                <div className="space-y-4">
                  {careerProfile.experience?.map((exp: any, idx: number) => (
                    <div key={idx} className="relative p-4 border border-warm-border rounded-lg bg-white/60 group">
                      <button onClick={() => deleteExperience(idx)} className="absolute top-4 right-4 p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 pr-8">
                        <div>
                          <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Job Title</label>
                          <input value={exp.role || ''} onChange={(e) => updateExperience(idx, 'role', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Company</label>
                          <input value={exp.company || ''} onChange={(e) => updateExperience(idx, 'company', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
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
                        <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Description & Achievements</label>
                        <textarea value={exp.description || ''} onChange={(e) => updateExperience(idx, 'description', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary min-h-[80px] resize-y"></textarea>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Showcase Module */}
              <div className="bg-white/40 border border-warm-border rounded-xl p-5">
                <div className="flex items-center justify-between border-b border-warm-border pb-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Code size={16} className="text-brand" />
                    <h3 className="font-bold text-sm text-primary">
                      {ProfessionModuleRegistry[careerProfile.professionCategory || 'General Professional']?.label || 'Professional Showcase'}
                    </h3>
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
                            <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Title</label>
                            <input value={proj.title || proj.name || ''} onChange={(e) => updateProject(idx, 'title', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Link / URL</label>
                            <input value={proj.link || proj.supportingUrl || ''} onChange={(e) => updateProject(idx, 'link', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
                          </div>
                          <ExtraFieldsComponent item={proj} idx={idx} updateField={updateProject} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Description & Details</label>
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
                    <h3 className="font-bold text-sm text-primary">Education</h3>
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
                          <input value={edu.degree || ''} onChange={(e) => updateEducation(idx, 'degree', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-1">Institution</label>
                          <input value={edu.institution || ''} onChange={(e) => updateEducation(idx, 'institution', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-primary focus:outline-none focus:border-primary" />
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
