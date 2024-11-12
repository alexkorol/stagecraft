import React, { useState, useEffect, useCallback } from 'react';
import { useUndo } from '../utils/UndoManager';

const DEFAULT_SIZE = 16;
const TOOLS = {
    PENCIL: 'pencil',
    LINE: 'line',
    RECT: 'rectangle',
    CIRCLE: 'circle',
    FILL: 'fill',
    ERASER: 'eraser'
};

const COLORS = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#808080', '#C0C0C0', '#800000', '#808000', '#008000',
    '#800080', '#008080', '#000080'
];

const SpriteEditor = ({ initialSprite, onSave, onClose }) => {
    const [size, setSize] = useState(DEFAULT_SIZE);
    const [frames, setFrames] = useState([]);
    const [currentFrame, setCurrentFrame] = useState(0);
    const { 
        state: pixelGrid, 
        setState: setPixelGrid, 
        undo, 
        redo, 
        canUndo, 
        canRedo 
    } = useUndo(
        initialSprite?.pixels || 
        Array(size).fill().map(() => Array(size).fill('#FFFFFF'))
    );

    const [selectedColor, setSelectedColor] = useState('#000000');
    const [tool, setTool] = useState(TOOLS.PENCIL);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState(null);
    const [preview, setPreview] = useState(null);



    // Drawing helpers
    const drawLine = (start, end, tempGrid) => {
        const grid = tempGrid || [...pixelGrid];
        const dx = Math.abs(end.x - start.x);
        const dy = Math.abs(end.y - start.y);
        const sx = start.x < end.x ? 1 : -1;
        const sy = start.y < end.y ? 1 : -1;
        let err = dx - dy;

        let x = start.x;
        let y = start.y;

        while (true) {
            grid[y][x] = selectedColor;
            if (x === end.x && y === end.y) break;
            const e2 = 2 * err;
            if (e2 > -dy) { err -= dy; x += sx; }
            if (e2 < dx) { err += dx; y += sy; }
        }

        return grid;
    };

    const drawRect = (start, end, tempGrid) => {
        const grid = tempGrid || [...pixelGrid];
        const minX = Math.min(start.x, end.x);
        const maxX = Math.max(start.x, end.x);
        const minY = Math.min(start.y, end.y);
        const maxY = Math.max(start.y, end.y);

        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                if (x === minX || x === maxX || y === minY || y === maxY) {
                    grid[y][x] = selectedColor;
                }
            }
        }

        return grid;
    };

    const drawCircle = (start, end, tempGrid) => {
        const grid = tempGrid || [...pixelGrid];
        const centerX = start.x;
        const centerY = start.y;
        const radius = Math.sqrt(
            Math.pow(end.x - start.x, 2) + 
            Math.pow(end.y - start.y, 2)
        );

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const distance = Math.sqrt(
                    Math.pow(x - centerX, 2) + 
                    Math.pow(y - centerY, 2)
                );
                if (Math.abs(distance - radius) < 1) {
                    grid[y][x] = selectedColor;
                }
            }
        }

        return grid;
    };

    const floodFill = (x, y, targetColor, replacementColor, grid) => {
        if (x < 0 || x >= size || y < 0 || y >= size) return;
        if (grid[y][x] !== targetColor || grid[y][x] === replacementColor) return;

        grid[y][x] = replacementColor;

        floodFill(x + 1, y, targetColor, replacementColor, grid);
        floodFill(x - 1, y, targetColor, replacementColor, grid);
        floodFill(x, y + 1, targetColor, replacementColor, grid);
        floodFill(x, y - 1, targetColor, replacementColor, grid);
    };

    // Event handlers
    const handleMouseDown = (x, y) => {
        setIsDrawing(true);
        setStartPos({ x, y });

        if (tool === TOOLS.PENCIL || tool === TOOLS.ERASER) {
            const newGrid = [...pixelGrid];
            newGrid[y][x] = tool === TOOLS.ERASER ? '#FFFFFF' : selectedColor;
            setPixelGrid(newGrid);
        }
    };

    const handleMouseMove = (x, y) => {
        if (!isDrawing || !startPos) return;

        const tempGrid = [...pixelGrid];
        let previewGrid;

        switch (tool) {
            case TOOLS.LINE:
                previewGrid = drawLine(startPos, { x, y }, tempGrid);
                break;
            case TOOLS.RECT:
                previewGrid = drawRect(startPos, { x, y }, tempGrid);
                break;
            case TOOLS.CIRCLE:
                previewGrid = drawCircle(startPos, { x, y }, tempGrid);
                break;
            case TOOLS.PENCIL:
                tempGrid[y][x] = selectedColor;
                previewGrid = tempGrid;
                break;
            case TOOLS.ERASER:
                tempGrid[y][x] = '#FFFFFF';
                previewGrid = tempGrid;
                break;
        }

        setPreview(previewGrid);
    };

    const handleMouseUp = (x, y) => {
        if (!isDrawing) return;

        let finalGrid;
        switch (tool) {
            case TOOLS.LINE:
                finalGrid = drawLine(startPos, { x, y });
                break;
            case TOOLS.RECT:
                finalGrid = drawRect(startPos, { x, y });
                break;
            case TOOLS.CIRCLE:
                finalGrid = drawCircle(startPos, { x, y });
                break;
            case TOOLS.FILL:
                finalGrid = [...pixelGrid];
                floodFill(x, y, pixelGrid[y][x], selectedColor, finalGrid);
                break;
            default:
                finalGrid = preview;
        }

        setPixelGrid(finalGrid);
        setIsDrawing(false);
        setStartPos(null);
        setPreview(null);
    };

    // Animation frame management
    const addFrame = () => {
        setFrames([...frames, pixelGrid]);
        setCurrentFrame(frames.length);
    };

    const deleteFrame = (index) => {
        const newFrames = frames.filter((_, i) => i !== index);
        setFrames(newFrames);
        setCurrentFrame(Math.min(currentFrame, newFrames.length - 1));
    };

    const clearCanvas = () => {
        setPixelGrid(Array(8).fill().map(() => Array(8).fill('#FFFFFF')
        ));
    };

    React.useEffect(() => {
        const handleGlobalMouseUp = () => {
            setIsDrawing(false);
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, []);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-[500px] max-w-full">
                <h2 className="text-xl font-bold mb-4">Sprite Editor</h2>
                
                {/* Tools */}
                <div className="flex gap-2 mb-4">
                    <button
                        className={`px-3 py-1 rounded ${tool === 'pencil' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setTool('pencil')}
                    >
                        Pencil
                    </button>
                    <button
                        className={`px-3 py-1 rounded ${tool === 'fill' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setTool('fill')}
                    >
                        Fill
                    </button>
                    <button
                        className={`px-3 py-1 rounded ${tool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setTool('eraser')}
                    >
                        Eraser
                    </button>
                    <button
                        className="px-3 py-1 rounded bg-red-500 text-white ml-auto"
                        onClick={clearCanvas}
                    >
                        Clear
                    </button>
                </div>

                {/* Color Palette */}
                <div className="flex gap-2 flex-wrap mb-4">
                    {COLORS.map(color => (
                        <div
                            key={color}
                            className={`color-picker-cell ${selectedColor === color ? 'selected' : ''}`}
                            style={{ backgroundColor: color }}
                            onClick={() => setSelectedColor(color)}
                        />
                    ))}
                </div>

                {/* Pixel Grid */}
                <div 
                    className="grid gap-px bg-gray-200 p-1 w-fit mx-auto mb-4"
                    style={{
                        gridTemplateColumns: `repeat(${SPRITE_GRID_SIZE}, 20px)`
                    }}
                >
                    {pixelGrid.map((row, y) =>
                        row.map((color, x) => (
                            <div
                                key={`${x}-${y}`}
                                className="w-5 h-5 cursor-pointer"
                                style={{ backgroundColor: color }}
                                onMouseDown={() => handleMouseDown(x, y)}
                                onMouseEnter={() => handleMouseEnter(x, y)}
                            />
                        ))
                    )}
                </div>

                {/* Preview */}
                <div className="mb-4">
                    <h3 className="font-medium mb-2">Preview</h3>
                    <div className="border p-2 w-fit">
                        <div 
                            className="grid"
                            style={{
                                gridTemplateColumns: `repeat(${SPRITE_GRID_SIZE}, 4px)`,
                                transform: 'scale(2)',
                                transformOrigin: 'top left'
                            }}
                        >
                            {pixelGrid.map((row, y) =>
                                row.map((color, x) => (
                                    <div
                                        key={`preview-${x}-${y}`}
                                        className="w-1 h-1"
                                        style={{ backgroundColor: color }}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex justify-end gap-2">
                    <button
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                        onClick={() => onSave(pixelGrid)}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SpriteEditor;