const FeedbackForm = ({ onClose }) => {
    const [feedback, setFeedback] = React.useState({
        type: 'bug',
        title: '',
        description: '',
        steps: '',
        expectedBehavior: '',
        actualBehavior: '',
        systemInfo: {
            browser: navigator.userAgent,
            platform: navigator.platform,
            screenSize: `${window.innerWidth}x${window.innerHeight}`
        },
        attachments: [],
        email: '',
        priority: 'medium'
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const fileInputRef = React.useRef();

    const feedbackTypes = [
        { id: 'bug', label: 'Bug Report', icon: 'bug' },
        { id: 'feature', label: 'Feature Request', icon: 'lightbulb' },
        { id: 'improvement', label: 'Improvement', icon: 'tool' },
        { id: 'question', label: 'Question', icon: 'help-circle' }
    ];

    const priorities = [
        { id: 'low', label: 'Low', color: 'bg-gray-500' },
        { id: 'medium', label: 'Medium', color: 'bg-yellow-500' },
        { id: 'high', label: 'High', color: 'bg-red-500' }
    ];

    const handleInputChange = (key, value) => {
        setFeedback(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        setFeedback(prev => ({
            ...prev,
            attachments: [...prev.attachments, ...files]
        }));
    };

    const removeAttachment = (index) => {
        setFeedback(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // In a real implementation, this would send the feedback to a server
            await new Promise(resolve => setTimeout(resolve, 1500));
            window.showToast?.('Feedback submitted successfully', 'success');
            onClose();
        } catch (error) {
            window.showToast?.('Failed to submit feedback: ' + error.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[800px] max-w-full mx-4 h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Submit Feedback</h2>
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

                <div className="flex-1 overflow-y-auto">
                    {/* Feedback Type */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Type</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {feedbackTypes.map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => handleInputChange('type', type.id)}
                                    className={`p-4 border rounded-lg text-center transition-all ${
                                        feedback.type === type.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'hover:border-gray-300'
                                    }`}
                                >
                                    <div className="font-medium">{type.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Title</label>
                        <input
                            type="text"
                            value={feedback.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="Brief summary of your feedback"
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                            value={feedback.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Detailed description of your feedback"
                            rows={4}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {feedback.type === 'bug' && (
                        <>
                            {/* Steps to Reproduce */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">Steps to Reproduce</label>
                                <textarea
                                    value={feedback.steps}
                                    onChange={(e) => handleInputChange('steps', e.target.value)}
                                    placeholder="1. First step&#10;2. Second step&#10;3. ..."
                                    rows={3}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            {/* Expected vs Actual */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Expected Behavior</label>
                                    <textarea
                                        value={feedback.expectedBehavior}
                                        onChange={(e) => handleInputChange('expectedBehavior', e.target.value)}
                                        placeholder="What should happen?"
                                        rows={3}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Actual Behavior</label>
                                    <textarea
                                        value={feedback.actualBehavior}
                                        onChange={(e) => handleInputChange('actualBehavior', e.target.value)}
                                        placeholder="What actually happened?"
                                        rows={3}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Priority */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Priority</label>
                        <div className="flex gap-4">
                            {priorities.map(priority => (
                                <button
                                    key={priority.id}
                                    onClick={() => handleInputChange('priority', priority.id)}
                                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                                        feedback.priority === priority.id
                                            ? 'bg-gray-100 border-2 border-gray-300'
                                            : ''
                                    }`}
                                >
                                    <div className={`w-3 h-3 rounded-full ${priority.color}`} />
                                    {priority.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Attachments */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Attachments</label>
                        <div className="space-y-2">
                            {feedback.attachments.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-2 border rounded"
                                >
                                    <div className="flex items-center gap-2">
                                        <svg
                                            className="w-4 h-4 text-gray-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                            />
                                        </svg>
                                        <span>{file.name}</span>
                                    </div>
                                    <button
                                        onClick={() => removeAttachment(index)}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full p-4 border-2 border-dashed rounded-lg text-center text-gray-500 hover:text-gray-700 hover:border-gray-400"
                            >
                                Click or drag files to attach
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                className="hidden"
                                onChange={handleFileSelect}
                            />
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Email (optional)</label>
                        <input
                            type="email"
                            value={feedback.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="Your email for follow-up"
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {/* System Info */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">System Information</label>
                        <div className="bg-gray-50 p-4 rounded text-sm">
                            <div>Browser: {feedback.systemInfo.browser}</div>
                            <div>Platform: {feedback.systemInfo.platform}</div>
                            <div>Screen Size: {feedback.systemInfo.screenSize}</div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-6 border-t flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !feedback.title || !feedback.description}
                        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackForm;