import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Project } from '../types';
import { MagnifyingGlassIcon, FolderIcon, RectangleStackIcon, DocumentTextIcon } from './icons';

interface GlobalSearchProps {
    projects: Project[];
    setActiveProjectId: (id: string) => void;
    setFullscreenBoardId: (id: string | null) => void;
}

type SearchResult = {
    type: 'project' | 'board' | 'note';
    id: string;
    title: string;
    context: string; // e.g., Project name for a board, or "Board > Project" for a note
    projectId: string;
    boardId?: string;
};

export const GlobalSearch = ({ projects, setActiveProjectId, setFullscreenBoardId }: GlobalSearchProps) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const performSearch = useCallback((currentQuery: string) => {
        if (!currentQuery.trim()) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        const newResults: SearchResult[] = [];
        const lowerCaseQuery = currentQuery.toLowerCase();

        projects.forEach(project => {
            if (project.name.toLowerCase().includes(lowerCaseQuery)) {
                newResults.push({
                    type: 'project',
                    id: project.id,
                    title: project.name,
                    context: 'Project',
                    projectId: project.id,
                });
            }

            project.boards.forEach(board => {
                if (board.title.toLowerCase().includes(lowerCaseQuery)) {
                    newResults.push({
                        type: 'board',
                        id: board.id,
                        title: board.title,
                        context: `in ${project.name}`,
                        projectId: project.id,
                        boardId: board.id,
                    });
                }

                if (board.notes) {
                    board.notes.forEach(note => {
                        const noteContent = note.type === 'text' ? note.content : note.caption;
                        if (noteContent && noteContent.toLowerCase().includes(lowerCaseQuery)) {
                            newResults.push({
                                type: 'note',
                                id: note.id,
                                title: noteContent.substring(0, 50) + (noteContent.length > 50 ? '...' : ''),
                                context: `in ${board.title} > ${project.name}`,
                                projectId: project.id,
                                boardId: board.id,
                            });
                        }
                    });
                }
            });
        });
        
        newResults.sort((a, b) => {
            const aStarts = a.title.toLowerCase().startsWith(lowerCaseQuery);
            const bStarts = b.title.toLowerCase().startsWith(lowerCaseQuery);
            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;
            if (a.type < b.type) return -1;
            if (a.type > b.type) return 1;
            return a.title.localeCompare(b.title);
        });

        setResults(newResults.slice(0, 10)); // Limit results
        setIsOpen(true);
    }, [projects]);
    
    useEffect(() => {
        const handler = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleResultClick = (result: SearchResult) => {
        if (result.type === 'project') {
            setActiveProjectId(result.projectId);
        } else { // board or note
            setActiveProjectId(result.projectId);
            setFullscreenBoardId(result.boardId || null);
        }
        setQuery('');
        setResults([]);
        setIsOpen(false);
    };

    const getIcon = (type: SearchResult['type']) => {
        switch(type) {
            case 'project': return <FolderIcon className="w-5 h-5 text-brand-secondary" />;
            case 'board': return <RectangleStackIcon className="w-5 h-5 text-brand-primary" />;
            case 'note': return <DocumentTextIcon className="w-5 h-5 text-brand-accent-document" />;
            default: return null;
        }
    };

    return (
        <div className="relative w-full max-w-md" ref={searchRef}>
            <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-dim" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        performSearch(e.target.value);
                    }}
                    onFocus={() => { if (query.trim()) setIsOpen(true); }}
                    placeholder="Search projects, boards, notes..."
                    className="w-full pl-10 pr-4 py-2 bg-brand-bg border border-brand-muted rounded-full focus:ring-2 focus:ring-brand-primary focus:outline-none text-sm"
                />
            </div>
            {isOpen && (
                <div className="absolute top-full mt-2 w-full bg-brand-surface rounded-lg shadow-2xl border border-brand-muted z-50 max-h-96 overflow-y-auto">
                    {results.length > 0 ? (
                        <ul>
                            {results.map(result => (
                                <li key={`${result.type}-${result.id}`}>
                                    <button
                                        onClick={() => handleResultClick(result)}
                                        className="w-full text-left flex items-center gap-3 p-3 hover:bg-brand-muted transition-colors"
                                    >
                                        <div className="flex-shrink-0">{getIcon(result.type)}</div>
                                        <div>
                                            <p className="font-semibold text-sm leading-tight text-brand-text truncate">{result.title}</p>
                                            <p className="text-xs text-brand-text-dim truncate">{result.context}</p>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                         <p className="p-4 text-sm text-brand-text-dim text-center">No results for "{query}"</p>
                    )}
                </div>
            )}
        </div>
    );
};