const Documentation = ({ onClose }) => {
    const [activeSection, setActiveSection] = React.useState('getting-started');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [expandedItems, setExpandedItems] = React.useState([]);

    const sections = {
        'getting-started': {
            title: 'Getting Started',
            content: [
                {
                    title: 'Introduction',
                    content: 'StageCraft is a visual programming environment that lets you create interactive games and simulations without traditional coding.',
                    subsections: [
                        { title: 'Key Concepts', content: 'Learn about characters, rules, and the grid-based environment.' },
                        { title: 'Basic Controls', content: 'Understanding the interface and basic controls.' }
                    ]
                },
                {
                    title: 'Creating Your First Project',
                    content: 'Step-by-step guide to creating your first interactive project.',
                    subsections: [
                        { title: 'Setting Up', content: 'Creating a new project and configuring basic settings.' },
                        { title: 'Adding Characters', content: 'Creating and customizing characters.' },
                        { title: 'Creating Rules', content: 'Defining behavior through visual rules.' }
                    ]
                }
            ]
        },
        'characters': {
            title: 'Characters',
            content: [
                {
                    title: 'Character Creation',
                    content: 'Learn how to create and customize characters.',
                    subsections: [
                        { title: 'Sprite Editor', content: 'Using the built-in sprite editor.' },
                        { title: 'Properties', content: 'Setting character properties and attributes.' }
                    ]
                },
                {
                    title: 'Character Behaviors',
                    content: 'Understanding and implementing character behaviors.',
                    subsections: [
                        { title: 'Movement', content: 'Implementing character movement.' },
                        { title: 'Interactions', content: 'Character interactions and collisions.' }
                    ]
                }
            ]
        },
        'rules': {
            title: 'Rules System',
            content: [
                {
                    title: 'Creating Rules',
                    content: 'Understanding the rule creation system.',
                    subsections: [
                        { title: 'Conditions', content: 'Setting up rule conditions.' },
                        { title: 'Actions', content: 'Defining rule actions.' }
                    ]
                },
                {
                    title: 'Advanced Rules',
                    content: 'Advanced rule concepts and techniques.',
                    subsections: [
                        { title: 'Multiple Conditions', content: 'Working with multiple conditions.' },
                        { title: 'Chain Rules', content: 'Creating chains of rules.' }
                    ]
                }
            ]
        },
        'examples': {
            title: 'Examples & Tutorials',
            content: [
                {
                    title: 'Basic Examples',
                    content: 'Simple examples to get started.',
                    subsections: [
                        { title: 'Simple Movement', content: 'Creating basic character movement.' },
                        { title: 'Collecting Items', content: 'Implementing item collection mechanics.' }
                    ]
                },
                {
                    title: 'Game Templates',
                    content: 'Ready-to-use game templates.',
                    subsections: [
                        { title: 'Platform Game', content: 'Basic platform game template.' },
                        { title: 'Puzzle Game', content: 'Simple puzzle game template.' }
                    ]
                }
            ]
        }
    };

    const toggleExpanded = (id) => {
        setExpandedItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const filteredSections = React.useMemo(() => {
        if (!searchQuery) return sections;

        const filtered = {};
        Object.entries(sections).forEach(([key, section]) => {
            const matchingContent = section.content.filter(item =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.subsections.some(sub =>
                    sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    sub.content.toLowerCase().includes(searchQuery.toLowerCase())
                )
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
            <div className="bg-white rounded-lg p-6 w-[900px] max-w-full mx-4 h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Documentation</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search documentation..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div className="flex-1 flex gap-6 overflow-hidden">
                    {/* Navigation */}
                    <div className="w-64 overflow-y-auto border-r pr-4">
                        {Object.entries(filteredSections).map(([key, section]) => (
                            <button
                                key={key}
                                onClick={() => setActiveSection(key)}
                                className={`w-full text-left px-4 py-2 rounded mb-2 ${
                                    activeSection === key
                                        ? 'bg-blue-500 text-white'
                                        : 'hover:bg-gray-100'
                                }`}
                            >
                                {section.title}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredSections[activeSection]?.content.map((item, index) => (
                            <div key={index} className="mb-8">
                                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                                <p className="text-gray-600 mb-4">{item.content}</p>
                                
                                {item.subsections.map((sub, subIndex) => (
                                    <div
                                        key={subIndex}
                                        className="border rounded-lg mb-4"
                                    >
                                        <button
                                            onClick={() => toggleExpanded(`${index}-${subIndex}`)}
                                            className="w-full flex justify-between items-center p-4 hover:bg-gray-50"
                                        >
                                            <span className="font-medium">{sub.title}</span>
                                            <svg
                                                className={`w-5 h-5 transform transition-transform ${
                                                    expandedItems.includes(`${index}-${subIndex}`) ? 'rotate-180' : ''
                                                }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {expandedItems.includes(`${index}-${subIndex}`) && (
                                            <div className="p-4 border-t bg-gray-50">
                                                <p className="text-gray-600">{sub.content}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Documentation;