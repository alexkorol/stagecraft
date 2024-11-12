import { LOCAL_STORAGE_KEYS, GRID_SIZES } from '../constants';
import StorageManager from './storage';
import EventManager from './EventManager';

class SettingsManager {
    constructor() {
        this.settings = this.getDefaultSettings();
        this.listeners = new Set();
        this.loadSettings();
    }

    getDefaultSettings() {
        return {
            // Grid settings
            gridSize: GRID_SIZES.SMALL,
            showGrid: true,
            showCoordinates: false,
            cellSize: 50,

            // Audio settings
            musicVolume: 0.5,
            soundVolume: 0.7,
            isMuted: false,

            // Performance settings
            performanceMode: false,
            maxFPS: 60,
            enableAnimations: true,

            // Editor settings
            autoSave: true,
            autoSaveInterval: 5 * 60 * 1000, // 5 minutes
            showRulePreview: true,
            snapToGrid: true,

            // Interface settings
            theme: 'light',
            language: 'en',
            keyboardShortcuts: true,
            showTutorialTips: true,
            interfaceScale: 1,

            // Debug settings
            showDebugInfo: false,
            enableLogging: false,
            showPerformanceStats: false,

            // Project settings
            defaultProjectName: 'Untitled Project',
            maxUndoSteps: 50,
            maxRecentProjects: 10
        };
    }

    async loadSettings() {
        try {
            const savedSettings = await StorageManager.load(LOCAL_STORAGE_KEYS.SETTINGS);
            if (savedSettings) {
                this.settings = {
                    ...this.getDefaultSettings(),
                    ...savedSettings
                };
                this.notifyListeners();
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }

    async saveSettings() {
        try {
            await StorageManager.save(LOCAL_STORAGE_KEYS.SETTINGS, this.settings);
            this.notifyListeners();
            return true;
        } catch (error) {
            console.error('Failed to save settings:', error);
            return false;
        }
    }

    // Update a single setting
    async updateSetting(key, value) {
        if (!(key in this.settings)) {
            console.warn(`Unknown setting: ${key}`);
            return false;
        }

        this.settings[key] = value;
        await this.saveSettings();
        
        // Emit specific event for this setting change
        EventManager.emit(`setting:${key}`, value);
        
        return true;
    }

    // Update multiple settings at once
    async updateSettings(newSettings) {
        Object.assign(this.settings, newSettings);
        return await this.saveSettings();
    }

    // Get a single setting
    getSetting(key) {
        return this.settings[key];
    }

    // Get all settings
    getAllSettings() {
        return { ...this.settings };
    }

    // Reset all settings to defaults
    async resetSettings() {
        this.settings = this.getDefaultSettings();
        return await this.saveSettings();
    }

    // Reset a specific setting to its default value
    async resetSetting(key) {
        if (!(key in this.settings)) {
            console.warn(`Unknown setting: ${key}`);
            return false;
        }

        this.settings[key] = this.getDefaultSettings()[key];
        return await this.saveSettings();
    }

    // Subscribe to settings changes
    subscribe(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    // Notify all listeners of settings changes
    notifyListeners() {
        this.listeners.forEach(callback => callback(this.settings));
    }

    // Export settings to JSON
    exportSettings() {
        return JSON.stringify(this.settings, null, 2);
    }

    // Import settings from JSON
    async importSettings(json) {
        try {
            const newSettings = JSON.parse(json);
            this.settings = {
                ...this.getDefaultSettings(),
                ...newSettings
            };
            return await this.saveSettings();
        } catch (error) {
            console.error('Failed to import settings:', error);
            return false;
        }
    }

    // Validate a setting value
    validateSetting(key, value) {
        switch (key) {
            case 'gridSize':
                return Object.values(GRID_SIZES).some(size => 
                    size.width === value.width && size.height === value.height
                );
            case 'musicVolume':
            case 'soundVolume':
            case 'interfaceScale':
                return typeof value === 'number' && value >= 0 && value <= 1;
            case 'maxFPS':
                return typeof value === 'number' && value >= 30 && value <= 144;
            case 'autoSaveInterval':
                return typeof value === 'number' && value >= 60000; // minimum 1 minute
            case 'theme':
                return ['light', 'dark', 'system'].includes(value);
            case 'language':
                return typeof value === 'string' && value.length === 2;
            default:
                return true;
        }
    }

    // Get settings schema (for validation and UI generation)
    getSettingsSchema() {
        return {
            gridSize: {
                type: 'select',
                options: Object.values(GRID_SIZES),
                label: 'Grid Size',
                category: 'grid'
            },
            showGrid: {
                type: 'boolean',
                label: 'Show Grid Lines',
                category: 'grid'
            },
            // ... define schema for all settings
        };
    }
}

export default new SettingsManager();
