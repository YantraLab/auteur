import React from 'react';
import type { Board as BoardType, Note, Gear, ProjectSettings } from '../types';
import { getPlugin } from '../pluginSystem/pluginRegistry';
import { TrashIcon, ExpandIcon } from './icons';
import { BoardContent } from './board_views/BoardContent';

interface BoardProps {
    board: BoardType;
    gear: Gear;
    settings: ProjectSettings;
    removeBoard: (boardId: string) => void;
    updateBoard: (boardId: string, updates: Partial<BoardType>) => void;
    setGearModalOpen: (isOpen: boolean) => void;
    addNoteToBoard: (boardId: string) => void;
    triggerImageUpload: (boardId: string) => void;
    removeNoteFromBoard: (boardId: string, noteId: string) => void;
    handleNoteUpdate: (boardId: string, noteId: string, updates: Partial<Note>) => void;
    onFullscreenClick: (boardId: string) => void;
    imageGenerationState: { prompt: string; isLoading: boolean; error: string | null };
    setImageGenerationStateForBoard: (state: { prompt: string; isLoading: boolean; error: string | null }) => void;
    handleGenerateImageForStoryboard: () => void;
    onDragHandlePointerDown: (e: React.PointerEvent) => void;
    onResizeHandlePointerDown: (e: React.PointerEvent) => void;
}

export const Board = (props: BoardProps) => {
    const { board, removeBoard, onFullscreenClick, addNoteToBoard, triggerImageUpload, onDragHandlePointerDown, onResizeHandlePointerDown } = props;

    const plugin = getPlugin(board.type);
    const HeaderActionsComponent = plugin?.headerActionsComponent;
    const FooterComponent = plugin?.footerComponent;
    
    return (
        <div className="bg-brand-surface rounded-lg border border-brand-muted shadow-card flex flex-col h-full transition-shadow hover:shadow-card-hover relative">
            <div 
                onPointerDown={onDragHandlePointerDown}
                className="flex justify-between items-center p-3 border-b border-brand-muted bg-brand-surface rounded-t-lg flex-shrink-0 cursor-move"
                style={{ touchAction: 'none' }}
            >
                <button 
                    onClick={() => onFullscreenClick(board.id)}
                    className="font-bold text-sm text-brand-text-dim uppercase tracking-wider text-left hover:text-brand-primary transition-colors"
                >
                    {board.title}
                </button>
                <div className="flex items-center gap-2">
                    {HeaderActionsComponent && <HeaderActionsComponent board={board} addNoteToBoard={addNoteToBoard} triggerImageUpload={triggerImageUpload} />}
                    <button onClick={() => onFullscreenClick(board.id)} className="p-1 rounded-full text-brand-text-dim hover:text-brand-primary hover:bg-brand-muted transition-colors" title="Fullscreen">
                        <ExpandIcon className="w-4 h-4"/>
                    </button>
                    <button onClick={() => removeBoard(board.id)} className="p-1 rounded-full text-brand-text-dim hover:text-red-500 hover:bg-red-500/10 transition-colors" title="Delete Board">
                        <TrashIcon className="w-4 h-4"/>
                    </button>
                </div>
            </div>
            <div className="p-4 overflow-y-auto flex-grow min-h-0">
                <BoardContent {...props} />
            </div>
            {FooterComponent && (
                <div className="p-3 border-t border-brand-muted bg-brand-bg/50 rounded-b-lg flex-shrink-0">
                    <FooterComponent {...props} />
                </div>
            )}
            <div
                onPointerDown={onResizeHandlePointerDown}
                className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize group"
                style={{ touchAction: 'none' }}
                title="Resize board"
            >
                <svg width="100%" height="100%" viewBox="0 0 5 5" className="text-brand-text-dim/30 group-hover:text-brand-text-dim/80 transition-colors">
                    <path d="M 5 3 L 5 5 L 3 5" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                    <path d="M 5 0 L 5 1 L 4 1" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                </svg>
            </div>
        </div>
    );
};