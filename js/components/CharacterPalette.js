import React, { useState } from 'react';
import { Trash2, Plus, Copy, Edit, Download } from 'lucide-react';
import ProjectManager from '../utils/ProjectManager';

const CharacterPalette = ({ 
    characters, 
    selectedCharacter, 
    onSelectCharacter, 
    onCreateCharacter,
    onEditCharacter,
    onDeleteCharacter 
}) => {
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [characterToDelete, setCharacterToDelete] = useState(null);

    const handleDelete = (character) => {
        setCharacterToDelete(character);
        setShowConfirmDelete(true);
    };

    const confirmDelete = () => {
        onDeleteCharacter(characterToDelete);
        setShowConfirmDelete(false);
        setCharacterToDelete(null);
    };

    const duplicateCharacter = (character) => {
        const newCharacter = {
            ...character,
            id: Date.now(),
            name: `${character.name} (Copy)`,
            x: -1,
            y: -1
        };
        onCreateCharacter(newCharacter);
    };

    const exportCharacter = (character) => {
        ProjectManager.exportSprite(character, character.name);
    };

    const renderCharacterSprite = (character) => {
        if (!character.pixels) return null;

        return (
            <div
                className="w-10 h-10 border"
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${character.size}, 1fr)`
                }}
            >
                {character.pixels.map((row, y) =>
                    row.map((color, x) => (
                        <div
                            key={`${x}-${y}`}
                            style={{ backgroundColor: color }}
                        />
                    ))
                )}
            </div>
        );
    };

    return (
        <div className="w-64 bg-white p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Characters</h3>
                <button
                    onClick={onCreateCharacter}
                    className="p-1 rounded hover:bg-gray-100"
                    title="Create New Character"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-2">
                {Array.from(characters.values()).map(character => (
                    <div 
                        key={character.id}
                        className={`p-2 border rounded flex items-center gap-2 cursor-pointer ${
                            selectedCharacter?.id === character.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => onSelectCharacter(character)}
                    >
                        {renderCharacterSprite(character)}
                        <span className="flex-1 text-sm truncate">
                            {character.name || `Character ${character.id}`}
                        </span>
                        <div className="flex gap-1">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEditCharacter(character);
                                }}
                                className="p-1 rounded hover:bg-gray-200"
                                title="Edit Character"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    duplicateCharacter(character);
                                }}
                                className="p-1 rounded hover:bg-gray-200"
                                title="Duplicate Character"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    exportCharacter(character);
                                }}
                                className="p-1 rounded hover:bg-gray-200"
                                title="Export Character"
                            >
                                <Download className="w-4 h-4" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(character);
                                }}
                                className="p-1 rounded hover:bg-red-100 text-red-600"
                                title="Delete Character"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Delete Confirmation Dialog */}
            {showConfirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg max-w-sm">
                        <h3 className="font-medium mb-4">Delete Character</h3>
                        <p className="mb-4">
                            Are you sure you want to delete this character? 
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                onClick={() => setShowConfirmDelete(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CharacterPalette;
