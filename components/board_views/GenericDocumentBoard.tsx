import React, { useMemo } from 'react';
import type { BoardComponentProps } from '../../pluginSystem/pluginTypes';
import { LiveCursor } from './LiveCursor';

export const GenericDocumentBoard = ({ board, updateBoard, allUsers, currentUser }: BoardComponentProps) => {
    
    const collaborator = useMemo(() => {
        if (!allUsers || !currentUser) return null;
        return allUsers.find(u => u.id !== currentUser.id && u.id === board.focusedUserId);
    }, [allUsers, currentUser, board.focusedUserId]);

    return (
        <div className="w-full h-full relative">
            {collaborator && <LiveCursor user={collaborator} containerBoundaryRef={null} />}
            <textarea 
                value={board.content || ''} 
                onChange={(e) => updateBoard(board.id, { content: e.target.value })} 
                className="w-full h-96 bg-transparent text-sm p-1 focus:outline-none resize-y placeholder:text-brand-text-dim/50" 
                placeholder={`Start writing your ${board.title}...`} 
            />
        </div>
    );
};
