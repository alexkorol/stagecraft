const Settings = ({ onClose }) => {
    const { settings, updateSetting, updateSettings, resetToDefaults, exportSettings, importSettings } = useSettings();
    const fileInputRef = React.useRef();
    const [activeTab, setActiveTab] = React.useState('display');

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = async (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const success = await importSettings(file);
            if (success) {
                window.showToast?.('Settings imported successfully', 'success');
            } else {
                window.showToast?.('Failed to import settings', 'error');
            }
        }
    };

    const tabs = [
        { id: 'display', label: 'Display' },
        { id: 'audio', label: 'Audio' },
        { id: 'game', label: 'Game' },
        { id: 'editor', label: 'Editor' },
        { id: 'performance', label: 'Performance' },
        { id: 'accessibility', label: 'Accessibility' }
    ];

    const renderDisplaySettings = () => (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Grid Size</label>
                <select
                    value={settings.gridSize}
                    onChange={(e) => updateSetting('gridSize', Number(e.target.value))}
                    className="w-full p-2 border rounded"
                >
                    {[6, 8, 10, 12, 16].map(size => (
                        <option key={size} value={size}>{size}x{size}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Cell Size</label>
                <input
                    type="range"
                    min="30"
                    max="80"
                    value={settings.cellSize}
                    onChange={(e) => updateSetting('cellSize', Number(e.target.value))}
                    className="w-full"
                />
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Show Grid</span>
                <input
                    type="checkbox"
                    checked={settings.showGrid}
                    onChange={(e) => updateSetting('showGrid', e.target.checked)}
                    className="w-5 h-5"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Theme</label>
                <select
                    value={settings.theme}
                    onChange={(e) => updateSetting('theme', e.target.value)}
                    className="w-full p-2 border rounded"
                >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>
            </div>
        </div>
    );

    const renderAudioSettings = () => (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Master Volume</label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.masterVolume * 100}
                    onChange={(e) => updateSetting('masterVolume', Number(e.target.value) / 100)}
                    className="w-full"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Music Volume</label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.musicVolume * 100}
                    onChange={(e) => updateSetting('musicVolume', Number(e.target.value) / 100)}
                    className="w-full"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Sound Effects Volume</label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.soundVolume * 100}
                    onChange={(e) => updateSetting('soundVolume', Number(e.target.value) / 100)}
                    className="w-full"
                />
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Mute Audio</span>
                <input
                    type="checkbox"
                    checked={settings.muteAudio}
                    onChange={(e) => updateSetting('muteAudio', e.target.checked)}
                    className="w-5 h-5"
                />
            </div>
        </div>
    );

    const renderGameSettings = () => (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Simulation Speed</label>
                <select
                    value={settings.simulationSpeed}
                    onChange={(e) => updateSetting('simulationSpeed', Number(e.target.value))}
                    className="w-full p-2 border rounded"
                >
                    <option value={2000}>Slow</option>
                    <option value={1000}>Normal</option>
                    <option value={500}>Fast</option>
                    <option value={250}>Very Fast</option>
                </select>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Auto Save</span>
                <input
                    type="checkbox"
                    checked={settings.autoSave}
                    onChange={(e) => updateSetting('autoSave', e.target.checked)}
                    className="w-5 h-5"
                />
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Show Tutorial</span>
                <input
                    type="checkbox"
                    checked={settings.showTutorial}
                    onChange={(e) => updateSetting('showTutorial', e.target.checked)}
                    className="w-5 h-5"
                />
            </div>
        </div>
    );

    const renderEditorSettings = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Snap to Grid</span>
                <input
                    type="checkbox"
                    checked={settings.snapToGrid}
                    onChange={(e) => updateSetting('snapToGrid', e.target.checked)}
                    className="w-5 h-5"
                />
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Show Rule Preview</span>
                <input
                    type="checkbox"
                    checked={settings.showRulePreview}
                    onChange={(e) => updateSetting('showRulePreview', e.target.checked)}
                    className="w-5 h-5"
                />
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Show Coordinates</span>
                <input
                    type="checkbox"
                    checked={settings.showCoordinates}
                    onChange={(e) => updateSetting('showCoordinates', e.target.checked)}
                    className="w-5 h-5"
                />
            </div>
        </div>
    );

    const renderPerformanceSettings = () => (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Max Characters</label>
                <input
                    type="number"
                    min="10"
                    max="1000"
                    value={settings.maxCharacters}
                    onChange={(e) => updateSetting('maxCharacters', Number(e.target.value))}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Max Rules per Character</label>
                <input
                    type="number"
                    min="5"
                    max="100"
                    value={settings.maxRulesPerCharacter}
                    onChange={(e) => updateSetting('maxRulesPerCharacter', Number(e.target.value))}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Enable Animations</span>
                <input
                    type="checkbox"
                    checked={settings.enableAnimations}
                    onChange={(e) => updateSetting('enableAnimations', e.target.checked)}
                    className="w-5 h-5"
                />
            </div>
        </div>
    );

    const renderAccessibilitySettings = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">High Contrast</span>
                <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(e) => updateSetting('highContrast', e.target.checked)}
                    className="w-5 h-5"
                />
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Large Text</span>
                <input
                    type="checkbox"
                    checked={settings.largeText}
                    onChange={(e) => updateSetting('largeText', e.target.checked)}
                    className="w-5 h-5"
                />
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Reduced Motion</span>
                <input
                    type="checkbox"
                    checked={settings.reducedMotion}
                    onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                    className="w-5 h-5"
                />
            </div>
        </div>
    );

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'display':
                return renderDisplaySettings();
            case 'audio':
                return renderAudioSettings();
            case 'game':
                return renderGameSettings();
            case 'editor':
                return renderEditorSettings();
            case 'performance':
                return renderPerformanceSettings();
            case 'accessibility':
                return renderAccessibilitySettings();
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Settings</h2>
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

                <div className="flex mb-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`px-4 py-2 ${
                                activeTab === tab.id
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="mb-6">
                    {renderActiveTab()}
                </div>

                <div className="flex justify-between pt-4 border-t">
                    <div>
                        <button
                            onClick={resetToDefaults}
                            className="px-4 py-2 text-red-500 hover:text-red-600"
                        >
                            Reset to Defaults
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleImportClick}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Import
                        </button>
                        <button
                            onClick={exportSettings}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Export
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Save & Close
                        </button>
                    </div>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleFileSelect}
                />
            </div>
        </div>
    );
};

export default Settings;