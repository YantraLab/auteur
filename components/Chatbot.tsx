import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { SparklesIcon } from './icons';

interface ChatbotProps {
    onBack: () => void;
}

type Message = {
    sender: 'user' | 'bot';
    text: string;
};

const CHATBOT_SYSTEM_INSTRUCTION = 'You are a friendly and helpful AI assistant for a filmmaking app called Auteur. Your ONLY purpose is to help users with issues related to the Auteur application, including features, bugs, account problems, or billing. You MUST NEVER answer questions outside of this scope. If a user asks an unrelated question, politely decline and steer the conversation back to Auteur. Before providing a solution, ask clarifying questions to fully understand the user\'s problem.';
const NON_CONTEXTUAL_KEYWORDS = /auteur|project|board|script|gear|camera|style|generate|login|account|password|bug|error|issue|help|feature|support|billing|payment/i;
const CACHED_RESPONSE = "I'm sorry, I can only assist with questions related to the Auteur application. How can I help you with your project or account?";

export const Chatbot = ({ onBack }: ChatbotProps) => {
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'bot', text: 'Hello! I am the Auteur AI Assistant. How can I help you today with the application?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatSession = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const chat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: CHATBOT_SYSTEM_INSTRUCTION,
                },
            });
            chatSession.current = chat;
        } catch (error) {
            console.error("Failed to initialize Gemini Chat:", error);
            setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I am currently unavailable. Please try again later or contact support via email.' }]);
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Cost-saving pre-filter for non-contextual questions
        if (!NON_CONTEXTUAL_KEYWORDS.test(input)) {
            setTimeout(() => {
                setMessages(prev => [...prev, { sender: 'bot', text: CACHED_RESPONSE }]);
                setIsLoading(false);
            }, 500);
            return;
        }

        try {
            if (!chatSession.current) {
                throw new Error("Chat session not initialized.");
            }
            const response = await chatSession.current.sendMessage({ message: input });
            const botMessage: Message = { sender: 'bot', text: response.text };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Chatbot API error:", error);
            setMessages(prev => [...prev, { sender: 'bot', text: 'I seem to be having trouble connecting. Please check your network or try again in a moment.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[65vh]">
            <button onClick={onBack} className="text-sm font-semibold text-brand-primary hover:text-brand-secondary mb-4 self-start">&larr; Back to FAQ</button>
            <div className="flex-grow bg-brand-bg/60 rounded-md p-4 overflow-y-auto space-y-4 border border-brand-muted/50">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'user' ? 'bg-brand-primary text-white' : 'bg-brand-surface border border-brand-muted'}`}>
                            {msg.sender === 'bot' && index === 0 && <SparklesIcon className="w-4 h-4 inline-block mr-1 text-brand-primary" />}
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-md p-3 rounded-lg bg-brand-surface border border-brand-muted">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-brand-text-dim rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-brand-text-dim rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-brand-text-dim rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="mt-4 flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about Auteur..."
                    disabled={isLoading}
                    className="w-full p-2 bg-brand-bg border border-brand-muted rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none text-sm"
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="py-2 px-4 rounded-md bg-brand-primary hover:bg-brand-secondary text-white font-semibold disabled:bg-brand-primary/50 disabled:cursor-not-allowed transition-colors"
                >
                    Send
                </button>
            </div>
        </div>
    );
};
