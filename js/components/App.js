const App = () => {
    const [project, setProject] = React.useState({
        id: 'default',
        name: 'Untitled Project',
        gridSize: 8,
        characters: [],
        rules: [],
        settings: {
            showGrid: true,
            snapToGrid: true,
            autoSave: true
        }
    });

    const [selectedCharacter, setSelectedCharacter] = React.useState(null);
    const [isRunning, setIsRunning] = React.useState(false);
    const [activeModal, setActiveModal] = React.useState(null);
    const [showTutorial, setShowTutorial] = React.useState(true);

    // Initialize managers
    const simulationEngine = React.useRef(null);
    const undoManager = useUndoManager(project);
    const { addToast } = useToasts();

    React.useEffect(() => {
        // Load last project or create new one
        const savedProject = StorageManager.getCurrentProject();
        if (savedProject) {
            setProject(savedProject);
        }

        // Check if tutorial has been completed
        const tutorialCompleted = localStorage.getItem('tutorial_completed');
        setShowTutorial(!tutorialCompleted);
    }, []);

    React.useEffect(() => {
        if (project.settings.autoSave) {
            StorageManager.saveProject(project);
        }
    }, [project]);

    const handleAddCharacter = (spriteData) => {
        const newCharacter = {
            id: Date.now().toString(),
            sprite: spriteData,
            x: -1,
            y: -1,
            rules: []
        };

        setProject(prev => ({
            ...prev,
            characters: [...prev.characters, newCharacter]
        }));
        setSelectedCharacter(newCharacter);
        addToast('Character created successfully', 'success');
    };

    const handleAddRule = (ruleData) => {
        if (!selectedCharacter) return;

        const newRule = {
            id: Date.now().toString(),
            characterId: selectedCharacter.id,
            ...ruleData
        };

        setProject(prev => ({
            ...prev,
            rules: [...prev.rules, newRule]
        }));
        addToast('Rule added successfully', 'success');
    };

    const handleDeleteCharacter = (characterId) => {
        setProject(prev => ({
            ...prev,
            characters: prev.characters.filter(char => char.id !== characterId),
            rules: prev.rules.filter(rule => rule.characterId !== characterId)
        }));

        if (selectedCharacter?.id === characterId) {
            setSelectedCharacter(null);
        }
        addToast('Character deleted', 'success');
    };

    const handleCellClick = (x, y) => {
        if (!selectedCharacter || isRunning) return;

        setProject(prev => ({
            ...prev,
            characters: prev.characters.map(char =>
                char.id === selectedCharacter.id
                    ? { ...char, x, y }
                    : char
            )
        }));
    };

    const toggleSimulation = () => {
        if (isRunning) {
            simulationEngine.current?.stop();
        } else {
            simulationEngine.current = new SimulationEngine(project, (updatedProject) => {
                setProject(updatedProject);
            });
            simulationEngine.current.start();
        }
        setIsRunning(!isRunning);
    };

    const openModal = (modalName) => {
        setActiveModal(modalName);
    };

    const closeModal = () => {
        setActiveModal(null);
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">StageCraft Creator</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={() => openModal('settings')}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Settings
                        </button>
                        <button
                            onClick={() => openModal('help')}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Help
                        </button>
                    </div>
                </header>

                {/* Main Content */}
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
                            onAddCharacter={() => openModal('spriteEditor')}
                            onDeleteCharacter={handleDeleteCharacter}
                        />

                        {selectedCharacter && (
                            <button
                                onClick={() => openModal('ruleEditor')}
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

            {/* Modals */}
            {activeModal === 'spriteEditor' && (
                <SpriteEditor
                    onSave={handleAddCharacter}
                    onClose={closeModal}
                />
            )}

            {activeModal === 'ruleEditor' && selectedCharacter && (
                <RuleEditor
                    character={selectedCharacter}
                    onSave={handleAddRule}
                    onClose={closeModal}
                />
            )}

            {activeModal === 'settings' && (
                <Settings
                    project={project}
                    onClose={closeModal}
                    onUpdate={setProject}
                />
            )}

            {activeModal === 'help' && (
                <Help onClose={closeModal} />
            )}

            {showTutorial && (
                <Tutorial
                    onClose={() => setShowTutorial(false)}
                    onComplete={() => {
                        localStorage.setItem('tutorial_completed', 'true');
                        setShowTutorial(false);
                    }}
                />
            )}

            {/* Toast Container */}
            <ToastContainer />
        </div>
    );
};

export default App;
