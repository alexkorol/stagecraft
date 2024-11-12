const ProjectManager = ({
    currentProject,
    onClose,
    onNew,
    onLoad,
    onImport,
    onExport
}) => {
    const [projects, setProjects] = React.useState([]);
    const fileInputRef = React.useRef();

    React.useEffect(() => {
        setProjects(StorageManager.getAllProjects());
    }, []);

    const handleNewProject = () => {
        const name = prompt('Enter project name:');
        if (name) {
            onNew(name);
            onClose();
        }
    };

    const handleDeleteProject = (projectId) => {
        if (confirm('Are you sure you want to delete this project?')) {
            StorageManager.deleteProject(projectId);
            setProjects(StorageManager.getAllProjects());
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = async (event) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                await onImport(file);
                onClose();
            } catch (error) {
                alert('Failed to import project: ' + error.message);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Projects</h2>
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

                {/* Project List */}
                <div className="flex-1 overflow-y-auto mb-4">
                    {projects.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No projects yet. Create a new one to get started!
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {projects.map(project => (
                                <div
                                    key={project.id}
                                    className={`p-4 border rounded hover:bg-gray-50 ${
                                        currentProject?.id === project.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : ''
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">
                                                {project.name || 'Untitled Project'}
                                            </h3>
                                            <div className="text-sm text-gray-500">
                                                Created: {new Date(project.created).toLocaleDateString()}
                                                <br />
                                                Modified: {new Date(project.modified).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onLoad(project)}
                                                className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
                                            >
                                                Load
                                            </button>
                                            <button
                                                onClick={() => onExport(project)}
                                                className="px-3 py-1 text-sm rounded bg-gray-500 text-white hover:bg-gray-600"
                                            >
                                                Export
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProject(project.id)}
                                                className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
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

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                    <button
                        onClick={handleNewProject}
                        className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        New Project
                    </button>
                    <button
                        onClick={handleImportClick}
                        className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 flex items-center gap-2"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                            />
                        </svg>
                        Import Project
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProjectManager;