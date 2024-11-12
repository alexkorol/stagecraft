const ProjectTemplates = ({ onClose, onSelectTemplate }) => {
    const [selectedCategory, setSelectedCategory] = React.useState('all');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedTemplate, setSelectedTemplate] = React.useState(null);

    const templates = [
        {
            id: 'simple-game',
            name: 'Simple Game',
            description: 'A basic game template with character movement and collision detection.',
            category: 'games',
            difficulty: 'beginner',
            preview: '/templates/simple-game.png',
            features: [
                'Basic character movement',
                'Simple collision detection',
                'Score tracking',
                'Win/lose conditions'
            ]
        },
        {
            id: 'maze-solver',
            name: 'Maze Solver',
            description: 'Create an AI that can solve mazes using pathfinding algorithms.',
            category: 'simulation',
            difficulty: 'intermediate',
            preview: '/templates/maze-solver.png',
            features: [
                'Maze generation',
                'Pathfinding algorithm',
                'Step-by-step visualization',
                'Multiple solving strategies'
            ]
        },
        {
            id: 'ecosystem',
            name: 'Ecosystem Simulation',
            description: 'Simulate a simple ecosystem with predators and prey.',
            category: 'simulation',
            difficulty: 'advanced',
            preview: '/templates/ecosystem.png',
            features: [
                'Multiple species interaction',
                'Population dynamics',
                'Food chain simulation',
                'Environmental factors'
            ]
        },
        {
            id: 'pixel-art',
            name: 'Pixel Art Animation',
            description: 'Create animated pixel art characters and scenes.',
            category: 'art',
            difficulty: 'beginner',
            preview: '/templates/pixel-art.png',
            features: [
                'Frame-by-frame animation',
                'Color palette management',
                'Sprite sheet export',
                'Animation preview'
            ]
        }
    ];

    const categories = [
        { id: 'all', name: 'All Templates' },
        { id: 'games', name: 'Games' },
        { id: 'simulation', name: 'Simulations' },
        { id: 'art', name: 'Art & Animation' }
    ];

    const filteredTemplates = React.useMemo(() => {
        return templates.filter(template => {
            const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
            const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                template.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    const handleSelectTemplate = () => {
        if (selectedTemplate) {
            onSelectTemplate(selectedTemplate);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[900px] max-w-full mx-4 h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Project Templates</h2>
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

                <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="flex gap-2">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-4 py-2 rounded ${
                                    selectedCategory === category.id
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredTemplates.map(template => (
                            <div
                                key={template.id}
                                className={`border rounded-lg p-4 cursor-pointer transition-shadow hover:shadow-lg ${
                                    selectedTemplate?.id === template.id ? 'border-blue-500' : ''
                                }`}
                                onClick={() => setSelectedTemplate(template)}
                            >
                                <div className="aspect-video bg-gray-100 rounded mb-4">
                                    <img
                                        src={template.preview}
                                        alt={template.name}
                                        className="w-full h-full object-cover rounded"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">{template.name}</h3>
                                    <p className="text-gray-600 text-sm mb-2">
                                        {template.description}
                                    </p>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            template.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                                            template.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {template.difficulty.charAt(0).toUpperCase() + template.difficulty.slice(1)}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        {template.features.map((feature, index) => (
                                            <div key={index} className="flex items-center text-sm text-gray-600">
                                                <span className="mr-2">•</span>
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t flex justify-end">
                    <button
                        onClick={handleSelectTemplate}
                        disabled={!selectedTemplate}
                        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        Use Template
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectTemplates;