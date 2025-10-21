import React, { useState } from 'react';
import { PREDEFINED_STYLES } from '../../constants';
import { PaintBrushIcon } from '../icons';

interface StyleEditorModalProps {
    currentStyle: string;
    onClose: () => void;
    onSave: (newStyle: string) => void;
}
export const StyleEditorModal = ({ currentStyle, onClose, onSave }: StyleEditorModalProps) => {
    const [localStyle, setLocalStyle] = useState(currentStyle);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-brand-surface rounded-lg shadow-2xl p-8 w-full max-w-4xl text-brand-text relative border border-brand-muted max-h-[90vh] flex flex-col">
                <h2 className="text-2xl font-bold mb-6 text-brand-text flex items-center flex-shrink-0"><PaintBrushIcon className="w-6 h-6 mr-2"/> Visual Style Editor</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow overflow-y-auto pr-2 -mr-2">
                    {/* Predefined Styles */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Predefined Styles</h3>
                        <div className="grid grid-cols-2 gap-3 max-h-[55vh] overflow-y-auto pr-2 -mr-2">
                            {PREDEFINED_STYLES.map(style => (
                                <button
                                    key={style.name}
                                    onClick={() => setLocalStyle(style.prompt)}
                                    className="p-3 text-left bg-brand-bg border border-brand-muted rounded-md hover:border-brand-primary hover:bg-brand-primary/5 transition-all text-sm"
                                >
                                    <p className="font-semibold">{style.name}</p>
                                    <p className="text-xs text-brand-text-dim mt-1 truncate">{style.prompt}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Style Input */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Custom Style</h3>
                        <textarea
                            value={localStyle}
                            onChange={(e) => setLocalStyle(e.target.value)}
                            placeholder="Describe your desired cinematic style. Include details on color grading, mood, lighting, and camera movement."
                            className="w-full h-full min-h-[300px] md:min-h-0 p-3 bg-brand-bg border border-brand-muted rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none text-sm resize-y"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-8 flex-shrink-0">
                    <button onClick={onClose} className="py-2 px-4 rounded bg-brand-muted hover:bg-brand-muted/70 text-brand-text">Cancel</button>
                    <button onClick={() => onSave(localStyle)} className="py-2 px-4 rounded bg-brand-primary hover:bg-brand-secondary text-white font-semibold">Save Style</button>
                </div>
            </div>
        </div>
    );
};
