const Controls = ({ 
    isRunning, 
    onToggleSimulation, 
    onSave, 
    onLoad,
    onClearGrid,
    gridSize,
    onGridSizeChange,
    simulationSpeed,
    onSimulationSpeedChange
}) => {
    return (
        <div className="mt-4 flex flex-wrap gap-2 items-center">
            {/* Simulation Controls */}
            <button
                onClick={onToggleSimulation}
                className={`px-4 py-2 rounded flex items-center gap-2 ${
                    isRunning 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-green-500 hover:bg-green-600'
                } text-white`}
            >
                {isRunning ? (
                    <>
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        Stop
                    </>
                ) : (
                    <>
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        Run
                    </>
                )}
            </button>

            {/* Simulation Speed */}
            {onSimulationSpeedChange && (
                <div className="flex items-center gap-2">
                    <label className="text-sm">Speed:</label>
                    <select
                        value={simulationSpeed}
                        onChange={(e) => onSimulationSpeedChange(Number(e.target.value))}
                        className="px-2 py-1 border rounded"
                        disabled={isRunning}
                    >
                        <option value={2000}>Slow</option>
                        <option value={1000}>Normal</option>
                        <option value={500}>Fast</option>
                        <option value={250}>Very Fast</option>
                    </select>
                </div>
            )}

            {/* Grid Size */}
            {onGridSizeChange && (
                <div className="flex items-center gap-2">
                    <label className="text-sm">Grid Size:</label>
                    <select
                        value={gridSize}
                        onChange={(e) => onGridSizeChange(Number(e.target.value))}
                        className="px-2 py-1 border rounded"
                        disabled={isRunning}
                    >
                        <option value={6}>6x6</option>
                        <option value={8}>8x8</option>
                        <option value={10}>10x10</option>
                        <option value={12}>12x12</option>
                        <option value={16}>16x16</option>
                    </select>
                </div>
            )}

            {/* Project Controls */}
            {onSave && (
                <button
                    onClick={onSave}
                    className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                    disabled={isRunning}
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                        />
                    </svg>
                    Save
                </button>
            )}

            {onLoad && (
                <button
                    onClick={onLoad}
                    className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white flex items-center gap-2"
                    disabled={isRunning}
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                    </svg>
                    Load
                </button>
            )}

            {/* Clear Grid */}
            {onClearGrid && (
                <button
                    onClick={onClearGrid}
                    className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
                    disabled={isRunning}
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                    </svg>
                    Clear Grid
                </button>
            )}
        </div>
    );
};

export default Controls;