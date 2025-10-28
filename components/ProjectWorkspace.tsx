import React, { useState, useEffect } from 'react';
import type { Project, Board, Note, Gear, User } from '../types';
import type { BoardPlugin } from '../pluginSystem/pluginTypes';
import { ProjectHeader } from './ProjectHeader';
import { ProjectSettingsView } from './ProjectSettingsView';
import { Board as BoardComponent } from './Board';
import { AddBoardButton } from './AddBoardButton';
import { PlusIcon } from './icons';
import { generateScript, generateVisualStyle, generateCinematography, GenerationContext } from '../services/geminiService';

interface ProjectWorkspaceProps {
    projects: Project[];
    activeProject: Project;
    setActiveProjectId: (id: string) => void;
    setFullscreenBoardId: (id: string | null) => void;
    updateProject: (id: string, updates: Partial<Project>) => void;
    gear: Gear;
    setGearModalOpen: (isOpen: boolean) => void;
    setStyleModalOpen: (isOpen: boolean) => void;
    setAddBoardModalOpen: (isOpen: boolean) => void;
    handleSettingsChange: (field: keyof Project['settings'], value: string) => void;
    updateBoard: (boardId: string, updates: Partial<Board>) => void;
    removeBoard: (boardId: string) => void;
    addBoard: (plugin: BoardPlugin) => void;
    
    generatingBoardIds: Set<string>;
    handleGenerateForBoard: (boardId: string, generator: (context: GenerationContext) => Promise<string>) => void;

    isBreakdownLoading: boolean;
    handleGenerateBreakdown: (scriptContent: string) => Promise<void>;
    isCallSheetLoading: boolean;
    handleGenerateCallSheet: (breakdownContent: string) => Promise<void>;
    
    imageGenerationState: Record<string, { prompt: string; isLoading: boolean; error: string | null }>;
    setImageGenerationState: React.Dispatch<React.SetStateAction<Record<string, { prompt: string; isLoading: boolean; error: string | null }>>>;
    handleGenerateImageForStoryboard: (boardId: string) => void;
    
    addNoteToBoard: (boardId: string) => void;
    removeNoteFromBoard: (boardId: string, noteId: string) => void;
    handleNoteUpdate: (boardId: string, noteId: string, updates: Partial<Note>) => void;
    triggerImageUpload: (boardId: string) => void;
    
    allUsers: User[];
    currentUser: User;
    handleBoardFocus: (boardId: string | null) => void;
}

// Grid constants
const GRID_COL_WIDTH = 380;
const GRID_ROW_HEIGHT = 120;
const GRID_GAP = 24;
const MAX_BOARD_WIDTH = 3;
const MAX_BOARD_HEIGHT = 10;

// FIX: Explicitly typing the component with React.FC makes TypeScript correctly handle the special 'key' prop.
export const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = (props) => {
    const { activeProject, updateBoard, allUsers, currentUser, handleBoardFocus } = props;
    
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isSettingsCollapsed, setIsSettingsCollapsed] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
        handleBoardFocus(board.id);
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

    const canvasHeight = React.useMemo(() => {
        if (!activeProject.boards.length) return 300;
        const maxY = Math.max(...activeProject.boards.map(b => b.y + b.h));
        return maxY * (GRID_ROW_HEIGHT + GRID_GAP);
    }, [activeProject.boards]);

    return (
        <div 
            className="flex-1 flex flex-col min-h-0"
            onPointerMove={!isMobile && interaction.type ? handlePointerMove : undefined}
            onPointerUp={!isMobile && interaction.type ? handlePointerUp : undefined}
            onPointerLeave={!isMobile && interaction.type ? handlePointerUp : undefined}
            onClick={() => handleBoardFocus(null)}
        >
            <ProjectHeader 
                projects={props.projects}
                activeProject={props.activeProject}
                updateProject={props.updateProject}
                setActiveProjectId={props.setActiveProjectId}
                setFullscreenBoardId={props.setFullscreenBoardId}
                allUsers={allUsers}
                currentUser={currentUser}
            />
            
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-28 md:pb-6">
                <ProjectSettingsView
                    settings={props.activeProject.settings}
                    handleSettingsChange={props.handleSettingsChange}
                    setStyleModalOpen={props.setStyleModalOpen}
                    isCollapsed={isSettingsCollapsed}
                    onToggleCollapse={() => setIsSettingsCollapsed(prev => !prev)}
                />
              
                <div className={isMobile ? "" : "relative"} style={{ height: isMobile ? 'auto' : `${canvasHeight}px` }}>
                    {props.activeProject.boards.map(board => {
                        const style: React.CSSProperties = isMobile ? {} : {
                            position: 'absolute',
                            left: board.x * (GRID_COL_WIDTH + GRID_GAP),
                            top: board.y * (GRID_ROW_HEIGHT + GRID_GAP),
                            width: board.w * GRID_COL_WIDTH + (board.w - 1) * GRID_GAP,
                            height: board.h * GRID_ROW_HEIGHT + (board.h - 1) * GRID_GAP,
                            transition: interaction.boardId === board.id ? 'none' : 'left 0.2s ease, top 0.2s ease, width 0.2s ease, height 0.2s ease',
                            zIndex: interaction.boardId === board.id ? 10 : 1,
                        };
                        return (
                            <div key={board.id} className={isMobile ? "mb-6" : ""} style={style} onClick={(e) => { e.stopPropagation(); handleBoardFocus(board.id); }}>
                                <BoardComponent
                                    isMobile={isMobile}
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
                                    
                                    isGenerating={props.generatingBoardIds.has(board.id)}
                                    onGenerateScript={() => props.handleGenerateForBoard(board.id, generateScript)}
                                    onGenerateVisualStyle={() => props.handleGenerateForBoard(board.id, generateVisualStyle)}
                                    onGenerateCinematography={() => props.handleGenerateForBoard(board.id, generateCinematography)}
                                    
                                    handleGenerateBreakdown={props.handleGenerateBreakdown}
                                    isBreakdownLoading={props.isBreakdownLoading}
                                    handleGenerateCallSheet={props.handleGenerateCallSheet}
                                    isCallSheetLoading={props.isCallSheetLoading}
                                    allUsers={allUsers}
                                    currentUser={currentUser}
                                />
                            </div>
                        )
                    })}
                </div>

                {!isMobile && (
                    <AddBoardButton addBoard={props.addBoard} boards={props.activeProject.boards} />
                )}
            </div>
            
            {isMobile && (
                 <div className="fixed bottom-0 left-0 right-0 bg-brand-surface/80 backdrop-blur-sm border-t border-brand-muted p-3 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex items-stretch justify-center gap-3 z-30">
                    <button 
                        onClick={() => props.setAddBoardModalOpen(true)}
                        className="w-full h-full bg-brand-surface border border-brand-muted text-brand-text font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 hover:bg-brand-muted text-sm"
                    >
                        <PlusIcon className="w-5 h-5"/> Add Board
                    </button>
                </div>
            )}
        </div>
    );
}