import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ResumeData, TemplateId, ResumeMeta } from '../types';
import { INITIAL_RESUME_STATE, EMPTY_RESUME_STATE, EXAMPLE_RESUMES } from '../constants';

interface ResumeContextType {
    resumeData: ResumeData;
    setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
    activeTemplate: TemplateId;
    setActiveTemplate: (id: TemplateId) => void;
    updateSection: (section: keyof ResumeData, data: any) => void;
    importData: (data: Partial<ResumeData>) => void;

    // Multi-resume support
    resumes: ResumeMeta[];
    activeResumeId: string | null;
    createResume: () => void;
    createResumeWithData: (data: ResumeData, name: string) => void;
    duplicateResume: (id: string) => void;
    switchResume: (id: string) => void;
    updateResumeName: (id: string, name: string) => void;
    deleteResume: (id: string) => void;
    isExample: boolean;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Initialize State
    const [resumes, setResumes] = useState<ResumeMeta[]>(() => {
        const saved = localStorage.getItem('resumes_meta');
        return saved ? JSON.parse(saved) : [];
    });

    const [activeResumeId, setActiveResumeId] = useState<string | null>(() => {
        return localStorage.getItem('active_resume_id');
    });

    const [resumeData, setResumeData] = useState<ResumeData>(() => {
        // Attempt to load active resume or legacy resume or default
        const activeId = localStorage.getItem('active_resume_id');

        // Check if it's an example
        if (activeId && activeId.startsWith('example_')) {
            const key = activeId.replace('example_', '');
            if (EXAMPLE_RESUMES[key]) return EXAMPLE_RESUMES[key];
        }

        if (activeId) {
            const stored = localStorage.getItem(`resume_${activeId}`);
            if (stored) return JSON.parse(stored);
        }

        const legacy = localStorage.getItem('resumeData');
        if (legacy) return JSON.parse(legacy);

        return INITIAL_RESUME_STATE;
    });

    const [activeTemplate, setActiveTemplateState] = useState<TemplateId>('professional');

    const isExample = activeResumeId?.startsWith('example_') || false;

    // Initialization / Migration Effect
    useEffect(() => {
        const metaStr = localStorage.getItem('resumes_meta');
        const legacyData = localStorage.getItem('resumeData');

        if (!metaStr && legacyData) {
            // MIGRATION: Convert legacy single-resume to multi-resume structure
            const newId = crypto.randomUUID();
            const parsedLegacy = JSON.parse(legacyData);
            const name = parsedLegacy.basics.name || 'My Resume';

            const newMeta: ResumeMeta[] = [{ id: newId, name, lastModified: Date.now() }];

            // Save new structure
            localStorage.setItem('resumes_meta', JSON.stringify(newMeta));
            localStorage.setItem(`resume_${newId}`, legacyData);
            localStorage.setItem('active_resume_id', newId);

            // Cleanup legacy
            localStorage.removeItem('resumeData');

            // Update state
            setResumes(newMeta);
            setActiveResumeId(newId);
        } else if (!metaStr && !legacyData) {
            // FRESH START
            const newId = crypto.randomUUID();
            const newMeta: ResumeMeta[] = [{ id: newId, name: 'My Resume', lastModified: Date.now() }];

            localStorage.setItem('resumes_meta', JSON.stringify(newMeta));
            localStorage.setItem(`resume_${newId}`, JSON.stringify(INITIAL_RESUME_STATE));
            localStorage.setItem('active_resume_id', newId);

            setResumes(newMeta);
            setActiveResumeId(newId);
            setResumeData(INITIAL_RESUME_STATE);
        } else if (metaStr && resumes.length === 0) {
            // Re-hydrate state if needed
            setResumes(JSON.parse(metaStr));
        }

        // Validate active ID on load
        if (metaStr) {
            const currentId = localStorage.getItem('active_resume_id');
            // Allow if it's an example ID or a valid user ID
            if (currentId && !currentId.startsWith('example_')) {
                const meta: ResumeMeta[] = JSON.parse(metaStr);
                if (!meta.find(r => r.id === currentId)) {
                    if (meta.length > 0) switchResume(meta[0].id);
                }
            }
        }
    }, []);

    // Persistence for Resume Data
    useEffect(() => {
        // DO NOT save example resumes to local storage (read-only until modified)
        if (activeResumeId && !activeResumeId.startsWith('example_')) {
            localStorage.setItem(`resume_${activeResumeId}`, JSON.stringify(resumeData));
        }
    }, [resumeData, activeResumeId]);

    // Helper to fork an example into a real resume
    const forkExample = (dataOverrides: Partial<ResumeData> = {}): string => {
        const currentData = { ...resumeData, ...dataOverrides };
        const newId = crypto.randomUUID();

        // Get base name
        let baseName = "New Resume";
        if (activeResumeId?.startsWith('example_')) {
            const key = activeResumeId.replace('example_', '');
            baseName = key.charAt(0).toUpperCase() + key.slice(1) + " Example";
        }

        const newMeta: ResumeMeta = {
            id: newId,
            name: `Copy of ${baseName}`,
            lastModified: Date.now()
        };

        const updatedResumes = [...resumes, newMeta];

        localStorage.setItem(`resume_${newId}`, JSON.stringify(currentData));
        localStorage.setItem('resumes_meta', JSON.stringify(updatedResumes));

        setResumes(updatedResumes);
        setActiveResumeId(newId);
        localStorage.setItem('active_resume_id', newId);
        setResumeData(currentData);

        return newId;
    };

