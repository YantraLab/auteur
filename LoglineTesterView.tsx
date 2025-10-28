import React from 'react';
import type { BoardComponentProps } from '../../pluginSystem/pluginTypes';

const LOGLINE_PLACEHOLDER = `Examples:
- "A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims." (The Silence of the Lambs)
- "A greedy theme park owner clones dinosaurs for his remote island resort, but the creatures escape and terrorize the opening-day visitors." (Jurassic Park)
`;

const LOGLINE_GUIDE = [
    { title: "Protagonist", text: "Who is your main character?" },
    { title: "Goal", text: "What do they want to achieve?" },
    { title: "Antagonist/Obstacle", text: "What stands in their way?" },
    { title: "Stakes", text: "What happens if they fail?" },
];

export const LoglineTesterView = ({ board, updateBoard }: BoardComponentProps) => {
    return (
        <div className="flex flex-col md:flex-row gap-4 h-full">
            <textarea 
                value={board.content || ''} 
                onChange={(e) => updateBoard(board.id, { content: e.target.value })} 
                className="w-full md:w-2/3 h-64 md:h-auto bg-transparent text-sm p-1 focus:outline-none resize-y placeholder:text-brand-text-dim/50" 
                placeholder={LOGLINE_PLACEHOLDER} 
            />
            <div className="md:w-1/3 border-t md:border-t-0 md:border-l border-brand-muted/50 pl-4 pt-4 md:pt-0">
                <h4 className="text-xs font-bold uppercase text-brand-text-dim mb-2">Logline Checklist</h4>
                <ul className="space-y-2">
                    {LOGLINE_GUIDE.map(item => (
                        <li key={item.title}>
                            <p className="font-semibold text-sm">{item.title}</p>
                            <p className="text-xs text-brand-text-dim">{item.text}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
