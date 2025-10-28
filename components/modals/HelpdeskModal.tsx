import React from 'react';
import { XMarkIcon, EnvelopeIcon, ChatBubbleIcon } from '../icons';

const FAQ_DATA = [
    {
        q: "What is Auteur?",
        a: "Auteur is an AI-powered studio designed for filmmakers and content creators. It helps you develop ideas, manage pre-production documents, and generate creative content like scripts and visual style guides, all in one place."
    },
    {
        q: "How do I create a new project?",
        a: "Simply click the '+ New Project' button in the sidebar. A new project will be created with a default 'Ideaboard', and you can rename it by clicking on the title at the top of the workspace."
    },
    {
        q: "What are the different types of boards?",
        a: "Auteur offers various boards like Ideaboards for text notes, Moodboards for images, Storyboards for visual sequencing, and several document boards for things like budgets, character profiles, and scripts."
    },
    {
        q: "How does the 'Generate Script & Cinematography' button work?",
        a: "This feature uses the Gemini API to analyze all the notes from your Ideaboards and Moodboards, your chosen cinematic style, and your available gear. It then generates a complete script, a visual style guide, and a cinematography plan tailored to your project."
    },
    {
        q: "Can I use my own plugins or board types?",
        a: "Currently, Auteur uses a predefined set of board types. Custom plugin support is a feature we are considering for the future."
    }
];

interface HelpdeskModalProps {
    onClose: () => void;
    onOpenChatWidget: () => void;
}

export const HelpdeskModal = ({ onClose, onOpenChatWidget }: HelpdeskModalProps) => {
    const handleChatClick = () => {
        onOpenChatWidget();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4 md:p-8" onClick={onClose}>
            <div className="bg-brand-surface rounded-lg shadow-2xl w-full max-w-4xl text-brand-text relative border border-brand-muted max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-brand-muted flex-shrink-0">
                    <h2 className="font-bold text-base text-brand-text-dim uppercase tracking-wider">Helpdesk & FAQ</h2>
                    <button onClick={onClose} className="text-brand-text-dim hover:text-brand-primary transition-colors">
                        <XMarkIcon className="w-6 h-6"/>
                    </button>
                </div>
                <div className="overflow-y-auto flex-grow min-h-0 p-6">
                    <div>
                        <ul className="space-y-6">
                            {FAQ_DATA.map(item => (
                                <li key={item.q}>
                                    <p className="font-semibold text-brand-text mb-1">{item.q}</p>
                                    <p className="text-sm text-brand-text-dim">{item.a}</p>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8 pt-6 border-t border-brand-muted text-center space-y-4">
                            <h3 className="text-lg font-semibold">Still need help?</h3>
                            <div className="flex justify-center gap-4">
                                <button onClick={handleChatClick} className="flex items-center gap-2 px-4 py-2 rounded-md bg-brand-primary hover:bg-brand-secondary text-white font-semibold transition-colors">
                                    <ChatBubbleIcon className="w-5 h-5"/> Chat with AI Assistant
                                </button>
                                <a href="mailto:support@auteur.app" className="flex items-center gap-2 px-4 py-2 rounded-md bg-brand-surface border border-brand-muted hover:bg-brand-muted text-brand-text font-semibold transition-colors">
                                    <EnvelopeIcon className="w-5 h-5"/> Email Support
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
