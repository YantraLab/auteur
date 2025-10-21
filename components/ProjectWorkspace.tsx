import React, { useState, useMemo, useRef } from 'react';
import type { Project, Board, Note, Gear } from '../types';
import type { BoardPlugin } from '../pluginSystem/pluginTypes';
import { ProjectHeader } from './ProjectHeader';
import { ProjectSettingsView } from './ProjectSettingsView';
import { Board as BoardComponent } from './Board';
import { AddBoardButton } from './AddBoardButton';
import { SparklesIcon } from './icons';

interface ProjectWorkspaceProps {
    activeProject: Project;
    updateProject: (id: string, updates: Partial<Project>) => void;
    gear: Gear;
    setGearModalOpen: (isOpen: boolean) => void;
    setStyleModalOpen: (isOpen: boolean) => void;
    setFullscreenBoardId: (id: string | null) => void;
    handleSettingsChange: (field: keyof Project['settings'], value: string) => void;
    updateBoard: (boardId: string, updates: Partial<Board>) => void;
    removeBoard: (boardId: string) => void;
    addBoard: (plugin: BoardPlugin) => void;
    handleGenerate: () => void;
    isLoading: boolean;
    imageGenerationState: Record<string, { prompt: string; isLoading: boolean; error: string | null }>;
    setImageGenerationState: React.Dispatch<React.SetStateAction<Record<string, { prompt: string; isLoading: boolean; error: string | null }>>>;
    handleGenerateImageForStoryboard: (boardId: string) => void;
    addNoteToBoard: (boardId: string) => void;
    removeNoteFromBoard: (boardId: string, noteId: string) => void;
    handleNoteUpdate: (boardId: string, noteId: string, updates: Partial<Note>) => void;
    triggerImageUpload: (boardId: string) => void;
}

// Grid constants
const GRID_COL_WIDTH = 380;
const GRID_ROW_HEIGHT = 120;
const GRID_GAP = 24;
const MAX_BOARD_WIDTH = 3;
const MAX_BOARD_HEIGHT = 10;

