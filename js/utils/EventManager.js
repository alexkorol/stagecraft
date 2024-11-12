import { TRIGGERS } from '../constants';

class EventManager {
    constructor() {
        this.listeners = new Map();
        this.keyStates = new Set();
        this.mousePosition = { x: -1, y: -1 };
        this.clickedPosition = null;
        this.lastTick = performance.now();
        this.tickInterval = 1000; // Default 1 second tick interval
    }

    // Event registration
    on(eventType, callback) {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, new Set());
        }
        this.listeners.get(eventType).add(callback);
        return () => this.off(eventType, callback);
    }

    off(eventType, callback) {
        if (this.listeners.has(eventType)) {
            this.listeners.get(eventType).delete(callback);
        }
    }

    // Event emission
    emit(eventType, data) {
        if (this.listeners.has(eventType)) {
            this.listeners.get(eventType).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${eventType}:`, error);
                }
            });
        }
    }

    // Input handling
    handleKeyDown(event) {
        this.keyStates.add(event.key.toLowerCase());
        this.emit('keyDown', event.key.toLowerCase());
    }

    handleKeyUp(event) {
        this.keyStates.delete(event.key.toLowerCase());
        this.emit('keyUp', event.key.toLowerCase());
    }

    handleMouseMove(x, y) {
        this.mousePosition = { x, y };
        this.emit('mouseMove', { x, y });
    }

    handleClick(x, y) {
        this.clickedPosition = { x, y };
        this.emit('click', { x, y });
        // Reset click after processing
        setTimeout(() => {
            this.clickedPosition = null;
        }, 0);
    }

    // Rule trigger checking
    checkTrigger(rule, character, timestamp) {
        switch (rule.trigger) {
            case TRIGGERS.ALWAYS:
                return true;

            case TRIGGERS.KEY_PRESS:
                return this.keyStates.has(rule.triggerKey.toLowerCase());

            case TRIGGERS.COLLISION:
                // Collision checking should be handled by CollisionManager
                return false;

            case TRIGGERS.PROXIMITY:
                // Proximity checking should be handled by CollisionManager
                return false;

            case TRIGGERS.TIMER:
                if (timestamp - this.lastTick >= this.tickInterval) {
                    this.lastTick = timestamp;
                    return true;
                }
                return false;

            case TRIGGERS.CLICK:
                if (!this.clickedPosition) return false;
                return (
                    this.clickedPosition.x === character.x && 
                    this.clickedPosition.y === character.y
                );

            default:
                return false;
        }
    }

    // Utility methods
    isKeyPressed(key) {
        return this.keyStates.has(key.toLowerCase());
    }

    getMousePosition() {
        return this.mousePosition;
    }

    setTickInterval(interval) {
        this.tickInterval = Math.max(100, Math.min(5000, interval));
    }

    // Clean up
    reset() {
        this.keyStates.clear();
        this.mousePosition = { x: -1, y: -1 };
        this.clickedPosition = null;
        this.lastTick = performance.now();
    }

    destroy() {
        this.listeners.clear();
        this.reset();
    }
}

// Create a singleton instance
const eventManager = new EventManager();

// Set up global event listeners
if (typeof window !== 'undefined') {
    window.addEventListener('keydown', (e) => eventManager.handleKeyDown(e));
    window.addEventListener('keyup', (e) => eventManager.handleKeyUp(e));
}

export default eventManager;
