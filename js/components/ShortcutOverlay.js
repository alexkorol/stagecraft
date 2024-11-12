```javascript
const ShortcutOverlay = ({ onClose }) => {
    const shortcuts = [
        {
            category: 'General',
            items: [
                { key: '?', description: 'Show/Hide Help' },
                { key: 'Esc', description: 'Close Modal/Cancel Action' },
                { key: 'Ctrl + S', description: 'Save Project' },
                { key: 'Ctrl + Z', description: 'Undo' },
                { key: 'Ctrl + Y', description: 'Redo' },
                { key: 'Ctrl + N', description: 'New Project' },
                { key: 'Ctrl + O', description: 'Open Project' }
            ]
        },
        {
            category: 'Simulation',
            items: [
                { key: 'Space', description: 'Play/Pause Simulation' },
                { key: 'R', description: 'Reset Simulation' },
                { key: 'Right Arrow', description: 'Step Forward' },
                { key: 'Left Arrow', description: 'Step Backward' },
                { key: '+', description: 'Increase Speed' },
                { key: '-', description: 'Decrease Speed' }
            ]
        },
        {
            category: 'Editor',
            items: [
                { key: 'Del', description: 'Delete Selected' },
                { key: 'C', description: 'Copy Selected' },
                { key: 'V', description: 'Paste' },
                { key: 'G', description: 'Toggle Grid' },
                { key: 'T', description: 'Toggle Coordinates' }
            ]
        },
        {
            category: 'Sprite Editor',
            items: [
                { key: 'B', description: 'Brush Tool' },
                { key: 'E', description: 'Eraser Tool' },
                { key: 'F', description: 'Fill Tool' },
                { key: '1-9', description: 'Select Color' },
                { key: '[', description: 'Decrease Brush Size' },
                { key: ']', description: 'Increase Brush Size' }
            ]
        },
        {
            category: 'Character Control',
            items: [
                { key: 'Arrow Keys', description: 'Move Selected Character' },
                { key: 'Tab', description: 'Next Character' },
                { key: 'Shift + Tab', description: 'Previous Character' },
                { key: 'Alt + Click', description: 'Copy Character' },
                { key: 'Shift + Click', description: 'Multi-Select' }
            ]
        }
    ];

    const renderShortcut = (shortcut) => (
        <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
                {shortcut.key.split(' + ').map((key, index) => (
                    <React.Fragment key={index}>
                        <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm font-mono">
                            {key}
                        </kbd>
                        {index < shortcut.key.split(' + ').length - 1 && (
                            <span className="text-gray-400">+</span>
                        )}
                    </React.Fragment>
                ))}
            </div>
            <span className="text-gray-600">{shortcut.description}</span>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {shortcuts.map(category => (
                        <div key={category.category}>
                            <h3 className="font-bold mb-2 text-gray-700">
                                {category.category}
                            </h3>
                            <div className="space-y-1">
                                {category.items.map((shortcut, index) => (
                                    <div key={index}>
                                        {renderShortcut(shortcut)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-6 border-t text-center text-sm text-gray-500">
                    Press '?' anywhere to show this shortcuts overlay
                </div>
            </div>
        </div>
    );
};

// Hook for handling keyboard shortcuts
const useKeyboardShortcuts = (handlers) => {
    React.useEffect(() => {
        const handleKeyDown = (event) => {
            // Don't trigger shortcuts when typing in input fields
            if (event.target.tagName === 'INPUT' || 
                event.target.tagName === 'TEXTAREA') {
                return;
            }

            const { key, ctrlKey, shiftKey, altKey } = event;

            // Show shortcuts overlay
            if (key === '?' && !ctrlKey && !shiftKey && !altKey) {
                handlers.showShortcuts?.();
                return;
            }

            // General shortcuts
            if (ctrlKey) {
                switch (key.toLowerCase()) {
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
                return;
            }

            // Simulation controls
            switch (key) {
                case ' ':
                    event.preventDefault();
                    handlers.toggleSimulation?.();
                    break;
                case 'r':
                    handlers.resetSimulation?.();
                    break;
                case 'ArrowRight':
                    if (!shiftKey) handlers.stepForward?.();
                    break;
                case 'ArrowLeft':
                    if (!shiftKey) handlers.stepBackward?.();
                    break;
                case '+':
                case '=':
                    handlers.increaseSpeed?.();
                    break;
                case '-':
                case '_':
                    handlers.decreaseSpeed?.();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlers]);
};

export { ShortcutOverlay, useKeyboardShortcuts };
```
