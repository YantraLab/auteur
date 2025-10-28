import React, { useMemo } from 'react';
import type { BoardComponentProps } from '../../pluginSystem/pluginTypes';
import { SparklesIcon } from '../icons';

// Types for the breakdown data
type BreakdownItem = string;
type SceneBreakdown = {
    sceneNumber: number;
    setting: string;
    characters: BreakdownItem[];
    props: BreakdownItem[];
    wardrobe: BreakdownItem[];
    sfx: BreakdownItem[];
    vfx: BreakdownItem[];
    notes: BreakdownItem[];
};
type BreakdownData = {
    breakdown: SceneBreakdown[];
    error?: string;
};

const BreakdownList = ({ title, items }: { title: string; items: BreakdownItem[] }) => {
    if (!items || items.length === 0) return null;
    return (
        <div>
            <h4 className="font-semibold text-xs uppercase text-brand-text-dim tracking-wider">{title}</h4>
            <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
                {items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
};


export const ScriptBreakdownBoard = ({ board }: BoardComponentProps) => {
    const data = useMemo<BreakdownData | null>(() => {
        try {
            const content = board.content || '{}';
            return JSON.parse(content) as BreakdownData;
        } catch (e) {
            console.error("Failed to parse script breakdown JSON:", e);
            return { breakdown: [], error: "Failed to parse breakdown data. The format might be incorrect." };
        }
    }, [board.content]);

    if (!data || data.error) {
        return (
            <div className="text-center text-brand-text-dim p-4">
                <p>{data?.error || "No breakdown data available. Generate a breakdown from the Script board."}</p>
            </div>
        );
    }
    
    if (!data.breakdown || data.breakdown.length === 0) {
        return (
             <div className="text-center text-brand-text-dim p-4">
                <p>The script appears to be empty or could not be analyzed. Please ensure the script has content and try generating the breakdown again.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {data.breakdown.map((scene, index) => (
                <div key={index} className="bg-brand-bg/50 rounded-md border border-brand-muted/70 p-4">
                    <h3 className="font-bold text-base border-b border-brand-muted pb-2 mb-3">
                        Scene {scene.sceneNumber}: <span className="uppercase">{scene.setting}</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <BreakdownList title="Characters" items={scene.characters} />
                        <BreakdownList title="Props" items={scene.props} />
                        <BreakdownList title="Wardrobe" items={scene.wardrobe} />
                        <BreakdownList title="Sound Effects (SFX)" items={scene.sfx} />
                        <BreakdownList title="Visual Effects (VFX)" items={scene.vfx} />
                        <BreakdownList title="Notes" items={scene.notes} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export const ScriptBreakdownFooter = ({ board, handleGenerateCallSheet, isCallSheetLoading }: BoardComponentProps) => {
    if (!handleGenerateCallSheet) return null;

    return (
        <div className="flex justify-center">
            <button
                onClick={() => handleGenerateCallSheet(board.content || '')}
                disabled={isCallSheetLoading || !board.content?.trim() || board.content === '{}'}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-brand-primary bg-brand-primary/10 hover:bg-brand-primary/20 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isCallSheetLoading ? (
                    <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                    </>
                ) : (
                    <>
                        <SparklesIcon className="w-4 h-4" />
                        Generate Call Sheet
                    </>
                )}
            </button>
        </div>
    );
};
