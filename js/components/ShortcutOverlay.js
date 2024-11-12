```javascript
import React, { useState, useEffect } from 'react';
import { X, Keyboard } from 'lucide-react';
import { KEY_BINDINGS } from '../constants';
import { formatKeyBinding } from '../utils/KeyboardControls';

const ShortcutOverlay = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Show shortcuts overlay when user presses '?' with shift
            if (e.key === '?' && e.shiftKey) {
                e.preventDefault();
                setIsVisible(prev => !prev);
            }
            // Hide on Escape
            if (e.key === 'Escape' && isVisible) {
                setIsVisible(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isVisible]);

    const shortcutCategories = {
        'Simulation Controls': {
            'Play/Pause': KEY_BINDINGS.PLAY_PAUSE,
            'Step Forward': KEY_BINDINGS.STEP,
            'Reset Simulation': KEY_BINDINGS.RESET
        },
        'Character Controls': {
            'New Character': KEY_BINDINGS.NEW_CHARACTER,
            'Delete Selected': KEY_BINDINGS.DELETE
        },
        'Editor Controls': {
            'Undo': KEY_BINDINGS.UNDO,
            'Redo': KEY_BINDINGS.REDO,
            'Save Project': KEY_BINDINGS.SAVE
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                            <Keyboard className="w-6 h-6" />
                            <h2 className="text-xl font-semibold">Keyboard Shortcuts</h2>
                        </div>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {Object.entries(shortcutCategories).map(([category, shortcuts]) => (
                            <div key={category}>
                                <h3 className="font-medium text-gray-900 mb-3">
                                    {category}
                                </h3>
                                <div className="bg-gray-50 rounded-lg">
                                    {Object.entries(shortcuts).map(([action, shortcut], index) => (
                                        <div 
                                            key={action}
                                            className={`
                                                flex justify-between items-center px-4 py-2
                                                ${index !== 0 ? 'border-t border-gray-200' : ''}
                                            `}
                                        >
                                            <span className="text-sm text-gray-600">
                                                {action}
                                            </span>
                                            <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">
                                                {formatKeyBinding(shortcut)}
                                            </kbd>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 text-sm text-gray-500 flex items-center justify-center">
                        <span>Press</span>
                        <kbd className="mx-1 px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">
                            shift + ?
                        </kbd>
                        <span>to toggle shortcuts overlay</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper component for the shortcut button in the main UI
const ShortcutButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsVisible(true)}
                className="p-2 rounded hover:bg-gray-100 flex items-center gap-2 text-sm"
                title="Show Keyboard Shortcuts"
            >
                <Keyboard className="w-4 h-4" />
                <span>Shortcuts</span>
            </button>
            {isVisible && <ShortcutOverlay onClose={() => setIsVisible(false)} />}
        </>
    );
};

export { ShortcutOverlay, ShortcutButton };
```
