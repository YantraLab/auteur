import React, { useState, useMemo } from 'react';
import type { BoardComponentProps } from '../../pluginSystem/pluginTypes';

export const StoryTreatmentBoard = ({ board, updateBoard }: BoardComponentProps) => {
    type StoryTreatment = {
        title: string;
        logline: string;
        storySummary: string;
        characterDescriptions: string;
        toneAndTheme: string;
    };

    const initialTreatment = useMemo<StoryTreatment>(() => {
        try {
            const content = board.content || '{}';
            const parsed = JSON.parse(content);
            if (parsed && typeof parsed.title === 'string') {
                return parsed;
            }
        } catch (e) { /* Fallback */ }

        return {
            title: '',
            logline: '',
            storySummary: '',
            characterDescriptions: '',
            toneAndTheme: '',
        };
    }, [board.content]);

    const [treatment, setTreatment] = useState<StoryTreatment>(initialTreatment);

    const handleUpdate = (newTreatment: StoryTreatment) => {
        setTreatment(newTreatment);
        updateBoard(board.id, { content: JSON.stringify(newTreatment) });
    };

    const handleChange = (field: keyof StoryTreatment, value: string) => {
        handleUpdate({ ...treatment, [field]: value });
    };

    const renderInput = (
        field: keyof StoryTreatment,
        label: string,
        placeholder: string,
        isTextarea: boolean = false,
        rows: number = 3,
        isTitle: boolean = false
    ) => (
        <div>
            <label className="block text-xs font-medium text-brand-text-dim mb-1">{label}</label>
            {isTextarea ? (
                <textarea
                    value={treatment[field]}
                    onChange={e => handleChange(field, e.target.value)}
                    placeholder={placeholder}
                    className="w-full p-2 bg-brand-bg border border-brand-muted rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none text-sm resize-y"
                    rows={rows}
                />
            ) : (
                <input
                    type="text"
                    value={treatment[field]}
                    onChange={e => handleChange(field, e.target.value)}
                    placeholder={placeholder}
                    className={`w-full p-2 bg-brand-bg border border-brand-muted rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none ${isTitle ? 'text-base font-semibold' : 'text-sm'}`}
                />
            )}
        </div>
    );

    return (
        <div className="space-y-4 text-sm">
            {renderInput('title', 'Title', 'The working title of your project.', false, 0, true)}
            {renderInput('logline', 'Logline', 'A one-sentence summary of the premise, protagonist, goal, and conflict.', true, 2)}
            {renderInput('storySummary', 'Story Summary', 'A narrative description of the plot, told in the present tense.', true, 10)}
            {renderInput('characterDescriptions', 'Character Descriptions', 'An overview of the key characters, their motivations, and development.', true, 5)}
            {renderInput('toneAndTheme', 'Tone and Theme', 'An explanation of the film\'s style, atmosphere, and underlying message.', true, 5)}
        </div>
    );
};
