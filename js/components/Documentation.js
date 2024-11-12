import React, { useState } from 'react';
import { Book, Search, ChevronRight, ExternalLink, ArrowLeft } from 'lucide-react';

const Documentation = ({ onClose }) => {
    const [currentSection, setCurrentSection] = useState(null);
    const [currentSubsection, setCurrentSubsection] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const DOCS_SECTIONS = {
        'Getting Started': {
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

    const handleBack = () => {
        if (currentSubsection) {
            setCurrentSubsection(null);
        } else if (currentSection) {
            setCurrentSection(null);
        }
    };

    const filterContent = (content) => {
        if (!searchQuery) return content;
        
        const sections = {};
        Object.entries(content).forEach(([section, data]) => {
            if (section.toLowerCase().includes(searchQuery.toLowerCase()) ||
                Object.keys(data).some(subsection => 
                    subsection.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    data[subsection].content.toLowerCase().includes(searchQuery.toLowerCase())
                )
            ) {
                sections[section] = data;
            }
        });
        return sections;
    };

    const renderContent = () => {
        if (currentSection && currentSubsection) {
            const content = DOCS_SECTIONS[currentSection][currentSubsection];
            return (
                <div className="p-6">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-blue-500 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    <h2 className="text-2xl font-bold mb-4">{currentSubsection}</h2>
                    <div className="prose max-w-none">
                        {content.content.split('\n').map((paragraph, i) => (
                            <p key={i} className="mb-4">
                                {paragraph.trim()}
                            </p>
                        ))}
                        {content.subsections && (
                            <div className="mt-6">
                                <h3 className="text-lg font-medium mb-3">In this section:</h3>
                                <ul className="list-disc pl-6 space-y-2">
                                    {content.subsections.map((subsection, i) => (
                                        <li key={i}>{subsection}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        if (currentSection) {
            return (
                <div className="p-6">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-blue-500 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    <h2 className="text-2xl font-bold mb-6">{currentSection}</h2>
                    <div className="space-y-4">
                        {Object.entries(DOCS_SECTIONS[currentSection]).map(([title, data]) => (
                            <button
                                key={title}
                                className="w-full text-left p-4 rounded-lg border hover:bg-gray-50"
                                onClick={() => setCurrentSubsection(title)}
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium">{title}</h3>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    {data.content.split('\n')[1].trim().slice(0, 100)}...
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        const filteredSections = filterContent(DOCS_SECTIONS);
        return (
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Documentation</h2>
                <div className="space-y-6">
                    {Object.entries(filteredSections).map(([section, data]) => (
                        <div key={section}>
                            <h3 className="font-medium text-lg mb-3">{section}</h3>
                            <div className="space-y-2">
                                {Object.keys(data).map(title => (
                                    <button
                                        key={title}
                                        className="w-full text-left p-4 rounded-lg border hover:bg-gray-50"
                                        onClick={() => {
                                            setCurrentSection(section);
                                            setCurrentSubsection(title);
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{title}</span>
                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[800px] max-w-full h-[600px] max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Book className="w-5 h-5" />
                        <h2 className="text-xl font-semibold">Documentation</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        ×
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b">
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search documentation..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Documentation;