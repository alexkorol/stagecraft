class UndoManager {
    constructor(maxHistory = 50) {
        this.maxHistory = maxHistory;
        this.undoStack = [];
        this.redoStack = [];
        this.currentState = null;
    }

    // Save a new state
    saveState(state) {
        // Don't save if the state is the same as current
        if (JSON.stringify(state) === JSON.stringify(this.currentState)) {
            return;
        }

        if (this.currentState) {
            this.undoStack.push(this.currentState);
            // Limit the stack size
            if (this.undoStack.length > this.maxHistory) {
                this.undoStack.shift();
            }
        }

        // Clear redo stack when new action is performed
        this.redoStack = [];
        this.currentState = JSON.parse(JSON.stringify(state));
    }

    // Undo the last action
    undo() {
        if (this.undoStack.length === 0) return null;

        const previousState = this.undoStack.pop();
        if (this.currentState) {
            this.redoStack.push(this.currentState);
        }
        this.currentState = previousState;
        return JSON.parse(JSON.stringify(previousState));
    }

    // Redo the last undone action
    redo() {
        if (this.redoStack.length === 0) return null;

        const nextState = this.redoStack.pop();
        if (this.currentState) {
            this.undoStack.push(this.currentState);
        }
        this.currentState = nextState;
        return JSON.parse(JSON.stringify(nextState));
    }

    // Check if undo is available
    canUndo() {
        return this.undoStack.length > 0;
    }

    // Check if redo is available
    canRedo() {
        return this.redoStack.length > 0;
    }

    // Clear all history
    clear() {
        this.undoStack = [];
        this.redoStack = [];
        this.currentState = null;
    }

    // Get current state
    getCurrentState() {
        return this.currentState ? JSON.parse(JSON.stringify(this.currentState)) : null;
    }

    // Create a snapshot of the current undo/redo state
    getSnapshot() {
        return {
            undoStack: JSON.parse(JSON.stringify(this.undoStack)),
            redoStack: JSON.parse(JSON.stringify(this.redoStack)),
            currentState: this.currentState ? JSON.parse(JSON.stringify(this.currentState)) : null
        };
    }

    // Restore from a snapshot
    restoreFromSnapshot(snapshot) {
        this.undoStack = JSON.parse(JSON.stringify(snapshot.undoStack));
        this.redoStack = JSON.parse(JSON.stringify(snapshot.redoStack));
        this.currentState = snapshot.currentState ? JSON.parse(JSON.stringify(snapshot.currentState)) : null;
    }
}

// Hook to use UndoManager in React components
const useUndoManager = (initialState = null) => {
    const [undoManager] = React.useState(() => new UndoManager());
    const [, forceUpdate] = React.useReducer(x => x + 1, 0);

    React.useEffect(() => {
        if (initialState) {
            undoManager.saveState(initialState);
        }
    }, []);

    const saveState = React.useCallback((state) => {
        undoManager.saveState(state);
        forceUpdate();
    }, []);

    const undo = React.useCallback(() => {
        const previousState = undoManager.undo();
        forceUpdate();
        return previousState;
    }, []);

    const redo = React.useCallback(() => {
        const nextState = undoManager.redo();
        forceUpdate();
        return nextState;
    }, []);

    return {
        saveState,
        undo,
        redo,
        canUndo: undoManager.canUndo(),
        canRedo: undoManager.canRedo(),
        currentState: undoManager.getCurrentState()
    };
};

export { UndoManager, useUndoManager };