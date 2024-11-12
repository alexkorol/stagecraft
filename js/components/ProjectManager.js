import React, { useState, useEffect } from 'react';
import { FolderOpen, Save, History, Download, Upload, Trash2, Clock } from 'lucide-react';
import ProjectManagerUtil from '../utils/ProjectManager';
import BackupManager from '../utils/BackupManager';

const ProjectManager = ({ currentProject, onLoad, onSave, onClose }) => {
    const [recentProjects, setRecentProjects] = useState([]);
    const [backups, setBackups] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        loadRecentProjects();
        loadBackups();
    }, []);

    const loadRecentProjects = async () => {
        const projects = await ProjectManagerUtil.getRecentProjects();
        setRecentProjects(projects);
    };

    const loadBackups = async () => {
        const backupList = BackupManager.getBackups();
        setBackups(backupList);
    };

    const handleProjectSelect = async (project) => {
        setSelectedProject(project);
        setIsLoading(true);
        try {
            const loadedProject = await ProjectManagerUtil.loadProject(project.name);
            onLoad(loadedProject);
            onClose();
        } catch (error) {
            console.error('Failed to load project:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveProject = async () => {
        setIsSaving(true);
        try {
            await ProjectManagerUtil.saveProject(currentProject);
            await loadRecentProjects(); // Refresh list
            onSave();
            onClose();
        } catch (error) {
            console.error('Failed to save project:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteProject = async (project) => {
        try {
            await ProjectManagerUtil.deleteProject(project.name);
            await loadRecentProjects();
            setShowDeleteConfirm(false);
        } catch (error) {
            console.error('Failed to delete project:', error);
        }
    };

    const handleRestoreBackup = async (backup) => {
        setIsLoading(true);
        try {
            const restoredProject = await BackupManager.restoreBackup(backup.timestamp);
            onLoad(restoredProject);
            onClose();
        } catch (error) {
            console.error('Failed to restore backup:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileImport = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsLoading(true);
        try {
            const importedProject = await ProjectManagerUtil.importProject(file);
            onLoad(importedProject);
            onClose();
        } catch (error) {
            console.error('Failed to import project:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            await ProjectManagerUtil.exportProject(currentProject);
        } catch (error) {
            console.error('Failed to export project:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[800px] max-w-full">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <FolderOpen className="w-5 h-5" />
                            <h2 className="text-xl font-semibold">Project Manager</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            ×
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Recent Projects */}
                        <div>
                            <h3 className="font-medium mb-4">Recent Projects</h3>
                            <div className="space-y-2">
                                {recentProjects.map(project => (
                                    <div
                                        key={project.name}
                                        className="p-3 border rounded-lg hover:bg-gray-50"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium">{project.name}</h4>
                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(project.lastModified).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleProjectSelect(project)}
                                                    className="p-1 hover:bg-gray-200 rounded"
                                                    title="Open Project"
                                                >
                                                    <FolderOpen className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setShowDeleteConfirm(project)}
                                                    className="p-1 hover:bg-red-100 text-red-500 rounded"
                                                    title="Delete Project"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Backups */}
                        <div>
                            <h3 className="font-medium mb-4">Backups</h3>
                            <div className="space-y-2">
                                {backups.map(backup => (
                                    <div
                                        key={backup.timestamp}
                                        className="p-3 border rounded-lg hover:bg-gray-50"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium">Backup</h4>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(backup.timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleRestoreBackup(backup)}
                                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            >
                                                Restore
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 pt-6 border-t grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <button
                                onClick={handleSaveProject}
                                disabled={isSaving}
                                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Saving...' : 'Save Project'}
                            </button>
                            <button
                                onClick={handleExport}
                                className="w-full px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 flex items-center justify-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Export Project
                            </button>
                        </div>
                        <div className="space-y-2">
                            <label className="w-full px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 flex items-center justify-center gap-2 cursor-pointer">
                                <Upload className="w-4 h-4" />
                                Import Project
                                <input
                                    type="file"
                                    accept=".json,.scp"
                                    className="hidden"
                                    onChange={handleFileImport}
                                />
                            </label>
                            <button
                                onClick={() => BackupManager.createBackup(currentProject)}
                                className="w-full px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 flex items-center justify-center gap-2"
                            >
                                <History className="w-4 h-4" />
                                Create Backup
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-[400px]">
                        <h3 className="text-lg font-medium mb-4">Delete Project?</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete "{showDeleteConfirm.name}"? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteProject(showDeleteConfirm)}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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

export default ProjectManager;
