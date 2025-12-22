import React from 'react';
import { ResumeData } from '../../../types';
import { MapPin, Mail, Phone, Link as LinkIcon, Github, Linkedin, Calendar, Twitter, Globe, Facebook, Instagram, Youtube } from 'lucide-react';

export const TechTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { basics, work, education, skills, projects, certifications, additional } = data;

  const validSkills = skills.filter(item => item.name || item.keywords.some(k => k.trim()));
  const validEducation = education.filter(item => item.institution || item.studyType || item.area);
  const validCerts = certifications.filter(item => item.name || item.issuer);
  const validWork = work.filter(item => item.name || item.position || item.highlights.some(h => h.trim()));
  const validProjects = projects.filter(item => item.name || item.highlights.some(h => h.trim()));
  const validAdditional = additional.filter(item => item.title && item.items.some(i => i.trim()));

  const getSocialIcon = (network: string) => {
    const lower = network.toLowerCase();
    if (lower.includes('github')) return <Github size={14} />;
    if (lower.includes('linkedin')) return <Linkedin size={14} />;
    if (lower.includes('twitter') || lower.includes('x')) return <Twitter size={14} />;
    if (lower.includes('facebook')) return <Facebook size={14} />;
    if (lower.includes('instagram')) return <Instagram size={14} />;
    if (lower.includes('youtube')) return <Youtube size={14} />;
    return <Globe size={14} />;
  };

  return (
    <div className="font-sans text-slate-800 bg-white p-0 max-w-[210mm] mx-auto min-h-[297mm] grid grid-cols-[30%_70%] h-full shadow-none print:shadow-none" id="resume-preview">
      {/* Left Column */}
      <div className="bg-slate-900 text-white p-6 h-full print:bg-slate-900 print:text-white print-color-adjust-exact">
        <div className="mb-8">
          <h1 className="text-2xl font-bold leading-tight mb-2">{basics.name}</h1>
          <p className="text-slate-400 text-sm font-medium">{basics.label}</p>
        </div>

        <div className="space-y-4 mb-8 text-sm text-slate-300">
           {basics.email && <div className="flex items-center gap-2"><Mail size={14} /> <span>{basics.email}</span></div>}
           {basics.phone && <div className="flex items-center gap-2"><Phone size={14} /> <span>{basics.phone}</span></div>}
           {basics.location.city && <div className="flex items-center gap-2"><MapPin size={14} /> <span>{basics.location.city}, {basics.location.region}</span></div>}
           {basics.url && <div className="flex items-center gap-2"><LinkIcon size={14} /> <a href={basics.url} className="truncate hover:text-white transition-colors" target="_blank" rel="noreferrer">{basics.url.replace(/^https?:\/\//, '')}</a></div>}
           
           {/* Social Profiles */}
           {basics.profiles.map((profile, idx) => (
             profile.url && (
               <div key={idx} className="flex items-center gap-2">
                 {getSocialIcon(profile.network)}
                 <a href={profile.url} className="truncate hover:text-white transition-colors" target="_blank" rel="noreferrer">
                   {profile.username || profile.network || 'Link'}
                 </a>
               </div>
             )
           ))}
        </div>

        {/* Skills in Sidebar */}
        {validSkills.length > 0 && (
            <div className="mb-8">
                <h3 className="uppercase tracking-widest text-xs font-bold text-slate-500 mb-4 border-b border-slate-700 pb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                    {validSkills.flatMap(s => s.keywords).filter(k => k.trim()).map((k, i) => (
                        <span key={i} className="bg-slate-800 px-2 py-1 rounded text-xs">{k}</span>
                    ))}
                </div>
            </div>
        )}

        {/* Education in Sidebar */}
        {validEducation.length > 0 && (
            <div className="mb-8">
                <h3 className="uppercase tracking-widest text-xs font-bold text-slate-500 mb-4 border-b border-slate-700 pb-2">Education</h3>
                {validEducation.map(edu => (
                    <div key={edu.id} className="mb-4 text-sm">
                        <div className="font-bold text-white">{edu.institution}</div>
                        <div className="text-slate-400">{edu.studyType}, {edu.area}</div>
                        <div className="text-slate-500 text-xs">{edu.startDate} - {edu.endDate}</div>
                    </div>
                ))}
            </div>
        )}

        {/* Certifications in Sidebar */}
        {validCerts.length > 0 && (
            <div className="mb-8">
                <h3 className="uppercase tracking-widest text-xs font-bold text-slate-500 mb-4 border-b border-slate-700 pb-2">Certifications</h3>
                {validCerts.map(cert => (
                    <div key={cert.id} className="mb-3 text-sm">
                        <div className="font-bold text-white">{cert.name}</div>
                        <div className="text-slate-400 text-xs">{cert.issuer}, {cert.date}</div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* Right Column */}
      <div className="p-8">
        {/* Summary */}
        {basics.summary && (
            <div className="mb-8">
                 <h2 className="text-xl font-bold text-slate-800 mb-3 border-b-2 border-blue-500 inline-block pb-1">Profile</h2>
                 <div className="text-sm leading-relaxed text-slate-600 [&_ul]:list-disc [&_ul]:mb-2 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5" dangerouslySetInnerHTML={{ __html: basics.summary }} />
            </div>
        )}

        {/* Experience */}
        {validWork.length > 0 && (
            <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-800 mb-6 border-b-2 border-blue-500 inline-block pb-1">Work History</h2>
                <div className="space-y-6">
                    {validWork.map(job => (
                        <div key={job.id} className="relative pl-4 border-l-2 border-slate-200">
                             <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                             <div className="flex justify-between items-baseline mb-1">
                                <h3 className="font-bold text-lg text-slate-800">{job.name}</h3>
                                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">{job.startDate} — {job.endDate}</span>
                             </div>
                             <div className="text-blue-600 font-medium text-sm mb-2">{job.position}</div>
                             <ul className="text-sm text-slate-600 list-disc list-outside ml-4 space-y-1">
                                {job.highlights.filter(h => h.trim()).map((h, i) => (
                                    <li key={i} dangerouslySetInnerHTML={{ __html: h }} />
                                ))}
                             </ul>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Projects */}
        {validProjects.length > 0 && (
            <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-800 mb-6 border-b-2 border-blue-500 inline-block pb-1">Projects</h2>
                <div className="space-y-6">
                    {validProjects.map(proj => (
                        <div key={proj.id} className="relative pl-4 border-l-2 border-slate-200">
                             <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                             <div className="flex justify-between items-baseline mb-1">
                                <h3 className="font-bold text-lg text-slate-800">{proj.name}</h3>
                                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                    {proj.startDate && `${proj.startDate} — `}{proj.endDate}
                                </span>
                             </div>
                             {proj.url && <a href={proj.url} className="text-blue-600 font-medium text-sm mb-2 block">{proj.url}</a>}
                             <ul className="text-sm text-slate-600 list-disc list-outside ml-4 space-y-1">
                                {proj.highlights.filter(h => h.trim()).map((h, i) => (
                                    <li key={i} dangerouslySetInnerHTML={{ __html: h }} />
                                ))}
                             </ul>
                        </div>
                    ))}
                </div>
            </div>
        )}
        
        {/* Additional Sections */}
        {validAdditional.map(section => (
             <div key={section.id} className="mb-8">
                 <h2 className="text-xl font-bold text-slate-800 mb-3 border-b-2 border-blue-500 inline-block pb-1">{section.title}</h2>
                 <ul className="text-sm text-slate-600 list-disc list-outside ml-4 space-y-1">
                    {section.items.filter(i => i.trim()).map((item, i) => (
                        <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                    ))}
                 </ul>
             </div>
        ))}

      </div>
    </div>
  );
};