const RulesList = ({ rules, characters, selectedCharacterId, onDeleteRule, onEditRule }) => {
    const formatCondition = (condition) => {
        switch (condition.type) {
            case 'empty_cell':
                return `Empty cell ${condition.direction}`;
            case 'has_character':
                return `Character ${condition.direction}`;
            case 'key_pressed':
                return `Key: ${condition.key}`;
            case 'timer':
                return `Every ${condition.interval} seconds`;
            default:
                return JSON.stringify(condition);
        }
    };

    const formatAction = (rule) => {
        switch (rule.type) {
            case 'move':
                return `Move ${rule.direction}`;
            case 'jump':
                return `Jump ${rule.direction}`;
            case 'turn':
                return `Turn ${rule.direction}`;
            case 'change_sprite':
                return 'Change appearance';
            case 'disappear':
                return 'Disappear';
            case 'appear':
                return 'Appear';
            default:
                return rule.type;
        }
    };

    const filteredRules = selectedCharacterId
        ? rules.filter(rule => rule.characterId === selectedCharacterId)
        : rules;

    const getCharacterName = (characterId) => {
        const character = characters.find(c => c.id === characterId);
        return character ? `Character ${character.id}` : 'Unknown';
    };

    return (
        <div className="space-y-2">
            {filteredRules.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">
                    {selectedCharacterId
                        ? "No rules yet. Click 'Add Rule' to create one!"
                        : 'No rules created yet.'}
                </div>
            ) : (
                filteredRules.map(rule => (
                    <div
                        key={rule.id}
                        className="p-3 border rounded bg-white hover:bg-gray-50"
                    >
                        {/* Rule Header */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-sm">
                                {!selectedCharacterId && (
                                    <span className="text-gray-500 mr-2">
                                        {getCharacterName(rule.characterId)}:
                                    </span>
                                )}
                                {formatAction(rule)}
                            </div>
                            <div className="flex gap-1">
                                {onEditRule && (
                                    <button
                                        onClick={() => onEditRule(rule)}
                                        className="p-1 text-gray-400 hover:text-blue-500"
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
                                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                            />
                                        </svg>
                                    </button>
                                )}
                                {onDeleteRule && (
                                    <button
                                        onClick={() => onDeleteRule(rule.id)}
                                        className="p-1 text-gray-400 hover:text-red-500"
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
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Conditions */}
                        {rule.conditions && rule.conditions.length > 0 && (
                            <div className="text-sm text-gray-600">
                                <div className="font-medium mb-1">When:</div>
                                <ul className="list-disc list-inside space-y-1">
                                    {rule.conditions.map((condition, index) => (
                                        <li key={index}>
                                            {formatCondition(condition)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default RulesList;