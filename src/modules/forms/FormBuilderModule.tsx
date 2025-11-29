import React, { useState } from 'react';

interface FormField {
  id: string;
  type: 'text' | 'number' | 'select' | 'date' | 'checkbox' | 'phone' | 'email' | 'currency';
  label: string;
  name: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

interface FormTemplate {
  id: string;
  name: string;
  description: string;
  sections: FormSection[];
}

const defaultTemplates: FormTemplate[] = [
  {
    id: 'prep4loan',
    name: 'Prep4Loan',
    description: 'Quick pre-evaluation form',
    sections: [
      {
        id: 'personal',
        title: 'Personal Information',
        fields: [
          { id: 'f1', type: 'text', label: 'First Name', name: 'firstName', required: true },
          { id: 'f2', type: 'text', label: 'Last Name', name: 'lastName', required: true },
          { id: 'f3', type: 'email', label: 'Email', name: 'email', required: true },
          { id: 'f4', type: 'phone', label: 'Phone', name: 'phone', required: true },
        ],
      },
      {
        id: 'property',
        title: 'Property Information',
        fields: [
          { id: 'f5', type: 'text', label: 'Property Address', name: 'propertyAddress', required: true },
          { id: 'f6', type: 'select', label: 'Property Type', name: 'propertyType', required: true, options: ['Single Family', 'Condo', 'Townhouse', 'Multi-Family'] },
          { id: 'f7', type: 'currency', label: 'Estimated Value', name: 'estimatedValue', required: true },
        ],
      },
      {
        id: 'loan',
        title: 'Loan Details',
        fields: [
          { id: 'f8', type: 'select', label: 'Loan Purpose', name: 'loanPurpose', required: true, options: ['Purchase', 'Refinance', 'Cash-Out'] },
          { id: 'f9', type: 'currency', label: 'Loan Amount', name: 'loanAmount', required: true },
        ],
      },
    ],
  },
  {
    id: 'urla1003',
    name: 'URLA 1003',
    description: 'Full Uniform Residential Loan Application',
    sections: [
      {
        id: 'borrower',
        title: 'Section 1: Borrower Information',
        fields: [
          { id: 'u1', type: 'text', label: 'First Name', name: 'borrower.firstName', required: true },
          { id: 'u2', type: 'text', label: 'Last Name', name: 'borrower.lastName', required: true },
          { id: 'u3', type: 'date', label: 'Date of Birth', name: 'borrower.dob', required: true },
        ],
      },
    ],
  },
];

const fieldTypes = [
  { type: 'text', label: 'Text', icon: '📝' },
  { type: 'number', label: 'Number', icon: '🔢' },
  { type: 'email', label: 'Email', icon: '📧' },
  { type: 'phone', label: 'Phone', icon: '📱' },
  { type: 'date', label: 'Date', icon: '📅' },
  { type: 'select', label: 'Dropdown', icon: '📋' },
  { type: 'checkbox', label: 'Checkbox', icon: '☑️' },
  { type: 'currency', label: 'Currency', icon: '💰' },
];

const FormBuilderModule: React.FC = () => {
  const [templates, setTemplates] = useState<FormTemplate[]>(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(defaultTemplates[0]);
  const [selectedSection, setSelectedSection] = useState<FormSection | null>(null);
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = () => {
    setSaveMessage('Form template saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const addField = (type: string) => {
    if (!selectedTemplate || !selectedSection) return;
    const newField: FormField = {
      id: 'field-' + Date.now(),
      type: type as FormField['type'],
      label: 'New ' + type + ' field',
      name: 'field_' + Date.now(),
      required: false,
    };
    const updatedSection = { ...selectedSection, fields: [...selectedSection.fields, newField] };
    const updatedTemplate = {
      ...selectedTemplate,
      sections: selectedTemplate.sections.map(s => s.id === selectedSection.id ? updatedSection : s),
    };
    setTemplates(templates.map(t => t.id === selectedTemplate.id ? updatedTemplate : t));
    setSelectedTemplate(updatedTemplate);
    setSelectedSection(updatedSection);
    setSelectedField(newField);
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    if (!selectedTemplate || !selectedSection) return;
    const updatedFields = selectedSection.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f);
    const updatedSection = { ...selectedSection, fields: updatedFields };
    const updatedTemplate = {
      ...selectedTemplate,
      sections: selectedTemplate.sections.map(s => s.id === selectedSection.id ? updatedSection : s),
    };
    setTemplates(templates.map(t => t.id === selectedTemplate.id ? updatedTemplate : t));
    setSelectedTemplate(updatedTemplate);
    setSelectedSection(updatedSection);
    if (selectedField?.id === fieldId) setSelectedField({ ...selectedField, ...updates });
  };

  const deleteField = (fieldId: string) => {
    if (!selectedTemplate || !selectedSection) return;
    const updatedFields = selectedSection.fields.filter(f => f.id !== fieldId);
    const updatedSection = { ...selectedSection, fields: updatedFields };
    const updatedTemplate = {
      ...selectedTemplate,
      sections: selectedTemplate.sections.map(s => s.id === selectedSection.id ? updatedSection : s),
    };
    setTemplates(templates.map(t => t.id === selectedTemplate.id ? updatedTemplate : t));
    setSelectedTemplate(updatedTemplate);
    setSelectedSection(updatedSection);
    if (selectedField?.id === fieldId) setSelectedField(null);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Form Builder</h1>
          <p className="mt-1 text-gray-500">Customize Prep4Loan and URLA 1003 forms.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setPreviewMode(!previewMode)} className={`px-4 py-2 rounded-lg ${previewMode ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
            {previewMode ? '✏️ Edit' : '👁️ Preview'}
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
        </div>
      </header>

      {saveMessage && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{saveMessage}</div>}

      <div className="flex gap-2">
        {templates.map(template => (
          <button key={template.id} onClick={() => { setSelectedTemplate(template); setSelectedSection(null); setSelectedField(null); }}
            className={`px-4 py-2 rounded-lg ${selectedTemplate?.id === template.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
            {template.name}
          </button>
        ))}
      </div>

      {previewMode ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{selectedTemplate?.name} Preview</h2>
          {selectedTemplate?.sections.map(section => (
            <div key={section.id} className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{section.title}</h3>
              <div className="space-y-4">
                {section.fields.map(field => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.type === 'select' ? (
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="">Select...</option>
                        {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : field.type === 'checkbox' ? (
                      <input type="checkbox" className="w-4 h-4" />
                    ) : (
                      <input type={field.type === 'currency' || field.type === 'number' ? 'number' : field.type} placeholder={field.placeholder} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-2 bg-white rounded-2xl border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Add Field</h3>
            <div className="space-y-2">
              {fieldTypes.map(ft => (
                <button key={ft.type} onClick={() => addField(ft.type)} disabled={!selectedSection}
                  className="w-full px-3 py-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded-lg disabled:opacity-50">
                  <span className="mr-2">{ft.icon}</span>{ft.label}
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-6 space-y-4">
            {selectedTemplate?.sections.map(section => (
              <div key={section.id}
                className={`bg-white rounded-2xl border p-4 cursor-pointer ${selectedSection?.id === section.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'}`}
                onClick={() => { setSelectedSection(section); setSelectedField(null); }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{section.title}</h3>
                  <span className="text-xs text-gray-500">{section.fields.length} fields</span>
                </div>
                <div className="space-y-2">
                  {section.fields.map(field => (
                    <div key={field.id}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg ${selectedField?.id === field.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}
                      onClick={(e) => { e.stopPropagation(); setSelectedSection(section); setSelectedField(field); }}>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{fieldTypes.find(ft => ft.type === field.type)?.icon}</span>
                        <span className="text-sm text-gray-700">{field.label}</span>
                        {field.required && <span className="text-red-500 text-xs">*</span>}
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); deleteField(field.id); }} className="text-gray-400 hover:text-red-500">×</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="col-span-4 bg-white rounded-2xl border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Field Properties</h3>
            {selectedField ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
                  <input type="text" value={selectedField.label} onChange={(e) => updateField(selectedField.id, { label: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Field Name</label>
                  <input type="text" value={selectedField.name} onChange={(e) => updateField(selectedField.id, { name: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg font-mono" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={selectedField.required} onChange={(e) => updateField(selectedField.id, { required: e.target.checked })} className="w-4 h-4" />
                  <label className="text-sm text-gray-700">Required field</label>
                </div>
                {selectedField.type === 'select' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Options (one per line)</label>
                    <textarea value={selectedField.options?.join('\n') || ''} onChange={(e) => updateField(selectedField.id, { options: e.target.value.split('\n').filter(o => o.trim()) })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" rows={4} />
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">Select a field to edit</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilderModule;
