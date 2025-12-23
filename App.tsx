import React, { useState, useEffect, useRef } from 'react';
import { useResume, ResumeProvider } from './context/ResumeContext';
import { Toolbar } from './components/Toolbar';
import { Preview } from './components/Preview/Preview';
import { BasicsForm } from './components/Editor/BasicsForm';
import { WorkForm } from './components/Editor/WorkForm';
import { SkillsForm } from './components/Editor/SkillsForm';
import { EducationForm } from './components/Editor/EducationForm';
import { ProjectsForm } from './components/Editor/ProjectsForm';
import { CertificationsForm } from './components/Editor/CertificationsForm';
import { AdditionalForm } from './components/Editor/AdditionalForm';
import { JobMatcher } from './components/Editor/JobMatcher';
import { ToastProvider } from './context/ToastContext';
import { parseResumeFromText, parseResumeFromPdf } from './services/geminiService';
import { UIProvider, useUI } from './context/UIContext';
import { useToast } from './context/ToastContext';
import { User, Briefcase, Wrench, GraduationCap, Code, Award, ListPlus, ChevronDown, ChevronRight, ArrowUp, ArrowDown, Target, Sparkles, Upload, FileText, X } from 'lucide-react';

const SECTION_CONFIG: Record<string, { label: string, icon: any, component: React.FC }> = {
  work: { label: 'Experience', icon: Briefcase, component: WorkForm },
  education: { label: 'Education', icon: GraduationCap, component: EducationForm },
  projects: { label: 'Projects', icon: Code, component: ProjectsForm },
  skills: { label: 'Skills', icon: Wrench, component: SkillsForm },
  certifications: { label: 'Certifications', icon: Award, component: CertificationsForm },
  additional: { label: 'Additional Sections', icon: ListPlus, component: AdditionalForm },
};

