const ProjectIO = ({ onClose, onImport, onExport }) => {
    const [exportFormat, setExportFormat] = React.useState('json');
    const [exportOptions, setExportOptions] = React.useState({
        includeHistory: true,
        includeSettings: true,
        prettyPrint: true
    });
    const fileInputRef = React.useRef();

    const handleExport = async () => {
        try {
            const result = await onExport(exportFormat, exportOptions);
            if (result) {
                window.showToast?.('Project exported successfully', 'success');
                onClose();
            }
        } catch (error) {
            window.showToast?.('Failed to export project: ' + error.message, 'error');
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            await onImport(file);
            window.showToast?.('Project imported successfully', 'success');
            onClose();
        } catch (error) {
            window.showToast?.('Failed to import project: ' + error.message, 'error');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[500px] max-w-full mx-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Import/Export Project</h2>
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

                {/* Export Section */}
                <div className="mb-6">
                    <h3 className="font-medium mb-3">Export Project</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm mb-1">Format</label>
                            <select
                                value={exportFormat}
                                onChange={(e) => setExportFormat(e.target.value)}
                                className="w-full p-2 border rounded"
                            >
                                <option value="json">JSON</option>
                                <option value="html">Standalone HTML</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm">Options</label>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="includeHistory"
                                    checked={exportOptions.includeHistory}
                                    onChange={(e) => setExportOptions(prev => ({
                                        ...prev,
                                        includeHistory: e.target.checked
                                    }))}
                                    className="mr-2"
                                />
                                <label htmlFor="includeHistory">Include undo/redo history</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="includeSettings"
                                    checked={exportOptions.includeSettings}
                                    onChange={(e) => setExportOptions(prev => ({
                                        ...prev,
                                        includeSettings: e.target.checked
                                    }))}
                                    className="mr-2"
                                />
                                <label htmlFor="includeSettings">Include project settings</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="prettyPrint"
                                    checked={exportOptions.prettyPrint}
                                    onChange={(e) => setExportOptions(prev => ({
                                        ...prev,
                                        prettyPrint: e.target.checked
                                    }))}
                                    className="mr-2"
                                />
                                <label htmlFor="prettyPrint">Pretty print output</label>
                            </div>
                        </div>

                        <button
                            onClick={handleExport}
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Export Project
                        </button>
                    </div>
                </div>

                {/* Import Section */}
                <div>
                    <h3 className="font-medium mb-3">Import Project</h3>
                    
                    <div className="space-y-4">
                        <div className="border-2 border-dashed rounded-lg p-4 text-center">
                            <p className="text-gray-600 mb-2">
                                Drag and drop a project file here or
                            </p>
                            <button
                                onClick={handleImportClick}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Choose File
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".json,.html"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>

                        <div className="text-sm text-gray-500">
                            Supported formats: .json, .html (standalone projects)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectIO;