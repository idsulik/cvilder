import React, { useEffect } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Input } from '../ui/Input';
import { Plus, Trash2 } from 'lucide-react';
import { ResumeCertification } from '../../types';

export const CertificationsForm: React.FC = () => {
  const { resumeData, updateSection } = useResume();
  const { certifications } = resumeData;

  const addCert = () => {
    const newCert: ResumeCertification = {
      id: crypto.randomUUID(),
      name: '',
      issuer: '',
      date: '',
      url: ''
    };
    updateSection('certifications', [...certifications, newCert]);
  };

  useEffect(() => {
    if (certifications.length === 0) {
      addCert();
    }
  }, []);

  const removeCert = (index: number) => {
    const newCerts = [...certifications];
    newCerts.splice(index, 1);
    updateSection('certifications', newCerts);
  };

  const updateCert = (index: number, field: keyof ResumeCertification, value: any) => {
    const newCerts = [...certifications];
    newCerts[index] = { ...newCerts[index], [field]: value };
    updateSection('certifications', newCerts);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-lg font-semibold text-gray-800">Certifications</h3>
        <button onClick={addCert} className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100">
          <Plus size={14} /> Add Certification
        </button>
      </div>

      {certifications.map((item, index) => (
        <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm relative">
           <button 
            onClick={() => removeCert(index)}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Input label="Certification Name" value={item.name} onChange={(e) => updateCert(index, 'name', e.target.value)} />
             <Input label="Issuer" value={item.issuer} onChange={(e) => updateCert(index, 'issuer', e.target.value)} />
             <Input label="Date" placeholder="YYYY-MM" value={item.date} onChange={(e) => updateCert(index, 'date', e.target.value)} />
             <Input label="URL" value={item.url} onChange={(e) => updateCert(index, 'url', e.target.value)} />
          </div>
        </div>
      ))}

      {certifications.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No certifications added yet.
        </div>
      )}
    </div>
  );
};