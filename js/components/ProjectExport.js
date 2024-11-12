const ProjectExport = ({ project, onClose }) => {
    const [exportFormat, setExportFormat] = React.useState('html');
    const [exportOptions, setExportOptions] = React.useState({
        minify: true,
        includeAssets: true,
        standalone: true,
        optimization: 'balanced'
    });
    const [isExporting, setIsExporting] = React.useState(false);
    const [deployTarget, setDeployTarget] = React.useState('local');

    const exportFormats = [
        { id: 'html', label: 'Standalone HTML', description: 'Single HTML file with everything included' },
        { id: 'zip', label: 'Project Archive', description: 'Complete project with all assets and source files' },
        { id: 'json', label: 'Project Data', description: 'Raw project data in JSON format' }
    ];

    const deployTargets = [
        { id: 'local', label: 'Local Download', description: 'Save to your computer' },
        { id: 'pages', label: 'GitHub Pages', description: 'Deploy to GitHub Pages' },
        { id: 'netlify', label: 'Netlify', description: 'Deploy to Netlify' },
        { id: 'vercel', label: 'Vercel', description: 'Deploy to Vercel' }
    ];

    const handleExport = async () => {
        setIsExporting(true);
        try {
            // In a real implementation, this would handle the export process
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate export
            
            if (deployTarget === 'local') {
                // Generate and download file
                const blob = new Blob([JSON.stringify(project)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${project.name || 'project'}.${exportFormat}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                // Handle deployment
                window.showToast?.('Deployment started...', 'info');
            }

            window.showToast?.('Export completed successfully', 'success');
            onClose();
        } catch (error) {
            window.showToast?.('Export failed: ' + error.message, 'error');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[600px] max-w-full mx-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Export Project</h2>
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

                {/* Export Format */}
                <div className="mb-6">
                    <h3 className="font-medium mb-3">Export Format</h3>
                    <div className="space-y-2">
                        {exportFormats.map(format => (
                            <label
                                key={format.id}
                                className="flex items-start p-3 border rounded cursor-pointer hover:bg-gray-50"
                            >
                                <input
                                    type="radio"
                                    name="format"
                                    value={format.id}
                                    checked={exportFormat === format.id}
                                    onChange={(e) => setExportFormat(e.target.value)}
                                    className="mt-1 mr-3"
                                />
                                <div>
                                    <div className="font-medium">{format.label}</div>
                                    <div className="text-sm text-gray-500">{format.description}</div>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Export Options */}
                <div className="mb-6">
                    <h3 className="font-medium mb-3">Options</h3>
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={exportOptions.minify}
                                onChange={(e) => setExportOptions(prev => ({
                                    ...prev,
                                    minify: e.target.checked
                                }))}
                                className="mr-2"
                            />
                            Minify output
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={exportOptions.includeAssets}
                                onChange={(e) => setExportOptions(prev => ({
                                    ...prev,
                                    includeAssets: e.target.checked
                                }))}
                                className="mr-2"
                            />
                            Include assets
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={exportOptions.standalone}
                                onChange={(e) => setExportOptions(prev => ({
                                    ...prev,
                                    standalone: e.target.checked
                                }))}
                                className="mr-2"
                            />
                            Standalone mode
                        </label>
                        <div>
                            <label className="block text-sm mb-1">Optimization Level</label>
                            <select
                                value={exportOptions.optimization}
                                onChange={(e) => setExportOptions(prev => ({
                                    ...prev,
                                    optimization: e.target.value
                                }))}
                                className="w-full p-2 border rounded"
                            >
                                <option value="none">None</option>
                                <option value="balanced">Balanced</option>
                                <option value="max">Maximum</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Deploy Target */}
                <div className="mb-6">
                    <h3 className="font-medium mb-3">Deploy To</h3>
                    <div className="space-y-2">
                        {deployTargets.map(target => (
                            <label
                                key={target.id}
                                className="flex items-start p-3 border rounded cursor-pointer hover:bg-gray-50"
                            >
                                <input
                                    type="radio"
                                    name="target"
                                    value={target.id}
                                    checked={deployTarget === target.id}
                                    onChange={(e) => setDeployTarget(e.target.value)}
                                    className="mt-1 mr-3"
                                />
                                <div>
                                    <div className="font-medium">{target.label}</div>
                                    <div className="text-sm text-gray-500">{target.description}</div>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isExporting ? 'Exporting...' : 'Export Project'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectExport;