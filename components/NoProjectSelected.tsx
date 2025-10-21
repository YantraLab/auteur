import React from 'react';

export const NoProjectSelected = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-brand-text-dim">
            <h2 className="text-2xl font-semibold">No project selected</h2>
            <p>Create a new project to get started.</p>
        </div>
    );
};
