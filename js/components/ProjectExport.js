import React, { useState } from 'react';
import { Download, Code, FileJson, Archive, Copy, Check, Share2 } from 'lucide-react';
import ProjectManager from '../utils/ProjectManager';

const EXPORT_FORMATS = {
    JSON: 'json',
    ZIP: 'zip',
    HTML: 'html'
};

const ProjectExport = ({ project, onClose }) => {
    const [selectedFormat, setSelectedFormat] = useState(EXPORT_FORMATS.JSON);
    const [includeAssets, setIncludeAssets] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [exportUrl, setExportUrl] = useState(null);
    const [copied, setCopied] = useState(false);

    const generateExportData = async () => {
        { id: 'html', label: 'Standalone HTML', description: 'Single HTML file with everything included' },
        { id: 'zip', label: 'Project Archive', description: 'Complete project with all assets and source files' },
        { id: 'json', label: 'Project Data', description: 'Raw project data in JSON format' }
    ];

    const deployTargets = [
        { id: 'local', label: 'Local Download', description: 'Save to your computer' },
        { id: 'pages', label: 'GitHub Pages', description: 'Deploy to GitHub Pages' },
        { id: 'netlify', label: 'Netlify', description: 'Deploy to Netlify' },
        { id: 'vercel', label: 'Vercel', description: 'Deploy to Vercel' }
    ];

    const generateExportData = async () => {
        const exportData = {
            version: '1.0',
            timestamp: Date.now(),
            project: {
                name: project.name,
                gridSize: project.gridSize,
                characters: Array.from(project.characters.entries()),
                rules: Array.from(project.rules.entries())
            }
        };

        if (includeAssets) {
            // Convert character sprites to data URLs
            const characters = await Promise.all(
                Array.from(project.characters.values()).map(async char => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = char.size;
                    canvas.height = char.size;

                    // Draw character sprite
                    char.pixels.forEach((row, y) => {
                        row.forEach((color, x) => {
                            ctx.fillStyle = color;
                            ctx.fillRect(x, y, 1, 1);
                        });
                    });

                    return {
                        ...char,
                        spriteData: canvas.toDataURL()
                    };
                })
            );

            exportData.project.characters = characters;
        }

        return exportData;
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const exportData = await generateExportData();

            switch (selectedFormat) {
                case EXPORT_FORMATS.JSON: {
                    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                        type: 'application/json'
                    });
                    const url = URL.createObjectURL(blob);
                    setExportUrl(url);
                    
                    // Trigger download
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${project.name}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    break;
                }

                case EXPORT_FORMATS.ZIP: {
                    // Create ZIP file with project data and assets
                    const zip = new JSZip();
                    zip.file('project.json', JSON.stringify(exportData, null, 2));

                    if (includeAssets) {
                        const assets = zip.folder('assets');
                        project.characters.forEach((char, id) => {
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            canvas.width = char.size;
                            canvas.height = char.size;

                            char.pixels.forEach((row, y) => {
                                row.forEach((color, x) => {
                                    ctx.fillStyle = color;
                                    ctx.fillRect(x, y, 1, 1);
                                });
                            });

                            assets.file(`character_${id}.png`, canvas.toDataURL().split(',')[1], {
                                base64: true
                            });
                        });
                    }

                    const content = await zip.generateAsync({ type: 'blob' });
                    const url = URL.createObjectURL(content);
                    setExportUrl(url);

                    // Trigger download
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${project.name}.zip`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    break;
                }

                case EXPORT_FORMATS.HTML: {
                    // Generate standalone HTML file
                    const template = await fetch('/templates/standalone.html').then(r => r.text());
                    const html = template
                        .replace('{{PROJECT_DATA}}', JSON.stringify(exportData))
                        .replace('{{PROJECT_NAME}}', project.name);

                    const blob = new Blob([html], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    setExportUrl(url);

                    // Trigger download
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${project.name}.html`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    break;
                }
            }
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setIsExporting(false);
        }
    };

    const copyToClipboard = async () => {
        try {
            const exportData = await generateExportData();
            await navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[500px] max-w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Export Project</h2>
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

                {/* Export Format */}
                <div className="mb-6">
                    <h3 className="font-medium mb-3">Export Format</h3>
                    <div className="space-y-2">
                        {exportFormats.map(format => (
                            <label
                                key={format.id}
                                className="flex items-start p-3 border rounded cursor-pointer hover:bg-gray-50"
                            >
                                <input
                                    type="radio"
                                    name="format"
                                    value={format.id}
                                    checked={exportFormat === format.id}
                                    onChange={(e) => setExportFormat(e.target.value)}
                                    className="mt-1 mr-3"
                                />
                                <div>
                                    <div className="font-medium">{format.label}</div>
                                    <div className="text-sm text-gray-500">{format.description}</div>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Export Options */}
                <div className="mb-6">
                    <h3 className="font-medium mb-3">Options</h3>
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={exportOptions.minify}
                                onChange={(e) => setExportOptions(prev => ({
                                    ...prev,
                                    minify: e.target.checked
                                }))}
                                className="mr-2"
                            />
                            Minify output
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={exportOptions.includeAssets}
                                onChange={(e) => setExportOptions(prev => ({
                                    ...prev,
                                    includeAssets: e.target.checked
                                }))}
                                className="mr-2"
                            />
                            Include assets
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={exportOptions.standalone}
                                onChange={(e) => setExportOptions(prev => ({
                                    ...prev,
                                    standalone: e.target.checked
                                }))}
                                className="mr-2"
                            />
                            Standalone mode
                        </label>
                        <div>
                            <label className="block text-sm mb-1">Optimization Level</label>
                            <select
                                value={exportOptions.optimization}
                                onChange={(e) => setExportOptions(prev => ({
                                    ...prev,
                                    optimization: e.target.value
                                }))}
                                className="w-full p-2 border rounded"
                            >
                                <option value="none">None</option>
                                <option value="balanced">Balanced</option>
                                <option value="max">Maximum</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Deploy Target */}
                <div className="mb-6">
                    <h3 className="font-medium mb-3">Deploy To</h3>
                    <div className="space-y-2">
                        {deployTargets.map(target => (
                            <label
                                key={target.id}
                                className="flex items-start p-3 border rounded cursor-pointer hover:bg-gray-50"
                            >
                                <input
                                    type="radio"
                                    name="target"
                                    value={target.id}
                                    checked={deployTarget === target.id}
                                    onChange={(e) => setDeployTarget(e.target.value)}
                                    className="mt-1 mr-3"
                                />
                                <div>
                                    <div className="font-medium">{target.label}</div>
                                    <div className="text-sm text-gray-500">{target.description}</div>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isExporting ? 'Exporting...' : 'Export Project'}
                    </button>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Download className="w-5 h-5" />
                            <h2 className="text-xl font-semibold">Export Project</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            ×
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Export Format */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Export Format
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => setSelectedFormat(EXPORT_FORMATS.JSON)}
                                    className={`
                                        p-3 rounded-lg border flex flex-col items-center gap-2
                                        ${selectedFormat === EXPORT_FORMATS.JSON
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'hover:bg-gray-50'
                                        }
                                    `}
                                >
                                    <FileJson className="w-5 h-5" />
                                    <span className="text-sm">JSON</span>
                                </button>
                                <button
                                    onClick={() => setSelectedFormat(EXPORT_FORMATS.ZIP)}
                                    className={`
                                        p-3 rounded-lg border flex flex-col items-center gap-2
                                        ${selectedFormat === EXPORT_FORMATS.ZIP
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'hover:bg-gray-50'
                                        }
                                    `}
                                >
                                    <Archive className="w-5 h-5" />
                                    <span className="text-sm">ZIP Archive</span>
                                </button>
                                <button
                                    onClick={() => setSelectedFormat(EXPORT_FORMATS.HTML)}
                                    className={`
                                        p-3 rounded-lg border flex flex-col items-center gap-2
                                        ${selectedFormat === EXPORT_FORMATS.HTML
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'hover:bg-gray-50'
                                        }
                                    `}
                                >
                                    <Code className="w-5 h-5" />
                                    <span className="text-sm">HTML</span>
                                </button>
                            </div>
                        </div>

                        {/* Options */}
                        <div>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={includeAssets}
                                    onChange={(e) => setIncludeAssets(e.target.checked)}
                                />
                                <span className="text-sm">Include assets (sprites, sounds)</span>
                            </label>
                        </div>

                        {/* Export Actions */}
                        <div className="flex justify-between">
                            <button
                                onClick={copyToClipboard}
                                className="px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-100"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        Copy to Clipboard
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleExport}
                                disabled={isExporting}
                                className={`
                                    px-4 py-2 rounded flex items-center gap-2
                                    ${isExporting
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                                    }
                                `}
                            >
                                <Download className="w-4 h-4" />
                                {isExporting ? 'Exporting...' : 'Export'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectExport;