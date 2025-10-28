import React from 'react';
import { PlusIcon } from './icons';

interface NoProjectSelectedProps {
    createNewProject: () => void;
}

export const NoProjectSelected = ({ createNewProject }: NoProjectSelectedProps) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-brand-text-dim p-8 text-center">
            <h2 className="text-2xl font-semibold mb-2">No Project Selected</h2>
            <p className="mb-6">Select a project from the menu or create a new one to get started.</p>
            <button
                onClick={createNewProject}
                className="bg-brand-primary text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-brand-secondary transform transition-all duration-200 flex items-center justify-center mx-auto"
            >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create New Project
            </button>
        </div>
    );
};