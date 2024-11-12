const Examples = ({ onClose, onLoadExample }) => {
    const examples = [
        {
            id: 'simple-movement',
            name: 'Simple Movement',
            description: 'Learn how to make a character move across the grid.',
            difficulty: 'Beginner',
            tags: ['movement', 'basic rules'],
            preview: {
                characters: [
                    {
                        id: '1',
                        sprite: Array(8).fill().map(() => Array(8).fill('#000000')),
                        x: 0,
                        y: 0,
                        rules: [
                            {
                                type: 'move',
                                direction: 'right'
                            }
                        ]
                    }
                ]
            }
        },
        {
            id: 'chase-game',
            name: 'Chase Game',
            description: 'Create a simple game where one character chases another.',
            difficulty: 'Intermediate',
            tags: ['game', 'multiple characters', 'keyboard input'],
            preview: {
                characters: [
                    {
                        id: '1',
                        sprite: Array(8).fill().map(() => Array(8).fill('#FF0000')),
                        x: 0,
                        y: 0,
                        rules: []
                    },
                    {
                        id: '2',
                        sprite: Array(8).fill().map(() => Array(8).fill('#0000FF')),
                        x: 7,
                        y: 7,
                        rules: []
                    }
                ]
            }
        },
        {
            id: 'maze-solver',
            name: 'Maze Solver',
            description: 'Program a character to navigate through a maze.',
            difficulty: 'Advanced',
            tags: ['pathfinding', 'conditions', 'complex rules'],
            preview: {
                characters: [
                    {
                        id: '1',
                        sprite: Array(8).fill().map(() => Array(8).fill('#00FF00')),
                        x: 0,
                        y: 0,
                        rules: []
                    }
                ]
            }
        }
    ];

    const [selectedExample, setSelectedExample] = React.useState(null);
    const [filter, setFilter] = React.useState('all');

    const handleLoadExample = (example) => {
        onLoadExample(example);
        onClose();
    };

    const filteredExamples = React.useMemo(() => {
        if (filter === 'all') return examples;
        return examples.filter(example => example.difficulty.toLowerCase() === filter);
    }, [filter]);

    const renderExamplePreview = (example) => {
        return (
            <div className="border rounded p-2 bg-gray-50">
                <div className="grid grid-cols-8 gap-px bg-gray-200">
                    {Array(8).fill().map((_, y) => (
                        Array(8).fill().map((_, x) => {
                            const character = example.preview.characters.find(
                                char => char.x === x && char.y === y
                            );
                            return (
                                <div
                                    key={`${x}-${y}`}
                                    className="w-6 h-6 bg-white"
                                >
                                    {character && (
                                        <div
                                            className="w-full h-full"
                                            style={{
                                                backgroundColor: character.sprite[0][0]
                                            }}
                                        />
                                    )}
                                </div>
                            );
                        })
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Example Projects</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="mb-6">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-48 p-2 border rounded"
                    >
                        <option value="all">All Difficulties</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredExamples.map(example => (
                        <div
                            key={example.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-shadow hover:shadow-lg ${
                                selectedExample?.id === example.id ? 'border-blue-500' : ''
                            }`}
                            onClick={() => setSelectedExample(example)}
                        >
                            {renderExamplePreview(example)}
                            <div className="mt-4">
                                <h3 className="font-bold text-lg">{example.name}</h3>
                                <p className="text-gray-600 text-sm mt-1">
                                    {example.description}
                                </p>
                                <div className="flex items-center mt-2">
                                    <span className={`px-2 py-1 rounded text-xs ${
                                        example.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                                        example.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {example.difficulty}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {example.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedExample && (
                    <div className="mt-6 pt-6 border-t flex justify-end">
                        <button
                            onClick={() => handleLoadExample(selectedExample)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Load Example
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Examples;