const CharacterPalette = ({
    characters,
    selectedCharacter,
    onSelectCharacter,
    onAddCharacter,
    onDeleteCharacter,
    onEditCharacter
}) => {
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Characters</h3>
                <button
                    onClick={onAddCharacter}
                    className="px-2 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                    Add Character
                </button>
            </div>

            <div className="space-y-2">
                {characters.map(char => (
                    <div
                        key={char.id}
                        className={`p-2 border rounded flex items-center gap-2 cursor-pointer transition-colors ${
                            selectedCharacter?.id === char.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'hover:bg-gray-50'
                        }`}
                        onClick={() => onSelectCharacter(char)}
                    >
                        {/* Character Preview */}
                        <div className="w-8 h-8 border bg-white">
                            <div
                                className="w-full h-full grid"
                                style={{
                                    gridTemplateColumns: `repeat(${SPRITE_GRID_SIZE}, 1fr)`
                                }}
                            >
                                {char.sprite.map((row, y) =>
                                    row.map((color, x) => (
                                        <div
                                            key={`${x}-${y}`}
                                            className="w-full h-full"
                                            style={{ backgroundColor: color }}
                                        />
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Character Info */}
                        <div className="flex-1 min-w-0">
                            <div className="text-sm truncate">
                                Character {char.id}
                            </div>
                            <div className="text-xs text-gray-500">
                                Rules: {char.rules?.length || 0}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1">
                            {onEditCharacter && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEditCharacter(char);
                                    }}
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
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteCharacter(char.id);
                                }}
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
                        </div>
                    </div>
                ))}

                {characters.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                        No characters yet. Click "Add Character" to create one!
                    </div>
                )}
            </div>
        </div>
    );
};

export default CharacterPalette;