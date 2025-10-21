import React from 'react';
import type { Board as BoardType, Note, Gear, ProjectSettings } from '../../types';
import { getPlugin } from '../../pluginSystem/pluginRegistry';
import { XMarkIcon } from '../icons';
import { BoardContent } from '../board_views/BoardContent';

interface FullscreenBoardModalProps {
    board: BoardType;
    gear: Gear;
    settings: ProjectSettings;
    onClose: () => void;
    updateBoard: (boardId: string, updates: Partial<BoardType>) => void;
    setGearModalOpen: (isOpen: boolean) => void;
    addNoteToBoard: (boardId: string) => void;
    triggerImageUpload: (boardId: string) => void;
    removeNoteFromBoard: (boardId: string, noteId: string) => void;
    handleNoteUpdate: (boardId: string, noteId: string, updates: Partial<Note>) => void;
    imageGenerationState: { prompt: string; isLoading: boolean; error: string | null };
    setImageGenerationStateForBoard: (state: { prompt: string; isLoading: boolean; error: string | null }) => void;
    handleGenerateImageForStoryboard: () => void;
}

export const FullscreenBoardModal = (props: FullscreenBoardModalProps) => {
    const { board, onClose, addNoteToBoard, triggerImageUpload } = props;
    
    const plugin = getPlugin(board.type);
    const HeaderActionsComponent = plugin?.headerActionsComponent;
    const FooterComponent = plugin?.footerComponent;
    const FullscreenContentComponent = plugin?.fullscreenComponent;

    // Determine which component to render for the main content area
    const Content = FullscreenContentComponent ? 
        () => <FullscreenContentComponent {...props} /> : 
        () => <BoardContent {...props} />;
    
    const isSpecialView = !!FullscreenContentComponent;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4 md:p-8" onClick={onClose}>
            <div className="bg-brand-surface rounded-lg shadow-2xl w-full max-w-6xl text-brand-text relative border border-brand-muted max-h-[95vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-brand-muted flex-shrink-0">
                    <h2 className="font-bold text-base text-brand-text-dim uppercase tracking-wider">{board.title}</h2>
                    <div className="flex items-center gap-4">
                        {HeaderActionsComponent && <HeaderActionsComponent board={board} addNoteToBoard={addNoteToBoard} triggerImageUpload={triggerImageUpload} />}
                        <button onClick={onClose} className="text-brand-text-dim hover:text-brand-primary transition-colors">
                            <XMarkIcon className="w-6 h-6"/>
                        </button>
                    </div>
                </div>

                <div className={`overflow-y-auto flex-grow min-h-0 ${isSpecialView ? 'bg-[#111] text-white' : 'p-6'}`}>
                    <Content />
                </div>

                {FooterComponent && (
                    <div className="p-4 border-t border-brand-muted bg-brand-bg/50 rounded-b-lg flex-shrink-0">
                        <FooterComponent {...props} />
                    </div>
                )}
            </div>
        </div>
    );
};
