class EventManager {
    constructor() {
        this.events = new Map();
        this.triggers = new Map();
        this.eventQueue = [];
        this.isProcessing = false;
    }

    // Register an event handler
    on(eventName, handler, priority = 0) {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }

        const handlers = this.events.get(eventName);
        handlers.push({ handler, priority });
        handlers.sort((a, b) => b.priority - a.priority);

        return () => this.off(eventName, handler);
    }

    // Remove an event handler
    off(eventName, handler) {
        if (!this.events.has(eventName)) return;

        const handlers = this.events.get(eventName);
        const index = handlers.findIndex(h => h.handler === handler);
        if (index !== -1) {
            handlers.splice(index, 1);
        }
    }

    // Emit an event
    async emit(eventName, data = {}) {
        if (!this.events.has(eventName)) return;

        const handlers = this.events.get(eventName);
        const results = [];

        for (const { handler } of handlers) {
            try {
                const result = await handler(data);
                results.push(result);
            } catch (error) {
                console.error(`Error in event handler for ${eventName}:`, error);
            }
        }

        return results;
    }

    // Register a trigger condition
    registerTrigger(triggerName, condition, action, priority = 0) {
        if (!this.triggers.has(triggerName)) {
            this.triggers.set(triggerName, []);
        }

        const triggers = this.triggers.get(triggerName);
        triggers.push({ condition, action, priority });
        triggers.sort((a, b) => b.priority - a.priority);

        return () => this.removeTrigger(triggerName, condition, action);
    }

    // Remove a trigger
    removeTrigger(triggerName, condition, action) {
        if (!this.triggers.has(triggerName)) return;

        const triggers = this.triggers.get(triggerName);
        const index = triggers.findIndex(t => 
            t.condition === condition && t.action === action
        );
        
        if (index !== -1) {
            triggers.splice(index, 1);
        }
    }

    // Check triggers
    async checkTriggers(triggerName, context) {
        if (!this.triggers.has(triggerName)) return;

        const triggers = this.triggers.get(triggerName);
        const activatedTriggers = [];

        for (const trigger of triggers) {
            try {
                if (await trigger.condition(context)) {
                    activatedTriggers.push(trigger.action(context));
                }
            } catch (error) {
                console.error(`Error in trigger ${triggerName}:`, error);
            }
        }

        return Promise.all(activatedTriggers);
    }

    // Queue an event for later processing
    queueEvent(eventName, data) {
        this.eventQueue.push({ eventName, data });
        this.processEventQueue();
    }

    // Process queued events
    async processEventQueue() {
        if (this.isProcessing || this.eventQueue.length === 0) return;

        this.isProcessing = true;

        while (this.eventQueue.length > 0) {
            const { eventName, data } = this.eventQueue.shift();
            await this.emit(eventName, data);
        }

        this.isProcessing = false;
    }

    // Clear all events and triggers
    clear() {
        this.events.clear();
        this.triggers.clear();
        this.eventQueue = [];
        this.isProcessing = false;
    }
}

// React hook for using EventManager
const useEventManager = () => {
    const [eventManager] = React.useState(() => new EventManager());

    const addEventListener = React.useCallback((eventName, handler, priority) => {
        return eventManager.on(eventName, handler, priority);
    }, [eventManager]);

    const removeEventListener = React.useCallback((eventName, handler) => {
        eventManager.off(eventName, handler);
    }, [eventManager]);

    const emitEvent = React.useCallback((eventName, data) => {
        return eventManager.emit(eventName, data);
    }, [eventManager]);

    const addTrigger = React.useCallback((triggerName, condition, action, priority) => {
        return eventManager.registerTrigger(triggerName, condition, action, priority);
    }, [eventManager]);

    React.useEffect(() => {
        return () => {
            eventManager.clear();
        };
    }, [eventManager]);

    return {
        addEventListener,
        removeEventListener,
        emitEvent,
        addTrigger,
        queueEvent: eventManager.queueEvent.bind(eventManager),
        checkTriggers: eventManager.checkTriggers.bind(eventManager)
    };
};

// Common game events
const GameEvents = {
    CHARACTER_MOVED: 'characterMoved',
    RULE_ADDED: 'ruleAdded',
    RULE_REMOVED: 'ruleRemoved',
    SIMULATION_STARTED: 'simulationStarted',
    SIMULATION_STOPPED: 'simulationStopped',
    CHARACTER_CREATED: 'characterCreated',
    CHARACTER_DELETED: 'characterDeleted',
    COLLISION: 'collision',
    SCENE_CHANGED: 'sceneChanged',
    STATE_CHANGED: 'stateChanged',
    GAME_SAVED: 'gameSaved',
    GAME_LOADED: 'gameLoaded'
};

export { EventManager, useEventManager, GameEvents };