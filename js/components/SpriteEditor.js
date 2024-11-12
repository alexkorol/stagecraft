const SpriteEditor = ({ onSave, onCancel, initialSprite = null }) => {
    const [pixelGrid, setPixelGrid] = React.useState(
        initialSprite || Array(SPRITE_GRID_SIZE).fill().map(() => 
            Array(SPRITE_GRID_SIZE).fill('#FFFFFF')
        )
    );
    const [selectedColor, setSelectedColor] = React.useState('#000000');
    const [isDrawing, setIsDrawing] = React.useState(false);
    const [tool, setTool] = React.useState('pencil'); // pencil, fill, eraser

    const handlePixelClick = (x, y) => {
        const newGrid = [...pixelGrid];
        
        if (tool === 'fill') {
            const targetColor = pixelGrid[y][x];
            floodFill(newGrid, x, y, targetColor, selectedColor);
        } else {
            newGrid[y][x] = tool === 'eraser' ? '#FFFFFF' : selectedColor;
        }
        
        setPixelGrid(newGrid);
    };

    const handleMouseDown = (x, y) => {
        setIsDrawing(true);
        handlePixelClick(x, y);
    };

    const handleMouseEnter = (x, y) => {
        if (isDrawing && tool === 'pencil') {
            handlePixelClick(x, y);
        }
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    const floodFill = (grid, x, y, targetColor, replacementColor) => {
        if (x < 0 || x >= SPRITE_GRID_SIZE || y < 0 || y >= SPRITE_GRID_SIZE) return;
        if (grid[y][x] !== targetColor || grid[y][x] === replacementColor) return;

        grid[y][x] = replacementColor;

        floodFill(grid, x + 1, y, targetColor, replacementColor);
        floodFill(grid, x - 1, y, targetColor, replacementColor);
        floodFill(grid, x, y + 1, targetColor, replacementColor);
        floodFill(grid, x, y - 1, targetColor, replacementColor);
    };

    const clearCanvas = () => {
        setPixelGrid(Array(SPRITE_GRID_SIZE).fill().map(() => 
            Array(SPRITE_GRID_SIZE).fill('#FFFFFF')
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
            <div className="bg-white rounded-lg p-6 w-[500px]">
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