import React, { useEffect } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Input } from '../ui/Input';
import { Plus, Trash2 } from 'lucide-react';
import { ResumeSkill } from '../../types';

export const SkillsForm: React.FC = () => {
  const { resumeData, updateSection } = useResume();
  const { skills } = resumeData;

  const addSkill = () => {
    const newSkill: ResumeSkill = {
      id: crypto.randomUUID(),
      name: '',
      level: '',
      keywords: []
    };
    updateSection('skills', [...skills, newSkill]);
  };

  useEffect(() => {
    if (skills.length === 0) {
      addSkill();
    }
  }, []);

  const removeSkill = (index: number) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    updateSection('skills', newSkills);
  };

  const updateSkill = (index: number, field: keyof ResumeSkill, value: any) => {
    const newSkills = [...skills];
    if (field === 'keywords') {
        // Assume comma separated input for keywords
        newSkills[index] = { ...newSkills[index], keywords: value.split(',').map((s: string) => s.trim()) };
    } else {
        newSkills[index] = { ...newSkills[index], [field]: value };
    }
    updateSection('skills', newSkills);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
        <button onClick={addSkill} className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100">
          <Plus size={14} /> Add Skill Group
        </button>
      </div>

      {skills.map((item, index) => (
        <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm relative">
           <button 
            onClick={() => removeSkill(index)}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>

          <Input label="Category (e.g. Languages, Tools)" value={item.name} onChange={(e) => updateSkill(index, 'name', e.target.value)} />
          <Input 
            label="Keywords (Comma separated)" 
            value={item.keywords.join(', ')} 
            onChange={(e) => updateSkill(index, 'keywords', e.target.value)} 
          />
        </div>
      ))}
    </div>
  );
};