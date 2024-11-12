const useDragAndDrop = ({ onDrop, onDragStart, onDragEnd, gridSize }) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const [draggedItem, setDraggedItem] = React.useState(null);
    const [dragPosition, setDragPosition] = React.useState({ x: 0, y: 0 });
    const gridRef = React.useRef(null);

    // Calculate grid cell position from mouse coordinates
    const getGridPosition = React.useCallback((clientX, clientY) => {
        if (!gridRef.current) return null;

        const rect = gridRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const cellSize = rect.width / gridSize;
        const gridX = Math.floor(x / cellSize);
        const gridY = Math.floor(y / cellSize);

        if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
            return { x: gridX, y: gridY };
        }

        return null;
    }, [gridSize]);

    const handleDragStart = React.useCallback((item, event) => {
        setIsDragging(true);
        setDraggedItem(item);
        setDragPosition({
            x: event.clientX,
            y: event.clientY
        });
        onDragStart?.(item);

        // Prevent default drag ghost image
        if (event.dataTransfer) {
            const emptyImg = document.createElement('img');
            event.dataTransfer.setDragImage(emptyImg, 0, 0);
        }
    }, [onDragStart]);

    const handleDrag = React.useCallback((event) => {
        if (!isDragging) return;

        setDragPosition({
            x: event.clientX,
            y: event.clientY
        });

        const position = getGridPosition(event.clientX, event.clientY);
        if (position) {
            // Update visual feedback
            const cell = document.elementFromPoint(event.clientX, event.clientY);
            if (cell?.classList.contains('grid-cell')) {
                cell.classList.add('drag-over');
            }
        }
    }, [isDragging, getGridPosition]);

    const handleDragEnd = React.useCallback((event) => {
        if (!isDragging) return;

        const position = getGridPosition(event.clientX, event.clientY);
        if (position && draggedItem) {
            onDrop?.(draggedItem, position);
        }

        // Clean up
        setIsDragging(false);
        setDraggedItem(null);
        onDragEnd?.();

        // Remove visual feedback
        document.querySelectorAll('.grid-cell').forEach(cell => {
            cell.classList.remove('drag-over');
        });
    }, [isDragging, draggedItem, getGridPosition, onDrop, onDragEnd]);

    // Handle touch events for mobile
    const handleTouchStart = React.useCallback((item, event) => {
        const touch = event.touches[0];
        handleDragStart(item, {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
    }, [handleDragStart]);

    const handleTouchMove = React.useCallback((event) => {
        event.preventDefault();
        const touch = event.touches[0];
        handleDrag({
            clientX: touch.clientX,
            clientY: touch.clientY
        });
    }, [handleDrag]);

    const handleTouchEnd = React.useCallback((event) => {
        const touch = event.changedTouches[0];
        handleDragEnd({
            clientX: touch.clientX,
            clientY: touch.clientY
        });
    }, [handleDragEnd]);

    React.useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('mouseup', handleDragEnd);
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd);
        }

        return () => {
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', handleDragEnd);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging, handleDrag, handleDragEnd, handleTouchMove, handleTouchEnd]);

    return {
        isDragging,
        draggedItem,
        dragPosition,
        gridRef,
        handlers: {
            onDragStart: handleDragStart,
            onTouchStart: handleTouchStart
        }
    };
};

// Helper component for drag preview
const DragPreview = ({ item, position, gridSize }) => {
    if (!item || !position) return null;

    return (
        <div
            style={{
                position: 'fixed',
                left: position.x,
                top: position.y,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: 1000,
                opacity: 0.8,
                width: `${100 / gridSize}%`,
                height: `${100 / gridSize}%`
            }}
        >
            {/* Render your dragged item preview here */}
            {item.sprite && (
                <div
                    className="grid"
                    style={{
                        gridTemplateColumns: `repeat(${SPRITE_GRID_SIZE}, 1fr)`
                    }}
                >
                    {item.sprite.map((row, y) =>
                        row.map((color, x) => (
                            <div
                                key={`${x}-${y}`}
                                style={{ backgroundColor: color }}
                                className="w-full h-full"
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export { useDragAndDrop, DragPreview };