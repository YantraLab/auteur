import React, { useMemo } from 'react';
import ProfileCard from '../ProfileCard';
// Fix: Aliased Board as DocumentBoard to fix missing export error.
import type { Board as DocumentBoard } from '../../types';

// The shape of the crew data stored in the board's content
type CrewMember = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  imageUrl?: string;
};

// Helper to generate a twitter-style handle from a name
const generateHandle = (name: string) => name.toLowerCase().replace(/\s+/g, '');

interface CrewContactCardViewProps {
    board: DocumentBoard;
}

export const CrewContactCardView = ({ board }: CrewContactCardViewProps) => {
    const crewMembers = useMemo<CrewMember[]>(() => {
        try {
            const parsed = JSON.parse(board.content || '[]');
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error("Failed to parse crew contacts:", e);
            return [];
        }
    }, [board.content]);

    if (crewMembers.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-center">
                <div>
                    <h3 className="text-xl font-bold text-white">No Crew Members Yet</h3>
                    <p className="mt-2 text-white/70">Add contacts to this board to see them here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 justify-items-center p-8 overflow-y-auto">
            {crewMembers.map(crew => (
                <ProfileCard
                    key={crew.id}
                    name={crew.name || 'Unnamed'}
                    title={crew.role || 'No Role Assigned'}
                    avatarUrl={crew.imageUrl || `https://i.pravatar.cc/500?u=${crew.id}`}
                    handle={generateHandle(crew.name || 'crew')}
                    status="Available"
                    contactText="Email"
                    onContactClick={() => {
                        if (crew.email) window.location.href = `mailto:${crew.email}`;
                    }}
                />
            ))}
        </div>
    );
};