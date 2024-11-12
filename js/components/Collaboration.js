const Collaboration = ({ project, onClose }) => {
    const [collaborators, setCollaborators] = React.useState([]);
    const [onlineUsers, setOnlineUsers] = React.useState([]);
    const [chatMessages, setChatMessages] = React.useState([]);
    const [newMessage, setNewMessage] = React.useState('');
    const [activeTab, setActiveTab] = React.useState('chat');
    const chatRef = React.useRef(null);

    // Mock data
    React.useEffect(() => {
        setCollaborators([
            { id: 1, name: 'John Doe', email: 'john@example.com', role: 'owner', online: true },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'editor', online: true },
            { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'viewer', online: false }
        ]);

        setOnlineUsers([
            { id: 1, name: 'John Doe', cursor: { x: 100, y: 100 }, selection: null },
            { id: 2, name: 'Jane Smith', cursor: { x: 200, y: 150 }, selection: 'character-1' }
        ]);

        setChatMessages([
            { id: 1, user: 'John Doe', message: 'Hey, I added a new character!', timestamp: Date.now() - 300000 },
            { id: 2, user: 'Jane Smith', message: 'Looks good! Can you adjust the movement speed?', timestamp: Date.now() - 200000 },
            { id: 3, user: 'John Doe', message: 'Sure, I\'ll update the rules.', timestamp: Date.now() - 100000 }
        ]);
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setChatMessages(prev => [...prev, {
            id: Date.now(),
            user: 'You',
            message: newMessage,
            timestamp: Date.now()
        }]);
        setNewMessage('');

        // Scroll to bottom of chat
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[800px] max-w-full mx-4 h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Collaboration</h2>
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

                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('chat')}
                        className={`px-4 py-2 rounded ${
                            activeTab === 'chat' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                        }`}
                    >
                        Chat
                    </button>
                    <button
                        onClick={() => setActiveTab('collaborators')}
                        className={`px-4 py-2 rounded ${
                            activeTab === 'collaborators' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                        }`}
                    >
                        Collaborators
                    </button>
                    <button
                        onClick={() => setActiveTab('cursors')}
                        className={`px-4 py-2 rounded ${
                            activeTab === 'cursors' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                        }`}
                    >
                        Live Cursors
                    </button>
                </div>

                <div className="flex-1 overflow-hidden">
                    {activeTab === 'chat' && (
                        <div className="h-full flex flex-col">
                            <div
                                ref={chatRef}
                                className="flex-1 overflow-y-auto p-4 space-y-4"
                            >
                                {chatMessages.map(msg => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.user === 'You' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[70%] rounded-lg p-3 ${
                                            msg.user === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                                        }`}>
                                            <div className="text-sm font-medium mb-1">
                                                {msg.user} • {formatTimestamp(msg.timestamp)}
                                            </div>
                                            <div>{msg.message}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={sendMessage} className="p-4 border-t">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 p-2 border rounded"
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Send
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'collaborators' && (
                        <div className="p-4 space-y-4">
                            {collaborators.map(user => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between p-4 border rounded"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-3 h-3 rounded-full ${
                                            user.online ? 'bg-green-500' : 'bg-gray-300'
                                        }`} />
                                        <div>
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">{user.role}</span>
                                        <button className="text-blue-500 hover:text-blue-600">
                                            Edit Role
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'cursors' && (
                        <div className="p-4">
                            <div className="border rounded p-4 bg-gray-50">
                                <h3 className="font-medium mb-4">Online Users</h3>
                                {onlineUsers.map(user => (
                                    <div key={user.id} className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <span>{user.name}</span>
                                        {user.selection && (
                                            <span className="text-sm text-gray-500">
                                                (Selecting: {user.selection})
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Collaboration;