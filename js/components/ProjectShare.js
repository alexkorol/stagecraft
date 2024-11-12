const ProjectShare = ({ onClose, project }) => {
    const [shareUrl, setShareUrl] = React.useState('');
    const [shareMode, setShareMode] = React.useState('view');
    const [expiryTime, setExpiryTime] = React.useState('never');
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [collaborators, setCollaborators] = React.useState([]);
    const [newCollaborator, setNewCollaborator] = React.useState('');

    const generateShareUrl = async () => {
        setIsGenerating(true);
        try {
            // In a real implementation, this would make an API call to create a share link
            const baseUrl = window.location.origin;
            const shareId = Math.random().toString(36).substring(2, 15);
            const url = `${baseUrl}/share/${shareId}?mode=${shareMode}&expires=${expiryTime}`;
            setShareUrl(url);
        } catch (error) {
            window.showToast?.('Failed to generate share link: ' + error.message, 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            window.showToast?.('Share link copied to clipboard', 'success');
        } catch (error) {
            window.showToast?.('Failed to copy to clipboard', 'error');
        }
    };

    const addCollaborator = () => {
        if (!newCollaborator) return;
        
        setCollaborators(prev => [
            ...prev,
            {
                email: newCollaborator,
                role: 'editor',
                added: new Date().toISOString()
            }
        ]);
        setNewCollaborator('');
    };

    const removeCollaborator = (email) => {
        setCollaborators(prev => prev.filter(c => c.email !== email));
    };

    const updateCollaboratorRole = (email, role) => {
        setCollaborators(prev => prev.map(c => 
            c.email === email ? { ...c, role } : c
        ));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[600px] max-w-full mx-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Share Project</h2>
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

                {/* Share Link Section */}
                <div className="mb-6">
                    <h3 className="font-medium mb-3">Share Link</h3>
                    
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <select
                                value={shareMode}
                                onChange={(e) => setShareMode(e.target.value)}
                                className="p-2 border rounded"
                            >
                                <option value="view">View only</option>
                                <option value="edit">Can edit</option>
                                <option value="copy">Can duplicate</option>
                            </select>

                            <select
                                value={expiryTime}
                                onChange={(e) => setExpiryTime(e.target.value)}
                                className="p-2 border rounded"
                            >
                                <option value="never">Never expires</option>
                                <option value="1d">1 day</option>
                                <option value="7d">7 days</option>
                                <option value="30d">30 days</option>
                            </select>

                            <button
                                onClick={generateShareUrl}
                                disabled={isGenerating}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                            >
                                Generate Link
                            </button>
                        </div>

                        {shareUrl && (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={shareUrl}
                                    readOnly
                                    className="flex-1 p-2 border rounded bg-gray-50"
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                    Copy
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Collaborators Section */}
                <div>
                    <h3 className="font-medium mb-3">Collaborators</h3>
                    
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter email address"
                                value={newCollaborator}
                                onChange={(e) => setNewCollaborator(e.target.value)}
                                className="flex-1 p-2 border rounded"
                            />
                            <button
                                onClick={addCollaborator}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Add
                            </button>
                        </div>

                        <div className="space-y-2">
                            {collaborators.map(collaborator => (
                                <div
                                    key={collaborator.email}
                                    className="flex items-center justify-between p-2 border rounded"
                                >
                                    <div>
                                        <div>{collaborator.email}</div>
                                        <div className="text-sm text-gray-500">
                                            Added {new Date(collaborator.added).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={collaborator.role}
                                            onChange={(e) => updateCollaboratorRole(collaborator.email, e.target.value)}
                                            className="p-1 border rounded text-sm"
                                        >
                                            <option value="viewer">Viewer</option>
                                            <option value="editor">Editor</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                        <button
                                            onClick={() => removeCollaborator(collaborator.email)}
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectShare;