import React, { useEffect } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Input } from '../ui/Input';
import { RichTextEditor } from '../ui/RichTextEditor';
import { Plus, Trash2 } from 'lucide-react';
import { ResumeWork } from '../../types';

export const WorkForm: React.FC = () => {
  const { resumeData, updateSection } = useResume();
  const { work } = resumeData;

  const addWork = () => {
    const newWork: ResumeWork = {
      id: crypto.randomUUID(),
      name: '',
      position: '',
      url: '',
      startDate: '',
      endDate: '',
      summary: '',
      highlights: []
    };
    updateSection('work', [...work, newWork]);
  };

  useEffect(() => {
    if (work.length === 0) {
      addWork();
    }
  }, []);

  const removeWork = (index: number) => {
    const newWork = [...work];
    newWork.splice(index, 1);
    updateSection('work', newWork);
  };

  const updateWorkItem = (index: number, field: keyof ResumeWork, value: any) => {
    const newWork = [...work];
    newWork[index] = { ...newWork[index], [field]: value };
    updateSection('work', newWork);
  };

  const handleHighlights = (index: number, html: string) => {
     // Parse HTML to extract list items
     const parser = new DOMParser();
     const doc = parser.parseFromString(html, 'text/html');
     const listItems = Array.from(doc.querySelectorAll('li'));
     
     let highlights: string[] = [];
     
     if (listItems.length > 0) {
         highlights = listItems.map(li => li.innerHTML);
     } else {
         // Fallback for non-list content (e.g. paragraphs or divs)
         const body = doc.body;
         // If user didn't use list, we might want to split by block elements or just take the content.
         // A simple approach: split by <div>, <p>, <br>
         // But simplest is to just treat the whole block as one item if no LI, OR try to split.
         // Let's rely on <div> logic if available, or just keeping it raw.
         // Actually, if the user doesn't use bullets, it might be a single block.
         // Let's try to split by <div> if text is plain.
         // However, rich text editors often wrap lines in <div>.
         highlights = Array.from(body.childNodes)
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

     updateWorkItem(index, 'highlights', highlights);
  };

  // Convert highlights array back to HTML list for the editor
  const getHighlightsHTML = (highlights: string[]) => {
      if (!highlights || highlights.length === 0) return '';
      return `<ul>${highlights.map(h => `<li>${h}</li>`).join('')}</ul>`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-lg font-semibold text-gray-800">Experience</h3>
        <button onClick={addWork} className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100">
          <Plus size={14} /> Add Role
        </button>
      </div>

      {work.map((item, index) => (
        <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm relative group">
          <button 
            onClick={() => removeWork(index)}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Input label="Company Name" value={item.name} onChange={(e) => updateWorkItem(index, 'name', e.target.value)} />
             <Input label="Job Title" value={item.position} onChange={(e) => updateWorkItem(index, 'position', e.target.value)} />
             <Input label="Start Date" type="text" placeholder="YYYY-MM" value={item.startDate} onChange={(e) => updateWorkItem(index, 'startDate', e.target.value)} />
             <Input label="End Date" type="text" placeholder="YYYY-MM or Present" value={item.endDate} onChange={(e) => updateWorkItem(index, 'endDate', e.target.value)} />
          </div>
          
          <RichTextEditor 
            label="Bullet Points" 
            value={getHighlightsHTML(item.highlights)} 
            onChange={(html) => handleHighlights(index, html)} 
          />
        </div>
      ))}
      
      {work.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No experience added yet.
        </div>
      )}
    </div>
  );
};