const MainLayout: React.FC = () => {
  const { resumeData, updateSection, importData } = useResume();
  const [expandedSection, setExpandedSection] = useState<string | null>('basics');

  // Resizable Sidebar State
  const [sidebarWidth, setSidebarWidth] = useState(500);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Tools State
  const { openApiKeyModal, prompt } = useUI();
  const { toast } = useToast();
  const [showMatcher, setShowMatcher] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Import Refs
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Resize Handlers
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = e.clientX;
      if (newWidth > 300 && newWidth < 800) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);


  const toggleSection = (id: string) => {
    setExpandedSection(prev => prev === id ? null : id);
  };

  const moveSection = (index: number, direction: -1 | 1, e: React.MouseEvent) => {
    e.stopPropagation();
    const newOrder = [...resumeData.sectionOrder];
    const targetIndex = index + direction;

    if (targetIndex >= 0 && targetIndex < newOrder.length) {
      [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
      updateSection('sectionOrder', newOrder);
    }
  };

  // Import Handlers
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64Data = (reader.result as string).split(',')[1];
        const parsed = await parseResumeFromPdf(base64Data, file.type);
        importData(parsed);
      } catch (e: any) {
        console.error(e);
        if (e.message === 'API_KEY_MISSING') {
          openApiKeyModal();
        } else {
          toast.error("Failed to parse document via AI. Please try a different file.");
        }
      } finally {
        setIsImporting(false);
      }
    };
    e.target.value = '';
  };

  const handleTextImport = async () => {
    const text = await prompt({
      title: "Import Resume Text",
      message: "Paste your resume text here. Gemini AI will try to parse it.",
      placeholder: "Paste text content...",
      confirmText: "Parse with AI"
    });
    if (text) {
      setIsImporting(true);
      try {
        const parsed = await parseResumeFromText(text);
        importData(parsed);
        toast.success("Resume parsed successfully!");
      } catch (e: any) {
        if (e.message === 'API_KEY_MISSING') {
          openApiKeyModal();
        } else {
          toast.error("Failed to parse text via AI.");
        }
      } finally {
        setIsImporting(false);
      }
    }
  }

  const ToolsSection = () => {
    const isOpen = expandedSection === 'tools';
    return (
      <div className="border-b border-gray-100 last:border-0">
        <button
          onClick={() => toggleSection('tools')}
          className={`w-full flex items-center justify-between p-4 transition-colors focus:outline-none ${isOpen
            ? 'bg-blue-50 text-blue-700 sticky top-0 z-10 border-b border-blue-100 shadow-sm'
            : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
        >
          <div className="flex items-center gap-3 font-medium">
            <Sparkles size={18} />
            AI Actions & Import
          </div>
          {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} className="text-gray-400" />}
        </button>

        {isOpen && (
          <div className="p-6 bg-white">
            <div className="grid grid-cols-1 gap-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => pdfInputRef.current?.click()}
                  disabled={isImporting}
                  className="flex flex-col items-center justify-center gap-2 px-4 py-4 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm group"
                >
                  {isImporting ? <div className="animate-spin h-5 w-5 border-2 border-indigo-600 rounded-full border-t-transparent" /> : <Upload size={20} className="text-gray-400 group-hover:text-indigo-500" />}
                  Import PDF
                </button>
                <button
                  onClick={handleTextImport}
                  disabled={isImporting}
                  className="flex flex-col items-center justify-center gap-2 px-4 py-4 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-all shadow-sm group"
                >
                  <FileText size={20} className="text-gray-400 group-hover:text-purple-500" />
                  Paste Text
                </button>
              </div>

              <button
                onClick={() => setShowMatcher(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm font-medium text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-all shadow-sm"
              >
                <Target size={18} />
                Check ATS Score
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`h-screen flex flex-col bg-gray-100 print:h-auto print:bg-white ${isResizing ? 'cursor-col-resize select-none' : ''}`}>
      <Toolbar />

      {/* Shared Hidden Input for PDF Upload */}
      <input type="file" ref={pdfInputRef} className="hidden" accept=".pdf, .jpg, .jpeg, .png" onChange={handlePdfUpload} />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Editor Panel */}
        <div
          ref={sidebarRef}
          style={{ width: `${sidebarWidth}px` }}
          className="bg-white border-r border-gray-200 flex flex-col z-10 no-print flex-shrink-0 hidden md:flex"
        >
          {/* Scrollable Form Area */}
          <div className="flex-1 overflow-y-auto scrollbar-thin">

            {/* Tools Section */}
            <ToolsSection />

            {/* Basics Section */}
            <div className="border-b border-gray-100 last:border-0">
              <button
                onClick={() => toggleSection('basics')}
                className={`w-full flex items-center justify-between p-4 transition-colors focus:outline-none ${expandedSection === 'basics'
                  ? 'bg-blue-50 text-blue-700 sticky top-0 z-10 border-b border-blue-100 shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center gap-3 font-medium">
                  <User size={18} />
                  Personal Information
                </div>
                {expandedSection === 'basics' ? <ChevronDown size={18} /> : <ChevronRight size={18} className="text-gray-400" />}
              </button>

              {expandedSection === 'basics' && (
                <div className="p-6 bg-white">
                  <BasicsForm />
                </div>
              )}
            </div>

            {/* Reorderable Sections */}
            {resumeData.sectionOrder.map((sectionId, index) => {
              const config = SECTION_CONFIG[sectionId];
              if (!config) return null;

              const isOpen = expandedSection === sectionId;
              const SectionComponent = config.component;

              return (
                <div key={sectionId} className="border-b border-gray-100 last:border-0">
                  <div
                    onClick={() => toggleSection(sectionId)}
                    className={`w-full flex items-center justify-between p-4 transition-colors cursor-pointer ${isOpen
                      ? 'bg-blue-50 text-blue-700 sticky top-0 z-10 border-b border-blue-100 shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center gap-3 font-medium">
                      <config.icon size={18} />
                      {config.label}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => moveSection(index, -1, e)}
                        disabled={index === 0}
                        className="p-1 hover:bg-gray-200 rounded text-gray-500 disabled:opacity-30 disabled:hover:bg-transparent"
                        title="Move Up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={(e) => moveSection(index, 1, e)}
                        disabled={index === resumeData.sectionOrder.length - 1}
                        className="p-1 hover:bg-gray-200 rounded text-gray-500 disabled:opacity-30 disabled:hover:bg-transparent"
                        title="Move Down"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <div className="w-px h-4 bg-gray-300 mx-1"></div>
                      {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} className="text-gray-400" />}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="p-6 bg-white">
                      <SectionComponent />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t bg-gray-50 text-xs text-gray-500 text-center">
            CVilder &copy; {new Date().getFullYear()}
          </div>
        </div>

        {/* Mobile View Sidebar (Full Width) */}
        <div className="w-full bg-white border-r border-gray-200 flex flex-col z-10 no-print flex-shrink-0 md:hidden h-full">
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <ToolsSection />

            <div className="border-b border-gray-100 last:border-0">
              <button
                onClick={() => toggleSection('basics')}
                className={`w-full flex items-center justify-between p-4 transition-colors focus:outline-none ${expandedSection === 'basics'
                  ? 'bg-blue-50 text-blue-700 sticky top-0 z-10 border-b border-blue-100 shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center gap-3 font-medium">
                  <User size={18} />
                  Personal Information
                </div>
                {expandedSection === 'basics' ? <ChevronDown size={18} /> : <ChevronRight size={18} className="text-gray-400" />}
              </button>
              {expandedSection === 'basics' && <div className="p-6 bg-white"><BasicsForm /></div>}
            </div>

            {resumeData.sectionOrder.map((sectionId, index) => {
              const config = SECTION_CONFIG[sectionId];
              if (!config) return null;
              const isOpen = expandedSection === sectionId;
              const SectionComponent = config.component;
              return (
                <div key={sectionId} className="border-b border-gray-100 last:border-0">
                  <div
                    onClick={() => toggleSection(sectionId)}
                    className={`w-full flex items-center justify-between p-4 transition-colors cursor-pointer ${isOpen ? 'bg-blue-50 text-blue-700 sticky top-0 z-10 border-b border-blue-100 shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center gap-3 font-medium"><config.icon size={18} />{config.label}</div>
                    {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} className="text-gray-400" />}
                  </div>
                  {isOpen && <div className="p-6 bg-white"><SectionComponent /></div>}
                </div>
              );
            })}
          </div>
        </div>


        {/* Resizer Handle */}
        <div
          className="w-1 cursor-col-resize hover:bg-blue-400 active:bg-blue-600 bg-gray-300 transition-colors z-20 hidden md:block"
          onMouseDown={startResizing}
        ></div>

        {/* Right Preview Panel */}
        <div className="flex-1 bg-gray-200 overflow-hidden relative print:bg-white print:overflow-visible">
          <Preview />
        </div>
      </div>

      {/* Job Matcher Modal */}
      {showMatcher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Target className="text-blue-600" />
                ATS Job Description Matcher
              </h2>
              <button onClick={() => setShowMatcher(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <JobMatcher />
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <UIProvider>
        <ResumeProvider>
          <MainLayout />
        </ResumeProvider>
      </UIProvider>
    </ToastProvider>
  );
}
