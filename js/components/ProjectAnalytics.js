const ProjectAnalytics = ({ project, onClose }) => {
    const [timeRange, setTimeRange] = React.useState('7d');
    const [metrics, setMetrics] = React.useState({
        views: [],
        runs: [],
        shares: [],
        forks: [],
        averageRunTime: 0,
        totalRules: 0,
        activeCharacters: 0,
        mostUsedRules: [],
        popularCharacters: [],
        performance: {
            fps: 0,
            memory: 0,
            cpuUsage: 0
        }
    });
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        // Simulate loading analytics data
        setIsLoading(true);
        setTimeout(() => {
            // Mock data generation
            const generateTimeSeriesData = (days, max) => {
                return Array.from({ length: days }, (_, i) => ({
                    date: new Date(Date.now() - (days - i - 1) * 86400000).toISOString().split('T')[0],
                    value: Math.floor(Math.random() * max)
                }));
            };

            setMetrics({
                views: generateTimeSeriesData(7, 100),
                runs: generateTimeSeriesData(7, 50),
                shares: generateTimeSeriesData(7, 20),
                forks: generateTimeSeriesData(7, 10),
                averageRunTime: Math.random() * 60,
                totalRules: Math.floor(Math.random() * 50),
                activeCharacters: Math.floor(Math.random() * 20),
                mostUsedRules: [
                    { name: 'Move Right', count: 156 },
                    { name: 'Jump', count: 89 },
                    { name: 'Collect Item', count: 67 },
                    { name: 'Attack', count: 45 },
                    { name: 'Change State', count: 34 }
                ],
                popularCharacters: [
                    { name: 'Player', usage: 95 },
                    { name: 'Enemy', usage: 78 },
                    { name: 'Coin', usage: 56 },
                    { name: 'Platform', usage: 45 },
                    { name: 'Power-up', usage: 23 }
                ],
                performance: {
                    fps: 58,
                    memory: 84,
                    cpuUsage: 25
                }
            });
            setIsLoading(false);
        }, 1000);
    }, [timeRange]);

    const renderChart = (data, label) => {
        if (!data.length) return null;

        const max = Math.max(...data.map(d => d.value));
        return (
            <div className="h-40">
                <div className="flex h-full items-end gap-1">
                    {data.map((point, index) => (
                        <div
                            key={index}
                            className="flex-1 group relative"
                        >
                            <div
                                className="bg-blue-500 hover:bg-blue-600 transition-all"
                                style={{ height: `${(point.value / max) * 100}%` }}
                            >
                                <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {point.value} {label} on {point.date}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6">
                    Loading analytics...
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[900px] max-w-full mx-4 h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Project Analytics</h2>
                    <div className="flex items-center gap-4">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="p-2 border rounded"
                        >
                            <option value="1d">Last 24 hours</option>
                            <option value="7d">Last 7 days</option>
                            <option value="30d">Last 30 days</option>
                            <option value="90d">Last 90 days</option>
                        </select>
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
                </div>

                <div className="flex-1 overflow-y-auto">
                    {/* Overview Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="border rounded-lg p-4">
                            <div className="text-sm text-gray-500 mb-1">Total Views</div>
                            <div className="text-2xl font-bold">
                                {metrics.views.reduce((sum, point) => sum + point.value, 0)}
                            </div>
                            {renderChart(metrics.views, 'views')}
                        </div>
                        <div className="border rounded-lg p-4">
                            <div className="text-sm text-gray-500 mb-1">Total Runs</div>
                            <div className="text-2xl font-bold">
                                {metrics.runs.reduce((sum, point) => sum + point.value, 0)}
                            </div>
                            {renderChart(metrics.runs, 'runs')}
                        </div>
                        <div className="border rounded-lg p-4">
                            <div className="text-sm text-gray-500 mb-1">Shares & Forks</div>
                            <div className="text-2xl font-bold">
                                {metrics.shares.reduce((sum, point) => sum + point.value, 0)} / {' '}
                                {metrics.forks.reduce((sum, point) => sum + point.value, 0)}
                            </div>
                            {renderChart(metrics.shares, 'shares')}
                        </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="border rounded-lg p-4 mb-8">
                        <h3 className="font-medium mb-4">Performance</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Average FPS</div>
                                <div className="text-xl font-bold">{metrics.performance.fps}</div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div
                                        className="bg-green-500 rounded-full h-2"
                                        style={{ width: `${metrics.performance.fps}%` }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Memory Usage</div>
                                <div className="text-xl font-bold">{metrics.performance.memory}MB</div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div
                                        className="bg-blue-500 rounded-full h-2"
                                        style={{ width: `${metrics.performance.memory}%` }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 mb-1">CPU Usage</div>
                                <div className="text-xl font-bold">{metrics.performance.cpuUsage}%</div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div
                                        className="bg-yellow-500 rounded-full h-2"
                                        style={{ width: `${metrics.performance.cpuUsage}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Usage Analytics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="border rounded-lg p-4">
                            <h3 className="font-medium mb-4">Most Used Rules</h3>
                            <div className="space-y-2">
                                {metrics.mostUsedRules.map((rule, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between"
                                    >
                                        <span>{rule.name}</span>
                                        <span className="text-gray-500">{rule.count} uses</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="border rounded-lg p-4">
                            <h3 className="font-medium mb-4">Popular Characters</h3>
                            <div className="space-y-2">
                                {metrics.popularCharacters.map((char, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between"
                                    >
                                        <span>{char.name}</span>
                                        <span className="text-gray-500">{char.usage}% usage</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="border rounded-lg p-4">
                            <div className="text-sm text-gray-500 mb-1">Average Run Time</div>
                            <div className="text-xl font-bold">
                                {metrics.averageRunTime.toFixed(1)} seconds
                            </div>
                        </div>
                        <div className="border rounded-lg p-4">
                            <div className="text-sm text-gray-500 mb-1">Total Rules</div>
                            <div className="text-xl font-bold">{metrics.totalRules}</div>
                        </div>
                        <div className="border rounded-lg p-4">
                            <div className="text-sm text-gray-500 mb-1">Active Characters</div>
                            <div className="text-xl font-bold">{metrics.activeCharacters}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectAnalytics;