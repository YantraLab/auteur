import React from 'react';
import type { ImageNote } from '../../types';
import type { BoardComponentProps } from '../../pluginSystem/pluginTypes';
import { TrashIcon } from '../icons';

interface MoodboardViewProps {
    board: BoardComponentProps['board'];
    removeNoteFromBoard: BoardComponentProps['removeNoteFromBoard'];
    handleNoteUpdate: BoardComponentProps['handleNoteUpdate'];
}

const EmptyState = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-center h-full min-h-[150px] p-4 text-center">
        <div className="text-xs text-brand-text-dim leading-relaxed max-w-md">{children}</div>
    </div>
);

export const MoodboardView = ({ board, removeNoteFromBoard, handleNoteUpdate }: MoodboardViewProps) => {
    if (!board.notes || board.notes.length === 0) {
        return (
            <EmptyState>
                <p>A mood board is a collection of visual elements like images, colors, and textures that establish the overall aesthetic, mood, and feel of a project.</p>
                <p className="mt-3"><span className="font-semibold">How is it different from a Storyboard?</span><br />Storyboards plan the sequence of events and narrative flow, while mood boards are used for inspiration and to define the project's look and feel.</p>
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
