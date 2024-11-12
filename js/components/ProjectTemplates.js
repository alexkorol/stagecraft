import React, { useState } from 'react';
import { Book, Search, ChevronRight, Star, Clock, Download, Tag } from 'lucide-react';
import ProjectManager from '../utils/ProjectManager';

const CATEGORIES = [
    'All',
    'Games',
    'Simulations',
    'Animations',
    'Tutorials'
];

const DIFFICULTY_LEVELS = {
    BEGINNER: 'beginner',
    INTERMEDIATE: 'intermediate',
    ADVANCED: 'advanced'
};

const TEMPLATES = [
    {
        id: 'simple-platformer',
        name: 'Simple Platformer',
        description: 'A basic platformer game with jumping and obstacles.',
        category: 'Games',
        difficulty: DIFFICULTY_LEVELS.BEGINNER,
        preview: '/templates/platformer-preview.png',
        stars: 245,
        tags: ['game', 'platformer', 'physics'],
        lastUpdated: '2024-01-15'
    },
    {
        id: 'particle-system',
        name: 'Particle System',
        description: 'Interactive particle simulation with various effects.',
        category: 'Simulations',
        difficulty: 'Intermediate',
        preview: '/templates/particles-preview.png',
        stars: 189
    },
    {
        id: 'character-animation',
        name: 'Character Animation',
        description: 'Basic character animation with walking and idle states.',
        category: 'Animations',
        difficulty: 'Beginner',
        preview: '/templates/animation-preview.png',
        stars: 156
    },
    {
        id: 'basic-tutorial',
        name: 'Getting Started',
        description: 'Learn the basics of StageCraft Creator.',
        category: 'Tutorials',
        difficulty: 'Beginner',
        preview: '/templates/tutorial-preview.png',
        stars: 312
    }
];

const ProjectTemplates = ({ onSelect, onClose }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('popular'); // 'popular', 'recent', 'name'
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');

    const filterTemplates = () => {
        return TEMPLATES.filter(template => {
            const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
            const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
            const matchesSearch = 
                template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

            return matchesCategory && matchesDifficulty && matchesSearch;
        }).sort((a, b) => {
            switch (sortBy) {
                case 'popular':
                    return b.stars - a.stars;
                case 'recent':
                    return new Date(b.lastUpdated) - new Date(a.lastUpdated);
                case 'name':
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });
    };

    const handleTemplateSelect = async (template) => {
        try {
            // In a real implementation, this would fetch the template from a server
            await ProjectManager.loadTemplate(template.id);
            onSelect(template);
            onClose();
        } catch (error) {
            console.error('Failed to load template:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[900px] max-w-[90vw] max-h-[90vh] flex flex-col">
                <div className="p-6 border-b">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <Book className="w-5 h-5" />
                            <h2 className="text-xl font-semibold">Project Templates</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            ×
                        </button>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search templates..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                            />
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 border rounded-lg"
                        >
                            <option value="popular">Most Popular</option>
                            <option value="recent">Most Recent</option>
                            <option value="name">Name</option>
                        </select>
                    </div>
                </div>

                {/* Categories */}
                <div className="border-b">
                    <div className="px-6 py-2 flex gap-2 overflow-x-auto">
                        {CATEGORIES.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`
                                    px-4 py-2 rounded-full whitespace-nowrap
                                    ${selectedCategory === category
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                    }
                                `}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Templates Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sortedTemplates.map(template => (
                            <div
                                key={template.id}
                                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <img
                                    src={template.preview}
                                    alt={template.name}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="font-medium mb-1">{template.name}</h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {template.description}
                                    </p>
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span className="flex items-center">
                                            <Star className="w-4 h-4 mr-1 text-yellow-400" />
                                            {template.stars}
                                        </span>
                                        <span className="bg-gray-100 px-2 py-1 rounded">
                                            {template.difficulty}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleTemplateSelect(template)}
                                        className="mt-3 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Use Template
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
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