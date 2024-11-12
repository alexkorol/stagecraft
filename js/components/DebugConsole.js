const DebugConsole = ({ onClose }) => {
    const [logs, setLogs] = React.useState([]);
    const [filter, setFilter] = React.useState('all');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isRecording, setIsRecording] = React.useState(false);
    const [autoScroll, setAutoScroll] = React.useState(true);
    const consoleRef = React.useRef(null);

    React.useEffect(() => {
        // Subscribe to debug events
        const handleDebugEvent = (event) => {
            addLog({
                type: event.type,
                message: event.message,
                details: event.details,
                timestamp: new Date().toISOString()
            });
        };

        window.addEventListener('debug', handleDebugEvent);
        return () => window.removeEventListener('debug', handleDebugEvent);
    }, []);

    React.useEffect(() => {
        if (autoScroll && consoleRef.current) {
            consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
        }
    }, [logs, autoScroll]);

    const addLog = (log) => {
        setLogs(prev => [...prev, {
            id: Date.now(),
            ...log
        }]);
    };

    const clearLogs = () => {
        setLogs([]);
    };

    const exportLogs = () => {
        const logData = JSON.stringify(logs, null, 2);
        const blob = new Blob([logData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `debug_logs_${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const toggleRecording = () => {
        setIsRecording(!isRecording);
    };

    const filteredLogs = React.useMemo(() => {
        return logs.filter(log => {
            const matchesFilter = filter === 'all' || log.type === filter;
            const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                JSON.stringify(log.details).toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [logs, filter, searchQuery]);

    const getLogIcon = (type) => {
        switch (type) {
            case 'error':
                return (
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            case 'warning':
                return (
                    <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                );
            case 'info':
                return (
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'success':
                return (
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
        }
    };

    const getLogColor = (type) => {
        switch (type) {
            case 'error':
                return 'text-red-500';
            case 'warning':
                return 'text-yellow-500';
            case 'info':
                return 'text-blue-500';
            case 'success':
                return 'text-green-500';
            default:
                return 'text-gray-700';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[900px] max-w-full mx-4 h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Debug Console</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Controls */}
                <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="p-2 border rounded"
                    >
                        <option value="all">All Logs</option>
                        <option value="error">Errors</option>
                        <option value="warning">Warnings</option>
                        <option value="info">Info</option>
                        <option value="success">Success</option>
                    </select>
                    <button
                        onClick={toggleRecording}
                        className={`px-4 py-2 rounded ${
                            isRecording ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                        }`}
                    >
                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                    </button>
                    <button
                        onClick={clearLogs}
                        className="px-4 py-2 bg-gray-500 text-white rounded"
                    >
                        Clear
                    </button>
                    <button
                        onClick={exportLogs}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Export
                    </button>
                </div>

                {/* Console Output */}
                <div
                    ref={consoleRef}
                    className="flex-1 bg-gray-900 text-white font-mono text-sm p-4 rounded overflow-y-auto"
                >
                    {filteredLogs.length === 0 ? (
                        <div className="text-gray-500 text-center py-4">
                            No logs to display
                        </div>
                    ) : (
                        filteredLogs.map(log => (
                            <div
                                key={log.id}
                                className={`mb-2 ${getLogColor(log.type)}`}
                            >
                                <div className="flex items-start gap-2">
                                    {getLogIcon(log.type)}
                                    <span className="text-gray-400">
                                        {new Date(log.timestamp).toLocaleTimeString()}
                                    </span>
                                    <span className="flex-1">{log.message}</span>
                                </div>
                                {log.details && (
                                    <pre className="ml-8 mt-1 text-gray-400 whitespace-pre-wrap">
                                        {JSON.stringify(log.details, null, 2)}
                                    </pre>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Status Bar */}
                <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                    <div>
                        {filteredLogs.length} logs displayed
                        {filter !== 'all' && ` (filtered from ${logs.length} total)`}
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={autoScroll}
                                onChange={(e) => setAutoScroll(e.target.checked)}
                                className="mr-2"
                            />
                            Auto-scroll
                        </label>
                        {isRecording && (
                            <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2" />
                                Recording...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DebugConsole;
