import { useState, useCallback, useEffect } from 'react';
import UndoManager from './UndoManager';

export const useUndo = (initialState) => {
    const [currentState, setCurrentState] = useState(initialState);

    useEffect(() => {
        // Record initial state
        UndoManager.record(initialState);
    }, []);

    const setState = useCallback((newState) => {
        setCurrentState(newState);
        UndoManager.record(newState);
    }, []);

    const undo = useCallback(() => {
        const previousState = UndoManager.undo();
        if (previousState) {
            setCurrentState(previousState);
        }
    }, []);

    const redo = useCallback(() => {
        const nextState = UndoManager.redo();
        if (nextState) {
            setCurrentState(nextState);
        }
    }, []);

    const startBatch = useCallback(() => {
        UndoManager.startBatch();
    }, []);

    const endBatch = useCallback((state) => {
        UndoManager.endBatch(state);
        if (state) {
            setCurrentState(state);
        }
    }, []);

    return {
        state: currentState,
        setState,
        undo,
        redo,
        startBatch,
        endBatch,
        canUndo: UndoManager.canUndo(),
        canRedo: UndoManager.canRedo()
    };
};

// Hook for tracking keyboard input
export const useKeyboardInput = () => {
    const [pressedKeys, setPressedKeys] = useState(new Set());

    useEffect(() => {
        const handleKeyDown = (event) => {
            setPressedKeys(prev => new Set([...prev, event.key.toLowerCase()]));
        };

        const handleKeyUp = (event) => {
            setPressedKeys(prev => {
                const next = new Set(prev);
                next.delete(event.key.toLowerCase());
                return next;
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const isKeyPressed = useCallback((key) => {
        return pressedKeys.has(key.toLowerCase());
    }, [pressedKeys]);

    const isAnyKeyPressed = useCallback(() => {
        return pressedKeys.size > 0;
    }, [pressedKeys]);

    const areKeysPressed = useCallback((keys) => {
        return keys.every(key => pressedKeys.has(key.toLowerCase()));
    }, [pressedKeys]);

    return {
        pressedKeys,
        isKeyPressed,
        isAnyKeyPressed,
        areKeysPressed
    };
};

// Hook for handling keyboard shortcuts
export const useKeyboardShortcuts = (shortcuts, deps = []) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            const key = event.key.toLowerCase();
            const ctrl = event.ctrlKey || event.metaKey;
            const shift = event.shiftKey;
            const alt = event.altKey;

            for (const [shortcut, callback] of Object.entries(shortcuts)) {
                const keys = shortcut.toLowerCase().split('+');
                const requiresCtrl = keys.includes('ctrl') || keys.includes('cmd');
                const requiresShift = keys.includes('shift');
                const requiresAlt = keys.includes('alt');
                const mainKey = keys.find(k => !['ctrl', 'cmd', 'shift', 'alt'].includes(k));

                if (key === mainKey &&
                    ctrl === requiresCtrl &&
                    shift === requiresShift &&
                    alt === requiresAlt) {
                    event.preventDefault();
                    callback(event);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, deps);
};

export default {
    useUndo,
    useKeyboardInput,
    useKeyboardShortcuts
};
