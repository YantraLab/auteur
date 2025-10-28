import React from 'react';
import type { BoardComponentProps } from '../../pluginSystem/pluginTypes';
import { MarkdownRenderer } from '../MarkdownRenderer';
import { SparklesIcon } from '../icons';

export const GeneratedDocBoard = ({ board, updateBoard }: BoardComponentProps) => {
    // Allow manual editing by default if there's no content
    const [isEditing, setIsEditing] = React.useState(() => !board.content || board.content.trim() === '');

    if (!isEditing) {
        if (!board.content?.trim()) {
            return (
                <div className="text-center text-brand-text-dim p-4 flex flex-col items-center justify-center h-full min-h-[200px] cursor-text" onDoubleClick={() => setIsEditing(true)}>
                    <p>This board is empty.</p>
                    <p className="text-xs mt-1">Double-click to start writing, or use the button below to generate content with AI.</p>
                </div>
            );
        }
        return <div onDoubleClick={() => setIsEditing(true)} className="cursor-text h-full"><MarkdownRenderer content={board.content} /></div>;
    }

    return (
        <textarea 
            value={board.content || ''} 
            onChange={(e) => updateBoard(board.id, { content: e.target.value })} 
            onBlur={() => setIsEditing(false)}
            className="w-full h-full bg-transparent text-sm p-1 focus:outline-none resize-y placeholder:text-brand-text-dim/50" 
            placeholder={`Describe the ${board.title.toLowerCase()}...`} 
            autoFocus
        />
    );
};


export const GeneratedDocFooter = ({ board, onGenerateVisualStyle, onGenerateCinematography, isGenerating }: BoardComponentProps) => {
    const isVisualStyle = board.type === 'DOCUMENT_VISUAL_STYLE';
    const isCinematography = board.type === 'DOCUMENT_CINEMATOGRAPHY';
    
    // Determine the correct generator function based on the board type
    const generator = isVisualStyle ? onGenerateVisualStyle : (isCinematography ? onGenerateCinematography : undefined);

    if (!generator) return null;

    return (
        <div className="flex justify-center">
            <button
                onClick={generator}
                disabled={isGenerating}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-brand-primary bg-brand-primary/10 hover:bg-brand-primary/20 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isGenerating ? (
                    <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Generating...
                    </>
                ) : (
                    <>
                        <SparklesIcon className="w-4 h-4" />
                        {board.content?.trim() ? `Regenerate with AI` : `Generate with AI`}
                    </>
                )}
            </button>
        </div>
    );
};
