import React, { useRef, useState, useEffect } from 'react';
import { useResume } from '../context/ResumeContext';
import { Download, Upload, Printer, FileJson, FileType, LayoutTemplate, ChevronDown, Plus, Trash2, Edit2, Check, FileText, BookOpen, Copy, Lock, Sparkles, FileCode, FileImage, Settings, Key } from 'lucide-react';
import { exportToJSON, exportToLaTeX } from '../services/fileService';
import { TEMPLATES, EXAMPLE_RESUMES } from '../constants';
import { parseResumeFromText, parseResumeFromPdf } from '../services/geminiService';
import { ApiKeyModal } from './ApiKeyModal';

const ResumeSwitcher: React.FC = () => {
  const { resumes, activeResumeId, switchResume, createResume, duplicateResume, deleteResume, updateResumeName, isExample } = useResume();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const activeResumeName = isExample 
    ? (activeResumeId ? activeResumeId.replace('example_', '').charAt(0).toUpperCase() + activeResumeId.replace('example_', '').slice(1) + ' Example' : 'Example')
    : resumes.find(r => r.id === activeResumeId)?.name || 'My Resume';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setEditingId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStartEdit = (e: React.MouseEvent, id: string, currentName: string) => {
      e.preventDefault();
      e.stopPropagation();
      setEditingId(id);
      setEditName(currentName);
  };

  const handleSaveName = (id: string) => {
      if (editName.trim()) {
          updateResumeName(id, editName.trim());
      }
      setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
      if (e.key === 'Enter') handleSaveName(id);
      if (e.key === 'Escape') setEditingId(null);
  };

  const handleDuplicate = (e: React.MouseEvent, id: string) => {
      e.preventDefault();
      e.stopPropagation();
      duplicateResume(id);
      // setIsOpen(false); // Kept open to show the new duplicate
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
      e.preventDefault();
      e.stopPropagation();
      deleteResume(id);
  };

  const handleRowClick = (id: string) => {
      if (editingId !== id) {
          switchResume(id);
          setIsOpen(false);
      }
  };

  return (
    <div className="relative" ref={dropdownRef}>
        <button 
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1.5 rounded-md transition-colors text-gray-700 max-w-[220px]"
        >
            <div className={`p-1 rounded ${isExample ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                {isExample ? <BookOpen size={16} /> : <FileText size={16} />}
            </div>
            <span className="font-medium truncate text-sm">{activeResumeName}</span>
            <ChevronDown size={14} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 flex flex-col max-h-[80vh]">
                
                {/* User Resumes Section */}
                <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Your Resumes</div>
                <div className="overflow-y-auto max-h-[200px]">
                    {resumes.map(resume => (
                        <div 
                            key={resume.id} 
                            className={`flex items-center justify-between pl-3 pr-2 py-2 hover:bg-gray-50 group ${activeResumeId === resume.id ? 'bg-blue-50' : ''}`}
                        >
                            <div 
                                className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
                                onClick={() => handleRowClick(resume.id)}
                            >
                                {activeResumeId === resume.id && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0" />}
                                
                                {editingId === resume.id ? (
                                    <input 
                                        autoFocus
                                        className="text-sm border border-blue-300 rounded px-1 py-0.5 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        onKeyDown={(e) => handleKeyDown(e, resume.id)}
                                        onBlur={() => handleSaveName(resume.id)}
                                    />
                                ) : (
                                    <span className={`text-sm truncate ${activeResumeId === resume.id ? 'font-medium text-blue-900' : 'text-gray-700'}`}>
                                        {resume.name}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                {editingId === resume.id ? (
                                    <button 
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); handleSaveName(resume.id); }}
                                        className="p-1 hover:bg-green-100 text-green-600 rounded"
                                    >
                                        <Check size={12} />
                                    </button>
                                ) : (
                                    <>
                                        <button 
                                            type="button"
                                            onClick={(e) => handleStartEdit(e, resume.id, resume.name)}
                                            className="p-1 hover:bg-gray-200 text-gray-500 rounded"
                                            title="Rename"
                                        >
                                            <Edit2 size={12} />
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={(e) => handleDuplicate(e, resume.id)}
                                            className="p-1 hover:bg-blue-100 text-gray-500 hover:text-blue-600 rounded"
                                            title="Duplicate"
                                        >
                                            <Copy size={12} />
                                        </button>
                                    </>
                                )}
                                
                                <button 
                                    type="button"
                                    onClick={(e) => handleDelete(e, resume.id)}
                                    className="p-1 hover:bg-red-100 text-gray-400 hover:text-red-600 rounded"
                                    title="Delete"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t my-2 border-gray-100"></div>

                {/* Example Resumes Section */}
                <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Example Templates</div>
                <div className="overflow-y-auto">
                    {Object.keys(EXAMPLE_RESUMES).map(key => {
                        const exampleId = `example_${key}`;
                        const isActive = activeResumeId === exampleId;
                        const name = key.charAt(0).toUpperCase() + key.slice(1) + " Engineer";

                        return (
                            <div 
                                key={exampleId}
                                className={`flex items-center justify-between pl-3 pr-2 py-2 hover:bg-purple-50 group ${isActive ? 'bg-purple-50' : ''}`}
                            >
                                <div 
                                    className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
                                    onClick={() => {
                                        switchResume(exampleId);
                                        setIsOpen(false);
                                    }}
                                >
                                    <Lock size={12} className="text-gray-400" />
                                    <span className={`text-sm truncate ${isActive ? 'font-medium text-purple-900' : 'text-gray-700'}`}>
                                        {name}
                                    </span>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                     <button 
                                        type="button"
                                        onClick={(e) => handleDuplicate(e, exampleId)}
                                        className="p-1 hover:bg-purple-200 text-purple-600 rounded"
                                        title="Duplicate to Edit"
                                    >
                                        <Copy size={12} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                <div className="border-t mt-2 pt-2 px-2 pb-1">
                    <button 
                        type="button"
                        onClick={() => { createResume(); setIsOpen(false); }}
                        className="flex items-center gap-2 text-sm text-blue-600 hover:bg-blue-50 w-full px-2 py-2 rounded-md font-medium"
                    >
                        <Plus size={14} />
                        Create New Resume
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};

export const Toolbar: React.FC = () => {
  const { resumeData, importData, setActiveTemplate, activeTemplate } = useResume();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  
  // Menu states
  const [showImportMenu, setShowImportMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  
  const importRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (importRef.current && !importRef.current.contains(event.target as Node)) {
        setShowImportMenu(false);
      }
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePrint = () => {
    window.print();
    setShowExportMenu(false);
  };

  const handleJsonUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        importData(json);
        setShowImportMenu(false);
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsImporting(true);
      setShowImportMenu(false);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
          try {
              const base64Data = (reader.result as string).split(',')[1];
              const parsed = await parseResumeFromPdf(base64Data, file.type);
              importData(parsed);
          } catch(e: any) {
              console.error(e);
              if (e.message === 'API_KEY_MISSING') {
                  setShowApiKeyModal(true);
              } else {
                  alert("Failed to parse document via AI. Please try a different file.");
              }
          } finally {
              setIsImporting(false);
          }
      };
      // Reset
      e.target.value = '';
  };

  const handleAIImport = async () => {
    const text = prompt("Paste your resume text here. Gemini AI will try to parse it.");
    if (text) {
        try {
            const parsed = await parseResumeFromText(text);
            importData(parsed);
            setShowImportMenu(false);
        } catch(e: any) {
            if (e.message === 'API_KEY_MISSING') {
                setShowApiKeyModal(true);
            } else {
                alert("Failed to parse text via AI.");
            }
        }
    }
  }

  // Increased z-index from 20 to 30 to stay above sidebar resizer (z-20)
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-30 no-print shadow-sm">
      <div className="flex items-center gap-4">
        <span className="font-bold text-xl text-primary tracking-tight hidden md:block">CVilder</span>
        <div className="h-6 w-px bg-gray-300 hidden md:block"></div>
        <ResumeSwitcher />
      </div>

      <div className="flex items-center gap-4">
        {/* Template Selector */}
        <div className="flex items-center gap-2 border-r pr-4 hidden sm:flex">
            <LayoutTemplate size={18} className="text-gray-500" />
            <select 
                className="text-sm border-none focus:ring-0 cursor-pointer font-medium text-gray-700 bg-transparent"
                value={activeTemplate}
                onChange={(e) => setActiveTemplate(e.target.value as any)}
            >
                {TEMPLATES.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                ))}
            </select>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-300 mx-1 hidden sm:block"></div>

        {/* Import Dropdown */}
        <div className="relative" ref={importRef}>
            <button 
                type="button"
                onClick={() => setShowImportMenu(!showImportMenu)}
                disabled={isImporting}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70"
            >
                {isImporting ? <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"/> : <Upload size={16} />}
                <span className="hidden lg:inline">{isImporting ? 'Parsing...' : 'Import'}</span>
                <ChevronDown size={14} className="text-gray-500" />
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleJsonUpload} />
            <input type="file" ref={pdfInputRef} className="hidden" accept=".pdf, .jpg, .jpeg, .png" onChange={handlePdfUpload} />

            {showImportMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                     <button
                        onClick={() => pdfInputRef.current?.click()}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 text-left"
                    >
                        <FileImage size={18} className="mr-3 text-green-500" />
                        <div>
                            <div className="font-medium text-green-700">Import PDF / Image</div>
                            <div className="text-xs text-green-500">Extracts data via AI</div>
                        </div>
                    </button>
                    <button
                        onClick={handleAIImport}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 text-left border-t border-gray-100"
                    >
                        <Sparkles size={18} className="mr-3 text-purple-500" />
                        <div>
                            <div className="font-medium text-purple-700">Paste Text</div>
                            <div className="text-xs text-purple-400">Copy from LinkedIn/Doc</div>
                        </div>
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 text-left border-t border-gray-100"
                    >
                        <FileJson size={18} className="mr-3 text-gray-400" />
                        <div>
                            <div className="font-medium">Upload JSON</div>
                            <div className="text-xs text-gray-500">Restore backup</div>
                        </div>
                    </button>
                </div>
            )}
        </div>

        {/* Export Dropdown (Unified Style) */}
        <div className="relative" ref={exportRef}>
            <button
                type="button"
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
                <Download size={16} />
                <span className="hidden lg:inline">Export</span>
                <ChevronDown size={14} className="text-gray-500" />
            </button>
            
            {showExportMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                    <button
                        onClick={handlePrint}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 text-left"
                    >
                        <Printer size={18} className="mr-3 text-blue-500" />
                        <div>
                            <div className="font-medium text-blue-700">PDF / Print</div>
                            <div className="text-xs text-blue-400">Save as PDF via browser</div>
                        </div>
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                        onClick={() => { exportToJSON(resumeData); setShowExportMenu(false); }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                    >
                        <FileJson size={16} className="mr-3 text-gray-400" />
                        JSON Backup
                    </button>
                    <button
                        onClick={() => { exportToLaTeX(resumeData); setShowExportMenu(false); }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                    >
                        <FileCode size={16} className="mr-3 text-gray-400" />
                        LaTeX Source
                    </button>
                </div>
            )}
        </div>

        <button 
          onClick={() => setShowApiKeyModal(true)}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
          title="AI Settings"
        >
          <Settings size={20} />
        </button>
      </div>

      <ApiKeyModal isOpen={showApiKeyModal} onClose={() => setShowApiKeyModal(false)} />
    </div>
  );
};