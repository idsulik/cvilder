import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { TextArea } from '../ui/Input';
import { analyzeJobMatch, improveText } from '../../services/geminiService';
import { AlertCircle, CheckCircle, Sparkles, Target, ArrowRight } from 'lucide-react';

export const JobMatcher: React.FC = () => {
  const { resumeData, updateSection } = useResume();
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ score: number; missingKeywords: string[]; suggestions: string[] } | null>(null);
  const [isFixing, setIsFixing] = useState(false);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;
    
    setIsAnalyzing(true);
    try {
        const analysis = await analyzeJobMatch(resumeData, jobDescription);
        setResult(analysis);
    } catch (e: any) {
        if (e.message === 'API_KEY_MISSING') {
            alert("Please set your Gemini API Key in the settings (gear icon) to use AI features.");
        } else {
            alert("Failed to analyze.");
        }
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleAutoFixSummary = async () => {
      if (!result || !result.missingKeywords.length) return;

      setIsFixing(true);
      try {
          const newSummary = await improveText(
              resumeData.basics.summary, 
              'fix_summary', 
              result.missingKeywords.join(', ')
          );
          updateSection('basics', { ...resumeData.basics, summary: newSummary });
          
          // Optimistic update of local result to show "Fixed" state
          setResult(prev => prev ? { ...prev, missingKeywords: [] } : null);
      } catch (e: any) {
          if (e.message === 'API_KEY_MISSING') {
              alert("Please set your Gemini API Key in the settings (gear icon) to use AI features.");
          } else {
              alert("Failed to update summary.");
          }
      } finally {
          setIsFixing(false);
      }
  };

  const getScoreColor = (score: number) => {
      if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
      if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
           <p className="flex items-start gap-2">
             <Target size={18} className="shrink-0 mt-0.5" />
             <span>Paste the Job Description below. We'll analyze your resume and tell you exactly what's missing to beat the ATS.</span>
           </p>
        </div>

        <TextArea 
            label="Target Job Description" 
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[150px] text-xs"
        />

        <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !jobDescription}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
            {isAnalyzing ? (
                <>Analyzing...</>
            ) : (
                <>
                    <Sparkles size={16} /> Analyze Match
                </>
            )}
        </button>
      </div>

      {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 pt-4 border-t">
              {/* Score Section */}
              <div className={`p-4 rounded-lg border flex items-center justify-between ${getScoreColor(result.score)}`}>
                  <div>
                      <h4 className="font-bold text-lg">Match Score</h4>
                      <p className="text-xs opacity-80">Based on keyword relevance</p>
                  </div>
                  <div className="text-4xl font-black">{result.score}%</div>
              </div>

              {/* Missing Keywords */}
              <div>
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <AlertCircle size={16} className="text-amber-500" />
                      Missing Keywords
                  </h4>
                  {result.missingKeywords.length > 0 ? (
                      <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                              {result.missingKeywords.map((kw, i) => (
                                  <span key={i} className="px-2 py-1 bg-red-50 text-red-700 border border-red-100 rounded text-xs font-medium">
                                      {kw}
                                  </span>
                              ))}
                          </div>
                          
                          <button 
                            onClick={handleAutoFixSummary}
                            disabled={isFixing}
                            className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
                          >
                             {isFixing ? 'Updating...' : 'Auto-add these to Summary'} <ArrowRight size={12} />
                          </button>
                      </div>
                  ) : (
                      <p className="text-sm text-green-600 flex items-center gap-2">
                          <CheckCircle size={16} /> Great job! No critical keywords missing.
                      </p>
                  )}
              </div>

              {/* Suggestions */}
              <div>
                  <h4 className="font-bold text-gray-800 mb-3">Suggestions</h4>
                  <ul className="space-y-2">
                      {result.suggestions.map((suggestion, i) => (
                          <li key={i} className="text-sm text-gray-600 flex gap-2 items-start">
                              <span className="text-blue-500 mt-1">•</span>
                              {suggestion}
                          </li>
                      ))}
                  </ul>
              </div>
          </div>
      )}
    </div>
  );
};
