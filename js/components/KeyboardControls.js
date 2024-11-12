const KeyboardControls = ({ onClose }) => {
    const [controls, setControls] = React.useState({
        simulation: {
            play: 'Space',
            stop: 'Space',
            step: 'ArrowRight',
            stepBack: 'ArrowLeft',
            reset: 'R'
        },
        editor: {
            undo: 'Ctrl+Z',
            redo: 'Ctrl+Y',
            save: 'Ctrl+S',
            delete: 'Delete',
            copy: 'Ctrl+C',
            paste: 'Ctrl+V'
        },
        character: {
            moveUp: 'ArrowUp',
            moveDown: 'ArrowDown',
            moveLeft: 'ArrowLeft',
            moveRight: 'ArrowRight',
            select: 'Click',
            multiSelect: 'Shift+Click'
        },
        tools: {
            brush: 'B',
            eraser: 'E',
            fill: 'F',
            select: 'V',
            pan: 'Space+Drag'
        }
    });

    const [editingKey, setEditingKey] = React.useState(null);
    const [conflicts, setConflicts] = React.useState([]);

    const categories = [
        { id: 'simulation', label: 'Simulation Controls' },
        { id: 'editor', label: 'Editor Controls' },
        { id: 'character', label: 'Character Controls' },
        { id: 'tools', label: 'Tool Controls' }
    ];

    const handleKeyChange = (category, action, newKey) => {
        // Check for conflicts
        const newConflicts = [];
        Object.entries(controls).forEach(([cat, actions]) => {
            Object.entries(actions).forEach(([act, key]) => {
                if (key === newKey && (cat !== category || act !== action)) {
                    newConflicts.push({
                        category: cat,
                        action: act,
                        key: key
                    });
                }
            });
        });

        setConflicts(newConflicts);

        if (newConflicts.length === 0) {
            setControls(prev => ({
                ...prev,
                [category]: {
                    ...prev[category],
                    [action]: newKey
                }
            }));
        }

        setEditingKey(null);
    };

    const startEditing = (category, action) => {
        setEditingKey(`${category}.${action}`);
        setConflicts([]);
    };

    const handleKeyDown = (e, category, action) => {
        if (!editingKey) return;

        e.preventDefault();
        const key = [];

        if (e.ctrlKey) key.push('Ctrl');
        if (e.shiftKey) key.push('Shift');
        if (e.altKey) key.push('Alt');

        if (e.key !== 'Control' && e.key !== 'Shift' && e.key !== 'Alt') {
            key.push(e.key);
        }

        const keyString = key.join('+');
        handleKeyChange(category, action, keyString);
    };

    const resetToDefaults = () => {
        // Reset to default controls
        setControls({
            simulation: {
                play: 'Space',
                stop: 'Space',
                step: 'ArrowRight',
                stepBack: 'ArrowLeft',
                reset: 'R'
            },
            editor: {
                undo: 'Ctrl+Z',
                redo: 'Ctrl+Y',
                save: 'Ctrl+S',
                delete: 'Delete',
                copy: 'Ctrl+C',
                paste: 'Ctrl+V'
            },
            character: {
                moveUp: 'ArrowUp',
                moveDown: 'ArrowDown',
                moveLeft: 'ArrowLeft',
                moveRight: 'ArrowRight',
                select: 'Click',
                multiSelect: 'Shift+Click'
            },
            tools: {
                brush: 'B',
                eraser: 'E',
                fill: 'F',
                select: 'V',
                pan: 'Space+Drag'
            }
        });
        setConflicts([]);
    };

    const saveControls = () => {
        // Save controls to localStorage
        localStorage.setItem('keyboard_controls', JSON.stringify(controls));
        window.showToast?.('Keyboard controls saved successfully', 'success');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[800px] max-w-full mx-4 h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Keyboard Controls</h2>
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
                    {conflicts.length > 0 && (
                        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded">
                            <div className="font-medium mb-2">Key Conflicts Detected:</div>
                            <ul className="list-disc list-inside">
                                {conflicts.map((conflict, index) => (
                                    <li key={index}>
                                        {conflict.key} is already used for {conflict.category} - {conflict.action}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {categories.map(category => (
                        <div key={category.id} className="mb-8">
                            <h3 className="font-medium mb-4">{category.label}</h3>
                            <div className="space-y-2">
                                {Object.entries(controls[category.id]).map(([action, key]) => (
                                    <div
                                        key={action}
                                        className="flex items-center justify-between p-2 border rounded hover:bg-gray-50"
                                    >
                                        <div className="flex-1">
                                            <div className="font-medium">
                                                {action.replace(/([A-Z])/g, ' $1').trim()}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {editingKey === `${category.id}.${action}` ? (
                                                <div className="px-4 py-2 bg-blue-100 rounded text-sm">
                                                    Press any key...
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => startEditing(category.id, action)}
                                                    onKeyDown={(e) => handleKeyDown(e, category.id, action)}
                                                    className="px-4 py-2 bg-gray-100 rounded text-sm hover:bg-gray-200"
                                                >
                                                    {key}
                                                </button>
                                            )}
                                            <button
                                                onClick={() => startEditing(category.id, action)}
                                                className="text-blue-500 hover:text-blue-600"
                                            >
                                                Change
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-6 border-t flex justify-between">
                    <button
                        onClick={resetToDefaults}
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
                            onClick={saveControls}
                            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KeyboardControls;