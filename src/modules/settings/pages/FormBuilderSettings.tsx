import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../../../components/ui/toast';
import { X, Plus, Eye, GripVertical, Trash2, Edit2, Save } from '../../../../components/icons';

interface FormField {
  id: string;
  label: string;
  name: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'date' | 'select' | 'checkbox' | 'textarea' | 'address';
  required: boolean;
  visible: boolean;
  section: string;
  placeholder?: string;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
  visibilityRules?: {
    field?: string;
    operator?: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
    value?: any;
  }[];
  products?: string[];
  order: number;
}

interface FormSection {
  id: string;
  title: string;
  description?: string;
  order: number;
  fields: FormField[];
}

const FormBuilderSettings: React.FC = () => {
  const { showToast } = useToast();
  const [formType, setFormType] = useState<'prep4loan' | 'urla1003'>('prep4loan');
  const [sections, setSections] = useState<FormSection[]>([
    {
      id: 'basic',
      title: 'Basic Information',
      description: 'Personal and contact information',
      order: 1,
      fields: [
        { id: 'f1', label: 'Full Name', name: 'fullName', type: 'text', required: true, visible: true, section: 'basic', order: 1 },
        { id: 'f2', label: 'Email', name: 'email', type: 'email', required: true, visible: true, section: 'basic', order: 2 },
        { id: 'f3', label: 'Phone Number', name: 'phoneNumber', type: 'tel', required: true, visible: true, section: 'basic', order: 3 },
        { id: 'f4', label: 'Date of Birth', name: 'dob', type: 'date', required: true, visible: true, section: 'basic', order: 4 },
      ]
    },
    {
      id: 'property',
      title: 'Property Information',
      description: 'Property details and location',
      order: 2,
      fields: [
        { id: 'f5', label: 'Property Type', name: 'propertyType', type: 'select', required: true, visible: true, section: 'property', options: ['Single Family', 'Condo', 'Townhouse', 'Multi-Family'], order: 1 },
        { id: 'f6', label: 'Property Use', name: 'propertyUse', type: 'select', required: true, visible: true, section: 'property', options: ['Primary Residence', 'Second Home', 'Investment'], order: 2 },
        { id: 'f7', label: 'Property Address', name: 'propertyAddress', type: 'address', required: true, visible: true, section: 'property', order: 3 },
      ]
    },
    {
      id: 'financial',
      title: 'Financial Information',
      description: 'Income, assets, and liabilities',
      order: 3,
      fields: [
        { id: 'f8', label: 'Annual Income', name: 'income', type: 'number', required: false, visible: true, section: 'financial', validation: { min: 0 }, order: 1 },
        { id: 'f9', label: 'Credit Score', name: 'creditScore', type: 'select', required: false, visible: true, section: 'financial', options: ['Excellent (740+)', 'Good (700-739)', 'Average (640-699)', 'Fair (580-639)'], order: 2 },
        { id: 'f10', label: 'Down Payment', name: 'downPayment', type: 'number', required: false, visible: true, section: 'financial', validation: { min: 0 }, order: 3 },
      ]
    },
    {
      id: 'employment',
      title: 'Employment Information',
      description: 'Current and previous employment',
      order: 4,
      fields: [
        { id: 'f11', label: 'Employment Status', name: 'employmentStatus', type: 'select', required: true, visible: true, section: 'employment', options: ['Employed', 'Self-Employed', 'Retired', 'Not Working'], order: 1 },
        { id: 'f12', label: 'Time in Job', name: 'timeInJob', type: 'select', required: false, visible: true, section: 'employment', options: ['Less than 1 year', '1-2 years', 'More than 2 years'], order: 2 },
      ]
    },
  ]);

  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [draggedField, setDraggedField] = useState<string | null>(null);
  const [newField, setNewField] = useState<Partial<FormField>>({
    label: '',
    name: '',
    type: 'text',
    required: false,
    visible: true,
    section: sections[0]?.id || 'basic',
  });

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'tel', label: 'Phone' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' },
    { value: 'select', label: 'Dropdown' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'address', label: 'Address' },
  ];

  const products = ['Conventional', 'FHA', 'VA', 'USDA', 'Jumbo', 'HELOC', 'Non-QM', 'Mobile Home'];

  const handleAddField = () => {
    if (!newField.label || !newField.name) {
      showToast('Please fill in field label and name', 'warning');
      return;
    }

    const section = sections.find(s => s.id === newField.section);
    if (!section) return;

    const field: FormField = {
      id: `f${Date.now()}`,
      label: newField.label,
      name: newField.name,
      type: newField.type || 'text',
      required: newField.required || false,
      visible: newField.visible !== false,
      section: newField.section || 'basic',
      placeholder: newField.placeholder,
      options: newField.type === 'select' ? [] : undefined,
      order: section.fields.length + 1,
    };

    setSections(sections.map(s =>
      s.id === section.id
        ? { ...s, fields: [...s.fields, field] }
        : s
    ));

    setNewField({
      label: '',
      name: '',
      type: 'text',
      required: false,
      visible: true,
      section: section.id,
    });
    setShowAddFieldModal(false);
    showToast('Field added successfully', 'success');
  };

  const handleDeleteField = (sectionId: string, fieldId: string) => {
    setSections(sections.map(s =>
      s.id === sectionId
        ? { ...s, fields: s.fields.filter(f => f.id !== fieldId) }
        : s
    ));
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
    showToast('Field deleted', 'success');
  };

  const handleUpdateField = (sectionId: string, fieldId: string, updates: Partial<FormField>) => {
    setSections(sections.map(s =>
      s.id === sectionId
        ? {
            ...s,
            fields: s.fields.map(f =>
              f.id === fieldId ? { ...f, ...updates } : f
            )
          }
        : s
    ));
    if (selectedField?.id === fieldId) {
      setSelectedField({ ...selectedField, ...updates });
    }
    showToast('Field updated', 'success');
  };

  const handleSave = () => {
    // TODO: Implement API call to save form configuration
    showToast('Form configuration saved successfully!', 'success');
  };

  const handleDragStart = (fieldId: string) => {
    setDraggedField(fieldId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetSectionId: string, targetIndex: number) => {
    if (!draggedField) return;

    let sourceSection: FormSection | null = null;
    let sourceField: FormField | null = null;

    sections.forEach(section => {
      const field = section.fields.find(f => f.id === draggedField);
      if (field) {
        sourceSection = section;
        sourceField = field;
      }
    });

    if (!sourceSection || !sourceField) return;

    // Remove from source
    const updatedSections = sections.map(s =>
      s.id === sourceSection!.id
        ? { ...s, fields: s.fields.filter(f => f.id !== draggedField) }
        : s
    );

    // Add to target
    const targetSection = updatedSections.find(s => s.id === targetSectionId);
    if (targetSection) {
      const newFields = [...targetSection.fields];
      newFields.splice(targetIndex, 0, { ...sourceField, section: targetSectionId });
      
      setSections(updatedSections.map(s =>
        s.id === targetSectionId
          ? { ...s, fields: newFields.map((f, idx) => ({ ...f, order: idx + 1 })) }
          : s
      ));
    }

    setDraggedField(null);
  };

  return (
    <div className="p-6 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-light text-foreground mb-2 tracking-tight">Form Builder</h1>
            <p className="text-base text-muted-foreground font-light" style={{ color: '#6b7280' }}>
              Customize form fields, sections, validation rules, and conditional logic
            </p>
          </div>
          <div className="flex gap-2">
            <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setFormType('prep4loan')}
                className={`px-4 py-2 rounded-md text-sm font-light transition-colors ${
                  formType === 'prep4loan'
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-gray-600 hover:text-foreground'
                }`}
              >
                Prep4Loan
              </button>
              <button
                onClick={() => setFormType('urla1003')}
                className={`px-4 py-2 rounded-md text-sm font-light transition-colors ${
                  formType === 'urla1003'
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-gray-600 hover:text-foreground'
                }`}
              >
                URLA 1003
              </button>
            </div>
            <motion.button
              onClick={handleSave}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-light transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Form
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Fields List - Main Content */}
          <div className="lg:col-span-3 space-y-4">
            {sections.map((section) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-light text-foreground">{section.title}</h3>
                    {section.description && (
                      <p className="text-sm text-muted-foreground font-light mt-1">{section.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setNewField({ ...newField, section: section.id })}
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg font-light transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Field
                  </button>
                </div>
                <div className="space-y-2">
                  {section.fields.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground font-light">
                      No fields in this section. Click "Add Field" to get started.
                    </div>
                  ) : (
                    section.fields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        draggable
                        onDragStart={() => handleDragStart(field.id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => {
                          e.preventDefault();
                          handleDrop(section.id, index);
                        }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100/50 transition-colors cursor-move ${
                          selectedField?.id === field.id ? 'ring-2 ring-primary' : ''
                        }`}
                      >
                        <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex-shrink-0 w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                            <span className="text-xs text-primary font-medium">
                              {field.type === 'select' ? 'S' : field.type === 'number' ? 'N' : field.type === 'email' ? 'E' : field.type === 'tel' ? 'P' : 'T'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-light text-foreground truncate">{field.label}</div>
                            <div className="text-xs text-muted-foreground font-light">
                              {field.name} • {field.type}
                              {field.required && ' • Required'}
                              {!field.visible && ' • Hidden'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedField(field)}
                            className="p-1.5 text-gray-600 hover:text-primary transition-colors"
                            title="Edit field"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteField(section.id, field.id)}
                            className="p-1.5 text-gray-600 hover:text-red-600 transition-colors"
                            title="Delete field"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sidebar - Field Editor */}
          <div className="space-y-4">
            {selectedField ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm sticky top-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-light text-foreground">Edit Field</h3>
                  <button
                    onClick={() => setSelectedField(null)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Label</label>
                    <input
                      type="text"
                      value={selectedField.label}
                      onChange={(e) => {
                        const updated = { ...selectedField, label: e.target.value };
                        setSelectedField(updated);
                        handleUpdateField(selectedField.section, selectedField.id, { label: e.target.value });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-light"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Field Name</label>
                    <input
                      type="text"
                      value={selectedField.name}
                      onChange={(e) => {
                        const updated = { ...selectedField, name: e.target.value };
                        setSelectedField(updated);
                        handleUpdateField(selectedField.section, selectedField.id, { name: e.target.value });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-light"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Field Type</label>
                    <select
                      value={selectedField.type}
                      onChange={(e) => {
                        const updated = { ...selectedField, type: e.target.value as FormField['type'] };
                        setSelectedField(updated);
                        handleUpdateField(selectedField.section, selectedField.id, { type: e.target.value as FormField['type'] });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-light"
                    >
                      {fieldTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  {selectedField.type === 'select' && (
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">Options (comma-separated)</label>
                      <textarea
                        value={selectedField.options?.join(', ') || ''}
                        onChange={(e) => {
                          const options = e.target.value.split(',').map(o => o.trim()).filter(o => o);
                          const updated = { ...selectedField, options };
                          setSelectedField(updated);
                          handleUpdateField(selectedField.section, selectedField.id, { options });
                        }}
                        placeholder="Option 1, Option 2, Option 3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-light"
                        rows={3}
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Placeholder</label>
                    <input
                      type="text"
                      value={selectedField.placeholder || ''}
                      onChange={(e) => {
                        const updated = { ...selectedField, placeholder: e.target.value };
                        setSelectedField(updated);
                        handleUpdateField(selectedField.section, selectedField.id, { placeholder: e.target.value });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-light"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedField.required}
                        onChange={(e) => {
                          const updated = { ...selectedField, required: e.target.checked };
                          setSelectedField(updated);
                          handleUpdateField(selectedField.section, selectedField.id, { required: e.target.checked });
                        }}
                        className="w-4 h-4 text-primary rounded focus:ring-primary/20"
                      />
                      <span className="text-sm font-light text-foreground">Required</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedField.visible}
                        onChange={(e) => {
                          const updated = { ...selectedField, visible: e.target.checked };
                          setSelectedField(updated);
                          handleUpdateField(selectedField.section, selectedField.id, { visible: e.target.checked });
                        }}
                        className="w-4 h-4 text-primary rounded focus:ring-primary/20"
                      />
                      <span className="text-sm font-light text-foreground">Visible</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Attach to Products</label>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {products.map(product => (
                        <label key={product} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedField.products?.includes(product) || false}
                            onChange={(e) => {
                              const currentProducts = selectedField.products || [];
                              const products = e.target.checked
                                ? [...currentProducts, product]
                                : currentProducts.filter(p => p !== product);
                              const updated = { ...selectedField, products };
                              setSelectedField(updated);
                              handleUpdateField(selectedField.section, selectedField.id, { products });
                            }}
                            className="w-4 h-4 text-primary rounded focus:ring-primary/20"
                          />
                          <span className="text-xs font-light text-foreground">{product}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
                <h3 className="text-lg font-light text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowAddFieldModal(true)}
                    className="w-full px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 font-light transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Field
                  </button>
                  <button
                    onClick={() => setShowPreview(true)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-light transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Preview Form
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-muted-foreground font-light">
                    Select a field to edit its properties, validation rules, and visibility conditions.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Field Modal */}
        {showAddFieldModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddFieldModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-light text-foreground">Add New Field</h2>
                <button
                  onClick={() => setShowAddFieldModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Section</label>
                  <select
                    value={newField.section}
                    onChange={(e) => setNewField({ ...newField, section: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-light"
                  >
                    {sections.map(section => (
                      <option key={section.id} value={section.id}>{section.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Field Label *</label>
                  <input
                    type="text"
                    value={newField.label || ''}
                    onChange={(e) => setNewField({ ...newField, label: e.target.value, name: e.target.value.toLowerCase().replace(/\s+/g, '') })}
                    placeholder="e.g., Full Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-light"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Field Name *</label>
                  <input
                    type="text"
                    value={newField.name || ''}
                    onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                    placeholder="e.g., fullName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-light"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Field Type</label>
                  <select
                    value={newField.type}
                    onChange={(e) => setNewField({ ...newField, type: e.target.value as FormField['type'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-light"
                  >
                    {fieldTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button
                    onClick={() => setShowAddFieldModal(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-light transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={handleAddField}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-light transition-colors"
                  >
                    Add Field
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowPreview(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-light text-foreground">Form Preview</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-6">
                {sections.map(section => (
                  <div key={section.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <h3 className="text-lg font-light text-foreground mb-3">{section.title}</h3>
                    <div className="space-y-3">
                      {section.fields.filter(f => f.visible).map(field => (
                        <div key={field.id}>
                          <label className="block text-sm font-medium mb-1.5 text-foreground">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          {field.type === 'select' ? (
                            <select
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-light"
                              disabled
                            >
                              <option>{field.placeholder || `Select ${field.label}`}</option>
                              {field.options?.map(opt => (
                                <option key={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : field.type === 'checkbox' ? (
                            <label className="flex items-center gap-2">
                              <input type="checkbox" disabled className="w-4 h-4" />
                              <span className="text-sm font-light text-foreground">{field.label}</span>
                            </label>
                          ) : field.type === 'textarea' ? (
                            <textarea
                              placeholder={field.placeholder}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-light"
                              rows={3}
                              disabled
                            />
                          ) : (
                            <input
                              type={field.type}
                              placeholder={field.placeholder}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-light"
                              disabled
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FormBuilderSettings;
