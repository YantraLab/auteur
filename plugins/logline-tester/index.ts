import { registerPlugin } from '../../pluginSystem/pluginRegistry';
import { DocumentTextIcon } from '../../components/icons';
import { LoglineTesterView } from './LoglineTesterView';
import type { BoardPlugin } from '../../pluginSystem/pluginTypes';

const loglineTesterPlugin: BoardPlugin = {
    type: 'PLUGIN_LOGLINE_TESTER',
    title: 'Logline Tester',
    description: 'Draft and refine your loglines.',
    icon: DocumentTextIcon,
    boardComponent: LoglineTesterView,
};

export function initializeLoglineTesterPlugin() {
    registerPlugin(loglineTesterPlugin);
}
