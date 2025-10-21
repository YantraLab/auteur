import React from 'react';
import type { TextNote } from '../../types';
import type { BoardComponentProps } from '../../pluginSystem/pluginTypes';
import { TrashIcon } from '../icons';

export const IdeaBoardView = ({ board, removeNoteFromBoard, handleNoteUpdate }: BoardComponentProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(board.notes as TextNote[] | undefined)?.map(note => (
            <div key={note.id} className="relative group bg-brand-bg/60 border border-brand-muted/50 rounded-md p-2 transition-shadow hover:shadow-md">
                <button onClick={() => removeNoteFromBoard(board.id, note.id)} className="absolute top-1 right-1 p-1 bg-white rounded-full text-brand-text-dim hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"><TrashIcon className="w-3 h-3"/></button>
                <textarea 
                    value={note.content} 
                    onChange={(e) => handleNoteUpdate(board.id, note.id, { content: e.target.value })} 
                    placeholder="Type an idea..." 
                    className="w-full h-28 p-1 bg-transparent focus:outline-none resize-none text-sm placeholder:text-brand-text-dim/50"
                />
            </div>
            ))}
        </div>
    );
};
