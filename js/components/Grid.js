import React, { useRef, useEffect } from 'react';
import { GRID_SIZES } from '../constants';

const Grid = ({ 
    size = GRID_SIZES.SMALL,
    characters,
    selectedCharacter,
    onPlaceCharacter,
    isRunning,
    cellSize = 50,
    showGrid = true,
    highlightCells = []  // For rule editing, showing valid moves, etc.
}) => {
    const gridRef = useRef(null);
    const grid = Array(size.height).fill().map(() => Array(size.width).fill(null));

    // Place characters on grid
    characters.forEach(char => {
        if (char.x >= 0 && char.x < size.width && char.y >= 0 && char.y < size.height) {
            grid[char.y][char.x] = char;
        }
    });

    const handleCellClick = (x, y) => {
        if (isRunning) return;
        onPlaceCharacter(x, y);
    };

    const renderCharacterSprite = (character) => {
        if (!character?.pixels) return null;

        return (
            <div
                className="w-full h-full"
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${character.size}, 1fr)`,
                    transform: character.direction === 'left' ? 'scaleX(-1)' : 'none'
                }}
            >
                {character.pixels.map((row, y) =>
                    row.map((color, x) => (
                        <div
                            key={`${x}-${y}`}
                            style={{ backgroundColor: color }}
                            className="w-full h-full"
                        />
                    ))
                )}
            </div>
        );
    };

    // Handle drag and drop
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, x, y) => {
        e.preventDefault();
        if (isRunning) return;
        
        const characterId = e.dataTransfer.getData('character');
        if (characterId) {
            onPlaceCharacter(x, y, characterId);
        }
    };

    // Optional: Add grid animation during simulation
    useEffect(() => {
        if (isRunning) {
            gridRef.current?.classList.add('running');
        } else {
            gridRef.current?.classList.remove('running');
        }
    }, [isRunning]);

    return (
        <div 
            ref={gridRef}
            className={`grid gap-px bg-gray-200 p-1 rounded-lg ${
                isRunning ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
            style={{
                gridTemplateColumns: `repeat(${size.width}, ${cellSize}px)`,
                width: 'fit-content'
            }}
        >
            {grid.map((row, y) =>
                row.map((cell, x) => {
                    const isHighlighted = highlightCells.some(
                        pos => pos.x === x && pos.y === y
                    );

                    return (
                        <div
                            key={`${x}-${y}`}
                            className={`
                                relative bg-white transition-colors
                                ${showGrid ? 'border border-gray-100' : ''}
                                ${isHighlighted ? 'bg-blue-50' : ''}
                                ${!isRunning ? 'hover:bg-gray-50' : ''}
                            `}
                            style={{
                                width: cellSize,
                                height: cellSize
                            }}
                            onClick={() => handleCellClick(x, y)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, x, y)}
                        >
                            {/* Grid coordinates (optional, for debugging) */}
                            {false && (
                                <div className="absolute top-0 left-0 text-xs text-gray-400">
                                    {x},{y}
                                </div>
                            )}

                            {/* Character sprite */}
                            {cell && (
                                <div 
                                    className={`
                                        absolute inset-0 p-1
                                        ${isRunning ? 'transition-all duration-200' : ''}
                                    `}
                                >
                                    {renderCharacterSprite(cell)}
                                </div>
                            )}

                            {/* Highlight overlay for valid moves */}
                            {isHighlighted && (
                                <div className="absolute inset-0 border-2 border-blue-400 pointer-events-none" />
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default Grid;
