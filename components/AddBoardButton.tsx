import React, { useState, useRef, useEffect } from 'react';
import { getPlugins } from '../pluginSystem/pluginRegistry';
import type { BoardPlugin } from '../pluginSystem/pluginTypes';
import type { Board } from '../types';
import { PlusIcon } from './icons';
import { SINGLETON_BOARD_TYPES } from '../constants';

interface AddBoardButtonProps {
    addBoard: (plugin: BoardPlugin) => void;
    boards: Board[];
    buttonClassName?: string;
    children?: React.ReactNode;
}

export const AddBoardButton = ({ addBoard, boards, buttonClassName, children }: AddBoardButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLDivElement>(null);

    const availablePlugins = getPlugins().filter(p => p.type !== 'GENERATED_CONTENT');
    const existingBoardTypes = new Set(boards.map(b => b.type));
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAddBoard = (plugin: BoardPlugin) => {
        addBoard(plugin);
        setIsOpen(false);
    };

    const defaultButtonClass = "w-full border-2 border-dashed border-brand-muted hover:border-brand-primary hover:bg-brand-primary/5 text-brand-text-dim hover:text-brand-primary font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2";

    return (
        <div className="relative" ref={buttonRef}>
            <button 
                className={buttonClassName || defaultButtonClass}
                onClick={() => setIsOpen(!isOpen)}
            >
                {children || (
                    <>
                        <PlusIcon className="w-5 h-5"/> Add Board
                    </>
                )}
            </button>
            {isOpen && (
                <div className="absolute bottom-full mb-2 w-96 max-w-[90vw] left-1/2 -translate-x-1/2 p-2 bg-brand-surface rounded-lg shadow-2xl border border-brand-muted transition-all duration-200 z-20">
                    <p className="text-xs font-semibold text-brand-text-dim uppercase tracking-wider p-2">Add New Board</p>
                    <div className="grid grid-cols-2 gap-1">
                        {availablePlugins.map(plugin => {
                            const isSingleton = SINGLETON_BOARD_TYPES.includes(plugin.type);
                            const isDisabled = isSingleton && existingBoardTypes.has(plugin.type);

                            return (
                                <button 
                                    key={plugin.type} 
                                    onClick={() => !isDisabled && handleAddBoard(plugin)}
                                    disabled={isDisabled}
                                    aria-disabled={isDisabled}
                                    className={`text-left p-2 rounded-md text-sm flex items-start gap-2 ${
                                        isDisabled 
                                            ? 'opacity-50 cursor-not-allowed' 
                                            : 'hover:bg-brand-muted'
                                    }`}
                                >
                                    <plugin.icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isDisabled ? 'text-brand-text-dim' : 'text-brand-primary'}`}/>
                                    <div>
                                        <p className="font-semibold leading-tight">{plugin.title}</p>
                                        <p className="text-xs text-brand-text-dim">{plugin.description}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};