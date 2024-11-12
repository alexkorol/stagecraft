import React, { useState, useEffect } from 'react';
import { GitBranch, GitCommit, GitMerge, GitPullRequest, Clock, ArrowRight, Check, Plus, AlertTriangle } from 'lucide-react';
import ProjectManager from '../utils/ProjectManager';
import { useUndo } from '../utils/UndoManager';

const ProjectVersionControl = ({ project, onLoad, onClose }) => {
    const [versions, setVersions] = useState([]);
    const [branches, setBranches] = useState([]);
    const [currentBranch, setCurrentBranch] = useState('main');
    const [showCreateBranch, setShowCreateBranch] = useState(false);
    const [newBranchName, setNewBranchName] = useState('');
    const [selectedVersion, setSelectedVersion] = useState(null);
    const [commitMessage, setCommitMessage] = useState('');
    const [showMergeDialog, setShowMergeDialog] = useState(false);
    const [mergeBranch, setMergeBranch] = useState(null);
    const [mergeConflicts, setMergeConflicts] = useState(null);

    useEffect(() => {
        loadVersionHistory();
        loadBranches();
    }, []);

    const loadVersionHistory = async () => {
        try {
            const history = await ProjectManager.getVersionHistory(project.id, currentBranch);
            setVersions(history);
        } catch (error) {
            console.error('Failed to load version history:', error);
        }
    };

    const loadBranches = async () => {
        try {
            const projectBranches = await ProjectManager.getBranches(project.id);
            setBranches(projectBranches);
        } catch (error) {
            console.error('Failed to load branches:', error);
        }
    };

    const handleCreateVersion = async () => {
        if (!commitMessage.trim()) return;

        try {
            await ProjectManager.createVersion(project.id, {
                message: commitMessage,
                branch: currentBranch,
                timestamp: Date.now()
            });
            setCommitMessage('');
            await loadVersionHistory();
        } catch (error) {
            console.error('Failed to create version:', error);
        }
    };

    const handleCreateBranch = async () => {
        if (!newBranchName.trim()) return;

        try {
            await ProjectManager.createBranch(project.id, {
                name: newBranchName,
                sourceVersion: selectedVersion || versions[0],
                timestamp: Date.now()
            });
            setNewBranchName('');
            setShowCreateBranch(false);
            await loadBranches();
        } catch (error) {
            console.error('Failed to create branch:', error);
        }
    };

    const handleSwitchBranch = async (branch) => {
        try {
            const branchData = await ProjectManager.switchBranch(project.id, branch);
            setCurrentBranch(branch);
            await loadVersionHistory();
            onLoad(branchData);
        } catch (error) {
            console.error('Failed to switch branch:', error);
        }
    };

    const handleRestoreVersion = async (version) => {
        try {
            const restoredProject = await ProjectManager.restoreVersion(project.id, version.id);
            onLoad(restoredProject);
            onClose();
        } catch (error) {
            console.error('Failed to restore version:', error);
        }
    };

    const handleMerge = async (sourceBranch) => {
        try {
            const conflicts = await ProjectManager.checkMergeConflicts(project.id, currentBranch, sourceBranch);
            
            if (conflicts.length > 0) {
                setMergeConflicts(conflicts);
                return;
            }

            await ProjectManager.mergeBranches(project.id, currentBranch, sourceBranch);
            await loadVersionHistory();
            setShowMergeDialog(false);
            setMergeBranch(null);
        } catch (error) {
            console.error('Failed to merge branches:', error);
        }
    };

    const handleResolveMergeConflict = async (resolution) => {
        try {
            await ProjectManager.resolveMergeConflicts(project.id, resolution);
            setMergeConflicts(null);
            await loadVersionHistory();
        } catch (error) {
            console.error('Failed to resolve merge conflicts:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[900px] max-w-full">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <GitBranch className="w-5 h-5" />
                            <h2 className="text-xl font-semibold">Version Control</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            ×
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        {/* Branches */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-medium">Branches</h3>
                                <button
                                    onClick={() => setShowCreateBranch(true)}
                                    className="text-blue-500 hover:text-blue-600"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="space-y-2">
                                {branches.map(branch => (
                                    <div key={branch.name} className="flex items-center justify-between">
                                        <button
                                            onClick={() => handleSwitchBranch(branch.name)}
                                            className={`
                                                flex-1 p-2 rounded-lg flex items-center gap-2
                                                ${currentBranch === branch.name
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'hover:bg-gray-50'
                                                }
                                            `}
                                        >
                                            <GitBranch className="w-4 h-4" />
                                            {branch.name}
                                            {currentBranch === branch.name && (
                                                <Check className="w-4 h-4 ml-auto" />
                                            )}
                                        </button>
                                        {branch.name !== currentBranch && (
                                            <button
                                                onClick={() => {
                                                    setMergeBranch(branch);
                                                    setShowMergeDialog(true);
                                                }}
                                                className="ml-2 p-2 text-gray-500 hover:text-blue-500"
                                                title={`Merge ${branch.name} into ${currentBranch}`}
                                            >
                                                <GitMerge className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Version History */}
                        <div className="col-span-2">
                            <h3 className="font-medium mb-4">Version History</h3>
                            
                            {/* Create Version */}
                            <div className="mb-4">
                                <textarea
                                    value={commitMessage}
                                    onChange={(e) => setCommitMessage(e.target.value)}
                                    placeholder="Describe your changes..."
                                    className="w-full px-3 py-2 border rounded-lg mb-2"
                                    rows="2"
                                />
                                <button
                                    onClick={handleCreateVersion}
                                    disabled={!commitMessage.trim()}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                                >
                                    Create Version
                                </button>
                            </div>

                            {/* Version List */}
                            <div className="space-y-4">
                                {versions.map((version, index) => (
                                    <div
                                        key={version.id}
                                        className="p-4 border rounded-lg hover:bg-gray-50"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-medium">{version.message}</p>
                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(version.timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleRestoreVersion(version)}
                                                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                                                >
                                                    Restore
                                                </button>
                                                <button
                                                    onClick={() => setSelectedVersion(version)}
                                                    className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                                                >
                                                    Branch
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Branch Dialog */}
            {showCreateBranch && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-[400px]">
                        <h3 className="text-lg font-medium mb-4">Create New Branch</h3>
                        <input
                            type="text"
                            value={newBranchName}
                            onChange={(e) => setNewBranchName(e.target.value)}
                            placeholder="Branch name"
                            className="w-full px-3 py-2 border rounded-lg mb-4"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowCreateBranch(false)}
                                className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateBranch}
                                disabled={!newBranchName.trim()}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Merge Dialog */}
            {showMergeDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-[500px]">
                        <h3 className="text-lg font-medium mb-4">Merge Branch</h3>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to merge <span className="font-medium">{mergeBranch.name}</span> into{' '}
                            <span className="font-medium">{currentBranch}</span>?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowMergeDialog(false);
                                    setMergeBranch(null);
                                }}
                                className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleMerge(mergeBranch.name)}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Merge
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Merge Conflicts Dialog */}
            {mergeConflicts && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-[700px]">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                            <h3 className="text-lg font-medium">Merge Conflicts</h3>
                        </div>
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                            {mergeConflicts.map((conflict, index) => (
                                <div key={index} className="border rounded-lg p-4">
                                    <h4 className="font-medium mb-2">{conflict.path}</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-red-50 p-2 rounded">
                                            <p className="text-sm text-red-600 mb-1">Current Branch</p>
                                            <pre className="text-sm">{conflict.current}</pre>
                                        </div>
                                        <div className="bg-green-50 p-2 rounded">
                                            <p className="text-sm text-green-600 mb-1">Incoming Changes</p>
                                            <pre className="text-sm">{conflict.incoming}</pre>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <button
                                            onClick={() => handleResolveMergeConflict({
                                                path: conflict.path,
                                                resolution: 'current'
                                            })}
                                            className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                        >
                                            Keep Current
                                        </button>
                                        <button
                                            onClick={() => handleResolveMergeConflict({
                                                path: conflict.path,
                                                resolution: 'incoming'
                                            })}
                                            className="px-3 py-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                                        >
                                            Accept Incoming
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectVersionControl;