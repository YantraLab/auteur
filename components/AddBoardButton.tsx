import React from 'react';
import { getPlugins } from '../pluginSystem/pluginRegistry';
import type { BoardPlugin } from '../pluginSystem/pluginTypes';
import { PlusIcon } from './icons';

interface AddBoardButtonProps {
    addBoard: (plugin: BoardPlugin) => void;
}

export const AddBoardButton = ({ addBoard }: AddBoardButtonProps) => {
    const availablePlugins = getPlugins().filter(p => p.type !== 'GENERATED_CONTENT');
    
    return (
        <div className="group relative">
            <button className="w-full border-2 border-dashed border-brand-muted hover:border-brand-primary hover:bg-brand-primary/5 text-brand-text-dim hover:text-brand-primary font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                <PlusIcon className="w-5 h-5"/> Add Board
            </button>
            <div className="absolute bottom-full mb-2 w-96 left-1/2 -translate-x-1/2 p-2 bg-brand-surface rounded-lg shadow-2xl border border-brand-muted opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
                <p className="text-xs font-semibold text-brand-text-dim uppercase tracking-wider p-2">Add New Board</p>
                <div className="grid grid-cols-2 gap-1">
                    {availablePlugins.map(plugin => (
                        <button 
                            key={plugin.type} 
                            onClick={() => addBoard(plugin)} 
                            className="text-left p-2 rounded-md hover:bg-brand-muted text-sm flex items-start gap-2"
                        >
                            <plugin.icon className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5"/>
                            <div>
                                <p className="font-semibold leading-tight">{plugin.title}</p>
                                <p className="text-xs text-brand-text-dim">{plugin.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
