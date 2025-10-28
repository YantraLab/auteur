import React from 'react';
import type { Project } from '../types';
import { CameraIcon, PlusIcon, XMarkIcon } from './icons';

interface SidebarProps {
    projects: Project[];
    activeProjectId: string | null;
    setActiveProjectId: (id: string | null) => void;
    createNewProject: () => void;
    setGearModalOpen: (isOpen: boolean) => void;
    isSidebarOpen: boolean;
    setSidebarOpen: (isOpen: boolean) => void;
}

export const Sidebar = ({ projects, activeProjectId, setActiveProjectId, createNewProject, setGearModalOpen, isSidebarOpen, setSidebarOpen }: SidebarProps) => {
    return (
        <aside className={`fixed inset-y-0 left-0 w-64 bg-brand-bg flex flex-col p-4 border-r border-brand-muted z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:pt-24 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="md:hidden flex justify-between items-center mb-4 flex-shrink-0">
                <div className="flex items-center">
                    <img src="/film.png" alt="Auteur Logo" className="h-8 w-8 mr-2"/>
                    <h1 className="font-bitcount text-2xl font-light text-brand-text" style={{ fontVariationSettings: '"slnt" 0, "CRSV" 0.5, "ELSH" 0, "ELXP" 0' }}>Auteur</h1>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-1 text-brand-text-dim">
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>
            <div className="flex-grow overflow-y-auto">
                <h2 className="text-xs font-semibold text-brand-text-dim uppercase tracking-wider mb-2 px-3">Projects</h2>
                <ul>
                    {projects.map(project => (
                        <li key={project.id}>
                            <button
                                onClick={() => setActiveProjectId(project.id)}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${activeProjectId === project.id ? 'font-semibold text-brand-primary' : 'font-normal text-brand-text-dim hover:bg-brand-muted/70 hover:text-brand-text'}`}
                            >
                                {project.name}
                            </button>
                        </li>
                    ))}
                </ul>
                <button onClick={createNewProject} className="mt-4 text-brand-primary hover:text-brand-secondary flex items-center px-3 py-2 text-sm font-medium"><PlusIcon className="w-4 h-4 mr-2"/> New Project</button>
            </div>
            <div className="flex-shrink-0">
                <button onClick={() => setGearModalOpen(true)} className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-brand-surface border border-brand-muted hover:bg-brand-muted text-sm font-semibold transition-colors">
                    <CameraIcon className="w-5 h-5"/> Manage Gear
                </button>
            </div>
            <footer className="flex-shrink-0 mt-4 pt-4 border-t border-brand-muted text-xs text-brand-text-dim text-center space-y-1">
                <p>© 2024 YantraLab</p>
                <a 
                    href="https://github.com/priyankt3i" 
                    title="github" 
                    className="hover:underline" 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    by - priyankt3i
                </a>
            </footer>
        </aside>
    );
};