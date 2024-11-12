const App = () => {
    const [project, setProject] = React.useState(null);
    const [selectedCharacter, setSelectedCharacter] = React.useState(null);
    const [isRunning, setIsRunning] = React.useState(false);
    const [showSpriteEditor, setShowSpriteEditor] = React.useState(false);
    const [showRuleEditor, setShowRuleEditor] = React.useState(false);
    const [showProjectManager, setShowProjectManager] = React.useState(false);

    React.useEffect(() => {
        // Load current project on mount
        const currentProject = StorageManager.getCurrentProject();
        if (currentProject) {
            setProject(currentProject);
        } else {
            handleNewProject();
        }
    }, []);

    const handleNewProject = () => {
        const newProject = StorageManager.createNewProject();
        setProject(newProject);
        setSelectedCharacter(null);
    };

    const handleSaveProject = () => {
        if (project) {
            const updatedProject = {
                ...project,
                modified: new Date().toISOString()
            };
            StorageManager.saveProject(updatedProject);
            setProject(updatedProject);
        }
    };

    const handleExportProject = () => {
        if (project) {
            StorageManager.exportProject(project);
        }
    };

    const handleImportProject = async (file) => {
        try {
            const importedProject = await StorageManager.importProject(file);
            setProject(importedProject);
            setSelectedCharacter(null);
        } catch (error) {
            alert('Failed to import project: ' + error.message);
        }
    };

    const handleAddCharacter = (spriteData) => {
        const newCharacter = {
            id: Date.now().toString(),
            sprite: spriteData,
            x: -1,
            y: -1,
            rules: []
        };

        const updatedProject = {
            ...project,
            characters: [...project.characters, newCharacter]
        };

        setProject(updatedProject);
        setSelectedCharacter(newCharacter);
        handleSaveProject();
        setShowSpriteEditor(false);
    };

    const handleAddRule = (ruleData) => {
        if (!selectedCharacter) return;

        const newRule = {
            id: Date.now().toString(),
            characterId: selectedCharacter.id,
            ...ruleData
        };

        const updatedProject = {
            ...project,
            rules: [...project.rules, newRule]
        };

        setProject(updatedProject);
        handleSaveProject();
        setShowRuleEditor(false);
    };

    const handleDeleteCharacter = (characterId) => {
        const updatedProject = {
            ...project,
            characters: project.characters.filter(char => char.id !== characterId),
            rules: project.rules.filter(rule => rule.characterId !== characterId)
        };

        setProject(updatedProject);
        if (selectedCharacter?.id === characterId) {
            setSelectedCharacter(null);
        }
        handleSaveProject();
    };

    const handleCellClick = (x, y) => {
        if (!selectedCharacter || isRunning) return;

        const updatedProject = {
            ...project,
            characters: project.characters.map(char =>
                char.id === selectedCharacter.id
                    ? { ...char, x, y }
                    : char
            )
        };

        setProject(updatedProject);
        handleSaveProject();
    };

    const toggleSimulation = () => {
        setIsRunning(!isRunning);
    };

    if (!project) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 py-6 px-4">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">StageCraft Creator</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowProjectManager(true)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Projects
                        </button>
                        <button
                            onClick={handleSaveProject}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Save
                        </button>
                    </div>
                </header>

                <main className="flex gap-6">
                    <div className="flex-1">
                        <Grid
                            project={project}
                            onCellClick={handleCellClick}
                            isRunning={isRunning}
                        />
                        <Controls
                            isRunning={isRunning}
                            onToggleSimulation={toggleSimulation}
                        />
                    </div>

                    <div className="w-64">
                        <CharacterPalette
                            characters={project.characters}
                            selectedCharacter={selectedCharacter}
                            onSelectCharacter={setSelectedCharacter}
                            onAddCharacter={() => setShowSpriteEditor(true)}
                            onDeleteCharacter={handleDeleteCharacter}
                        />

                        {selectedCharacter && (
                            <button
                                onClick={() => setShowRuleEditor(true)}
                                className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Add Rule
                            </button>
                        )}

                        <div className="mt-4">
                            <h3 className="font-medium mb-2">Rules</h3>
                            <RulesList
                                rules={project.rules}
                                characters={project.characters}
                                selectedCharacterId={selectedCharacter?.id}
                            />
                        </div>
                    </div>
                </main>
            </div>

            {showSpriteEditor && (
                <SpriteEditor
                    onSave={handleAddCharacter}
                    onCancel={() => setShowSpriteEditor(false)}
                />
            )}

            {showRuleEditor && selectedCharacter && (
                <RuleEditor
                    character={selectedCharacter}
                    onSave={handleAddRule}
                    onCancel={() => setShowRuleEditor(false)}
                />
            )}

            {showProjectManager && (
                <ProjectManager
                    currentProject={project}
                    onClose={() => setShowProjectManager(false)}
                    onNew={handleNewProject}
                    onLoad={setProject}
                    onImport={handleImportProject}
                    onExport={handleExportProject}
                />
            )}
        </div>
    );
};

export default App;