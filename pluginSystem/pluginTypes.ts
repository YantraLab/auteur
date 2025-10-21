import type { Board, Gear, Note, ProjectSettings } from '../types';

// Props that will be passed to every board view component from the main app
export interface BoardComponentProps {
    board: Board;
    gear: Gear;
    settings: ProjectSettings;
    updateBoard: (boardId: string, updates: Partial<Board>) => void;
    setGearModalOpen: (isOpen: boolean) => void;
    removeNoteFromBoard: (boardId: string, noteId: string) => void;
    handleNoteUpdate: (boardId: string, noteId: string, updates: Partial<Note>) => void;
    
    // Props for note-based boards
    addNoteToBoard?: (boardId: string) => void;
    triggerImageUpload?: (boardId: string) => void;
    
    // Props for image generation boards
    imageGenerationState?: { prompt: string; isLoading: boolean; error: string | null };
    setImageGenerationStateForBoard?: (state: { prompt:string; isLoading: boolean; error: string | null }) => void;
    handleGenerateImageForStoryboard?: () => void;
}

// Defines the structure every board plugin must adhere to
export interface BoardPlugin {
  // A unique string identifier for this board type (e.g., 'CORE_IDEABOARD')
  type: string;
  
  // The user-facing name for the board in the 'Add Board' menu
  title: string;
  
  // A description for the 'Add Board' menu
  description: string;
  
  // The icon component to display in the menu
  icon: React.ComponentType<{ className?: string }>;
  
  // The main component used to render the board's content in the workspace
  boardComponent: React.ComponentType<BoardComponentProps>;
  
  // (Optional) A different component to use when the board is in fullscreen mode
  fullscreenComponent?: React.ComponentType<BoardComponentProps>;
  
  // (Optional) A component to render in the board's footer (e.g., for AI generation inputs)
  footerComponent?: React.ComponentType<BoardComponentProps>;
  
  // (Optional) A component for adding custom action buttons to the board's header
  headerActionsComponent?: React.ComponentType<{ board: Board; addNoteToBoard: (id: string) => void; triggerImageUpload: (id: string) => void; }>;
}
