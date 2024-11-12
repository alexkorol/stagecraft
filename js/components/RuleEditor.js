import React, { useState, useEffect } from 'react';
import { useUndo } from '../utils/UndoManager';

const GRID_SIZE = 3; // 3x3 grid for rule context
const DIRECTIONS = {
    NONE: 'none',
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right'
};

const TRIGGERS = {
    ALWAYS: 'always',
    KEY_PRESS: 'keyPress',
    COLLISION: 'collision',
    PROXIMITY: 'proximity'
};

const RuleEditor = ({ character, onSave, onClose }) => {
    // State for before/after grids
    const [beforeGrid, setBeforeGrid] = useState(
        Array(GRID_SIZE).fill().map(() => 
            Array(GRID_SIZE).fill(null)
        )
    );
    const [afterGrid, setAfterGrid] = useState(
        Array(GRID_SIZE).fill().map(() => 
            Array(GRID_SIZE).fill(null)
        )
    );

    // Rule conditions
    const [trigger, setTrigger] = useState(TRIGGERS.ALWAYS);
    const [triggerKey, setTriggerKey] = useState('');
    const [direction, setDirection] = useState(DIRECTIONS.NONE);
    const [proximity, setProximity] = useState(1);
    const [targetCharacter, setTargetCharacter] = useState(null);

    // Place character in center of before grid initially
    useEffect(() => {
        if (character) {
            const centerGrid = [...beforeGrid];
            centerGrid[1][1] = character;
            setBeforeGrid(centerGrid);
            
            const initialAfterGrid = [...afterGrid];
            initialAfterGrid[1][1] = character;
            setAfterGrid(initialAfterGrid);
        }
    }, [character]);

    const handleBeforeGridClick = (x, y) => {
        // Don't allow modifying the center cell where the character is
        if (x === 1 && y === 1) return;

        const newGrid = [...beforeGrid];
        newGrid[y][x] = newGrid[y][x] ? null : targetCharacter;
        setBeforeGrid(newGrid);
    };

    const handleAfterGridClick = (x, y) => {
        const newGrid = [...afterGrid];
        // Allow moving the character in the after state
        if (newGrid[y][x] === character) {
            newGrid[y][x] = null;
        } else {
            // Remove character from previous position
            for (let i = 0; i < GRID_SIZE; i++) {
                for (let j = 0; j < GRID_SIZE; j++) {
                    if (newGrid[i][j] === character) {
                        newGrid[i][j] = null;
                    }
                }
            }
            newGrid[y][x] = character;
        }
        setAfterGrid(newGrid);

        // Automatically detect direction based on movement
        if (x === 1 && y === 0) setDirection(DIRECTIONS.UP);
        else if (x === 1 && y === 2) setDirection(DIRECTIONS.DOWN);
        else if (x === 0 && y === 1) setDirection(DIRECTIONS.LEFT);
        else if (x === 2 && y === 1) setDirection(DIRECTIONS.RIGHT);
        else setDirection(DIRECTIONS.NONE);
    };

    const renderGrid = (grid, onClick) => (
        <div 
            className="grid gap-px bg-gray-200 p-1"
            style={{
                gridTemplateColumns: `repeat(${GRID_SIZE}, 50px)`
            }}
        >
            {grid.map((row, y) =>
                row.map((cell, x) => (
                    <div
                        key={`${x}-${y}`}
                        className={`w-[50px] h-[50px] cursor-pointer border ${
                            x === 1 && y === 1 ? 'bg-blue-50' : 'bg-white'
                        } hover:bg-gray-50 flex items-center justify-center`}
                        onClick={() => onClick(x, y)}
                    >
                        {cell && (
                            <div 
                                className="w-8 h-8"
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: `repeat(${cell.size}, 1fr)`
                                }}
                            >
                                {cell.pixels.map((row, py) =>
                                    row.map((color, px) => (
                                        <div
                                            key={`${px}-${py}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );

    const handleSave = () => {
        const rule = {
            before: beforeGrid,
            after: afterGrid,
            trigger,
            triggerKey: trigger === TRIGGERS.KEY_PRESS ? triggerKey : undefined,
            direction,
            proximity: trigger === TRIGGERS.PROXIMITY ? proximity : undefined,
            targetCharacter: trigger === TRIGGERS.COLLISION ? targetCharacter : undefined
        };
        onSave(rule);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-[800px] max-w-full">
                <h2 className="text-xl font-bold mb-4">Create Rule</h2>

                <div className="flex gap-8 mb-6">
                    <div>
                        <h3 className="font-medium mb-2">Before</h3>
                        {renderGrid(beforeGrid, handleBeforeGridClick)}
                    </div>
                    <div>
                        <h3 className="font-medium mb-2">After</h3>
                        {renderGrid(afterGrid, handleAfterGridClick)}
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    <div>
                        <h3 className="font-medium mb-2">Trigger</h3>
                        <select 
                            value={trigger}
                            onChange={(e) => setTrigger(e.target.value)}
                            className="border rounded px-2 py-1"
                        >
                            {Object.entries(TRIGGERS).map(([key, value]) => (
                                <option key={value} value={value}>
                                    {key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ')}
                                </option>
                            ))}
                        </select>

                        {trigger === TRIGGERS.KEY_PRESS && (
                            <input
                                type="text"
                                value={triggerKey}
                                onChange={(e) => setTriggerKey(e.target.value)}
                                placeholder="Press any key"
                                className="ml-2 border rounded px-2 py-1"
                                onKeyDown={(e) => {
                                    e.preventDefault();
                                    setTriggerKey(e.key);
                                }}
                            />
                        )}

                        {trigger === TRIGGERS.PROXIMITY && (
                            <input
                                type="number"
                                value={proximity}
                                onChange={(e) => setProximity(Number(e.target.value))}
                                min="1"
                                max="5"
                                className="ml-2 border rounded px-2 py-1 w-20"
                            />
                        )}
                    </div>

                    <div>
                        <h3 className="font-medium mb-2">Direction</h3>
                        <div className="flex gap-2">
                            {Object.entries(DIRECTIONS).map(([key, value]) => (
                                <button
                                    key={value}
                                    className={`px-3 py-1 rounded ${
                                        direction === value ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                    }`}
                                    onClick={() => setDirection(value)}
                                >
                                    {key.charAt(0) + key.slice(1).toLowerCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                        onClick={handleSave}
                    >
                        Save Rule
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RuleEditor;
