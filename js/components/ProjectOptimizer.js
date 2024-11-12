const ProjectOptimizer = ({ project, onClose, onOptimize }) => {
    const [isAnalyzing, setIsAnalyzing] = React.useState(true);
    const [isOptimizing, setIsOptimizing] = React.useState(false);
    const [analysis, setAnalysis] = React.useState(null);
    const [selectedOptimizations, setSelectedOptimizations] = React.useState([]);

    React.useEffect(() => {
        analyzeProject();
    }, []);

    const analyzeProject = async () => {
        setIsAnalyzing(true);
        try {
            // Simulate project analysis
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setAnalysis({
                unusedAssets: [
                    { type: 'sprite', name: 'unused_sprite_1.png', size: 45678 },
                    { type: 'sound', name: 'unused_sound.mp3', size: 123456 }
                ],
                duplicateRules: [
                    { id: 'rule1', character: 'Player', condition: 'Move Right' },
                    { id: 'rule2', character: 'Enemy', condition: 'Move Left' }
                ],
                inefficientRules: [
                    { id: 'rule3', character: 'Player', issue: 'Complex condition chain' },
                    { id: 'rule4', character: 'Item', issue: 'Redundant checks' }
                ],
                unusedCharacters: [
                    { id: 'char1', name: 'Unused Character 1' },
                    { id: 'char2', name: 'Unused Character 2' }
                ],
                performance: {
                    ruleCount: 45,
                    characterCount: 12,
                    assetSize: 2456789,
                    complexRules: 8
                },
                recommendations: [
                    'Remove unused assets to reduce project size',
                    'Merge duplicate rules to improve performance',
                    'Simplify complex rule conditions',
                    'Remove unused characters'
                ]
            });
        } catch (error) {
            window.showToast?.('Failed to analyze project: ' + error.message, 'error');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleOptimize = async () => {
        if (selectedOptimizations.length === 0) {
            window.showToast?.('Please select optimizations to apply', 'warning');
            return;
        }

        setIsOptimizing(true);
        try {
            // Simulate optimization process
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const results = {
                spaceFreed: Math.floor(Math.random() * 1000000),
                rulesOptimized: Math.floor(Math.random() * 10),
                performanceImprovement: Math.floor(Math.random() * 30) + 10
            };

            window.showToast?.('Project optimized successfully', 'success');
            onOptimize?.(results);
            onClose();
        } catch (error) {
            window.showToast?.('Failed to optimize project: ' + error.message, 'error');
        } finally {
            setIsOptimizing(false);
        }
    };

    const formatSize = (bytes) => {
        const kb = bytes / 1024;
        if (kb < 1024) {
            return `${kb.toFixed(1)} KB`;
        }
        const mb = kb / 1024;
        return `${mb.toFixed(1)} MB`;
    };

    const toggleOptimization = (type) => {
        setSelectedOptimizations(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    if (isAnalyzing) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6">
                    <div className="text-center">
                        <div className="mb-4">Analyzing project...</div>
                        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[800px] max-w-full mx-4 h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Project Optimizer</h2>
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

                <div className="flex-1 overflow-y-auto">
                    {/* Project Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="border rounded-lg p-4">
                            <div className="text-sm text-gray-500">Rules</div>
                            <div className="text-xl font-bold">{analysis.performance.ruleCount}</div>
                        </div>
                        <div className="border rounded-lg p-4">
                            <div className="text-sm text-gray-500">Characters</div>
                            <div className="text-xl font-bold">{analysis.performance.characterCount}</div>
                        </div>
                        <div className="border rounded-lg p-4">
                            <div className="text-sm text-gray-500">Total Size</div>
                            <div className="text-xl font-bold">{formatSize(analysis.performance.assetSize)}</div>
                        </div>
                        <div className="border rounded-lg p-4">
                            <div className="text-sm text-gray-500">Complex Rules</div>
                            <div className="text-xl font-bold">{analysis.performance.complexRules}</div>
                        </div>
                    </div>

                    {/* Optimization Options */}
                    <div className="space-y-6">
                        {/* Unused Assets */}
                        <div className="border rounded-lg p-4">
                            <label className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    checked={selectedOptimizations.includes('unused_assets')}
                                    onChange={() => toggleOptimization('unused_assets')}
                                    className="mr-2"
                                />
                                <div>
                                    <div className="font-medium">Remove Unused Assets</div>
                                    <div className="text-sm text-gray-500">
                                        {analysis.unusedAssets.length} unused assets found
                                    </div>
                                </div>
                            </label>
                            <div className="pl-6">
                                {analysis.unusedAssets.map((asset, index) => (
                                    <div key={index} className="flex justify-between text-sm py-1">
                                        <span>{asset.name}</span>
                                        <span className="text-gray-500">{formatSize(asset.size)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Duplicate Rules */}
                        <div className="border rounded-lg p-4">
                            <label className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    checked={selectedOptimizations.includes('duplicate_rules')}
                                    onChange={() => toggleOptimization('duplicate_rules')}
                                    className="mr-2"
                                />
                                <div>
                                    <div className="font-medium">Merge Duplicate Rules</div>
                                    <div className="text-sm text-gray-500">
                                        {analysis.duplicateRules.length} duplicate rules found
                                    </div>
                                </div>
                            </label>
                            <div className="pl-6">
                                {analysis.duplicateRules.map((rule, index) => (
                                    <div key={index} className="text-sm py-1">
                                        {rule.character}: {rule.condition}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Inefficient Rules */}
                        <div className="border rounded-lg p-4">
                            <label className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    checked={selectedOptimizations.includes('inefficient_rules')}
                                    onChange={() => toggleOptimization('inefficient_rules')}
                                    className="mr-2"
                                />
                                <div>
                                    <div className="font-medium">Optimize Inefficient Rules</div>
                                    <div className="text-sm text-gray-500">
                                        {analysis.inefficientRules.length} rules can be optimized
                                    </div>
                                </div>
                            </label>
                            <div className="pl-6">
                                {analysis.inefficientRules.map((rule, index) => (
                                    <div key={index} className="text-sm py-1">
                                        {rule.character}: {rule.issue}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Unused Characters */}
                        <div className="border rounded-lg p-4">
                            <label className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    checked={selectedOptimizations.includes('unused_characters')}
                                    onChange={() => toggleOptimization('unused_characters')}
                                    className="mr-2"
                                />
                                <div>
                                    <div className="font-medium">Remove Unused Characters</div>
                                    <div className="text-sm text-gray-500">
                                        {analysis.unusedCharacters.length} unused characters found
                                    </div>
                                </div>
                            </label>
                            <div className="pl-6">
                                {analysis.unusedCharacters.map((char, index) => (
                                    <div key={index} className="text-sm py-1">
                                        {char.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-medium mb-2">Recommendations</h3>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            {analysis.recommendations.map((rec, index) => (
                                <li key={index}>{rec}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleOptimize}
                        disabled={isOptimizing || selectedOptimizations.length === 0}
                        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isOptimizing ? 'Optimizing...' : 'Apply Optimizations'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectOptimizer;