import React, { useState, useEffect } from 'react';
import { GitCompare, Plus, Minus, ArrowRight, FileText, Code } from 'lucide-react';

const ProjectDiff = ({ sourceVersion, targetVersion, onClose }) => {
    const [diff, setDiff] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [diffView, setDiffView] = useState('split'); // 'split' or 'unified'

    useEffect(() => {
        calculateDiff();
    }, [sourceVersion, targetVersion]);

    const calculateDiff = async () => {
        try {
            // In a real implementation, this would call a diff algorithm
            // For now, we'll simulate some differences
            const differences = {
                files: [
                    {
                        path: 'characters.json',
                        changes: {
                            added: 5,
                            removed: 2,
                            modified: 3
                        },
                        chunks: [
                            {
                                oldStart: 1,
                                oldLines: 3,
                                newStart: 1,
                                newLines: 4,
                                type: 'modified',
                                content: {
                                    old: [
                                        '{ "id": 1,',
                                        '  "name": "Player",',
                                        '  "sprite": "player.png" }'
                                    ],
                                    new: [
                                        '{ "id": 1,',
                                        '  "name": "Player",',
                                        '  "sprite": "player_updated.png",',
                                        '  "animations": true }'
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        path: 'rules.json',
                        changes: {
                            added: 10,
                            removed: 0,
                            modified: 0
                        },
                        chunks: [
                            {
                                oldStart: 1,
                                oldLines: 0,
                                newStart: 1,
                                newLines: 5,
                                type: 'added',
                                content: {
                                    old: [],
                                    new: [
                                        '{ "type": "movement",',
                                        '  "trigger": "keyPress",',
                                        '  "key": "ArrowRight",',
                                        '  "action": "moveRight",',
                                        '  "distance": 1 }'
                                    ]
                                }
                            }
                        ]
                    }
                ],
                stats: {
                    totalFiles: 2,
                    additions: 15,
                    deletions: 2,
                    modifications: 3
                }
            };

            setDiff(differences);
            setSelectedFile(differences.files[0]);
        } catch (error) {
            console.error('Failed to calculate diff:', error);
        }
    };

    const renderLineNumbers = (start, count) => {
        return Array.from({ length: count }, (_, i) => (
            <div key={i} className="text-gray-400 text-right pr-2 select-none">
                {start + i}
            </div>
        ));
    };

    const renderSplitView = (chunk) => (
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50">
                <div className="flex">
                    <div className="w-12 bg-red-100 py-1">
                        {renderLineNumbers(chunk.oldStart, chunk.oldLines)}
                    </div>
                    <div className="flex-1 py-1 pl-4">
                        {chunk.content.old.map((line, i) => (
                            <div key={i} className="text-red-600">
                                {line}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="bg-green-50">
                <div className="flex">
                    <div className="w-12 bg-green-100 py-1">
                        {renderLineNumbers(chunk.newStart, chunk.newLines)}
                    </div>
                    <div className="flex-1 py-1 pl-4">
                        {chunk.content.new.map((line, i) => (
                            <div key={i} className="text-green-600">
                                {line}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderUnifiedView = (chunk) => (
        <div className="bg-gray-50">
            <div className="flex">
                <div className="w-12 bg-gray-100 py-1">
                    {chunk.content.old.map((_, i) => (
                        <div key={`old-${i}`} className="text-gray-400 text-right pr-2">
                            -{chunk.oldStart + i}
                        </div>
                    ))}
                    {chunk.content.new.map((_, i) => (
                        <div key={`new-${i}`} className="text-gray-400 text-right pr-2">
                            +{chunk.newStart + i}
                        </div>
                    ))}
                </div>
                <div className="flex-1 py-1 pl-4">
                    {chunk.content.old.map((line, i) => (
                        <div key={`old-${i}`} className="text-red-600">
                            -{line}
                        </div>
                    ))}
                    {chunk.content.new.map((line, i) => (
                        <div key={`new-${i}`} className="text-green-600">
                            +{line}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    if (!diff) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[1000px] max-w-full h-[80vh] flex flex-col">
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <GitCompare className="w-5 h-5" />
                            <h2 className="text-xl font-semibold">Compare Changes</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            ×
                        </button>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">From:</span>
                            <span className="font-medium">{sourceVersion.name}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">To:</span>
                            <span className="font-medium">{targetVersion.name}</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex">
                    {/* File List */}
                    <div className="w-64 border-r p-4">
                        <div className="space-y-2">
                            {diff.files.map(file => (
                                <button
                                    key={file.path}
                                    onClick={() => setSelectedFile(file)}
                                    className={`
                                        w-full p-2 rounded text-left
                                        ${selectedFile?.path === file.path
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'hover:bg-gray-50'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        <span className="truncate">{file.path}</span>
                                    </div>
                                    <div className="text-xs mt-1">
                                        <span className="text-green-600">+{file.changes.added}</span>
                                        {' '}
                                        <span className="text-red-600">-{file.changes.removed}</span>
                                        {file.changes.modified > 0 && (
                                            <span className="text-yellow-600"> ~{file.changes.modified}</span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Diff View */}
                    <div className="flex-1 flex flex-col">
                        {/* View Controls */}
                        <div className="p-4 border-b">
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium">
                                    {selectedFile?.path}
                                </h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setDiffView('split')}
                                        className={`px-3 py-1 rounded ${
                                            diffView === 'split'
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        Split
                                    </button>
                                    <button
                                        onClick={() => setDiffView('unified')}
                                        className={`px-3 py-1 rounded ${
                                            diffView === 'unified'
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        Unified
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Diff Content */}
                        <div className="flex-1 overflow-auto p-4">
                            {selectedFile?.chunks.map((chunk, index) => (
                                <div key={index} className="mb-4">
                                    {diffView === 'split'
                                        ? renderSplitView(chunk)
                                        : renderUnifiedView(chunk)
                                    }
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDiff;