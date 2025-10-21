import React from 'react';
import type { ImageNote } from '../../types';
import type { BoardComponentProps } from '../../pluginSystem/pluginTypes';
import { TrashIcon, SparklesIcon } from '../icons';

const EmptyState = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-center h-full min-h-[150px] p-4 text-center">
        <p className="text-xs text-brand-text-dim leading-relaxed max-w-md">{children}</p>
    </div>
);

export const StoryboardView = ({ board, removeNoteFromBoard, handleNoteUpdate }: BoardComponentProps) => {
    if (!board.notes || board.notes.length === 0) {
        return (
            <EmptyState>
                A storyboard is a sequential panel-by-panel plan of a story, focusing on action, camera angles, and narrative flow.
            </EmptyState>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(board.notes as ImageNote[]).map(note => (
                <div key={note.id} className="relative group">
                    <button onClick={() => removeNoteFromBoard(board.id, note.id)} className="absolute top-1 right-1 p-1 bg-white/50 backdrop-blur-sm rounded-full text-brand-text-dim hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"><TrashIcon className="w-3 h-3"/></button>
                    <img src={note.imageUrl} alt={note.caption} className="w-full h-auto rounded-md object-cover mb-1 aspect-square border border-brand-muted/50"/>
                    <textarea
                        value={note.caption}
                        onChange={(e) => handleNoteUpdate(board.id, note.id, { caption: e.target.value })}
                        placeholder="Caption..."
                        className="w-full p-1 bg-transparent focus:outline-none text-xs text-brand-text-dim placeholder:text-brand-text-dim/70 focus:ring-1 focus:ring-brand-primary/50 border border-transparent focus:border-brand-primary/30 rounded resize-y min-h-[2rem]"
                        rows={2}
                    />
                </div>
            ))}
        </div>
    );
};

export const StoryboardFooter = ({ board, imageGenerationState, setImageGenerationStateForBoard, handleGenerateImageForStoryboard }: BoardComponentProps) => {
    if (!imageGenerationState || !setImageGenerationStateForBoard || !handleGenerateImageForStoryboard) return null;
    
    const { prompt, isLoading, error } = imageGenerationState;
    return (
        <div>
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setImageGenerationStateForBoard({ ...imageGenerationState, prompt: e.target.value, error: null })}
                    placeholder="Describe a shot to generate..."
                    disabled={isLoading}
                    className="w-full p-2 bg-brand-bg border border-brand-muted rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none text-sm"
                />
                <button
                    onClick={handleGenerateImageForStoryboard}
                    disabled={isLoading || !prompt.trim()}
                    className="p-2 rounded-md bg-brand-primary hover:bg-brand-secondary text-white disabled:bg-brand-primary/50 disabled:cursor-not-allowed transition-colors flex items-center justify-center w-10 h-10 flex-shrink-0"
                    title="Generate Image with AI"
                >
                    {isLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <SparklesIcon className="w-5 h-5" />
                    )}
                </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>
    );
};
