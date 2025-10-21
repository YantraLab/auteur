import React from 'react';
import type { BoardComponentProps } from '../../pluginSystem/pluginTypes';

export const GenericDocumentBoard = ({ board, updateBoard }: BoardComponentProps) => {
    return (
        <textarea 
            value={board.content || ''} 
            onChange={(e) => updateBoard(board.id, { content: e.target.value })} 
            className="w-full h-96 bg-transparent text-sm p-1 focus:outline-none resize-y placeholder:text-brand-text-dim/50" 
            placeholder={`Start writing your ${board.title}...`} 
        />
    );
};
