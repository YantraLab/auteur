import React from 'react';
import { PROJECT_TEMPLATES } from '../../constants';
import type { ProjectTemplate } from '../../types';
import { XMarkIcon } from '../icons';

interface ProjectTemplateModalProps {
  onClose: () => void;
  onSelectTemplate: (template: ProjectTemplate) => void;
}

export const ProjectTemplateModal = ({ onClose, onSelectTemplate }: ProjectTemplateModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4 md:p-8" onClick={onClose}>
      <div className="bg-brand-surface rounded-lg shadow-2xl w-full max-w-4xl text-brand-text relative border border-brand-muted max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-brand-muted flex-shrink-0">
            <h2 className="text-xl font-bold text-brand-text">Create a New Project</h2>
            <button onClick={onClose} className="text-brand-text-dim hover:text-brand-primary transition-colors">
                <XMarkIcon className="w-6 h-6"/>
            </button>
        </div>

        <div className="overflow-y-auto flex-grow p-6">
            <p className="text-brand-text-dim mb-6">Start with a template to structure your creative process, or begin with a blank canvas.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PROJECT_TEMPLATES.map(template => (
                    <button 
                        key={template.name}
                        onClick={() => onSelectTemplate(template)}
                        className="text-left p-6 bg-brand-bg/60 rounded-lg border-2 border-brand-muted hover:border-brand-primary hover:bg-brand-primary/5 transition-all duration-200 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-brand-surface"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 bg-brand-primary/10 p-3 rounded-md">
                                <template.icon className="w-6 h-6 text-brand-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-brand-text">{template.name}</h3>
                                <p className="text-sm text-brand-text-dim mt-1">{template.description}</p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
