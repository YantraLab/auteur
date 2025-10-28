import React from 'react';
import type { Notification } from '../../types';
import { XMarkIcon, BellIcon } from '../icons';

interface NotificationModalProps {
    notifications: Notification[];
    onClose: () => void;
}

export const NotificationModal = ({ notifications, onClose }: NotificationModalProps) => {
    
    const timeAgo = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) {
            const years = Math.floor(interval);
            return `${years} year${years > 1 ? 's' : ''} ago`;
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            const months = Math.floor(interval);
            return `${months} month${months > 1 ? 's' : ''} ago`;
        }
        interval = seconds / 86400;
        if (interval > 1) {
            const days = Math.floor(interval);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        }
        interval = seconds / 3600;
        if (interval > 1) {
            const hours = Math.floor(interval);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        }
        interval = seconds / 60;
        if (interval > 1) {
            const minutes = Math.floor(interval);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        }
        return Math.floor(seconds) + " seconds ago";
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-brand-surface rounded-lg shadow-2xl w-full max-w-2xl text-brand-text relative border border-brand-muted max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-brand-muted flex-shrink-0">
                    <h2 className="font-bold text-base text-brand-text-dim uppercase tracking-wider flex items-center">
                        <BellIcon className="w-5 h-5 mr-2" />
                        Notifications
                    </h2>
                    <button onClick={onClose} className="text-brand-text-dim hover:text-brand-primary transition-colors" aria-label="Close notifications">
                        <XMarkIcon className="w-6 h-6"/>
                    </button>
                </div>

                <div className="overflow-y-auto flex-grow min-h-0 p-4">
                    {notifications.length === 0 ? (
                        <div className="text-center text-brand-text-dim py-12">
                            <p>You have no new notifications.</p>
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {notifications.map(n => (
                                <li key={n.id} className={`p-4 rounded-md border ${n.read ? 'bg-brand-bg/50 border-brand-muted/50' : 'bg-brand-primary/5 border-brand-primary/20'}`}>
                                    <p className="text-sm text-brand-text">{n.message}</p>
                                    <p className="text-xs text-brand-text-dim mt-2">{timeAgo(n.timestamp)}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};
