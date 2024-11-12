const useKeyboardShortcuts = (handlers) => {
    React.useEffect(() => {
        const handleKeyDown = (event) => {
            // Don't trigger shortcuts when typing in input fields
            if (event.target.tagName === 'INPUT' || 
                event.target.tagName === 'TEXTAREA') {
                return;
            }

            const { key, ctrlKey, shiftKey } = event;

            // Show help with '?'
            if (key === '?' && !ctrlKey && !shiftKey) {
                handlers.showHelp?.();
                return;
            }

            // Simulation controls
            if (key === ' ') {
                event.preventDefault();
                handlers.toggleSimulation?.();
                return;
            }

            // Global shortcuts with Ctrl
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
                }
                return;
            }

            // Tool shortcuts
            switch (key.toLowerCase()) {
                case 'b':
                    handlers.selectTool?.('pencil');
                    break;
                case 'e':
                    handlers.selectTool?.('eraser');
                    break;
                case 'f':
                    handlers.selectTool?.('fill');
                    break;
                case 'delete':
                case 'backspace':
                    handlers.delete?.();
                    break;
            }

            // Arrow key navigation
            if (key.startsWith('Arrow')) {
                event.preventDefault();
                handlers.handleArrowKey?.(key.replace('Arrow', '').toLowerCase());
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlers]);
};

// Helper hook for handling directional input (arrows/WASD)
const useDirectionalInput = (onDirectionChange) => {
    const [directions, setDirections] = React.useState({
        up: false,
        down: false,
        left: false,
        right: false
    });

    React.useEffect(() => {
        const handleKeyDown = (event) => {
            const key = event.key.toLowerCase();
            const direction = {
                w: 'up',
                s: 'down',
                a: 'left',
                d: 'right',
                arrowup: 'up',
                arrowdown: 'down',
                arrowleft: 'left',
                arrowright: 'right'
            }[key];

            if (direction) {
                setDirections(prev => {
                    const next = { ...prev, [direction]: true };
                    onDirectionChange?.(next);
                    return next;
                });
            }
        };

        const handleKeyUp = (event) => {
            const key = event.key.toLowerCase();
            const direction = {
                w: 'up',
                s: 'down',
                a: 'left',
                d: 'right',
                arrowup: 'up',
                arrowdown: 'down',
                arrowleft: 'left',
                arrowright: 'right'
            }[key];

            if (direction) {
                setDirections(prev => {
                    const next = { ...prev, [direction]: false };
                    onDirectionChange?.(next);
                    return next;
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [onDirectionChange]);

    return directions;
};

export { useKeyboardShortcuts, useDirectionalInput };