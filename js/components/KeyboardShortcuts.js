const KeyboardShortcuts = ({ onClose }) => {
    const shortcuts = [
        {
            key: 'Space',
            description: 'Play/Pause simulation',
            category: 'Simulation'
        },
        {
            key: 'Esc',
            description: 'Stop simulation/Close modal',
            category: 'General'
        },
        {
            key: 'Ctrl + S',
            description: 'Save project',
            category: 'Project'
        },
        {
            key: 'Ctrl + Z',
            description: 'Undo last action',
            category: 'Edit'
        },
        {
            key: 'Ctrl + Y',
            description: 'Redo last action',
            category: 'Edit'
        },
        {
            key: 'Delete',
            description: 'Delete selected character/rule',
            category: 'Edit'
        },
        {
            key: 'Ctrl + N',
            description: 'New project',
            category: 'Project'
        },
        {
            key: 'Ctrl + O',
            description: 'Open project',
            category: 'Project'
        },
        {
            key: '1-9',
            description: 'Select color from palette',
            category: 'Sprite Editor'
        },
        {
            key: 'B',
            description: 'Brush tool',
            category: 'Sprite Editor'
        },
        {
            key: 'F',
            description: 'Fill tool',
            category: 'Sprite Editor'
        },
        {
            key: 'E',
            description: 'Eraser tool',
            category: 'Sprite Editor'
        }
    ];

    // Group shortcuts by category
    const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
        if (!acc[shortcut.category]) {
            acc[shortcut.category] = [];
        }
        acc[shortcut.category].push(shortcut);
        return acc;
    }, {});

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Keyboard Shortcuts</h2>
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

                <div className="space-y-6">
                    {Object.entries(groupedShortcuts).map(([category, shortcuts]) => (
                        <div key={category}>
                            <h3 className="text-lg font-semibold mb-3 text-gray-700">
                                {category}
                            </h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {shortcuts.map((shortcut, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between"
                                        >
                                            <span className="text-gray-600">
                                                {shortcut.description}
                                            </span>
                                            <kbd className="px-2 py-1 bg-white rounded border border-gray-300 shadow-sm text-sm font-mono">
                                                {shortcut.key}
                                            </kbd>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 text-center text-gray-500 text-sm">
                    Press '?' anywhere to show this shortcuts menu
                </div>
            </div>
        </div>
    );
};

// Hook to handle keyboard shortcuts
const useKeyboardShortcuts = (handlers) => {
    React.useEffect(() => {
        const handleKeyDown = (event) => {
            // Show shortcuts menu when pressing '?'
            if (event.key === '?' && !event.ctrlKey && !event.metaKey) {
                handlers.showShortcuts?.();
                return;
            }

            // Handle other shortcuts
            if (event.ctrlKey || event.metaKey) {
                switch (event.key.toLowerCase()) {
                    case 's':
                        event.preventDefault();
                        handlers.save?.();
                        break;
                    case 'z':
                        event.preventDefault();
                        handlers.undo?.();
                        break;
                    case 'y':
                        event.preventDefault();
                        handlers.redo?.();
                        break;
                    case 'n':
                        event.preventDefault();
                        handlers.new?.();
                        break;
                    case 'o':
                        event.preventDefault();
                        handlers.open?.();
                        break;
                }
            } else {
                switch (event.key) {
                    case ' ':
                        event.preventDefault();
                        handlers.toggleSimulation?.();
                        break;
                    case 'Escape':
                        handlers.escape?.();
                        break;
                    case 'Delete':
                        handlers.delete?.();
                        break;
                    case 'b':
                        handlers.selectBrush?.();
                        break;
                    case 'f':
                        handlers.selectFill?.();
                        break;
                    case 'e':
                        handlers.selectEraser?.();
                        break;
                }

                // Handle number keys for color selection
                if (!isNaN(event.key) && event.key !== ' ') {
                    const colorIndex = parseInt(event.key) - 1;
                    handlers.selectColor?.(colorIndex);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlers]);
};

export { KeyboardShortcuts, useKeyboardShortcuts };