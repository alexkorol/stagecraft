const ProjectDebugger = ({ project, onClose }) => {
    const [isRunning, setIsRunning] = React.useState(false);
    const [breakpoints, setBreakpoints] = React.useState([]);
    const [logs, setLogs] = React.useState([]);
    const [selectedCharacter, setSelectedCharacter] = React.useState(null);
    const [watchVariables, setWatchVariables] = React.useState([]);
    const [currentStep, setCurrentStep] = React.useState(0);

    const addBreakpoint = (ruleId) => {
        setBreakpoints(prev => [...prev, ruleId]);
    };

    const removeBreakpoint = (ruleId) => {
        setBreakpoints(prev => prev.filter(id => id !== ruleId));
    };

    const addWatchVariable = (variable) => {
        setWatchVariables(prev => [...prev, variable]);
    };

    const removeWatchVariable = (variable) => {
        setWatchVariables(prev => prev.filter(v => v !== variable));
    };

    const addLog = (message, type = 'info') => {
        setLogs(prev => [...prev, {
            id: Date.now(),
            message,
            type,
            timestamp: new Date().toISOString()
        }]);
    };

    const clearLogs = () => {
        setLogs([]);
    };

    const stepForward = () => {
        setCurrentStep(prev => prev + 1);
        // Simulate rule execution
        addLog('Executing step ' + (currentStep + 1));
    };

    const stepBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            addLog('Stepping back to step ' + (currentStep - 1));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-[1000px] max-w-full mx-4 h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">Project Debugger</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsRunning(!isRunning)}
                            className={`px-4 py-2 rounded ${
                                isRunning ? 'bg-red-500' : 'bg-green-500'
                            } text-white`}
                        >
                            {isRunning ? 'Stop' : 'Start'} Debugging
                        </button>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Left Panel - Rules and Breakpoints */}
                    <div className="w-64 border-r flex flex-col">
                        <div className="p-4 border-b">
                            <h3 className="font-medium mb-2">Rules</h3>
                            <div className="space-y-2">
                                {project.rules.map(rule => (
                                    <div
                                        key={rule.id}
                                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                                    >
                                        <span>Rule {rule.id}</span>
                                        <button
                                            onClick={() => breakpoints.includes(rule.id) ?
                                                removeBreakpoint(rule.id) :
                                                addBreakpoint(rule.id)
                                            }
                                            className={`w-4 h-4 rounded-full ${
                                                breakpoints.includes(rule.id) ? 'bg-red-500' : 'bg-gray-300'
                                            }`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 border-b flex-1 overflow-y-auto">
                            <h3 className="font-medium mb-2">Watch Variables</h3>
                            <div className="space-y-2">
                                {watchVariables.map(variable => (
                                    <div
                                        key={variable}
                                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                    >
                                        <span>{variable}</span>
                                        <button
                                            onClick={() => removeWatchVariable(variable)}
                                            className="text-red-500"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => {
                                        const variable = prompt('Enter variable name:');
                                        if (variable) addWatchVariable(variable);
                                    }}
                                    className="w-full px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                    Add Variable
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Center Panel - Simulation View */}
                    <div className="flex-1 flex flex-col">
                        <div className="p-4 border-b">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={stepBack}
                                        disabled={currentStep === 0}
                                        className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                                    >
                                        Step Back
                                    </button>
                                    <button
                                        onClick={stepForward}
                                        className="px-2 py-1 bg-gray-200 rounded"
                                    >
                                        Step Forward
                                    </button>
                                    <span className="text-sm">Step {currentStep}</span>
                                </div>
                            </div>
                            {/* Grid View */}
                            <div className="border rounded p-4">
                                {/* Simulation grid would go here */}
                                <div className="text-center text-gray-500">
                                    Simulation View
                                </div>
                            </div>
                        </div>

                        {/* Character State */}
                        <div className="p-4 border-b">
                            <h3 className="font-medium mb-2">Character State</h3>
                            <select
                                value={selectedCharacter?.id || ''}
                                onChange={(e) => setSelectedCharacter(
                                    project.characters.find(c => c.id === e.target.value)
                                )}
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Select a character...</option>
                                {project.characters.map(char => (
                                    <option key={char.id} value={char.id}>
                                        Character {char.id}
                                    </option>
                                ))}
                            </select>
                            {selectedCharacter && (
                                <div className="mt-2 p-2 bg-gray-50 rounded">
                                    <pre className="text-sm">
                                        {JSON.stringify(selectedCharacter, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel - Console */}
                    <div className="w-80 border-l flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="font-medium">Console</h3>
                            <button
                                onClick={clearLogs}
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                Clear
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
                            {logs.map(log => (
                                <div
                                    key={log.id}
                                    className={`mb-2 ${
                                        log.type === 'error' ? 'text-red-500' :
                                        log.type === 'warning' ? 'text-yellow-500' :
                                        'text-gray-700'
                                    }`}
                                >
                                    <span className="text-gray-400">
                                        {new Date(log.timestamp).toLocaleTimeString()}
                                    </span>
                                    {' '}
                                    {log.message}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDebugger;