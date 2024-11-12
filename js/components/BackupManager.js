const BackupManager = ({ project, onClose }) => {
    const [backups, setBackups] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isCreatingBackup, setIsCreatingBackup] = React.useState(false);
    const [isRestoring, setIsRestoring] = React.useState(false);
    const [autoBackupSettings, setAutoBackupSettings] = React.useState({
        enabled: true,
        frequency: '1h',
        maxBackups: 10,
        includeAssets: true
    });

    React.useEffect(() => {
        // Simulate loading backup data
        loadBackups();
    }, []);

    const loadBackups = async () => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock backup data
            const mockBackups = Array.from({ length: 5 }, (_, i) => ({
                id: `backup-${i + 1}`,
                timestamp: new Date(Date.now() - i * 86400000).toISOString(),
                size: Math.floor(Math.random() * 1000) + 500,
                type: i === 0 ? 'auto' : i === 1 ? 'manual' : 'auto',
                version: `1.${i}`,
                changes: Math.floor(Math.random() * 20) + 1
            }));

            setBackups(mockBackups);
        } catch (error) {
            window.showToast?.('Failed to load backups: ' + error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const createBackup = async () => {
        setIsCreatingBackup(true);
        try {
            // Simulate backup creation
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const newBackup = {
                id: `backup-${Date.now()}`,
                timestamp: new Date().toISOString(),
                size: Math.floor(Math.random() * 1000) + 500,
                type: 'manual',
                version: '1.0',
                changes: 0
            };

            setBackups(prev => [newBackup, ...prev]);
            window.showToast?.('Backup created successfully', 'success');
        } catch (error) {
            window.showToast?.('Failed to create backup: ' + error.message, 'error');
        } finally {
            setIsCreatingBackup(false);
        }
    };

    const restoreBackup = async (backup) => {
        if (!confirm('Are you sure you want to restore this backup? Current changes will be lost.')) {
            return;
        }

        setIsRestoring(true);
        try {
            // Simulate restore process
            await new Promise(resolve => setTimeout(resolve, 2000));
            window.showToast?.('Backup restored successfully', 'success');
            onClose();
        } catch (error) {
            window.showToast?.('Failed to restore backup: ' + error.message, 'error');
        } finally {
            setIsRestoring(false);
        }
    };

    const deleteBackup = async (backupId) => {
        if (!confirm('Are you sure you want to delete this backup?')) {
            return;
        }

        try {
            // Simulate delete process
            await new Promise(resolve => setTimeout(resolve, 500));
            setBackups(prev => prev.filter(b => b.id !== backupId));
            window.showToast?.('Backup deleted successfully', 'success');
        } catch (error) {
            window.showToast?.('Failed to delete backup: ' + error.message, 'error');
        }
    };

    const formatSize = (bytes) => {
        const kb = bytes / 1024;
        if (kb < 1024) {
            return `${kb.toFixed(1)} KB`;
        }
        const mb = kb / 1024;
        return `${mb.toFixed(1)} MB`;
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[800px] max-w-full mx-4 h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Backup Manager</h2>
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

                {/* Auto Backup Settings */}
                <div className="mb-6 border rounded-lg p-4">
                    <h3 className="font-medium mb-4">Auto Backup Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    checked={autoBackupSettings.enabled}
                                    onChange={(e) => setAutoBackupSettings(prev => ({
                                        ...prev,
                                        enabled: e.target.checked
                                    }))}
                                    className="mr-2"
                                />
                                Enable Auto Backup
                            </label>
                            {autoBackupSettings.enabled && (
                                <>
                                    <div className="mb-2">
                                        <label className="block text-sm mb-1">Frequency</label>
                                        <select
                                            value={autoBackupSettings.frequency}
                                            onChange={(e) => setAutoBackupSettings(prev => ({
                                                ...prev,
                                                frequency: e.target.value
                                            }))}
                                            className="w-full p-2 border rounded"
                                        >
                                            <option value="30m">Every 30 minutes</option>
                                            <option value="1h">Every hour</option>
                                            <option value="6h">Every 6 hours</option>
                                            <option value="12h">Every 12 hours</option>
                                            <option value="24h">Every 24 hours</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1">Max Backups</label>
                                        <input
                                            type="number"
                                            value={autoBackupSettings.maxBackups}
                                            onChange={(e) => setAutoBackupSettings(prev => ({
                                                ...prev,
                                                maxBackups: parseInt(e.target.value)
                                            }))}
                                            min="1"
                                            max="50"
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={autoBackupSettings.includeAssets}
                                    onChange={(e) => setAutoBackupSettings(prev => ({
                                        ...prev,
                                        includeAssets: e.target.checked
                                    }))}
                                    className="mr-2"
                                />
                                Include Assets
                            </label>
                            <p className="text-sm text-gray-500 mt-2">
                                Assets include sprites, sounds, and other media files.
                                Disabling this will reduce backup size but won't backup these files.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Backup List */}
                <div className="flex-1 overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Backup History</h3>
                        <button
                            onClick={createBackup}
                            disabled={isCreatingBackup}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                        >
                            {isCreatingBackup ? 'Creating...' : 'Create Backup'}
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-8 text-gray-500">
                            Loading backups...
                        </div>
                    ) : backups.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No backups found
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {backups.map(backup => (
                                <div
                                    key={backup.id}
                                    className="border rounded-lg p-4 hover:bg-gray-50"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <span className="font-medium">Version {backup.version}</span>
                                            <span className="ml-2 text-sm text-gray-500">
                                                ({backup.type === 'auto' ? 'Auto' : 'Manual'})
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => restoreBackup(backup)}
                                                disabled={isRestoring}
                                                className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                                            >
                                                {isRestoring ? 'Restoring...' : 'Restore'}
                                            </button>
                                            <button
                                                onClick={() => deleteBackup(backup.id)}
                                                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Created: {formatDate(backup.timestamp)}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Size: {formatSize(backup.size)} • Changes: {backup.changes}
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

export default BackupManager;