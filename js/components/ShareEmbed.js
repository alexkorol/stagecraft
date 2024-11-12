const ShareEmbed = ({ project, onClose }) => {
    const [shareUrl, setShareUrl] = React.useState('');
    const [embedCode, setEmbedCode] = React.useState('');
    const [shareSettings, setShareSettings] = React.useState({
        access: 'public',
        allowCopy: true,
        allowFork: true,
        expiresIn: 'never',
        password: '',
        embedSize: 'medium',
        autoPlay: false,
        showControls: true
    });

    React.useEffect(() => {
        // Generate share URL and embed code based on settings
        const baseUrl = window.location.origin;
        const projectId = project.id;
        
        const params = new URLSearchParams({
            access: shareSettings.access,
            copy: shareSettings.allowCopy ? '1' : '0',
            fork: shareSettings.allowFork ? '1' : '0',
            expires: shareSettings.expiresIn,
            autoplay: shareSettings.autoPlay ? '1' : '0',
            controls: shareSettings.showControls ? '1' : '0'
        });

        const url = `${baseUrl}/share/${projectId}?${params.toString()}`;
        setShareUrl(url);

        const sizes = {
            small: { width: 400, height: 300 },
            medium: { width: 600, height: 450 },
            large: { width: 800, height: 600 }
        };

        const { width, height } = sizes[shareSettings.embedSize];
        const embedHtml = `<iframe src="${url}/embed" width="${width}" height="${height}" frameborder="0" allowfullscreen></iframe>`;
        setEmbedCode(embedHtml);
    }, [project.id, shareSettings]);

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            window.showToast?.('Copied to clipboard', 'success');
        } catch (error) {
            window.showToast?.('Failed to copy to clipboard', 'error');
        }
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

                {/* Share Settings */}
                <div className="space-y-6">
                    {/* Access Control */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Access</label>
                        <select
                            value={shareSettings.access}
                            onChange={(e) => setShareSettings(prev => ({
                                ...prev,
                                access: e.target.value
                            }))}
                            className="w-full p-2 border rounded"
                        >
                            <option value="public">Public - Anyone with the link</option>
                            <option value="unlisted">Unlisted - Hidden from search</option>
                            <option value="private">Private - Password protected</option>
                        </select>
                    </div>

                    {shareSettings.access === 'private' && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Password</label>
                            <input
                                type="password"
                                value={shareSettings.password}
                                onChange={(e) => setShareSettings(prev => ({
                                    ...prev,
                                    password: e.target.value
                                }))}
                                className="w-full p-2 border rounded"
                                placeholder="Enter password"
                            />
                        </div>
                    )}

                    {/* Permissions */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Permissions</label>
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={shareSettings.allowCopy}
                                    onChange={(e) => setShareSettings(prev => ({
                                        ...prev,
                                        allowCopy: e.target.checked
                                    }))}
                                    className="mr-2"
                                />
                                Allow copying project
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={shareSettings.allowFork}
                                    onChange={(e) => setShareSettings(prev => ({
                                        ...prev,
                                        allowFork: e.target.checked
                                    }))}
                                    className="mr-2"
                                />
                                Allow forking project
                            </label>
                        </div>
                    </div>

                    {/* Expiration */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Link Expiration</label>
                        <select
                            value={shareSettings.expiresIn}
                            onChange={(e) => setShareSettings(prev => ({
                                ...prev,
                                expiresIn: e.target.value
                            }))}
                            className="w-full p-2 border rounded"
                        >
                            <option value="never">Never</option>
                            <option value="1d">1 day</option>
                            <option value="7d">7 days</option>
                            <option value="30d">30 days</option>
                        </select>
                    </div>

                    {/* Share URL */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Share Link</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={shareUrl}
                                readOnly
                                className="flex-1 p-2 border rounded bg-gray-50"
                            />
                            <button
                                onClick={() => copyToClipboard(shareUrl)}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Copy
                            </button>
                        </div>
                    </div>

                    {/* Embed Settings */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Embed Settings</label>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-1">Size</label>
                                    <select
                                        value={shareSettings.embedSize}
                                        onChange={(e) => setShareSettings(prev => ({
                                            ...prev,
                                            embedSize: e.target.value
                                        }))}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="small">Small (400x300)</option>
                                        <option value="medium">Medium (600x450)</option>
                                        <option value="large">Large (800x600)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Options</label>
                                    <div className="space-y-2">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={shareSettings.autoPlay}
                                                onChange={(e) => setShareSettings(prev => ({
                                                    ...prev,
                                                    autoPlay: e.target.checked
                                                }))}
                                                className="mr-2"
                                            />
                                            Auto-play
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={shareSettings.showControls}
                                                onChange={(e) => setShareSettings(prev => ({
                                                    ...prev,
                                                    showControls: e.target.checked
                                                }))}
                                                className="mr-2"
                                            />
                                            Show controls
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm mb-1">Embed Code</label>
                                <div className="flex gap-2">
                                    <textarea
                                        value={embedCode}
                                        readOnly
                                        rows={3}
                                        className="flex-1 p-2 border rounded bg-gray-50 font-mono text-sm"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(embedCode)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareEmbed;