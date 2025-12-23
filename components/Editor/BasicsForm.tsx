import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { useUI } from '../../context/UIContext';
import { Input } from '../ui/Input';
import { RichTextEditor } from '../ui/RichTextEditor';
import { Sparkles, Plus, Trash2, Github, Linkedin, Twitter, Globe } from 'lucide-react';
import { improveText } from '../../services/geminiService';
import { ResumeProfile } from '../../types';

export const BasicsForm: React.FC = () => {
  const { resumeData, updateSection } = useResume();
  const { openApiKeyModal } = useUI();
  const { basics } = resumeData;
  const [isImproving, setIsImproving] = useState(false);

  const handleChange = (field: string, value: any) => {
    updateSection('basics', { ...basics, [field]: value });
  };

  const handleLocationChange = (field: string, value: any) => {
    updateSection('basics', { ...basics, location: { ...basics.location, [field]: value } });
  };

  // Profile Handlers
  const addProfile = () => {
    const newProfile: ResumeProfile = { network: '', username: '', url: '' };
    updateSection('basics', { ...basics, profiles: [...basics.profiles, newProfile] });
  };

  const removeProfile = (index: number) => {
    const newProfiles = [...basics.profiles];
    newProfiles.splice(index, 1);
    updateSection('basics', { ...basics, profiles: newProfiles });
  };

  const updateProfile = (index: number, field: keyof ResumeProfile, value: string) => {
    const newProfiles = [...basics.profiles];
    newProfiles[index] = { ...newProfiles[index], [field]: value };
    updateSection('basics', { ...basics, profiles: newProfiles });
  };

  const handleAISummary = async () => {
    const div = document.createElement('div');
    div.innerHTML = basics.summary;
    const textContent = div.innerText;

    if (!textContent) return;
    setIsImproving(true);

    try {
      const improved = await improveText(textContent, 'summary');
      handleChange('summary', improved);
    } catch (e: any) {
      if (e.message === 'API_KEY_MISSING') {
        openApiKeyModal();
      }
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name" value={basics.name} onChange={(e) => handleChange('name', e.target.value)} />
          <Input label="Job Title" value={basics.label} onChange={(e) => handleChange('label', e.target.value)} />
          <Input label="Email" value={basics.email} onChange={(e) => handleChange('email', e.target.value)} />
          <Input label="Phone" value={basics.phone} onChange={(e) => handleChange('phone', e.target.value)} />
          <Input label="Website" value={basics.url} onChange={(e) => handleChange('url', e.target.value)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="City" value={basics.location.city} onChange={(e) => handleLocationChange('city', e.target.value)} />
          <Input label="Region" value={basics.location.region} onChange={(e) => handleLocationChange('region', e.target.value)} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-semibold text-gray-800">Social Profiles</h3>
          <button onClick={addProfile} className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100">
            <Plus size={14} /> Add Profile
          </button>
        </div>

        <div className="space-y-3">
          {basics.profiles.map((profile, index) => (
            <div key={index} className="flex gap-2 items-start bg-gray-50 p-3 rounded-md relative group border border-gray-200">
              <button
                onClick={() => removeProfile(index)}
                className="absolute top-1 right-1 text-gray-400 hover:text-red-500 p-1"
                title="Remove Profile"
              >
                <Trash2 size={14} />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full pr-6">
                <Input
                  label="Network"
                  placeholder="LinkedIn, GitHub"
                  value={profile.network}
                  onChange={(e) => updateProfile(index, 'network', e.target.value)}
                  className="mb-0"
                />
                <Input
                  label="Username"
                  placeholder="johndoe"
                  value={profile.username}
                  onChange={(e) => updateProfile(index, 'username', e.target.value)}
                  className="mb-0"
                />
                <Input
                  label="URL"
                  placeholder="https://..."
                  value={profile.url}
                  onChange={(e) => updateProfile(index, 'url', e.target.value)}
                  className="mb-0"
                />
              </div>
            </div>
          ))}
          {basics.profiles.length === 0 && (
            <p className="text-sm text-gray-500 italic">No social profiles added.</p>
          )}
        </div>
      </div>

      <div className="relative pt-2">
        <RichTextEditor
          label="Professional Summary"
          value={basics.summary}
          onChange={(val) => handleChange('summary', val)}
        />
        <button
          onClick={handleAISummary}
          disabled={isImproving || !basics.summary}
          className="absolute top-2 right-0 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50 z-10 p-2"
        >
          <Sparkles size={12} />
          {isImproving ? 'Improving...' : 'AI Improve'}
        </button>
      </div>
    </div>
  );
};
