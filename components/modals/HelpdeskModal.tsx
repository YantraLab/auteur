import React, { useState } from 'react';
import { Chatbot } from '../Chatbot';
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
        a: "Auteur supports several board types: 'Ideaboard' for text notes, 'Moodboard' and 'Storyboard' for images and captions, and various 'Document' boards for structured content like Character Profiles, Budgets, and Story Treatments. There are also 'Generated Content' boards that hold AI-generated results."
    },
    {
        q: "How does the AI 'Generate Script & Cinematography' feature work?",
        a: "This feature synthesizes all the information from your Ideaboards, Moodboards, Project Settings (like style and aspect ratio), and your listed Gear. It sends this context to the Gemini model to generate a cohesive script, a visual style guide, and a detailed cinematography plan with specific gear recommendations."
    },
    {
        q: "How do I manage my gear inventory?",
        a: "Click the 'Manage Gear' button at the bottom of the sidebar. This opens a modal where you can add, categorize, and remove all your available filmmaking equipment. This list is used by the AI to make relevant gear recommendations."
    },
    {
        q: "How does the Storyboard AI image generation work?",
        a: "On any Storyboard, you'll find an input field at the bottom. Type a description of a shot or scene, and the AI will generate an image for your storyboard panel, helping you visualize your narrative quickly."
    },
    {
        q: "The Character Profile / Crew Contact List looks different when I click on it. Why?",
        a: "These specific document boards have special full-screen views. Instead of a simple document, they are displayed as a grid of interactive, holographic profile cards for a more engaging and visual way to browse your characters and crew."
    },
    {
        q: "What if I have an issue or a bug to report?",
        a: "We're here to help! You can use the AI Chat Assistant available on this page for instant help with application-related issues. If the chatbot can't solve your problem or you'd prefer to talk to a human, you can also email our support team."
    }
];

export const HelpdeskModal = ({ onClose }: { onClose: () => void; }) => {
    const [view, setView] = useState<'faq' | 'chat'>('faq');

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4 md:p-8" onClick={onClose}>
            <div 
                className="bg-brand-surface rounded-lg shadow-2xl w-full max-w-4xl text-brand-text relative border border-brand-muted max-h-[95vh] flex flex-col" 
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-brand-muted flex-shrink-0">
                    <h2 className="font-bold text-base text-brand-text-dim uppercase tracking-wider">{view === 'faq' ? 'Help & Support' : 'AI Assistant'}</h2>
                    <button onClick={onClose} className="text-brand-text-dim hover:text-brand-primary transition-colors">
                        <XMarkIcon className="w-6 h-6"/>
                    </button>
                </div>
                
                <div className="overflow-y-auto flex-grow min-h-0 p-6">
                    {view === 'faq' ? (
                        <div>
                            <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
                            <div className="space-y-3">
                                {FAQ_DATA.map((item, index) => (
                                    <details key={index} className="bg-brand-bg/60 p-3 rounded-lg border border-brand-muted/50 text-sm group">
                                        <summary className="font-semibold cursor-pointer list-none flex justify-between items-center group-hover:text-brand-primary transition-colors">
                                            {item.q}
                                            <span className="text-brand-primary transition-transform duration-300 transform group-open:rotate-45">+</span>
                                        </summary>
                                        <p className="mt-2 text-brand-text-dim leading-relaxed">{item.a}</p>
                                    </details>
                                ))}
                            </div>

                             <div className="mt-10 pt-6 border-t border-brand-muted text-center">
                                <h3 className="text-lg font-bold mb-3">Still need help?</h3>
                                <div className="flex justify-center items-center gap-4">
                                    <a href="mailto:support@auteur.app" className="flex items-center gap-2 py-2 px-5 rounded-md bg-brand-muted hover:bg-brand-muted/70 text-brand-text font-semibold text-sm transition-colors">
                                        <EnvelopeIcon className="w-5 h-5" />
                                        Email Support
                                    </a>
                                     <button onClick={() => setView('chat')} className="flex items-center gap-2 py-2 px-5 rounded-md bg-brand-primary hover:bg-brand-secondary text-white font-semibold text-sm transition-colors">
                                        <ChatBubbleIcon className="w-5 h-5" />
                                        Chat with AI Assistant
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Chatbot onBack={() => setView('faq')} />
                    )}
                </div>
            </div>
        </div>
    );
};
