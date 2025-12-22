import React, { useEffect } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Input } from '../ui/Input';
import { RichTextEditor } from '../ui/RichTextEditor';
import { Plus, Trash2 } from 'lucide-react';
import { ResumeProject } from '../../types';

export const ProjectsForm: React.FC = () => {
  const { resumeData, updateSection } = useResume();
  const { projects } = resumeData;

  const addProject = () => {
    const newProject: ResumeProject = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      highlights: [],
      url: '',
      startDate: '',
      endDate: ''
    };
    updateSection('projects', [...projects, newProject]);
  };

  useEffect(() => {
    if (projects.length === 0) {
      addProject();
    }
  }, []);

  const removeProject = (index: number) => {
    const newProjects = [...projects];
    newProjects.splice(index, 1);
    updateSection('projects', newProjects);
  };

  const updateProject = (index: number, field: keyof ResumeProject, value: any) => {
    const newProjects = [...projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    updateSection('projects', newProjects);
  };

  const handleHighlights = (index: number, html: string) => {
     const parser = new DOMParser();
     const doc = parser.parseFromString(html, 'text/html');
     const listItems = Array.from(doc.querySelectorAll('li'));
     
     let highlights: string[] = [];
     if (listItems.length > 0) {
         highlights = listItems.map(li => li.innerHTML);
     } else {
         highlights = Array.from(doc.body.childNodes)
            .filter(node => node.textContent?.trim())
            .map(node => {
                if (node.nodeName === 'DIV' || node.nodeName === 'P') {
                    return (node as HTMLElement).innerHTML;
                }
                return node.textContent || '';
            });
         if (highlights.length === 0 && html.trim()) {
             highlights = [html];
         }
     }
     updateProject(index, 'highlights', highlights);
  };

  const getHighlightsHTML = (highlights: string[]) => {
      if (!highlights || highlights.length === 0) return '';
      return `<ul>${highlights.map(h => `<li>${h}</li>`).join('')}</ul>`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-lg font-semibold text-gray-800">Projects</h3>
        <button onClick={addProject} className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100">
          <Plus size={14} /> Add Project
        </button>
      </div>

      {projects.map((item, index) => (
        <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm relative">
           <button 
            onClick={() => removeProject(index)}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Input label="Project Name" value={item.name} onChange={(e) => updateProject(index, 'name', e.target.value)} />
             <Input label="Project URL" value={item.url} onChange={(e) => updateProject(index, 'url', e.target.value)} />
             <Input label="Start Date" placeholder="YYYY-MM" value={item.startDate} onChange={(e) => updateProject(index, 'startDate', e.target.value)} />
             <Input label="End Date" placeholder="YYYY-MM" value={item.endDate} onChange={(e) => updateProject(index, 'endDate', e.target.value)} />
          </div>

          <RichTextEditor 
            label="Description / Highlights" 
            value={getHighlightsHTML(item.highlights)} 
            onChange={(html) => handleHighlights(index, html)}
          />
        </div>
      ))}
      
      {projects.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No projects added yet.
        </div>
      )}
    </div>
  );
};