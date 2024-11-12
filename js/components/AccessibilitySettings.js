const AccessibilitySettings = ({ onClose, onApplySettings }) => {
    const [settings, setSettings] = React.useState({
        // Visual Settings
        highContrast: false,
        largeText: false,
        reducedMotion: false,
        colorBlindMode: 'none',
        
        // Audio Settings
        screenReader: false,
        soundEffects: true,
        soundVolume: 100,
        
        // Input Settings
        keyboardOnly: false,
        mouseOnly: false,
        autoClick: false,
        clickDelay: 500,
        
        // Helper Settings
        showTooltips: true,
        tooltipDelay: 500,
        showCaptions: false,
        autoSave: true
    });

    const colorBlindModes = [
        { id: 'none', name: 'None' },
        { id: 'protanopia', name: 'Protanopia (Red-Blind)' },
        { id: 'deuteranopia', name: 'Deuteranopia (Green-Blind)' },
        { id: 'tritanopia', name: 'Tritanopia (Blue-Blind)' },
        { id: 'achromatopsia', name: 'Achromatopsia (No Color)' }
    ];

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const applySettings = () => {
        onApplySettings(settings);
        onClose();
    };

    const resetSettings = () => {
        setSettings({
            highContrast: false,
            largeText: false,
            reducedMotion: false,
            colorBlindMode: 'none',
            screenReader: false,
            soundEffects: true,
            soundVolume: 100,
            keyboardOnly: false,
            mouseOnly: false,
            autoClick: false,
            clickDelay: 500,
            showTooltips: true,
            tooltipDelay: 500,
            showCaptions: false,
            autoSave: true
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[800px] max-w-full mx-4 h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Accessibility Settings</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {/* Visual Settings */}
                    <div className="mb-8">
                        <h3 className="font-medium mb-4">Visual Settings</h3>
                        <div className="space-y-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings.highContrast}
                                    onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
                                    className="mr-2"
                                />
                                High Contrast Mode
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings.largeText}
                                    onChange={(e) => handleSettingChange('largeText', e.target.checked)}
                                    className="mr-2"
                                />
                                Large Text
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings.reducedMotion}
                                    onChange={(e) => handleSettingChange('reducedMotion', e.target.checked)}
                                    className="mr-2"
                                />
                                Reduced Motion
                            </label>
                            <div>
                                <label className="block text-sm font-medium mb-2">Color Blind Mode</label>
                                <select
                                    value={settings.colorBlindMode}
                                    onChange={(e) => handleSettingChange('colorBlindMode', e.target.value)}
                                    className="w-full p-2 border rounded"
                                >
                                    {colorBlindModes.map(mode => (
                                        <option key={mode.id} value={mode.id}>
                                            {mode.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Audio Settings */}
                    <div className="mb-8">
                        <h3 className="font-medium mb-4">Audio Settings</h3>
                        <div className="space-y-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings.screenReader}
                                    onChange={(e) => handleSettingChange('screenReader', e.target.checked)}
                                    className="mr-2"
                                />
                                Screen Reader Support
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings.soundEffects}
                                    onChange={(e) => handleSettingChange('soundEffects', e.target.checked)}
                                    className="mr-2"
                                />
                                Sound Effects
                            </label>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Sound Volume: {settings.soundVolume}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={settings.soundVolume}
                                    onChange={(e) => handleSettingChange('soundVolume', Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Input Settings */}
                    <div className="mb-8">
                        <h3 className="font-medium mb-4">Input Settings</h3>
                        <div className="space-y-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings.keyboardOnly}
                                    onChange={(e) => handleSettingChange('keyboardOnly', e.target.checked)}
                                    className="mr-2"
                                />
                                Keyboard Only Mode
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings.mouseOnly}
                                    onChange={(e) => handleSettingChange('mouseOnly', e.target.checked)}
                                    className="mr-2"
                                />
                                Mouse Only Mode
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings.autoClick}
                                    onChange={(e) => handleSettingChange('autoClick', e.target.checked)}
                                    className="mr-2"
                                />
                                Auto Click
                            </label>
                            {settings.autoClick && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Click Delay (ms): {settings.clickDelay}
                                    </label>
                                    <input
                                        type="range"
                                        min="100"
                                        max="2000"
                                        step="100"
                                        value={settings.clickDelay}
                                        onChange={(e) => handleSettingChange('clickDelay', Number(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Helper Settings */}
                    <div className="mb-8">
                        <h3 className="font-medium mb-4">Helper Settings</h3>
                        <div className="space-y-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings.showTooltips}
                                    onChange={(e) => handleSettingChange('showTooltips', e.target.checked)}
                                    className="mr-2"
                                />
                                Show Tooltips
                            </label>
                            {settings.showTooltips && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Tooltip Delay (ms): {settings.tooltipDelay}
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="2000"
                                        step="100"
                                        value={settings.tooltipDelay}
                                        onChange={(e) => handleSettingChange('tooltipDelay', Number(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                            )}
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings.showCaptions}
                                    onChange={(e) => handleSettingChange('showCaptions', e.target.checked)}
                                    className="mr-2"
                                />
                                Show Captions
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings.autoSave}
                                    onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                                    className="mr-2"
                                />
                                Auto Save
                            </label>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-6 border-t flex justify-between">
                    <button
                        onClick={resetSettings}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Reset to Defaults
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={applySettings}
                            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Apply Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccessibilitySettings;