import React, { useState } from 'react';
import { Share2, Copy, Download, Upload, Lock, Globe } from 'lucide-react';
import ProjectManager from '../utils/ProjectManager';

const ProjectShare = ({ project, onClose }) => {
    const [shareMode, setShareMode] = useState('private');
    const [shareLink, setShareLink] = useState('');
    const [isGeneratingLink, setIsGeneratingLink] = useState(false);
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);

    const generateShareLink = async () => {
        setIsGeneratingLink(true);
        try {
            // Simulate API call to generate share link
            await new Promise(resolve => setTimeout(resolve, 1000));
            const link = `https://stagecraft.example.com/p/${project.id}`;
            setShareLink(link);
        } catch (error) {
            console.error('Failed to generate share link:', error);
        } finally {
            setIsGeneratingLink(false);
        }
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setShowCopiedMessage(true);
            setTimeout(() => setShowCopiedMessage(false), 2000);
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
        }
    };

    const exportProject = () => {
        ProjectManager.saveProject(project);
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                await ProjectManager.loadProject(file);
                onClose();
            } catch (error) {
                console.error('Failed to import project:', error);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[500px] max-w-full">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                            <Share2 className="w-5 h-5" />
                            <h2 className="text-xl font-semibold">Share Project</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            ×
                        </button>
                    </div>

                    {/* Share Mode Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Share Mode
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                className={`
                                    flex items-center justify-center gap-2 p-3 rounded-lg border
                                    ${shareMode === 'private' 
                                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                        : 'border-gray-200 hover:bg-gray-50'
                                    }
                                `}
                                onClick={() => setShareMode('private')}
                            >
                                <Lock className="w-4 h-4" />
                                <span>Private Link</span>
                            </button>
                            <button
                                className={`
                                    flex items-center justify-center gap-2 p-3 rounded-lg border
                                    ${shareMode === 'public' 
                                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                        : 'border-gray-200 hover:bg-gray-50'
                                    }
                                `}
                                onClick={() => setShareMode('public')}
                            >
                                <Globe className="w-4 h-4" />
                                <span>Public Link</span>
                            </button>
                        </div>
                    </div>

                    {/* Share Link Generation */}
                    {!shareLink ? (
                        <button
                            onClick={generateShareLink}
                            disabled={isGeneratingLink}
                            className={`
                                w-full py-2 px-4 rounded-lg text-white
                                ${isGeneratingLink 
                                    ? 'bg-gray-400' 
                                    : 'bg-blue-500 hover:bg-blue-600'
                                }
                            `}
                        >
                            {isGeneratingLink ? 'Generating Link...' : 'Generate Share Link'}
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={shareLink}
                                    readOnly
                                    className="flex-1 p-2 border rounded-lg bg-gray-50"
                                />
                                <button
                                    onClick={() => copyToClipboard(shareLink)}
                                    className="p-2 text-gray-500 hover:text-gray-700"
                                    title="Copy to clipboard"
                                >
                                    <Copy className="w-5 h-5" />
                                </button>
                            </div>
                            {showCopiedMessage && (
                                <p className="text-sm text-green-600">
                                    Copied to clipboard!
                                </p>
                            )}
                        </div>
                    )}

                    <div className="mt-6 pt-6 border-t">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Export Project */}
                            <button
                                onClick={exportProject}
                                className="flex items-center justify-center gap-2 p-2 rounded-lg border hover:bg-gray-50"
                            >
                                <Download className="w-4 h-4" />
                                <span>Export Project</span>
                            </button>

                            {/* Import Project */}
                            <label className="flex items-center justify-center gap-2 p-2 rounded-lg border hover:bg-gray-50 cursor-pointer">
                                <Upload className="w-4 h-4" />
                                <span>Import Project</span>
                                <input
                                    type="file"
                                    accept=".scp"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectShare;
