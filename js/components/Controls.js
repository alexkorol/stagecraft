import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Save, Upload } from 'lucide-react';
import { ANIMATION_SPEEDS } from '../constants';
import ProjectManager from '../utils/ProjectManager';

const Controls = ({ 
    isRunning, 
    onTogglePlay, 
    onReset,
    onSpeedChange,
    onSave,
    onLoad,
    currentSpeed = ANIMATION_SPEEDS.NORMAL
}) => {
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [projectName, setProjectName] = useState('');

    const handleSpeedChange = (speed) => {
        onSpeedChange(speed);
        setShowSpeedMenu(false);
    };

    const handleSave = () => {
        if (!projectName.trim()) return;
        onSave(projectName);
        setShowSaveDialog(false);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            onLoad(file);
        }
        event.target.value = ''; // Reset input
    };

    const speedLabels = {
        [ANIMATION_SPEEDS.VERY_SLOW]: 'Very Slow',
        [ANIMATION_SPEEDS.SLOW]: 'Slow',
        [ANIMATION_SPEEDS.NORMAL]: 'Normal',
        [ANIMATION_SPEEDS.FAST]: 'Fast',
        [ANIMATION_SPEEDS.VERY_FAST]: 'Very Fast'
    };

    return (
        <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow">
            {/* Play/Pause Button */}
            <button
                onClick={onTogglePlay}
                className="p-2 rounded hover:bg-gray-100"
                title={isRunning ? 'Pause' : 'Play'}
            >
                {isRunning ? 
                    <Pause className="w-5 h-5" /> : 
                    <Play className="w-5 h-5" />
                }
            </button>

            {/* Reset Button */}
            <button
                onClick={onReset}
                className="p-2 rounded hover:bg-gray-100"
                title="Reset"
            >
                <RotateCcw className="w-5 h-5" />
            </button>

            {/* Speed Control */}
            <div className="relative">
                <button
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    className="px-3 py-2 rounded hover:bg-gray-100 text-sm"
                >
                    Speed: {speedLabels[currentSpeed]}
                </button>

                {showSpeedMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg py-1 z-10">
                        {Object.entries(ANIMATION_SPEEDS).map(([key, speed]) => (
                            <button
                                key={key}
                                onClick={() => handleSpeedChange(speed)}
                                className={`w-full px-4 py-2 text-left hover:bg-gray-100 text-sm ${
                                    currentSpeed === speed ? 'bg-blue-50' : ''
                                }`}
                            >
                                {speedLabels[speed]}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="w-px h-6 bg-gray-200 mx-2" /> {/* Divider */}

            {/* Save Button */}
            <button
                onClick={() => setShowSaveDialog(true)}
                className="p-2 rounded hover:bg-gray-100"
                title="Save Project"
            >
                <Save className="w-5 h-5" />
            </button>

            {/* Load Button */}
            <label className="p-2 rounded hover:bg-gray-100 cursor-pointer">
                <Upload className="w-5 h-5" />
                <input
                    type="file"
                    accept=".scp"
                    className="hidden"
                    onChange={handleFileUpload}
                />
            </label>

            {/* Save Dialog */}
            {showSaveDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="font-medium mb-4">Save Project</h3>
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            placeholder="Enter project name"
                            className="w-full px-3 py-2 border rounded mb-4"
                            autoFocus
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                onClick={() => setShowSaveDialog(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                                onClick={handleSave}
                                disabled={!projectName.trim()}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Controls;
