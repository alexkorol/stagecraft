const CommunityHub = ({ onClose }) => {
    const [activeTab, setActiveTab] = React.useState('explore');
    const [projects, setProjects] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [filter, setFilter] = React.useState('trending');
    const [searchQuery, setSearchQuery] = React.useState('');

    React.useEffect(() => {
        loadProjects();
    }, [filter]);

    const loadProjects = async () => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock project data
            setProjects([
                {
                    id: '1',
                    title: 'Platform Adventure',
                    author: 'JohnDoe',
                    description: 'A classic platformer with custom physics.',
                    thumbnail: '/thumbnails/platform.png',
                    likes: 245,
                    views: 1200,
                    forks: 34,
                    tags: ['game', 'platformer', 'physics'],
                    createdAt: '2024-01-15T10:30:00Z',
                    featured: true
                },
                {
                    id: '2',
                    title: 'Puzzle Solver',
                    author: 'JaneSmith',
                    description: 'AI-powered puzzle solving simulation.',
                    thumbnail: '/thumbnails/puzzle.png',
                    likes: 189,
                    views: 890,
                    forks: 23,
                    tags: ['simulation', 'ai', 'puzzle'],
                    createdAt: '2024-01-14T15:45:00Z'
                },
                // Add more mock projects...
            ]);
        } catch (error) {
            window.showToast?.('Failed to load projects: ' + error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const handleLike = async (projectId) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            
            setProjects(prev =>
                prev.map(project =>
                    project.id === projectId
                        ? { ...project, likes: project.likes + 1 }
                        : project
                )
            );
        } catch (error) {
            window.showToast?.('Failed to like project: ' + error.message, 'error');
        }
    };

    const handleFork = async (projectId) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            window.showToast?.('Project forked successfully', 'success');
        } catch (error) {
            window.showToast?.('Failed to fork project: ' + error.message, 'error');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[1000px] max-w-full mx-4 h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Community Hub</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('explore')}
                        className={`px-4 py-2 rounded ${
                            activeTab === 'explore' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                        }`}
                    >
                        Explore
                    </button>
                    <button
                        onClick={() => setActiveTab('my-projects')}
                        className={`px-4 py-2 rounded ${
                            activeTab === 'my-projects' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                        }`}
                    >
                        My Projects
                    </button>
                    <button
                        onClick={() => setActiveTab('favorites')}
                        className={`px-4 py-2 rounded ${
                            activeTab === 'favorites' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                        }`}
                    >
                        Favorites
                    </button>
                </div>

                {/* Filters and Search */}
                <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="p-2 border rounded"
                    >
                        <option value="trending">Trending</option>
                        <option value="newest">Newest</option>
                        <option value="popular">Most Popular</option>
                        <option value="featured">Featured</option>
                    </select>
                </div>

                {/* Project Grid */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="text-center py-8 text-gray-500">
                            Loading projects...
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map(project => (
                                <div
                                    key={project.id}
                                    className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    {/* Project Thumbnail */}
                                    <div className="aspect-video bg-gray-100">
                                        <img
                                            src={project.thumbnail}
                                            alt={project.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Project Info */}
                                    <div className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="font-bold">{project.title}</h3>
                                                <div className="text-sm text-gray-500">
                                                    by {project.author}
                                                </div>
                                            </div>
                                            {project.featured && (
                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                        
                                        <p className="text-sm text-gray-600 mb-4">
                                            {project.description}
                                        </p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {project.tags.map(tag => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => handleLike(project.id)}
                                                    className="flex items-center gap-1 hover:text-blue-500"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                    {project.likes}
                                                </button>
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    {project.views}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleFork(project.id)}
                                                className="flex items-center gap-1 hover:text-blue-500"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                                </svg>
                                                Fork ({project.forks})
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommunityHub;