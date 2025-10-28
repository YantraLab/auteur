import React from 'react';
import { getPlugins } from '../../pluginSystem/pluginRegistry';
import type { BoardPlugin } from '../../pluginSystem/pluginTypes';
import type { Board } from '../../types';
import { XMarkIcon } from '../icons';
import { SINGLETON_BOARD_TYPES } from '../../constants';

interface AddBoardModalProps {
  onClose: () => void;
  onAddBoard: (plugin: BoardPlugin) => void;
  boards: Board[];
}

export const AddBoardModal = ({ onClose, onAddBoard, boards }: AddBoardModalProps) => {
  const availablePlugins = getPlugins().filter(p => p.type !== 'GENERATED_CONTENT');
  const existingBoardTypes = new Set(boards.map(b => b.type));

  const handleSelectPlugin = (plugin: BoardPlugin) => {
    onAddBoard(plugin);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-brand-surface rounded-lg shadow-2xl w-full max-w-4xl text-brand-text relative border border-brand-muted max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-brand-muted flex-shrink-0">
            <h2 className="text-xl font-bold text-brand-text">Add New Board</h2>
            <button onClick={onClose} className="text-brand-text-dim hover:text-brand-primary transition-colors">
                <XMarkIcon className="w-6 h-6"/>
            </button>
        </div>
        <div className="overflow-y-auto flex-grow p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availablePlugins.map(plugin => {
                    const isSingleton = SINGLETON_BOARD_TYPES.includes(plugin.type);
                    const isDisabled = isSingleton && existingBoardTypes.has(plugin.type);
                    return (
                        <button 
                            key={plugin.type}
                            onClick={() => !isDisabled && handleSelectPlugin(plugin)}
                            disabled={isDisabled}
                            aria-disabled={isDisabled}
                            className={`text-left p-6 bg-brand-bg/60 rounded-lg border-2 border-brand-muted hover:border-brand-primary hover:bg-brand-primary/5 transition-all duration-200 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-brand-surface ${isDisabled ? 'opacity-50 cursor-not-allowed hover:-translate-y-0' : ''}`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 bg-brand-primary/10 p-3 rounded-md">
                                    <plugin.icon className={`w-6 h-6 ${isDisabled ? 'text-brand-text-dim' : 'text-brand-primary'}`} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-brand-text">{plugin.title}</h3>
                                    <p className="text-sm text-brand-text-dim mt-1">{plugin.description}</p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
};
