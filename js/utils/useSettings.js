import { useState, useEffect, useCallback } from 'react';
import SettingsManager from './SettingsManager';

export const useSettings = (keys = null) => {
    // If keys is provided, only track those specific settings
    const [settings, setSettings] = useState(() => 
        keys 
            ? Object.fromEntries(keys.map(key => [key, SettingsManager.getSetting(key)]))
            : SettingsManager.getAllSettings()
    );

    useEffect(() => {
        // Subscribe to settings changes
        const unsubscribe = SettingsManager.subscribe((newSettings) => {
            if (keys) {
                // Only update tracked settings
                setSettings(prev => {
                    const updates = {};
                    let hasChanges = false;
                    keys.forEach(key => {
                        if (prev[key] !== newSettings[key]) {
                            updates[key] = newSettings[key];
                            hasChanges = true;
                        }
                    });
                    return hasChanges ? { ...prev, ...updates } : prev;
                });
            } else {
                // Update all settings
                setSettings(newSettings);
            }
        });

        return unsubscribe;
    }, [keys]);

    const updateSetting = useCallback(async (key, value) => {
        if (SettingsManager.validateSetting(key, value)) {
            return await SettingsManager.updateSetting(key, value);
        }
        return false;
    }, []);

    const updateSettings = useCallback(async (updates) => {
        // Validate all updates before applying
        const isValid = Object.entries(updates).every(([key, value]) => 
            SettingsManager.validateSetting(key, value)
        );

        if (isValid) {
            return await SettingsManager.updateSettings(updates);
        }
        return false;
    }, []);

    const resetSetting = useCallback(async (key) => {
        return await SettingsManager.resetSetting(key);
    }, []);

    const resetAllSettings = useCallback(async () => {
        return await SettingsManager.resetSettings();
    }, []);

    const exportSettings = useCallback(() => {
        const settingsJson = SettingsManager.exportSettings();
        const blob = new Blob([settingsJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'stagecraft_settings.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, []);

    const importSettings = useCallback(async (file) => {
        try {
            const text = await file.text();
            return await SettingsManager.importSettings(text);
        } catch (error) {
            console.error('Failed to import settings:', error);
            return false;
        }
    }, []);

    return {
        settings,
        updateSetting,
        updateSettings,
        resetSetting,
        resetAllSettings,
        exportSettings,
        importSettings,
        // Helper functions for specific settings types
        setTheme: useCallback((theme) => updateSetting('theme', theme), [updateSetting]),
        setGridSize: useCallback((size) => updateSetting('gridSize', size), [updateSetting]),
        setVolume: useCallback((volume) => updateSetting('masterVolume', volume), [updateSetting]),
        toggleMute: useCallback(() => 
            updateSetting('isMuted', !settings.isMuted), 
            [updateSetting, settings.isMuted]
        ),
        toggleGrid: useCallback(() => 
            updateSetting('showGrid', !settings.showGrid),
            [updateSetting, settings.showGrid]
        ),
        toggleCoordinates: useCallback(() => 
            updateSetting('showCoordinates', !settings.showCoordinates),
            [updateSetting, settings.showCoordinates]
        ),
        // Validation helpers
        isValidSetting: useCallback((key, value) => 
            SettingsManager.validateSetting(key, value),
            []
        ),
        getSettingsSchema: useCallback(() => 
            SettingsManager.getSettingsSchema(),
            []
        )
    };
};

// Hook for using a single setting
export const useSetting = (key) => {
    const { settings, updateSetting } = useSettings([key]);
    return [settings[key], (value) => updateSetting(key, value)];
};

export default {
    useSettings,
    useSetting
};