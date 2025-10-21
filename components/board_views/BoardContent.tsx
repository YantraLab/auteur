import React from 'react';
import type { Board as BoardType, Note, Gear, ProjectSettings } from '../../types';
import { getPlugin } from '../../pluginSystem/pluginRegistry';
import type { BoardComponentProps } from '../../pluginSystem/pluginTypes';

export const BoardContent = (props: BoardComponentProps) => {
    const { board } = props;
    const plugin = getPlugin(board.type);

    if (plugin) {
        const BoardComponent = plugin.boardComponent;
        return <BoardComponent {...props} />;
    }

    // Fallback for unregistered or legacy board types
    return <div className="text-sm text-brand-text-dim">Error: Board type '{board.type}' has no registered plugin.</div>;
};
