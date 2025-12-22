import React, { useEffect } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Input } from '../ui/Input';
import { RichTextEditor } from '../ui/RichTextEditor';
import { Plus, Trash2 } from 'lucide-react';
import { ResumeAdditionalSection } from '../../types';

export const AdditionalForm: React.FC = () => {
  const { resumeData, updateSection } = useResume();
  const { additional } = resumeData;

  const addSection = () => {
    const newSection: ResumeAdditionalSection = {
      id: crypto.randomUUID(),
      title: '',
      items: []
    };
    updateSection('additional', [...additional, newSection]);
  };

  useEffect(() => {
    if (additional.length === 0) {
      addSection();
    }
  }, []);

  const removeSection = (index: number) => {
    const newAdditional = [...additional];
    newAdditional.splice(index, 1);
    updateSection('additional', newAdditional);
  };

  const updateSectionItem = (index: number, field: keyof ResumeAdditionalSection, value: any) => {
    const newAdditional = [...additional];
    newAdditional[index] = { ...newAdditional[index], [field]: value };
    updateSection('additional', newAdditional);
  };

  const handleItems = (index: number, html: string) => {
     const parser = new DOMParser();
     const doc = parser.parseFromString(html, 'text/html');
     const listItems = Array.from(doc.querySelectorAll('li'));
     
     let items: string[] = [];
     if (listItems.length > 0) {
         items = listItems.map(li => li.innerHTML);
     } else {
         items = Array.from(doc.body.childNodes)
            .filter(node => node.textContent?.trim())
            .map(node => {
                if (node.nodeName === 'DIV' || node.nodeName === 'P') {
                    return (node as HTMLElement).innerHTML;
                }
                return node.textContent || '';
            });
         if (items.length === 0 && html.trim()) {
             items = [html];
         }
     }
     updateSectionItem(index, 'items', items);
  };

  const getItemsHTML = (items: string[]) => {
      if (!items || items.length === 0) return '';
      return `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-lg font-semibold text-gray-800">Additional Sections</h3>
        <button onClick={addSection} className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100">
          <Plus size={14} /> Add Section
        </button>
      </div>

      <p className="text-xs text-gray-500 mb-4">Use this for Languages, Awards, Volunteering, or Interests.</p>

      {additional.map((item, index) => (
        <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm relative">
           <button 
            onClick={() => removeSection(index)}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>

          <Input 
            label="Section Title (e.g. Languages)" 
            value={item.title} 
            onChange={(e) => updateSectionItem(index, 'title', e.target.value)} 
          />

          <RichTextEditor 
            label="Items" 
            value={getItemsHTML(item.items)} 
            onChange={(html) => handleItems(index, html)}
          />
        </div>
      ))}

      {additional.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No additional sections added yet.
        </div>
      )}
    </div>
  );
};