const Help = ({ onClose }) => {
    const [activeSection, setActiveSection] = React.useState('getting-started');
    const [searchQuery, setSearchQuery] = React.useState('');

    const sections = {
        'getting-started': {
            title: 'Getting Started',
            content: [
                {
                    title: 'Welcome to StageCraft',
                    text: 'StageCraft is a visual programming environment that lets you create games and simulations by demonstrating what you want characters to do.',
                },
                {
                    title: 'Basic Concepts',
                    text: 'Characters are the building blocks of your project. Each character can have rules that determine how it behaves during simulation.',
                },
                {
                    title: 'Creating Your First Project',
                    text: '1. Create a character using the sprite editor\n2. Place your character on the grid\n3. Add rules to define its behavior\n4. Run the simulation to see it in action!',
                }
            ]
        },
        'characters': {
            title: 'Characters',
            content: [
                {
                    title: 'Creating Characters',
                    text: 'Click the "Add Character" button to open the sprite editor. Use the tools to draw your character\'s appearance.',
                },
                {
                    title: 'Editing Characters',
                    text: 'Select a character from the palette and click the edit button to modify its sprite or properties.',
                },
                {
                    title: 'Character Properties',
                    text: 'Characters can have properties like position, direction, and custom variables that affect their behavior.',
                }
            ]
        },
        'rules': {
            title: 'Rules',
            content: [
                {
                    title: 'Creating Rules',
                    text: 'Select a character and click "Add Rule". Rules consist of conditions (when) and actions (then).',
                },
                {
                    title: 'Rule Types',
                    text: '- Movement Rules: Make characters move in different directions\n- Interaction Rules: Define how characters interact\n- State Rules: Change character properties',
                },
                {
                    title: 'Rule Priority',
                    text: 'Rules are checked in order. Only the first matching rule is executed.',
                }
            ]
        },
        'simulation': {
            title: 'Simulation',
            content: [
                {
                    title: 'Running Simulations',
                    text: 'Click the Play button to start the simulation. Characters will follow their rules automatically.',
                },
                {
                    title: 'Simulation Speed',
                    text: 'Adjust the simulation speed in settings to make characters move faster or slower.',
                },
                {
                    title: 'Debugging',
                    text: 'Use the step-by-step mode to see exactly how rules are being applied.',
                }
            ]
        },
        'advanced': {
            title: 'Advanced Features',
            content: [
                {
                    title: 'Custom Events',
                    text: 'Create complex interactions using custom events that characters can trigger and respond to.',
                },
                {
                    title: 'Variables',
                    text: 'Use variables to track scores, states, or other changing values in your project.',
                },
                {
                    title: 'Multiple Scenes',
                    text: 'Create different scenes or levels that characters can move between.',
                }
            ]
        }
    };

    const filteredSections = React.useMemo(() => {
        if (!searchQuery) return sections;

        const filtered = {};
        Object.entries(sections).forEach(([key, section]) => {
            const matchingContent = section.content.filter(item =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.text.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (matchingContent.length > 0) {
                filtered[key] = {
                    ...section,
                    content: matchingContent
                };
            }
        });

        return filtered;
    }, [searchQuery]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl mx-4 h-[80vh] flex flex-col">
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Help & Documentation</h2>
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
                    <input
                        type="text"
                        placeholder="Search documentation..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div className="flex-1 overflow-hidden flex">
                    {/* Navigation */}
                    <div className="w-64 border-r overflow-y-auto p-4">
                        {Object.entries(filteredSections).map(([key, section]) => (
                            <button
                                key={key}
                                className={`w-full text-left px-4 py-2 rounded ${
                                    activeSection === key
                                        ? 'bg-blue-500 text-white'
                                        : 'hover:bg-gray-100'
                                }`}
                                onClick={() => setActiveSection(key)}
                            >
                                {section.title}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {filteredSections[activeSection]?.content.map((item, index) => (
                            <div key={index} className="mb-6">
                                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                                <p className="text-gray-600 whitespace-pre-line">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                            Press '?' anywhere to open help
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => window.open('https://github.com/alexuser/stagecraft', '_blank')}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                GitHub
                            </button>
                            <button
                                onClick={() => window.open('https://github.com/alexuser/stagecraft/issues', '_blank')}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Report Issue
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Help;