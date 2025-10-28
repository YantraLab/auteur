import React, { useState, useMemo } from 'react';
import type { BoardComponentProps } from '../../pluginSystem/pluginTypes';
import { ChevronDownIcon, SparklesIcon, PaintBrushIcon, CheckIcon } from '../icons';
import { LiveCursor } from './LiveCursor';

type ScriptElement = {
    type: 'scene' | 'action' | 'character' | 'dialogue' | 'parenthetical' | 'transition' | 'spacer';
    text?: string;
};

const parseFountain = (content: string): ScriptElement[] => {
    if (!content) return [];
    const elements: ScriptElement[] = [];
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();
        const isAllUpperCase = trimmedLine === trimmedLine.toUpperCase() && /[A-Z]/.test(trimmedLine);

        if (trimmedLine === '') {
            elements.push({ type: 'spacer' });
        } else if (trimmedLine.startsWith('.') || trimmedLine.startsWith('INT.') || trimmedLine.startsWith('EXT.')) {
            elements.push({ type: 'scene', text: trimmedLine });
        } else if (trimmedLine.endsWith('TO:') && isAllUpperCase) {
            elements.push({ type: 'transition', text: trimmedLine });
        } else if (trimmedLine.startsWith('(') && trimmedLine.endsWith(')')) {
            elements.push({ type: 'parenthetical', text: trimmedLine });
        } else if (isAllUpperCase) {
            const nextLine = (lines[i+1] || '').trim();
            if (nextLine !== '' && (nextLine.startsWith('(') || !((nextLine.startsWith('.') || nextLine.startsWith('INT.') || nextLine.startsWith('EXT.')) || (nextLine.endsWith('TO:') && nextLine === nextLine.toUpperCase())))) {
                elements.push({ type: 'character', text: trimmedLine });
            } else {
                elements.push({ type: 'action', text: line });
            }
        } else if (elements.length > 0 && ['character', 'parenthetical'].includes(elements[elements.length - 1].type)) {
            elements.push({ type: 'dialogue', text: line });
        } else {
            elements.push({ type: 'action', text: line });
        }
    }
    return elements;
};


const ScriptRenderer = ({ content }: { content: string }) => {
    const elements = useMemo(() => parseFountain(content), [content]);

    return (
        <div id="script-render-content" className="font-mono text-sm leading-relaxed bg-brand-bg p-4 rounded-md">
            {elements.map((el, index) => {
                switch (el.type) {
                    case 'scene':
                        return <p key={index} className="font-bold uppercase my-4">{el.text}</p>;
                    case 'action':
                        return <p key={index} className="my-2">{el.text}</p>;
                    case 'character':
                        return <p key={index} className="text-center uppercase mt-3 mb-1">{el.text}</p>;
                    case 'dialogue':
                        return <p key={index} className="px-4 md:px-10 text-left">{el.text}</p>;
                    case 'parenthetical':
                        return <p key={index} className="text-center text-brand-text-dim">{el.text}</p>;
                    case 'transition':
                        return <p key={index} className="text-right uppercase my-4">{el.text}</p>;
                    case 'spacer':
                        return <div key={index} className="h-4" />;
                    default:
                        return null;
                }
            })}
        </div>
    );
};

export const ScriptBoardView = ({ board, updateBoard, allUsers, currentUser }: BoardComponentProps) => {
    const [isEditing, setIsEditing] = useState(() => !board.content || board.content.trim() === '');
    const [isExportMenuOpen, setExportMenuOpen] = useState(false);

    const collaborator = useMemo(() => {
        if (!allUsers || !currentUser) return null;
        return allUsers.find(u => u.id !== currentUser.id && u.id === board.focusedUserId);
    }, [allUsers, currentUser, board.focusedUserId]);

    const handleExport = (format: 'pdf' | 'fountain') => {
        setExportMenuOpen(false);
        const title = board.title || 'script';
        const content = board.content || '';
        
        if (format === 'fountain') {
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title}.fountain`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else if (format === 'pdf') {
            const renderContent = document.getElementById('script-render-content');
            if (renderContent) {
                const printWindow = window.open('', '', 'height=600,width=800');
                if (printWindow) {
                    printWindow.document.write('<html><head><title>Print Script</title>');
                    printWindow.document.write('<style>body { font-family: courier, monospace; font-size: 12px; line-height: 1.5; } p { margin: 0; padding: 0; } .scene { font-weight: bold; text-transform: uppercase; margin-top: 1em; margin-bottom: 1em; } .action { margin-bottom: 1em; } .character { text-align: center; text-transform: uppercase; margin-top: 1em; } .dialogue { padding-left: 2.5in; padding-right: 1.5in; } .parenthetical { text-align: center; } .transition { text-align: right; text-transform: uppercase; margin-top: 1em; } </style>');
                    printWindow.document.write('</head><body>');
                    
                    const elements = parseFountain(content);
                    elements.forEach(el => {
                        if (el.text) {
                            printWindow.document.write(`<p class="${el.type}">${el.text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`);
                        }
                    });

                    printWindow.document.write('</body></html>');
                    printWindow.document.close();
                    printWindow.focus();
                    setTimeout(() => { // Timeout to allow content to render
                        printWindow.print();
                        printWindow.close();
                    }, 250);
                }
            }
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-shrink-0 mb-2 pb-2 border-b border-brand-muted/50 flex justify-between items-center gap-2">
                <div>
                    {isEditing ? (
                        <button onClick={() => setIsEditing(false)} className="flex items-center gap-1.5 px-3 py-1 text-sm font-semibold rounded-md bg-brand-primary text-white hover:bg-brand-secondary">
                            <CheckIcon className="w-4 h-4" />
                            Done Editing
                        </button>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 px-3 py-1 text-sm font-semibold rounded-md bg-brand-muted text-brand-text hover:bg-brand-muted/70">
                            <PaintBrushIcon className="w-4 h-4" />
                            Edit Script
                        </button>
                    )}
                </div>
                 <div className="relative flex items-center gap-2">
                    <button 
                        onClick={() => setExportMenuOpen(!isExportMenuOpen)}
                        className="flex items-center gap-1 px-3 py-1 text-sm font-semibold text-brand-text-dim hover:bg-brand-muted rounded-md"
                    >
                        Export <ChevronDownIcon className="w-4 h-4"/>
                    </button>
                    {isExportMenuOpen && (
                        <div 
                            className="absolute right-0 top-full mt-1 w-48 bg-brand-surface rounded-md shadow-lg border border-brand-muted z-10"
                            onMouseLeave={() => setExportMenuOpen(false)}
                        >
                            <button onClick={() => handleExport('pdf')} className="block w-full text-left px-4 py-2 text-sm text-brand-text hover:bg-brand-muted">As Formatted PDF (.pdf)</button>
                            <button onClick={() => handleExport('fountain')} className="block w-full text-left px-4 py-2 text-sm text-brand-text hover:bg-brand-muted">As Fountain File (.fountain)</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex-grow min-h-0 relative">
                 {isEditing && collaborator && (
                    <LiveCursor user={collaborator} containerBoundaryRef={null} />
                )}
                {isEditing ? (
                    <textarea 
                        value={board.content || ''} 
                        onChange={(e) => updateBoard(board.id, { content: e.target.value })} 
                        className="w-full h-full bg-transparent text-sm p-1 focus:outline-none resize-none placeholder:text-brand-text-dim/50 font-mono" 
                        placeholder="INT. COFFEE SHOP - DAY..." 
                        autoFocus
                    />
                ) : (
                    <div className="h-full overflow-y-auto cursor-text" onDoubleClick={() => setIsEditing(true)}>
                        {!board.content?.trim() ? (
                             <div className="text-center text-brand-text-dim p-8 flex flex-col items-center justify-center h-full">
                                <p>This script is empty.</p>
                                <button onClick={() => setIsEditing(true)} className="mt-2 text-sm font-semibold text-brand-primary hover:text-brand-secondary">Start Writing</button>
                             </div>
                        ) : (
                             <ScriptRenderer content={board.content || ''} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export const ScriptFooter = ({ board, onGenerateScript, handleGenerateBreakdown, isGenerating, isBreakdownLoading }: BoardComponentProps) => {
    return (
        <div className="flex justify-center gap-2">
            {onGenerateScript && (
                <button
                    onClick={onGenerateScript}
                    disabled={isGenerating}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-brand-primary bg-brand-primary/10 hover:bg-brand-primary/20 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isGenerating ? (
                        <>
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Generating...
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="w-4 h-4" />
                            Generate Script with AI
                        </>
                    )}
                </button>
            )}
            {handleGenerateBreakdown && (
                <button 
                    onClick={() => handleGenerateBreakdown(board.content || '')}
                    disabled={isBreakdownLoading || !board.content?.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-brand-primary bg-brand-primary/10 hover:bg-brand-primary/20 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isBreakdownLoading ? (
                        <>
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Breaking down...
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="w-4 h-4" />
                            Generate Breakdown
                        </>
                    )}
                </button>
            )}
        </div>
    );
};