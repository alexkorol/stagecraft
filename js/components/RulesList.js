import React from 'react';
import { Plus, Trash2, Edit, ArrowRight } from 'lucide-react';
import { TRIGGERS } from '../constants';

const RulesList = ({ 
    character,
    rules,
    onAddRule,
    onEditRule,
    onDeleteRule,
    onMoveRule
}) => {
    const renderRulePreview = (rule) => {
        const gridSize = 3;
        const renderGrid = (grid) => (
            <div 
                className="grid gap-px bg-gray-100 p-1"
                style={{
                    gridTemplateColumns: `repeat(${gridSize}, 16px)`
                }}
            >
                {grid.map((row, y) =>
                    row.map((cell, x) => (
                        <div
                            key={`${x}-${y}`}
                            className={`w-4 h-4 ${
                                x === 1 && y === 1 ? 'bg-blue-100' : 'bg-white'
                            }`}
                        >
                            {cell && (
                                <div 
                                    className="w-full h-full"
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: `repeat(${cell.size}, 1fr)`
                                    }}
                                >
                                    {cell.pixels.map((prow, py) =>
                                        prow.map((color, px) => (
                                            <div
                                                key={`${px}-${py}`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        );

        return (
            <div className="flex items-center gap-2">
                {renderGrid(rule.before)}
                <ArrowRight className="w-4 h-4 text-gray-400" />
                {renderGrid(rule.after)}
            </div>
        );
    };

    const getTriggerLabel = (rule) => {
        switch (rule.trigger) {
            case TRIGGERS.KEY_PRESS:
                return `When '${rule.triggerKey}' pressed`;
            case TRIGGERS.COLLISION:
                return 'On collision';
            case TRIGGERS.PROXIMITY:
                return `Within ${rule.proximity} cells`;
            case TRIGGERS.TIMER:
                return 'Every tick';
            case TRIGGERS.CLICK:
                return 'When clicked';
            default:
                return 'Always';
        }
    };

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData('ruleIndex', index.toString());
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        const draggingIndex = parseInt(e.dataTransfer.getData('ruleIndex'));
        if (draggingIndex !== index) {
            const element = e.currentTarget;
            const rect = element.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;
            
            element.classList.remove('border-t-2', 'border-b-2');
            if (e.clientY < midY) {
                element.classList.add('border-t-2');
            } else {
                element.classList.add('border-b-2');
            }
        }
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('border-t-2', 'border-b-2');
    };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        const sourceIndex = parseInt(e.dataTransfer.getData('ruleIndex'));
        if (sourceIndex !== targetIndex) {
            onMoveRule(sourceIndex, targetIndex);
        }
        e.currentTarget.classList.remove('border-t-2', 'border-b-2');
    };

    return (
        <div className="w-64 bg-white p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Rules</h3>
                {character && (
                    <button
                        onClick={onAddRule}
                        className="p-1 rounded hover:bg-gray-100"
                        title="Add New Rule"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                )}
            </div>

            {!character ? (
                <div className="text-gray-500 text-sm text-center p-4">
                    Select a character to view and edit its rules
                </div>
            ) : (
                <div className="space-y-2">
                    {rules.map((rule, index) => (
                        <div
                            key={rule.id}
                            className="p-2 border rounded hover:bg-gray-50"
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, index)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-sm font-medium">
                                    {getTriggerLabel(rule)}
                                </span>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => onEditRule(rule)}
                                        className="p-1 rounded hover:bg-gray-200"
                                        title="Edit Rule"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDeleteRule(rule.id)}
                                        className="p-1 rounded hover:bg-red-100 text-red-600"
                                        title="Delete Rule"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            {renderRulePreview(rule)}
                        </div>
                    ))}

                    {rules.length === 0 && (
                        <div className="text-gray-500 text-sm text-center p-4">
                            No rules yet. Click the + button to add one.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default RulesList;
