const ThemeCustomizer = ({ onClose, onApplyTheme }) => {
    const [selectedTheme, setSelectedTheme] = React.useState('light');
    const [customColors, setCustomColors] = React.useState({
        primary: '#3B82F6',
        secondary: '#6B7280',
        accent: '#10B981',
        background: '#FFFFFF',
        text: '#1F2937'
    });
    const [gridStyle, setGridStyle] = React.useState({
        showGrid: true,
        gridColor: '#E5E7EB',
        cellSize: 50,
        borderStyle: 'solid'
    });

    const predefinedThemes = [
        {
            id: 'light',
            name: 'Light',
            colors: {
                primary: '#3B82F6',
                secondary: '#6B7280',
                accent: '#10B981',
                background: '#FFFFFF',
                text: '#1F2937'
            }
        },
        {
            id: 'dark',
            name: 'Dark',
            colors: {
                primary: '#60A5FA',
                secondary: '#9CA3AF',
                accent: '#34D399',
                background: '#1F2937',
                text: '#F3F4F6'
            }
        },
        {
            id: 'retro',
            name: 'Retro',
            colors: {
                primary: '#F59E0B',
                secondary: '#B45309',
                accent: '#D97706',
                background: '#FFFBEB',
                text: '#92400E'
            }
        },
        {
            id: 'neon',
            name: 'Neon',
            colors: {
                primary: '#F0ABFC',
                secondary: '#7C3AED',
                accent: '#10B981',
                background: '#18181B',
                text: '#E4E4E7'
            }
        }
    ];

    const handleThemeSelect = (themeId) => {
        setSelectedTheme(themeId);
        const theme = predefinedThemes.find(t => t.id === themeId);
        if (theme) {
            setCustomColors(theme.colors);
        }
    };

    const handleColorChange = (key, value) => {
        setCustomColors(prev => ({
            ...prev,
            [key]: value
        }));
        setSelectedTheme('custom');
    };

    const handleGridStyleChange = (key, value) => {
        setGridStyle(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const applyTheme = () => {
        onApplyTheme({
            colors: customColors,
            grid: gridStyle,
            themeId: selectedTheme
        });
        onClose();
    };

    const previewStyle = {
        backgroundColor: customColors.background,
        color: customColors.text,
        border: `2px solid ${customColors.primary}`,
        padding: '1rem',
        borderRadius: '0.5rem'
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[800px] max-w-full mx-4 h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Theme Customizer</h2>
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
                    {/* Predefined Themes */}
                    <div className="mb-8">
                        <h3 className="font-medium mb-4">Predefined Themes</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {predefinedThemes.map(theme => (
                                <button
                                    key={theme.id}
                                    onClick={() => handleThemeSelect(theme.id)}
                                    className={`p-4 rounded-lg border-2 transition-all ${
                                        selectedTheme === theme.id
                                            ? 'border-blue-500 shadow-lg'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    style={{
                                        backgroundColor: theme.colors.background,
                                        color: theme.colors.text
                                    }}
                                >
                                    <div className="font-medium mb-2">{theme.name}</div>
                                    <div className="flex gap-2">
                                        {Object.values(theme.colors).map((color, index) => (
                                            <div
                                                key={index}
                                                className="w-4 h-4 rounded-full"
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Colors */}
                    <div className="mb-8">
                        <h3 className="font-medium mb-4">Custom Colors</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(customColors).map(([key, value]) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium mb-2">
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={value}
                                            onChange={(e) => handleColorChange(key, e.target.value)}
                                            className="w-10 h-10 rounded cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={value}
                                            onChange={(e) => handleColorChange(key, e.target.value)}
                                            className="flex-1 p-2 border rounded"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Grid Customization */}
                    <div className="mb-8">
                        <h3 className="font-medium mb-4">Grid Style</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        checked={gridStyle.showGrid}
                                        onChange={(e) => handleGridStyleChange('showGrid', e.target.checked)}
                                        className="mr-2"
                                    />
                                    Show Grid
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Grid Color</label>
                                <input
                                    type="color"
                                    value={gridStyle.gridColor}
                                    onChange={(e) => handleGridStyleChange('gridColor', e.target.value)}
                                    className="w-full p-1 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Cell Size</label>
                                <input
                                    type="range"
                                    min="30"
                                    max="80"
                                    value={gridStyle.cellSize}
                                    onChange={(e) => handleGridStyleChange('cellSize', Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Border Style</label>
                                <select
                                    value={gridStyle.borderStyle}
                                    onChange={(e) => handleGridStyleChange('borderStyle', e.target.value)}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="solid">Solid</option>
                                    <option value="dashed">Dashed</option>
                                    <option value="dotted">Dotted</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="mb-8">
                        <h3 className="font-medium mb-4">Preview</h3>
                        <div style={previewStyle}>
                            <div className="mb-4">
                                <button
                                    style={{ backgroundColor: customColors.primary }}
                                    className="px-4 py-2 text-white rounded mr-2"
                                >
                                    Primary Button
                                </button>
                                <button
                                    style={{ backgroundColor: customColors.secondary }}
                                    className="px-4 py-2 text-white rounded mr-2"
                                >
                                    Secondary Button
                                </button>
                                <button
                                    style={{ backgroundColor: customColors.accent }}
                                    className="px-4 py-2 text-white rounded"
                                >
                                    Accent Button
                                </button>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {[1, 2, 3].map(i => (
                                    <div
                                        key={i}
                                        style={{ borderColor: customColors.primary }}
                                        className="border rounded p-4"
                                    >
                                        Sample Content {i}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-6 border-t flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={applyTheme}
                        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Apply Theme
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ThemeCustomizer;