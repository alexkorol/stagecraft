import { TRIGGERS, DIRECTIONS } from '../constants';

class SimulationEngine {
    constructor() {
        this.characters = new Map();
        this.rules = new Map();
        this.gridSize = { width: 8, height: 8 };
        this.isRunning = false;
        this.speed = 1000; // milliseconds between updates
        this.keyStates = new Set();
        this.lastUpdate = 0;
    }

    setGridSize(width, height) {
        this.gridSize = { width, height };
    }

    addCharacter(character) {
        this.characters.set(character.id, character);
    }

    removeCharacter(characterId) {
        this.characters.delete(characterId);
        this.rules.delete(characterId);
    }

    addRule(characterId, rule) {
        if (!this.rules.has(characterId)) {
            this.rules.set(characterId, []);
        }
        this.rules.get(characterId).push(rule);
    }

    removeRule(characterId, ruleId) {
        const rules = this.rules.get(characterId);
        if (rules) {
            this.rules.set(characterId, rules.filter(r => r.id !== ruleId));
        }
    }

    handleKeyDown(key) {
        this.keyStates.add(key);
    }

    handleKeyUp(key) {
        this.keyStates.delete(key);
    }

    checkCollision(char1, char2) {
        return char1.x === char2.x && char1.y === char2.y;
    }

    checkProximity(char1, char2, distance) {
        const dx = Math.abs(char1.x - char2.x);
        const dy = Math.abs(char1.y - char2.y);
        return Math.max(dx, dy) <= distance;
    }

    matchesBeforeState(character, rule) {
        const centerX = 1;
        const centerY = 1;
        
        // Check each cell in the 3x3 grid around the character
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                if (x === centerX && y === centerY) continue; // Skip center cell (character position)
                
                const worldX = character.x + (x - centerX);
                const worldY = character.y + (y - centerY);
                
                // Check if position is within grid bounds
                if (worldX < 0 || worldX >= this.gridSize.width || 
                    worldY < 0 || worldY >= this.gridSize.height) {
                    if (rule.before[y][x] !== null) return false;
                    continue;
                }
                
                // Check if the cell matches the rule's before state
                const cellMatches = Array.from(this.characters.values()).some(c => 
                    c.x === worldX && c.y === worldY
                ) === (rule.before[y][x] !== null);
                
                if (!cellMatches) return false;
            }
        }
        
        return true;
    }

    applyRule(character, rule) {
        // Check trigger conditions
        switch (rule.trigger) {
            case TRIGGERS.KEY_PRESS:
                if (!this.keyStates.has(rule.triggerKey)) return false;
                break;
            case TRIGGERS.COLLISION:
                if (!Array.from(this.characters.values()).some(other => 
                    other !== character && this.checkCollision(character, other)
                )) return false;
                break;
            case TRIGGERS.PROXIMITY:
                if (!Array.from(this.characters.values()).some(other => 
                    other !== character && this.checkProximity(character, other, rule.proximity)
                )) return false;
                break;
        }

        // Check if the before state matches
        if (!this.matchesBeforeState(character, rule)) return false;

        // Apply the after state
        const centerX = 1;
        const centerY = 1;
        let newX = character.x;
        let newY = character.y;

        // Find character's new position in after state
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                if (rule.after[y][x] === character) {
                    newX = character.x + (x - centerX);
                    newY = character.y + (y - centerY);
                    break;
                }
            }
        }

        // Check if new position is within bounds
        if (newX >= 0 && newX < this.gridSize.width && 
            newY >= 0 && newY < this.gridSize.height) {
            character.x = newX;
            character.y = newY;
            return true;
        }

        return false;
    }

    update(timestamp) {
        if (!this.isRunning) return;

        // Check if enough time has passed since last update
        if (timestamp - this.lastUpdate < this.speed) return;
        this.lastUpdate = timestamp;

        // Process rules for each character
        for (const character of this.characters.values()) {
            const rules = this.rules.get(character.id) || [];
            for (const rule of rules) {
                if (this.applyRule(character, rule)) {
                    break; // Stop after first matching rule
                }
            }
        }
    }

    start() {
        this.isRunning = true;
        this.lastUpdate = performance.now();
    }

    stop() {
        this.isRunning = false;
    }

    setSpeed(speed) {
        this.speed = Math.max(100, Math.min(2000, speed));
    }

    reset() {
        // Reset all characters to their initial positions
        for (const character of this.characters.values()) {
            if (character.initialX !== undefined && character.initialY !== undefined) {
                character.x = character.initialX;
                character.y = character.initialY;
            }
        }
    }
}

export default SimulationEngine;