    const updateSection = (section: keyof ResumeData, data: any) => {
        if (isExample) {
            // Copy on write
            forkExample({ [section]: data });
        } else {
            setResumeData(prev => ({
                ...prev,
                [section]: data
            }));
        }
    };

    const importData = (data: Partial<ResumeData>) => {
        const newData = {
            ...resumeData,
            ...data,
            basics: { ...resumeData.basics, ...data.basics },
            work: data.work || resumeData.work,
            education: data.education || resumeData.education,
            skills: data.skills || resumeData.skills,
            projects: data.projects || resumeData.projects,
            certifications: data.certifications || resumeData.certifications,
            additional: data.additional || resumeData.additional,
            sectionOrder: data.sectionOrder || resumeData.sectionOrder || INITIAL_RESUME_STATE.sectionOrder
        };

        if (isExample) {
            forkExample(newData);
        } else {
            setResumeData(newData);
        }
    };

    const setActiveTemplate = (id: TemplateId) => {
        setActiveTemplateState(id);
    };

    // --- Multi-Resume Actions ---

    const createResume = () => {
        createResumeWithData(EMPTY_RESUME_STATE, 'New Resume');
    };

    const createResumeWithData = (data: ResumeData, name: string) => {
        const newId = crypto.randomUUID();
        const newResumeData = { ...data };

        const newMeta: ResumeMeta = {
            id: newId,
            name: name,
            lastModified: Date.now()
        };

        const updatedResumes = [...resumes, newMeta];

        // Save everything
        localStorage.setItem(`resume_${newId}`, JSON.stringify(newResumeData));
        localStorage.setItem('resumes_meta', JSON.stringify(updatedResumes));

        setResumes(updatedResumes);
        switchResume(newId);
    }

    const duplicateResume = (id: string) => {
        let sourceResumeData: ResumeData;
        let oldName = 'Resume';

        if (id.startsWith('example_')) {
            const key = id.replace('example_', '');
            sourceResumeData = EXAMPLE_RESUMES[key];
            oldName = key.charAt(0).toUpperCase() + key.slice(1) + " Example";
        } else {
            const sourceResumeStr = localStorage.getItem(`resume_${id}`);
            if (!sourceResumeStr) {
                console.error("Source resume not found");
                return;
            }
            sourceResumeData = JSON.parse(sourceResumeStr);
            const sourceMeta = resumes.find(r => r.id === id);
            oldName = sourceMeta?.name || 'Resume';
        }

        const newName = `Copy of ${oldName}`;
        createResumeWithData(sourceResumeData, newName);
    };

    const switchResume = (id: string) => {
        if (id.startsWith('example_')) {
            const key = id.replace('example_', '');
            const exampleData = EXAMPLE_RESUMES[key];
            if (exampleData) {
                setResumeData(exampleData);
                setActiveResumeId(id);
                localStorage.setItem('active_resume_id', id);
            }
            return;
        }

        const stored = localStorage.getItem(`resume_${id}`);
        if (stored) {
            setResumeData(JSON.parse(stored));
            setActiveResumeId(id);
            localStorage.setItem('active_resume_id', id);
        } else {
            console.error(`Resume ${id} not found in storage`);
        }
    };

    const updateResumeName = (id: string, name: string) => {
        if (id.startsWith('example_')) {
            // If renaming an example, fork it first with the new name
            // Note: createResumeWithData creates it and switches to it.
            const key = id.replace('example_', '');
            const data = EXAMPLE_RESUMES[key];
            createResumeWithData(data, name);
            return;
        }

        const updatedResumes = resumes.map(r => r.id === id ? { ...r, name, lastModified: Date.now() } : r);
        setResumes(updatedResumes);
        localStorage.setItem('resumes_meta', JSON.stringify(updatedResumes));
    };

    const deleteResume = (id: string) => {
        if (id.startsWith('example_')) {
            console.warn("Cannot delete an example template.");
            return;
        }

        if (resumes.length <= 1) {
            console.warn("You must have at least one resume.");
            return;
        }

        const updatedResumes = resumes.filter(r => r.id !== id);
        setResumes(updatedResumes);
        localStorage.setItem('resumes_meta', JSON.stringify(updatedResumes));
        localStorage.removeItem(`resume_${id}`);

        if (activeResumeId === id) {
            switchResume(updatedResumes[0].id);
        }
    };

    return (
        <ResumeContext.Provider value={{
            resumeData,
            setResumeData,
            activeTemplate,
            setActiveTemplate,
            updateSection,
            importData,
            resumes,
            activeResumeId,
            createResume,
            createResumeWithData,
            duplicateResume,
            switchResume,
            updateResumeName,
            deleteResume,
            isExample
        }}>
            {children}
        </ResumeContext.Provider>
    );
};

export const useResume = () => {
    const context = useContext(ResumeContext);
    if (!context) throw new Error("useResume must be used within a ResumeProvider");
    return context;
};
