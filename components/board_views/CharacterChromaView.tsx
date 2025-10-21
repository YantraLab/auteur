import React, { useMemo } from 'react';
import ProfileCard from '../ProfileCard';
// Fix: Aliased Board as DocumentBoard to fix missing export error.
import type { Board as DocumentBoard } from '../../types';

// The shape of the character profile data stored in the board's content
type Profile = {
    id: string;
    name: string;
    imageUrl?: string;
    core: { role: string; };
};

// Helper to generate a twitter-style handle from a name
const generateHandle = (name: string) => `@${name.toLowerCase().replace(/\s+/g, '')}`;

interface CharacterChromaViewProps {
    board: DocumentBoard;
}

export const CharacterChromaView = ({ board }: CharacterChromaViewProps) => {
    const profiles = useMemo<Profile[]>(() => {
        try {
            const parsed = JSON.parse(board.content || '[]');
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error("Failed to parse character profiles:", e);
            return [];
        }
    }, [board.content]);

    if (profiles.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-center">
                <div>
                    <h3 className="text-xl font-bold text-white">No Characters Yet</h3>
                    <p className="mt-2 text-white/70">Add characters to this board to see them here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 justify-items-center p-8 overflow-y-auto">
            {profiles.map((p) => (
                <ProfileCard
                    key={p.id}
                    name={p.name || 'Unnamed Character'}
                    title={p.core.role || 'No role defined'}
                    avatarUrl={p.imageUrl || `https://i.pravatar.cc/500?u=${p.id}`}
                    handle={generateHandle(p.name || 'character')}
                    status="In Story"
                    showUserInfo={false}
                />
            ))}
        </div>
    );
};