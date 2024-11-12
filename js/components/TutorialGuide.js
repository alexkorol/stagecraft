const TutorialGuide = ({ onClose }) => {
    const [currentTutorial, setCurrentTutorial] = React.useState(null);
    const [progress, setProgress] = React.useState({});
    const [activeStep, setActiveStep] = React.useState(0);

    const tutorials = [
        {
            id: 'basics',
            title: 'Getting Started',
            description: 'Learn the basic concepts of StageCraft',
            duration: '10 min',
            difficulty: 'beginner',
            steps: [
                {
                    title: 'Welcome to StageCraft',
                    content: 'Learn how to create interactive games and simulations using visual programming.',
                    action: 'next'
                },
                {
                    title: 'Creating Characters',
                    content: 'Click "Add Character" to open the sprite editor and create your first character.',
                    action: 'create_character',
                    target: '.add-character-btn'
                },
                {
                    title: 'Placing Characters',
                    content: 'Click on the grid to place your character.',
                    action: 'place_character',
                    target: '.grid-cell'
                },
                {
                    title: 'Creating Rules',
                    content: 'Add rules to define how your character behaves.',
                    action: 'create_rule',
                    target: '.add-rule-btn'
                }
            ]
        },
        {
            id: 'game-creation',
            title: 'Creating Your First Game',
            description: 'Build a simple chase game',
            duration: '20 min',
            difficulty: 'intermediate',
            steps: [
                {
                    title: 'Game Setup',
                    content: 'Create two characters: a player and an enemy.',
                    action: 'create_multiple'
                },
                {
                    title: 'Player Movement',
                    content: 'Add rules for keyboard-controlled movement.',
                    action: 'add_controls'
                },
                {
                    title: 'Enemy AI',
                    content: 'Create rules for enemy movement towards the player.',
                    action: 'add_ai'
                },
                {
                    title: 'Winning Condition',
                    content: 'Add rules for game completion.',
                    action: 'add_condition'
                }
            ]
        }
    ];

    const startTutorial = (tutorial) => {
        setCurrentTutorial(tutorial);
        setActiveStep(0);
        setProgress(prev => ({
            ...prev,
            [tutorial.id]: { started: true, currentStep: 0 }
        }));
    };

    const nextStep = () => {
        if (!currentTutorial) return;

        const nextStepIndex = activeStep + 1;
        if (nextStepIndex < currentTutorial.steps.length) {
            setActiveStep(nextStepIndex);
            setProgress(prev => ({
                ...prev,
                [currentTutorial.id]: { ...prev[currentTutorial.id], currentStep: nextStepIndex }
            }));
        } else {
            // Tutorial completed
            setProgress(prev => ({
                ...prev,
                [currentTutorial.id]: { ...prev[currentTutorial.id], completed: true }
            }));
            setCurrentTutorial(null);
        }
    };

    const prevStep = () => {
        if (!currentTutorial || activeStep === 0) return;
        setActiveStep(activeStep - 1);
        setProgress(prev => ({
            ...prev,
            [currentTutorial.id]: { ...prev[currentTutorial.id], currentStep: activeStep - 1 }
        }));
    };

    const renderDifficultyBadge = (difficulty) => {
        const colors = {
            beginner: 'bg-green-100 text-green-800',
            intermediate: 'bg-yellow-100 text-yellow-800',
            advanced: 'bg-red-100 text-red-800'
        };

        return (
            <span className={`px-2 py-1 rounded text-xs ${colors[difficulty]}`}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </span>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[800px] max-w-full mx-4 h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Tutorials</h2>
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

                {currentTutorial ? (
                    <div className="flex-1 flex flex-col">
                        {/* Tutorial Progress */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium">{currentTutorial.title}</h3>
                                <div className="text-sm text-gray-500">
                                    Step {activeStep + 1} of {currentTutorial.steps.length}
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all"
                                    style={{
                                        width: `${((activeStep + 1) / currentTutorial.steps.length) * 100}%`
                                    }}
                                />
                            </div>
                        </div>

                        {/* Step Content */}
                        <div className="flex-1 border rounded-lg p-6 mb-6">
                            <h4 className="text-lg font-medium mb-4">
                                {currentTutorial.steps[activeStep].title}
                            </h4>
                            <p className="text-gray-600 mb-4">
                                {currentTutorial.steps[activeStep].content}
                            </p>
                            {currentTutorial.steps[activeStep].action !== 'next' && (
                                <div className="p-4 bg-blue-50 text-blue-700 rounded">
                                    Complete this action to continue
                                </div>
                            )}
                        </div>

                        {/* Navigation */}
                        <div className="flex justify-between">
                            <button
                                onClick={prevStep}
                                disabled={activeStep === 0}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={nextStep}
                                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                {activeStep === currentTutorial.steps.length - 1 ? 'Finish' : 'Next'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {tutorials.map(tutorial => (
                                <div
                                    key={tutorial.id}
                                    className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-medium">{tutorial.title}</h3>
                                        {renderDifficultyBadge(tutorial.difficulty)}
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4">
                                        {tutorial.description}
                                    </p>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-sm text-gray-500">
                                            Duration: {tutorial.duration}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {tutorial.steps.length} steps
                                        </div>
                                    </div>
                                    {progress[tutorial.id]?.completed ? (
                                        <div className="flex items-center gap-2 text-green-600">
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
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            <span>Completed</span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => startTutorial(tutorial)}
                                            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            {progress[tutorial.id]?.started ? 'Continue' : 'Start Tutorial'}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TutorialGuide;