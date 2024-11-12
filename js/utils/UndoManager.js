class UndoManager {
    constructor(maxHistory = 50) {
        this.history = [];
        this.currentIndex = -1;
        this.maxHistory = maxHistory;
        this.isRecording = true;
    }

    // Record a new state
    record(state) {
        if (!this.isRecording) return;

        // Remove any future states if we're not at the end
        if (this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
        }

        // Add new state
        this.history.push(this.cloneState(state));
        this.currentIndex++;

        // Trim history if it exceeds max length
        if (this.history.length > this.maxHistory) {
            this.history.shift();
            this.currentIndex--;
        }
    }

    // Deep clone state to prevent reference issues
    cloneState(state) {
        return {
            characters: new Map(Array.from(state.characters.entries()).map(([id, char]) => [
                id,
                {
                    ...char,
                    pixels: char.pixels.map(row => [...row]),
                    frames: char.frames?.map(frame => frame.map(row => [...row]))
                }
            ])),
            rules: new Map(Array.from(state.rules.entries()).map(([id, rules]) => [
                id,
                rules.map(rule => ({
                    ...rule,
                    before: rule.before.map(row => [...row]),
                    after: rule.after.map(row => [...row])
                }))
            ])),
            gridSize: { ...state.gridSize },
            timestamp: Date.now()
        };
    }

    // Undo the last action
    undo() {
        if (!this.canUndo()) return null;
        this.currentIndex--;
        return this.cloneState(this.history[this.currentIndex]);
    }

    // Redo the last undone action
    redo() {
        if (!this.canRedo()) return null;
        this.currentIndex++;
        return this.cloneState(this.history[this.currentIndex]);
    }

    // Check if undo is available
    canUndo() {
        return this.currentIndex > 0;
    }

    // Check if redo is available
    canRedo() {
        return this.currentIndex < this.history.length - 1;
    }

    // Get current state
    getCurrentState() {
        if (this.currentIndex === -1) return null;
        return this.cloneState(this.history[this.currentIndex]);
    }

    // Clear history
    clear() {
        this.history = [];
        this.currentIndex = -1;
    }

    // Start a batch of changes
    startBatch() {
        this.isRecording = false;
    }

    // End a batch of changes and record the final state
    endBatch(state) {
        this.isRecording = true;
        if (state) {
            this.record(state);
        }
    }

    // Get history stats
    getStats() {
        return {
            totalStates: this.history.length,
            currentIndex: this.currentIndex,
            canUndo: this.canUndo(),
            canRedo: this.canRedo(),
            oldestState: this.history[0]?.timestamp,
            newestState: this.history[this.history.length - 1]?.timestamp
        };
    }

    // Export history to JSON
    exportHistory() {
        return JSON.stringify({
            history: this.history,
            currentIndex: this.currentIndex,
            maxHistory: this.maxHistory
        });
    }

    // Import history from JSON
    importHistory(json) {
        try {
            const data = JSON.parse(json);
            this.history = data.history.map(state => ({
                ...state,
                characters: new Map(state.characters),
                rules: new Map(state.rules)
            }));
            this.currentIndex = data.currentIndex;
            this.maxHistory = data.maxHistory;
            return true;
        } catch (error) {
            console.error('Failed to import history:', error);
            return false;
        }
    }

    // Get a specific state by index
    getStateAtIndex(index) {
        if (index < 0 || index >= this.history.length) return null;
        return this.cloneState(this.history[index]);
    }

    // Get a list of changes between two states
    getChangesBetweenStates(fromIndex, toIndex) {
        if (fromIndex < 0 || toIndex >= this.history.length) return null;

        const fromState = this.history[fromIndex];
        const toState = this.history[toIndex];
        const changes = {
            characters: {
                added: [],
                removed: [],
                modified: []
            },
            rules: {
                added: [],
                removed: [],
                modified: []
            }
        };

        // Check character changes
        const fromChars = Array.from(fromState.characters.keys());
        const toChars = Array.from(toState.characters.keys());

        changes.characters.added = toChars.filter(id => !fromChars.includes(id));
        changes.characters.removed = fromChars.filter(id => !toChars.includes(id));
        changes.characters.modified = fromChars.filter(id => 
            toChars.includes(id) && 
            JSON.stringify(fromState.characters.get(id)) !== 
            JSON.stringify(toState.characters.get(id))
        );

        // Check rule changes
        const fromRules = Array.from(fromState.rules.keys());
        const toRules = Array.from(toState.rules.keys());

        changes.rules.added = toRules.filter(id => !fromRules.includes(id));
        changes.rules.removed = fromRules.filter(id => !toRules.includes(id));
        changes.rules.modified = fromRules.filter(id => 
            toRules.includes(id) && 
            JSON.stringify(fromState.rules.get(id)) !== 
            JSON.stringify(toState.rules.get(id))
        );

        return changes;
    }
}

export default new UndoManager();
