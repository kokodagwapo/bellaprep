import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../lib/api';
import type { FormTemplate } from '../../../lib/api/types';

const FormBuilder: React.FC = () => {
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await apiClient.get<FormTemplate[]>('/forms');
        setTemplates(data);
        if (data.length > 0) {
          setSelectedTemplate(data[0]);
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  if (isLoading) {
    return <div className="p-6">Loading form templates...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Form Builder</h1>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Form Templates</h2>
          <div className="space-y-2">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`w-full text-left p-3 border rounded-lg ${
                  selectedTemplate?.id === template.id ? 'border-primary bg-primary/10' : ''
                }`}
              >
                <div className="font-semibold">{template.name}</div>
                <div className="text-sm text-gray-600">{template.type}</div>
              </button>
            ))}
          </div>
        </div>
        <div>
          {selectedTemplate && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Form Structure</h2>
              <div className="space-y-4">
                {selectedTemplate.sections.map((section) => (
                  <div key={section.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">{section.title}</h3>
                    <div className="text-sm text-gray-600">
                      {section.fields.length} fields
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;

