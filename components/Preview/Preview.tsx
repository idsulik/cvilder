import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { ProfessionalTemplate } from './templates/ProfessionalTemplate';
import { TechTemplate } from './templates/TechTemplate';

export const Preview: React.FC = () => {
  const { resumeData, activeTemplate } = useResume();

  const renderTemplate = () => {
    switch (activeTemplate) {
      case 'tech':
        return <TechTemplate data={resumeData} />;
      case 'professional':
      default:
        return <ProfessionalTemplate data={resumeData} />;
    }
  };

  return (
    <div className="h-full bg-gray-500 p-8 overflow-y-auto flex justify-center">
      <div className="bg-white shadow-2xl w-[210mm] min-h-[297mm] transition-all duration-300 origin-top transform scale-75 md:scale-90 lg:scale-100">
        {renderTemplate()}
      </div>
    </div>
  );
};