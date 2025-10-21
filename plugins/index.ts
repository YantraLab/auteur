import { initializeCorePlugins } from './core';
import { initializeLoglineTesterPlugin } from './logline-tester';

let arePluginsInitialized = false;

/**
 * Initializes all available plugins for the application.
 * This function should only be called once when the app starts.
 */
export function initializePlugins() {
    if (arePluginsInitialized) {
        return;
    }
    
    initializeCorePlugins();
    initializeLoglineTesterPlugin();
    
    arePluginsInitialized = true;
}
