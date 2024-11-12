import React, { useState } from 'react';
import { Book, Search, ChevronRight, Star, Clock, Download, Tag, Grid, List, X } from 'lucide-react';

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

const FEATURED_PROJECTS = [
    {
        id: 'simple-platformer',
        name: 'Simple Platformer',
        description: 'A basic platformer game with jumping and obstacles.',
        category: 'Games',
        difficulty: DIFFICULTY_LEVELS.BEGINNER,
        preview: '/templates/platformer-preview.png',
        stars: 245,
        tags: ['game', 'platformer', 'physics'],
        lastUpdated: '2024-01-15',
        author: 'StageCraft Team'
    },
    {
        id: 'particle-system',
        name: 'Particle System',
        description: 'Interactive particle simulation with various effects.',
        category: 'Simulations',
        difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
        preview: '/templates/particles-preview.png',
        stars: 189,
        tags: ['simulation', 'particles', 'effects'],
        lastUpdated: '2024-01-10',
        author: 'PhysicsLab'
    },
    {
        id: 'character-animation',
        name: 'Character Animation',
        description: 'Basic character animation with walking and idle states.',
        category: 'Animations',
        difficulty: DIFFICULTY_LEVELS.BEGINNER,
        preview: '/templates/animation-preview.png',
        stars: 156,
        tags: ['animation', 'sprites', 'character'],
        lastUpdated: '2024-01-05',
        author: 'AnimationPro'
    }
];

const ProjectGallery = ({ onSelect, onClose }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('popular');
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    const filterProjects = () => {
        return FEATURED_PROJECTS.filter(project => {
            const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
            const matchesDifficulty = selectedDifficulty === 'all' || project.difficulty === selectedDifficulty;
            const matchesSearch = 
                project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                project.author.toLowerCase().includes(searchQuery.toLowerCase());

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

    const handleProjectSelect = async (project) => {
        try {
            await onSelect(project);
            onClose();
        } catch (error) {
            console.error('Failed to load project:', error);
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case DIFFICULTY_LEVELS.BEGINNER:
                return 'text-green-500 bg-green-50';
            case DIFFICULTY_LEVELS.INTERMEDIATE:
                return 'text-yellow-500 bg-yellow-50';
            case DIFFICULTY_LEVELS.ADVANCED:
                return 'text-red-500 bg-red-50';
            default:
                return 'text-gray-500 bg-gray-50';
        }
    };

    const renderGridView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterProjects().map(project => (
                <div
                    key={project.id}
                    className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                    <img
                        src={project.preview}
                        alt={project.name}
                        className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium">{project.name}</h3>
                            <span className="flex items-center text-yellow-500">
                                <Star className="w-4 h-4 fill-current" />
                                {project.stars}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                        <p className="text-sm text-gray-500 mb-3">by {project.author}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                            {project.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className={`px-2 py-1 rounded-full ${getDifficultyColor(project.difficulty)}`}>
                                {project.difficulty}
                            </span>
                            <span className="text-gray-500 flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {new Date(project.lastUpdated).toLocaleDateString()}
                            </span>
                        </div>
                        <button
                            onClick={() => handleProjectSelect(project)}
                            className="mt-3 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Use Project
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderListView = () => (
        <div className="space-y-4">
            {filterProjects().map(project => (
                <div
                    key={project.id}
                    className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                    <div className="flex gap-4">
                        <img
                            src={project.preview}
                            alt={project.name}
                            className="w-24 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className="font-medium">{project.name}</h3>
                                    <p className="text-sm text-gray-500">by {project.author}</p>
                                </div>
                                <button
                                    onClick={() => handleProjectSelect(project)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Use Project
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center text-yellow-500">
                                    <Star className="w-4 h-4 fill-current mr-1" />
                                    {project.stars}
                                </span>
                                <span className={`px-2 py-1 rounded-full ${getDifficultyColor(project.difficulty)}`}>
                                    {project.difficulty}
                                </span>
                                <span className="text-gray-500 flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {new Date(project.lastUpdated).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[1200px] max-w-[90vw] max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Book className="w-5 h-5" />
                            <h2 className="text-xl font-semibold">Project Gallery</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search projects..."
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
                        <select
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                            className="px-4 py-2 border rounded-lg"
                        >
                            <option value="all">All Difficulties</option>
                            <option value={DIFFICULTY_LEVELS.BEGINNER}>Beginner</option>
                            <option value={DIFFICULTY_LEVELS.INTERMEDIATE}>Intermediate</option>
                            <option value={DIFFICULTY_LEVELS.ADVANCED}>Advanced</option>
                        </select>
                        <div className="flex border rounded-lg">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-2 ${viewMode === 'grid' 
                                    ? 'bg-blue-50 text-blue-500' 
                                    : 'hover:bg-gray-50'
                                }`}
                                title="Grid View"
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-2 ${viewMode === 'list' 
                                    ? 'bg-blue-50 text-blue-500' 
                                    : 'hover:bg-gray-50'
                                }`}
                                title="List View"
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
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

                {/* Project List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {filterProjects().length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No projects found matching your criteria.</p>
                        </div>
                    ) : (
                        viewMode === 'grid' ? renderGridView() : renderListView()
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50">
                    <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{filterProjects().length} projects found</span>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectGallery;