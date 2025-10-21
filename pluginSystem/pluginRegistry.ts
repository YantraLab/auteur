import type { BoardPlugin } from './pluginTypes';

// Use a Map to store plugins, with the unique 'type' string as the key.
const plugins = new Map<string, BoardPlugin>();

/**
 * Registers a new board plugin with the application.
 * If a plugin with the same type is already registered, it will be overwritten.
 * @param plugin The board plugin object to register.
 */
export function registerPlugin(plugin: BoardPlugin) {
  plugins.set(plugin.type, plugin);
}

/**
 * Retrieves a registered plugin by its unique type identifier.
 * @param type The type of the plugin to retrieve.
 * @returns The BoardPlugin object if found, otherwise undefined.
 */
export function getPlugin(type: string): BoardPlugin | undefined {
  return plugins.get(type);
}

/**
 * Returns an array of all registered board plugins.
 * Useful for populating UI elements like the 'Add Board' menu.
 * @returns An array of BoardPlugin objects.
 */
export function getPlugins(): BoardPlugin[] {
  return Array.from(plugins.values());
}
