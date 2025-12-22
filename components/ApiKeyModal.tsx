import React, { useState, useEffect } from 'react';
import { Key, X, ExternalLink, Check } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('gemini_api_key');
      if (stored) setApiKey(stored);
      setSaved(false);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      setSaved(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      localStorage.removeItem('gemini_api_key');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 text-blue-600 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
                <Key size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Gemini API Key</h2>
          </div>
          
          <p className="text-sm text-gray-600 leading-relaxed">
            To use the AI features (Resume Parsing, ATS Matcher, Writing Assistant), you need a free Google Gemini API Key.
          </p>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Your API Key</label>
            <input 
              type="password" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Keys are stored locally in your browser.</span>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:underline"
            >
              Get a free key <ExternalLink size={10} />
            </a>
          </div>

          <button 
            onClick={handleSave}
            className={`w-full py-2.5 rounded-lg font-medium text-white transition-all flex items-center justify-center gap-2 ${
                saved ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {saved ? <><Check size={18} /> Saved</> : 'Save API Key'}
          </button>
        </div>
      </div>
    </div>
  );
};
