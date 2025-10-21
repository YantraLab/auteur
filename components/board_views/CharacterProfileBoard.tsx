import React, { useState, useMemo, useRef } from 'react';
import type { ProjectType } from '../../types';
import { ChevronDownIcon, PlusIcon, TrashIcon } from '../icons';
import type { BoardComponentProps } from '../../pluginSystem/pluginTypes';

// Internal types for this component
type Profile = {
    id: string;
    name: string;
    imageUrl?: string;
    core: { role: string; goals: string; fears: string; backstory: string; internalConflict: string; };
    development: { arc: string; quirks: string; dialogueStyle: string; psychologicalProfile: string; visualCues: string; };
};
type ProfileSection = 'core' | 'development';
type TopLevelField = 'name' | 'imageUrl';
type CoreField = keyof Profile['core'];
type DevelopmentField = keyof Profile['development'];

interface CharacterEditorProps {
    profile: Profile;
    projectType: ProjectType;
    onFieldChange: (id: string, section: 'top' | ProfileSection, field: TopLevelField | CoreField | DevelopmentField, value: string) => void;
    onRemove: (id: string) => void;
}

const CharacterEditor = ({ profile, projectType, onFieldChange, onRemove }: CharacterEditorProps) => {
    const [openSections, setOpenSections] = useState({ core: true, development: true, main: true });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (section: ProfileSection, field: CoreField | DevelopmentField, value: string) => {
        onFieldChange(profile.id, section, field, value);
    };

    const handleTopLevelChange = (field: TopLevelField, value: string) => {
        onFieldChange(profile.id, 'top', field, value);
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target?.result as string;
                handleTopLevelChange('imageUrl', imageUrl);
            };
            reader.readAsDataURL(file);
        }
    };

    const isSeries = projectType === 'Series';

    const renderTextarea = (section: ProfileSection, field: CoreField | DevelopmentField, label: string, placeholder: string, seriesPlaceholder?: string) => (
        <div>
            <label className="block text-xs font-medium text-brand-text-dim mb-1">{label}</label>
            <textarea
                value={profile[section][field]}
                onChange={e => handleChange(section, field, e.target.value)}
                placeholder={isSeries && seriesPlaceholder ? seriesPlaceholder : placeholder}
                className="w-full p-2 bg-brand-bg border border-brand-muted rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none text-sm resize-y"
                rows={3}
            />
        </div>
    );

    return (
        <div className="bg-brand-bg/50 rounded-md border border-brand-muted/70">
            <div className="w-full flex justify-between items-center p-3 text-left font-semibold">
                <input
                    type="text"
                    value={profile.name}
                    onChange={e => handleTopLevelChange('name', e.target.value)}
                    placeholder="Character Name"
                    className="w-full bg-transparent p-1 font-semibold focus:outline-none focus:ring-1 focus:ring-brand-primary/50 rounded"
                />
                <div className="flex items-center gap-2">
                    <button onClick={() => onRemove(profile.id)} className="text-red-500/70 hover:text-red-500"><TrashIcon className="w-4 h-4" /></button>
                    <button onClick={() => setOpenSections(p => ({ ...p, main: !p.main }))}>
                        <ChevronDownIcon className={`w-5 h-5 transition-transform ${openSections.main ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>
            {openSections.main && (
                <div className="p-4 border-t border-brand-muted/70 space-y-6">
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <div className="flex justify-center items-center">
                        <button onClick={handleImageClick} className="relative w-24 h-24 rounded-full group bg-brand-bg border-2 border-dashed border-brand-muted hover:border-brand-primary transition-colors">
                            {profile.imageUrl ? (
                                <img src={profile.imageUrl} alt={profile.name} className="w-full h-full object-cover rounded-full" />
                            ) : (
                                <span className="text-brand-text-dim text-xs">Add Photo</span>
                            )}
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                Edit
                            </div>
                        </button>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-brand-text-dim border-b border-brand-muted/50 pb-1">Core Character Elements</h3>
                        <div>
                            <label className="block text-xs font-medium text-brand-text-dim mb-1">Role in the Story</label>
                            <input type="text" value={profile.core.role} onChange={e => handleChange('core', 'role', e.target.value)} placeholder="e.g., Protagonist, Antagonist, Mentor" className="w-full p-2 bg-brand-bg border border-brand-muted rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none text-sm" />
                        </div>
                        {renderTextarea('core', 'goals', 'Goals & Motivation', 'What does the character want? What happens if they fail?', 'What are their short-term and long-term goals across the series?')}
                        {renderTextarea('core', 'fears', 'Fears & Weaknesses', 'What are their flaws, fears, and vulnerabilities?', 'How do these weaknesses evolve or get challenged over time?')}
                        {renderTextarea('core', 'backstory', 'Backstory', 'Outline key formative events that explain their behavior.', 'Detail the key past events. A character bible can track this over seasons.')}
                        {renderTextarea('core', 'internalConflict', 'Internal Conflict (Core Misbelief)', 'What core misbelief do they hold that the story will challenge?', 'How does this misbelief manifest in different storylines or episodes?')}
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-brand-text-dim border-b border-brand-muted/50 pb-1">Character Development & Arc</h3>
                        {renderTextarea('development', 'arc', 'Character Arc', 'How will the character change emotionally over the story?', 'Map out the character\'s journey across the entire series.')}
                        {renderTextarea('development', 'quirks', 'Quirks & Mannerisms', 'A unique speaking tic, hobby, or nervous habit.', 'How do these quirks make them distinct and memorable in various situations?')}
                        {renderTextarea('development', 'dialogueStyle', 'Dialogue Style', 'Vocabulary, accent, rhythm, and what they hold back.', 'How do their speech patterns change depending on who they are talking to?')}
                        {renderTextarea('development', 'psychologicalProfile', 'Psychological Profile', 'Emotional triggers, what excites them, their ideas about happiness.', 'Explore their deeper emotional landscape to inform their actions authentically.')}
                        {renderTextarea('development', 'visualCues', 'Visual Cues', 'A signature piece of clothing, posture, or physical detail.', 'Concise, visually informative details that hint at their character type.')}
                    </div>
                </div>
            )}
        </div>
    );
};

export const CharacterProfileBoard = ({ board, updateBoard, settings }: BoardComponentProps) => {
    const initialProfiles = useMemo<Profile[]>(() => {
        try {
            const content = board.content || '[]';
            const parsed = JSON.parse(content);
            if (Array.isArray(parsed)) {
                return parsed.map(p => {
                    const { projectType, ...rest } = p; // remove old projectType field if it exists
                    return rest;
                });
            }
        } catch (e) { /* Fallback */ }
        return [];
    }, [board.content]);

    const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);

    const handleUpdate = (newProfiles: Profile[]) => {
        setProfiles(newProfiles);
        updateBoard(board.id, { content: JSON.stringify(newProfiles) });
    };

    const addCharacter = () => {
        const newProfile: Profile = {
            id: `char-${Date.now()}`,
            name: '',
            imageUrl: '',
            core: { role: '', goals: '', fears: '', backstory: '', internalConflict: '' },
            development: { arc: '', quirks: '', dialogueStyle: '', psychologicalProfile: '', visualCues: '' }
        };
        handleUpdate([...profiles, newProfile]);
    };

    const removeCharacter = (id: string) => {
        handleUpdate(profiles.filter(p => p.id !== id));
    };

    const handleFieldChange = (
        id: string,
        section: 'top' | ProfileSection,
        field: TopLevelField | CoreField | DevelopmentField,
        value: string
    ) => {
        const newProfiles = profiles.map(p => {
            if (p.id === id) {
                if (section === 'top') {
                    return { ...p, [field]: value };
                }
                return { ...p, [section]: { ...p[section as ProfileSection], [field]: value } };
            }
            return p;
        });
        handleUpdate(newProfiles as Profile[]);
    };

    if (profiles.length === 0) {
        return (
            <div className="text-center text-brand-text-dim p-4 flex flex-col items-center justify-center h-full min-h-[300px]">
                <p className="text-sm leading-relaxed mb-4 max-w-2xl">
                    A film character profile is a detailed document that outlines a fictional character's life, appearance, and personality to serve as a reference for the writer. It includes basic details like name, age, and occupation, but also goes deeper to cover aspects such as physical appearance, backstory, motivations, strengths, weaknesses, and relationships. A well-developed profile helps maintain character consistency throughout a script and creates more three-dimensional, compelling characters.
                </p>
                <button
                    onClick={addCharacter}
                    className="text-sm font-semibold text-brand-primary hover:text-brand-secondary bg-brand-primary/10 px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                >
                    <PlusIcon className="w-4 h-4" /> Add First Character
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4 text-sm">
            {profiles.map(profile => (
                <CharacterEditor
                    key={profile.id}
                    profile={profile}
                    projectType={settings.projectType}
                    onFieldChange={handleFieldChange}
                    onRemove={removeCharacter}
                />
            ))}
            <button
                onClick={addCharacter}
                className="w-full border-2 border-dashed border-brand-muted hover:border-brand-primary hover:bg-brand-primary/5 text-brand-text-dim hover:text-brand-primary font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6"
            >
                <PlusIcon className="w-5 h-5" /> Add Character
            </button>
        </div>
    );
};
