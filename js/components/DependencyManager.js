const DependencyManager = ({ project, onClose, onUpdate }) => {
    const [dependencies, setDependencies] = React.useState({
        libraries: [],
        assets: [],
        plugins: []
    });
    const [isLoading, setIsLoading] = React.useState(true);
    const [activeTab, setActiveTab] = React.useState('libraries');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isInstalling, setIsInstalling] = React.useState(false);

    React.useEffect(() => {
        loadDependencies();
    }, []);

    const loadDependencies = async () => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setDependencies({
                libraries: [
                    { id: 'physics', name: 'Physics Engine', version: '1.2.0', installed: true },
                    { id: 'pathfinding', name: 'Pathfinding', version: '0.8.5', installed: false },
                    { id: 'animation', name: 'Animation System', version: '2.1.0', installed: true }
                ],
                assets: [
                    { id: 'sprites', name: 'Sprite Pack 1', size: '2.5MB', installed: true },
                    { id: 'sounds', name: 'Sound Effects', size: '5MB', installed: false },
                    { id: 'backgrounds', name: 'Background Pack', size: '10MB', installed: true }
                ],
                plugins: [
                    { id: 'collision', name: 'Advanced Collision', version: '1.0.0', installed: true },
                    { id: 'ai', name: 'AI Behaviors', version: '0.5.0', installed: false },
                    { id: 'particles', name: 'Particle System', version: '1.1.0', installed: false }
                ]
            });
        } catch (error) {
            window.showToast?.('Failed to load dependencies: ' + error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleDependency = async (type, id) => {
        setIsInstalling(true);
        try {
            // Simulate installation/uninstallation
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setDependencies(prev => ({
                ...prev,
                [type]: prev[type].map(dep =>
                    dep.id === id ? { ...dep, installed: !dep.installed } : dep
                )
            }));

            window.showToast?.(
                `Successfully ${dependencies[type].find(d => d.id === id).installed ? 'uninstalled' : 'installed'} dependency`,
                'success'
            );
        } catch (error) {
            window.showToast?.('Failed to update dependency: ' + error.message, 'error');
        } finally {
            setIsInstalling(false);
        }
    };

    const filteredDependencies = React.useMemo(() => {
        return dependencies[activeTab].filter(dep =>
            dep.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [dependencies, activeTab, searchQuery]);

    const formatSize = (size) => {
        return size;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[800px] max-w-full mx-4 h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Dependency Manager</h2>
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
                        onClick={() => setActiveTab('libraries')}
                        className={`px-4 py-2 rounded ${
                            activeTab === 'libraries' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                        }`}
                    >
                        Libraries
                    </button>
                    <button
                        onClick={() => setActiveTab('assets')}
                        className={`px-4 py-2 rounded ${
                            activeTab === 'assets' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                        }`}
                    >
                        Assets
                    </button>
                    <button
                        onClick={() => setActiveTab('plugins')}
                        className={`px-4 py-2 rounded ${
                            activeTab === 'plugins' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                        }`}
                    >
                        Plugins
                    </button>
                </div>

                {/* Search */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search dependencies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                {/* Dependency List */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="text-center py-8 text-gray-500">
                            Loading dependencies...
                        </div>
                    ) : filteredDependencies.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No dependencies found
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredDependencies.map(dep => (
                                <div
                                    key={dep.id}
                                    className="border rounded-lg p-4 hover:bg-gray-50"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">{dep.name}</div>
                                            <div className="text-sm text-gray-500">
                                                {dep.version && `Version ${dep.version}`}
                                                {dep.size && ` • ${formatSize(dep.size)}`}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => toggleDependency(activeTab, dep.id)}
                                            disabled={isInstalling}
                                            className={`px-4 py-2 rounded ${
                                                dep.installed
                                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                                    : 'bg-green-500 text-white hover:bg-green-600'
                                            } disabled:opacity-50`}
                                        >
                                            {isInstalling ? 'Processing...' : dep.installed ? 'Uninstall' : 'Install'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Status */}
                <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                    {dependencies[activeTab].filter(d => d.installed).length} installed
                    {' • '}
                    {dependencies[activeTab].length} total
                </div>
            </div>
        </div>
    );
};

export default DependencyManager;