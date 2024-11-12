const ProjectProperties = ({ project, onClose, onUpdate }) => {
    const [properties, setProperties] = React.useState({
        name: project.name || '',
        description: project.description || '',
        tags: project.tags || [],
        gridSize: project.gridSize || 8,
        author: project.author || '',
        version: project.version || '1.0.0',
        category: project.category || 'game',
        difficulty: project.difficulty || 'beginner',
        isPublic: project.isPublic || false,
        allowComments: project.allowComments || false,
        allowForks: project.allowForks || false,
        thumbnail: project.thumbnail || null
    });

    const [newTag, setNewTag] = React.useState('');
    const [isUploading, setIsUploading] = React.useState(false);
    const fileInputRef = React.useRef();

    const categories = [
        'game', 'simulation', 'animation', 'story', 'art', 'education', 'other'
    ];

    const difficulties = [
        'beginner', 'intermediate', 'advanced'
    ];

    const handleTagAdd = () => {
        if (newTag && !properties.tags.includes(newTag)) {
            setProperties(prev => ({
                ...prev,
                tags: [...prev.tags, newTag]
            }));
            setNewTag('');
        }
    };

    const handleTagRemove = (tag) => {
        setProperties(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tag)
        }));
    };

    const handleThumbnailUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            // In a real implementation, this would upload to a server
            const reader = new FileReader();
            reader.onloadend = () => {
                setProperties(prev => ({
                    ...prev,
                    thumbnail: reader.result
                }));
                setIsUploading(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            window.showToast?.('Failed to upload thumbnail: ' + error.message, 'error');
            setIsUploading(false);
        }
    };

    const handleSave = () => {
        onUpdate(properties);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[600px] max-w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Project Properties</h2>
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

                <div className="space-y-6">
                    {/* Basic Information */}
                    <div>
                        <h3 className="font-medium mb-4">Basic Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1">Project Name</label>
                                <input
                                    type="text"
                                    value={properties.name}
                                    onChange={(e) => setProperties(prev => ({
                                        ...prev,
                                        name: e.target.value
                                    }))}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-1">Description</label>
                                <textarea
                                    value={properties.description}
                                    onChange={(e) => setProperties(prev => ({
                                        ...prev,
                                        description: e.target.value
                                    }))}
                                    rows={3}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-1">Author</label>
                                <input
                                    type="text"
                                    value={properties.author}
                                    onChange={(e) => setProperties(prev => ({
                                        ...prev,
                                        author: e.target.value
                                    }))}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Project Settings */}
                    <div>
                        <h3 className="font-medium mb-4">Project Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1">Grid Size</label>
                                <select
                                    value={properties.gridSize}
                                    onChange={(e) => setProperties(prev => ({
                                        ...prev,
                                        gridSize: Number(e.target.value)
                                    }))}
                                    className="w-full p-2 border rounded"
                                >
                                    {[6, 8, 10, 12, 16].map(size => (
                                        <option key={size} value={size}>{size}x{size}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm mb-1">Category</label>
                                <select
                                    value={properties.category}
                                    onChange={(e) => setProperties(prev => ({
                                        ...prev,
                                        category: e.target.value
                                    }))}
                                    className="w-full p-2 border rounded"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm mb-1">Difficulty</label>
                                <select
                                    value={properties.difficulty}
                                    onChange={(e) => setProperties(prev => ({
                                        ...prev,
                                        difficulty: e.target.value
                                    }))}
                                    className="w-full p-2 border rounded"
                                >
                                    {difficulties.map(diff => (
                                        <option key={diff} value={diff}>
                                            {diff.charAt(0).toUpperCase() + diff.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <h3 className="font-medium mb-4">Tags</h3>
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    placeholder="Add a tag"
                                    className="flex-1 p-2 border rounded"
                                    onKeyPress={(e) => e.key === 'Enter' && handleTagAdd()}
                                />
                                <button
                                    onClick={handleTagAdd}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {properties.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1"
                                    >
                                        {tag}
                                        <button
                                            onClick={() => handleTagRemove(tag)}
                                            className="text-gray-500 hover:text-red-500"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sharing Options */}
                    <div>
                        <h3 className="font-medium mb-4">Sharing Options</h3>
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={properties.isPublic}
                                    onChange={(e) => setProperties(prev => ({
                                        ...prev,
                                        isPublic: e.target.checked
                                    }))}
                                    className="mr-2"
                                />
                                Make project public
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={properties.allowComments}
                                    onChange={(e) => setProperties(prev => ({
                                        ...prev,
                                        allowComments: e.target.checked
                                    }))}
                                    className="mr-2"
                                />
                                Allow comments
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={properties.allowForks}
                                    onChange={(e) => setProperties(prev => ({
                                        ...prev,
                                        allowForks: e.target.checked
                                    }))}
                                    className="mr-2"
                                />
                                Allow forks
                            </label>
                        </div>
                    </div>

                    {/* Thumbnail */}
                    <div>
                        <h3 className="font-medium mb-4">Thumbnail</h3>
                        <div className="space-y-4">
                            {properties.thumbnail && (
                                <div className="w-32 h-32 border rounded overflow-hidden">
                                    <img
                                        src={properties.thumbnail}
                                        alt="Project thumbnail"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailUpload}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                                >
                                    {isUploading ? 'Uploading...' : 'Upload Thumbnail'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-6 border-t flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectProperties;