import React, { useState, useEffect } from 'react';
import { Book, ChevronRight, ChevronLeft, Check, X } from 'lucide-react';

const TUTORIALS = [
    {
        id: 'basics',
        title: 'Getting Started',
        steps: [
            {
                title: 'Welcome to StageCraft Creator',
                content: 'Learn how to create interactive games and simulations using visual programming.',
                action: 'next'
            },
            {
                title: 'Creating Characters',
                content: 'Click the "Add Character" button to create your first character. Use the sprite editor to design how it looks.',
                target: '.add-character-btn',
                action: 'click'
            },
            {
                title: 'Placing Characters',
                content: 'Click on the grid to place your character. You can move it around by clicking different cells.',
                target: '.grid-cell',
                action: 'click'
            },
            {
                title: 'Creating Rules',
                content: 'Select a character and click "Add Rule" to create behavior rules. Rules determine how characters act.',
                target: '.add-rule-btn',
                action: 'click'
            },
            {
                title: 'Running the Simulation',
                content: 'Click the Play button to start your simulation and see your rules in action!',
                target: '.play-btn',
                action: 'click'
            }
        ]
    },
    {
        id: 'advanced',
        title: 'Advanced Features',
        steps: [
            {
                title: 'Multiple Rules',
                content: 'Characters can have multiple rules. Rules are checked in order from top to bottom.',
                target: '.rules-list',
                action: 'next'
            },
            {
                title: 'Rule Conditions',
                content: 'Rules can have conditions like key presses, collisions, or proximity to other characters.',
                target: '.rule-conditions',
                action: 'next'
            },
            {
                title: 'Animations',
                content: 'Create multiple frames for your characters to add animations.',
                target: '.sprite-frames',
                action: 'next'
            }
        ]
    }
];

const Tutorial = ({ onComplete, onClose }) => {
    const [currentTutorial, setCurrentTutorial] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [showHighlight, setShowHighlight] = useState(true);

    const tutorial = TUTORIALS[currentTutorial];
    const step = tutorial.steps[currentStep];
    const isLastStep = currentStep === tutorial.steps.length - 1;
    const isLastTutorial = currentTutorial === TUTORIALS.length - 1;

    useEffect(() => {
        if (step.target) {
            const element = document.querySelector(step.target);
            if (element) {
                highlightElement(element);
            }
        }
    }, [currentStep, currentTutorial]);

    const highlightElement = (element) => {
        const rect = element.getBoundingClientRect();
        const highlight = document.createElement('div');
        highlight.className = 'tutorial-highlight';
        highlight.style.position = 'fixed';
        highlight.style.top = `${rect.top}px`;
        highlight.style.left = `${rect.left}px`;
        highlight.style.width = `${rect.width}px`;
        highlight.style.height = `${rect.height}px`;
        highlight.style.border = '2px solid #3B82F6';
        highlight.style.borderRadius = '4px';
        highlight.style.animation = 'pulse 2s infinite';
        highlight.style.pointerEvents = 'none';
        highlight.style.zIndex = '1000';
        
        document.body.appendChild(highlight);

        return () => {
            document.body.removeChild(highlight);
        };
    };

    const handleNext = () => {
        if (isLastStep) {
            if (isLastTutorial) {
                onComplete?.();
                onClose();
            } else {
                setCurrentTutorial(prev => prev + 1);
                setCurrentStep(0);
            }
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep === 0) {
            if (currentTutorial > 0) {
                setCurrentTutorial(prev => prev - 1);
                setCurrentStep(TUTORIALS[currentTutorial - 1].steps.length - 1);
            }
        } else {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSkip = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            {/* Tutorial Dialog */}
            <div 
                className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-6 w-[500px] pointer-events-auto"
                style={{ maxWidth: 'calc(100vw - 2rem)' }}
            >
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 rounded-t-lg overflow-hidden">
                    <div 
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ 
                            width: `${((currentTutorial * tutorial.steps.length + currentStep + 1) / 
                                    (TUTORIALS.reduce((acc, t) => acc + t.steps.length, 0))) * 100}%` 
                        }}
                    />
                </div>

                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-medium">{step.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{step.content}</p>
                    </div>
                    <button
                        onClick={handleSkip}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex justify-between items-center mt-6">
                    <button
                        onClick={handlePrevious}
                        disabled={currentTutorial === 0 && currentStep === 0}
                        className={`
                            flex items-center gap-1 px-3 py-1 rounded
                            ${currentTutorial === 0 && currentStep === 0
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-600 hover:bg-gray-100'
                            }
                        `}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </button>

                    <div className="text-sm text-gray-500">
                        Step {currentStep + 1} of {tutorial.steps.length}
                    </div>

                    <button
                        onClick={handleNext}
                        className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        {isLastStep && isLastTutorial ? (
                            <>
                                <Check className="w-4 h-4" />
                                Finish
                            </>
                        ) : (
                            <>
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Tutorial;
