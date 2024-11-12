import { useState, useCallback, useRef } from 'react';

export const useDragAndDrop = ({
    onDragStart,
    onDragEnd,
    onDrop,
    canDrag = () => true,
    canDrop = () => true
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const dragDataRef = useRef(null);

    const handleDragStart = useCallback((e, data) => {
        if (!canDrag(data)) return;

        // Store initial mouse position
        const rect = e.currentTarget.getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });

        // Store drag data
        dragDataRef.current = data;
        setIsDragging(true);

        // Call external handler
        onDragStart?.(data, e);

        // Set drag image if available
        if (e.dataTransfer && data.dragImage) {
            const img = new Image();
            img.src = data.dragImage;
            e.dataTransfer.setDragImage(img, dragOffset.x, dragOffset.y);
        }

        // Set drag data
        if (e.dataTransfer) {
            e.dataTransfer.setData('text/plain', JSON.stringify(data));
            e.dataTransfer.effectAllowed = 'move';
        }
    }, [onDragStart, canDrag]);

    const handleDragEnd = useCallback((e) => {
        setIsDragging(false);
        onDragEnd?.(dragDataRef.current, e);
        dragDataRef.current = null;
    }, [onDragEnd]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }, []);

    const handleDrop = useCallback((e, dropZoneData) => {
        e.preventDefault();

        let dragData;
        try {
            // Try to get data from dataTransfer
            dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
        } catch {
            // Fallback to stored data
            dragData = dragDataRef.current;
        }

        if (!dragData || !canDrop(dragData, dropZoneData)) return;

        // Calculate drop position
        const rect = e.currentTarget.getBoundingClientRect();
        const position = {
            x: e.clientX - rect.left - dragOffset.x,
            y: e.clientY - rect.top - dragOffset.y
        };

        onDrop?.(dragData, dropZoneData, position, e);
        setIsDragging(false);
        dragDataRef.current = null;
    }, [onDrop, canDrop]);

    // Hook for making an element draggable
    const draggableProps = useCallback((data) => ({
        draggable: true,
        onDragStart: (e) => handleDragStart(e, data),
        onDragEnd: handleDragEnd,
        style: {
            cursor: canDrag(data) ? 'grab' : 'not-allowed',
            opacity: isDragging ? 0.5 : 1
        }
    }), [handleDragStart, handleDragEnd, canDrag, isDragging]);

    // Hook for making an element a drop zone
    const dropZoneProps = useCallback((data) => ({
        onDragOver: handleDragOver,
        onDrop: (e) => handleDrop(e, data),
        style: {
            position: 'relative'
        }
    }), [handleDragOver, handleDrop]);

    // Helper for custom drag previews
    const createDragPreview = useCallback((element) => {
        const preview = element.cloneNode(true);
        preview.style.position = 'fixed';
        preview.style.pointerEvents = 'none';
        preview.style.zIndex = 1000;
        preview.style.opacity = 0.8;
        document.body.appendChild(preview);
        return preview;
    }, []);

    // Helper for updating drag preview position
    const updateDragPreview = useCallback((preview, x, y) => {
        if (!preview) return;
        preview.style.left = `${x}px`;
        preview.style.top = `${y}px`;
    }, []);

    // Helper for removing drag preview
    const removeDragPreview = useCallback((preview) => {
        if (!preview) return;
        document.body.removeChild(preview);
    }, []);

    return {
        isDragging,
        dragOffset,
        draggableProps,
        dropZoneProps,
        createDragPreview,
        updateDragPreview,
        removeDragPreview
    };
};

// Helper hook for handling grid-based drag and drop
export const useGridDragAndDrop = ({
    gridSize,
    cellSize,
    onDragStart,
    onDragEnd,
    onDrop,
    canDrag = () => true,
    canDrop = () => true
}) => {
    const { isDragging, draggableProps, dropZoneProps, ...rest } = useDragAndDrop({
        onDragStart,
        onDragEnd,
        onDrop: (dragData, dropZoneData, position) => {
            // Convert pixel position to grid coordinates
            const gridX = Math.floor(position.x / cellSize);
            const gridY = Math.floor(position.y / cellSize);

            // Ensure coordinates are within grid bounds
            if (gridX >= 0 && gridX < gridSize.width &&
                gridY >= 0 && gridY < gridSize.height) {
                onDrop?.(dragData, { ...dropZoneData, x: gridX, y: gridY });
            }
        },
        canDrag,
        canDrop
    });

    // Helper for getting grid cell at position
    const getCellAtPosition = useCallback((x, y) => ({
        x: Math.floor(x / cellSize),
        y: Math.floor(y / cellSize)
    }), [cellSize]);

    return {
        isDragging,
        draggableProps,
        dropZoneProps,
        getCellAtPosition,
        ...rest
    };
};

export default {
    useDragAndDrop,
    useGridDragAndDrop
};
