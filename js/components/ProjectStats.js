```javascript
import React, { useState, useEffect } from 'react';
import { BarChart2, Clock, Users, Code, Activity, Zap, Share2, Eye } from 'lucide-react';
import ProjectOptimizer from '../utils/ProjectOptimizer';

const ProjectStats = ({ project, onClose }) => {
    const [stats, setStats] = useState(null);
    const [timeRange, setTimeRange] = useState('all'); // all, month, week, day

    useEffect(() => {
        calculateStats();
    }, [project, timeRange]);

    const calculateStats = () => {
        const metrics = ProjectOptimizer.analyzePerformance(project);
        
        // Calculate complexity metrics
        const complexity = {
            total: 0,
            characters: project.characters.size * 10,
            rules: Array.from(project.rules.values()).reduce((acc, rules) => acc + rules.length * 5, 0),
            interactions: calculateInteractionComplexity()
        };
        complexity.total = complexity.characters + complexity.rules + complexity.interactions;

        // Calculate usage metrics
        const usage = {
            totalRuns: project.stats?.runs || 0,
            averageRunTime: project.stats?.averageRunTime || 0,
            lastRun: project.stats?.lastRun,
            views: project.stats?.views || 0,
            shares: project.stats?.shares || 0,
            forks: project.stats?.forks || 0
        };

        setStats({
            metrics,
            complexity,
            usage,
            performance: {
                fps: metrics.fps || 60,
                memoryUsage: metrics.memoryUsage || 0,
                ruleExecutions: metrics.ruleExecutions || 0
            }
        });
    };

    const calculateInteractionComplexity = () => {
        let complexity = 0;
        project.rules.forEach(rules => {
            rules.forEach(rule => {
                // Add complexity for different types of rules
                if (rule.trigger === 'keyPress') complexity += 2;
                if (rule.trigger === 'collision') complexity += 3;
                if (rule.trigger === 'proximity') complexity += 4;
                if (rule.conditions?.length) complexity += rule.conditions.length * 2;
            });
        });
        return complexity;
    };

    if (!stats) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[800px] max-w-full">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <BarChart2 className="w-5 h-5" />
                            <h2 className="text-xl font-semibold">Project Statistics</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            ×
                        </button>
                    </div>

                    {/* Time Range Selector */}
                    <div className="mb-6">
                        <div className="flex gap-2">
                            {['day', 'week', 'month', 'all'].map(range => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`
                                        px-3 py-1 rounded-full text-sm
                                        ${timeRange === range
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                        }
                                    `}
                                >
                                    {range.charAt(0).toUpperCase() + range.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Project Overview */}
                        <div className="space-y-4">
                            <h3 className="font-medium">Project Overview</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Users className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm">Characters</span>
                                    </div>
                                    <p className="text-2xl font-bold">{project.characters.size}</p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Code className="w-4 h-4 text-green-500" />
                                        <span className="text-sm">Rules</span>
                                    </div>
                                    <p className="text-2xl font-bold">
                                        {Array.from(project.rules.values()).reduce((acc, rules) => acc + rules.length, 0)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="space-y-4">
                            <h3 className="font-medium">Performance</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">FPS</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-blue-500"
                                                style={{ width: `${(stats.performance.fps / 60) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm">{stats.performance.fps}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Rule Executions</span>
                                    <span className="text-sm">{stats.performance.ruleExecutions}/frame</span>
                                </div>
                            </div>
                        </div>

                        {/* Usage Statistics */}
                        <div className="space-y-4">
                            <h3 className="font-medium">Usage</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <Eye className="w-4 h-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-600">Views</p>
                                        <p className="font-medium">{stats.usage.views}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Share2 className="w-4 h-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-600">Shares</p>
                                        <p className="font-medium">{stats.usage.shares}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-600">Average Run Time</p>
                                        <p className="font-medium">{Math.round(stats.usage.averageRunTime)}s</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-600">Total Runs</p>
                                        <p className="font-medium">{stats.usage.totalRuns}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Complexity Analysis */}
                        <div className="space-y-4">
                            <h3 className="font-medium">Complexity Score</h3>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm text-gray-600">Overall Complexity</span>
                                    <span className="font-medium">{stats.complexity.total}/100</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-blue-500"
                                            style={{ width: `${(stats.complexity.total / 100) * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Simple</span>
                                        <span>Complex</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectStats;
```
