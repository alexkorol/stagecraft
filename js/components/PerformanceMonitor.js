const PerformanceMonitor = ({ onClose }) => {
    const [metrics, setMetrics] = React.useState({
        fps: [],
        memory: [],
        entities: 0,
        rules: 0,
        lastUpdate: Date.now()
    });
    const [isMonitoring, setIsMonitoring] = React.useState(true);
    const [selectedMetric, setSelectedMetric] = React.useState('fps');
    const [timeRange, setTimeRange] = React.useState('1m');
    const requestRef = React.useRef();
    const fpsRef = React.useRef();

    // Simulate performance monitoring
    React.useEffect(() => {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const measureFPS = () => {
            const now = performance.now();
            frameCount++;
            
            if (now - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (now - lastTime));
                setMetrics(prev => ({
                    ...prev,
                    fps: [...prev.fps.slice(-60), fps],
                    lastUpdate: Date.now()
                }));
                frameCount = 0;
                lastTime = now;
            }

            if (isMonitoring) {
                requestRef.current = requestAnimationFrame(measureFPS);
            }
        };

        if (isMonitoring) {
            requestRef.current = requestAnimationFrame(measureFPS);
        }

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [isMonitoring]);

    // Simulate memory monitoring
    React.useEffect(() => {
        const interval = setInterval(() => {
            if (isMonitoring) {
                // Mock memory usage data
                const memoryUsage = Math.random() * 100 + 50; // MB
                setMetrics(prev => ({
                    ...prev,
                    memory: [...prev.memory.slice(-60), memoryUsage],
                    entities: Math.floor(Math.random() * 50) + 10,
                    rules: Math.floor(Math.random() * 100) + 20
                }));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isMonitoring]);

    const renderChart = (data, label, color = 'blue') => {
        if (!data.length) return null;

        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min;

        return (
            <div className="h-48 flex items-end gap-1">
                {data.map((value, index) => {
                    const height = range ? ((value - min) / range) * 100 : 0;
                    return (
                        <div
                            key={index}
                            className="flex-1 relative group"
                            style={{ height: '100%' }}
                        >
                            <div
                                className={`absolute bottom-0 w-full bg-${color}-500 transition-all duration-200`}
                                style={{ height: `${height}%` }}
                            >
                                <div className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                                    {value.toFixed(1)} {label}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const getAverageValue = (data) => {
        if (!data.length) return 0;
        return (data.reduce((a, b) => a + b, 0) / data.length).toFixed(1);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[900px] max-w-full mx-4 h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Performance Monitor</h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMonitoring(prev => !prev)}
                            className={`px-4 py-2 rounded ${
                                isMonitoring ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                            }`}
                        >
                            {isMonitoring ? 'Stop' : 'Start'} Monitoring
                        </button>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="border rounded-lg p-4">
                        <div className="text-sm text-gray-500 mb-1">FPS</div>
                        <div className="text-2xl font-bold">
                            {getAverageValue(metrics.fps)}
                        </div>
                    </div>
                    <div className="border rounded-lg p-4">
                        <div className="text-sm text-gray-500 mb-1">Memory Usage</div>
                        <div className="text-2xl font-bold">
                            {getAverageValue(metrics.memory)} MB
                        </div>
                    </div>
                    <div className="border rounded-lg p-4">
                        <div className="text-sm text-gray-500 mb-1">Active Entities</div>
                        <div className="text-2xl font-bold">
                            {metrics.entities}
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 mb-4">
                    <select
                        value={selectedMetric}
                        onChange={(e) => setSelectedMetric(e.target.value)}
                        className="p-2 border rounded"
                    >
                        <option value="fps">FPS</option>
                        <option value="memory">Memory Usage</option>
                    </select>
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="p-2 border rounded"
                    >
                        <option value="1m">Last Minute</option>
                        <option value="5m">Last 5 Minutes</option>
                        <option value="15m">Last 15 Minutes</option>
                    </select>
                </div>

                <div className="flex-1 border rounded-lg p-4">
                    {selectedMetric === 'fps' ? (
                        renderChart(metrics.fps, 'FPS', 'green')
                    ) : (
                        renderChart(metrics.memory, 'MB', 'blue')
                    )}
                </div>

                <div className="mt-6 pt-6 border-t">
                    <h3 className="font-medium mb-4">Performance Recommendations</h3>
                    <div className="space-y-2 text-sm">
                        {metrics.fps.length > 0 && metrics.fps[metrics.fps.length - 1] < 30 && (
                            <div className="flex items-center gap-2 text-yellow-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span>Low FPS detected. Consider reducing the number of active entities.</span>
                            </div>
                        )}
                        {metrics.memory.length > 0 && metrics.memory[metrics.memory.length - 1] > 150 && (
                            <div className="flex items-center gap-2 text-red-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>High memory usage. Consider cleaning up unused assets.</span>
                            </div>
                        )}
                        {metrics.rules > 50 && (
                            <div className="flex items-center gap-2 text-blue-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Large number of rules may impact performance. Consider optimizing rule conditions.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerformanceMonitor;