import React, { useMemo } from 'react';
import type { BoardComponentProps } from '../../pluginSystem/pluginTypes';

// Types for the call sheet data
type Scene = {
    sceneNumber: number;
    setting: string;
    description: string;
    cast: string[];
};
type CastMember = {
    characterName: string;
    actorName: string;
    callTime: string;
};
type CrewMember = {
    role: string;
    name: string;
};
type CallSheetData = {
    projectName: string;
    date: string;
    generalCallTime: string;
    weather: string;
    nearestHospital: string;
    scenes: Scene[];
    cast: CastMember[];
    crew: CrewMember[];
    error?: string;
};

const InfoBlock = ({ label, value }: { label: string; value: string | undefined }) => (
    <div>
        <h4 className="text-xs font-bold uppercase text-brand-text-dim tracking-wider">{label}</h4>
        <p className="text-sm text-brand-text mt-1">{value || 'N/A'}</p>
    </div>
);

export const CallSheetBoard = ({ board }: BoardComponentProps) => {
    const data = useMemo<CallSheetData | null>(() => {
        try {
            const content = board.content || '{}';
            return JSON.parse(content) as CallSheetData;
        } catch (e) {
            console.error("Failed to parse call sheet JSON:", e);
            return { error: "Failed to parse call sheet data.", projectName: '', date: '', generalCallTime: '', weather: '', nearestHospital: '', scenes: [], cast: [], crew: [] };
        }
    }, [board.content]);

    if (!data || data.error) {
        return (
            <div className="text-center text-brand-text-dim p-4">
                <p>{data?.error || "No call sheet data available. Generate one from the Script Breakdown board."}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 text-sm">
            {/* Header */}
            <div className="text-center border-b-2 border-brand-muted pb-4">
                <h2 className="text-2xl font-bold uppercase">{data.projectName}</h2>
                <p className="text-lg font-semibold text-brand-text-dim">Call Sheet - {data.date}</p>
            </div>

            {/* General Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-brand-bg/50 p-4 rounded-md border border-brand-muted/70">
                <InfoBlock label="General Call Time" value={data.generalCallTime} />
                <InfoBlock label="Weather" value={data.weather} />
                <InfoBlock label="Nearest Hospital" value={data.nearestHospital} />
            </div>

            {/* Schedule */}
            <div>
                <h3 className="text-base font-bold mb-2 uppercase tracking-wide">Shooting Schedule</h3>
                <div className="bg-brand-bg/50 rounded-md border border-brand-muted/70 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="hidden md:table-header-group bg-brand-muted/50 text-xs text-brand-text-dim uppercase">
                            <tr>
                                <th className="p-2 w-1/6">Scene #</th>
                                <th className="p-2 w-2/6">Setting</th>
                                <th className="p-2 w-3/6">Description</th>
                            </tr>
                        </thead>
                        <tbody className="block md:table-row-group">
                            {data.scenes?.map((scene, index) => (
                                <tr key={index} className="block p-3 border-b border-brand-muted/70 last:border-b-0 md:table-row md:p-0 md:border-t">
                                    <td className="block md:table-cell md:p-2 font-semibold">
                                        <span className="font-bold text-xs uppercase text-brand-text-dim md:hidden">Scene #: </span>
                                        {scene.sceneNumber}
                                    </td>
                                    <td className="block md:table-cell md:p-2 uppercase">
                                        <span className="font-bold text-xs uppercase text-brand-text-dim md:hidden">Setting: </span>
                                        {scene.setting}
                                    </td>
                                    <td className="block md:table-cell md:p-2">
                                         <span className="font-bold text-xs uppercase text-brand-text-dim md:hidden">Description: </span>
                                        {scene.description}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cast */}
                <div>
                    <h3 className="text-base font-bold mb-2 uppercase tracking-wide">Cast</h3>
                    <div className="bg-brand-bg/50 rounded-md border border-brand-muted/70 overflow-hidden">
                         <table className="w-full text-left">
                            <thead className="hidden md:table-header-group bg-brand-muted/50 text-xs text-brand-text-dim uppercase">
                                <tr>
                                    <th className="p-2">Character</th>
                                    <th className="p-2">Actor</th>
                                    <th className="p-2 text-right">Call Time</th>
                                </tr>
                            </thead>
                            <tbody className="block md:table-row-group">
                                {data.cast?.map((member, index) => (
                                    <tr key={index} className="block p-3 border-b border-brand-muted/70 last:border-b-0 md:table-row md:p-0 md:border-t">
                                        <td className="block md:table-cell md:p-2 font-semibold">
                                            <span className="font-bold text-xs uppercase text-brand-text-dim md:hidden">Character: </span>
                                            {member.characterName}
                                        </td>
                                        <td className="block md:table-cell md:p-2">
                                            <span className="font-bold text-xs uppercase text-brand-text-dim md:hidden">Actor: </span>
                                            {member.actorName}
                                        </td>
                                        <td className="block text-right md:table-cell md:p-2">
                                            <span className="font-bold text-xs uppercase text-brand-text-dim md:hidden">Call Time: </span>
                                            {member.callTime}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Crew */}
                 <div>
                    <h3 className="text-base font-bold mb-2 uppercase tracking-wide">Key Crew</h3>
                    <div className="bg-brand-bg/50 rounded-md border border-brand-muted/70 overflow-hidden">
                         <table className="w-full text-left">
                            <thead className="hidden md:table-header-group bg-brand-muted/50 text-xs text-brand-text-dim uppercase">
                                <tr>
                                    <th className="p-2">Role</th>
                                    <th className="p-2">Name</th>
                                </tr>
                            </thead>
                             <tbody className="block md:table-row-group">
                                {data.crew?.map((member, index) => (
                                    <tr key={index} className="block p-3 border-b border-brand-muted/70 last:border-b-0 md:table-row md:p-0 md:border-t">
                                        <td className="block md:table-cell md:p-2 font-semibold">
                                            <span className="font-bold text-xs uppercase text-brand-text-dim md:hidden">Role: </span>
                                            {member.role}
                                        </td>
                                        <td className="block md:table-cell md:p-2">
                                            <span className="font-bold text-xs uppercase text-brand-text-dim md:hidden">Name: </span>
                                            {member.name}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};