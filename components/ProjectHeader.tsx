import React from 'react';
import type { Project } from '../types';

interface ProjectHeaderProps {
    activeProject: Project;
    updateProject: (id: string, updates: Partial<Project>) => void;
}

export const ProjectHeader = ({ activeProject, updateProject }: ProjectHeaderProps) => {
    return (
        <div className="p-6 border-b border-brand-muted bg-brand-surface flex-shrink-0">
            <input
                type="text"
                value={activeProject.name}
                onChange={(e) => updateProject(activeProject.id, { name: e.target.value })}
                className="text-3xl font-extrabold bg-transparent focus:outline-none w-full"
                placeholder="Untitled Project"
            />
        </div>
    );
};