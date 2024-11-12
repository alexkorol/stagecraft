const TestRunner = ({ project, onClose }) => {
    const [tests, setTests] = React.useState([]);
    const [isRunning, setIsRunning] = React.useState(false);
    const [selectedTest, setSelectedTest] = React.useState(null);
    const [results, setResults] = React.useState({});
    const [coverage, setCoverage] = React.useState({
        rules: 0,
        characters: 0,
        conditions: 0
    });

    // Mock test data
    React.useEffect(() => {
        setTests([
            {
                id: 'test-1',
                name: 'Basic Movement',
                description: 'Verify character movement in all directions',
                steps: [
                    { type: 'place', character: 'char-1', x: 0, y: 0 },
                    { type: 'wait', duration: 1000 },
                    { type: 'assert', condition: 'position', character: 'char-1', x: 1, y: 0 }
                ]
            },
            {
                id: 'test-2',
                name: 'Collision Detection',
                description: 'Check collision handling between characters',
                steps: [
                    { type: 'place', character: 'char-1', x: 0, y: 0 },
                    { type: 'place', character: 'char-2', x: 1, y: 0 },
                    { type: 'wait', duration: 1000 },
                    { type: 'assert', condition: 'collision', characters: ['char-1', 'char-2'] }
                ]
            },
            {
                id: 'test-3',
                name: 'Rule Execution',
                description: 'Verify rules are executed in correct order',
                steps: [
                    { type: 'setup', rules: ['rule-1', 'rule-2'] },
                    { type: 'trigger', event: 'start' },
                    { type: 'assert', condition: 'ruleExecuted', rule: 'rule-1' },
                    { type: 'assert', condition: 'ruleExecuted', rule: 'rule-2' }
                ]
            }
        ]);
    }, []);

    const runTest = async (test) => {
        setIsRunning(true);
        setResults(prev => ({ ...prev, [test.id]: { status: 'running' } }));

        try {
            // Simulate test execution
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock test results
            const passed = Math.random() > 0.3;
            setResults(prev => ({
                ...prev,
                [test.id]: {
                    status: passed ? 'passed' : 'failed',
                    duration: Math.floor(Math.random() * 1000),
                    error: passed ? null : 'Assertion failed: Expected position (1, 0), got (0, 0)',
                    coverage: {
                        rules: Math.floor(Math.random() * 100),
                        characters: Math.floor(Math.random() * 100),
                        conditions: Math.floor(Math.random() * 100)
                    }
                }
            }));
        } catch (error) {
            setResults(prev => ({
                ...prev,
                [test.id]: { status: 'error', error: error.message }
            }));
        } finally {
            setIsRunning(false);
        }
    };

    const runAllTests = async () => {
        setIsRunning(true);
        for (const test of tests) {
            await runTest(test);
        }
        setIsRunning(false);

        // Calculate overall coverage
        const testResults = Object.values(results);
        if (testResults.length > 0) {
            setCoverage({
                rules: Math.floor(testResults.reduce((acc, r) => acc + (r.coverage?.rules || 0), 0) / testResults.length),
                characters: Math.floor(testResults.reduce((acc, r) => acc + (r.coverage?.characters || 0), 0) / testResults.length),
                conditions: Math.floor(testResults.reduce((acc, r) => acc + (r.coverage?.conditions || 0), 0) / testResults.length)
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[900px] max-w-full mx-4 h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Test Runner</h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={runAllTests}
                            disabled={isRunning}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                        >
                            {isRunning ? 'Running Tests...' : 'Run All Tests'}
                        </button>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="border rounded-lg p-4">
                        <div className="text-sm text-gray-500 mb-1">Rule Coverage</div>
                        <div className="text-2xl font-bold">{coverage.rules}%</div>
                    </div>
                    <div className="border rounded-lg p-4">
                        <div className="text-sm text-gray-500 mb-1">Character Coverage</div>
                        <div className="text-2xl font-bold">{coverage.characters}%</div>
                    </div>
                    <div className="border rounded-lg p-4">
                        <div className="text-sm text-gray-500 mb-1">Condition Coverage</div>
                        <div className="text-2xl font-bold">{coverage.conditions}%</div>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Test List */}
                    <div className="border rounded-lg p-4 overflow-y-auto">
                        <h3 className="font-medium mb-4">Tests</h3>
                        <div className="space-y-2">
                            {tests.map(test => (
                                <div
                                    key={test.id}
                                    className={`p-4 border rounded cursor-pointer hover:bg-gray-50 ${
                                        selectedTest?.id === test.id ? 'border-blue-500 bg-blue-50' : ''
                                    }`}
                                    onClick={() => setSelectedTest(test)}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="font-medium">{test.name}</div>
                                        {results[test.id] && (
                                            <div className={`px-2 py-1 rounded text-xs ${
                                                results[test.id].status === 'passed' ? 'bg-green-100 text-green-800' :
                                                results[test.id].status === 'failed' ? 'bg-red-100 text-red-800' :
                                                results[test.id].status === 'running' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {results[test.id].status}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-600">{test.description}</div>
                                    {results[test.id]?.duration && (
                                        <div className="text-xs text-gray-500 mt-2">
                                            Duration: {results[test.id].duration}ms
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Test Details */}
                    <div className="border rounded-lg p-4">
                        {selectedTest ? (
                            <div>
                                <h3 className="font-medium mb-4">Test Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-sm text-gray-500">Name</div>
                                        <div className="font-medium">{selectedTest.name}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Description</div>
                                        <div>{selectedTest.description}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 mb-2">Steps</div>
                                        <div className="space-y-2">
                                            {selectedTest.steps.map((step, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-2 text-sm"
                                                >
                                                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">
                                                        {index + 1}
                                                    </span>
                                                    <span>{step.type}</span>
                                                    <span className="text-gray-500">
                                                        {JSON.stringify(step)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {results[selectedTest.id]?.error && (
                                        <div className="p-4 bg-red-50 text-red-700 rounded">
                                            {results[selectedTest.id].error}
                                        </div>
                                    )}
                                    <button
                                        onClick={() => runTest(selectedTest)}
                                        disabled={isRunning}
                                        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                                    >
                                        {isRunning ? 'Running...' : 'Run Test'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-12">
                                Select a test to view details
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestRunner;