class SettingsManager {
    constructor() {
        this.settings = {
            // Display settings
            gridSize: 8,
            cellSize: 50,
            showGrid: true,
            theme: 'light',
            pixelSize: 8,
            
            // Audio settings
            masterVolume: 1.0,
            musicVolume: 0.7,
            soundVolume: 1.0,
            muteAudio: false,
            
            // Game settings
            simulationSpeed: 1000,
            autoSave: true,
            autoSaveInterval: 300000, // 5 minutes
            maxUndoSteps: 50,
            showTutorial: true,
            
            // Editor settings
            snapToGrid: true,
            showRulePreview: true,
            defaultCharacterColor: '#000000',
            showCoordinates: false,
            
            // Performance settings
            maxCharacters: 100,
            maxRulesPerCharacter: 20,
            enableAnimations: true,
            
            // Accessibility settings
            highContrast: false,
            largeText: false,
            reducedMotion: false
        };

        this.callbacks = new Map();
        this.loadSettings();
    }

    // Load settings from localStorage
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('stagecraft_settings');
            if (savedSettings) {
                this.settings = {
                    ...this.settings,
                    ...JSON.parse(savedSettings)
                };
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }

    // Save settings to localStorage
    saveSettings() {
        try {
            localStorage.setItem('stagecraft_settings', JSON.stringify(this.settings));
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    }

    // Get a setting value
    get(key) {
        return this.settings[key];
    }

    // Update a setting value
    set(key, value) {
        const oldValue = this.settings[key];
        if (oldValue === value) return;

        this.settings[key] = value;
        this.saveSettings();
        
        // Notify callbacks
        if (this.callbacks.has(key)) {
            this.callbacks.get(key).forEach(callback => {
                try {
                    callback(value, oldValue);
                } catch (error) {
                    console.error(`Error in settings callback for ${key}:`, error);
                }
            });
        }
    }

    // Update multiple settings at once
    updateSettings(updates) {
        const changes = new Map();
        
        Object.entries(updates).forEach(([key, value]) => {
            const oldValue = this.settings[key];
            if (oldValue !== value) {
                this.settings[key] = value;
                changes.set(key, { oldValue, newValue: value });
            }
        });

        if (changes.size > 0) {
            this.saveSettings();
            
            // Notify callbacks
            changes.forEach((change, key) => {
                if (this.callbacks.has(key)) {
                    this.callbacks.get(key).forEach(callback => {
                        try {
                            callback(change.newValue, change.oldValue);
                        } catch (error) {
                            console.error(`Error in settings callback for ${key}:`, error);
                        }
                    });
                }
            });
        }
    }

    // Reset settings to defaults
    resetToDefaults() {
        const oldSettings = { ...this.settings };
        this.settings = new SettingsManager().settings;
        this.saveSettings();
        
        // Notify callbacks for all changed settings
        Object.entries(this.settings).forEach(([key, value]) => {
            if (oldSettings[key] !== value && this.callbacks.has(key)) {
                this.callbacks.get(key).forEach(callback => {
                    try {
                        callback(value, oldSettings[key]);
                    } catch (error) {
                        console.error(`Error in settings callback for ${key}:`, error);
                    }
                });
            }
        });
    }

    // Subscribe to setting changes
    subscribe(key, callback) {
        if (!this.callbacks.has(key)) {
            this.callbacks.set(key, new Set());
        }
        this.callbacks.get(key).add(callback);

        // Return unsubscribe function
        return () => {
            const callbacks = this.callbacks.get(key);
            if (callbacks) {
                callbacks.delete(callback);
                if (callbacks.size === 0) {
                    this.callbacks.delete(key);
                }
            }
        };
    }

    // Export settings to file
    exportSettings() {
        const blob = new Blob([JSON.stringify(this.settings, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'stagecraft_settings.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Import settings from file
    async importSettings(file) {
        try {
            const text = await file.text();
            const newSettings = JSON.parse(text);
            this.updateSettings(newSettings);
            return true;
        } catch (error) {
            console.error('Failed to import settings:', error);
            return false;
        }
    }
}

// React hook for using SettingsManager
const useSettings = () => {
    const [settingsManager] = React.useState(() => new SettingsManager());
    const [settings, setSettings] = React.useState(settingsManager.settings);

    React.useEffect(() => {
        const unsubscribers = Object.keys(settingsManager.settings).map(key => 
            settingsManager.subscribe(key, () => {
                setSettings({ ...settingsManager.settings });
            })
        );

        return () => {
            unsubscribers.forEach(unsubscribe => unsubscribe());
        };
    }, [settingsManager]);

    const updateSetting = React.useCallback((key, value) => {
        settingsManager.set(key, value);
    }, [settingsManager]);

    const updateSettings = React.useCallback((updates) => {
        settingsManager.updateSettings(updates);
    }, [settingsManager]);

    return {
        settings,
        updateSetting,
        updateSettings,
        resetToDefaults: settingsManager.resetToDefaults.bind(settingsManager),
        exportSettings: settingsManager.exportSettings.bind(settingsManager),
        importSettings: settingsManager.importSettings.bind(settingsManager)
    };
};

export { SettingsManager, useSettings };