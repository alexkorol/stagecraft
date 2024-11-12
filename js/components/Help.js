import React, { useState } from 'react';
import { HelpCircle, Keyboard, Book, ExternalLink, MessageCircle, Video, Star } from 'lucide-react';
import { KEY_BINDINGS } from '../constants';
import { formatKeyBinding } from '../utils/KeyboardControls';

const QUICK_TIPS = [
    {
        title: 'Creating Characters',
        tips: [
            'Click "Add Character" to create a new character',
            'Use the sprite editor to design your character',
            'Click on the grid to place your character'
        ]
    },
    {
        title: 'Creating Rules',
        tips: [
            'Select a character to create rules for it',
            'Click "Add Rule" to create a new rule',
            'Rules are checked in order from top to bottom',
            'Use the "before" and "after" states to define behavior'
        ]
    },
    {
        title: 'Running Simulation',
        tips: [
            'Click Play to start the simulation',
            'Use the speed control to adjust simulation speed',
            'Press Space to pause/resume',
            'Press R to reset to initial state'
        ]
    }
];

const RESOURCES = [
    {
        title: 'Documentation',
        icon: Book,
        description: 'Complete documentation and guides',
        link: '/docs'
    },
    {
        title: 'Video Tutorials',
        icon: Video,
        description: 'Step-by-step video tutorials',
        link: '/tutorials'
    },
    {
        title: 'Community Forum',
        icon: MessageCircle,
        description: 'Get help from the community',
        link: '/forum'
    },
    {
        title: 'Example Projects',
        icon: Star,
        description: 'Learn from example projects',
        link: '/examples'
    }
];

const Help = ({ onClose, onOpenDocs }) => {
    const [activeTab, setActiveTab] = useState('quickTips');

    const renderQuickTips = () => (
        <div className="space-y-6">
            {QUICK_TIPS.map((section, index) => (
                <div key={index}>
                    <h3 className="font-medium mb-2">{section.title}</h3>
                    <ul className="space-y-2">
                        {section.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <span className="text-blue-500">•</span>
                                <span className="text-gray-600">{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );

    const renderKeyboardShortcuts = () => (
        <div className="space-y-4">
            {Object.entries(KEY_BINDINGS).map(([action, shortcut]) => (
                <div key={action} className="flex items-center justify-between">
                    <span className="text-gray-600">
                        {action.split('_').map(word => 
                            word.charAt(0) + word.slice(1).toLowerCase()
                        ).join(' ')}
                    </span>
                    <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">
                        {formatKeyBinding(shortcut)}
                    </kbd>
                </div>
            ))}
        </div>
    );

    const renderResources = () => (
        <div className="grid grid-cols-1 gap-4">
            {RESOURCES.map((resource, index) => {
                const Icon = resource.icon;
                return (
                    <a
                        key={index}
                        href={resource.link}
                        className="flex items-center gap-4 p-4 rounded-lg border hover:bg-gray-50"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Icon className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium">{resource.title}</h3>
                            <p className="text-sm text-gray-600">
                                {resource.description}
                            </p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                    </a>
                );
            })}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[600px] max-w-full">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <HelpCircle className="w-5 h-5" />
                            <h2 className="text-xl font-semibold">Help & Resources</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            ×
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => setActiveTab('quickTips')}
                            className={`
                                px-4 py-2 rounded-lg flex items-center gap-2
                                ${activeTab === 'quickTips'
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }
                            `}
                        >
                            <HelpCircle className="w-4 h-4" />
                            Quick Tips
                        </button>
                        <button
                            onClick={() => setActiveTab('shortcuts')}
                            className={`
                                px-4 py-2 rounded-lg flex items-center gap-2
                                ${activeTab === 'shortcuts'
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }
                            `}
                        >
                            <Keyboard className="w-4 h-4" />
                            Shortcuts
                        </button>
                        <button
                            onClick={() => setActiveTab('resources')}
                            className={`
                                px-4 py-2 rounded-lg flex items-center gap-2
                                ${activeTab === 'resources'
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }
                            `}
                        >
                            <Book className="w-4 h-4" />
                            Resources
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="mb-6">
                        {activeTab === 'quickTips' && renderQuickTips()}
                        {activeTab === 'shortcuts' && renderKeyboardShortcuts()}
                        {activeTab === 'resources' && renderResources()}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-4 border-t">
                        <button
                            onClick={onOpenDocs}
                            className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
                        >
                            <Book className="w-4 h-4" />
                            Open Documentation
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Help;
