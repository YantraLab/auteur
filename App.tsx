import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import type { Project, Gear, Note, TextNote, ImageNote, Board, ProjectSettings } from './types';
import { generateScriptAndRecommendations, generateImageFromText } from './services/geminiService';
import { initializePlugins } from './plugins';
import type { BoardPlugin } from './pluginSystem/pluginTypes';

import { Sidebar } from './components/Sidebar';
import { ProjectWorkspace } from './components/ProjectWorkspace';
import { NoProjectSelected } from './components/NoProjectSelected';
import { GearManagerModal } from './components/modals/GearManagerModal';
import { StyleEditorModal } from './components/modals/StyleEditorModal';
import { FullscreenBoardModal } from './components/modals/FullscreenBoardModal';
import { HelpdeskModal } from './components/modals/HelpdeskModal';
import StaggeredMenu from './components/StaggeredMenu';

// Initialize all plugins when the app loads
initializePlugins();

// MOCK DATA
const initialGear: Gear = {
  items: [
      { id: 'cam1', name: 'Sony A7S III', type: 'Camera' },
      { id: 'lens1', name: 'Sigma 24-70mm f/2.8', type: 'Lens' },
      { id: 'lens2', name: 'Sony 85mm f/1.8', type: 'Lens' },
  ]
};

const defaultSettings: ProjectSettings = {
  frameRate: '24fps',
  aspectRatio: '16:9',
  resolution: '4K (UHD)',
  style: 'Vsauce3 style - curious, fast-paced, visual, and entirely shootable indoors.',
  projectType: 'Short Video',
};

const initialProjects: Project[] = [
  {
    id: 'proj1',
    name: 'Can Machines Feel Pain?',
    boards: [
      { id: 'board1', type: 'IDEABOARD', title: 'Initial Ideas', notes: [
        { id: 'note1', type: 'text', content: 'Explore the concept of pain in machines.' },
        { id: 'note2', type: 'text', content: 'Visuals: macro shots of circuits, glowing filaments, server rooms.' },
        { id: 'note3', type: 'text', content: 'Narration style: calm, intense, intellectual, questioning.' },
      ], x: 0, y: 0, w: 1, h: 2 },
    ],
    settings: defaultSettings,
  },
];


export function App() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(initialProjects[0]?.id || null);
  const [gear, setGear] = useState<Gear>(initialGear);
  const [isGearModalOpen, setGearModalOpen] = useState(false);
  const [isStyleModalOpen, setStyleModalOpen] = useState(false);
  const [isHelpdeskModalOpen, setHelpdeskModalOpen] = useState(false);
  const [fullscreenBoardId, setFullscreenBoardId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeBoardForUpload, setActiveBoardForUpload] = useState<string | null>(null);
  const [imageGenerationState, setImageGenerationState] = useState<Record<string, { prompt: string; isLoading: boolean; error: string | null }>>({});

  const activeProject = useMemo(() => projects.find(p => p.id === activeProjectId), [projects, activeProjectId]);
  
  const fullscreenBoard = useMemo(() => {
    return activeProject?.boards.find(b => b.id === fullscreenBoardId);
  }, [activeProject, fullscreenBoardId]);

  const createNewProject = () => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: 'Untitled Project',
      boards: [
        { id: `board-${Date.now()}`, type: 'IDEABOARD', title: 'Ideaboard', notes: [], x: 0, y: 0, w: 1, h: 2 },
      ],
      settings: {...defaultSettings, style: ''},
    };
    setProjects(prev => [...prev, newProject]);
    setActiveProjectId(newProject.id);
  };
  
  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(projects.map(p => (p.id === id ? {...p, ...updates} : p)));
  };

  const updateBoard = (boardId: string, updates: Partial<Board>) => {
      if (!activeProject) return;
      const updatedBoards = activeProject.boards.map(b => b.id === boardId ? {...b, ...updates} : b);
      updateProject(activeProject.id, { boards: updatedBoards as Board[] });
  }

  const handleGenerate = async () => {
    if (!activeProject) return;
    setIsLoading(true);

    const allNotes: Note[] = activeProject.boards.reduce((acc, board) => {
        if (board.type === 'IDEABOARD' || board.type === 'MOODBOARD' || board.type === 'STORYBOARD') {
            return [...acc, ...(board.notes || [])];
        }
        return acc;
    }, [] as Note[]);

    try {
      const content = await generateScriptAndRecommendations(allNotes, activeProject.settings.style, gear, activeProject.settings);
      
      const sections = content.split('---').map(s => s.trim()).filter(Boolean);
      const scriptContent = sections.find(s => s.includes("# 🎬 SCRIPT"));
      const styleContent = sections.find(s => s.includes("# 🎨 VISUAL STYLE"));
      const cineContent = sections.find(s => s.includes("# 🎥 CINEMATOGRAPHY & GEAR"));

      let boards = [...activeProject.boards];

      const updateOrAddGeneratedBoard = (title: string, content: string | undefined) => {
        if (!content) return;
        const existingBoard = boards.find(b => b.title === title && b.type === 'GENERATED_CONTENT');
        if (existingBoard) {
            boards = boards.map(b => b.id === existingBoard.id ? {...b, content} : b);
        } else {
            const newBoard: Board = { id: `board-${Date.now()}-${title}`, type: 'GENERATED_CONTENT', title, content, x: 0, y: 999, w: 1, h: 3 };
            boards.push(newBoard);
        }
      }

      updateOrAddGeneratedBoard('Script', scriptContent);
      updateOrAddGeneratedBoard('Visual Style', styleContent);
      updateOrAddGeneratedBoard('Cinematography & Gear', cineContent);

      updateProject(activeProject.id, { boards });

    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGenerateImageForStoryboard = async (boardId: string) => {
    const boardState = imageGenerationState[boardId];
    if (!boardState || !boardState.prompt.trim() || !activeProject) return;

    setImageGenerationState(prev => ({ ...prev, [boardId]: { ...prev[boardId], isLoading: true, error: null } }));

    try {
        const imageUrl = await generateImageFromText(boardState.prompt);
        const newNote: ImageNote = { id: `note-${Date.now()}`, type: 'image', imageUrl, caption: boardState.prompt };

        const board = activeProject.boards.find(b => b.id === boardId);
        if (board && (board.type === 'MOODBOARD' || board.type === 'STORYBOARD')) {
            updateBoard(board.id, { notes: [...(board.notes || []), newNote] });
        }
        setImageGenerationState(prev => ({ ...prev, [boardId]: { ...prev[boardId], isLoading: false, prompt: '' } }));

    } catch (error: any) {
        console.error("Image generation failed", error);
        setImageGenerationState(prev => ({ ...prev, [boardId]: { ...prev[boardId], isLoading: false, error: error.message || 'Failed to generate image.' } }));
    }
  };

  const addBoard = (plugin: BoardPlugin) => {
    if (!activeProject) return;

    const COLS = 3;
    const grid = new Array(COLS).fill(0); // Stores the next available y for each column

    activeProject.boards.forEach(b => {
      for (let i = 0; i < b.w; i++) {
        const colIndex = b.x + i;
        if (colIndex < COLS) {
          grid[colIndex] = Math.max(grid[colIndex], b.y + b.h);
        }
      }
    });

    // Find the column with the minimum height
    let bestCol = 0;
    let minY = Infinity;
    for (let i = 0; i < COLS; i++) {
        if (grid[i] < minY) {
            minY = grid[i];
            bestCol = i;
        }
    }

    const newBoard: Board = {
      id: `board-${Date.now()}`,
      type: plugin.type,
      title: plugin.title,
      notes: (plugin.type === 'IDEABOARD' || plugin.type === 'MOODBOARD' || plugin.type === 'STORYBOARD') ? [] : undefined,
      content: (plugin.type.startsWith('DOCUMENT_') || plugin.type.startsWith('PLUGIN_')) ? '' : undefined,
      documentType: plugin.type.startsWith('DOCUMENT_') ? plugin.type.replace('DOCUMENT_', '') : undefined,
      x: bestCol,
      y: minY,
      w: 1,
      h: 2,
    };

    updateProject(activeProject.id, { boards: [...activeProject.boards, newBoard] });
  };
  
  const removeBoard = (boardId: string) => {
    if (!activeProject) return;
    updateProject(activeProject.id, { boards: activeProject.boards.filter(b => b.id !== boardId) });
  }

  const handleNoteUpdate = (boardId: string, noteId: string, updates: Partial<Note>) => {
    const board = activeProject?.boards.find(b => b.id === boardId);
    if (!board || !board.notes) return;

    const updatedNotes = board.notes.map(n => n.id === noteId ? {...n, ...updates} : n);
    // Fix: Cast updatedNotes to Note[] to resolve TypeScript error.
    // The spread operator with a discriminated union and a partial type creates a type that TypeScript
    // can't correctly infer as the original union type, even though the usage is safe in this context.
    updateBoard(boardId, { notes: updatedNotes as Note[] });
  }

  const addNoteToBoard = (boardId: string) => {
      const board = activeProject?.boards.find(b => b.id === boardId);
      if (!board || board.type !== 'IDEABOARD') return;
      const newNote: TextNote = {id: `note-${Date.now()}`, type: 'text', content: ''};
      updateBoard(boardId, { notes: [...(board.notes || []), newNote] });
  }
  
  const triggerImageUpload = (boardId: string) => {
    setActiveBoardForUpload(boardId);
    fileInputRef.current?.click();
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const board = activeProject?.boards.find(b => b.id === activeBoardForUpload);

    if (file && board && (board.type === 'MOODBOARD' || board.type === 'STORYBOARD')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const newNote: ImageNote = { id: `note-${Date.now()}`, type: 'image', imageUrl, caption: '' };
        updateBoard(board.id, { notes: [...(board.notes || []), newNote] });
      };
      reader.readAsDataURL(file);
    }
    if(event.target) event.target.value = '';
    setActiveBoardForUpload(null);
  };

  const removeNoteFromBoard = (boardId: string, noteId: string) => {
    const board = activeProject?.boards.find(b => b.id === boardId);
    if (!board || !board.notes) return;
    const updatedNotes = board.notes.filter(n => n.id !== noteId);
    updateBoard(board.id, { notes: updatedNotes });
  }

  const handleSettingsChange = (field: keyof Project['settings'], value: string) => {
    if (!activeProject) return;
    const newSettings = { ...activeProject.settings, [field]: value };
    updateProject(activeProject.id, { settings: newSettings });
  };
  
  const menuItems = [
    { label: 'Profile', ariaLabel: 'View your profile', link: '#' },
    { label: 'Account', ariaLabel: 'Manage your account settings', link: '#' },
    { label: 'Subscription', ariaLabel: 'Manage your subscription', link: '#' },
    { label: 'Helpdesk', ariaLabel: 'Get help and support', link: '#' },
    { label: 'Logout', ariaLabel: 'Log out of your account', link: '#' },
  ];

  const socialItems = [
    { label: 'Contact', link: '#' },
    { label: 'GitHub', link: 'https://github.com/priyankt3i' },
  ];
  
  const handleMenuClick = (itemLabel: string) => {
    if (itemLabel === 'Helpdesk') {
      setHelpdeskModalOpen(true);
    }
    // Handle other menu items if necessary
  };


  return (
    <>
      <StaggeredMenu
        isFixed={true}
        position="right"
        items={menuItems.map(item => ({...item, link: 'javascript:void(0)'}))}
        onItemClick={(item) => handleMenuClick(item.label)}
        socialItems={socialItems}
        logoUrl="/auteur-logo.svg"
        menuButtonColor="#212529"
        openMenuButtonColor="#212529"
        accentColor="#6D597A"
        colors={['#DEE2E6', '#6D597A']}
      />
      <div className="flex h-screen font-sans bg-brand-bg text-brand-text">
        {isGearModalOpen && <GearManagerModal gear={gear} onClose={() => setGearModalOpen(false)} onSave={(newGear) => {setGear(newGear); setGearModalOpen(false)}} />}
        {activeProject && isStyleModalOpen && <StyleEditorModal currentStyle={activeProject.settings.style} onClose={() => setStyleModalOpen(false)} onSave={(newStyle) => { handleSettingsChange('style', newStyle); setStyleModalOpen(false); }} />}
        {isHelpdeskModalOpen && <HelpdeskModal onClose={() => setHelpdeskModalOpen(false)} />}
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
        
        {fullscreenBoard && activeProject && (
          <FullscreenBoardModal
            board={fullscreenBoard}
            gear={gear}
            settings={activeProject.settings}
            onClose={() => setFullscreenBoardId(null)}
            updateBoard={updateBoard}
            setGearModalOpen={setGearModalOpen}
            addNoteToBoard={addNoteToBoard}
            triggerImageUpload={triggerImageUpload}
            removeNoteFromBoard={removeNoteFromBoard}
            handleNoteUpdate={handleNoteUpdate}
            imageGenerationState={imageGenerationState[fullscreenBoard.id] || { prompt: '', isLoading: false, error: null }}
            setImageGenerationStateForBoard={(state) => setImageGenerationState(prev => ({ ...prev, [fullscreenBoard.id]: state }))}
            handleGenerateImageForStoryboard={() => handleGenerateImageForStoryboard(fullscreenBoard.id)}
          />
        )}

        <Sidebar 
          projects={projects}
          activeProjectId={activeProjectId}
          setActiveProjectId={setActiveProjectId}
          createNewProject={createNewProject}
          setGearModalOpen={setGearModalOpen}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          {activeProject ? (
            <ProjectWorkspace
              key={activeProject.id} // Add key to force re-mount on project change
              activeProject={activeProject}
              updateProject={updateProject}
              gear={gear}
              setGearModalOpen={setGearModalOpen}
              setStyleModalOpen={setStyleModalOpen}
              setFullscreenBoardId={setFullscreenBoardId}
              handleSettingsChange={handleSettingsChange}
              updateBoard={updateBoard}
              removeBoard={removeBoard}
              addBoard={addBoard}
              handleGenerate={handleGenerate}
              isLoading={isLoading}
              imageGenerationState={imageGenerationState}
              setImageGenerationState={setImageGenerationState}
              handleGenerateImageForStoryboard={handleGenerateImageForStoryboard}
              addNoteToBoard={addNoteToBoard}
              removeNoteFromBoard={removeNoteFromBoard}
              handleNoteUpdate={handleNoteUpdate}
              triggerImageUpload={triggerImageUpload}
            />
          ) : (
            <NoProjectSelected />
          )}
        </main>
      </div>
    </>
  );
}