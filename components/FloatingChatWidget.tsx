import React, { useState } from 'react';
import { Chatbot } from './Chatbot';
import { XMarkIcon, ChatBubbleIcon, ChevronDownIcon } from './icons';
import type { Notification } from '../types';

interface FloatingChatWidgetProps {
    isVisible: boolean;
    onClose: () => void;
    notifications: Notification[];
}

export const FloatingChatWidget = ({ isVisible, onClose, notifications }: FloatingChatWidgetProps) => {
    const [isMinimized, setIsMinimized] = useState(false);

    if (!isVisible) {
        return null;
    }

    if (isMinimized) {
        return (
            <button
                onClick={() => setIsMinimized(false)}
                className="fixed bottom-5 right-5 z-50 bg-brand-primary text-white rounded-full p-4 shadow-lg hover:bg-brand-secondary transition-transform transform hover:scale-110"
                aria-label="Open AI Assistant"
            >
                <ChatBubbleIcon className="w-8 h-8" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-5 right-5 z-50 w-full max-w-md bg-brand-surface rounded-lg shadow-2xl border border-brand-muted flex flex-col h-[75vh] max-h-[600px] transition-all duration-300 ease-out">
            <div className="flex justify-between items-center p-3 border-b border-brand-muted flex-shrink-0 bg-brand-bg/50 rounded-t-lg">
                <h2 className="font-bold text-base text-brand-text-dim uppercase tracking-wider">AI Assistant</h2>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsMinimized(true)} className="text-brand-text-dim hover:text-brand-primary transition-colors" aria-label="Minimize chat">
                        <ChevronDownIcon className="w-6 h-6"/>
                    </button>
                    <button onClick={onClose} className="text-brand-text-dim hover:text-brand-primary transition-colors" aria-label="Close chat">
                        <XMarkIcon className="w-6 h-6"/>
                    </button>
                </div>
            </div>
            <div className="overflow-y-auto flex-grow min-h-0 p-4">
                <Chatbot notifications={notifications} />
            </div>
        </div>
    );
};