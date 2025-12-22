import React, { useEffect } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Input } from '../ui/Input';
import { Plus, Trash2 } from 'lucide-react';
import { ResumeEducation } from '../../types';

export const EducationForm: React.FC = () => {
  const { resumeData, updateSection } = useResume();
  const { education } = resumeData;

  const addEducation = () => {
    const newEdu: ResumeEducation = {
      id: crypto.randomUUID(),
      institution: '',
      url: '',
      area: '',
      studyType: '',
      startDate: '',
      endDate: '',
      score: '',
      courses: []
    };
    updateSection('education', [...education, newEdu]);
  };

  useEffect(() => {
    if (education.length === 0) {
      addEducation();
    }
  }, []);

  const removeEducation = (index: number) => {
    const newEdu = [...education];
    newEdu.splice(index, 1);
    updateSection('education', newEdu);
  };

  const updateEducation = (index: number, field: keyof ResumeEducation, value: any) => {
    const newEdu = [...education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    updateSection('education', newEdu);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-lg font-semibold text-gray-800">Education</h3>
        <button onClick={addEducation} className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100">
          <Plus size={14} /> Add Education
        </button>
      </div>

      {education.map((item, index) => (
        <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm relative">
           <button 
            onClick={() => removeEducation(index)}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Input label="Institution" value={item.institution} onChange={(e) => updateEducation(index, 'institution', e.target.value)} />
             <Input label="Degree / Type" placeholder="Bachelor of Science" value={item.studyType} onChange={(e) => updateEducation(index, 'studyType', e.target.value)} />
             <Input label="Major / Area" placeholder="Computer Science" value={item.area} onChange={(e) => updateEducation(index, 'area', e.target.value)} />
             <Input label="GPA / Score" value={item.score} onChange={(e) => updateEducation(index, 'score', e.target.value)} />
             <Input label="Start Date" placeholder="YYYY-MM" value={item.startDate} onChange={(e) => updateEducation(index, 'startDate', e.target.value)} />
             <Input label="End Date" placeholder="YYYY-MM or Present" value={item.endDate} onChange={(e) => updateEducation(index, 'endDate', e.target.value)} />
          </div>
        </div>
      ))}
      
      {education.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No education added yet.
        </div>
      )}
    </div>
  );
};