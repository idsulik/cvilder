import React from 'react';
import { ResumeData } from '../../../types';

export const ProfessionalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { basics, work, education, skills, projects, certifications, additional, sectionOrder } = data;

  const renderSection = (id: string) => {
      switch(id) {
          case 'work':
              const validWork = work.filter(item => item.name || item.position || item.summary || item.highlights.some(h => h));
              if (validWork.length === 0) return null;
              return (
                <section key={id} className="mb-6">
                    <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-3 pb-1">Experience</h2>
                    <div className="space-y-4">
                        {validWork.map((job) => (
                        <div key={job.id}>
                            <div className="flex justify-between items-baseline mb-1">
                            <h3 className="font-bold text-base">{job.name}</h3>
                            <span className="text-sm text-gray-600">{job.startDate} – {job.endDate}</span>
                            </div>
                            <div className="text-sm font-semibold italic mb-2">{job.position}</div>
                            <ul className="list-disc list-outside ml-5 text-sm space-y-1">
                            {job.highlights.filter(h => h.trim()).map((h, i) => (
                                <li key={i} dangerouslySetInnerHTML={{ __html: h }} />
                            ))}
                            </ul>
                        </div>
                        ))}
                    </div>
                </section>
              );
          case 'education':
              const validEducation = education.filter(item => item.institution || item.studyType || item.area || item.score);
              if (validEducation.length === 0) return null;
              return (
                <section key={id} className="mb-6">
                    <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-3 pb-1">Education</h2>
                    <div className="space-y-3">
                        {validEducation.map((edu) => (
                        <div key={edu.id}>
                            <div className="flex justify-between items-baseline">
                            <h3 className="font-bold text-base">{edu.institution}</h3>
                            <span className="text-sm text-gray-600">{edu.startDate} – {edu.endDate}</span>
                            </div>
                            <div className="text-sm">{edu.studyType} in {edu.area} {edu.score && <span>(GPA: {edu.score})</span>}</div>
                        </div>
                        ))}
                    </div>
                </section>
              );
          case 'projects':
              const validProjects = projects.filter(item => item.name || item.description || item.highlights.some(h => h));
              if (validProjects.length === 0) return null;
              return (
                <section key={id} className="mb-6">
                <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-3 pb-1">Projects</h2>
                <div className="space-y-4">
                    {validProjects.map((proj) => (
                    <div key={proj.id}>
                        <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-base">
                            {proj.name} 
                            {proj.url && <a href={proj.url} className="text-blue-800 text-xs ml-2 no-underline" target="_blank" rel="noreferrer">[Link]</a>}
                        </h3>
                        <span className="text-sm text-gray-600">{proj.startDate && `${proj.startDate} – `}{proj.endDate}</span>
                        </div>
                        <ul className="list-disc list-outside ml-5 text-sm space-y-1">
                        {proj.highlights.filter(h => h.trim()).map((h, i) => (
                            <li key={i} dangerouslySetInnerHTML={{ __html: h }} />
                        ))}
                        </ul>
                    </div>
                    ))}
                </div>
                </section>
              );
          case 'skills':
              const validSkills = skills.filter(item => item.name || item.keywords.some(k => k));
              if (validSkills.length === 0) return null;
              return (
                <section key={id} className="mb-6">
                <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-3 pb-1">Skills</h2>
                <div className="space-y-2 text-sm">
                    {validSkills.map((skill) => (
                    <div key={skill.id} className="flex">
                        <span className="font-bold w-32 shrink-0">{skill.name}:</span>
                        <span>{skill.keywords.filter(k => k.trim()).join(', ')}</span>
                    </div>
                    ))}
                </div>
                </section>
              );
          case 'certifications':
              const validCerts = certifications.filter(item => item.name || item.issuer);
              if (validCerts.length === 0) return null;
              return (
                <section key={id} className="mb-6">
                <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-3 pb-1">Certifications</h2>
                <div className="space-y-2">
                    {validCerts.map((cert) => (
                    <div key={cert.id} className="flex justify-between text-sm">
                        <div>
                        <span className="font-bold">{cert.name}</span>, {cert.issuer}
                        </div>
                        <span className="text-gray-600">{cert.date}</span>
                    </div>
                    ))}
                </div>
                </section>
              );
          case 'additional':
              const validAdditional = additional.filter(section => section.title && section.items.some(i => i.trim()));
              if (validAdditional.length === 0) return null;
              return (
                <section key={id} className="mb-6">
                    {validAdditional.map(section => (
                        <div key={section.id} className="mb-4">
                            <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-3 pb-1">{section.title}</h2>
                            <ul className="list-disc list-outside ml-5 text-sm space-y-1">
                                {section.items.filter(i => i.trim()).map((item, i) => (
                                    <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                                ))}
                            </ul>
                        </div>
                    ))}
                </section>
              );
          default:
              return null;
      }
  };

  return (
    <div className="font-serif text-gray-900 bg-white p-8 max-w-[210mm] mx-auto min-h-[297mm] shadow-none print:shadow-none" id="resume-preview">
      {/* Header (Fixed) */}
      <header className="border-b-2 border-gray-800 pb-4 mb-6 text-center">
        <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">{basics.name}</h1>
        <div className="text-sm flex flex-wrap justify-center gap-3 text-gray-700">
          {basics.email && <span>{basics.email}</span>}
          {basics.phone && <span>• {basics.phone}</span>}
          {basics.location.city && <span>• {basics.location.city}, {basics.location.region}</span>}
          {basics.url && <span>• {basics.url}</span>}
          {/* Social Profiles */}
          {basics.profiles.map((profile, idx) => (
             profile.url && (
               <span key={idx} className="flex items-center">
                 • <a href={profile.url} className="hover:text-black transition-colors" target="_blank" rel="noreferrer">
                    {profile.network}: {profile.username || 'Link'}
                   </a>
               </span>
             )
          ))}
        </div>
      </header>

      {/* Summary (Fixed) */}
      {basics.summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-3 pb-1">Professional Summary</h2>
          <div 
             className="text-sm leading-relaxed [&_ul]:list-disc [&_ul]:mb-2 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5" 
             dangerouslySetInnerHTML={{ __html: basics.summary }}
          />
        </section>
      )}

      {/* Dynamic Sections */}
      {sectionOrder.map(id => renderSection(id))}
    </div>
  );
};