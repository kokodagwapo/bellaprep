import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import {
  FileText,
  Plus,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Trash2,
  Copy,
  Eye,
  Settings,
  Type,
  Hash,
  Calendar,
  ToggleLeft,
  List,
  MapPin,
  DollarSign,
  Phone,
  Mail,
  Save,
} from 'lucide-react';

interface FormField {
  id: string;
  key: string;
  label: string;
  type: string;
  required: boolean;
  width: 'FULL' | 'HALF' | 'THIRD';
}

interface FormSection {
  id: string;
  name: string;
  description?: string;
  isExpanded: boolean;
  fields: FormField[];
}

const fieldTypes = [
  { value: 'TEXT', label: 'Text', icon: Type },
  { value: 'NUMBER', label: 'Number', icon: Hash },
  { value: 'CURRENCY', label: 'Currency', icon: DollarSign },
  { value: 'DATE', label: 'Date', icon: Calendar },
  { value: 'SELECT', label: 'Dropdown', icon: List },
  { value: 'BOOLEAN', label: 'Yes/No', icon: ToggleLeft },
  { value: 'ADDRESS', label: 'Address', icon: MapPin },
  { value: 'PHONE', label: 'Phone', icon: Phone },
  { value: 'EMAIL', label: 'Email', icon: Mail },
];

export const FormBuilderPage: React.FC = () => {
  const [sections, setSections] = useState<FormSection[]>([
    {
      id: '1',
      name: 'Borrower Information',
      description: 'Basic information about the borrower',
      isExpanded: true,
      fields: [
        { id: 'f1', key: 'firstName', label: 'First Name', type: 'TEXT', required: true, width: 'HALF' },
        { id: 'f2', key: 'lastName', label: 'Last Name', type: 'TEXT', required: true, width: 'HALF' },
        { id: 'f3', key: 'email', label: 'Email Address', type: 'EMAIL', required: true, width: 'HALF' },
        { id: 'f4', key: 'phone', label: 'Phone Number', type: 'PHONE', required: true, width: 'HALF' },
        { id: 'f5', key: 'dob', label: 'Date of Birth', type: 'DATE', required: true, width: 'THIRD' },
        { id: 'f6', key: 'ssn', label: 'SSN', type: 'TEXT', required: true, width: 'THIRD' },
        { id: 'f7', key: 'maritalStatus', label: 'Marital Status', type: 'SELECT', required: true, width: 'THIRD' },
      ],
    },
    {
      id: '2',
      name: 'Property Information',
      description: 'Details about the subject property',
      isExpanded: false,
      fields: [
        { id: 'f8', key: 'propertyAddress', label: 'Property Address', type: 'ADDRESS', required: true, width: 'FULL' },
        { id: 'f9', key: 'propertyType', label: 'Property Type', type: 'SELECT', required: true, width: 'HALF' },
        { id: 'f10', key: 'occupancyType', label: 'Occupancy', type: 'SELECT', required: true, width: 'HALF' },
        { id: 'f11', key: 'propertyValue', label: 'Estimated Value', type: 'CURRENCY', required: true, width: 'HALF' },
        { id: 'f12', key: 'yearBuilt', label: 'Year Built', type: 'NUMBER', required: false, width: 'HALF' },
      ],
    },
    {
      id: '3',
      name: 'Loan Details',
      description: 'Information about the requested loan',
      isExpanded: false,
      fields: [
        { id: 'f13', key: 'loanAmount', label: 'Loan Amount', type: 'CURRENCY', required: true, width: 'HALF' },
        { id: 'f14', key: 'downPayment', label: 'Down Payment', type: 'CURRENCY', required: true, width: 'HALF' },
        { id: 'f15', key: 'loanPurpose', label: 'Loan Purpose', type: 'SELECT', required: true, width: 'FULL' },
      ],
    },
  ]);

  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [showFieldPanel, setShowFieldPanel] = useState(false);

  const toggleSection = (id: string) => {
    setSections(sections.map(s => 
      s.id === id ? { ...s, isExpanded: !s.isExpanded } : s
    ));
  };

  const addSection = () => {
    const newSection: FormSection = {
      id: Date.now().toString(),
      name: 'New Section',
      isExpanded: true,
      fields: [],
    };
    setSections([...sections, newSection]);
  };

  const addField = (sectionId: string) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          fields: [...s.fields, {
            id: Date.now().toString(),
            key: `field_${Date.now()}`,
            label: 'New Field',
            type: 'TEXT',
            required: false,
            width: 'FULL' as const,
          }],
        };
      }
      return s;
    }));
  };

  const widthClasses = {
    FULL: 'col-span-12',
    HALF: 'col-span-6',
    THIRD: 'col-span-4',
  };

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      {/* Main Builder Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Form Builder</h1>
            <p className="text-gray-500 mt-1">Customize your loan application forms</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Template
            </button>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          <Reorder.Group values={sections} onReorder={setSections} className="space-y-4">
            {sections.map((section) => (
              <Reorder.Item key={section.id} value={section}>
                <motion.div
                  layout
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Section Header */}
                  <div
                    className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{section.name}</h3>
                        {section.description && (
                          <p className="text-sm text-gray-500">{section.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">{section.fields.length} fields</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); addField(section.id); }}
                        className="p-1.5 hover:bg-gray-200 rounded"
                      >
                        <Plus className="w-4 h-4 text-gray-500" />
                      </button>
                      {section.isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Section Fields */}
                  {section.isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="p-4"
                    >
                      <div className="grid grid-cols-12 gap-3">
                        {section.fields.map((field) => {
                          const FieldIcon = fieldTypes.find(t => t.value === field.type)?.icon || Type;
                          return (
                            <motion.div
                              key={field.id}
                              layout
                              className={`${widthClasses[field.width]} p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-emerald-300 cursor-pointer transition-colors group`}
                              onClick={() => {
                                setSelectedField(field);
                                setShowFieldPanel(true);
                              }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <GripVertical className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 cursor-grab" />
                                  <FieldIcon className="w-4 h-4 text-gray-400" />
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                                  <button className="p-1 hover:bg-gray-200 rounded">
                                    <Copy className="w-3 h-3 text-gray-400" />
                                  </button>
                                  <button className="p-1 hover:bg-red-50 rounded">
                                    <Trash2 className="w-3 h-3 text-red-400" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-sm font-medium text-gray-700">{field.label}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {field.required && <span className="text-red-400">* </span>}
                                {field.type.toLowerCase()}
                              </p>
                            </motion.div>
                          );
                        })}
                      </div>

                      {section.fields.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                          <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No fields yet. Click + to add fields.</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              </Reorder.Item>
            ))}
          </Reorder.Group>

          {/* Add Section Button */}
          <button
            onClick={addSection}
            className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-emerald-300 hover:text-emerald-500 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Section
          </button>
        </div>
      </div>

      {/* Field Properties Panel */}
      {showFieldPanel && selectedField && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Field Properties</h3>
            <button
              onClick={() => setShowFieldPanel(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronDown className="w-5 h-5 text-gray-400 rotate-90" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
              <input
                type="text"
                value={selectedField.label}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Field Key</label>
              <input
                type="text"
                value={selectedField.key}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                {fieldTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
              <div className="grid grid-cols-3 gap-2">
                {['FULL', 'HALF', 'THIRD'].map(width => (
                  <button
                    key={width}
                    className={`px-3 py-2 text-sm rounded-lg border ${
                      selectedField.width === width
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {width === 'FULL' ? '100%' : width === 'HALF' ? '50%' : '33%'}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={selectedField.required}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Required field</span>
            </label>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FormBuilderPage;

