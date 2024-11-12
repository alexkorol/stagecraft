const RuleEditor = ({ character, onSave, onCancel }) => {
    const [ruleType, setRuleType] = React.useState('move');
    const [direction, setDirection] = React.useState('right');
    const [conditions, setConditions] = React.useState([]);
    const [selectedCondition, setSelectedCondition] = React.useState('');
    const [showConditionEditor, setShowConditionEditor] = React.useState(false);

    const addCondition = (condition) => {
        setConditions([...conditions, condition]);
        setShowConditionEditor(false);
        setSelectedCondition('');
    };

    const removeCondition = (index) => {
        const newConditions = [...conditions];
        newConditions.splice(index, 1);
        setConditions(newConditions);
    };

    const renderConditionEditor = () => {
        switch (selectedCondition) {
            case 'empty_cell':
                return (
                    <div className="mt-2 p-4 border rounded">
                        <h4 className="font-medium mb-2">Empty Cell Direction</h4>
                        <select
                            className="w-full p-2 border rounded"
                            onChange={(e) => addCondition({
                                type: 'empty_cell',
                                direction: e.target.value
                            })}
                        >
                            <option value="right">Right</option>
                            <option value="left">Left</option>
                            <option value="up">Up</option>
                            <option value="down">Down</option>
                        </select>
                    </div>
                );

            case 'has_character':
                return (
                    <div className="mt-2 p-4 border rounded">
                        <h4 className="font-medium mb-2">Character Direction</h4>
                        <select
                            className="w-full p-2 border rounded mb-2"
                            onChange={(e) => addCondition({
                                type: 'has_character',
                                direction: e.target.value
                            })}
                        >
                            <option value="right">Right</option>
                            <option value="left">Left</option>
                            <option value="up">Up</option>
                            <option value="down">Down</option>
                        </select>
                    </div>
                );

            case 'key_pressed':
                return (
                    <div className="mt-2 p-4 border rounded">
                        <h4 className="font-medium mb-2">Key</h4>
                        <select
                            className="w-full p-2 border rounded"
                            onChange={(e) => addCondition({
                                type: 'key_pressed',
                                key: e.target.value
                            })}
                        >
                            <option value="ArrowRight">Right Arrow</option>
                            <option value="ArrowLeft">Left Arrow</option>
                            <option value="ArrowUp">Up Arrow</option>
                            <option value="ArrowDown">Down Arrow</option>
                            <option value="Space">Space</option>
                        </select>
                    </div>
                );

            case 'timer':
                return (
                    <div className="mt-2 p-4 border rounded">
                        <h4 className="font-medium mb-2">Interval (seconds)</h4>
                        <input
                            type="number"
                            min="1"
                            className="w-full p-2 border rounded"
                            onChange={(e) => addCondition({
                                type: 'timer',
                                interval: parseInt(e.target.value)
                            })}
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-[500px]">
                <h2 className="text-xl font-bold mb-4">Rule Editor</h2>

                {/* Rule Type */}
                <div className="mb-4">
                    <h3 className="font-medium mb-2">Action</h3>
                    <select
                        className="w-full p-2 border rounded"
                        value={ruleType}
                        onChange={(e) => setRuleType(e.target.value)}
                    >
                        {Object.entries(RULE_TYPES).map(([key, value]) => (
                            <option key={key} value={value}>
                                {key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ')}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Direction (for move/turn actions) */}
                {(ruleType === 'move' || ruleType === 'turn') && (
                    <div className="mb-4">
                        <h3 className="font-medium mb-2">Direction</h3>
                        <select
                            className="w-full p-2 border rounded"
                            value={direction}
                            onChange={(e) => setDirection(e.target.value)}
                        >
                            {Object.entries(DIRECTIONS).map(([key, value]) => (
                                <option key={key} value={value}>
                                    {key.charAt(0) + key.slice(1).toLowerCase()}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Conditions */}
                <div className="mb-4">
                    <h3 className="font-medium mb-2">Conditions</h3>
                    <div className="space-y-2">
                        {conditions.map((condition, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 border rounded">
                                <span className="flex-1">
                                    {condition.type}: {JSON.stringify(condition)}
                                </span>
                                <button
                                    className="text-red-500 hover:text-red-600"
                                    onClick={() => removeCondition(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Add Condition */}
                    <div className="mt-2">
                        <select
                            className="w-full p-2 border rounded"
                            value={selectedCondition}
                            onChange={(e) => setSelectedCondition(e.target.value)}
                        >
                            <option value="">Add a condition...</option>
                            {Object.entries(CONDITIONS).map(([key, value]) => (
                                <option key={key} value={value}>
                                    {key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ')}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedCondition && renderConditionEditor()}
                </div>

                {/* Controls */}
                <div className="flex justify-end gap-2">
                    <button
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                        onClick={() => onSave({
                            type: ruleType,
                            direction,
                            conditions
                        })}
                    >
                        Save Rule
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RuleEditor;