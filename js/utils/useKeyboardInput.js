const useKeyboardInput = (onKeyChange) => {
    const [pressedKeys, setPressedKeys] = React.useState({});

    React.useEffect(() => {
        const handleKeyDown = (event) => {
            // Ignore key events if they're in an input field
            if (event.target.tagName === 'INPUT' || 
                event.target.tagName === 'TEXTAREA') {
                return;
            }

            // Prevent default behavior for game control keys
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
                event.preventDefault();
            }

            setPressedKeys(prev => {
                if (!prev[event.key]) {
                    const updated = {
                        ...prev,
                        [event.key]: true
                    };
                    onKeyChange?.(updated);
                    return updated;
                }
                return prev;
            });
        };

        const handleKeyUp = (event) => {
            setPressedKeys(prev => {
                if (prev[event.key]) {
                    const updated = {
                        ...prev,
                        [event.key]: false
                    };
                    onKeyChange?.(updated);
                    return updated;
                }
                return prev;
            });
        };

        // Handle loss of focus
        const handleBlur = () => {
            setPressedKeys(prev => {
                if (Object.values(prev).some(Boolean)) {
                    const updated = Object.keys(prev).reduce((acc, key) => {
                        acc[key] = false;
                        return acc;
                    }, {});
                    onKeyChange?.(updated);
                    return updated;
                }
                return prev;
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('blur', handleBlur);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', handleBlur);
        };
    }, [onKeyChange]);

    const isKeyPressed = React.useCallback((key) => {
        return pressedKeys[key] || false;
    }, [pressedKeys]);

    const getActiveKeys = React.useCallback(() => {
        return Object.entries(pressedKeys)
            .filter(([, pressed]) => pressed)
            .map(([key]) => key);
    }, [pressedKeys]);

    return {
        pressedKeys,
        isKeyPressed,
        getActiveKeys
    };
};

// Helper hook for handling directional input (arrows/WASD)
const useDirectionalInput = (onDirectionChange) => {
    const { pressedKeys } = useKeyboardInput();
    
    React.useEffect(() => {
        const direction = {
            up: pressedKeys['ArrowUp'] || pressedKeys['w'] || pressedKeys['W'],
            down: pressedKeys['ArrowDown'] || pressedKeys['s'] || pressedKeys['S'],
            left: pressedKeys['ArrowLeft'] || pressedKeys['a'] || pressedKeys['A'],
            right: pressedKeys['ArrowRight'] || pressedKeys['d'] || pressedKeys['D']
        };

        onDirectionChange?.(direction);
    }, [pressedKeys, onDirectionChange]);
};

// Helper hook for handling action keys
const useActionKeys = (actionMap) => {
    const { isKeyPressed } = useKeyboardInput();

    const checkAction = React.useCallback((actionName) => {
        const keys = actionMap[actionName];
        if (!keys) return false;

        if (Array.isArray(keys)) {
            return keys.some(key => isKeyPressed(key));
        }
        return isKeyPressed(keys);
    }, [isKeyPressed, actionMap]);

    return {
        checkAction
    };
};

export { useKeyboardInput, useDirectionalInput, useActionKeys };