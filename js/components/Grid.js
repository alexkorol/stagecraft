const Grid = ({ project, onCellClick, isRunning }) => {
    const gridRef = React.useRef(null);
    const [grid, setGrid] = React.useState(
        Array(project.gridSize).fill().map(() => Array(project.gridSize).fill(null))
    );

    // Update grid with character positions
    React.useEffect(() => {
        const newGrid = Array(project.gridSize).fill().map(() => Array(project.gridSize).fill(null));
        project.characters.forEach(char => {
            if (char.x >= 0 && char.x < project.gridSize && char.y >= 0 && char.y < project.gridSize) {
                newGrid[char.y][char.x] = char;
            }
        });
        setGrid(newGrid);
    }, [project.characters, project.gridSize]);

    // Simulation loop
    React.useEffect(() => {
        let intervalId;
        
        if (isRunning) {
            intervalId = setInterval(() => {
                executeRules();
            }, 1000); // Execute rules every second
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isRunning, project.rules]);

    const executeRules = () => {
        const updatedCharacters = [...project.characters];
        
        // Process each character's rules
        updatedCharacters.forEach(char => {
            const charRules = project.rules.filter(rule => rule.characterId === char.id);
            
            // Find the first applicable rule
            const applicableRule = charRules.find(rule => {
                // Check rule conditions here
                return true; // For now, all rules are applicable
            });

            if (applicableRule) {
                // Apply the rule's effects
                switch (applicableRule.action) {
                    case 'move':
                        let newX = char.x;
                        let newY = char.y;
                        
                        switch (applicableRule.direction) {
                            case 'right':
                                newX = Math.min(char.x + 1, project.gridSize - 1);
                                break;
                            case 'left':
                                newX = Math.max(char.x - 1, 0);
                                break;
                            case 'up':
                                newY = Math.max(char.y - 1, 0);
                                break;
                            case 'down':
                                newY = Math.min(char.y + 1, project.gridSize - 1);
                                break;
                        }

                        // Check if the new position is empty
                        if (!grid[newY][newX]) {
                            char.x = newX;
                            char.y = newY;
                        }
                        break;
                    // Add more action types here
                }
            }
        });

        // Update the project with new character positions
        const updatedProject = {
            ...project,
            characters: updatedCharacters
        };
        
        // Save the updated project
        StorageManager.saveProject(updatedProject);
    };

    const renderCell = (cell, x, y) => {
        return (
            <div
                key={`${x}-${y}`}
                className={`grid-cell ${!cell && 'hover:bg-gray-50'} ${
                    isRunning ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
                onClick={() => onCellClick(x, y)}
            >
                {cell && (
                    <div className="w-full h-full grid grid-cols-8 grid-rows-8">
                        {cell.sprite.map((row, i) =>
                            row.map((color, j) => (
                                <div
                                    key={`${i}-${j}`}
                                    className="sprite-pixel"
                                    style={{ backgroundColor: color }}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div
            ref={gridRef}
            className="grid gap-px bg-gray-200 p-1 w-fit mx-auto"
            style={{
                gridTemplateColumns: `repeat(${project.gridSize}, ${CELL_SIZE}px)`
            }}
        >
            {grid.map((row, y) =>
                row.map((cell, x) => renderCell(cell, x, y))
            )}
        </div>
    );
};

export default Grid;