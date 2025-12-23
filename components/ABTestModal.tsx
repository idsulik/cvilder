
import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { useUI } from '../context/UIContext';
import { useToast } from '../context/ToastContext';
import { generatePersonas } from '../services/geminiService';
import { X, User, Briefcase, Users, Layers, ArrowRight, Loader2, Check } from 'lucide-react';

interface ABTestModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ABTestModal: React.FC<ABTestModalProps> = ({ isOpen, onClose }) => {
    const { resumeData, createResumeWithData } = useResume();
    const { openApiKeyModal } = useUI();
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    const [personas, setPersonas] = useState<any[]>([]);
    const [baseResume, setBaseResume] = useState<any>(null);
    const [createdIds, setCreatedIds] = useState<string[]>([]);

    if (!isOpen) return null;

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const results = await generatePersonas(resumeData);
            if (results && Array.isArray(results) && results.length > 0) {
                setPersonas(results);
                setBaseResume(JSON.parse(JSON.stringify(resumeData)));
            } else {
                toast.error("AI returned format error. Please try again.");
            }
        } catch (e: any) {
            if (e.message === 'API_KEY_MISSING') {
                openApiKeyModal();
            } else {
                toast.error("Failed to generate personas.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = (persona: any, index: number) => {
        // Clone base resume (snapshot)
        const newResume = JSON.parse(JSON.stringify(baseResume || resumeData));

        // Apply persona changes
        newResume.basics.label = persona.label;
        newResume.basics.summary = persona.summary;
        // Replace skills for the specific persona focus
        if (persona.skills && persona.skills.length > 0) {
            newResume.skills = persona.skills;
        }

        const name = `${newResume.basics.name || 'My'} - ${persona.type.charAt(0).toUpperCase() + persona.type.slice(1)}`;
        createResumeWithData(newResume, name);

        setCreatedIds(prev => [...prev, persona.type]);
        toast.success(`Created "${name}"!`);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'specialist': return <Briefcase className="text-blue-500" />;
            case 'leader': return <Users className="text-purple-500" />;
            default: return <Layers className="text-green-500" />;
        }
    };

    const getDescription = (type: string) => {
        switch (type) {
            case 'specialist': return "Deep dive into your technical expertise.";
            case 'leader': return "Emphasizes management and team success.";
            default: return "Balanced profile for versatile roles.";
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">A/B Testing Studio</h2>
                        <p className="text-gray-500 text-sm mt-1">Generate 3 distinct versions of your resume to test which one performs best.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {personas.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="bg-blue-50 p-4 rounded-full mb-6">
                                <Users size={48} className="text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Ready to multiply your chances?</h3>
                            <p className="text-gray-500 max-w-md mb-8">
                                AI will analyze your experience and create 3 unique "Personas": The Specialist, The Leader, and The Generalist.
                            </p>
                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <User />}
                                {loading ? "Analyzing Career..." : "Generate Personas"}
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {personas.map((persona, idx) => {
                                const isCreated = createdIds.includes(persona.type);
                                return (
                                    <div key={idx} className="border rounded-xl p-5 hover:shadow-lg transition-shadow flex flex-col bg-white">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-gray-50 rounded-lg">
                                                {getIcon(persona.type)}
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold uppercase text-gray-400 tracking-wider text-left">{persona.type}</div>
                                                <div className="font-bold text-gray-800 text-left">{persona.label}</div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 mb-4 flex-1">
                                            "{persona.summary}"
                                        </div>

                                        <div className="mb-6">
                                            <div className="text-xs font-semibold text-gray-500 mb-2">Top Skills Focus</div>
                                            <div className="flex flex-wrap gap-1">
                                                {persona.skills?.[0]?.keywords?.slice(0, 5).map((k: string, i: number) => (
                                                    <span key={i} className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-600">{k}</span>
                                                ))}
                                                {persona.skills?.[0]?.keywords?.length > 5 && (
                                                    <span className="text-[10px] text-gray-400 px-1">+{persona.skills[0].keywords.length - 5} more</span>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => !isCreated && handleCreate(persona, idx)}
                                            disabled={isCreated}
                                            className={`w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${isCreated
                                                ? 'bg-green-100 text-green-700 cursor-default'
                                                : 'bg-gray-900 text-white hover:bg-gray-800'
                                                }`}
                                        >
                                            {isCreated ? (
                                                <> <Check size={16} /> Created </>
                                            ) : (
                                                <> Create Resume <ArrowRight size={16} /> </>
                                            )}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
