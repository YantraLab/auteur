import React from 'react';
import type { Project, User } from '../types';
import { GlobalSearch } from './GlobalSearch';

interface ProjectHeaderProps {
    projects: Project[];
    activeProject: Project;
    setActiveProjectId: (id: string) => void;
    setFullscreenBoardId: (id: string | null) => void;
    updateProject: (id: string, updates: Partial<Project>) => void;
    allUsers: User[];
    currentUser: User;
}

const ActiveUserAvatars = ({ userIds, allUsers, currentUser }: { userIds: string[], allUsers: User[], currentUser: User }) => {
    const activeUsers = userIds.map(id => allUsers.find(u => u.id === id)).filter(Boolean) as User[];
    
    // Put current user first
    const sortedUsers = [
        currentUser,
        ...activeUsers.filter(u => u.id !== currentUser.id)
    ];

    return (
        <div className="flex items-center -space-x-2">
            {sortedUsers.map(user => (
                <img
                    key={user.id}
                    src={user.avatarUrl}
                    alt={user.name}
                    title={user.name}
                    className={`w-8 h-8 rounded-full border-2 border-brand-surface transition-transform hover:scale-110 ${user.id === currentUser.id ? 'ring-2 ring-brand-primary' : ''}`}
                />
            ))}
        </div>
    );
}


export const ProjectHeader = ({ projects, activeProject, setActiveProjectId, setFullscreenBoardId, updateProject, allUsers, currentUser }: ProjectHeaderProps) => {
    return (
        <div className="p-4 md:p-6 border-b border-brand-muted bg-brand-surface flex-shrink-0 flex items-center justify-between gap-4">
            <input
                type="text"
                value={activeProject.name}
                onChange={(e) => updateProject(activeProject.id, { name: e.target.value })}
                className="text-2xl md:text-3xl font-extrabold bg-transparent focus:outline-none w-full max-w-xl"
                placeholder="Untitled Project"
            />
            <div className="flex items-center gap-4">
                <GlobalSearch 
                    projects={projects}
                    setActiveProjectId={setActiveProjectId}
                    setFullscreenBoardId={setFullscreenBoardId}
                />
                <ActiveUserAvatars 
                    userIds={activeProject.activeUserIds} 
                    allUsers={allUsers}
                    currentUser={currentUser}
                />
            </div>
        </div>
    );
};
