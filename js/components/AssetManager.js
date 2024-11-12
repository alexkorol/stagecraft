const AssetManager = ({ onClose, onAssetSelect }) => {
    const [activeTab, setActiveTab] = React.useState('sprites');
    const [assets, setAssets] = React.useState({
        sprites: [],
        sounds: [],
        backgrounds: []
    });
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isUploading, setIsUploading] = React.useState(false);
    const fileInputRef = React.useRef();

    const tabs = [
        { id: 'sprites', label: 'Sprites', icon: 'image' },
        { id: 'sounds', label: 'Sounds', icon: 'music' },
        { id: 'backgrounds', label: 'Backgrounds', icon: 'layout' }
    ];

    const handleFileSelect = async (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        setIsUploading(true);
        try {
            // In a real implementation, this would upload to a server
            const newAssets = await Promise.all(files.map(file => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve({
                            id: Date.now(),
                            name: file.name,
                            type: file.type,
                            size: file.size,
                            url: reader.result,
                            dateAdded: new Date().toISOString()
                        });
                    };
                    reader.readAsDataURL(file);
                });
            }));

            setAssets(prev => ({
                ...prev,
                [activeTab]: [...prev[activeTab], ...newAssets]
            }));
        } catch (error) {
            window.showToast?.('Failed to upload assets: ' + error.message, 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleAssetDelete = (assetId) => {
        if (confirm('Are you sure you want to delete this asset?')) {
            setAssets(prev => ({
                ...prev,
                [activeTab]: prev[activeTab].filter(asset => asset.id !== assetId)
            }));
        }
    };

    const filteredAssets = React.useMemo(() => {
        return assets[activeTab].filter(asset =>
            asset.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [assets, activeTab, searchQuery]);

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[900px] max-w-full mx-4 h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Asset Manager</h2>
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
                            placeholder="Search assets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="flex gap-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded flex items-center gap-2 ${
                                    activeTab === tab.id
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredAssets.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No {activeTab} found. Upload some assets to get started!
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredAssets.map(asset => (
                                <div
                                    key={asset.id}
                                    className="border rounded-lg p-2 hover:shadow-lg transition-shadow"
                                >
                                    <div className="aspect-square bg-gray-100 rounded mb-2">
                                        {activeTab === 'sprites' || activeTab === 'backgrounds' ? (
                                            <img
                                                src={asset.url}
                                                alt={asset.name}
                                                className="w-full h-full object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <svg
                                                    className="w-12 h-12"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-2">
                                        <div className="font-medium truncate">{asset.name}</div>
                                        <div className="text-sm text-gray-500">
                                            {formatFileSize(asset.size)}
                                        </div>
                                        <div className="flex justify-between mt-2">
                                            <button
                                                onClick={() => onAssetSelect(asset)}
                                                className="text-blue-500 hover:text-blue-600 text-sm"
                                            >
                                                Use
                                            </button>
                                            <button
                                                onClick={() => handleAssetDelete(asset.id)}
                                                className="text-red-500 hover:text-red-600 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-6 pt-6 border-t flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        {filteredAssets.length} {activeTab} found
                    </div>
                    <div className="flex gap-2">
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept={
                                activeTab === 'sprites' ? 'image/*' :
                                activeTab === 'sounds' ? 'audio/*' :
                                'image/*'
                            }
                            className="hidden"
                            onChange={handleFileSelect}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                        >
                            {isUploading ? 'Uploading...' : 'Upload Assets'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssetManager;