import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
// FIX: Import `TemplateBoard` type to resolve "Cannot find name 'TemplateBoard'" error.
import type { Project, Gear, Note, TextNote, ImageNote, Board, ProjectSettings, User, ProjectTemplate, TemplateBoard, Notification } from './types';
import { generateScript, generateVisualStyle, generateCinematography, generateImageFromText, generateScriptBreakdown, generateCallSheet, GenerationContext } from './services/geminiService';
import { initializePlugins } from './plugins';
import type { BoardPlugin } from './pluginSystem/pluginTypes';

import { ProjectWorkspace } from './components/ProjectWorkspace';
import { NoProjectSelected } from './components/NoProjectSelected';
import { GearManagerModal } from './components/modals/GearManagerModal';
import { StyleEditorModal } from './components/modals/StyleEditorModal';
import { FullscreenBoardModal } from './components/modals/FullscreenBoardModal';
import { HelpdeskModal } from './components/modals/HelpdeskModal';
import { ProjectTemplateModal } from './components/modals/ProjectTemplateModal';
import { AddBoardModal } from './components/modals/AddBoardModal';
import { NotificationModal } from './components/modals/NotificationModal';
import StaggeredMenu from './components/StaggeredMenu';
import { FloatingChatWidget } from './components/FloatingChatWidget';

// Initialize all plugins when the app loads
initializePlugins();

// --- MOCK DATA ---
const ALL_USERS: User[] = [
  { id: 'user1', name: 'Alex', avatarUrl: 'https://i.pravatar.cc/150?u=user1', color: '#6D597A' },
  { id: 'user2', name: 'Maria', avatarUrl: 'https://i.pravatar.cc/150?u=user2', color: '#A491D3' },
  { id: 'user3', name: 'Chen', avatarUrl: 'https://i.pravatar.cc/150?u=user3', color: '#8FA6CB' },
];

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
      ], x: 0, y: 0, w: 1, h: 2, focusedUserId: 'user2' },
    ],
    settings: defaultSettings,
    activeUserIds: ['user1', 'user2'],
  },
];

export type Theme = 'light' | 'dark';

export function App() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(initialProjects[0]?.id || null);
  const [gear, setGear] = useState<Gear>(initialGear);
  const [isGearModalOpen, setGearModalOpen] = useState(false);
  const [isStyleModalOpen, setStyleModalOpen] = useState(false);
  const [isHelpdeskModalOpen, setHelpdeskModalOpen] = useState(false);
  const [isTemplateModalOpen, setTemplateModalOpen] = useState(false);
  const [isAddBoardModalOpen, setAddBoardModalOpen] = useState(false);
  const [isNotificationModalOpen, setNotificationModalOpen] = useState(false);
  const [isChatWidgetVisible, setChatWidgetVisible] = useState(false);
  const [fullscreenBoardId, setFullscreenBoardId] = useState<string | null>(null);
  
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme as Theme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  // Per-board loading states
  const [generatingBoardIds, setGeneratingBoardIds] = useState<Set<string>>(new Set());
  const [isBreakdownLoading, setIsBreakdownLoading] = useState(false);
  const [isCallSheetLoading, setIsCallSheetLoading] = useState(false);
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadNotificationCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeBoardForUpload, setActiveBoardForUpload] = useState<string | null>(null);
  const [imageGenerationState, setImageGenerationState] = useState<Record<string, { prompt: string; isLoading: boolean; error: string | null }>>({});

  const [currentUser] = useState<User>(ALL_USERS[0]);

  const activeProject = useMemo(() => projects.find(p => p.id === activeProjectId), [projects, activeProjectId]);
  
  const fullscreenBoard = useMemo(() => {
    return activeProject?.boards.find(b => b.id === fullscreenBoardId);
  }, [activeProject, fullscreenBoardId]);
  
  const addNotification = useCallback((message: string) => {
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      message,
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
    // Optionally add a toast message here in the future
  }, []);
  
  const markNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({...n, read: true})));
  }, []);

  const createProjectFromTemplate = (template: ProjectTemplate) => {
    const now = Date.now();
    const newBoards: Board[] = template.boards.map((templateBoard: TemplateBoard, index: number) => {
        return {
            ...templateBoard,
            id: `board-${now}-${index}`,
            notes: templateBoard.notes || ((templateBoard.type === 'IDEABOARD' || templateBoard.type === 'MOODBOARD' || templateBoard.type === 'STORYBOARD') ? [] : undefined),
            content: templateBoard.content ?? '',
            focusedUserId: null,
        };
    });

    const newProject: Project = {
      id: `proj-${now}`,
      name: template.name === 'Blank Project' ? 'Untitled Project' : `My ${template.name}`,
      boards: newBoards,
      settings: {...defaultSettings, style: ''},
      activeUserIds: [currentUser.id],
    };

    setProjects(prev => [...prev, newProject]);
    setActiveProjectId(newProject.id);
    setTemplateModalOpen(false);
  };
  
  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects(prevProjects => prevProjects.map(p => (p.id === id ? {...p, ...updates} : p)));
  }, []);

  const updateBoard = useCallback((boardId: string, updates: Partial<Board>) => {
    setProjects(prevProjects => {
      const activeId = activeProjectId; // Capture activeId for use inside map
      if (!activeId) return prevProjects;
      
      return prevProjects.map(p => {
        if (p.id === activeId) {
          const updatedBoards = p.boards.map(b => b.id === boardId ? { ...b, ...updates } : b);
          return { ...p, boards: updatedBoards as Board[] };
        }
        return p;
      });
    });
  }, [activeProjectId]);

  const handleBoardFocus = useCallback((boardId: string | null) => {
    const activeId = activeProjectId;
    if (!activeId) return;

    setProjects(prevProjects => {
      return prevProjects.map(p => {
        if (p.id === activeId) {
          const updatedBoards = p.boards.map(b => {
            if (b.id === boardId) {
              return { ...b, focusedUserId: currentUser.id };
            }
            // Remove focus from any board this user was previously on
            if (b.focusedUserId === currentUser.id) {
              return { ...b, focusedUserId: null };
            }
            return b;
          });
          return { ...p, boards: updatedBoards as Board[] };
        }
        return p;
      });
    });
  }, [activeProjectId, currentUser.id]);

  const getGenerationContext = useCallback((): GenerationContext | null => {
    if (!activeProject) return null;

    const allNotes: Note[] = activeProject.boards.reduce((acc, board) => {
        if (board.type === 'IDEABOARD' || board.type === 'MOODBOARD' || board.type === 'STORYBOARD') {
            return [...acc, ...(board.notes || [])];
        }
        return acc;
    }, [] as Note[]);

    return {
      notes: allNotes,
      settings: activeProject.settings,
      gear,
      boards: activeProject.boards,
    };
  }, [activeProject, gear]);
  
  const handleGenerateForBoard = async (boardId: string, generator: (context: GenerationContext) => Promise<string>) => {
    const context = getGenerationContext();
    if (!context) return;
    
    setGeneratingBoardIds(prev => new Set(prev).add(boardId));

    if (context.notes.length === 0 && !context.boards.some(b => b.type === 'DOCUMENT_SCRIPT' && b.content)) {
        addNotification("For better AI results, try adding some ideas to an Ideaboard or writing a bit of your script first.");
    }
    
    try {
        const content = await generator(context);
        updateBoard(boardId, { content });
    } catch (error) {
        console.error(`Generation failed for board ${boardId}`, error);
        addNotification(`AI generation failed. Please check your connection and try again.`);
    } finally {
        setGeneratingBoardIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(boardId);
            return newSet;
        });
    }
  };
  
  const handleGenerateBreakdown = async (scriptContent: string) => {
    if (!activeProject || !scriptContent.trim()) return;
    setIsBreakdownLoading(true);

    try {
        const breakdownJson = await generateScriptBreakdown(scriptContent);
        
        setProjects(prev => prev.map(p => {
          if (p.id === activeProjectId) {
            let boards = [...p.boards];
            const existingBreakdownBoard = boards.find(b => b.type === 'DOCUMENT_SCRIPT_BREAKDOWN');

            if (existingBreakdownBoard) {
                boards = boards.map(b => b.id === existingBreakdownBoard.id ? {...b, content: breakdownJson } : b);
            } else {
                const scriptBoard = boards.find(b => b.type === 'DOCUMENT_SCRIPT');
                const x = scriptBoard ? scriptBoard.x + scriptBoard.w : 0;
                const y = scriptBoard ? scriptBoard.y : 0;

                const newBoard: Board = {
                    id: `board-${Date.now()}-breakdown`,
                    type: 'DOCUMENT_SCRIPT_BREAKDOWN',
                    title: 'Script Breakdown',
                    content: breakdownJson,
                    x: Math.min(x, 1),
                    y: y,
                    w: 2,
                    h: 4,
                    focusedUserId: null
                };
                boards.push(newBoard);
            }
            return { ...p, boards: boards as Board[] };
          }
          return p;
        }));

    } catch (error) {
        console.error("Breakdown generation failed", error);
    } finally {
        setIsBreakdownLoading(false);
    }
  };
  
  const handleGenerateCallSheet = async (breakdownContent: string) => {
    if (!activeProject || !breakdownContent.trim()) return;
    setIsCallSheetLoading(true);

    try {
      const callSheetJson = await generateCallSheet(breakdownContent, activeProject.name);
      
      setProjects(prev => prev.map(p => {
        if (p.id === activeProjectId) {
          let boards = [...p.boards];
          const existingCallSheetBoard = boards.find(b => b.type === 'DOCUMENT_CALL_SHEET');

          if (existingCallSheetBoard) {
            boards = boards.map(b => b.id === existingCallSheetBoard.id ? { ...b, content: callSheetJson } : b);
          } else {
            const breakdownBoard = boards.find(b => b.type === 'DOCUMENT_SCRIPT_BREAKDOWN');
            const x = breakdownBoard ? breakdownBoard.x : 0;
            const y = breakdownBoard ? breakdownBoard.y + breakdownBoard.h : 0;

            const newBoard: Board = {
              id: `board-${Date.now()}-callsheet`,
              type: 'DOCUMENT_CALL_SHEET',
              title: 'Call Sheet',
              content: callSheetJson,
              x,
              y,
              w: 2,
              h: 4,
              focusedUserId: null,
            };
            boards.push(newBoard);
          }
          return { ...p, boards: boards as Board[] };
        }
        return p;
      }));
    } catch (error) {
      console.error("Call Sheet generation failed", error);
    } finally {
      setIsCallSheetLoading(false);
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

  const addBoard = useCallback((plugin: BoardPlugin) => {
    if (!activeProjectId) return;

    setProjects(prevProjects => {
      return prevProjects.map(p => {
        if (p.id === activeProjectId) {
          const COLS = 3;
          const grid = new Array(COLS).fill(0);

          p.boards.forEach(b => {
            for (let i = 0; i < b.w; i++) {
              const colIndex = b.x + i;
              if (colIndex < COLS) {
                grid[colIndex] = Math.max(grid[colIndex], b.y + b.h);
              }
            }
          });

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
            focusedUserId: null,
          };

          return { ...p, boards: [...p.boards, newBoard] };
        }
        return p;
      });
    });
  }, [activeProjectId]);
  
  const removeBoard = (boardId: string) => {
    if (!activeProjectId) return;
    setProjects(prev => prev.map(p => {
      if (p.id === activeProjectId) {
        return { ...p, boards: p.boards.filter(b => b.id !== boardId) };
      }
      return p;
    }));
  }

  const handleNoteUpdate = (boardId: string, noteId: string, updates: Partial<Note>) => {
    updateBoard(boardId, { 
      notes: activeProject?.boards.find(b => b.id === boardId)?.notes?.map(n => n.id === noteId ? {...n, ...updates} : n) as Note[]
    });
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
    updateBoard(boardId, { notes: updatedNotes });
  }

  const handleSettingsChange = (field: keyof Project['settings'], value: string) => {
    if (!activeProject) return;
    const newSettings = { ...activeProject.settings, [field]: value };
    updateProject(activeProject.id, { settings: newSettings });
  };
  
  const menuItems = [
    { label: 'Profile', ariaLabel: 'View your profile', link: '#' },
    { label: 'Account', ariaLabel: 'Manage your account settings', link: '#' },
    { label: 'Notifications', ariaLabel: 'View notifications', link: '#', badge: unreadNotificationCount },
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
    if (itemLabel === 'Notifications') {
      setNotificationModalOpen(true);
      markNotificationsAsRead();
    }
    // Handle other menu items if necessary
  };

  const projectItemsForMenu = useMemo(() => projects.map(p => ({
    id: p.id,
    label: p.name,
    isActive: p.id === activeProjectId,
  })), [projects, activeProjectId]);

  return (
    <>
      <StaggeredMenu
        isFixed={true}
        position="right"
        items={menuItems.map(item => ({...item, link: 'javascript:void(0)'}))}
        onItemClick={(item) => handleMenuClick(item.label)}
        socialItems={socialItems}
        logoUrl="/film.png"
        menuButtonColor="#212529"
        openMenuButtonColor="#212529"
        accentColor="#6D597A"
        colors={['#DEE2E6', '#6D597A']}
        projectItems={projectItemsForMenu}
        onProjectItemClick={(item) => setActiveProjectId(item.id)}
        onNewProjectClick={() => setTemplateModalOpen(true)}
        onGearClick={() => setGearModalOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <div className="flex h-screen font-sans bg-brand-bg text-brand-text">
        {isGearModalOpen && <GearManagerModal gear={gear} onClose={() => setGearModalOpen(false)} onSave={(newGear) => {setGear(newGear); setGearModalOpen(false)}} />}
        {activeProject && isStyleModalOpen && <StyleEditorModal currentStyle={activeProject.settings.style} onClose={() => setStyleModalOpen(false)} onSave={(newStyle) => { handleSettingsChange('style', newStyle); setStyleModalOpen(false); }} />}
        {isHelpdeskModalOpen && <HelpdeskModal onClose={() => setHelpdeskModalOpen(false)} onOpenChatWidget={() => setChatWidgetVisible(true)} />}
        {isTemplateModalOpen && <ProjectTemplateModal onClose={() => setTemplateModalOpen(false)} onSelectTemplate={createProjectFromTemplate} />}
        {isNotificationModalOpen && <NotificationModal notifications={notifications} onClose={() => setNotificationModalOpen(false)} />}
        {activeProject && isAddBoardModalOpen && (
            <AddBoardModal 
              onClose={() => setAddBoardModalOpen(false)} 
              onAddBoard={addBoard}
              boards={activeProject.boards}
            />
        )}
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

        <main className="flex-1 flex flex-col pt-24">
          {activeProject ? (
            <ProjectWorkspace
              key={activeProject.id} // Add key to force re-mount on project change
              projects={projects}
              activeProject={activeProject}
              setActiveProjectId={setActiveProjectId}
              setFullscreenBoardId={setFullscreenBoardId}
              updateProject={updateProject}
              gear={gear}
              setGearModalOpen={setGearModalOpen}
              setStyleModalOpen={setStyleModalOpen}
              setAddBoardModalOpen={setAddBoardModalOpen}
              handleSettingsChange={handleSettingsChange}
              updateBoard={updateBoard}
              removeBoard={removeBoard}
              addBoard={addBoard}
              generatingBoardIds={generatingBoardIds}
              handleGenerateForBoard={handleGenerateForBoard}
              isBreakdownLoading={isBreakdownLoading}
              handleGenerateBreakdown={handleGenerateBreakdown}
              isCallSheetLoading={isCallSheetLoading}
              handleGenerateCallSheet={handleGenerateCallSheet}
              imageGenerationState={imageGenerationState}
              setImageGenerationState={setImageGenerationState}
              handleGenerateImageForStoryboard={handleGenerateImageForStoryboard}
              addNoteToBoard={addNoteToBoard}
              removeNoteFromBoard={removeNoteFromBoard}
              handleNoteUpdate={handleNoteUpdate}
              triggerImageUpload={triggerImageUpload}
              allUsers={ALL_USERS}
              currentUser={currentUser}
              handleBoardFocus={handleBoardFocus}
            />
          ) : (
            <NoProjectSelected createNewProject={() => setTemplateModalOpen(true)} />
          )}
        </main>
      </div>
      <FloatingChatWidget 
        isVisible={isChatWidgetVisible}
        onClose={() => setChatWidgetVisible(false)}
        notifications={notifications}
      />
    </>
  );
}