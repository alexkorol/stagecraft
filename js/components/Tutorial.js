const Tutorial = ({ onClose, currentStep = 0 }) => {
    const [step, setStep] = React.useState(currentStep);

    const tutorials = [
        {
            title: "Welcome to StageCraft Creator!",
            content: "Learn how to create interactive games and simulations using visual programming. Let's get started!",
            image: null
        },
        {
            title: "Creating Characters",
            content: "Click 'Add Character' to open the sprite editor. Draw your character using the pixel editor and color palette.",
            highlight: ".add-character-btn"
        },
        {
            title: "Placing Characters",
            content: "Select a character from the palette and click on the grid to place it.",
            highlight: ".grid-cell"
        },
        {
            title: "Creating Rules",
            content: "Select a character and click 'Add Rule' to create behavior rules. Rules determine how characters act during simulation.",
            highlight: ".add-rule-btn"
        },
        {
            title: "Running Simulation",
            content: "Click the Play button to start the simulation and watch your characters follow their rules!",
            highlight: ".play-btn"
        },
        {
            title: "Saving Your Work",
            content: "Don't forget to save your project! Click 'Save' to store your work and 'Load' to return to it later.",
            highlight: ".save-btn"
        }
    ];

    const handleNext = () => {
        if (step < tutorials.length - 1) {
            setStep(step + 1);
        } else {
            onClose();
        }
    };

    const handlePrevious = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    const handleSkip = () => {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('tutorial_completed', 'true');
        }
        onClose();
    };

    React.useEffect(() => {
        // Highlight the relevant element
        const highlightClass = tutorials[step].highlight;
        if (highlightClass) {
            const element = document.querySelector(highlightClass);
            if (element) {
                element.classList.add('tutorial-highlight');
            }
        }

        return () => {
            // Clean up highlight
            const element = document.querySelector(tutorials[step].highlight);
            if (element) {
                element.classList.remove('tutorial-highlight');
            }
        };
    }, [step]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                {/* Progress indicator */}
                <div className="flex gap-1 mb-4">
                    {tutorials.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1 flex-1 rounded ${
                                index <= step ? 'bg-blue-500' : 'bg-gray-200'
                            }`}
                        />
                    ))}
                </div>

                {/* Tutorial content */}
                <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">
                        {tutorials[step].title}
                    </h3>
                    <p className="text-gray-600">
                        {tutorials[step].content}
                    </p>
                    {tutorials[step].image && (
                        <img
                            src={tutorials[step].image}
                            alt="Tutorial"
                            className="mt-4 rounded border"
                        />
                    )}
                </div>

                {/* Navigation buttons */}
                <div className="flex justify-between">
                    <div>
                        {step > 0 && (
                            <button
                                onClick={handlePrevious}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Previous
                            </button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSkip}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Skip Tutorial
                        </button>
                        <button
                            onClick={handleNext}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            {step === tutorials.length - 1 ? 'Finish' : 'Next'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tutorial;