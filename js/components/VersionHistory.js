const VersionHistory = ({ project, onClose, onRestore }) => {
    const [versions, setVersions] = React.useState([]);
    const [selectedVersion, setSelectedVersion] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [compareMode, setCompareMode] = React.useState(false);
    const [compareVersion, setCompareVersion] = React.useState(null);

    // Mock version history data
    React.useEffect(() => {
        const mockVersions = [
            {
                id: 'v1.0.0',
                timestamp: new Date(Date.now() - 86400000 * 7).toISOString(),
                author: 'John Doe',
                changes: [
                    'Initial project setup',
                    'Added basic character movement',
                    'Created first rule set'
                ],
                snapshot: { /* Project state */ }
            },
            {
                id: 'v1.1.0',
                timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
                author: 'Jane Smith',
                changes: [
                    'Added collision detection',
                    'Improved character sprites',
                    'Fixed movement bug'
                ],
                snapshot: { /* Project state */ }
            },
            {
                id: 'v1.2.0',
                timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
                author: 'John Doe',
                changes: [
                    'Added new game mechanics',
                    'Updated rule system',
                    'Performance improvements'
                ],
                snapshot: { /* Project state */ }
            }
        ];

        setTimeout(() => {
            setVersions(mockVersions);
            setIsLoading(false);
        }, 1000);
    }, []);

    const handleRestore = async () => {
        if (!selectedVersion) return;

        try {
            // In a real implementation, this would restore the project state
            await onRestore(selectedVersion.snapshot);
            window.showToast?.('Project restored successfully', 'success');
            onClose();
        } catch (error) {
            window.showToast?.('Failed to restore project: ' + error.message, 'error');
        }
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    const renderDiff = (v1, v2) => {
        // In a real implementation, this would show actual differences
        return (
            <div className="border rounded p-4 bg-gray-50">
                <div className="text-sm font-mono space-y-1">
                    <div className="text-red-500">- Removed old rule</div>
                    <div className="text-green-500">+ Added new feature</div>
                    <div className="text-yellow-500">~ Modified character properties</div>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6">
                    Loading version history...
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[800px] max-w-full mx-4 h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Version History</h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setCompareMode(!compareMode)}
                            className={`px-4 py-2 rounded ${
                                compareMode ? 'bg-blue-500 text-white' : 'bg-gray-100'
                            }`}
                        >
                            Compare Versions
                        </button>
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
                </div>

                <div className="flex-1 overflow-y-auto">
                    {compareMode ? (
                        <div className="grid grid-cols-2 gap-4">
                            {/* Version Selection */}
                            <div>
                                <h3 className="font-medium mb-3">Base Version</h3>
                                <select
                                    value={selectedVersion?.id || ''}
                                    onChange={(e) => setSelectedVersion(
                                        versions.find(v => v.id === e.target.value)
                                    )}
                                    className="w-full p-2 border rounded mb-4"
                                >
                                    <option value="">Select version...</option>
                                    {versions.map(version => (
                                        <option key={version.id} value={version.id}>
                                            {version.id} - {formatDate(version.timestamp)}
                                        </option>
                                    ))}
                                </select>

                                <h3 className="font-medium mb-3">Compare With</h3>
                                <select
                                    value={compareVersion?.id || ''}
                                    onChange={(e) => setCompareVersion(
                                        versions.find(v => v.id === e.target.value)
                                    )}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Select version...</option>
                                    {versions.map(version => (
                                        <option
                                            key={version.id}
                                            value={version.id}
                                            disabled={version.id === selectedVersion?.id}
                                        >
                                            {version.id} - {formatDate(version.timestamp)}
                                        </option>
                                    ))}
                                </select>

                                {selectedVersion && compareVersion && (
                                    <div className="mt-4">
                                        {renderDiff(selectedVersion, compareVersion)}
                                    </div>
                                )}
                            </div>

                            {/* Diff View */}
                            <div>
                                {selectedVersion && compareVersion && (
                                    <div className="border rounded p-4">
                                        <h3 className="font-medium mb-3">Changes</h3>
                                        {/* Diff visualization would go here */}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {versions.map(version => (
                                <div
                                    key={version.id}
                                    className={`border rounded p-4 cursor-pointer hover:bg-gray-50 ${
                                        selectedVersion?.id === version.id ? 'border-blue-500 bg-blue-50' : ''
                                    }`}
                                    onClick={() => setSelectedVersion(version)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-medium">{version.id}</h3>
                                            <div className="text-sm text-gray-500">
                                                {formatDate(version.timestamp)} by {version.author}
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {version.changes.length} changes
                                        </div>
                                    </div>
                                    <ul className="list-disc list-inside text-sm text-gray-600">
                                        {version.changes.map((change, index) => (
                                            <li key={index}>{change}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-6 pt-6 border-t flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    {selectedVersion && !compareMode && (
                        <button
                            onClick={handleRestore}
                            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Restore This Version
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VersionHistory;