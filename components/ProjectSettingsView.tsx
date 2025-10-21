import React from 'react';
import type { ProjectSettings } from '../types';
import { CogIcon } from './icons';
import { FRAME_RATES, ASPECT_RATIOS, RESOLUTIONS, PROJECT_TYPES } from '../constants';

interface ProjectSettingsViewProps {
    settings: ProjectSettings;
    handleSettingsChange: (field: keyof ProjectSettings, value: string) => void;
    setStyleModalOpen: (isOpen: boolean) => void;
}

export const ProjectSettingsView = ({ settings, handleSettingsChange, setStyleModalOpen }: ProjectSettingsViewProps) => {
    return (
        <div className="bg-brand-surface rounded-lg border border-brand-muted shadow-card">
            <div className="flex justify-between items-center p-3 border-b border-brand-muted bg-brand-bg/50 rounded-t-lg">
                <h2 className="font-bold text-sm text-brand-text-dim uppercase tracking-wider flex items-center"><CogIcon className="w-4 h-4 mr-2"/>Project Settings</h2>
            </div>
            <div className="p-4 space-y-4">
                <div>
                    <label className="block text-xs font-medium text-brand-text-dim mb-1">Cinematic Style</label>
                    <div className="flex items-center gap-2">
                        <p className="flex-grow p-2 bg-brand-bg border border-brand-muted rounded-md text-sm text-brand-text-dim min-h-[42px]">{settings.style || 'No style defined.'}</p>
                        <button onClick={() => setStyleModalOpen(true)} className="py-2 px-4 rounded-md bg-brand-surface border border-brand-muted hover:bg-brand-muted text-brand-text font-semibold text-sm transition-colors">Edit Style</button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="projectType" className="block text-xs font-medium text-brand-text-dim mb-1">Project Type</label>
                        <select id="projectType" value={settings.projectType} onChange={(e) => handleSettingsChange('projectType', e.target.value)} className="w-full p-2 bg-brand-bg border border-brand-muted rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none text-sm">
                            {PROJECT_TYPES.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                    {Object.entries({frameRate: FRAME_RATES, aspectRatio: ASPECT_RATIOS, resolution: RESOLUTIONS}).map(([key, options]) => (
                        <div key={key}>
                            <label htmlFor={key} className="block text-xs font-medium text-brand-text-dim mb-1">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                            <select id={key} value={settings[key as keyof ProjectSettings]} onChange={(e) => handleSettingsChange(key as keyof ProjectSettings, e.target.value)} className="w-full p-2 bg-brand-bg border border-brand-muted rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none text-sm">
                                {options.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};