export const ProjectWorkspace = (props: ProjectWorkspaceProps) => {
    const { activeProject, updateBoard } = props;

    const [interaction, setInteraction] = useState({
        type: null as 'drag' | 'resize' | null,
        boardId: null as string | null,
        initialX: 0,
        initialY: 0,
        initialW: 0,
        initialH: 0,
        initialMouseX: 0,
        initialMouseY: 0,
    });

    const handlePointerDown = (e: React.PointerEvent, board: Board, type: 'drag' | 'resize') => {
        e.preventDefault();
        e.stopPropagation();
        setInteraction({
            type,
            boardId: board.id,
            initialX: board.x,
            initialY: board.y,
            initialW: board.w,
            initialH: board.h,
            initialMouseX: e.clientX,
            initialMouseY: e.clientY,
        });
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!interaction.type || !interaction.boardId) return;

        const { type, boardId, initialX, initialY, initialW, initialH, initialMouseX, initialMouseY } = interaction;
        
        const dx = e.clientX - initialMouseX;
        const dy = e.clientY - initialMouseY;
        
        const currentBoard = activeProject.boards.find(b => b.id === boardId);
        if (!currentBoard) return;

        if (type === 'drag') {
            const newX = initialX + dx / (GRID_COL_WIDTH + GRID_GAP);
            const newY = initialY + dy / (GRID_ROW_HEIGHT + GRID_GAP);
            
            const roundedX = Math.round(newX);
            const roundedY = Math.round(newY);

            if (currentBoard.x !== roundedX || currentBoard.y !== roundedY) {
                updateBoard(boardId, { x: Math.max(0, roundedX), y: Math.max(0, roundedY) });
            }
        } else if (type === 'resize') {
            const newW = initialW + dx / (GRID_COL_WIDTH + GRID_GAP);
            const newH = initialH + dy / (GRID_ROW_HEIGHT + GRID_GAP);

            const roundedW = Math.round(newW);
            const roundedH = Math.round(newH);

            const clampedW = Math.max(1, Math.min(roundedW, MAX_BOARD_WIDTH));
            const clampedH = Math.max(1, Math.min(roundedH, MAX_BOARD_HEIGHT));

            if (currentBoard.w !== clampedW || currentBoard.h !== clampedH) {
                updateBoard(boardId, { w: clampedW, h: clampedH });
            }
        }
    };
    
    const handlePointerUp = () => {
        if (interaction.type) {
            setInteraction({ type: null, boardId: null, initialX: 0, initialY: 0, initialW: 0, initialH: 0, initialMouseX: 0, initialMouseY: 0 });
        }
    };

    const canvasHeight = useMemo(() => {
        if (!activeProject.boards.length) return 300;
        const maxY = Math.max(...activeProject.boards.map(b => b.y + b.h));
        return maxY * (GRID_ROW_HEIGHT + GRID_GAP);
    }, [activeProject.boards]);

    return (
        <div 
            className="flex-1 flex flex-col min-h-0"
            onPointerMove={interaction.type ? handlePointerMove : undefined}
            onPointerUp={interaction.type ? handlePointerUp : undefined}
            onPointerLeave={interaction.type ? handlePointerUp : undefined}
        >
            <ProjectHeader 
                activeProject={props.activeProject}
                updateProject={props.updateProject}
            />
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 pt-24">
                <ProjectSettingsView
                    settings={props.activeProject.settings}
                    handleSettingsChange={props.handleSettingsChange}
                    setStyleModalOpen={props.setStyleModalOpen}
                />
              
                <div className="relative" style={{ height: `${canvasHeight}px` }}>
                    {props.activeProject.boards.map(board => {
                        const style: React.CSSProperties = {
                            position: 'absolute',
                            left: board.x * (GRID_COL_WIDTH + GRID_GAP),
                            top: board.y * (GRID_ROW_HEIGHT + GRID_GAP),
                            width: board.w * GRID_COL_WIDTH + (board.w - 1) * GRID_GAP,
                            height: board.h * GRID_ROW_HEIGHT + (board.h - 1) * GRID_GAP,
                            transition: interaction.boardId === board.id ? 'none' : 'left 0.2s ease, top 0.2s ease, width 0.2s ease, height 0.2s ease',
                            zIndex: interaction.boardId === board.id ? 10 : 1,
                        };
                        return (
                            <div key={board.id} style={style}>
                                <BoardComponent
                                    board={board}
                                    gear={props.gear}
                                    settings={props.activeProject.settings}
                                    removeBoard={props.removeBoard}
                                    updateBoard={props.updateBoard}
                                    setGearModalOpen={props.setGearModalOpen}
                                    addNoteToBoard={props.addNoteToBoard}
                                    triggerImageUpload={props.triggerImageUpload}
                                    removeNoteFromBoard={props.removeNoteFromBoard}
                                    handleNoteUpdate={props.handleNoteUpdate}
                                    onFullscreenClick={props.setFullscreenBoardId}
                                    imageGenerationState={props.imageGenerationState[board.id] || { prompt: '', isLoading: false, error: null }}
                                    setImageGenerationStateForBoard={(state) => props.setImageGenerationState(prev => ({ ...prev, [board.id]: state }))}
                                    handleGenerateImageForStoryboard={() => props.handleGenerateImageForStoryboard(board.id)}
                                    onDragHandlePointerDown={(e) => handlePointerDown(e, board, 'drag')}
                                    onResizeHandlePointerDown={(e) => handlePointerDown(e, board, 'resize')}
                                />
                            </div>
                        )
                    })}
                </div>

                <AddBoardButton addBoard={props.addBoard} />

                <div className="text-center my-8">
                    <button 
                        onClick={props.handleGenerate} 
                        disabled={props.isLoading}
                        className="bg-brand-primary text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-brand-secondary transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                    >
                        {props.isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </>
                        ) : (
                            <>
                                <SparklesIcon className="w-5 h-5 mr-2" />
                                Generate Script & Cinematography
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}